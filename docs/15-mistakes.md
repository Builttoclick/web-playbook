# 15 · The expensive mistakes

The greatest hits, in the order we would warn a new person about them. Each one cost us a site, a client
conversation or an afternoon, and each one is now a checklist item or a gate.

## Building

1. **The animation trap that renders sections invisible while the code looks perfect.** A paused element nobody
   releases, an SVG stroke left fully run out. Costs an hour every time until you have the linter.
   ([05-motion.md](05-motion.md), trap 1)
2. **Building before the client's answers arrived.** One site was built blind and pulled back the next day. The build
   now waits for the form.
3. **Two people (or two AI sessions) building the same site.** Three sites shipped someone else's draft or lost a
   change. Check who else is on the site, and diff the build against live before every deploy.
4. **Reusing the same page architecture on every client** until four sites were visibly one site. The spine is now a
   declared decision. ([03-structure.md](03-structure.md))
5. **A demo built like a finished site**: 34 minutes, seven redeploys and a brand-new mechanism, for fifteen seconds of
   video. The demo is a sketch.
6. **Claims the client never made, on a live page.** Every number and promise now traces back to a client source or to
   the "decisions I took for you" list.
7. **One global rule for product photos.** `cover` cut the client's products; `contain` put black bars on every studio
   photo. It is a per-photo decision.
8. **An effect that re-centred when it hydrated** ("a weird resize"), and another that lagged on a normal laptop. The
   poster must be the first frame, and cheap beats clever. ([06-premium-effects.md](06-premium-effects.md))

## Measuring and verifying

9. **Concluding from one Lighthouse run.** Our A/B tests were noise for weeks. Three runs, the median.
10. **Assuming the LCP element is the hero image.** Twice it was neither the image nor the headline, and both times an
    animation was the cost.
11. **Trusting a visual QA that structurally cannot fail** (forced reduced motion makes every page look right).
12. **Chasing a headless rendering artefact as if it were a site bug.** Twice, two rounds each.
13. **The opposite: "headless hangs on this page, work around it"**, three rounds, while the page was frozen for real
    visitors in every browser because of an infinite loop. Probe before working around.
14. **Reporting sitemap health as if it were index coverage.**
15. **Repeating a helper's numbers without checking them.** A research report said a prospect had no Google profile and
    ranked for none of six searches. The profile existed, was claimed, rated 4.2, and ranked 32nd, 16th and 12th. A false
    "you do not appear" collapses live in front of the prospect. Run the numbers yourself before they go into a pitch.
16. **Reporting "no email arrived" after one narrow search.** The rejection email was there, from a different sender.

## Indexing

17. **Believing a canonical would keep a staging copy out of the index.** It will not.
18. **A `noindex` in an HTTP header, invisible to a grep of the HTML.** Plus the edge cache keeping it after removal.
19. **Blocking legal pages in robots.txt after Google had indexed them.** The `Disallow` hides the noindex, so they stay
    indexed. Removals tool, then re-inspect.
20. **Marking up products with no price**: Search Console errors and zero rich results.

## Deploying

21. **`immutable` cache headers on file names without a content hash.** Unrecoverable for anyone who already loaded them.
22. **www and plain http answering 200 for a month on two client sites.** The gotcha was known on our own domain; nobody
    swept the client zones. Sweep every zone the day a platform gotcha shows up.
23. **Purging before the build of that commit existed**, which re-cached the old HTML at the edge for 24 hours; and a
    purge list that forgot the sitemap.
24. **Deploying from a machine that did not have the site's images**: the live site lost its app icons until a rollback.
25. **Changing a client's phone number without updating the uptime monitor's keyword**: a false outage on a site that
    answered 200.

## Clients and paperwork

26. **The wrong billing contact on a domain registration**, three times in a row: the receipt goes to whoever is in that
    field, not to whoever paid.
27. **Cutting the package in a proposal** by cloning one written for a different product. The standard package is never
    trimmed (and never inflated).
28. **Inventing scope**: listing profile work or extra landings as pending when they were never sold. Scope is what the
    paper or the video says.
29. **Changing every Google profile category in one save**, which triggered an automatic "business identity changed"
    rejection that then re-fired on every later save.
30. **One mailbox instead of the two that were sold**, and delivery documents written only when someone asked.

---

## The pattern

**Most of these are silent.** No console error, no failed build, no red status code. The site returns 200 and looks
fine, and the broken thing is invisible by construction. That is why the checklist exists and why two rules sit above
all the others:

- **Verify with a second, independent signal.** Status plus content type and size. Crawl plus index. Visual pass plus
  static lint. A helper's report plus your own run.
- **When production behaves differently from local, look at production before changing code.**
