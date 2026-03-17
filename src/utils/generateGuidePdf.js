import { jsPDF } from 'jspdf'

// ── Page layout constants ─────────────────────────────────────────────────────
const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20
const PAGE_WIDTH = 210 // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const LINE_HEIGHT = 5.5
const SECTION_GAP = 8
const PAGE_BOTTOM = 280

// ── Helpers ──────────────────────────────────────────────────────────────────
function addPage(doc, y) {
  doc.addPage()
  return 16
}

function ensureSpace(doc, y, needed = 20) {
  if (y + needed > PAGE_BOTTOM) return addPage(doc, y)
  return y
}

function heading(doc, y, text) {
  y = ensureSpace(doc, y, 14)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(40, 40, 40)
  doc.text(text, MARGIN_LEFT, y)
  y += 2
  doc.setDrawColor(79, 195, 247)
  doc.setLineWidth(0.6)
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + doc.getTextWidth(text), y)
  return y + SECTION_GAP
}

function subheading(doc, y, text) {
  y = ensureSpace(doc, y, 12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(60, 60, 60)
  doc.text(text, MARGIN_LEFT, y)
  return y + LINE_HEIGHT + 1
}

function body(doc, y, text, indent = 0) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(50, 50, 50)
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent)
  for (const line of lines) {
    y = ensureSpace(doc, y)
    doc.text(line, MARGIN_LEFT + indent, y)
    y += LINE_HEIGHT
  }
  return y
}

