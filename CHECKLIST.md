# Pre-launch checklist

Run the whole thing before handing over any client site. This is the minimum, not the
wish list. If something cannot be done, write down why and tell the client.

Reasoning behind most of these lines is in [`README.md`](README.md).

---

## A · The base

- [ ] **Real 404 page**, styled like the site, with a way back to the home page and to
      services. It must return an actual 404 status, not a soft 404 from an SPA fallback.
- [ ] **A call to action above the fold on every page.** The action button (WhatsApp, quote,
      call) is visible without scrolling, on phone and on desktop.
- [ ] **Internal links between pages**, with descriptive anchor text. No orphan pages: every
      page is reachable from the menu or from another page.
- [ ] **A thank-you page after every form**, with its own URL, so the conversion is
      measurable.
- [ ] **Breadcrumbs** on every page that is not the home page.
- [ ] **At least 5 FAQs**, written from what people actually ask on WhatsApp. One source
      feeds both the visible FAQ and the schema. Never maintain the text twice.
- [ ] **Fixed mobile action bar** with WhatsApp and call, always on screen.
- [ ] **`robots.txt` pointing at the sitemap.** Confirm it is not blocking anything by
      accident.
- [ ] **A unique title per page**, written around what people search, with the city in it.
- [ ] **A unique meta description per page.** None repeated, none empty.
- [ ] **Social share image (`og:image`) at 1200x630, in JPG or PNG, never WebP.** WhatsApp
      and Facebook will not render a WebP card.
- [ ] **Map and directions on the contact page**, plus address, hours, WhatsApp and social
      links.
- [ ] **Real reviews**, with name and photo where possible, taken from the Google profile.
- [ ] **Descriptive alt text on images.** Descriptive, not keyword stuffing.
- [ ] **LocalBusiness schema** with name, address, phone and hours identical to the Google
      profile. Plus FAQPage and BreadcrumbList where they apply.
- [ ] **Privacy policy**, linked in the footer.
- [ ] **Google Analytics 4 installed and recording.**

---

## B · Indexing

- [ ] `sitemap.xml` generated and submitted in Search Console.
- [ ] **Every URL in the sitemap returns 200.** Fetch the sitemap, request each `<loc>` with
      redirects disabled. A sitemap with 404s inside is worse than no sitemap.
- [ ] Property created and verified in Search Console, in the client's name.
- [ ] `<lastmod>` present in the sitemap. It is the only freshness signal Google reads to
      prioritize recrawling, and several sitemap generators omit it by default.
- [ ] Canonical on every page, and one live version only: www or apex, https forced.
- [ ] **No `noindex` in the HTTP headers.** Check `x-robots-tag` with `curl -sI`, not only
      the HTML.
- [ ] Staging mirrors and demo subdomains carry a real `noindex` or a 301 to the live domain.
      A cross-domain canonical does not keep them out of the index.
- [ ] If the site is an SPA, prerender or SSR. The server-delivered HTML has to contain the
      content.
- [ ] If there are two languages, hreflang cross-referenced and correct.
- [ ] Inbound internal link count checked per URL. Any page with one inbound link is a
      candidate for "discovered, currently not indexed".

---

## C · Measurement

- [ ] Microsoft Clarity installed (heatmaps and recordings).
- [ ] Click event on the WhatsApp button, so the site's contribution is countable.
- [ ] Meta pixel if the client advertises or is about to.
- [ ] All IDs written down in the internal analytics register.
- [ ] Every account in the client's name, with their access.
- [ ] Uptime monitor live, and its keyword recorded. If the phone number is the keyword,
      changing the number and changing the keyword is one step.

---

## D · Google local

- [ ] Google profile linked to the site, using the final URL.
- [ ] Name, address and phone identical across site, profile and social. No variants.
- [ ] Storefront sign photo checked for stale phone numbers still in circulation.
- [ ] Area or neighborhood pages if the client works by zone.
- [ ] Client report split into "loaded" and "prepared", never claiming as done what cannot
      be verified from the public view.

---

## E · WhatsApp and contact

- [ ] WhatsApp button on every screen, with a pre-filled message that differs per page.
- [ ] Form tested end to end: it submits, the email arrives, and it lands on the thank-you
      page.
- [ ] Professional domain email set up and working on phone and desktop.

---

## F · Technical

- [ ] Mobile Lighthouse run, Core Web Vitals green. **Three runs, take the median.** One run
      is noise.
- [ ] LCP element identified, and confirmed it is not sitting behind an entry animation.
      Above the fold gets painted, not revealed.
- [ ] Content images in WebP, with width and height declared, lazy loaded below the fold.
      The `og:image` is excluded from this rule.
- [ ] Fonts self-hosted, only the variants actually used. No third-party font CDN.
- [ ] Fallback font metrics matched (`size-adjust`, `ascent-override`, `descent-override`) so
      text does not resize on load.
- [ ] Asset URLs versioned, or content-hashed if any cache header says `immutable`.
- [ ] No horizontal scroll at 375 px. Verified by comparing `scrollWidth` to `clientWidth`,
      not by eye.
- [ ] Comfortable tap targets on buttons and links.
- [ ] Favicon and apple-touch-icon.
- [ ] `<html lang>` set correctly, including region where it matters.
- [ ] No-JS safety net in place: if the script fails, content is visible rather than blank.
- [ ] `prefers-reduced-motion` path checked, and SVG stroke animations verified visible in it.
- [ ] Orphan-animation lint passes (no paused element without something to release it).

---

## G · Content and form

- [ ] One H1 per page, coherent heading hierarchy.
- [ ] Page architecture and vertical rhythm chosen deliberately, and not repeated with
      another active client. Rotation register updated.
- [ ] Three motion effects maximum on the site.
- [ ] Copy reviewed for generated-text tells. Zero em dashes in any visible text.
- [ ] No "we do not do", "we do not have", "that is not available". Everything stated in the
      positive.
- [ ] Any hard fact that changed (phone, material, measurement, origin) grepped across the
      entire build, not only where it was noticed.
- [ ] Social card regenerated if a headline, phone or address changed.

---

## H · Handover

- [ ] Domain, hosting, email and measurement accounts registered in the client's name.
- [ ] Access delivered and written down.
- [ ] Work log entry with the live URLs and whatever is still outstanding.

---

## Deliberately not on this list

- **Case studies.** Depends on the client, decided case by case.
- **A promised response time.** We do not publish one.
- **Team photo.** Only if the client wants it and has decent material.
