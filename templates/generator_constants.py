# -*- coding: utf-8 -*-
"""The block every site generator starts with: the contract between the generator and the shared toolkit.

The toolkit reads these with `ast` (it never imports or runs the generator), so keep them plain literals at
module level: no f-strings, no function calls. Everything else in the generator is free.

From these, the generator writes into SITE/:
- every page: <link rel="canonical" href="DOMAIN + path">, <html lang>, the robots meta from INDEXABLE
  (noindex, nofollow while False; index, follow when True; legal pages and the 404 always noindex)
- SITE/_headers from templates/_headers: X-Robots-Tag noindex on /* while INDEXABLE is False, and detached for
  the canonical host when True, so preview hosts stay noindex forever
- SITE/robots.txt: `User-agent: *` / `Allow: /` plus the legal Disallow lines, with NO Sitemap line while not
  indexable; the same plus `Sitemap: DOMAIN/sitemap.xml` when indexable. The legal Disallow lines are repeated
  in EVERY user-agent group (a bot with its own group ignores the `*` group)
- SITE/sitemap.xml ONLY when INDEXABLE (indexable pages only, each with <lastmod>LASTMOD</lastmod>)
- SITE/<INDEXNOW_KEY>.txt containing the key
- the analytics tags only when GA4_ID / CLARITY_ID are set, guarded by HOST_RE (they never run on preview
  hosts or localhost), deferred to the first interaction or 3.5 s
"""
DOMAIN = "https://example.com"          # canonical: https + apex, no trailing slash
HOST = "example.com"
INDEXABLE = False                       # flipped to True ONLY on the agency owner's explicit word, recorded in the checklist
LASTMOD = "2026-10-14"                  # the date of the last real content change
GA4_ID = ""                             # measurement ID; empty = no tag
CLARITY_ID = ""                         # session-recording project ID (a "Website" project); empty = no tag
HOST_RE = r"/(^|\.)example\.com$/"      # the tags run only on this host
INDEXNOW_KEY = ""                       # 32 hex: python -c "import uuid; print(uuid.uuid4().hex)"
OG_IMG = "/assets/og/og-home-2026-10.jpg"   # a NEW file name whenever the card changes (scrapers cache by URL)
WEB_KIT = {                             # optional: what the toolkit cannot detect on its own
    "noindex_ok": [],                   # pages that are noindex on purpose while the site is indexable (a links page)
    "landings": [],                     # ads landings: no navigation, own WhatsApp message, noindex
    "must_404": [],                     # URLs that were removed and must answer 404
    "preview_hosts": [],                # hosts outside the Worker routes that copy the site (an old demo)
    "key_pages": [],                    # the two pages Lighthouse measures besides the home
}
