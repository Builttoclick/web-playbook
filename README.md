# Web Playbook

Everything we know about building small-business websites that load fast, rank, and turn visits into
WhatsApp conversations. From the first sales demo to the monthly report after launch.

This is the working knowledge of [Built to Click](https://builttoclick.com), a small agency in Paraguay
that builds websites and does local SEO for carpenters, glaziers, truck dealers, builders, clinics,
restaurants, importers and stores. It is not a tutorial and it is not theory. Every rule in here exists
because breaking it cost us a site, a client conversation or an afternoon.

**Take any of it.** No attribution needed. See [LICENSE](LICENSE).

> **Version 2 · October 2026.** The first version (August 2026) was one long essay plus a short
> checklist. Since then we delivered more sites, wrote a real build procedure with gates, built one
> toolkit that audits and deploys every site, catalogued page structures so no two clients get the
> same skeleton, and started a premium tier with animated effects that still score 90+ on mobile.
> All of it is in here now.

---

## Start here

| You want to... | Open |
|---|---|
| Know what "done" means before a site goes live | [`CHECKLIST.md`](CHECKLIST.md), the definition of done, 113 items plus the premium-effects block |
| See the whole process, from lead to monthly report | [`docs/01-process.md`](docs/01-process.md) |
| Decide what a page is FOR before designing it | [`docs/02-strategy.md`](docs/02-strategy.md) |
| Pick a page structure that is not a template | [`docs/03-structure.md`](docs/03-structure.md) |
| Run the design phase (design sheets, tokens, photos) | [`docs/04-design.md`](docs/04-design.md) |
| Animate without looking generated | [`docs/05-motion.md`](docs/05-motion.md) |
| Ship React Bits / WebGL effects on a fast static site | [`docs/06-premium-effects.md`](docs/06-premium-effects.md) and [`code/islands/`](code/islands/) |
| Make it load fast (speed checklist) | [`docs/07-performance.md`](docs/07-performance.md) |
| Get it indexed (SEO checklist) | [`docs/08-seo.md`](docs/08-seo.md) |
| Win the local map results | [`docs/09-local-seo.md`](docs/09-local-seo.md) |
| Turn visits into messages, and measure it | [`docs/10-conversion-and-tracking.md`](docs/10-conversion-and-tracking.md) |
| Deploy, host, set up the domain and the mailboxes | [`docs/11-deploy-hosting-domains-email.md`](docs/11-deploy-hosting-domains-email.md) and [`templates/`](templates/) |
| Verify without lying to yourself (quality checklist) | [`docs/12-qa.md`](docs/12-qa.md) |
| Write copy that does not read as generated | [`docs/13-copy-and-content.md`](docs/13-copy-and-content.md) |
| Build a store that closes orders on WhatsApp | [`docs/14-stores.md`](docs/14-stores.md) |
| Avoid the mistakes that cost us the most | [`docs/15-mistakes.md`](docs/15-mistakes.md) |
| Know what we use and what it costs | [`docs/16-tools.md`](docs/16-tools.md) |

---

## What is in this repo

```
README.md          this file: the map and the short version
CHECKLIST.md       the definition of done for a client site (stage by stage, with gates)
docs/              the reasoning, one topic per file, 16 files
templates/         the deploy files every new site starts from (Cloudflare Worker, headers, robots, constants)
code/islands/      the build and loader we use to run React Bits components as small Preact islands
```

---

## How we build, in one screen

- **Every site is static HTML written by a generator.** One Python script per site writes the whole
  output folder: pages, schema, sitemap, robots, headers, share cards. Nobody edits the output by hand,
  ever. No CMS, no database, no plugin treadmill. A text change is an edit to the generator's data and
  a five-minute deploy.
- **Hosted on Cloudflare** (a Worker serving static assets, or Pages), the domain's DNS on Cloudflare,
  the HTML cached at the edge and purged on every deploy.
- **One shared toolkit, never copied per site.** One command audits every automatable checklist item
  and exits non-zero when a gate fails. One command deploys: it refuses to ship on a failing gate, then
  purges the cache and proves that what is live equals what was built.
- **A site is noindex until the owner of the agency says "index it".** It lives on the client's real
  domain from the first deploy, safe to share, invisible to Google until launch day.
- **The structure is chosen from what the business needs to achieve**, not from a template and not
  from "what we have not used lately". Fourteen page spines, sixty sections catalogued by the job they
  do.
- **The client chooses a design language, not a page.** Three design sheets (tokens, type, colour,
  shapes, components, forms, running motion), zero copy. They pick one; only then is a page built.
- **WhatsApp is the conversion.** Every button opens a chat with a message already written for the
  page and section it came from. A fixed bottom bar on phones. The event that matters is measured.
- **Premium sites get real effects without losing speed.** Our HTML stays the page; each animated
  effect is an island that paints a static poster first (its exact first frame), then hydrates.
  Measured: CLS 0, 60 fps, poster vs live 0 px.

---

## The short version: 20 rules

If you read nothing else.

1. **Decide what the page is for before you design it.** "That they contact us" is a mechanism, not
   an objective. Pick one of seven objectives (qualified message, store visit, booking, order,
   verified credential, staying in memory, recruiting) and let it decide the length, the CTA and the
   event you measure. [Strategy](docs/02-strategy.md)
2. **The spine is the decision, not the blocks.** Two active clients never share a page spine.
   Stacked full-width bands are not the first choice for any objective. [Structure](docs/03-structure.md)
3. **What the client actually has vetoes everything aesthetic.** No photos means a typographic page,
   not stock photography.
4. **Six to nine sections. A section that does none of the ten jobs comes out.**
5. **The H1 is "what they sell + what nobody else can say", as a statement.** Never a price, never a
   question. Buyer questions go in H2s. [Copy](docs/13-copy-and-content.md)
6. **Never write what the business does not do, have or offer.** Say the positive half.
7. **Above the fold is painted, not revealed.** An entrance animation on the hero text is how LCP
   goes from 1 second to 6. [Performance](docs/07-performance.md)
8. **Three motion mechanics per site, one easing curve, small travel, nothing replays.** If you notice
   an animation, it is mis-calibrated. [Motion](docs/05-motion.md)
9. **Every effect paints its first frame before any JavaScript.** Nothing moves while it fades in
   over its poster. "No weird resize" is the quality bar. [Premium effects](docs/06-premium-effects.md)
10. **Zero third-party origins before first paint.** Fonts, icons, effects, libraries: your own
    domain. Self-hosted woff2 with metric-matched fallbacks.
11. **No loading screen, no custom cursor, nothing that scrolls sideways on a phone.** Checked by a
    probe at 360, 375, 390 and 430 px, never by eye.
12. **One Lighthouse run proves nothing.** Three runs, the median. Launch bar on mobile: Performance
    90+, Accessibility, Best Practices and SEO at 100.
13. **"Sitemap healthy" and "page indexed" are different facts.** Only URL Inspection tells you the
    second. [SEO](docs/08-seo.md)
14. **A canonical will not hide a staging copy.** A real noindex or a 301 will.
15. **Legal pages are written for each client and kept away from every crawler**, AI bots included.
16. **The first 200 lies.** After a deploy, check status, content type and size against the build,
    then purge, then check again. [Deploy](docs/11-deploy-hosting-domains-email.md)
17. **A check that cannot fail is not a check.** Pair every visual check with an independent signal.
    [QA](docs/12-qa.md)
18. **Nothing the client has to maintain** unless it was sold and someone will feed it. Data that
    changes goes in prose and closes on WhatsApp.
19. **Copy written by a model is a draft** until a human who knows the client writes over it.
20. **Nobody says "done" while a gate is open.** Say which gates are open and who they wait on.

---

## What changed since version 1 (August 2026)

- **A real procedure.** Ten phases with exit gates, from close to delivery, and a definition of done
  of 113 items that every paid site copies on day one and fills with evidence.
  [Process](docs/01-process.md) · [Checklist](CHECKLIST.md)
- **One toolkit for every site.** The per-site copies of the SEO check, overflow probe, deploy, Search
  Console and share-card scripts drifted apart. They were replaced by one audit and one deploy command.
  What each check does is documented in [QA](docs/12-qa.md).
- **The structures library.** Our first four live homes had the same skeleton. We named the axes we
  never varied (spine, navigation, type system, image treatment, density) and built a four-minute
  selection procedure. [Structure](docs/03-structure.md)
- **Design sheets instead of design pages.** [Design](docs/04-design.md)
- **Strategic analysis before any demo.** [Strategy](docs/02-strategy.md)
- **The premium tier.** React Bits components compiled on Preact as islands, posters equal to the first
  frame, scroll-linked effects on the compositor with a JavaScript fallback that produces the same
  matrices, a 3D card wheel with no WebGL. [Premium effects](docs/06-premium-effects.md)
- **Launch discipline.** Noindex on the real domain until the go, then a launch command that flips
  nothing on its own. Edge cache rules, www to apex at the zone, purge lists, IndexNow.
- **Legal pages per client**, with the law table we verified, and the robots rule that keeps them away
  from AI crawlers.
- **A store standard** for catalogs that close orders on WhatsApp. [Stores](docs/14-stores.md)
- **After delivery:** an automated monthly report per client, drafted for the agency owner to send.

---

## What is deliberately not in here

- Client names, phone numbers, prices, account IDs and credentials. Examples are described by trade
  ("a furniture maker", "a used-truck dealer").
- The full source of our internal toolkit. It is tied to our folders and accounts. Every check it
  runs is described in [QA](docs/12-qa.md) precisely enough to rebuild it, and the reusable pieces
  are in [`templates/`](templates/) and [`code/islands/`](code/islands/).
- Third-party courses and guides we learned from. We cite public sources where a number comes from
  one.

---

## Related

- [Sales Video Playbook](https://github.com/Builttoclick/sales-video-playbook): the personalised video pages we send
  to prospects with their demo, also CC0.

---

## Sources

Everything here came out of our own work log, June to October 2026: the field where we write down
every non-obvious fix, the per-site checklists, and the audits of the sites we delivered. Where a
number comes from public research (Google's documentation, Baymard, Nielsen Norman Group, caniuse,
WebKit), the doc says so and links it.

Corrections and disagreements are welcome in the issues.

*Built to Click · Joaquín Caballero · [builttoclick.com](https://builttoclick.com)*
