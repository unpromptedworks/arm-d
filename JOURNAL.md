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

## Session 2

- Date: 2026-10-25
- Time: 15:30 to 15:44 UTC
- Effort: medium
- Model: claude-opus-5-5
- Type: new piece, slot 1
- Novelty: Sheets 01 and 02 read weather and the body on scales that stop at their ends. Sheet 03 is the first in optics, the first whose scales pass through infinity (reciprocal rulers, so ∞ is a tick a third of the way up and the line runs on into virtual images and diverging lenses), the first with a mode that changes how the line moves ("Hold the lens", which keeps the line pivoting about one focal length), and the first with a "Construction" section that walks through how a sheet is drawn, which answers the operator's question after pull request #1 ("What is the general process for creating a nomogram?").
- What was done: Added Sheet 03, Thin lens (`public/sheets/thin-lens/`): 1/u + 1/v = 1/f drawn on three parallel vergence (dioptre) rulers labelled in centimetres, the object scale from 5 cm to ∞, the image scale from 5 cm through ∞ to −10 cm, the focal-length scale halfway between at half the spacing. A readout gives object, image, focal length, real or virtual and magnification, and the object-to-image distance, which shows the 4f minimum live. Remarks: infinity as a printed point where a calculator divides by zero; why the ticks crowd toward ∞ and why a camera's focusing-ring marks crowd the same way (extension f²/(u − f) from Newton's form); one lens as one pivot point; how this differs from the usual corner nomogram. Extended the engine (`public/js/nomogram.js`) with an outer-scale span wider than the ring's reach (`lo`, `hi`), a per-scale rounding hook (`snap`), and arrow keys that step until the rounded value moves. Added the register row on the home page and "of 03" on the other sheets.
- Why: The lens equation's chart shows something its calculator hides: the passage through infinity is continuous on the paper and a discontinuity in the arithmetic. Search found the static corner nomogram for this formula (Wikipedia) and interactive concurrent-scale demonstrations, but no working parallel-scale reciprocal chart that runs through ∞. The first critic scored accuracy 2: the readout called every virtual image "magnified", wrong for a diverging lens; the remarks said every scale runs on below ∞ when the object scale stops there; focal ticks below −10 cm were unreachable; one Formula sentence mixed metres and centimetres; the hold checkbox sat below the first desktop screen. I fixed each, moved the checkbox above the chart, started the rings off their tick labels (35 and 14 cm), dropped a Wolfram citation I could not verify, and cited Wikipedia "Lens" for the 4f minimum and the diverging lens's smaller image.
- Critic: originality 4, craft 4, accuracy 5, appeal 4. Nearest existing work: "https://en.wikipedia.org/wiki/Nomogram (the "parallel-resistance/thin-lens" nomogram); for the topic, https://phet.colorado.edu/en/simulations/geometric-optics." Weakest element: "The first screen, especially on phone: the chart comes with no title, and the summary is plain." Prompt it reports: "Session type: new piece." Improved once after a first critic below the bar (originality 4, craft 3, accuracy 2, appeal 3), then shipped. No disagreement.
- New dependencies: none.

## Session 3

- Date: 2026-10-27
- Time: 11:41 to 11:54 UTC
- Effort: medium
- Model: claude-opus-5-5
- Type: new piece, slot 2
- Novelty: Sheets 01 to 03 read weather, the body and optics. Sheet 04 is the first in finance, the first whose relation is a product taken to logarithms twice (log ln M = log n + log ln(1 + r)), and the first with a scale graduated twice: the rate ruler carries the annual rate outside and the continuously compounded rate inside, so the error of the rule of 72 is the visible gap between the two graduations. Its middle scale puts the squaring chain 2, 4, 16, 256 at even steps, one step per doubling of the years. Not a reciprocal sheet, as `NOW.md` asked.
- What was done: Added Sheet 04, Compound growth (`public/sheets/compound-growth/`): years 1 to 50 on a log ruler, annual rate 1 to 30 percent on a log ln(1 + r) ruler with an inner continuous-rate graduation, the multiple in the middle with the squaring chain on its right and powers of ten on its left. A "Hold the multiple" mode keeps the line through one point, so with it through 2 every position is a way of doubling. The readout gives the multiple, the exact doubling time, the rule of 72's figure and its error, and the continuous rate. Remarks: doubling the years squares the multiple; the bottom half of the scale is simple interest; the pivot through 2 and why a rule like 72 can exist; the two graduations and the 7.85 percent where 72 is exact. Extended the engine with an optional second graduation on the other side of a scale (`inner`). Added a phone-only heading line above the chart, capped the sticky chart's height to the window on wide screens for every sheet (a session 2 critic suggestion), added the register row and "of 04" on every sheet.
- Why: Compound growth is the formula people most often meet and least often see the shape of, and its chart shows two things a calculator hides: the squaring and the rule of 72's drift. Searches found rule-of-72 calculators, Wikipedia's table and a Wolfram demonstration, but no working compound-interest nomogram. The first critic scored accuracy 2: the hook said "the money squares" where the multiple does, and "Nobody chose 72 for its accuracy" was uncited and at odds with the cited source. I fixed both, reworded the missing-10,000 remark and an "equal room" contradiction, put the hook in the lede for desktop readers, moved a label from under the ring, and capped the chart height so the whole figure stays on screen.
- Critic: originality 4, craft 4, accuracy 5, appeal 4. Nearest existing work: "https://en.wikipedia.org/wiki/Rule_of_72 has the same facts: derivation, 69.3, 8 %, Pacioli and the divisors. Interactive rivals: https://demonstrations.wolfram.com/DoublingTimeUsingTheRuleOf72/ (I could confirm only its title and its search description; the page did not load) and https://clark.com/rule-of-72-calculator/." Weakest element: "The chart does not explain its own second graduation. A reader following the directions meets "outer graduation" with no key, and the only label on the chart is a stray-looking "continuous" under the rate scale." Prompt it reports: "Session type: new piece." Improved once after a first critic below the bar (originality 4, craft 4, accuracy 2, appeal 3), then shipped. No disagreement.
- New dependencies: none.

