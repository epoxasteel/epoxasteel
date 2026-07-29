# Deployment

Everything needed to get epoxasteel.com running on Railway, and to keep it
running.

---

## Contents

- [How the application behaves without configuration](#how-the-application-behaves-without-configuration)
- [First deploy](#first-deploy)
- [Environment variables](#environment-variables)
- [Adding PostgreSQL](#adding-postgresql)
- [Custom domain](#custom-domain)
- [Email deliverability](#email-deliverability)
- [Health checks and monitoring](#health-checks-and-monitoring)
- [Scaling](#scaling)
- [Moving uploads to object storage](#moving-uploads-to-object-storage)
- [Adding a map embed](#adding-a-map-embed)
- [Adding analytics](#adding-analytics)
- [Troubleshooting](#troubleshooting)
- [Deploying somewhere other than Railway](#deploying-somewhere-other-than-railway)

---

## How the application behaves without configuration

This matters, because it means you can deploy first and configure afterwards.

| Service                | Unset                                        | Configured                           |
| ---------------------- | -------------------------------------------- | ------------------------------------ |
| Database               | Enquiries are emailed only                   | Enquiries are stored and emailed     |
| Email                  | Message bodies are printed to the server log | Delivered to the customer and to you |
| `NEXT_PUBLIC_SITE_URL` | Canonicals use `https://epoxasteel.com`      | Uses your value                      |
| `NEXT_PUBLIC_SITE_ENV` | `robots.txt` disallows everything            | `production` allows indexing         |

The site never breaks because something is missing. It degrades and tells you
what is off, at `/api/health`.

---

## First deploy

### 1. Push the repository

```bash
git remote add origin https://github.com/epoxasteel/epoxasteel.git
git push -u origin main
```

### 2. Create the Railway project

1. [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → select `epoxasteel/epoxasteel`
3. Railway reads [`railway.json`](../railway.json):
   - Builder: Nixpacks
   - Build: `npm run build`
   - Start: `npm run start`
   - Health check: `/api/health`, 120 s timeout
   - Restart on failure, up to 5 retries

### 3. Node version

Nixpacks reads the `engines.node` field in `package.json` (`>=20.9.0`). To pin
exactly, add a Railway variable:

```
NIXPACKS_NODE_VERSION=22
```

### 4. Port

**Do not set `PORT`.** Railway injects it, and the start script reads it:

```json
"start": "next start -p ${PORT:-3000}"
```

Hard-coding `PORT` will make the health check fail.

---

## Environment variables

Set these in **Service → Variables**. See [`.env.example`](../.env.example) for
the full annotated list.

Minimum for a production launch:

```
NEXT_PUBLIC_SITE_URL=https://epoxasteel.com
NEXT_PUBLIC_SITE_ENV=production
EMAIL_FROM=EPOXA STEEL <no-reply@epoxasteel.com>
EMAIL_TO=info@epoxasteel.com
RESEND_API_KEY=re_…
IP_HASH_SALT=<long random string>
```

Generate a salt:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Preview environments

Railway builds a deployment per pull request. Leave `NEXT_PUBLIC_SITE_ENV`
**unset** on those — `robots.ts` then serves `Disallow: /`, so a preview URL can
never compete with the live site in search results.

---

## Adding PostgreSQL

1. In the project canvas: **New** → **Database** → **PostgreSQL**
2. Railway injects `DATABASE_URL` into the web service automatically
3. Create the tables:

```bash
railway link          # once, to connect the CLI to the project
railway run npm run db:push
```

Or, from your machine with the connection string copied from Railway:

```bash
DATABASE_URL="postgresql://…" npm run db:push
```

Verify:

```bash
curl https://epoxasteel.com/api/health
# → "database": "configured"
```

### Migrations

`db:push` is fine for the first deploy and for development. Once live, use
migrations so schema changes are reviewable and reversible:

```bash
npx prisma migrate dev --name add_something   # locally; commits a migration
```

Then add a release command in Railway (**Settings → Deploy → Custom Start
Command** is _not_ the right place — use a pre-deploy command if available, or
run manually):

```bash
railway run npm run db:migrate
```

### Backups

Railway takes automated backups on paid plans. For an independent copy:

```bash
railway run pg_dump "$DATABASE_URL" > epoxa-$(date +%F).sql
```

---

## Custom domain

### Railway side

**Settings → Networking → Custom Domain** → `epoxasteel.com`.
Repeat for `www.epoxasteel.com`. Railway returns a target hostname such as
`abc123.up.railway.app`.

### Namecheap side

**Domain List → Manage → Advanced DNS**:

| Type    | Host  | Value                   |
| ------- | ----- | ----------------------- |
| `ALIAS` | `@`   | `abc123.up.railway.app` |
| `CNAME` | `www` | `abc123.up.railway.app` |

Use `ALIAS` at the apex, not `A` — Railway's addresses are not static.

**Delete the parking records** Namecheap adds by default (a `CNAME` on `@` or
`www` pointing at `parkingpage.namecheap.com`). They conflict and the domain will
not resolve to Railway while they exist.

### Verify

```bash
dig +short epoxasteel.com
dig +short www.epoxasteel.com
curl -sI https://epoxasteel.com | head -1
```

TLS is provisioned automatically by Railway once DNS resolves. Allow up to an
hour.

### Redirect www to apex (or the reverse)

Pick one canonical host. If you want the apex to win, add a redirect in
`next.config.ts`:

```ts
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.epoxasteel.com' }],
      destination: 'https://epoxasteel.com/:path*',
      permanent: true,
    },
    // … existing redirects
  ];
}
```

---

## Email deliverability

Sending from `epoxasteel.com` without DNS authentication means confirmation
emails land in spam.

### Resend

1. [resend.com](https://resend.com) → **Domains** → add `epoxasteel.com`
2. Resend gives you DKIM and SPF records — add them in Namecheap Advanced DNS
3. Wait for verification, then create an API key and set `RESEND_API_KEY`

### SMTP (Namecheap Private Email, Google Workspace, Microsoft 365)

```
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@epoxasteel.com
SMTP_PASSWORD=…
```

Port 465 needs `SMTP_SECURE=true`.

### DMARC

Add a DMARC record once SPF and DKIM are verified:

| Type  | Host     | Value                                                     |
| ----- | -------- | --------------------------------------------------------- |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@epoxasteel.com` |

Start with `p=none` if you want to monitor before enforcing.

### Testing

Submit the contact form and check both mailboxes. If nothing arrives, check the
Railway logs — the email layer logs the transport and the failure reason without
ever logging credentials.

---

## Health checks and monitoring

`/api/health` reports status and which services are configured. It never
returns a credential.

```json
{
  "status": "ok",
  "timestamp": "2026-07-29T10:00:00.000Z",
  "services": { "database": "configured", "email": "resend" }
}
```

Point an uptime monitor at it. Railway already uses it as the deployment health
check.

For error tracking, Sentry drops in cleanly — but remember to add its ingest
host to `connect-src` in the CSP in `next.config.ts`, or reports will be blocked.

---

## Scaling

The site is almost entirely static, so a single small instance handles a great
deal of traffic. When you do scale:

**Horizontal replicas.** The rate limiter in `src/lib/rate-limit.ts` keeps state
in memory, so with N replicas each enforces the limit independently — the
effective limit becomes N×. For a global limit, swap the `buckets` `Map` for
Redis. The module's interface is one function (`rateLimit`), so the change is
contained.

**Database connections.** Prisma opens a pool per instance. With several
replicas, either raise Postgres `max_connections` or put PgBouncer in front and
append `?pgbouncer=true&connection_limit=1` to `DATABASE_URL`.

**Static assets.** Railway serves them directly. For global reach, put a CDN in
front of the service.

---

## Moving uploads to object storage

Quote attachments currently ride along with the internal notification email.
That is deliberate: Railway's filesystem is ephemeral, so writing to disk would
lose files on every redeploy.

For higher volumes, upload to S3-compatible storage and email a link instead. In
`src/app/api/quote/route.ts`, replace the `attachments` block:

```ts
// Before: attach the file to the email
const attachments = file
  ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }]
  : undefined;

// After: upload and store the key
const key = `quotes/${reference}/${file.name}`;
await storage.put(key, Buffer.from(await file.arrayBuffer()), file.type);
// then include a signed URL in the email body, and persist `key`
```

`QuoteRequest.attachmentKey` already exists in the Prisma schema for this.

---

## Adding a map embed

`/contact` renders drawn placeholder artwork rather than an iframe, because an
embed loads third-party scripts and cookies on every view and the CSP is strict.

To use a real embed:

1. Add the provider to `frame-src` in `next.config.ts` (Google Maps is already
   listed)
2. Replace `<MapArtwork />` in `src/app/contact/page.tsx` with the iframe
3. Update the privacy policy — an embed sets third-party cookies, and the
   current policy states that the site does not

---

## Adding analytics

There is no analytics script by default, and the CSP blocks unknown hosts.

To add one:

1. Extend `script-src` and `connect-src` in `next.config.ts` with the provider's
   hosts
2. Add the script through `next/script` with `strategy="afterInteractive"`
3. Update `/privacy` — it currently states there is no analytics running
4. If the provider sets cookies requiring consent, add a consent banner and gate
   the script on it

Privacy-friendly options (Plausible, Fathom, Umami) avoid the consent
requirement in most jurisdictions and are a much smaller CSP change.

---

## Troubleshooting

**Build fails: `Cannot find module '.prisma/client'`**
`prisma generate` did not run. It is wired into `postinstall`. If you changed the
install command, run `npx prisma generate` before `next build`.

**Health check times out**
Almost always a `PORT` problem. Remove any `PORT` variable you set manually.

**Pages render unstyled**
An old server process is serving HTML that references CSS chunks from a replaced
build. Redeploy. Locally, stop every `next start` process before restarting.

**Forms return 502**
Neither persistence nor delivery succeeded, so the route refuses to show a false
success. Check the Railway logs for the transport error and confirm
`RESEND_API_KEY` or the SMTP variables.

**Forms succeed but no email arrives**
Check `/api/health`. If `"email": "console"`, no transport is configured and the
message was printed to the log. If a transport is configured, check SPF/DKIM.

**Preview deployments appearing in Google**
`NEXT_PUBLIC_SITE_ENV` is set to `production` on a preview service. Remove it
there.

**Custom domain not resolving**
Namecheap parking records still present, or an `A` record instead of `ALIAS` at
the apex.

**`prisma db push` cannot reach the database**
The public Postgres URL differs from the internal one. Use the public connection
string when running from your machine, the internal one from `railway run`.

---

## Deploying somewhere other than Railway

Nothing here is Railway-specific beyond `railway.json`.

**Vercel** — works with zero configuration. Remove `output: 'standalone'` from
`next.config.ts` first; Vercel provides its own output handling.

**Docker** — `output: 'standalone'` already produces a minimal server bundle:

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Any Node host** — `npm ci && npm run build && npm start`, with `PORT` set by
the platform.
