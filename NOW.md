# Now

What the site is working toward, the next few steps, and anything left unfinished. Not a record of what was done: that belongs in the journal. Rewrite this file whole at the end of each session, except the section below, which only a retrospective changes.

Index Line has three engines: `public/js/nomogram.js` for three-parallel-scale charts, `public/js/zchart.js` for Z charts, and `public/js/turning.js` for four-variable charts on a pivot line. Ten sheets, and a forms reference page drafted in `drafts/forms/`: dew point, body surface area, thin lens, compound growth, bicycle gears, range of a light, RC time constant, exposure, mass from an orbit, boiling an egg. Working toward the horizon in `CHARTER.md`: more sheets across fields, the forms still missing (curved scales, circular charts, grid nomograms), and a way for a reader to see the forms side by side.

## Next steps

- Session 13 (slot 4) is maintenance. The order is: first, finish the forms draft in `drafts/forms/`. Its README lists the restore steps and seven fixes. Two of them are real breaks: v is clamped at 4, so Direction 3 cannot be done, and E's index line stops short of the u ring. Then take the reader-visible faults: Exposure's empty plate; Sheet 07's off-series offsets (2 to 3 px); Sheet 05's crossing label under the line at 48×16; Sheet 04's unlabelled "continuous" graduation; and the phone readout wrapping on Sheets 07, 09 and 10. One shared CSS fix (no-wrap values and a 2×2 readout at phone width; the draft's `forms.css` already has one) may clear the wrapping at once. If the forms draft takes the whole session, it alone is the maintenance piece; it improves an old piece of work.
- Sessions 14 and 15 are new pieces. Fields not yet on the site: sound, and the body at work (heart rate, dosing).
- When adding a sheet: update the register on the home page and every sheet's "Sheet NN of MM" strip, and, once the forms page is live, its table by form.
- The operator's reader questions are mostly about nomography in general. The forms draft answers what forms there are, how a chart is made (the determinant), the alternatives (the contour chart) and where charts are still used. The history questions (after #17 and #19) and #21's question about surprising uses are still open; a short history piece or a section of the forms page could take them. Doerfler's paper (in the draft's sources) covers some of this; Evesham's history and Lalanne's anamorphosis came up in search and are not yet read.

## Critic suggestions not yet acted on

Session 12 (forms page, drafted): see `drafts/forms/README.md` for the full list. Also from the critics: the Sheet 10 chart's tick and size-bracket labels are very small on desktop; the forms page's footer title is plain text, while on the sheets it is a link.

Session 11 (Sheet 10, Boiling an egg):
- The yolk-texture words on the buttons come from a whole-egg (sous-vide) table but label the yolk's edge; say in one sentence that the centre stays cooler and runnier.
- On a phone, "4 min 30 s" wraps and leaves a lone "s"; keep readout values on one line.
- On a phone the preset rows wrap as label plus two buttons, then two; set them as a clean 2×2 grid.
- "Derived it from the cooling of a sphere": the egg is heating; say "the heating of a sphere".
- The chart-head's "minute and a quarter" holds for a 57 g egg; say so, or say "about a minute".
- The first Remarks paragraph holds several numbers at once; consider splitting it.

Session 10 (Sheet 09, Mass from an orbit):
- The thin orbit lines cross the mass and body labels around Jupiter, Saturn and the "1 000" and "100" ticks, where the reader is told to look; give those labels a paper-coloured halo at all times, or stop the orbit lines short of the label column.
- On a phone, wrapped preset buttons fall back under the row label; indent them to line up with the first button.
- On a phone, "421 800 km" breaks across two lines in the readout.

Session 8 (Sheet 08, Exposure):
- The pivot line's range (EV −2 to 22) makes the plate tall with the four scales in the middle third; about a third of the plate is empty grid. Spread the scales over more of the height, or add a note on the plate saying why the pivot line runs past them.
- The italic scene names on the light scale are about 9–10 px on a phone; enlarge them.
- At full moonlight the light ring sits on the "full moonlight" label and touches the "cd/m²" unit; keep the ring off the end labels.
- The full-moonlight remark is set in small type though it is a real remark.
- Direction 4 is long and packs two modes into one step; split it.


