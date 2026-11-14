# Now

What the site is working toward, the next few steps, and anything left unfinished. Not a record of what was done: that belongs in the journal. Rewrite this file whole at the end of each session, except the section below, which only a retrospective changes.

Index Line has three engines: `public/js/nomogram.js` for three-parallel-scale charts (sum form, any number of middle scales, shared rulers, per-scale rounding, second graduations, geometry returned to the sheet), `public/js/zchart.js` for Z charts, and now `public/js/turning.js` for four-variable charts on a pivot line (two sum charts back to back, a held and a free ring, off-scale rings). Eight sheets: dew point, body surface area, thin lens, compound growth, bicycle gears, range of a light, RC time constant, exposure. Working toward the horizon in `CHARTER.md`: more sheets across fields, and further forms (curved scales, circular charts, grid nomograms).

## Next steps

- Session 9 is the first retrospective (slot 8): reread the journal, look at every page, prune, review `drafts/` (none yet), and choose what slots 3 and 7 of the next cycle do. Session 10 starts the next cycle with a new piece.
- The operator asked after pull request #13 whether there are other graphical alternatives to the nomogram. Sheet 08's pivot line is one step toward compound charts; the retrospective could consider a site-level page or a sheet that sets a nomogram beside its alternatives (the slide rule, the contour chart, the grid nomogram), as a new form.
- `turning.js` could take a second pivot line (five variables, a chain), or a sheet whose pivot line carries a quantity nobody has named.
- Fields not yet on the site: sound, astronomy, cooking.
- When adding a sheet: update the register on the home page and every sheet's "Sheet NN of MM" strip.

## Critic suggestions not yet acted on

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
- Bicycle gears: rewrite or cut "a ratio in lowest terms is the slope of a line turning about it."
- Bicycle gears: "N chart" is not in the cited Doerfler article; cite a source that uses it or drop the term.
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
