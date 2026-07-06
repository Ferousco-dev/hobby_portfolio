// Telegram admin bot for the portfolio.
//
// Flow:
//   1. Admin messages the bot and sends the passkey (or /auth <passkey>).
//   2. The chat is stored in `admin_sessions` — only authorised chats can edit.
//   3. Admin sends a PHOTO with a caption to add a project. The photo is
//      uploaded to Supabase Storage and a row is inserted into `projects`,
//      so the live site shows it on next load.
//
// Deploy:  supabase functions deploy telegram-bot --no-verify-jwt
// Secrets: supabase secrets set TELEGRAM_BOT_TOKEN=... ADMIN_PASSKEY=30jul02
//          (optional) WEBHOOK_SECRET=...   (SUPABASE_URL / SERVICE_ROLE are auto)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const PASSKEY = Deno.env.get('ADMIN_PASSKEY')!
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') // optional
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') // optional
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.0-flash'
const IMAGE_BUCKET = 'project-images'
const FILE_BUCKET = 'project-files'
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
})

// ---------------------------------------------------------------- helpers
async function tgSend(chatId: number, text: string) {
  await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

async function isAuthorised(chatId: number): Promise<boolean> {
  const { data } = await admin
    .from('admin_sessions')
    .select('chat_id')
    .eq('chat_id', chatId)
    .maybeSingle()
  return Boolean(data)
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60)
}

