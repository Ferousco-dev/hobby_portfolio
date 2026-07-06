# Backend setup — Supabase + Telegram admin bot

The site reads projects from Supabase at runtime and falls back to the built-in
list if Supabase isn't configured. You upload new projects from **Telegram**:
your bot receives a photo + caption, stores the image in Supabase Storage, and
inserts a row — the site shows it on the next page load. A **passkey** gate
(`30jul02`) stops anyone else who finds the bot from editing your data.

```
Telegram (you)  ──photo+caption──►  Edge Function  ──►  Supabase DB + Storage  ──►  Site
                     passkey gate
```

---

## 1. Create the Supabase project
1. Go to https://supabase.com → **New project**. Pick a name + region, save the
   database password.
2. Open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → used by the bot (keep secret, never in the frontend)

## 2. Create the tables + storage
Open **SQL Editor** in the dashboard and run, in order:
- `supabase/migrations/0001_init.sql`
- `supabase/migrations/0002_seed.sql`
- `supabase/migrations/0003_files_and_writeup.sql`

(Or, with the CLI linked: `supabase db push` — see the CLI section below.)

This creates the `projects` and `admin_sessions` tables, the `project-images`
and `project-files` storage buckets, and the `file_url` / `writeup` columns.

## 2b. Connect the CLI (lets the tables be created for you)
Run these in **your terminal** once — after this, `supabase db push` (and I) can
create/update every table and bucket from the migration files.

```bash
npm install -g supabase          # or: brew install supabase/tap/supabase

supabase login                   # opens the browser, stores a local token
supabase link --project-ref YOUR-PROJECT-REF   # ref is in your project URL / Settings → General
supabase db push                 # applies everything in supabase/migrations/
```

`YOUR-PROJECT-REF` is the sub-domain of your project URL
(`https://<ref>.supabase.co`). `db push` will ask for your database password
the first time (the one you set when creating the project).

> Want me to run `supabase link` + `db push` for you? Just run `supabase login`
> in your terminal first (so the CLI has a session), then tell me your
> project-ref and I'll apply all the migrations from here. Don't paste your
> service-role key or DB password into the chat.

## 3. Point the site at Supabase
Create a `.env` file in the project root (copy `.env.example`):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

- Local: `npm run dev`.
- Hosted (Netlify/Vercel): add these two as environment variables and redeploy.

The site now reads from Supabase. New projects appear on refresh — no rebuild
needed, because the browser fetches them at runtime.

---

## 4. Create the Telegram bot
1. In Telegram, message **@BotFather** → `/newbot` → follow prompts.
2. Copy the **bot token** it gives you (looks like `123456:ABC-DEF...`).

## 5. Deploy the bot (Edge Function)
Install the CLI (`npm i -g supabase`) then, from the project root:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF

# secrets the function needs (service role + url are provided automatically)
supabase secrets set TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
supabase secrets set ADMIN_PASSKEY="30jul02"
# Gemini — enables the auto-generated project write-ups (optional)
supabase secrets set GEMINI_API_KEY="your-gemini-api-key"   # aistudio.google.com/apikey
# optional hardening — a random string; also pass it to setWebhook below
supabase secrets set WEBHOOK_SECRET="$(openssl rand -hex 16)"

supabase functions deploy telegram-bot --no-verify-jwt
```

The function URL is:
`https://YOUR-PROJECT-REF.functions.supabase.co/telegram-bot`

## 6. Connect Telegram to the function (webhook)
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d "url=https://YOUR-PROJECT-REF.functions.supabase.co/telegram-bot" \
  -d "secret_token=<the WEBHOOK_SECRET you set, or omit if you skipped it>"
```

---

## 7. Use it
In Telegram, open your bot and:

1. Send the passkey: `30jul02`  (or `/auth 30jul02`) → **🔓 Unlocked**.
2. Send a **photo** with a caption:

```
Name: Customer Churn Dashboard
Category: Power BI · Report
Tools: Power BI, DAX, Power Query
Summary: Analysed churn drivers across regions and plans...
Link: https://app.powerbi.com/...
Featured: yes
```

The bot uploads the image, saves the project, and (if `GEMINI_API_KEY` is set)
generates an AI write-up saved to the DB. Refresh the site.

3. To add a **downloadable file** (the .xlsx / .pbix), send it as a **file /
   document** with the caption `Slug: excel-sales-dashboard`. A **Download
   project** button then appears on that project's page.

To re-add your existing 3 featured projects with real images, just send each
photo with `Featured: yes` and the matching `Slug:` — the row is updated in
place (same slug), so the placeholder image is replaced.

Other commands: `/list`, `/writeup <slug>`, `/delete <slug>`, `/logout`, `/help`.

### Notes
- **Passkey** `30jul02` lives only as a Supabase secret (`ADMIN_PASSKEY`), never
  in the repo. It's a light gate — anyone who learns it can edit, so treat it
  like a password and change it with `supabase secrets set ADMIN_PASSKEY=...`.
- `Featured: yes` puts a project among the 3 cards on the home page; everything
  shows on the **All Projects** page.
- Images live in the public `project-images` bucket; the DB stores their URLs.
