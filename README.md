# QHSEMS website

Static site for **HSE Management System Consultancy, Solutions & Training LLP** (QHSEMS).
No build step, no framework, no dependencies. Open `index.html` or upload the folder to any host.

```
index.html          Home
about.html          Who we are, vision & mission, seven-stage approach, six principles
consultancy.html    Service 1 — 75 capabilities across seven domains
training.html       Services 2–4 — the full 108-programme catalogue, searchable
contact.html        Enquiry form
assets/css/site.css Design system (one file)
assets/js/site.js   Nav, scroll reveal, catalogue filter, enquiry list, form (one file)
assets/img/         qhsems-logo-header.jpg  header/print lockup, rebuilt from the 6400x2040
                    original in the deck (emblem + wordmark + subtitle, stray mark removed)
                    qhsems-emblem.png       the emblem alone, transparent background
                    favicon.png             64px, from the emblem
PRODUCT.md          Confirmed product facts this site is built on
DESIGN.md           The design system as built
```

---

## 1. Contact details

These are live across all five pages:

| | |
|---|---|
| Email | `sureshkumar.ehs@gmail.com` — footer, contact page, and the form's `data-mailto` |
| Phone | `+91 97787 21294`, dialling as `tel:+919778721294` |
| Address | Bhavesh House, Aiswariya Avenue, Pirivusala, Chandranagar (Post), Palakkad 678007, Kerala |

**One placeholder remains.** Working hours on `contact.html` read "Office hours to be
confirmed" and carry `data-placeholder="hours"`. No working week was supplied, so none
was invented. Replace that line and drop the attribute when you know it.

```bash
grep -rn "data-placeholder" *.html     # what is still unconfirmed
```

## 2. Things deliberately left out because they were not confirmed

Nothing on this site is invented. These were absent from the company profile, so no
version of them appears anywhere:

- named clients, client logos, testimonials, case studies
- accreditation certificate or approval numbers, and awarding-body logos
- course durations, prices, certificate validity
- staff names, photographs, team bios
- a downloadable brochure PDF

**The credentials strip** (`ISO 45001 / ISO 14001 / ISO 9001 / NEBOSH / IOSH / OSHA`)
is labelled *"Standards & awarding bodies we work to"* — a claim about the standards the
work references. If QHSEMS holds formal **approved-provider** status with any of them,
say so explicitly and add the approval number; that is a much stronger claim and it
needs to be accurate.

## 3. The logo on dark backgrounds

The supplied lockup sets "CONSULTANCY, SOLUTIONS & TRAINING LLP" in black, so it cannot
sit on the navy footer. Rather than recolour your logo, the footer uses a **typeset
secondary lockup**: QHSEMS in the site's display face, the legal name beneath it, and the
four brand pillars — Health, Safety, Environment, Training — in lightened versions of
their logo colours. The full colour lockup appears in the header, on white, where it belongs.

If you have (or commission) a white/knockout version of the lockup, drop it in and replace
the `.footer-word` / `.footer-legal` / `.footer-pillars` block in each page's footer with an
`<img>`.

## 4. Photography

The site ships with **no stock photography** — only the brand logo and an authored
line-drawing of a process plant in the hero. That is deliberate: generic hard-hat stock
would weaken a tender-facing site, and no verified, licence-clean industrial photography
was available to source here.

When you have real photographs of delivery — classroom sessions, site inductions,
practical rescue or rigging exercises, competency assessments — these are the slots
worth filling, in priority order:

1. **Home hero, right column** — replace the `<svg>` inside `.hero__art` with
   `<img src="assets/img/hero.jpg" alt="…">`. Wants a wide, calm industrial scene.
2. **Home, between "Four service lines" and "Approach"** — a full-bleed band of a
   practical session.
3. **Training page, above "How every programme is delivered"** — a practical
   demonstration or assessment in progress.
4. **About page, beside "Who we are"** — instructors or a site walk.

Use real photographs only, at ≥1600px wide, and compress to JPEG (~150–250 KB).

## 5. Copy corrections made to the company-profile text

Programme names are otherwise verbatim. These were corrected because they read as
typos on a tender-facing page:

| Company profile | On the site | Why |
|---|---|---|
| Shout Service Employees Safety | Short Service Employee (SSE) Safety | SSE is the industry term |
| Fork lifting Safe Operation / Fork lifting Operator Competency | Forklift Safe Operation / Forklift Operator Competency | |
| Tool Box Meeting Preparation | Toolbox Meeting Preparation | |
| How to live healthy Tip's | Healthy Living Tips | |
| Authorized Gas Testing | Authorised Gas Testing | site uses British English throughout |
| Behavioural Based Safety | Behaviour-Based Safety (BBS) | |
| Electrical & Intrinsically safety | Electrical & Intrinsic Safety | |
| P & ID reading and writing | P&ID Reading and Writing | |

Also: the profile lists "Incident Management" with 8 items and "Construction, Project &
Contractor HSE" with 13, though the deck's headings imply 9 and 14. The site shows the
actual item counts. Add the missing items and update the counts on
`index.html` (the `.domain-list`) and `consultancy.html` (the `.domain__no` lines) if
they exist.

Capability totals as shipped: **75 consultancy + 108 training = 183**.

## 6. The enquiry form

It has **no backend**. On submit it validates, then opens the visitor's email client with
the whole enquiry pre-written to the address in `data-mailto` on `#enquiry-form`.
That works everywhere and stores nothing.

To use a real form service instead (Formspree, Netlify Forms, your own endpoint):

1. Set `action="https://…"` and `method="post"` on `#enquiry-form`.
2. In `assets/js/site.js`, in the submit handler, replace the
   `window.location.href = 'mailto:' + …` line with `form.submit();`.

Field `name` attributes are already set for a normal POST.

## 7. The enquiry list

Visitors tick programmes in the catalogue; the selection is held in `localStorage`
(`qhsems.enquiry.v1`) and is pre-filled into the contact form's "Programmes of interest"
textarea. Nothing leaves the browser until they send the enquiry.

## 8. Before going live

- [ ] Replace the four placeholders above
- [ ] Confirm the credentials strip wording is accurate
- [ ] Add a real `og:image` (1200×630) and `<meta property="og:url">` per page
- [ ] Add `sitemap.xml` and `robots.txt` once the domain is known
- [ ] Add Google Business / LinkedIn links to the footer if they exist
- [ ] Check the phone number dials correctly on a real handset

## Browser support

Evergreen Chrome, Edge, Firefox and Safari. Without JavaScript the site is fully
readable and navigable — only the catalogue filter and the enquiry list stop working,
and all 108 programmes remain visible in the HTML.
