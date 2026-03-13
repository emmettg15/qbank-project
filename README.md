# QBank Pro

A full-featured USMLE question bank app built with React + Vite. All data lives in your browser's localStorage — no account, no server, fully offline after first load.

---

## Quick Start

> **Analogy for conda users:** `npm install` = `conda install`, `npm run dev` = running your analysis script, `node_modules/` = your conda environment folder (never touch it manually).

### 1. Install Node.js (one-time setup)

Open Terminal and run:

```bash
python3 -m pip install nodeenv
python3 -m nodeenv ~/.local/node --node=20.18.0 --prebuilt
```

Then add Node to your PATH by adding this line to your `~/.zshrc` (or `~/.bashrc`):

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Reload your shell:

```bash
source ~/.zshrc
```

Verify it worked:

```bash
node --version   # should print v20.18.0
npm --version    # should print 10.x.x
```

### 2. Install dependencies (one-time, run from project folder)

```bash
cd "/Users/emmettgrover/claudedata/pset project"
npm install
```

### 3. Start the app

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

To stop the server: press `Ctrl+C` in Terminal.

---

## Features

| Tab | What it does |
|-----|-------------|
| **Dashboard** | Stats overview, 5 recent sessions with donut charts, upload zone |
| **History** | Full session list with sort/filter, accuracy trend chart |
| **Labs** | NBME reference intervals — Step 1 mechanism callouts vs Step 2/3 clinical thresholds, searchable |
| **Calc** | Dark-themed 4-function calculator with keyboard support |

### During a session
- **Left-click** a choice to select it
- **Right-click** a choice to eliminate/restore it (process of elimination)
- **Tutor mode**: answer reveals immediately with explanation
- **Test mode**: select answer → click Submit to reveal; or click "Show Answer" without selecting
- **Per-question rating**: mark difficulty (Easy / Medium / Hard) and flag High Yield ⭐
- **Pause** button stops the timer

### Session Analysis
After finishing, the analysis page shows:
- Score donut + correct/wrong counts
- Accuracy broken down by organ system
- Time per question vs your goal
- Full question-by-question review (expandable, filterable by All / Wrong / Correct)
- Session notes + 1–5 star rating
- Export session as JSON

---

## Uploading a New Question Bank

The app accepts two formats:

### Format 1 — Your existing HTML file
Drag and drop your `targeted_review_qbank.html` (or any QBank HTML file that has a `<script id="qdata">` block) onto the upload zone on the Dashboard.

### Format 2 — JSON (for Claude-generated banks)
Ask Claude to generate a question bank in this exact schema and save it as a `.json` file:

```json
{
  "config": {
    "title": "Cardiology — High Yield Step 1",
    "subtitle": "Heart failure, ACS, arrhythmias, pathophysiology",
    "passingFraction": 0.75,
    "tags": {
      "cardio": { "label": "Cardiovascular", "color": "#ef4444" }
    }
  },
  "questions": [
    {
      "id": "q001",
      "tag": "cardio",
      "examLevel": "step1",
      "system": "Cardiovascular",
      "contentType": "Pathophysiology",
      "stem": "A 67-year-old man with a 10-year history of hypertension and type 2 diabetes presents to his cardiologist's office with progressive dyspnea on exertion and bilateral ankle swelling over the past 3 weeks. His BP is 148/92 mmHg, HR 88 bpm, RR 18, O₂ sat 94% on room air. Examination reveals JVD, bibasilar crackles, and pitting edema to the knees. Echocardiogram shows an ejection fraction of 30%. Which of the following best explains the mechanism by which aldosterone antagonists reduce mortality in this patient's condition?",
      "choices": [
        "Inhibition of tubular sodium reabsorption reduces preload and attenuates myocardial fibrosis",
        "Blockade of beta-1 adrenergic receptors decreases heart rate and reduces myocardial oxygen demand",
        "Inhibition of angiotensin-converting enzyme prevents conversion of angiotensin I to angiotensin II",
        "Activation of natriuretic peptide receptors promotes diuresis and reduces ventricular wall stress",
        "Blockade of L-type calcium channels reduces afterload and improves diastolic relaxation"
      ],
      "answer": 0,
      "explanation": "Aldosterone antagonists (e.g., spironolactone) reduce mortality in HFrEF by blocking aldosterone receptors in the kidney (reducing Na+ reabsorption and K+ loss) and in the myocardium (attenuating fibrosis and ventricular remodeling). Beta-blockers (choice B) reduce heart rate but act through adrenergic, not aldosterone, pathways. ACE inhibitors (choice C) also reduce mortality in HFrEF but via a different RAAS mechanism. The RALES trial demonstrated a 30% reduction in mortality with spironolactone in NYHA III-IV HFrEF.",
      "keypoints": [
        "⭐ RALES trial: spironolactone ↓ all-cause mortality 30% in NYHA III–IV HFrEF (EF < 35%)",
        "⭐ Dual mechanism: renal (↓ Na+ retention, ↓ K+ wasting) + cardiac (↓ myocardial fibrosis)",
        "Monitor K+ > 5.0 mEq/L and Cr > 2.5 mg/dL — stop if hyperkalemia develops",
        "HFrEF triple therapy: ACEi/ARB + beta-blocker + aldosterone antagonist = mortality ↓"
      ]
    }
  ]
}
```