// Resolve a Telegram file_id to its bytes + original path.
async function downloadTgFile(
  fileId: string,
): Promise<{ bytes: Uint8Array; filePath: string } | null> {
  const fileRes = await fetch(`${TG_API}/getFile?file_id=${fileId}`)
  const fileJson = await fileRes.json()
  const filePath = fileJson?.result?.file_path
  if (!filePath) return null
  const bytes = new Uint8Array(
    await (
      await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`)
    ).arrayBuffer(),
  )
  return { bytes, filePath }
}

// Best-effort scrape: fetch a URL and return readable text (tags stripped).
async function scrapeUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const html = await res.text()
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000)
  } catch {
    return ''
  }
}

// Ask Gemini to write a short, professional portfolio write-up for a project.
async function generateWriteup(project: {
  name: string
  category?: string
  tools?: string[]
  summary?: string
  link?: string | null
}): Promise<string | null> {
  if (!GEMINI_API_KEY) return null
  const scraped = project.link ? await scrapeUrl(project.link) : ''
  const prompt = [
    'You are writing copy for a data analyst portfolio website.',
    'Write a concise, confident 2–3 paragraph write-up (plain text, no headings,',
    'no markdown, first person is fine but keep it professional) describing the',
    'project below and the analytical skills it demonstrates. Do not invent',
    'specific numbers that are not provided.',
    '',
    `Project name: ${project.name}`,
    `Category: ${project.category ?? ''}`,
    `Tools: ${(project.tools ?? []).join(', ')}`,
    `Summary: ${project.summary ?? ''}`,
    scraped ? `Reference page content: ${scraped}` : '',
  ].join('\n')

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    )
    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    return typeof text === 'string' ? text.trim() : null
  } catch (err) {
    console.error('gemini error', err)
    return null
  }
}

// Parse a caption written as `Key: value` lines.
function parseCaption(caption: string) {
  const fields: Record<string, string> = {}
  for (const line of caption.split('\n')) {
    const m = line.match(/^\s*([A-Za-z ]+?)\s*:\s*(.+)\s*$/)
    if (m) fields[m[1].trim().toLowerCase()] = m[2].trim()
  }
  return fields
}

const HELP = [
  '<b>Portfolio admin bot</b>',
  '',
  '1️⃣ Send the passkey (or <code>/auth &lt;passkey&gt;</code>) to unlock.',
  '2️⃣ Send a <b>photo</b> with a caption like this to add a project:',
  '',
  '<code>Name: Sales Dashboard',
  'Category: Excel · Dashboard',
  'Tools: Excel, Pivot Tables, Slicers',
  'Summary: What the project does...',
  'Link: https://example.com',
  'Featured: yes</code>',
  '',
  '3️⃣ Send the workbook as a <b>file/document</b> with caption',
  '   <code>Slug: the-project-slug</code> to add a download button.',
  '',
  'Other commands:',
  '• <code>/list</code> — list projects + slugs',
  '• <code>/writeup &lt;slug&gt;</code> — (re)generate the AI write-up',
  '• <code>/delete &lt;slug&gt;</code> — remove a project',
  '• <code>/logout</code> — end this admin session',
].join('\n')

// ------------------------------------------------------------- add project
async function addProject(chatId: number, fileId: string, caption: string) {
  const fields = parseCaption(caption)
  const name = fields['name']
  if (!name) {
    await tgSend(chatId, '⚠️ Caption needs at least a <code>Name:</code> line. Send /help for the format.')
    return
  }

  // 1. resolve + download the Telegram photo
  const dl = await downloadTgFile(fileId)
  if (!dl) {
    await tgSend(chatId, '⚠️ Could not fetch the image from Telegram. Try again.')
    return
  }

  // 2. upload to storage
  const slug = fields['slug'] ? slugify(fields['slug']) : slugify(name)
  const ext = (dl.filePath.split('.').pop() || 'jpg').toLowerCase()
  const objectPath = `projects/${slug}-${Date.now()}.${ext}`
  const { error: upErr } = await admin.storage
    .from(IMAGE_BUCKET)
    .upload(objectPath, dl.bytes, {
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      upsert: true,
    })
  if (upErr) {
    await tgSend(chatId, `⚠️ Image upload failed: ${upErr.message}`)
    return
  }
  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${objectPath}`

  // 3. insert the project row
  const { count } = await admin
    .from('projects')
    .select('*', { count: 'exact', head: true })
  const nextOrder = (count ?? 0) + 1
  const tools = (fields['tools'] || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const featured = /^(yes|true|1)$/i.test(fields['featured'] || '')
  const category = fields['category'] || 'Project'
  const summary = fields['summary'] || ''

  const { error: insErr } = await admin.from('projects').upsert(
    {
      slug,
      number: fields['number'] || String(nextOrder).padStart(2, '0'),
      category,
      name,
      summary,
      image_url: imageUrl,
      tools,
      link: fields['link'] || null,
      featured,
      sort_order: fields['order'] ? Number(fields['order']) : nextOrder,
    },
    { onConflict: 'slug' },
  )
  if (insErr) {
    await tgSend(chatId, `⚠️ Saving the project failed: ${insErr.message}`)
    return
  }

  await tgSend(
    chatId,
    `✅ Saved <b>${name}</b> (<code>${slug}</code>)${featured ? ' — featured' : ''}.` +
      (GEMINI_API_KEY ? '\n✍️ Generating an AI write-up…' : '') +
      '\nSend the workbook as a file with caption <code>Slug: ' +
      slug +
      '</code> to attach a download.',
  )

  // 4. best-effort Gemini write-up saved back to the row
  if (GEMINI_API_KEY) {
    const writeup = await generateWriteup({
      name,
      category,
      tools,
      summary,
      link: fields['link'] || null,
    })
    if (writeup) {
      await admin.from('projects').update({ writeup }).eq('slug', slug)
      await tgSend(chatId, `✍️ Write-up saved for <b>${name}</b>.`)
    }
  }
}

// Attach a downloadable source file (Excel / Power BI) to an existing project.
async function attachFile(
  chatId: number,
  fileId: string,
  fileName: string,
  caption: string,
) {
  const fields = parseCaption(caption)
  const slug = fields['slug']
    ? slugify(fields['slug'])
    : fields['name']
      ? slugify(fields['name'])
      : ''
  if (!slug) {
    await tgSend(chatId, '⚠️ Add a caption <code>Slug: your-project-slug</code> so I know which project this file belongs to. Use /list to see slugs.')
    return
  }

  const dl = await downloadTgFile(fileId)
  if (!dl) {
    await tgSend(chatId, '⚠️ Could not fetch the file from Telegram. Try again.')
    return
  }
  const ext = (fileName.split('.').pop() || 'bin').toLowerCase()
  const objectPath = `files/${slug}-${Date.now()}.${ext}`
  const { error: upErr } = await admin.storage
    .from(FILE_BUCKET)
    .upload(objectPath, dl.bytes, { upsert: true })
  if (upErr) {
    await tgSend(chatId, `⚠️ File upload failed: ${upErr.message}`)
    return
  }
  const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/${FILE_BUCKET}/${objectPath}`

  const { error, count } = await admin
    .from('projects')
    .update({ file_url: fileUrl }, { count: 'exact' })
    .eq('slug', slug)
  if (error) {
    await tgSend(chatId, `⚠️ Saving the file link failed: ${error.message}`)
    return
  }
  if (!count) {
    await tgSend(chatId, `⚠️ No project with slug <code>${slug}</code>. Add the project first (photo + caption), then send the file.`)
    return
  }
  await tgSend(chatId, `📎 Attached download to <b>${slug}</b>. It shows on the project page.`)
}

// ----------------------------------------------------------------- router
async function handleUpdate(update: any) {
  const message = update.message ?? update.edited_message
  if (!message) return
  const chatId: number = message.chat.id
  const text: string = (message.caption ?? message.text ?? '').trim()

  // --- auth: bare passkey or /auth <passkey> ---
  const authMatch = text.match(/^\/auth\s+(.+)$/i)
  const candidate = authMatch ? authMatch[1].trim() : text
  if (!message.photo && candidate === PASSKEY) {
    await admin.from('admin_sessions').upsert({ chat_id: chatId })
    await tgSend(chatId, '🔓 Unlocked. You can now add projects. Send /help for the format.')
    return
  }

  if (/^\/(start|help)/i.test(text)) {
    await tgSend(chatId, HELP)
    return
  }

  // --- everything below requires authorisation ---
  if (!(await isAuthorised(chatId))) {
    await tgSend(chatId, '🔒 Send the passkey first to unlock admin actions.')
    return
  }

  if (/^\/logout/i.test(text)) {
    await admin.from('admin_sessions').delete().eq('chat_id', chatId)
    await tgSend(chatId, '👋 Logged out.')
    return
  }

  if (/^\/list/i.test(text)) {
    const { data } = await admin
      .from('projects')
      .select('slug, name, featured')
      .order('sort_order', { ascending: true })
    const lines = (data ?? []).map(
      (p: any) => `• <code>${p.slug}</code> — ${p.name}${p.featured ? ' ⭐' : ''}`,
    )
    await tgSend(chatId, lines.length ? lines.join('\n') : 'No projects yet.')
    return
  }

  const del = text.match(/^\/delete\s+(.+)$/i)
  if (del) {
    const slug = slugify(del[1])
    await admin.from('projects').delete().eq('slug', slug)
    await tgSend(chatId, `🗑️ Deleted <code>${slug}</code> (if it existed).`)
    return
  }

  const wu = text.match(/^\/writeup\s+(.+)$/i)
  if (wu) {
    if (!GEMINI_API_KEY) {
      await tgSend(chatId, '⚠️ Gemini isn’t configured. Set GEMINI_API_KEY to enable write-ups.')
      return
    }
    const slug = slugify(wu[1])
    const { data } = await admin
      .from('projects')
      .select('name, category, tools, summary, link')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) {
      await tgSend(chatId, `⚠️ No project with slug <code>${slug}</code>.`)
      return
    }
    await tgSend(chatId, '✍️ Generating…')
    const writeup = await generateWriteup(data as any)
    if (writeup) {
      await admin.from('projects').update({ writeup }).eq('slug', slug)
      await tgSend(chatId, `✍️ Write-up updated for <code>${slug}</code>.`)
    } else {
      await tgSend(chatId, '⚠️ Could not generate a write-up.')
    }
    return
  }

  // --- photo upload = add/update a project ---
  if (message.photo && message.photo.length) {
    if (!message.caption) {
      await tgSend(chatId, '⚠️ Add a caption with the project details. Send /help for the format.')
      return
    }
    const largest = message.photo[message.photo.length - 1]
    await addProject(chatId, largest.file_id, message.caption)
    return
  }

  // --- document upload = attach a downloadable project file ---
  if (message.document) {
    await attachFile(
      chatId,
      message.document.file_id,
      message.document.file_name || 'file.bin',
      message.caption || '',
    )
    return
  }

  await tgSend(chatId, 'Send a photo with a caption to add a project, a file to attach a download, or /help.')
}

// ------------------------------------------------------------- entrypoint
Deno.serve(async (req) => {
  if (req.method === 'GET') {
    // One-time webhook registration: GET ...?setup=<ADMIN_PASSKEY>
    // Uses the bot's own TELEGRAM_BOT_TOKEN secret so the token never leaves
    // the server. Points Telegram at this function's public URL.
    const url = new URL(req.url)
    if (url.searchParams.get('setup') === PASSKEY) {
      const webhookUrl = `${SUPABASE_URL}/functions/v1/telegram-bot`
      const body: Record<string, unknown> = {
        url: webhookUrl,
        allowed_updates: ['message', 'edited_message'],
      }
      if (WEBHOOK_SECRET) body.secret_token = WEBHOOK_SECRET
      const res = await fetch(`${TG_API}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return new Response(await res.text(), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response('ok')
  }
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 })

  if (
    WEBHOOK_SECRET &&
    req.headers.get('x-telegram-bot-api-secret-token') !== WEBHOOK_SECRET
  ) {
    return new Response('unauthorized', { status: 401 })
  }

  try {
    const update = await req.json()
    await handleUpdate(update)
  } catch (err) {
    console.error('handler error', err)
  }
  // Always 200 so Telegram doesn't retry-storm on a handled error.
  return new Response('ok')
})
