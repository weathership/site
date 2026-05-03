# DNS & subdomain

The site has two deployment surfaces and two domains:

| Surface | Domain | Worker | Zone |
|---------|--------|--------|------|
| Development | `weathership.zndx.org` | `weathership-web-dev` | `zndx.org` |
| Production (release) | `weathership.org` | `weathership-web` | `weathership.org` |

Both workers run on the same Cloudflare account
(`Rch.zndx@gmail.com's Account`). Day-to-day deploys go to dev; releases
go to prod.

## How custom domains are wired

```
DNS / Custom domains
├── zndx.org zone
│   └── weathership.zndx.org → Worker `weathership-web-dev`
└── weathership.org zone
    └── weathership.org      → Worker `weathership-web`
```

Custom-domain bindings are configured via the Cloudflare API rather
than declared in `wrangler.jsonc`. The bindings live as Worker Custom
Domains under each zone:

```sh
PUT /accounts/{account_id}/workers/domains
{
  "environment": "production",
  "hostname": "<hostname>",
  "service": "<worker-name>",
  "zone_id": "<zone-id>"
}
```

This matches the `gaius.zndx.org` pattern from the sibling repo: the
worker's wrangler config stays portable; the route binding is an
infrastructure concern set once per environment.

## API tokens used

- **`CLOUDFLARE_API_TOKEN`** — account-scoped token used by `wrangler
  deploy` to upload Worker code and by the workers/domains API to
  manage custom-domain bindings on both zones.
- **`CF_WX_API_TOKEN`** — zone-scoped token specifically for the
  `weathership.org` zone. Used for DNS record management on that zone
  (e.g., the one-time cleanup of the legacy GitHub Pages A records on
  the apex during the initial release). Not used for routine deploys.

## One-time setup (initial release)

The dev worker `weathership-web-dev` and its `weathership.zndx.org`
binding were established first. Production binding required clearing
four legacy A records (185.199.108–111.153) on `weathership.org` that
pointed at GitHub Pages — Google Workspace MX and SPF TXT records on
the apex were preserved.

Reference command sequence:

```sh
# 1. Deploy the dev worker.
just web-deploy

# 2. Bind weathership.zndx.org.
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d '{"environment":"production","hostname":"weathership.zndx.org","service":"weathership-web-dev","zone_id":"<zndx-zone>"}'

# 3. Release the production worker.
just web-release

# 4. Bind weathership.org (after clearing legacy A records on the apex).
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d '{"environment":"production","hostname":"weathership.org","service":"weathership-web","zone_id":"<weathership-org-zone>"}'

# 5. Verify.
curl -I https://weathership.zndx.org/health
curl -I https://weathership.org/health
```

## Email

`@weathership.org` mail goes through Google Workspace. The 5 MX records
and SPF TXT record on the apex are independent of the Worker custom
domain and must not be removed when managing web routing.
