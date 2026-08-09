# Flavour board — setup

The staff page at **`/admin.html`** lets anyone at the shop mark a flavour as
**In stock**, **Getting low**, or **Out of stock**. The website picks the change
up within seconds — no redeploy, no code.

**This is already built and running.** There is nothing to set up. The rest of
this file is here so you know what exists and how to look after it.

---

## What's running

A free **Supabase** project called `ice-hut`, in the `ca-central-1` region
(Canada — the closest region to Alberta).

| | |
|---|---|
| Project URL | `https://svyxxcsjvchpqzgijvmw.supabase.co` |
| Table | `public.flavour_status` |
| Staff login | `staff@morinvilleicehut.ca` |
| Dashboard | <https://supabase.com/dashboard/project/svyxxcsjvchpqzgijvmw> |

### How the data is shaped

The table holds **one row per flavour that is *not* in stock**. A flavour with
no row is available.

That's deliberate: at the start of a season the table is empty and everything
reads as in stock, so there's nothing to seed. "Reset everything to In stock"
is just deleting the rows.

Flavour *names* are not in the database. They live in `flavours.html` and are
mirrored into `flavours-data.json`, so the website stays the single source of
truth for what a flavour is called.

### What protects it

Row-level security on the table:

- **Anyone** may read the board — that's how the public site shows badges.
- **Only a signed-in staff account** may insert, update, or delete.

A `security definer` trigger stamps `updated_at` and `updated_by` from
`auth.uid()` on every write, so the browser can't fake who made a change or when.

> The publishable key in `supabase-config.js` is **meant to be public** — it
> identifies the project, it doesn't grant access. The RLS policies above are
> what decide who can change the board. Never put the **service_role** key in
> this repo; that one bypasses RLS entirely.

---

## Day-to-day use

- Bookmark `/admin.html` on the shop phone or tablet — it's built for a phone.
- Sign in once; the session is remembered, so staff won't be asked again each shift.
- Everything starts as **In stock**. Only tap the exceptions.
- **Getting low** shows visitors an amber "Almost out" tag; the flavour still
  reads as available.
- **Out of stock** greys the flavour out, marks it "Out of stock", and keeps it
  from being picked as Flavour of the Week.
- **Reset everything to "In stock"** at the bottom clears the board — handy when
  a fresh delivery lands.
- Two people can use it at once without overwriting each other.

## Changing the staff password

Supabase dashboard → **Authentication** → **Users** → the ⋮ menu next to
`staff@morinvilleicehut.ca` → **Reset password**.

Worth doing at the end of each season, since the password gets handed around.

## Adding another login

Same screen → **Add user** → tick *Auto Confirm User*. Any confirmed user can
change the board; there are no roles to configure.

## If the database is ever unreachable

The site falls back to showing every flavour as normal, exactly as it looked
before this feature existed. Visitors never see an error or a broken layout.
This is deliberate — the board failing should never take the menu down with it.

---

## The winter problem, and how it's handled

Supabase pauses a free project after about **7 days with no activity**. The Ice
Hut is closed October through April, so left alone the board would sleep every
winter and need waking by hand each spring.

`.github/workflows/supabase-keepalive.yml` runs every Monday and reads a single
row, which is enough to keep the project awake year-round. It costs nothing and
needs no attention.

If the board ever *does* come back sleeping (say the repo sat untouched for
months), open the dashboard link above and hit **Restore** — no data is lost.

---

## Adding or renaming a flavour later

Flavour names and descriptions live in `flavours.html` — that stays the source of
truth. After editing it, run:

```bash
python3 scripts/build-flavour-data.py
```

That assigns any new flavour its internal id and refreshes `flavours-data.json`,
which is the list the staff page shows. Commit both files.

Renaming a flavour gives it a new id, so it starts fresh at "In stock" — worth
knowing if you rename one that's currently marked out.

---

## Verifying it still works

`.github/workflows/verify-flavour-board.yml` can be run manually from the Actions
tab. It checks the whole path end to end: an anonymous read succeeds, an
anonymous **write is refused**, staff sign-in works, a staff write lands and is
publicly visible, and a staff delete removes it again.

The sign-in steps only run if a repository secret named `ICEHUT_STAFF_PW` is set;
without it those steps are skipped and the read/refuse checks still run.