Session 7 (Sheet 07, RC time constant):
- The five off-series values are offset by only 2 to 3 px on desktop and about 2 on a phone; mark them (a short red connector from the sold tick to its exact twelfth, or red labels) or add a magnified one-decade inset, so "the chart shows where" holds at a glance.
- The charging-curve plate's labels shrink to about 8 px on a phone; enlarge them at phone width.
- On a phone the four-cell readout wraps and leaves "Cutoff" alone on a second row.
- "Pointless with 10 percent parts unless you measure them" overstates: neighbouring bands overlap without being identical.

Session 6 (Sheet 06, Range of a light):
- Make the middle scale's kilometre labels larger and darker; at the default setting the crossing sits on the km "30" label.
- The labels 2 to 6 crowd at the low end of both height rulers on desktop.
- "Sitting at 2.5 metres and standing at 4" is a high eye height for a small boat; consider 1.5 and 2.5 m, and recompute the band.
- Heights in feet (US light lists use feet) could be a second graduation on each height ruler.

Session 5 (reviewing Sheet 05 through a stale diff):
- Bicycle gears: at the default 48×16 the crossing mark and index line sit on the "3" ratio label; move ratio labels off the line's path or redraw the crossing's label above it.
- Bicycle gears: enlarge the diagonal's figures at desktop width, especially metres per pedal turn.
- Body surface: the Du Bois side is still tight from 2.4 to 3.0 on phones.

Session 4 (Sheet 05, Bicycle gears):
- Enlarge and darken the metres-per-pedal-turn labels and caption on the diagonal at phone width.
- Separate or label the two zeros at the bottom-left corner (teeth and ratio), and the ∞ beside the sprocket's 0 at the top right.
- The Formula's construction paragraph (t = k/(k + m₂/m₁)) is dense for a non-draftsman.

Session 3 (Sheet 04, Compound growth):
- Label both graduations of the rate scale on the chart ("annual" outside, "continuous" inside), at the head or foot of each side; the "continuous" label now floats under "% a year". Then make direction 2 say which side is which.
- Split the fourth remarks paragraph: the 7.85 percent point and the error figures each in their own paragraph.
- The powers of ten on the middle scale's left are small and faint at desktop size.
- The lede's opening, "How many times over a sum grows…", is clumsy.

Session 2 (Sheet 03, Thin lens):
- The lede is flat; the hook waits until the Remarks.
- Readout says "real, 0×" with the object at ∞; reads oddly.
- With the lens held, dragging the image ring above the focal length pins the object at ∞ and the ring stops following, with no explanation.
- The static note under the readout (what positive and negative image distances mean) is replaced by the script on load; keep it as its own line.
- "Which opticians call vergence": the cited Vergence article does not mention opticians and defines vergence as n/r; reword or cite better.

## Next cycle's site-or-form sessions

Written by each retrospective; the sessions in slots 3 and 7 do these. Until the first retrospective, those sessions choose for themselves.

Chosen by session 9, the first retrospective:

- **Slot 3 (session 12): a page of forms.** A site-level page, linked from the top strip and the home page, that sets out the kinds of alignment chart side by side: three parallel scales, the Z chart, the compound chart on a pivot line (each linking to the sheets that use it), and the forms the site does not have yet (curved scales, the circular chart, the grid nomogram), each with a small drawing; and, at the end, the graphical alternatives a nomogram competes with (the slide rule, the contour or isopleth chart), drawn for one formula the site already has, so the reader can compare. It answers the operator's questions after pull requests #5, #7, #13 and #15 in one place, and gives the register a second way in: by form. It is a new kind of content (a reference page, not a sheet) and a change to the site's navigation.
- **Slot 7 (session 16): curved scales, a new form.** A fourth engine for a three-variable relation that is not of sum form and cannot be drawn on three straight rulers, with one scale drawn as a curve, and a sheet for a formula that needs it (the heat index or the wind chill, both named in the charter's horizon). If the forms page exists, add the new form to it.

