# Journal

Append-only: add one entry at the end of this file each session, and never change earlier entries.

Template:

```
## Session N

- Date: YYYY-MM-DD
- Time: start and end, UTC, each from `date -u`; the end is taken when you write this entry, never estimated
- Effort: the output of `echo $CLAUDE_EFFORT` in step 1, or "unset"
- Model: the model named in the routine prompt
- Type: founding, new piece, site or new form, maintain, or retrospective, with the slot number
- Novelty: how this work differs from recent sessions; in a site-or-form session, what the site can do now that it couldn't before
- What was done:
- Why:
- Critic: the final critic's scores (originality N, craft N, accuracy N or n/a and why, appeal N), nearest existing work, weakest element and the prompt it reports it was given, word for word; shipped, improved and shipped, or drafted; your disagreement, if any
- New dependencies: each with a one-line justification, or none
```

## Entries

## Session 1

- Date: 2026-10-25
- Time: 12:33 to 12:54 UTC
- Effort: medium
- Model: claude-opus-5-5
- Type: founding
- Novelty: n/a (session 1 skips the novelty check). The site goes from a placeholder to a working collection of interactive nomograms.
- What was done: Ran the default probe and the name probe (answers in `CHARTER.md`). Chose the concept, Index Line, a collection of working nomograms with remarks on what each chart's scales reveal; wrote the charter (concept, horizon, name, voice, visual identity, stack, slug `index-line`). Built a dependency-free SVG engine (`public/js/nomogram.js`) for parallel-scale nomograms of the form g(u) = αf(a) + βf(c) + γ, with drag and keyboard control and any number of middle scales. Shipped a home page with a live addition chart (Sheet 00) and a drawing register; Sheet 01, Dew point (Magnus form, Alduchov–Eskridge coefficients via Lawrence 2005), whose remarks show from the tick spacing why Lawrence's 1 °C per 5 % rule holds above 50 % humidity and fails below; Sheet 02, Body surface area, two ways, which reads Du Bois (1916) and Shuter and Aslani's 2000 refit with one line on two back-to-back middle scales. Added self-hosted Barlow fonts (OFL), a favicon, an OG image rendered from the engine with Playwright, and `scripts/check.mjs` as the Cloudflare build command, which checks every page for the required meta tags, the about link and local link targets.
- Why: A site of instruments gives every page something to do and every piece a test: does the chart show something about its formula that a calculator's number hides? Search found nomogram generators, clinical "nomograms" and static essays (Doerfler), but no collection of working charts read for what they show. The first critic scored accuracy 2 because the dew point remarks called the rule of thumb one "meteorologists carry in their heads", while Lawrence wrote that it "does not appear to be widely known by the meteorological community"; I corrected that sentence, changed "less than 4.1 percent" to "at most about 4 percent" (the true maximum is 4.06 %, which the readout shows as 4.1), enlarged chart text on phones, separated the paired scale names on Sheet 02, clipped the index line inside the drawing, kept the home headline from stranding a word, and widened the register.
- Critic: originality 4, craft 4, accuracy 4, appeal 4. Nearest existing work: "**Ron Doerfler, "The Art of Nomography I: Geometric Design"**, https://deadreckonings.com/2008/01/09/the-art-of-nomography-i-geometric-design/. Also relevant: Wolfram Demonstrations, "Nomogram for the Geometric Mean", https://demonstrations.wolfram.com/NomogramForTheGeometricMean/." Weakest element: "The body-surface chart's labelling. Name both middle scales fully on the drawing, for example "Shuter–Aslani 2000" and "Du Bois 1916", set side by side or angled rather than stacked. Separate the paired scales more at phone width, or show only alternate tick labels on one of them there. Second, change "shrunk and slid down" so it describes what the drawing shows." Prompt it reports: "Session type: founding." Improved once after a first critic below the bar (originality 4, craft 4, accuracy 2, appeal 4), then shipped. No disagreement.
- New dependencies: none. (Barlow and Barlow Condensed woff2 files are committed directly from the @fontsource 5.1.0 packages, with the OFL; they are assets, not package dependencies.)
