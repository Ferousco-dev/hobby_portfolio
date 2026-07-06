-- Add a downloadable source file (the .xlsx / .pbix) and a Gemini-generated
-- long-form write-up to each project, plus a public bucket for the files.

alter table public.projects add column if not exists file_url text;
alter table public.projects add column if not exists writeup  text;

-- Public bucket for downloadable project files (Excel / Power BI workbooks).
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

drop policy if exists "project files are publicly readable" on storage.objects;
create policy "project files are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-files');