**Tip:** Save Claude's response as `cardio_step1.json` and drop it on the Dashboard. The app reads `tag`, `system`, and `contentType` fields to power filtering and analytics.

---

## Prompt for Generating Question Banks with Claude

Copy and paste this complete prompt into a Claude conversation. Replace `[N]` and `[TOPIC]` then send.

```
Generate [N] USMLE Step 1 questions about [TOPIC].

Use this exact JSON format — the structure is required for compatibility with my question bank app:
{
  "config": { "title": "...", "subtitle": "...", "passingFraction": 0.75, "tags": { "[tag_id]": { "label": "[System Name]" } } },
  "questions": [
    {
      "id": "q001",
      "tag": "USE STANDARDIZED TAG ID (see list below)",
      "examLevel": "step1",
      "system": "USE STANDARDIZED SYSTEM NAME (see list below)",
      "contentType": "Pathophysiology | Pharmacology | Diagnosis | Management | Anatomy | Microbiology | Biochemistry | Biostatistics | Ethics | Epidemiology",
      "stem": "clinical vignette",
      "choices": ["...", "...", "...", "...", "..."],
      "answer": 0,
      "explanation": "...",
      "keypoints": ["...", "..."]
    }
  ]
}

═══════════════════════════════════════════════════════════════
STANDARDIZED TAGS — use these exact values, no variations
═══════════════════════════════════════════════════════════════
tag ID       → system field value               → example topics
cardio       → Cardiovascular                   → MI, HF, arrhythmias, valvular disease
pulm         → Pulmonary                        → COPD, asthma, pneumonia, PE
gi           → Gastrointestinal                 → GERD, peptic ulcer, hepatitis, pancreatitis
renal        → Renal/Urinary                    → AKI, CKD, acid-base, nephrotic syndrome
heme         → Hematology/Oncology              → Anemia, leukemia, coagulation disorders
onc          → Hematology/Oncology              → Solid tumors, chemotherapy mechanisms
endo         → Endocrine                        → Diabetes, thyroid, adrenal, pituitary
repro        → Reproductive                     → Contraception, STIs, PCOS, prostate
msk          → Musculoskeletal/Dermatology      → RA, gout, osteoporosis, fractures
derm         → Musculoskeletal/Dermatology      → Psoriasis, melanoma, acne, drug eruptions
neuro        → Neurology                        → Stroke, Parkinson's, seizure, MS
psych        → Psychiatry                       → Depression, bipolar, schizophrenia
immuno       → Immunology/Infectious Disease    → HIV, TB, sepsis, autoimmune disease
id           → Immunology/Infectious Disease    → Bacterial, viral, fungal infections
pharm        → Pharmacology (Cross-cutting)     → Drug mechanisms, side effects, PKs
biochem      → Biochemistry (Cross-cutting)     → Enzyme kinetics, metabolic pathways
biostat      → Biostatistics (Cross-cutting)    → Study design, sensitivity/specificity
ethics       → Medical Ethics                   → Informed consent, confidentiality
epi          → Epidemiology                     → Incidence, prevalence, risk factors

═══════════════════════════════════════════════════════════════
VIGNETTE STRUCTURE (NBME standard — follow this order exactly)
═══════════════════════════════════════════════════════════════
1. Age and sex: "A 34-year-old woman"
2. Site of care: "presents to the ER" / "is seen in clinic" / "is admitted to the hospital"
3. Chief complaint: "with chest pain"
4. History of present illness: timeline, associated symptoms, relevant past history
5. Physical examination: vital signs, then relevant organ system findings
6. Labs and imaging: results in chronological order

Rules (NBME):
• Include enough detail to make the clinical picture clear — avoid red herrings (purposefully
  distracting data that lead away from the correct answer). Incidental findings are okay; traps are not
• Eliminate excessive verbiage ("window dressing") — every sentence in the vignette should be
  earning its place
• Every vignette is a patient story that tests the ability to apply basic science to clinical
  scenarios — never a dry fact-recall question
• Each question must stand alone — no question should depend on having answered another correctly

═══════════════════════════════════════════════════════════════
THE LEAD-IN (last sentence of the stem)
═══════════════════════════════════════════════════════════════
✓ Must end in a question mark — not a preposition or colon
   ✓ CORRECT: "Which of the following best explains this patient's symptoms?"
   ✗ WRONG:   "The most likely diagnosis is:" / "This patient most likely has:"

✓ Must pose a clear, focused question answerable WITHOUT reading the options
   Cover-the-options rule: a well-prepared student covers the choices, generates the answer
   independently, then confirms it in the options. If they can't, rewrite the question.

✓ Must specify exactly what is being tested — diagnosis, mechanism, pharmacologic action, or next step
   "Which of the following is the PRIMARY mechanism of this drug's action?"
   "What is the MOST LIKELY diagnosis?"
   "Which of the following drugs is MOST APPROPRIATE for this patient?"

✓ Must require at least TWO cognitive steps
   e.g., identify the disease from the vignette → then explain the underlying mechanism
   Questions test reasoning and problem-solving — not rote recall

✗ Never use negative phrasing: EXCEPT, NOT, or "which of the following is FALSE"
✗ Never use "Which of the following is true?" — cannot be answered without reading all options

═══════════════════════════════════════════════════════════════
ANSWER CHOICES (5 options, A–E)
═══════════════════════════════════════════════════════════════
Structure:
• One correct (or BEST) answer; the others are distractors designed to challenge knowledge
• Typically 5 options (A–E); can range from 3 to 11
• All distractors must be HOMOGENEOUS — all in the same category as the correct answer
  (all diagnoses, all mechanisms, all drugs, all lab values, etc.)
• Information belongs in the STEM, not the answer choices — long stem, short choices
  ✓ Concise 1-phrase answers    ✗ Two-line answers with embedded explanations
• All choices must be consistent in length and detail — the correct answer must not stand
  out by being longer, more elaborated, or more qualified than the distractors
• No "All of the above" or "None of the above"
• Randomize the correct answer position across the question set

Writing process (do this in order):
1. Write the correct answer first
2. Write 4 distractors as PERMUTATIONS of the correct answer — this ensures distractors share
   elements with the right answer, making it a fair test of discrimination, not elimination
   Best distractors represent what a student who almost understands the concept would choose:
   - Right drug, wrong mechanism (or right mechanism, wrong drug)
   - Related pathophysiology applied to the wrong condition
   - Similar disease or drug class confusion
3. The correct answer must be unambiguously best — not a coin-flip between two equally valid choices
4. Randomize the order; vary correct answer index across the set

Flaws to avoid:
✗ Cluing: don't echo stem language in the correct answer (e.g., stem says "unreal sensations"
  → don't make "derealization" the obviously matching choice)
✗ Convergence traps: don't write outlier distractors so obviously wrong that the correct
  answer is identifiable by elimination rather than knowledge
✗ Padded answers: no parenthetical explanations or instructional caveats inside any option
✗ Window dressing: every word in the stem earns its place — cut anything that doesn't affect
  the answer
✗ Cross-question dependency: each question stands alone, never relying on a previous answer

═══════════════════════════════════════════════════════════════
EXPLANATION (3–5 sentences)
═══════════════════════════════════════════════════════════════
Sentence 1: Why the correct answer is right (state the mechanism/reason)
Sentences 2–3: Why 1–2 major distractors are wrong and what misconception they target
Sentences 4–5 (optional): Clinical pearl or board-relevant fact

═══════════════════════════════════════════════════════════════
KEYPOINTS (3–4 bullet points)
═══════════════════════════════════════════════════════════════
• Mark 1–2 high-yield facts with ⭐
• Include trial names, mnemonics, diagnostic criteria, or management rules
• Do not repeat the explanation — add new board-relevant information

═══════════════════════════════════════════════════════════════
ANSWER INDEX & RANDOMIZATION
═══════════════════════════════════════════════════════════════
• The "answer" field is the zero-based index in your choices[] array
• The app will re-shuffle choices on every session load
• Across your question set, distribute correct answers evenly:
  some at index 0, some at 1, some at 2, some at 3, some at 4

═══════════════════════════════════════════════════════════════
FINAL CHECKLIST — verify every question before submitting
═══════════════════════════════════════════════════════════════
VIGNETTE:  □ Age/sex first  □ Site of care  □ HPI → PE → labs in order
           □ No red herrings  □ No window dressing  □ Standalone (no cross-question dependency)
LEAD-IN:   □ Ends in ?  □ Specific task  □ Answerable without options  □ Requires ≥2 cognitive steps
           □ No EXCEPT/NOT/FALSE  □ No weak leads
CHOICES:   □ Homogeneous category  □ Consistent length  □ No All/None
           □ Appropriate # of options  □ No cluing  □ No padded answers
           □ No convergence traps  □ Correct index varies across set
EXPLANATION: □ Correct answer mechanism  □ Distractor reasoning  □ Pearl
KEYPOINTS:   □ 3–4 bullets  □ ⭐ on high-yield  □ No explanation repeats
TAGGING:     □ tag from standardized list  □ examLevel set  □ system exact match
             □ contentType from standard list
```

