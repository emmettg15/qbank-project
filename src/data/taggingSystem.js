/**
 * taggingSystem.js — Standardized USMLE QBank Tagging Reference
 *
 * Single source of truth for all tag IDs, system names, and content types.
 * Used for:
 *   - Validating / normalizing uploaded question banks
 *   - Consistent filtering and display in SessionConfig, AllSessions, SessionAnalysis
 *   - Claude prompt reference (see README "Prompt for Generating Question Banks")
 *
 * When adding questions with Claude, always use these exact values.
 */

// ─── Tag definitions ─────────────────────────────────────────────────────────
// Each entry: { id, label, system, color, examples }
//   id      → used in JSON "tag" field
//   label   → display name in UI badges
//   system  → used in JSON "system" field (exact match required)
//   color   → CSS hex for TagBadge background tint

export const TAGS = [
  // ── Organ Systems ────────────────────────────────────────────────────────
  {
    id: 'cardio',
    label: 'Cardiovascular',
    system: 'Cardiovascular',
    color: '#ef4444',
    examples: 'MI, heart failure, arrhythmias, valvular disease, atherosclerosis, hypertension',
  },
  {
    id: 'pulm',
    label: 'Pulmonary',
    system: 'Pulmonary',
    color: '#3b82f6',
    examples: 'COPD, asthma, pneumonia, PE, interstitial lung disease, respiratory mechanics',
  },
  {
    id: 'gi',
    label: 'Gastrointestinal',
    system: 'Gastrointestinal',
    color: '#f97316',
    examples: 'GERD, peptic ulcer, Crohn\'s, UC, hepatitis, cirrhosis, pancreatitis, GI bleeding',
  },
  {
    id: 'renal',
    label: 'Renal/Urinary',
    system: 'Renal/Urinary',
    color: '#06b6d4',
    examples: 'AKI, CKD, electrolyte disorders, acid-base, nephrotic/nephritic syndromes',
  },
  {
    id: 'heme',
    label: 'Hematology',
    system: 'Hematology/Oncology',
    color: '#dc2626',
    examples: 'Anemia, leukemia, lymphoma, coagulation disorders, thrombosis, sickle cell',
  },
  {
    id: 'onc',
    label: 'Oncology',
    system: 'Hematology/Oncology',
    color: '#7c3aed',
    examples: 'Solid tumors, cancer pathophysiology, chemotherapy mechanisms, tumor markers',
  },
  {
    id: 'endo',
    label: 'Endocrine',
    system: 'Endocrine',
    color: '#d97706',
    examples: 'Diabetes mellitus, thyroid dysfunction, adrenal disorders, pituitary disorders, hypercalcemia',
  },
  {
    id: 'repro',
    label: 'Reproductive',
    system: 'Reproductive',
    color: '#ec4899',
    examples: 'Contraception, STIs, gynecologic cancers, amenorrhea, PCOS, infertility, prostate disease',
  },
  {
    id: 'msk',
    label: 'Musculoskeletal',
    system: 'Musculoskeletal/Dermatology',
    color: '#78716c',
    examples: 'Osteoarthritis, RA, gout, osteoporosis, fractures, back pain, compartment syndrome',
  },
  {
    id: 'derm',
    label: 'Dermatology',
    system: 'Musculoskeletal/Dermatology',
    color: '#a16207',
    examples: 'Psoriasis, eczema, melanoma, acne, fungal/bacterial skin infections, drug eruptions',
  },
  {
    id: 'neuro',
    label: 'Neurology',
    system: 'Neurology',
    color: '#8b5cf6',
    examples: 'Stroke, TIA, Parkinson\'s, Alzheimer\'s, seizure, meningitis, MS, peripheral neuropathy',
  },
  {
    id: 'psych',
    label: 'Psychiatry',
    system: 'Psychiatry',
    color: '#6366f1',
    examples: 'Depression, anxiety, bipolar, schizophrenia, personality disorders, substance abuse, ADHD',
  },
  {
    id: 'immuno',
    label: 'Immunology',
    system: 'Immunology/Infectious Disease',
    color: '#10b981',
    examples: 'HIV/AIDS, tuberculosis, sepsis, immunodeficiency, autoimmune disease, transplant rejection',
  },
  {
    id: 'id',
    label: 'Infectious Disease',
    system: 'Immunology/Infectious Disease',
    color: '#059669',
    examples: 'Bacterial, viral, fungal, parasitic infections, antibiotic resistance, vaccination',
  },

  // ── Cross-Cutting Disciplines ─────────────────────────────────────────────
  {
    id: 'pharm',
    label: 'Pharmacology',
    system: 'Pharmacology (Cross-cutting)',
    color: '#0ea5e9',
    examples: 'Drug mechanisms, adverse effects, drug interactions, pharmacokinetics, pharmacodynamics',
  },
  {
    id: 'biochem',
    label: 'Biochemistry',
    system: 'Biochemistry (Cross-cutting)',
    color: '#84cc16',
    examples: 'Enzyme kinetics, metabolic pathways, protein synthesis, DNA/RNA, cell signaling',
  },
  {
    id: 'biostat',
    label: 'Biostatistics',
    system: 'Biostatistics (Cross-cutting)',
    color: '#64748b',
    examples: 'Study design, statistics, sensitivity/specificity, odds ratios, p-values, NNT',
  },
  {
    id: 'ethics',
    label: 'Medical Ethics',
    system: 'Medical Ethics',
    color: '#94a3b8',
    examples: 'Informed consent, confidentiality, end-of-life care, research ethics, conflicts of interest',
  },
  {
    id: 'epi',
    label: 'Epidemiology',
    system: 'Epidemiology',
    color: '#475569',
    examples: 'Disease incidence/prevalence, risk factors, public health, epidemiologic study types',
  },
]

