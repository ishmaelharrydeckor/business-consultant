# Advisano Counsel – business consulting template

Static HTML/CSS/JS build of the **Advisano** homepage, translated from the Figma
export (1920px frame) and the live site `advisano.framer.website`.
No build step: open `index.html` or serve the folder with any static host.

```
index.html          page markup (one <section> per block)
css/fonts.css       self-hosted Inter (variable) + Instrument Serif
css/styles.css      design tokens (:root) + section styles + responsive rules
js/main.js          navbar, services hover, FAQ accordion, advisors carousel, counters, form
assets/             images, svgs, fonts, hero video
```

## Customising
- **Colours / sizes**: edit the tokens at the top of `css/styles.css` (`--yellow`, `--cream`, `--container`, …).
- **Copy / images**: edit `index.html`; images live in `assets/img/`.
- **Sections** are independent blocks (`hero`, `partners`, `about`, `services`, `process`,
  `cases`, `testimonials`, `pricing`, `advisors`, `blog`, `faq`, `cta`, `footer`) – copy, remove or reorder them freely.

## Notes
- Only the homepage is built; the nav/footer links to other pages (About, Case Studies, Pricing, Career, …) point at in-page anchors or `#`.
- The newsletter form is front-end only (validation + message); wire `#subscribeForm` to your email provider.
- Logos in the partner/testimonial rows are the template's placeholder "Logoipsum" marks.
