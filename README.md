# Pixie Dream Destinations — GitHub Pages Starter

This repo is a plug-and-play static site for **pixiedreamdestinations.com** with a lead form that saves submissions to a **Supabase** database.

## 0) Fill in content
- Open `index.html` and replace `{{ADVISOR_NAME}}` and `{{ABOUT_TEXT}}`.
- Drop your images into `/assets` (replace `hero.jpg`, optionally `logo.png` and `og-image.jpg`).

## 1) Publish with GitHub Pages
1. Create a new repo (e.g., `pixie-site`) and upload these files.
2. In GitHub: **Settings → Pages → Source: Deploy from a branch**; choose `main` and `/ (root)`. Save.
3. Wait for the green check and visit the Pages URL. (Docs: GitHub Pages publishing source.)

## 2) Connect your domain
1. In **Settings → Pages → Custom domain**, enter `www.pixiedreamdestinations.com`. Save and enable **Enforce HTTPS**.
2. At your DNS provider, add:
   - **CNAME** for `www` → `YOUR_GITHUB_USERNAME.github.io`
   - **A** records for apex `pixiedreamdestinations.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. (Optional) Keep a `CNAME` file in the repo with `www.pixiedreamdestinations.com` to persist the mapping.

## 3) Supabase: create the leads table
- Create a project at https://supabase.com/
- In **Table Editor** create table `public.leads` with columns:
  - `id` uuid primary key default `gen_random_uuid()`
  - `created_at` timestamp with time zone default `now()`
  - `full_name` text not null
  - `email` text not null
  - `phone` text
  - `preferred_contact` text
  - `trip_start` date
  - `trip_end` date
  - `travelers` integer
  - `budget_range` text
  - `destinations` text
  - `message` text
  - `newsletter` boolean default false
  - `source` text
  - `user_agent` text

### Enable RLS and add a safe insert-only policy
- Ensure **Row Level Security (RLS)** is ON for `public.leads`.
- Add policy (SQL editor):
```sql
create policy "allow inserts from anon"
on public.leads
for insert
to anon
with check (true);
```
- Do **not** create any `select/update/delete` policies for `anon`.

## 4) Wire up the form
- In `/js/submit.js`, set:
  - `SUPABASE_URL = "https://<your-project-ref>.supabase.co"`
  - `SUPABASE_ANON_KEY = "<your anon key>"` (Settings → API)
- Commit & push. Submit the form to test; check Supabase `leads` table for rows.

## 5) Optional automations
- In Supabase, add a **Trigger** to email you on new lead (or connect Zapier/Make to a Supabase Webhook).

## 6) Analytics (optional)
- Add Plausible/Umami/GA4 snippet to `index.html` before `</head>`.

## Notes
- The anon key is safe to expose *only* with strict RLS. Keep the site insert-only from the browser.
- The form uses a honeypot field to reduce spam. Consider reCAPTCHA/hCaptcha later with a serverless function.
