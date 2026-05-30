# Exam logos

Put **official** exam/organization logos in this folder so they can be shown on the Exams page (near exam names).

Current file names used by the UI:
- `ssc.jpg`
- `rrb.svg`
- `ibps.png`
- `sbi.svg`
- `rbi.svg`
- `upsc.png`
- `placeholder.svg` (fallback)

You can use `.svg` / `.png` / `.jpg`.

## Hybrid logo loading (recommended)
The Exams page loads logos in this order:
1) **Per-exam logo** (if you add one):
   - `public/exam-logos/exams/{examId}.png`
   - `public/exam-logos/exams/{examId}.svg`
   - `public/exam-logos/exams/{examId}.jpg`
2) **Organization logo** (from `public/exam-logos/`)
3) Fallback: `placeholder.svg`

So you can gradually add logos exam-by-exam without breaking anything.