// ─── Content Types ────────────────────────────────────────────────────────────
// Standardized values for the "contentType" field.

export const CONTENT_TYPES = [
  {
    id: 'Pathophysiology',
    description: 'Mechanism of disease, normal and abnormal physiology',
  },
  {
    id: 'Pharmacology',
    description: 'Drug mechanisms, effects, adverse effects, interactions',
  },
  {
    id: 'Diagnosis',
    description: 'Clinical presentation, diagnostic tests, imaging, lab findings',
  },
  {
    id: 'Management',
    description: 'Treatment, prognosis, follow-up, complications',
  },
  {
    id: 'Anatomy',
    description: 'Anatomic structures, embryology, topography, histology',
  },
  {
    id: 'Microbiology',
    description: 'Pathogens, virulence factors, host-pathogen interactions, antimicrobials',
  },
  {
    id: 'Biochemistry',
    description: 'Molecular mechanisms, metabolism, gene expression, cell biology',
  },
  {
    id: 'Biostatistics',
    description: 'Study design, statistical measures, interpretation of results',
  },
  {
    id: 'Ethics',
    description: 'Professional responsibility, ethical principles, medico-legal scenarios',
  },
  {
    id: 'Epidemiology',
    description: 'Population-level disease patterns, risk factors, public health',
  },
]

// ─── Exam Levels ──────────────────────────────────────────────────────────────

export const EXAM_LEVELS = [
  { id: 'step1', label: 'Step 1', description: 'Basic science mechanisms and pathophysiology' },
  { id: 'step2', label: 'Step 2 CK', description: 'Clinical knowledge, diagnosis, and management' },
  { id: 'step3', label: 'Step 3', description: 'Patient management, preventive medicine, biostatistics' },
]

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Look up a tag definition by id (case-insensitive). Returns undefined if not found. */
export function getTag(id) {
  return TAGS.find(t => t.id === id?.toLowerCase())
}

/** Get the display label for a tag id, falling back to the raw id if unknown. */
export function getTagLabel(id) {
  return getTag(id)?.label ?? id
}

/** Get the color hex for a tag id, falling back to a neutral gray. */
export function getTagColor(id) {
  return getTag(id)?.color ?? '#64748b'
}

/**
 * Normalize an uploaded question's tag fields to the closest valid values.
 * Handles common mismatches like "cardiology" → "cardio", "endocrine/repro" → "endo".
 * Returns the question unchanged if no match is found.
 */
export function normalizeQuestionTags(q) {
  if (!q) return q

  // Build a map of known aliases → canonical id
  const ALIASES = {
    // cardio variants
    cardiology: 'cardio', cardiovascular: 'cardio', 'cv': 'cardio', heart: 'cardio',
    // pulm variants
    pulmonary: 'pulm', respiratory: 'pulm', lung: 'pulm',
    // gi variants
    gastrointestinal: 'gi', gastro: 'gi', hepatic: 'gi', liver: 'gi',
    // renal variants
    renal: 'renal', nephro: 'renal', kidney: 'renal', urinary: 'renal', nephrology: 'renal',
    // heme variants
    hematology: 'heme', blood: 'heme',
    // onc variants
    oncology: 'onc', cancer: 'onc', tumor: 'onc',
    // endo variants
    endocrine: 'endo', endocrinology: 'endo', 'endo/repro': 'endo',
    // repro variants
    reproductive: 'repro', ob: 'repro', obgyn: 'repro', gynecology: 'repro', obstetrics: 'repro',
    // msk variants
    musculoskeletal: 'msk', orthopedics: 'msk', rheumatology: 'msk',
    // derm variants
    dermatology: 'derm', skin: 'derm',
    // neuro variants
    neurology: 'neuro', neuroscience: 'neuro', neuro: 'neuro',
    // psych variants
    psychiatry: 'psych', behavioral: 'psych', mental: 'psych',
    // immuno variants
    immunology: 'immuno', immune: 'immuno', autoimmune: 'immuno',
    // id variants
    'infectious disease': 'id', 'infectious': 'id', microbio: 'id', infection: 'id',
    // pharm variants
    pharmacology: 'pharm', medications: 'pharm', drugs: 'pharm',
    // biochem variants
    biochemistry: 'biochem', molecular: 'biochem', metabolism: 'biochem',
    // biostat variants
    biostatistics: 'biostat', statistics: 'biostat', stats: 'biostat', epi: 'epi',
  }

  const rawTag = q.tag?.toLowerCase()?.trim()
  const normalizedId = ALIASES[rawTag] ?? (getTag(rawTag) ? rawTag : q.tag)

  const tagDef = getTag(normalizedId)

  return {
    ...q,
    tag: normalizedId ?? q.tag,
    system: q.system ?? tagDef?.system ?? q.system,
  }
}

/**
 * Returns all unique tags present in a question array.
 * Useful for populating SessionConfig filter checkboxes.
 */
export function getTagsFromQuestions(questions = []) {
  const seen = new Set()
  return questions
    .map(q => q.tag)
    .filter(t => t && !seen.has(t) && seen.add(t))
    .map(id => ({ id, ...( getTag(id) ?? { label: id, color: '#64748b' }) }))
}