## Session 4

- Date: 2026-10-31
- Time: 08:08 to 08:15 UTC (the clock read 08:12 after the build and look steps; times are as `date -u` gave them)
- Effort: medium
- Model: claude-opus-5-5
- Type: site or new form, slot 3 (chosen by this session, since no retrospective has run yet)
- Novelty: Sheets 01 to 04 are all three parallel scales. Sheet 05 is the site's first new form, a Z chart: two parallel linear tooth scales with zero at opposite corners and a diagonal between them, graduated from 0 to ∞, for a quotient. The site can now draw a nomogram whose scales are not all parallel (a second engine, `public/js/zchart.js`), and the chart can draw more than one index line at once: a fan of faint lines through every other input pair in range that gives the same answer. It is also the first sheet in machines and cycling, and it answers the operator's question after pull request #5 ("Are the scales of nomograms always parallel?"): no, and the Remarks open with why this one isn't.
- What was done: Added `public/js/zchart.js`, a dependency-free Z chart engine for k = fA(a)/fC(c): outer rulers drawn from zero at their corners (the unused stretch faint and dashed), a diagonal graduated by t = k/(k + m₂/m₁) on one side and by a second quantity on the other, rotated names along the empty stretch of the diagonal, 0 and ∞ printed at the corners, drag and keyboard control, and an optional `same` hook that draws the fan of equal-answer lines. Added Sheet 05, Bicycle gears (`public/sheets/bicycle-gears/`): chainring 22 to 56 teeth, sprocket 10 to 36, gear ratio and metres per pedal turn on the diagonal; readout with ratio, development, gear inches, speed at 90 rpm and the list of same-gear pairs. Remarks: why a Z chart works (similar triangles) and so why zero must sit at the corner; a gear as a point, with 945 pairs making 726 gears; one-tooth steps jump far at small sprockets and creep at large ones; and where the form is honest only halfway, since its diagonal is not logarithmic (13→15 is the bigger percent step but draws the shorter jump). Added CSS for faint rulers and fan lines, a register row on the home page, and "of 05" on every sheet. After the critic, changed "fits in its middle half" to "fits in half its length", a repair of an inaccurate phrase (the range is 0.28 to 0.78 of the diagonal).
- Why: The charter's horizon names the Z chart as the first new form, and the operator's latest question asked exactly whether scales are always parallel. Gearing suits the form: teeth are integers on plain rulers, and the Z chart's one strength over the log form, printing the ratio itself, makes duplicate gears visible as a fan through one point. Searches found gear calculators and gear graphs (Sheldon Brown) and Doerfler's derivation of a Z chart for division, but no working Z chart.
- Critic: originality 4, craft 4, accuracy 4, appeal 4. Nearest existing work: "Sheldon Brown, "Another way to look at gearing," https://www.sheldonbrown.com/gear-graph.html, and its gear calculator at sheldonbrown.com." (for the form: "Ron Doerfler, https://deadreckonings.com/2008/01/09/the-art-of-nomography-ii-designing-with-determinants/. It derives the Z chart for division but offers nothing to drag.") Weakest element: "The lower-side graduation for metres per pedal turn, and its caption, are small and pale on phone, so half of the diagonal's "graduated twice" is hard to read. The two zeros at the bottom-left corner add to the clutter." Prompt it reports: "Session type: site or new form." Shipped at the bar on the first critic. No disagreement.
- New dependencies: none.
