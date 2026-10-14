# 14 · Stores that close orders on WhatsApp

Our store standard: a catalogue where the shopper builds an order and sends it to the business on WhatsApp, with a
payment gateway as an optional module. It came out of two stores built in one week and a research pass over the best
stores and the public UX research (Baymard Institute, Nielsen Norman Group, Google's documentation), which we cite
where a number comes from them. Its principle, in the agency owner's words: everybody can do the main things; the
details are what make the difference.

Two ways we sell it: a small catalogue (up to about thirty products, categorised, with a search box, loaded by us)
inside a standard site, or a full store with an admin panel the client manages. Service landings never get a catalogue
([13-copy-and-content.md](13-copy-and-content.md): data that changes goes in prose).

---

## The short version

1. **The close must never lose an order.** Save the order on the server first and show its number. Open WhatsApp from
   a **real link the shopper taps**, never from JavaScript after an `await fetch` (popup blockers, and a developer report
   that universal links fail after async work). Keep the cart until the shopper confirms "Yes, I sent it". Always offer
   a "Copy order" fallback. Put one link in the message that rebuilds the order later: iPhone Safari deletes a site's
   stored data after 7 days without a visit (home-screen web apps are exempt).
2. **Use `api.whatsapp.com/send`**, not `wa.me`: the `wa.me` redirect turns every emoji into "�". Texts of 12,000
   characters still pass. Instagram's in-app browser on iOS often shows a "download WhatsApp" page instead of opening
   the app.
3. **Show the total cost before the close.** About 40% of shoppers who abandon a checkout leave over extra costs
   (Baymard). Delivery cost and date belong where the shopper decides, with real opening hours, and our e-commerce law
   wants the freight in the final value before the order.
4. **Every product and category has its own URL**, server-rendered, with a real `<a href>` and a self-canonical. A
   client-rendered catalogue is zero SEO, nothing is shareable, and nothing feeds catalogue ads.
5. **The server re-prices the cart.** Never trust prices from the browser. Minimum order enforced on both sides.
6. **Measure honestly.** An order sent to WhatsApp is a lead with a cart: the browser reports `generate_lead` / `Lead`;
   the server reports `purchase` / `Purchase` only when the seller marks the order sold. The order number is the key that
   joins analytics, the ad platform, session recordings, the CRM and the chat.
7. **The phone's Back gesture closes the drawer or the sheet**, it does not leave the store. About 59% of sites break Back
   in at least one pattern (Baymard). A `<dialog>` with `showModal()` handles Escape and makes the page inert; Android
   Chrome turns Back into a close request, but iPhone Safari and Firefox do not, so push a history entry when the drawer
   opens.

---

## Bugs we already paid for

- `<img width height>` with a CSS width but no `height: auto` renders at the attribute height. Four times in eight days.
- Fixed elements (the demo badge, the floating WhatsApp bubble, bottom bars) covering a drawer's close button, or the
  "add" column of a product list on phones.
- `overflow-x: hidden` on `body` breaks `window.scrollTo` and lazy loading; use `overflow-x: clip` on `html`.
- `[hidden]` loses to any author `display` rule: `[hidden]{display:none!important}` globally.
- A drawer parked with `translateX(100%)` reads as page overflow: add `visibility: hidden` when closed.
- Search without accent folding ("serum" not finding "Sérum"), and a search inside a category returning 0 on camera.
- Prices burned into product photos lie the day a price changes.
- The cart emptied before WhatsApp even opened.
- A panel option that exists on a phone but sits behind a small link or a "⋯" counts as missing: the owner checking on
  his phone said "those options are not there". Keep actions visible on every row at every width.

---

## Stage by stage

### Arrive
Show the range (a large share of the product types on the home), the search prominent, **no auto-rotating carousels**
(each panel is seen a fraction of the time and they read as ads) and no entry interstitials. Say what the store sells
and how it differs. In our market about 83% of mobile traffic is Android and the top viewports are 384x832, 414x896 and
360x800 (StatCounter, September 2026): test those, not only an iPhone.

### Search
About half of shoppers prefer search, and most sites fail it on product types, features, use cases and abbreviations
(Baymard). Build in: accent and case folding, typo tolerance (one edit from four letters, two from eight; exact matches
rank first), plurals, **number and code folding** (a product code typed with or without spaces must match), help rows,
the query in the URL, and **a no-results state that opens WhatsApp with "Do you have X?"** and is measured. A full
stemmer merges words that should not merge (pepper/pimento); prefer light rules. Card data for about 3,000 products was
32 to 39 KB with brotli, and a small client-side index (MiniSearch is about 6 KB gzip) is enough.

### Category and listing
Category pages with their own URLs; shared attributes as filters, not as more categories; filter URLs kept out of the
crawl; on mobile an explicit "Show N results" button with a live count; the four essential sorts; "load more" with 15 to
30 products per batch and **Back returning to the same place**; in-cart marks on the cards; one card per model with
swatches instead of one card per colour; unit price where it matters (per kilo).

### Product page
Its own URL; complete information (missing information caused about a fifth of purchase failures in NN/g's studies);
the delivery line and the shipping cost on the page (most shoppers look for it there); gallery with thumbnails and
pinch zoom; variants that update the URL with `replaceState`; for furniture, dimensions, in-scale images and assembly
facts. **Credit sales show the cash price, the number of payments and the total** (our consumer law requires it, and no
local store we checked did it). A share button.

### Cart
Feedback that stays on screen (a badge, a changed button, a confirmation that does not fade on a timer); the button
becomes a quantity stepper with an editable field that selects on focus; minus at 1 removes, with undo; totals update
instantly; the delivery cost in the total; Back closes the cart; focus trapped while open.

### Checkout by WhatsApp
Two steps: the order is logged and numbered, then a real WhatsApp link opens with the message ready, then "Yes, I sent
it". The fewest fields that do the job (the average checkout has about 15 fields against an ideal of 7 or 8), labels
above, `autocomplete`, `inputmode`, required and optional marked, remembered data on the next order, the chosen payment
method in the message, invoice data in split fields with the tax ID's check digit validated, an out-of-hours notice, the
terms accepted before confirming, and an editable review step.

### Checkout by gateway (optional)
The card or QR payment is confirmed by the gateway's server-to-server notification, never by the shopper landing on the
return URL (they return there even when the card is declined). Separate order state from payment state.

### After the order
A public order page per order (a copy of the contract, which our law requires), the repeat-order link, real next steps
with real hours, and a quiet "add to home screen" line on a second order.

---

## Non-negotiables, in one list

- [ ] `api.whatsapp.com/send`; the order saved and numbered before WhatsApp opens; a real tapped link.
- [ ] The cart kept until "Yes, I sent it"; a "Copy order" fallback; a repeat link in the message.
- [ ] Delivery cost and date before the order; total visible; terms before confirmation.
- [ ] Server-side re-pricing and minimum order; honeypot and rate limit on the order endpoint.
- [ ] Product and category URLs, server-rendered, self-canonical; filters out of the crawl.
- [ ] Back closes overlays; position restored on Back from a product.
- [ ] Search with folding, typo tolerance, codes, and a no-results path to WhatsApp.
- [ ] `[hidden]{display:none!important}`; `overflow-x: clip`; `height: auto` on every sized image.
- [ ] `generate_lead` in the browser, `purchase` from the server only when sold; the order number as the join key.
- [ ] Sliders without a visible scrollbar, whole cards on desktop with two arrows for a mouse, room at the edges for
      stickers and hover lift; full-bleed finger rails are fine on phones.
- [ ] Product photos fill their box without bars and are never cut.
- [ ] No loading screen (three large local chains we checked shipped one).
