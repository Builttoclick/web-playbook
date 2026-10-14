# 09 · Local SEO and the Google Business Profile

The site is half the job. For a local business the profile is usually the half that pays. One scope rule first:
**profile work is a separate service.** On a website package we do not touch the client's profile and never list
it as pending unless the proposal or the video promised it.

---

## What moves the profile, and what does not

**What moves it:** the primary category, the link to the site, review volume and recency, and photo volume. That is
most of it.

**What does not:** geotagging photos. Google strips EXIF from every photo uploaded to a profile and has said
publicly that geotags do not affect ranking. Do it if you want (it breaks nothing and the same files are reused on
the site and social media, where the metadata survives), but never sell it to a client as a lever. Say it in writing
in the deliverable.

**`claimed: true` does not mean the profile is fine.** Claimed profiles routinely have no hours, no description, one
Street View photo and the wrong category. One we audited was claimed, categorised as "carpenter" for a business
selling engraved corporate gifts, with a 2.0 average from a single review. "It is miscategorised and your average
is a 2" lands as hard as "you never claimed it".

---

## Reading a profile without logging in

- A SERP or business-data API returns the profile's state: claimed or not, category IDs, rating, review count,
  hours, photo count, the `cid` and `place_id`.
- In a browser, `https://www.google.com/maps?cid=<cid>&hl=<lang>` and the page's `innerText` give the rating, the
  text of every review with author and age, and the buttons "Claim this business" / "Add hours" / "Add website",
  which confirm in words what the API says in booleans. (Automated `google.com/search` gets a captcha; Maps does not.)
- **The profile photos come at 1600 px:** their URLs end in a size suffix like `=w408-h275-k-no`, and replacing it
  with `=w1600-h1600-k-no` returns the large original. (Instagram's equivalent parameter is signed and returns 403
  if changed.) The listing exposes only five or six photos even when there are thirty; usually enough.
- **A change is applied when the public data says so, never because a rejection email did not arrive.** Silence in
  the inbox proved nothing once; the change was queued and bouncing.

---

## Categories

### Check the category exists in the client's country and language
Before recommending a category, confirm it is in that country's picker. PlePer has a free public tool that returns
the full list per country and language as tab-separated text inside the HTML (`gcid` and the localised name); our
country in Spanish had 3,893 categories. Keep a local copy and grep it before writing any proposal. Profiles can
carry **legacy** category IDs that are no longer offered (Google still shows a name for them); the action is the
same: change it in the picker.

The house rule: **one primary category and zero to three secondaries**, never more.

### Changing a category without getting the profile flagged
Fixing a wrong category is the heart of the offer and the easiest place to break things. Removing the only category
and adding several new ones from another trade in one save gets an automatic rejection for **"Business identity
changed"**: to the classifier it is the signature of a hijacked profile reused for another business. It is not a
suspension and not a human.

1. **Never delete the original category.** Demote it to secondary: it is true, it is what Google already believes,
   and removing it is what triggers the flag.
2. **The flag is about the PRIMARY category.** Secondaries can go in together or nearly so (they were accepted days
   later even after rejection emails); **change the primary alone, last, on its own day, with no other field in the
   same save.** Order the steps from closest to what Google already believes to farthest, not by commercial value.
3. **A rejected change does not go away: it stays pending in the panel and is resubmitted with every save of "Edit
   profile".** Loading 85 services in eight batches produced eight rejection emails in eight minutes, all listing
   the same categories, and the services did not go in either, because **services hang from categories**. Recovery:
   set the field back to exactly what Google has live (original primary, no secondaries), save once to send a zero
   diff, **wait 48 hours touching nothing**, then climb the ladder.
4. **Appeal with the button in the email**, quoting the routing ID at its foot. The decision was automatic, so the
   appeal reaches a human. Use the client's site as proof that the trade has not changed.
5. **Never follow the email's advice** to mark the profile closed and create a new one. It is generic text for a
   genuinely different business, and it throws away the profile's age, history and reviews.
6. **Moderation is per field, not per save:** in the same save the categories bounced while the address, pin, phone
   and description went through. Photos, posts and review replies go through another pipeline entirely and keep
   working while categories are stuck (33 photos went in the same day).