function mono(doc, y, text, indent = 0) {
  doc.setFont('courier', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(30, 30, 30)
  const lines = text.split('\n')
  for (const line of lines) {
    y = ensureSpace(doc, y)
    doc.text(line, MARGIN_LEFT + indent, y)
    y += LINE_HEIGHT - 0.5
  }
  doc.setFont('helvetica', 'normal')
  return y
}

function bullet(doc, y, text, indent = 4) {
  y = ensureSpace(doc, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(50, 50, 50)
  doc.text('\u2022', MARGIN_LEFT + indent, y)
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent - 6)
  for (const line of lines) {
    y = ensureSpace(doc, y)
    doc.text(line, MARGIN_LEFT + indent + 6, y)
    y += LINE_HEIGHT
  }
  return y
}

function checkItem(doc, y, text, indent = 4) {
  y = ensureSpace(doc, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const lines = doc.splitTextToSize('\u2610 ' + text, CONTENT_WIDTH - indent)
  for (const line of lines) {
    y = ensureSpace(doc, y)
    doc.text(line, MARGIN_LEFT + indent, y)
    y += LINE_HEIGHT
  }
  return y
}

function separator(doc, y) {
  y = ensureSpace(doc, y, 6)
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  return y + 4
}

// ── Main PDF generator ──────────────────────────────────────────────────────
export function generateGuidePdf() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  // ── Title page ────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(79, 195, 247)
  doc.text('QBank Forge', MARGIN_LEFT, 30)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(80, 80, 80)
  doc.text('Question Bank Creation Guide', MARGIN_LEFT, 40)

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text('JSON schema, standardized tags, vignette structure,', MARGIN_LEFT, 50)
  doc.text('writing guidelines, and the complete Claude generation prompt.', MARGIN_LEFT, 56)

  let y = 72

  // ── 1. JSON Schema ────────────────────────────────────────────────────────
  y = heading(doc, y, '1. JSON Schema')
  y = body(doc, y, 'Save as a .json file and drag onto the Dashboard upload zone.')
  y += 2

  y = mono(doc, y, [
    '{',
    '  "config": {',
    '    "title": "Cardiology - High Yield Step 1",',
    '    "subtitle": "Heart failure, ACS, arrhythmias",',
    '    "passingFraction": 0.75,',
    '    "tags": { "cardio": { "label": "Cardiovascular" } }',
    '  },',
    '  "questions": [',
    '    {',
    '      "id": "q001",',
    '      "tag": "cardio",',
    '      "examLevel": "step1",',
    '      "system": "Cardiovascular",',
    '      "contentType": "Pathophysiology",',
    '      "stem": "A 67-year-old man with...",',
    '      "image": "/images/cardio/ecg_afib.png (optional)",',
    '      "imageAlt": "Description (optional)",',
    '      "imageCaption": "Caption (optional)",',
    '      "choices": ["Option A", "Option B", ...],',
    '      "answer": 0,',
    '      "explanation": "Why A is correct...",',
    '      "keypoints": ["Key fact 1", "Key fact 2"]',
    '    }',
    '  ]',
    '}',
  ].join('\n'), 2)

  y += 2
  y = body(doc, y, 'Fields: id (unique), tag (standardized ID), examLevel (step1/step2/step3), system (full name), contentType, stem (clinical vignette), choices (array of 3-11 options), answer (zero-based index), explanation (HTML string), keypoints (array of strings).')
  y += 2
  y = body(doc, y, 'Optional fields: image (URL or path to clinical image — place files in public/images/ and reference as "/images/topic/file.png", or use an external URL, or a base64 data URI), imageAlt (accessibility text), imageCaption (displayed below image). Legacy qbanks without image fields remain fully compatible.')

  // ── 2. Standardized Tags ──────────────────────────────────────────────────
  y += 4
  y = heading(doc, y, '2. Standardized Tags')
  y = body(doc, y, 'Use these exact tag IDs and system names. No variations.')
  y += 2

  const tags = [
    ['cardio', 'Cardiovascular', 'MI, HF, arrhythmias, valvular disease'],
    ['pulm', 'Pulmonary', 'COPD, asthma, pneumonia, PE'],
    ['gi', 'Gastrointestinal', 'GERD, peptic ulcer, hepatitis, pancreatitis'],
    ['renal', 'Renal/Urinary', 'AKI, CKD, acid-base, nephrotic syndrome'],
    ['heme', 'Hematology/Oncology', 'Anemia, leukemia, coagulation disorders'],
    ['onc', 'Hematology/Oncology', 'Solid tumors, chemotherapy mechanisms'],
    ['endo', 'Endocrine', 'Diabetes, thyroid, adrenal, pituitary'],
    ['repro', 'Reproductive', 'Contraception, STIs, PCOS, prostate'],
    ['msk', 'Musculoskeletal/Derm', 'RA, gout, osteoporosis, fractures'],
    ['derm', 'Musculoskeletal/Derm', 'Psoriasis, melanoma, acne, drug eruptions'],
    ['neuro', 'Neurology', 'Stroke, Parkinson\'s, seizure, MS'],
    ['psych', 'Psychiatry', 'Depression, bipolar, schizophrenia'],
    ['immuno', 'Immunology/ID', 'HIV, TB, sepsis, autoimmune disease'],
    ['id', 'Immunology/ID', 'Bacterial, viral, fungal infections'],
    ['pharm', 'Pharmacology', 'Drug mechanisms, side effects, PKs'],
    ['biochem', 'Biochemistry', 'Enzyme kinetics, metabolic pathways'],
    ['biostat', 'Biostatistics', 'Study design, sensitivity/specificity'],
    ['ethics', 'Medical Ethics', 'Informed consent, confidentiality'],
    ['epi', 'Epidemiology', 'Incidence, prevalence, risk factors'],
  ]

  // Table header
  y = ensureSpace(doc, y, 10)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(100, 100, 100)
  doc.text('TAG ID', MARGIN_LEFT, y)
  doc.text('SYSTEM', MARGIN_LEFT + 28, y)
  doc.text('EXAMPLE TOPICS', MARGIN_LEFT + 82, y)
  y += 1
  doc.setDrawColor(180, 180, 180)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  y += 4

  doc.setFont('courier', 'normal')
  doc.setFontSize(8)
  for (const [tagId, system, examples] of tags) {
    y = ensureSpace(doc, y)
    doc.setFont('courier', 'bold')
    doc.setTextColor(79, 195, 247)
    doc.text(tagId, MARGIN_LEFT, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    doc.text(system, MARGIN_LEFT + 28, y)
    doc.setTextColor(120, 120, 120)
    doc.text(examples, MARGIN_LEFT + 82, y)
    y += LINE_HEIGHT - 0.5
  }

  // ── 3. Vignette Structure ─────────────────────────────────────────────────
  y += 4
  y = heading(doc, y, '3. Vignette Structure (NBME Standard)')
  y = body(doc, y, 'Follow this order exactly:')
  y += 1
  const vignetteSteps = [
    'Age and sex: "A 34-year-old woman"',
    'Site of care: "presents to the ER" / "is seen in clinic"',
    'Chief complaint: "with chest pain"',
    'History of present illness: timeline, associated symptoms, relevant past history',
    'Physical examination: vital signs, then relevant organ system findings',
    'Labs and imaging: results in chronological order',
  ]
  for (let i = 0; i < vignetteSteps.length; i++) {
    y = bullet(doc, y, `${i + 1}. ${vignetteSteps[i]}`)
  }

  y += 2
  y = subheading(doc, y, 'Rules')
  y = bullet(doc, y, 'Include enough detail to make the clinical picture clear — avoid red herrings')
  y = bullet(doc, y, 'Eliminate excessive verbiage ("window dressing") — every sentence earns its place')
  y = bullet(doc, y, 'Every vignette tests the ability to apply basic science to clinical scenarios')
  y = bullet(doc, y, 'Each question must stand alone — no cross-question dependency')

  // ── 4. Lead-in Rules ──────────────────────────────────────────────────────
  y += 4
  y = heading(doc, y, '4. The Lead-In (Last Sentence of the Stem)')
  y = bullet(doc, y, 'Must end in a question mark — not a preposition or colon')
  y = bullet(doc, y, 'Must pose a clear, focused question answerable WITHOUT reading the options')
  y = bullet(doc, y, 'Must specify exactly what is being tested — diagnosis, mechanism, pharmacologic action, or next step')
  y = bullet(doc, y, 'Must require at least TWO cognitive steps (e.g., identify the disease then explain the mechanism)')
  y += 2
  y = subheading(doc, y, 'Avoid')
  y = bullet(doc, y, 'Never use negative phrasing: EXCEPT, NOT, or "which of the following is FALSE"')
  y = bullet(doc, y, 'Never use "Which of the following is true?" — cannot be answered without reading all options')

  // ── 5. Answer Choice Guidelines ───────────────────────────────────────────
  y += 4
  y = heading(doc, y, '5. Answer Choices (5 Options, A-E)')
  y = subheading(doc, y, 'Structure')
  y = bullet(doc, y, 'One correct (or BEST) answer; the others are distractors')
  y = bullet(doc, y, 'Typically 5 options (A-E); can range from 3 to 11')
  y = bullet(doc, y, 'All distractors must be HOMOGENEOUS — same category as the correct answer')
  y = bullet(doc, y, 'Information belongs in the STEM, not the answer choices — long stem, short choices')
  y = bullet(doc, y, 'All choices consistent in length and detail — correct answer must not stand out')
  y = bullet(doc, y, 'No "All of the above" or "None of the above"')
  y = bullet(doc, y, 'Randomize the correct answer position across the question set')

  y += 2
  y = subheading(doc, y, 'Writing Process')
  y = bullet(doc, y, '1. Write the correct answer first')
  y = bullet(doc, y, '2. Write 4 distractors as PERMUTATIONS of the correct answer')
  y = bullet(doc, y, '3. The correct answer must be unambiguously best')
  y = bullet(doc, y, '4. Randomize order; vary correct answer index across the set')

  y += 2
  y = subheading(doc, y, 'Flaws to Avoid')
  y = bullet(doc, y, 'Cluing: don\'t echo stem language in the correct answer')
  y = bullet(doc, y, 'Convergence traps: don\'t write outlier distractors identifiable by elimination')
  y = bullet(doc, y, 'Padded answers: no parenthetical explanations inside options')
  y = bullet(doc, y, 'Window dressing: every word in the stem earns its place')

  // ── 6. Explanation & Keypoints ────────────────────────────────────────────
  y += 4
  y = heading(doc, y, '6. Explanation (3-5 Sentences)')
  y = bullet(doc, y, 'Sentence 1: Why the correct answer is right (mechanism/reason)')
  y = bullet(doc, y, 'Sentences 2-3: Why 1-2 major distractors are wrong and what misconception they target')
  y = bullet(doc, y, 'Sentences 4-5 (optional): Clinical pearl or board-relevant fact')

  y += 4
  y = heading(doc, y, '7. Keypoints (3-4 Bullet Points)')
  y = bullet(doc, y, 'Mark 1-2 high-yield facts with a star')
  y = bullet(doc, y, 'Include trial names, mnemonics, diagnostic criteria, or management rules')
  y = bullet(doc, y, 'Do not repeat the explanation — add new board-relevant information')

  // ── 8. Answer Index & Randomization ───────────────────────────────────────
  y += 4
  y = heading(doc, y, '8. Answer Index & Randomization')
  y = bullet(doc, y, 'The "answer" field is the zero-based index in your choices[] array')
  y = bullet(doc, y, 'The app re-shuffles choices on every session load (when shuffle is enabled)')
  y = bullet(doc, y, 'Distribute correct answers evenly: some at index 0, 1, 2, 3, 4')

  // ── 9. Checklist ──────────────────────────────────────────────────────────
  y += 4
  y = heading(doc, y, '9. Final Checklist')
  y = subheading(doc, y, 'Vignette')
  y = checkItem(doc, y, 'Age/sex first')
  y = checkItem(doc, y, 'Site of care')
  y = checkItem(doc, y, 'HPI -> PE -> labs in order')
  y = checkItem(doc, y, 'No red herrings')
  y = checkItem(doc, y, 'No window dressing')
  y = checkItem(doc, y, 'Standalone (no cross-question dependency)')

  y += 2
  y = subheading(doc, y, 'Lead-In')
  y = checkItem(doc, y, 'Ends in ?')
  y = checkItem(doc, y, 'Specific task')
  y = checkItem(doc, y, 'Answerable without options')
  y = checkItem(doc, y, 'Requires >= 2 cognitive steps')
  y = checkItem(doc, y, 'No EXCEPT/NOT/FALSE')

  y += 2
  y = subheading(doc, y, 'Choices')
  y = checkItem(doc, y, 'Homogeneous category')
  y = checkItem(doc, y, 'Consistent length')
  y = checkItem(doc, y, 'No All/None of the above')
  y = checkItem(doc, y, 'No cluing, no convergence traps, no padded answers')
  y = checkItem(doc, y, 'Correct index varies across set')

  y += 2
  y = subheading(doc, y, 'Explanation & Keypoints')
  y = checkItem(doc, y, 'Correct answer mechanism explained')
  y = checkItem(doc, y, 'Distractor reasoning addressed')
  y = checkItem(doc, y, '3-4 keypoint bullets, high-yield marked with star')
  y = checkItem(doc, y, 'No explanation repeats in keypoints')

  y += 2
  y = subheading(doc, y, 'Tagging')
  y = checkItem(doc, y, 'Tag from standardized list')
  y = checkItem(doc, y, 'examLevel set')
  y = checkItem(doc, y, 'System exact match')
  y = checkItem(doc, y, 'contentType from standard list')

  // ── 10. Content Types ─────────────────────────────────────────────────────
  y += 4
  y = heading(doc, y, '10. Content Types')
  y = body(doc, y, 'Use one of: Pathophysiology, Pharmacology, Diagnosis, Management, Anatomy, Microbiology, Biochemistry, Biostatistics, Ethics, Epidemiology')

  // ── Footer on each page ───────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(150, 150, 150)
    doc.text(`QBank Forge — Question Bank Creation Guide`, MARGIN_LEFT, 290)
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH - MARGIN_RIGHT, 290, { align: 'right' })
  }

  doc.save('QBank_Forge_Guide.pdf')
}
