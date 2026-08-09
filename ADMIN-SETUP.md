# Flavour board — setup

The staff page at **`/admin.html`** lets anyone at the shop mark a flavour as
**In stock**, **Getting low**, or **Out of stock**. The website picks the change
up within seconds — no redeploy, no code.

Everything is written and tested. What's left is the Firebase project itself.

**Two ways to do it:**

- **Fast path (recommended):** if you have the Firebase MCP server wired into
  Claude Code, most of this is automated — see
  [Fast path: let Claude do it](#fast-path-let-claude-do-it) at the bottom.
  Console time drops to about 2 minutes (enabling password login and adding the
  two users, which have no API).
- **Manual path:** follow Steps 1-6 below, about 10 minutes of clicking.

---

## Why Firebase

The site is plain static files on GitHub Pages, so there's no server to store
anything. Firebase gives us a tiny database plus real password login on its free
Spark plan — no credit card, and nothing here comes close to the free limits
(50,000 reads/day; a busy summer day for this site is a few hundred).

It also doesn't sleep. That matters because the shop is seasonal — a database
that pauses over the winter would need waking up every spring.

---

## Step 1 — Create the Firebase project

1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. **Add project** → name it `icehut` → **Continue**.
3. Turn **Google Analytics off** (not needed) → **Create project**.

## Step 2 — Turn on password login

1. Left sidebar → **Build → Authentication** → **Get started**.
2. Choose **Email/Password**, toggle **Enable** on, → **Save**.
   (Leave "Email link / passwordless" off.)

## Step 3 — Create the two logins

Still in **Authentication** → **Users** tab → **Add user**, twice:

| Purpose | Suggested email | Password |
|---|---|---|
| Owner | `dawn@morinvilleicehut.ca` | pick a strong one, keep it to yourself |
| Shared staff | `staff@morinvilleicehut.ca` | pick one you're happy to hand out |

The emails don't have to receive mail — they're just usernames. Both accounts can
change the board; the split exists so you can change the shared staff password
(Users → ⋮ → **Reset password**) at end of season without disturbing your own login.

## Step 4 — Create the database

1. Left sidebar → **Build → Firestore Database** → **Create database**.
2. Pick location **`northamerica-northeast1`** (Montreal — closest to Alberta of
   the Canadian options; this cannot be changed later).
3. Choose **Start in production mode** → **Create**.

Then open the **Rules** tab, replace everything with the following, and click
**Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // The flavour board: the website reads it, signed-in staff change it.
    match /board/flavours {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Nothing else in this project is readable or writable.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

These rules are what actually protect the data — that's why the keys in the next
step are safe to publish.

## Step 5 — Copy your keys into the site

1. Click the ⚙️ gear next to **Project Overview** → **Project settings**.
2. Scroll to **Your apps** → click the **web** icon `</>`.
3. Nickname it `website` → **Register app** (skip Hosting).
4. You'll see a `firebaseConfig` block. Copy the three values into
   **`firebase-config.js`** in this repo, replacing the `REPLACE_ME` placeholders:

```js
window.ICEHUT_FIREBASE = {
  apiKey: 'AIza…',                    // apiKey from the console
  authDomain: 'icehut.firebaseapp.com',
  projectId: 'icehut'
};
```

5. Commit and push. GitHub Actions redeploys automatically.

> **These three values are meant to be public.** Firebase web config isn't a
> secret — it identifies the project, it doesn't grant access. The rules in
> Step 4 are what decide who can change the board. Don't paste anything from the
> console's *Service accounts* tab into this repo; that one *is* secret.

## Step 6 — Try it

1. Visit `https://morinvilleicehut.ca/admin.html` and sign in.
2. Set a flavour to **Out of stock**.
3. Open the flavours page — it should show a badge and grey out within seconds.

The very first save creates the database record; there's nothing to seed
beforehand.

---

## Day-to-day use

- Bookmark `/admin.html` on the shop phone or tablet — it's built for a phone.
- Everything starts as **In stock**. Only tap the exceptions.
- **Getting low** shows visitors an amber "Almost out" tag; the flavour still
  reads as available.
- **Out of stock** greys the flavour out, marks it "Out of stock", and keeps it
  from being picked as Flavour of the Week.
- **Reset everything to "In stock"** at the bottom clears the board — handy when
  a fresh delivery lands.
- Two people can use it at once without overwriting each other.

## If the database is ever unreachable

The site falls back to showing every flavour as normal, exactly as it looked
before this feature existed. Visitors never see an error or a broken layout.

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

## Fast path: let Claude do it

The Firebase CLI ships an MCP server, so Claude Code on your own machine can
create the project, the database, the web app, and deploy the rules for you.

### One-time setup

```bash
claude mcp remove firebase-mcp                                       # if you added it before
claude mcp add firebase-mcp -- npx -y firebase-tools mcp --only auth,firestore
firebase login                                                       # opens your browser
```

The `--only auth,firestore` matters: without it the server loads a smaller
toolset that can't create the Firestore database.

### Then, from a Claude Code session in this repo

Ask it to run this sequence. It has a tool for each step:

1. `firebase_create_project` — project id `icehut`
2. `firestore_create_database` — location `northamerica-northeast1`
3. `firebase deploy --only firestore:rules` — picks up `firebase.json` and
   `firestore.rules`, already committed here
4. `firebase_create_app` — platform `web`, nickname `website`
5. `firebase_get_sdk_config` — returns the three values below

Then paste those three into `firebase-config.js` and push.

### What still needs the console (~2 min)

The MCP server has no tool for either of these:

- **Authentication → Get started → Email/Password → Enable** (Step 2 above)
- **Authentication → Users → Add user**, twice (Step 3 above)

Do those two by hand and everything else can be automated.
