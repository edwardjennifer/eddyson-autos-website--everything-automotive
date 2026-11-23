# Customer account setup

1. In `supabase.js`, replace `https://YOUR-PROJECT-REF.supabase.co` with the project URL shown in **Supabase Dashboard → Settings → API**. The generic `https://supabase.co` host is not a project URL.
2. Set `SUPABASE_PUBLISHABLE_KEY` in the same file to the project's publishable key. This browser-side key is intended for public use; never put a service-role key or a user's password in the site.
3. Run `profiles.sql` in the Supabase SQL Editor. It creates the customer profile table, a sign-up trigger, and row-level security policies that restrict profile access to the profile owner.
4. Configure the Supabase Auth site's **Site URL** and allowed redirect URLs for the deployed site. The sign-up flow requests email confirmation when that setting is enabled.
5. Serve the static site over HTTP/HTTPS (for example with any static file server). Browser ES modules do not load reliably from a `file://` URL.

The customer account page is `auth.html`. The existing HTML pages load the shared `supabase.js` module to show the signed-in customer's name and a sign-out control.

## Admin dashboard

1. Configure the project URL and publishable key in `supabase.js`. `https://supabase.co` is a generic host, not a project URL; use the project-specific URL from **Settings → API**.
2. Create or invite only `hyellaudaedward@gmail.com` and `eddygsk2018@gmail.com` as administrator users in Supabase Auth. `admin.html` does not provide sign-up, checks this allowlist before showing data, and signs out other accounts. Keep email confirmation enabled.
3. Confirm that `public.profiles`, `public.cars`, and `public.inquiries` exist, then run `admin-access.sql` in the Supabase SQL Editor. It restricts reads for cars and inquiries to the two admin emails, while profiles remain readable by their owner and both admins. Review any existing `cars` or `inquiries` database workflows first: enabling RLS will block operations that do not have a matching policy.
4. Open `admin.html` over HTTP/HTTPS. It uses read-only queries and displays exact row counts, a Chart.js totals chart, and up to 100 recent records per table. RLS must remain enabled; the page's email check is not a substitute for database policies.
