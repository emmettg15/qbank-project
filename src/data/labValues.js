/**
 * USMLE Reference Intervals
 * Source: NBME Reference Interval Table (same values used across Step 1, 2 CK, Step 3)
 *
 * Each entry:
 *   name         — analyte name
 *   ref          — reference range string
 *   units        — units string
 *   step1        — Step 1 mechanism callout (string, or null)
 *   step23       — Step 2/3 clinical threshold / management callout (string, or null)
 *   flag         — 'low' | 'high' | null  (for common high-yield direction)
 */

export const LAB_CATEGORIES = [
  {
    id: 'serum_chem',
    label: 'Serum Chemistry',
    values: [
      { name: 'Sodium (Na⁺)',          ref: '136–145',      units: 'mEq/L',  step1: 'Hyponatremia: SIADH most common; hypernatremia = free water deficit', step23: 'Correct Na by ≤8–10 mEq/L per day to prevent osmotic demyelination syndrome' },
      { name: 'Potassium (K⁺)',         ref: '3.5–5.0',      units: 'mEq/L',  step1: 'Hypokalemia: ↑aldosterone, loop/thiazide diuretics, vomiting; ↓K+ shifts inward → hyperpolarization', step23: 'Tx: K+ ≥2.5 → oral KCl; <2.5 or symptomatic → IV; critical <2.0 → ECG (U waves, flat T)' },
      { name: 'Chloride (Cl⁻)',         ref: '98–106',       units: 'mEq/L',  step1: 'Hyperchloremia = non-anion gap metabolic acidosis; hypochloremia = metabolic alkalosis (vomiting)', step23: null },
      { name: 'Bicarbonate (HCO₃⁻)',    ref: '22–28',        units: 'mEq/L',  step1: 'Primary metabolic alkalosis: ↑HCO₃; metabolic acidosis: ↓HCO₃; check compensation', step23: 'Metabolic acidosis with HCO₃ <15: consider bicarbonate therapy in HAGMA with pH <7.1' },
      { name: 'BUN',                    ref: '8–20',         units: 'mg/dL',  step1: 'Elevated in prerenal (↑BUN/Cr ratio >20:1), intrinsic renal failure, postrenal obstruction', step23: 'BUN/Cr >20:1 favors prerenal azotemia; GI bleed also elevates BUN (protein absorption)' },
      { name: 'Creatinine',             ref: '0.6–1.2',      units: 'mg/dL',  step1: 'Freely filtered, not reabsorbed; rises when GFR ↓ by ~50%; muscle-derived, not affected by diet', step23: 'Acute rise >0.3 mg/dL or >50% baseline = AKI; AKI staging: KDIGO criteria (creatinine + urine output)' },
      { name: 'Glucose (fasting)',       ref: '70–100',       units: 'mg/dL',  step1: 'Glucokinase (liver) and hexokinase (peripheral); GLUT2 = liver/β-cell; GLUT4 = insulin-sensitive (muscle, fat)', step23: 'DM diagnosis: FPG ≥126 mg/dL (×2), OGTT ≥200 mg/dL, or HbA1c ≥6.5%; pre-DM: FPG 100–125 (IFG)' },
      { name: 'Calcium (total)',         ref: '8.5–10.5',     units: 'mg/dL',  step1: 'PTH: ↑bone resorption, ↑renal Ca reabsorption, ↑1,25-D3; hypercalcemia: "Bones, stones, groans, thrones"', step23: 'Corrected Ca = measured Ca + 0.8 × (4.0 − albumin); symptomatic hypercalcemia (Ca >12) → IV fluids + bisphosphonates' },
      { name: 'Phosphate',              ref: '3.0–4.5',       units: 'mg/dL',  step1: 'Hypophosphatemia: refeeding syndrome, vitamin D deficiency, hyperparathyroidism; PTH ↑phosphaturia', step23: 'Severe hypophosphatemia (<1 mg/dL): respiratory failure (impairs ATP-driven diaphragm contraction)' },
      { name: 'Magnesium (Mg²⁺)',        ref: '1.7–2.2',      units: 'mg/dL',  step1: 'Hypomagnesemia causes refractory hypokalemia (Mg²⁺ required to maintain K⁺ channel function)', step23: 'Check Mg before treating refractory hypokalemia; Mg sulfate: eclampsia, torsades de pointes' },
      { name: 'Uric acid (serum)',       ref: '3.5–8.0',      units: 'mg/dL',  step1: 'Hyperuricemia: pyrazinamide, thiazides, Lesch-Nyhan; xanthine oxidase inhibition: allopurinol, febuxostat', step23: 'Gout attack: colchicine, NSAIDs, glucocorticoids; urate-lowering: hold during acute attack' },
      { name: 'Lactate',                ref: '0.5–1.5',       units: 'mmol/L', step1: 'Type A: ↓tissue perfusion (shock); Type B: metformin, hepatic failure, malignancy, B1 deficiency', step23: 'Lactate >2 = hyperlactatemia; >4 + hypotension = septic shock (Sepsis-3); serial lactate guides resuscitation' },
      { name: 'Osmolality (serum)',      ref: '275–295',       units: 'mOsm/kg', step1: 'Calculated: 2[Na] + glucose/18 + BUN/2.8; osmol gap >10 = unmeasured osmoles (methanol, ethylene glycol, ethanol)', step23: 'Osmol gap + HAGMA + vision changes = methanol toxicity → fomepizole' },
    ]
  },
  {
    id: 'cbc',
    label: 'Complete Blood Count',
    values: [
      { name: 'WBC',                    ref: '4,500–11,000',  units: '/µL',    step1: 'Leukocytosis: infection, leukemia, steroids (demargination), stress; leukopenia: agranulocytosis, aplastic anemia', step23: 'ANC <500 = severe neutropenia → reverse isolation, empiric antibiotics for febrile neutropenia (cefepime)' },
      { name: 'Neutrophils',            ref: '54–62%',        units: '%',      step1: 'Left shift = immature bands; toxic granules = severe infection; hypersegmented polys = B12/folate deficiency', step23: null },
      { name: 'Lymphocytes',            ref: '23–33%',        units: '%',      step1: 'Atypical lymphocytes = EBV (heterophile+), CMV; CD4+ = helper T; CD8+ = cytotoxic T', step23: null },
      { name: 'Monocytes',              ref: '3–7%',          units: '%',      step1: 'Monocytosis: chronic infections, TB, sarcoidosis; monocytes → macrophages/dendritic cells in tissues', step23: null },
      { name: 'Eosinophils',            ref: '1–4%',          units: '%',      step1: 'NAACP: Neoplasm, Asthma/Allergy, Addison, Collagen-vascular, Parasites; IL-5 drives eosinophil production', step23: 'Eosinophilia >1500: hypereosinophilic syndrome → end-organ damage (heart, nerve); eosinophilic esophagitis' },
      { name: 'Basophils',              ref: '0–1%',          units: '%',      step1: 'Basophilia: CML (high-yield marker), chronic inflammation; basophils contain histamine/heparin', step23: null },
      { name: 'Hgb (Male)',             ref: '13.5–17.5',     units: 'g/dL',   step1: 'Hgb drop: anemia; Hgb S: sickling; Hgb C: crystals; Hgb A2 ↑: β-thalassemia trait', step23: 'Transfusion threshold: Hgb <7 (stable), <8 (ACS, surgical), <10 (bone marrow failure); always individualize' },
      { name: 'Hgb (Female)',           ref: '12.0–16.0',     units: 'g/dL',   step1: null, step23: null },
      { name: 'Hct (Male)',             ref: '41–53%',        units: '%',      step1: 'Hematocrit ≈ 3 × Hgb; polycythemia vera: Hct >60% (male), >56% (female)', step23: null },
      { name: 'Hct (Female)',           ref: '36–46%',        units: '%',      step1: null, step23: null },
      { name: 'MCV',                    ref: '80–100',        units: 'fL',     step1: 'Microcytic (<80): iron-deficiency, thalassemia, sideroblastic, chronic disease; macrocytic (>100): B12/folate deficiency, liver disease, hypothyroid, MDS', step23: 'Hypersegmented neutrophils + macrocytic anemia: check B12, folate, homocysteine, methylmalonic acid' },
      { name: 'MCH',                    ref: '25–35',         units: 'pg',     step1: 'MCH = Hgb/RBC count; low in iron deficiency (hypochromic microcytic)', step23: null },
      { name: 'MCHC',                   ref: '31–36',         units: 'g/dL',   step1: 'MCHC >36 (hyperchromia): hereditary spherocytosis; MCV + MCHC help narrow anemia DDx', step23: null },
      { name: 'Platelets',              ref: '150,000–400,000', units: '/µL',  step1: 'Thrombocytopenia: ITP (antiplatelet Ab), TTP (ADAMTS13 deficiency), HIT (heparin → PF4-antibody), DIC', step23: 'Platelet transfusion threshold: <10K (spontaneous bleed risk), <50K (procedure/surgery), <100K (neurosurgery)' },
      { name: 'Reticulocytes',          ref: '0.5–1.5%',      units: '%',      step1: 'Corrected reticulocyte count = reticulocyte% × (Hct/45); reticulocyte index >2% = hyperproliferative (hemolysis, bleeding)', step23: 'Low reticulocytes + anemia = hypoproliferative (iron deficiency, B12/folate, aplastic anemia, renal failure)' },
      { name: 'RDW',                    ref: '11.5–14.5%',    units: '%',      step1: 'RDW = anisocytosis (variation in RBC size); ↑ in iron deficiency & B12 deficiency; normal in thalassemia trait (micro + normal size)', step23: null },
    ]
  },
  {
    id: 'coag',
    label: 'Coagulation',
    values: [
      { name: 'PT (Prothrombin time)',   ref: '11–15',         units: 'seconds', step1: 'Extrinsic (VII) + common (X, V, II, fibrinogen) pathway; warfarin blocks II, VII, IX, X, protein C/S', step23: 'PT/INR monitors warfarin therapy; target INR 2–3 (most indications), 2.5–3.5 (mechanical mitral valve)' },
      { name: 'INR',                     ref: '0.9–1.1',       units: '',        step1: 'Elevated INR: warfarin, liver disease (↓synthetic function), vitamin K deficiency, DIC', step23: 'Warfarin reversal: FFP (immediate), vitamin K IV (12–24h), 4-factor PCC (fastest, highest risk of thrombosis)' },
      { name: 'PTT (aPTT)',              ref: '25–40',         units: 'seconds', step1: 'Intrinsic (XII, XI, IX, VIII, kallikrein, HMWK) + common pathway; heparin: activates ATIII → inactivates thrombin + Xa', step23: 'aPTT monitors unfractionated heparin (goal 2–2.5× control); heparin antidote: protamine sulfate' },
      { name: 'Fibrinogen',              ref: '200–400',       units: 'mg/dL',   step1: 'Fibrinogen = factor I; consumed in DIC (↓fibrinogen, ↑PT, ↑PTT, ↓platelets, ↑D-dimer)', step23: 'DIC: treat underlying cause; cryoprecipitate for fibrinogen replacement (<100 mg/dL)' },
      { name: 'D-dimer',                 ref: '<0.5',          units: 'µg/mL',   step1: 'D-dimer = fibrin degradation product; elevated in DVT/PE, DIC, malignancy, surgery, pregnancy — LOW SPECIFICITY', step23: 'High sensitivity (~95%) but low specificity; normal D-dimer effectively rules out PE in low-pretest probability (Wells score <2)' },
      { name: 'Bleeding time',           ref: '2–9',           units: 'minutes', step1: 'Prolonged: platelet dysfunction (aspirin, vWD, uremia, Glanzmann thrombasthenia, Bernard-Soulier)', step23: null },
      { name: 'Thrombin time (TT)',      ref: '11–15',         units: 'seconds', step1: 'Thrombin → fibrinogen to fibrin; prolonged in fibrinogen deficiency/dysfunction, heparin, direct thrombin inhibitors', step23: null },
    ]
  },
  {
    id: 'lft',
    label: 'Liver Function Tests',
    values: [
      { name: 'ALT',                     ref: '7–40',          units: 'U/L',     step1: 'Liver-specific; ALT>AST: viral hepatitis; AST:ALT >2:1 suggests alcoholic hepatitis (AST ↑ from alcohol+B6 depletion)', step23: 'ALT >3× ULN + jaundice = Hy\'s Law (drug-induced liver injury marker → poor prognosis)' },
      { name: 'AST',                     ref: '10–40',         units: 'U/L',     step1: 'Found in liver, heart, muscle, RBCs; MI also raises AST (not liver-specific); Mitochondrial AST in severe alcoholism', step23: 'AST/ALT >3:1 in alcoholic hepatitis; also elevated in myocardial injury' },
      { name: 'ALP (Alkaline phosphatase)', ref: '45–115',    units: 'U/L',     step1: 'Elevated in cholestasis (bile duct obstruction, PBC, PSC) AND bone disease (Paget, bone mets, osteomalacia, healing fx)', step23: 'ALP + bilirubin elevation: biliary obstruction or infiltrative liver disease; confirm with GGT (liver-specific)' },
      { name: 'GGT (γ-GT)',              ref: '0–51',          units: 'U/L',     step1: 'Most sensitive marker of alcohol use; also elevated in hepatobiliary disease, CYP450 inducers', step23: 'High ALP + high GGT = liver/biliary cause; high ALP + normal GGT = bone disease' },
      { name: 'Total bilirubin',         ref: '0.3–1.0',       units: 'mg/dL',   step1: 'Unconjugated (indirect): hemolysis, Gilbert syndrome, neonatal; conjugated (direct): hepatocellular, cholestatic disease', step23: 'Jaundice visible at bilirubin ≥2–3 mg/dL; bilirubin >20 in neonates → risk of kernicterus → phototherapy/exchange transfusion' },
      { name: 'Direct bilirubin',        ref: '0.1–0.3',       units: 'mg/dL',   step1: 'Conjugated (water-soluble); elevated in hepatocellular injury + cholestasis; present in urine (dark urine)', step23: null },
      { name: 'Albumin',                 ref: '3.5–5.0',       units: 'g/dL',    step1: 'Synthesized by liver; half-life ~20 days; marker of chronic liver disease/malnutrition; binds drugs (acidic), calcium, hormones', step23: 'SAAG ≥1.1 g/dL = portal hypertension (cirrhosis); serum-ascites albumin gradient = serum albumin − ascites albumin' },
      { name: 'Total protein',           ref: '6.0–8.0',       units: 'g/dL',    step1: 'Albumin + globulins; low total protein: malnutrition, nephrotic syndrome, liver disease; high: multiple myeloma (paraprotein)', step23: null },
    ]
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    values: [
      { name: 'TSH',                     ref: '0.5–5.0',       units: 'µU/mL',   step1: 'Most sensitive test for thyroid dysfunction; TSH ↑ in hypothyroidism (primary); TSH ↓ in hyperthyroidism + central hypothyroidism', step23: 'Subclinical hypo: ↑TSH + normal T4 → treat if TSH >10 or symptomatic; subclinical hyper: ↓TSH + normal T4' },
      { name: 'T4 (total thyroxine)',     ref: '5–12',          units: 'µg/dL',   step1: 'Bound (99%) to TBG, albumin; T4 → T3 by 5\'-deiodinase (peripheral); propylthiouracil (PTU) blocks this conversion', step23: null },
      { name: 'T4 (free)',                ref: '0.9–2.4',       units: 'ng/dL',   step1: 'Unbound T4 = physiologically active; better than total T4 in pregnancy, estrogen therapy (TBG changes)', step23: 'Free T4 + TSH to monitor levothyroxine therapy; goal: TSH within normal range' },
      { name: 'T3 (total triiodothyronine)', ref: '70–195',     units: 'ng/dL',   step1: '3× more potent than T4; most T3 = peripheral conversion (5\'-deiodinase); T3 toxicosis: elevated T3 with normal T4', step23: null },
      { name: 'Free T3',                  ref: '230–420',       units: 'pg/dL',   step1: 'T3 acts at nuclear receptor → transcription of metabolic genes; amiodarone ↓T3 (blocks conversion)', step23: null },
    ]
  },
  {
    id: 'cardiac',
    label: 'Cardiac Markers',
    values: [
      { name: 'Troponin I (cTnI)',        ref: '<0.04',         units: 'ng/mL',   step1: 'Cardiac-specific; begins rising 3–6h post-MI, peaks 24–48h, stays elevated 7–10 days; useful for late presenters', step23: 'Serial troponins 0h + 3h (or 0h + 1h with high-sensitivity) to rule in/out NSTEMI; low initial + low delta = rule out' },
      { name: 'Troponin T (cTnT)',        ref: '<0.1',          units: 'ng/mL',   step1: 'Similar kinetics to TnI; also elevated in myocarditis, PPCM, PE; high-sensitivity assays detect smaller injuries', step23: 'Type 2 MI: troponin elevation without plaque rupture (tachycardia, hypoxia, demand ischemia)' },
      { name: 'CK-MB',                   ref: '0–3.0',         units: 'ng/mL',   step1: 'Rises 4–6h, peaks 24h, returns to baseline 48–72h (shorter than troponin); use to detect reinfarction', step23: 'Re-elevation of CK-MB after initial decline suggests reinfarction; largely replaced by troponin' },
      { name: 'BNP (B-type natriuretic peptide)', ref: '<100', units: 'pg/mL',   step1: 'Released by ventricular myocytes under stretch/pressure overload; ↑ in HF, PE, PHTN, ACS', step23: 'BNP <100 effectively rules out acute decompensated HF; >400 strongly suggests HF; 100–400 = gray zone' },
      { name: 'NT-proBNP',               ref: '<125 (age <75)', units: 'pg/mL',  step1: 'Inactive N-terminal fragment of pro-BNP; longer half-life than BNP; also elevated in renal failure', step23: 'NT-proBNP <300 rules out HF; age-stratified cutoffs for diagnosis: >450 (<50y), >900 (50–75y), >1800 (>75y)' },
    ]
  },
  {
    id: 'abg',
    label: 'Arterial Blood Gas',
    values: [
      { name: 'pH',                      ref: '7.35–7.45',     units: '',        step1: 'pH <7.35 = acidosis; pH >7.45 = alkalosis; Henderson-Hasselbalch: pH = 6.1 + log([HCO₃] / 0.03 × PCO₂)', step23: 'Check primary disorder then compensation; pH + PaCO₂ determine primary; HCO₃ confirms' },
      { name: 'PaO₂',                    ref: '75–105',        units: 'mmHg',    step1: 'A-a gradient = PAO₂ − PaO₂; elevated A-a gradient: VQ mismatch, diffusion limitation, shunt', step23: 'PaO₂ <60 mmHg = hypoxemia (SaO₂ ~90%); intubation threshold: PaO₂ <60 despite supplemental O₂' },
      { name: 'PaCO₂',                   ref: '35–45',         units: 'mmHg',    step1: 'CO₂ = respiratory acid; hypercapnia = respiratory acidosis; compensation: renal HCO₃ retention (24–72h)', step23: 'Permissive hypercapnia in ARDS: allow PaCO₂ to rise to reduce plateau pressure; target pH >7.20' },
      { name: 'HCO₃⁻ (arterial)',        ref: '22–26',         units: 'mEq/L',   step1: 'Renal regulation (slow, 24–72h); Winter\'s formula: expected PaCO₂ = 1.5[HCO₃] + 8 ± 2 (metabolic acidosis)', step23: null },
      { name: 'SaO₂',                    ref: '95–100',        units: '%',       step1: 'Oxyhemoglobin saturation; falls precipitously below PaO₂ 60 mmHg (steep part of curve); CO causes SaO₂ overestimation', step23: 'SpO₂ target varies: 94–98% most patients; 88–92% in COPD to avoid hypercapnia (Haldane effect)' },
      { name: 'A-a gradient',            ref: '<15 (young)',   units: 'mmHg',    step1: 'Normal gradient = shunting/VQ mismatch present; A-a = [FiO₂(713) − PaCO₂/0.8] − PaO₂; elevated in PE, pneumonia, pulmonary edema', step23: 'Elevated A-a gradient + hypoxia without hypercarbia: V/Q mismatch (PE, pulmonary edema, pneumonia)' },
    ]
  },
  {
    id: 'urine',
    label: 'Urine Studies',
    values: [
      { name: 'Urine osmolality',         ref: '50–1200',       units: 'mOsm/kg', step1: 'Concentrated (>500): ADH present (appropriate or SIADH); dilute (<100): DI or primary polydipsia', step23: 'Urine Osm <100 + low serum Osm = primary polydipsia; urine Osm >500 + hyponatremia = SIADH' },
      { name: 'Urine Na⁺',                ref: '<20 (prerenal)', units: 'mEq/L',  step1: 'FENa = (urine Na × serum Cr)/(serum Na × urine Cr) × 100; <1% = prerenal; >2% = intrinsic renal', step23: 'FENa >2% in ATN; exceptions: contrast nephropathy, myoglobinuria may show FENa <1% early' },
      { name: 'Urine specific gravity',   ref: '1.003–1.030',   units: '',        step1: 'Isosthenuria (1.010): fixed specific gravity = renal failure (unable to concentrate or dilute)', step23: null },
      { name: 'Urine protein (random)',   ref: '<30',           units: 'mg/dL',   step1: 'Spot protein/creatinine ratio: >3.5 g/g = nephrotic range; proteinuria + hematuria + casts = nephritic', step23: '24h urine protein >3.5 g = nephrotic syndrome; ACEi/ARB reduce proteinuria in CKD/DM nephropathy' },
      { name: '24h urine protein',        ref: '<150',          units: 'mg/24h',  step1: 'Nephrotic syndrome: >3.5 g/24h; nephritic syndrome: usually <3.5 g/24h with hematuria', step23: null },
      { name: 'Urine creatinine',         ref: '800–2000',      units: 'mg/24h',  step1: 'Reflects muscle mass; used to validate adequacy of 24h collection', step23: null },
    ]
  },
  {
    id: 'csf',
    label: 'CSF (Cerebrospinal Fluid)',
    values: [
      { name: 'Opening pressure',         ref: '70–180',        units: 'mmH₂O',  step1: 'Elevated in meningitis, idiopathic intracranial hypertension, venous sinus thrombosis', step23: 'IIH: opening pressure >250 mmH₂O; treat with acetazolamide, weight loss; serial LP for refractory cases' },
      { name: 'WBC (CSF)',                ref: '0–5',           units: '/µL',     step1: 'Bacterial meningitis: PMNs (>500); viral: lymphocytes (<100); TB/fungal: lymphocytes (low-moderate)', step23: 'CSF glucose <45 mg/dL (or CSF:serum <0.6) + PMN pleocytosis = bacterial meningitis → empiric tx immediately' },
      { name: 'Glucose (CSF)',            ref: '40–70',         units: 'mg/dL',   step1: 'CSF:serum glucose ratio normally 0.6; low in bacterial meningitis, TB, cryptococcus; normal in viral', step23: null },
      { name: 'Protein (CSF)',            ref: '15–45',         units: 'mg/dL',   step1: 'Elevated in bacterial meningitis, GBS, MS, CNS tumor; very high (>500): bacterial or malignant meningitis', step23: 'GBS: albuminocytologic dissociation (↑protein + normal WBC); xanthochromia (bilirubin) = SAH even with negative CT' },
      { name: 'RBC (CSF)',                ref: '0',             units: '/µL',     step1: 'RBCs: traumatic tap vs. SAH; xanthochromia (yellow discoloration) = SAH (requires 2–4h post-bleed to develop)', step23: null },
    ]
  },
  {
    id: 'hormones',
    label: 'Hormones',
    values: [
      { name: 'Cortisol (AM)',            ref: '8–25',          units: 'µg/dL',   step1: 'Controlled by ACTH (anterior pituitary) and CRH (hypothalamus); diurnal peak AM; stress → ↑cortisol', step23: 'AM cortisol <3 = adrenal insufficiency (AI); >18 excludes AI; 3–18 = stimulation test; use ACTH stimulation for confirmation' },
      { name: 'ACTH',                     ref: '10–60',         units: 'pg/mL',   step1: 'Primary AI: ↑ACTH + ↓cortisol; secondary AI: ↓ACTH + ↓cortisol; Cushing disease: ↑ACTH + ↑cortisol', step23: 'ACTH-independent Cushing = adrenal adenoma (low ACTH); ACTH-dependent = pituitary adenoma or ectopic (lung SCLC)' },
      { name: 'Aldosterone',              ref: '3–16',          units: 'ng/dL',   step1: 'Zona glomerulosa; stimulated by angiotensin II, ↑K+; mineralocorticoid effects: ↑Na reabsorption, ↑K+/H+ secretion', step23: 'Primary hyperaldosteronism (Conn): ↑aldosterone + ↓renin; screen with aldosterone:renin ratio >20–30' },
      { name: 'Renin (plasma activity)',  ref: '1.0–2.5',       units: 'ng/mL/h', step1: 'Released by JGA; cleaves angiotensinogen → angiotensin I; ↑renin in renal artery stenosis, volume depletion', step23: null },
      { name: 'Growth hormone (GH)',      ref: '0–5',           units: 'ng/mL',   step1: 'Stimulated by GHRH, fasting, sleep, exercise; inhibited by IGF-1, somatostatin, glucose; acromegaly: nonsuppressible GH', step23: 'GH suppression test (oral glucose): failure to suppress GH <1 ng/mL = acromegaly; use IGF-1 for screening' },
      { name: 'IGF-1 (somatomedin C)',    ref: 'Age-dependent',  units: 'ng/mL',  step1: 'Mediates GH anabolic effects; produced by liver; ↑ in acromegaly; ↓ in malnutrition, hypothyroidism', step23: 'IGF-1 = best screening test for acromegaly (stable levels, reflects integrated GH); glucose suppression confirms' },
      { name: 'FSH',                      ref: 'M: 2–18; F: varies by cycle', units: 'mIU/mL', step1: 'Stimulates follicle development (F) and spermatogenesis (M); ↑ FSH = primary gonadal failure; ↓ = central cause', step23: null },
      { name: 'LH',                       ref: 'M: 2–15; F: varies by cycle',  units: 'mIU/mL', step1: 'LH surge → ovulation; LH + FSH both ↑ in primary hypogonadism (Klinefelter, Turner, menopause)', step23: 'Polycystic ovarian syndrome: LH:FSH ratio >2:1; elevated LH relative to FSH is characteristic' },
      { name: 'Testosterone (total, M)',  ref: '300–1000',       units: 'ng/dL',  step1: 'Produced by Leydig cells; converted to DHT (5α-reductase) and estradiol (aromatase); ↓ in hypogonadism', step23: 'Total testosterone <300 ng/dL + symptoms = hypogonadism; check AM sample; confirm with free testosterone if borderline' },
      { name: 'Estradiol (E2)',           ref: 'F follicular: 27–122', units: 'pg/mL', step1: 'Dominant estrogen in premenopausal women; produced by granulosa cells; ↓ post-menopause', step23: null },
      { name: 'Prolactin',                ref: 'M: <20; F: <25', units: 'ng/mL', step1: 'Released by lactotrophs; inhibited by dopamine; ↑ in prolactinoma, dopamine antagonists (antipsychotics, metoclopramide), pregnancy', step23: 'Prolactin >200 = prolactinoma until proven otherwise; treat with dopamine agonists (cabergoline, bromocriptine)' },
      { name: 'PTH',                      ref: '11–54',          units: 'pg/mL',  step1: 'Acts on bone (↑resorption) and kidney (↑Ca reabsorption, ↑phosphaturia, ↑1α-hydroxylase → ↑calcitriol)', step23: 'Primary hyperPTH: ↑Ca + ↑PTH (inappropriately normal or high); TX: parathyroidectomy if symptomatic or age <50' },
      { name: 'PTHrP',                    ref: '<2.5',            units: 'pmol/L', step1: 'PTH-related protein; produced by tumors → hypercalcemia of malignancy; binds PTH receptor but undetected by PTH assay', step23: 'Hypercalcemia of malignancy: PTHrP ↑ + PTH ↓; most common: SCC lung, renal cell, breast; treat with bisphosphonates + IV fluids' },
      { name: '25-OH Vitamin D',          ref: '20–80',           units: 'ng/mL',  step1: '25-OH D3 = storage form (liver hydroxylation); 1,25-OH D3 = active form (kidney 1α-hydroxylase); 25-OH is best screening test', step23: 'Deficiency: <20 ng/mL; insufficiency 20–30; toxicity (>150): hypercalcemia; daily supplement 600–800 IU' },
    ]
  },
  {
    id: 'tumor_markers',
    label: 'Tumor Markers',
    values: [
      { name: 'PSA (total)',              ref: '<4.0',            units: 'ng/mL',  step1: 'Prostate-specific; elevated in BPH, prostatitis, prostate CA; PSA velocity and free:total ratio help distinguish benign from malignant', step23: 'PSA >10: high probability of PCa; PSA 4–10: free PSA <10% → more likely cancer; use for monitoring, not screening in general population' },
      { name: 'AFP (Alpha-fetoprotein)', ref: '<10',             units: 'ng/mL',  step1: 'Elevated in HCC, hepatoblastoma, nonseminomatous GCT (yolk sac tumor); AFP produced by yolk sac; normally ↑ in pregnancy', step23: 'AFP >500 + hepatic mass in cirrhotic = HCC until proven otherwise; also part of Down syndrome triple screen (↓AFP)' },
      { name: 'β-hCG',                   ref: '<5',              units: 'mIU/mL', step1: 'Produced by syncytiotrophoblasts; ↑ in pregnancy, choriocarcinoma, hydatidiform mole, mixed GCTs; ↑ in gynecologic malignancies', step23: 'β-hCG used to monitor: ectopic pregnancy (should double q48h), gestational trophoblastic disease (plateaus or rises = persistent disease)' },
      { name: 'CEA (Carcinoembryonic antigen)', ref: '<2.5 (nonsmoker)', units: 'ng/mL', step1: 'Expressed in GI embryonic tissue; elevated in colorectal, pancreatic, gastric, lung, breast CA; NOT for diagnosis', step23: 'CEA for monitoring colorectal CA recurrence post-resection; doubling suggests recurrence' },
      { name: 'CA-125',                  ref: '<35',             units: 'U/mL',   step1: 'Elevated in ovarian epithelial CA (serous > mucinous); also elevated in benign conditions (endometriosis, PID, cirrhosis)', step23: 'Used to monitor ovarian CA response to chemo; not a good screening test (low PPV in general population); CA 19-9 = pancreatic/biliary' },
      { name: 'CA 19-9',                ref: '<37',             units: 'U/mL',   step1: 'Pancreatic and GI malignancies; elevated in pancreatic CA, cholangiocarcinoma, colorectal; expressed on Lewis antigen', step23: 'Unresectable pancreatic CA: CA 19-9 used to monitor chemotherapy response; not diagnostic alone' },
      { name: 'LDH',                     ref: '100–200',         units: 'U/L',    step1: 'Non-specific; elevated in hemolysis, MI, hepatitis, pulmonary emboli, malignancy; very high in hemolytic anemia', step23: 'LDH in germ cell tumors (especially dysgerminoma/seminoma); elevated in TTP/HUS (hemolysis); prognostic in lymphoma' },
    ]
  },
]