---

## Data & Privacy

- **All data is stored locally** in your browser's localStorage (key prefix: `qbp_`).
- Nothing leaves your computer.
- To back up your data: go to Dashboard → History → Export any session as JSON.
- To clear all data: open browser DevTools → Application → Local Storage → delete all `qbp_*` keys.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / Next question |
| `1`–`9`, `0` | Select choice 1–10 (supports 3–11 choices) |
| `Space` | Pause / Resume timer |

---

## Deployment (share with classmates)

When you're ready to put this online:

1. Create a free account at [vercel.com](https://vercel.com)
2. Push the project to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   gh repo create qbank-pro --public --source=. --push
   ```
3. Import the repo in Vercel → it auto-deploys on every push
4. You get a free URL like `qbank-pro.vercel.app`

> Each user gets their own localStorage (sessions don't sync between devices yet — that's Phase 2 with Supabase).

---

## Future Roadmap

### Phase 2 — Multi-user (Supabase)
- Replace `src/hooks/useStorage.js` with Supabase client (1:1 schema mapping already designed)
- Add email/magic-link auth
- Shared question repository: rate questions collaboratively

### Phase 3 — AI Question Generation
- Add a "Generate Questions" button that calls the Claude API
- Input: topic + difficulty + exam level → outputs ready-to-use JSON
- Requires an Anthropic API key (~$0.001 per question)

---

## Project Structure

```
src/
├── App.jsx                  # View switcher / router
├── theme.css                # All styles (dark theme, IBM Plex fonts)
├── main.jsx                 # Entry point + seed data init
├── components/
│   ├── Dashboard.jsx        # Home screen
│   ├── ActiveSession.jsx    # Question engine UI
│   ├── SessionConfig.jsx    # Start-session modal
│   ├── SessionAnalysis.jsx  # Post-session deep dive
│   ├── AllSessions.jsx      # History + trend chart
│   ├── Labs.jsx             # NBME reference intervals
│   ├── Calculator.jsx       # 4-function calculator
│   └── shared/
│       ├── NavBar.jsx
│       ├── DonutChart.jsx   # SVG circular progress
│       └── TagBadge.jsx
├── hooks/
│   ├── useStorage.js        # localStorage CRUD (swap for Supabase later)
│   └── useSession.js        # Question engine state + timer
└── data/
    ├── seedQuestions.js     # 32 starter questions from original HTML
    └── labValues.js         # ~90 NBME reference values across 11 categories
```
