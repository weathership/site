# DNS & subdomain

The site is served from `weathership.zndx.org` — a Cloudflare Worker
custom domain on the **zndx.org** zone. Eventually weathership will
have its own zone; this section will then change to point at it. The
worker code stays the same — only the route binding moves.

## How the subdomain is wired

```
DNS (Cloudflare zone: zndx.org)
└── weathership.zndx.org
    └── Custom Domain → Worker `weathership-web` (production environment)
```

The custom-domain binding is configured in the Cloudflare dashboard,
not in `wrangler.jsonc`. This matches the pattern used by `gaius.zndx.org`
in the sibling `gaius` project and exists because the deploy API token
lacks `zone:route` permissions — the dashboard does the route binding,
wrangler does the worker upload.

## One-time setup

1. **Deploy the worker.**
   From `web/`:
   ```sh
   pnpm deploy
   ```
   On success, the worker is reachable at
   `https://weathership-web.<account>.workers.dev`.
2. **Bind the custom domain.**
   - Cloudflare dashboard → Workers & Pages → `weathership-web` →
     Settings → Triggers → Custom Domains → **Add Custom Domain**.
   - Domain: `weathership.zndx.org`.
   - Cloudflare automatically provisions the DNS record and certificate.
3. **Verify.**
   ```sh
   curl -I https://weathership.zndx.org
   curl  https://weathership.zndx.org/health
   ```
   Expect `200 OK` and a body of `ok` from the second call.

## Migration to weathership.org

When the dedicated `weathership.org` zone exists and is added to the
Cloudflare account:

1. Repeat step 2 above, this time with `weathership.org` (or `www.`)
   as the custom domain.
2. Verify the new domain returns the expected output.
3. Optionally: add a redirect rule from `weathership.zndx.org` to the
   new domain, then remove the `zndx.org` custom-domain binding.

The worker code, the wrangler config, and the build pipeline don't
change.
