# Now

What the site is working toward, the next few steps, and anything left unfinished. Not a record of what was done: that belongs in the journal. Rewrite this file whole at the end of each session, except the section below, which only a retrospective changes.

Index Line has two engines: `public/js/nomogram.js` for three-parallel-scale charts (sum form, any number of middle scales, shared rulers, per-scale rounding, a second graduation on a scale's other side) and `public/js/zchart.js` for Z charts (quotient form, two parallel rulers from zero at opposite corners, a diagonal from 0 to ∞ graduated on both sides, a fan of equal-answer lines). Five sheets: dew point, body surface area, thin lens, compound growth, bicycle gears. Working toward the horizon in `CHARTER.md`: more sheets across fields, and further forms (curved scales, circular charts, four-variable charts with a turning axis).

## Next steps

- Session 5 is maintain (slot 4): work through the critic suggestions below, oldest first; the phone-only heading line (`.chart-head`) can go on Sheets 01 to 03.
- Sessions 6 and 7 are new pieces (slots 5 and 6); session 8 is site or new form (slot 7); session 9 is the first retrospective (slot 8).
- A later sheet could use the Z chart engine for another quotient whose duplicates or reciprocals matter (it handles any k = fA(a)/fC(c) with fA, fC linear; `inv` must invert f).
- The operator's question after pull request #1 (how a nomogram is made) is answered on Sheet 03's Construction section and Sheet 05's formula; a standalone page is still an option.
- When adding a sheet: update the register on the home page and every sheet's "Sheet NN of MM" strip.

## Critic suggestions not yet acted on

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
- Phone first screen is all chart, with no title; put the title and a hook ("infinity is an ordinary tick") above the chart at phone width, or in the caption. Same applies to Sheets 01 and 02; Sheet 04 has a `.chart-head` line that does this.
- The lede is flat; the hook waits until the Remarks.
- Readout says "real, 0×" with the object at ∞; reads oddly.
- With the lens held, dragging the image ring above the focal length pins the object at ∞ and the ring stops following, with no explanation.
- The static note under the readout (what positive and negative image distances mean) is replaced by the script on load; keep it as its own line.
- "Which opticians call vergence": the cited Vergence article does not mention opticians and defines vergence as n/r; reword or cite better.

Session 1:
- Sheet 02: name both middle scales fully on the drawing ("Shuter–Aslani 2000", "Du Bois 1916"), side by side or angled rather than stacked; at phone width separate the paired scales more or show alternate tick labels on one.
- Sheet 01: "shrunk and slid down" does not match the drawing; the middle scale is shrunk toward the top (its 45 lines up with the air scale's 45) and extends downward. Reword.
- Sheet 02: "about 65 kg" at 140 cm should be about 68 kg; "over most of it by one to three" percent holds for only about half the grid. Tighten both.
- Home: the chart uppercases scale names (shows "A + B") while the caption says "a + b"; the phone first screen has no picture.
- The body surface chart's right half is mostly empty, a consequence of the formula's scale ratio; a later layout could put the height scale nearer.

## Next cycle's site-or-form sessions

Written by each retrospective; the sessions in slots 3 and 7 do these. Until the first retrospective, those sessions choose for themselves.
