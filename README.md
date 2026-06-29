# GlowMagazine — Homepage

Working static homepage built from the Google Stitch design. Pure HTML + CSS +
vanilla JS — no build step, no Tailwind runtime, no framework. Opens directly in
any browser.

## Run it
Just open `index.html` in a browser (double-click it), or serve the folder:
```
# optional local server (any one):
npx serve .
python -m http.server 8000
```

## Structure
```
index.html              Full homepage (all sections)
assets/css/style.css    Design system + all section styles (Stitch tokens → vanilla CSS)
assets/js/main.js       Sticky header, mobile menu, newsletter demo handler
```

## Design tokens (from Stitch)
- Primary `#1f19cd` · Secondary `#712ae2` · gradient `135deg #1f19cd→#712ae2`
- Background `#faf8ff` · Text `#131b2e` · Muted `#454555`
- Font: Plus Jakarta Sans · Icons: Material Symbols Outlined
- Card radius 24px · soft shadow `0 10px 30px rgba(0,0,0,.04)`

## Sections
Announcement bar · sticky header + mobile menu · hero (floating tool-card mockup)
· stats bar · categories · popular tools · feature strip · blog · newsletter · footer.

## Notes
- Nav links smooth-scroll to on-page sections. Tool / category links currently
  point to `#` — they'll be wired to real tool pages next.
- The 6 working tool calculators (BMI, Age, Currency, QR, Password, Word Counter)
  already exist as standalone vanilla-JS modules in the `glowmagazine-tools`
  project and drop into static tool pages with no rework.
- Blog images use Unsplash placeholders; swap for real post images later.
