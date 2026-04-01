// JeffMD QBank Catalog
// Each entry describes a QBank available for all users.
// The actual question data lives in src/data/qbanks/<catalogId>.json
// and is lazy-loaded only when a user selects it.
//
// To add a new QBank:
//   1. Place the JSON file in src/data/qbanks/<catalogId>.json
//   2. Add an entry here
//   3. Push to GitHub — Vercel auto-deploys
//
// To update an existing QBank:
//   1. Edit the JSON file
//   2. Bump the `version` number here
//   3. Push — users will see an "Updated" badge

export const JEFFMD_CATALOG = [
  {
    catalogId: 'pulm-pharm-path',
    title: 'Pulm, Pharm & Path — Targeted Review',
    description: 'Pulmonology, pharmacology, pathology, hematology, endocrine, neuro, and immunology',
    questionCount: 32,
    tags: ['pulm', 'pharm', 'onc', 'heme', 'endo', 'neuro', 'immuno'],
    examLevel: 'step1',
    version: 1,
    addedDate: '2026-03-12',
  },
  {
    catalogId: 'renal-physiology-step1',
    title: 'Renal Physiology — High Yield Step 1',
    description: 'GFR, tubular transport, acid-base, diuretics, Starling forces, and hormonal regulation',
    questionCount: 20,
    tags: ['renal'],
    examLevel: 'step1',
    version: 1,
    addedDate: '2026-03-12',
  },
{
    catalogId: 'lippencott_ch16_renal_qbank',
    title: 'Lippencott Path Ch16 - Renal (JeffMD B5 relevant)',
    description: 'Pathology questions from Lippencott Ch 16 for block 5/Renal relevant to JeffMD',
    questionCount: 57,
    tags: ['renal'],
    examLevel: 'step1',
    version: 3,
    addedDate: '2026-03-12',
  },
{
  catalogId: 'lippencott_ch21_endocrine_qbank',
  title: 'Lippencott Path Ch21 - Endocrine (JeffMD B5 relevant)',
  description: 'Endocrine pathology: pituitary, parathyroid, thyroid, adrenal, and neuroendocrine disorders',
  questionCount: 14,
  tags: ['endo', 'renal'],
  examLevel: 'step1',
  version: 1,
  addedDate: '2026-04-01',
},
]