7. **Re-measure days later.** A rejection does not say which part of a batch was applied, and the state changes
   afterwards without notice.

---

## Claiming, ownership, photos, posts

- **Claiming versus accidentally creating a duplicate:** in the address step, if the city and postal code come
  **pre-filled**, the flow is reading the existing profile and you are claiming. If you had to type the business
  name from scratch, it is a new listing: back out. A duplicate orphans the original with its photos and its age.
- **Transferring primary ownership does not remove you.** The transferring account drops to Owner (still edits
  everything, uploads photos, replies to reviews); it only loses the ability to remove the primary owner. The new
  primary can remove you, so understand the relationship first.
- **Verify a bulk photo upload from the public view:** once owner photos exist, the photo block shows the "Today" and
  "By owner" filters. No owner photos, no filters.
- **Photo requirements:** JPG or PNG, at least 250x250 (720x720 recommended), 10 KB to 5 MB. Instagram images at 360
  to 640 px pass but look soft: enlarge to 900 px on the long side with Lanczos plus an unsharp mask, 1.6x at most.
- **Choose the profile logo at the size it is seen**: a circle of about 88 px.
- **Posts can be scheduled natively and for free** (rolled out from late 2025): on desktop, the profile's Updates →
  Add update → the "Schedule this post" switch. No bulk upload (about two minutes per post), but 26 posts is about
  an hour in one sitting instead of three months of remembering twice a week. Leave the last month unscheduled so
  fresh photos can go in. If the switch does not appear, the rollout has not reached that profile yet.
- **If you geotag anyway:** in the western hemisphere the longitude reference is `W` with a positive value (a negative
  value silently lands on the other side of the world); write only true fields (GPS, description, title, keywords,
  author, copyright), never a fake camera model or capture date; add a 0 to 25 m jitter per photo; verify by reading
  back with a different library than the one that wrote it.

---

## NAP: name, address, phone

Identical on the site, the profile and every directory. No variants. Dull and real. The discipline is **finding the
variants**:

- Four leads in a row had more than one phone number in public circulation; one had four: one on WhatsApp, one on
  the profile and Facebook, one under a related company, and two more legible **on the photo of the shop's own
  sign**. The storefront sign is a source of stale numbers nobody checks.
- Two businesses can trade under the same name with different owners. We nearly merged two in a client document:
  different addresses, phones, and two people with the same surname. Do not assume a relationship you cannot prove.
- **Google may normalise the address** into something you did not write (a route code plus a kilometre marker
  instead of the avenue name). Whatever the profile settles on is the canonical NAP, and the site matches it.
- On the site, the address carries a **verbal reference** ("between X and Y street", "in front of block C"): in our
  market the reference beats the pin.

---

## Working on profiles for clients

- **Re-read a profile you are actively editing before every version of a client document.** One changed its business
  name and gained photo filters within 50 minutes; writing from what you read an hour ago ships stale facts.
- **Write reports in two blocks: "loaded" and "prepared".** Category, website, phone and hours are verifiable from
  the public view, so they can be stated as done. Description, services, products and photos are not always visible,
  so they go in a separate "prepared and uploading" block. That split is how you avoid overclaiming.
- **Profile emails come from different Google senders** (profile changes, Search Console, Maps edits, security).
  Search by the domain, broadly, twice, before reporting that nothing arrived.
- **Hand the client the review link** (the profile's "write a review" URL) after delivery, through the agency owner.

---

## Checklist · local, when it is in scope

- [ ] Category verified against the country's live list; one primary, zero to three secondaries.
- [ ] Category changes done as a ladder: original demoted, never deleted; primary changed alone, last.
- [ ] Any pending rejected change reverted before touching other fields.
- [ ] Site link uses the final URL; hours, phone and address identical to the site and the schema.
- [ ] Storefront sign and old directories checked for stale numbers.
- [ ] Photos: real work, at least 720x720, uploaded and verified from the public view.
- [ ] Posts scheduled natively; the last month left open for fresh photos.
- [ ] Area or neighbourhood pages on the site if the client works by zone.
- [ ] Client report split into "loaded" and "prepared".
