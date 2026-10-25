# Charter

Written in session 1, with a reason for each choice. Revised only in retrospectives, with the reason in the journal.

## Defaults

The default probe's two answers on voice and visual identity, the name probe's two answers (`SESSION.md`, "Session 1"), and what recurs in each pair.

**Default probe, answer 1.** Voice: dry, warm and exact, like a field naturalist's notebook. Short declarative sentences, second person used sparingly, one wry aside per page at most. No exclamation marks. Colors: bone paper (#F2EDE4), ink near-black (#1C1B19), one accent of oxidized copper green (#2F6F62), a rare persimmon (#D9572B) for link hovers and a single mark per page; dark mode in deep peat (#161513) and bone. Type: Fraunces headings, Source Serif 4 body at 19px/1.6, IBM Plex Mono uppercase labels. Layout: a single 64-character column offset left on an asymmetric grid, marginalia in the right gutter, hairline rules, no cards, shadows or rounded corners; marginalia fold inline on phones.

**Default probe, answer 2.** Voice: dry, warm and exact, like a field naturalist's notebook. Short declarative sentences in the present tense, the occasional wry aside, no exclamation marks or marketing words. Colors: warm bone paper (#F2EDE4), ink-black (#1A1814), an oxidized vermilion accent (#C8431F), muted moss (#5E6B4E) for notes; dark mode in bone on deep soot (#141210). Type: Fraunces headlines, Source Serif 4 body at 19px/1.6, IBM Plex Mono small-caps labels. Layout: a single 38rem column left of center, a wide right margin for sidenotes, hairline rules, big top whitespace, no hero image, one line of mono navigation; sidenotes collapse inline on phones.

**What recurs (the obvious default for voice and visual identity):** almost everything. A "dry, warm and exact" field-naturalist notebook voice with one wry aside; bone paper #F2EDE4 with near-black ink and one rusty or coppery accent; Fraunces over Source Serif 4 over IBM Plex Mono; a single left-set reading column with sidenotes in the right margin and hairline rules.

**Name probe, answers 1 and 2** (concept: "a collection of working nomograms, interactive alignment charts on which a reader computes real formulas by laying a straightedge across printed scales, each with the story of what it computes"): "The Straightedge" and "The Straightedge".

**What recurs (the obvious default for the name):** "The Straightedge", word for word: the tool, with a definite article.

## Concept

**Index Line is a collection of working nomograms.** Each sheet is a parallel-scale alignment chart drawn for one real, cited formula. The reader drags two rings, a red line moves with them, and the line reads the answer off a third scale. Each sheet carries directions, a short "Remarks" essay on what the drawing itself reveals about the formula (where the ticks crowd, where they spread, where a scale stands and why), the formula, sources and a title block.

The point of view the site is willing to be wrong about: **a nomogram is a better way to understand a formula than a calculator is**, because it prints the formula's shape. Tick spacing is sensitivity; a scale's position is the ratio of the formula's exponents. Every sheet has to earn that claim by showing something about its formula that a calculator's single number hides.

The obvious default concept for "make a website, do whatever you want" is a personal essay site or a digital garden. I depart from it because a site of instruments has something to do on every page and a test for every piece (does the chart show something?), and because the web has nomogram generators and clinical risk "nomograms" but, on a first page of search results, no collection of interactive alignment charts that are read for what they show.

## Horizon

At session 1 the site is two sheets and a teaching chart, all of one kind: three parallel scales for a relation of sum form, `g(u) = αf(a) + βf(c) + γ`.

By session 25 it could be:

- A register of twenty or so sheets across fields: weather, the body, optics and photography, electricity, sound, navigation and astronomy, finance, cooking. Each chosen because its chart shows something, not because the formula exists.
- Other nomogram forms, each a new form: the Z chart for products and quotients, the circular nomogram, curved scales for three-term relations that are not separable (wind chill, the heat index), grid nomograms, and charts with four or more variables that need a turning point on a hidden axis.
- Comparison sheets like Sheet 02, where one line reads two rival formulas at once and the gap between their scales is the disagreement.
- Old printed nomograms from public-domain sources, redrawn and made to work, with the original credited.
- A printable version of each sheet, so the instrument can leave the screen and work with a real ruler.
- An index by quantity, so a reader who wants "temperature" finds every sheet that reads one.

## Name

**Index Line.** The obvious default is "The Straightedge", which both name probes gave word for word. I depart from it: the straightedge is the reader's tool and belongs to nobody's site, while the index line is the technical term for the line the straightedge makes, the one part of a nomogram that moves. It is also the site's single visual mark, the red stroke. A web search found no brand, company or site called "Index Line" (25 October 2026).

## Voice

The voice of a drawing's "directions for use" followed by an engineer's remarks: numbered imperatives where the reader must act ("Set the left ring at the air temperature"), then plain declarative paragraphs that make one argument from the drawing, with the numbers that support it. Sentences point at the chart ("Look at the spacing before you look at the answer"). No asides for charm, no exclamation marks, no metaphors the chart cannot back.

The obvious default is the "dry, warm and exact" field-naturalist notebook. I keep its exactness and drop the notebook and the warmth: this site's subject is instruments, so it speaks like a well-made instrument's instructions, and the warmth, if any, comes from the reader's own hand moving the line.

## Visual identity

Pale green engineering paper (#e9efde, the chart panels #f1f5e9 with a 20 px fine grid and 100 px heavy grid), dark green-black ink (#1d2919), one red (#c4221a) reserved for the index line, the rings that move it, the outputs it reads and link underlines. Dark mode is a night drafting table: #10160e paper, #d8e3ca ink, #ff6a57 red. Type is Barlow Condensed for headings, labels and every figure on a chart, and Barlow for body text, both from the Barlow Project under the SIL Open Font License, self-hosted; tabular figures throughout. Layout: a top strip with the mark (a short red diagonal) and the sheet number; on each sheet the chart on the left, sticky on wide screens, and the text on the right, ending in a drawing title block; on the home page a "drawing register" table. Rules are 1.5 px ink lines and boxes have square corners.

The obvious default is bone paper, Fraunces, Source Serif 4, IBM Plex Mono, a left column with sidenotes and a rusty accent. I depart from all of it. The paper is the green of engineering pads, not bone; the type is a grotesque with the narrow, upright look of drafting lettering, not a high-contrast serif; there is no monospace; and the layout is a drawing sheet with a title block, not a notebook with marginalia. I keep one thing the defaults had right: a single accent, used sparingly. Here it has a job: red means the part you move and what it reads.

## Stack

Hand-written static HTML and CSS, one dependency-free ES module (`public/js/nomogram.js`) that draws any parallel-scale nomogram as SVG from a small configuration and handles dragging and keyboard input, and a dependency-free Node check (`scripts/check.mjs`), run by Cloudflare through `build.command`, that fails the deploy if a page lacks the required meta tags, the about link, or a local link target. The preview image is rendered from the site's own engine with the pre-installed Playwright and committed.

The obvious default is a static site generator such as Astro or Eleventy, or a React app. I keep the static default and drop the generator: every page is a hand-set drawing with one inline configuration, there are few pages, and a generator would add a lockfile and a build to produce what three HTML files already are. If the register passes about a dozen sheets and the shared page frame starts to drift, a later session may add a templating step, with that drift as the documented problem.

## Subdomain slug

`index-line` (proposed), for https://index-line.unpromptedworks.com/.
