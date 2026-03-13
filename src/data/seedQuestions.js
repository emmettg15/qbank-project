// Seed question set — parsed from targeted_review_qbank.html
// This is the starter data shown on first launch.
// Additional question sets can be uploaded as HTML or JSON files.

export const SEED_CONFIG = {
  "title": "Pulm, Pharm & Path",
  "subtitle": "Targeted Review Q-Bank",
  "passingFraction": 0.75,
  "tags": [
    {
      "id": "pharm",
      "label": "Pharmacology",
      "color": "#4fc3f7",
      "cssRgb": "79,195,247"
    },
    {
      "id": "pulm",
      "label": "Pulmonology",
      "color": "#a5d6a7",
      "cssRgb": "165,214,167"
    },
    {
      "id": "onc",
      "label": "Oncology / Path",
      "color": "#ffcc80",
      "cssRgb": "255,204,128"
    },
    {
      "id": "heme",
      "label": "Hematology",
      "color": "#ef9a9a",
      "cssRgb": "239,154,154"
    },
    {
      "id": "endo",
      "label": "Endocrine / Repro",
      "color": "#ce93d8",
      "cssRgb": "206,147,216"
    },
    {
      "id": "neuro",
      "label": "Neurology",
      "color": "#80deea",
      "cssRgb": "128,222,234"
    },
    {
      "id": "immuno",
      "label": "Immunology",
      "color": "#f48fb1",
      "cssRgb": "244,143,177"
    }
  ]
};

export const SEED_QUESTIONS = [
  {
    "tag": "endo",
    "stem": "A 52-year-old woman with ER/PR-positive breast cancer is started on tamoxifen. Her oncologist notes that while tamoxifen reduces breast cancer recurrence, it increases the risk of osteoporosis in premenopausal women but paradoxically has a different effect on bone in postmenopausal women. The patient, however, is postmenopausal and develops a compression fracture of L2 after 6 months of therapy.",
    "lead": "What is the mechanism by which tamoxifen can cause bone loss in premenopausal women?",
    "choices": [
      "Tamoxifen acts as an estrogen agonist at osteoblasts, suppressing bone formation and shifting the balance toward osteoclast-mediated resorption",
      "Tamoxifen acts as an estrogen antagonist at osteoclasts, removing estrogenic inhibition of osteoclast activity and stimulating bone resorption",
      "Tamoxifen acts as an estrogen agonist at osteoclasts, directly stimulating osteoclast activation and increasing bone resorption",
      "Tamoxifen inhibits aromatase in bone tissue, reducing local estradiol synthesis and thereby disinhibiting osteoclast-mediated bone resorption",
      "Tamoxifen promotes RANK-L expression on osteoblasts, which binds RANK on osteoclast precursors and accelerates osteoclast maturation"
    ],
    "answer": 2,
    "explanation": "<strong>Tamoxifen has tissue-selective estrogen receptor activity. In bone, it acts as an estrogen AGONIST in postmenopausal women (net bone-protective effect) but stimulates osteoclasts \u2014 the key 'trick' is that in premenopausal women, tamoxifen's weak agonist activity competes with endogenous estrogen and can paradoxically stimulate osteoclast activity relative to the baseline. The high-yield testable fact: tamoxifen stimulates osteoclasts (net resorptive effect when unopposed by robust endogenous estrogen).</strong><br><br>Tissue selectivity of tamoxifen (SERM):<ul style='margin:8px 0 8px 20px;'><li><strong>Breast:</strong> antagonist \u2192 reduces ER+ breast cancer proliferation</li><li><strong>Uterus:</strong> agonist \u2192 increased risk of endometrial cancer (BBW)</li><li><strong>Bone:</strong> agonist in postmenopausal women (protective); stimulates osteoclasts in premenopausal context</li><li><strong>Lipids:</strong> agonist \u2192 favorable lipid profile</li></ul>Tamoxifen is indicated for ER/PR-positive breast cancer (pre- and postmenopausal). AEs: endometrial cancer, thromboembolism, hot flashes.",
    "keypoints": [
      "Tamoxifen stimulates osteoclasts \u2014 remember this for premenopausal bone loss",
      "SERM: antagonist in breast; agonist in uterus, bone (postmenopausal), lipids",
      "Indicated for ER/PR-positive breast cancer",
      "BBW: endometrial cancer and thromboembolism"
    ]
  },
  {
    "tag": "heme",
    "stem": "A 34-year-old man presents to the ER in hemorrhagic shock after a motor vehicle collision. His BP is 70/40 mmHg, HR is 130 bpm, and he is diaphoretic. A Swan-Ganz catheter is placed, and hemodynamic measurements are obtained.",
    "lead": "Which hemodynamic profile is most consistent with this patient's presentation?",
    "choices": [
      "Elevated cardiac output, elevated systemic vascular resistance, elevated pulmonary capillary wedge pressure",
      "Decreased cardiac output, elevated systemic vascular resistance, decreased pulmonary capillary wedge pressure",
      "Elevated cardiac output, decreased systemic vascular resistance, decreased pulmonary capillary wedge pressure",
      "Decreased cardiac output, decreased systemic vascular resistance, elevated pulmonary capillary wedge pressure",
      "Normal cardiac output, normal systemic vascular resistance, decreased pulmonary capillary wedge pressure"
    ],
    "answer": 1,
    "explanation": "<strong>Hemorrhagic (hypovolemic) shock: decreased preload (PCWP\u2193) \u2192 decreased cardiac output (CO\u2193) \u2192 compensatory sympathetic activation \u2192 increased SVR\u2191 (vasoconstriction to maintain perfusion pressure). CO\u2193 + SVR\u2191 + PCWP\u2193 is the classic hemodynamic signature.</strong><br><br>Shock type comparison:<ul style='margin:8px 0 8px 20px;'><li><strong>Hypovolemic:</strong> CO\u2193, SVR\u2191, PCWP\u2193</li><li><strong>Distributive (septic):</strong> CO\u2191, SVR\u2193, PCWP\u2193 \u2014 'warm shock'</li><li><strong>Cardiogenic:</strong> CO\u2193, SVR\u2191, PCWP\u2191 (fluid backs up into pulmonary circuit)</li><li><strong>Obstructive (PE, tamponade):</strong> CO\u2193, SVR\u2191, PCWP varies</li></ul>Distributive shock is the high-yield foil: it also has low SVR and low PCWP but CO is HIGH because vasodilation reduces afterload. The key distinguisher: hemorrhagic shock has low CO; distributive has high CO.",
    "keypoints": [
      "Hemorrhagic shock: CO\u2193, SVR\u2191, PCWP\u2193",
      "Distributive (septic) shock: CO\u2191, SVR\u2193, PCWP\u2193 \u2014 distinguish by elevated CO",
      "Cardiogenic shock: CO\u2193, SVR\u2191, PCWP\u2191 \u2014 backed-up pulmonary circuit",
      "SVR and PCWP both decrease in hypovolemic and distributive; CO is the differentiator"
    ]
  },
  {
    "tag": "onc",
    "stem": "A breast surgery fellow is presenting a case of a 48-year-old woman with a 2-cm breast mass. She describes the mass as having poorly defined margins on mammogram and notes that the biopsy reveals malignant cells growing in a single-file pattern through the stroma. She documents that the mass does not have an encapsulated fibrous border.",
    "lead": "Which breast pathology terminology best describes a tumor that lacks a fibrous capsule and has irregular margins that merge with surrounding tissue?",
    "choices": [
      "Fibroadenoma \u2014 a benign encapsulated tumor that grows as a distinct nodule within fibroglandular tissue",
      "Phyllodes tumor \u2014 a biphasic lesion with both epithelial and stromal components that can be locally invasive",
      "Infiltrating ductal carcinoma \u2014 the most common malignant breast tumor, characterized by invasion through the basement membrane into surrounding stroma",
      "Intraductal carcinoma in situ \u2014 a malignant proliferation confined within ductal basement membranes with no stromal invasion",
      "Sclerosing adenosis \u2014 a benign lobular proliferation that mimics malignancy due to distorted acini compressed by dense stroma"
    ],
    "answer": 2,
    "explanation": "<strong>A tumor with poorly defined margins that merge with surrounding tissue and lacks a capsule is described as infiltrating (invasive) \u2014 the hallmark of carcinoma that has crossed the basement membrane. Infiltrating ductal carcinoma (IDC) is the most common breast cancer (~75%) and is the high-yield prototype of invasive breast malignancy.</strong><br><br>Key breast terminology:<ul style='margin:8px 0 8px 20px;'><li><strong>In situ (DCIS/LCIS):</strong> malignant cells confined within ducts/lobules; basement membrane intact</li><li><strong>Invasive/infiltrating:</strong> malignant cells have crossed the basement membrane into stroma</li><li><strong>Fibroadenoma:</strong> benign, encapsulated, most common benign breast tumor in young women</li><li><strong>Single-file invasion pattern:</strong> classic for lobular carcinoma, not ductal \u2014 testable detail</li></ul>Lobular carcinoma classically grows in single-file (Indian-file) pattern due to loss of E-cadherin.",
    "keypoints": [
      "Invasive/infiltrating = malignant cells crossed basement membrane into stroma",
      "DCIS/LCIS = in situ, basement membrane intact, no invasion",
      "Fibroadenoma: benign, encapsulated, most common benign breast tumor",
      "Single-file (Indian-file) pattern = classic for lobular carcinoma (loss of E-cadherin)"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A 22-year-old man with testicular cancer is treated with a platinum-based regimen combined with etoposide. At his 3-week follow-up, he reports that all of his hair has fallen out. His CBC shows an absolute neutrophil count of 800/\u00b5L. He is afebrile and notes some nausea controlled by ondansetron.",
    "lead": "Which of the following best describes etoposide's mechanism and the pattern of adverse effects seen in this patient?",
    "choices": [
      "Etoposide inhibits topoisomerase II \u2014 causing DNA double-strand breaks that preferentially affect rapidly dividing cells, producing alopecia, nausea/vomiting, and myelosuppression",
      "Etoposide inhibits topoisomerase I \u2014 blocking DNA re-ligation during replication and preferentially causing peripheral neuropathy and pulmonary fibrosis",
      "Etoposide alkylates DNA \u2014 crosslinking guanine residues and causing hemorrhagic cystitis, myelosuppression, and SIADH",
      "Etoposide inhibits microtubule polymerization \u2014 causing mitotic arrest in metaphase and producing peripheral neuropathy and constipation",
      "Etoposide intercalates into DNA \u2014 blocking RNA polymerase progression and producing cardiotoxicity and vesicant injury at infusion sites"
    ],
    "answer": 0,
    "explanation": "<strong>Etoposide inhibits topoisomerase II \u2192 DNA double-strand breaks accumulate \u2192 apoptosis in rapidly dividing cells. The classic AE triad: alopecia + nausea/vomiting + myelosuppression.</strong><br><br>Topoisomerase inhibitors:<ul style='margin:8px 0 8px 20px;'><li><strong>Topo II inhibitors:</strong> etoposide (VP-16), teniposide \u2014 used in testicular, lung, lymphoma; AEs: alopecia, N/V, myelosuppression, secondary leukemia</li><li><strong>Topo I inhibitors:</strong> irinotecan, topotecan \u2014 used in colorectal, ovarian, SCLC; AEs: diarrhea (irinotecan), myelosuppression</li></ul>Etoposide is derived from podophyllotoxin. Secondary AML is a long-term risk of topo II inhibitors. Do not confuse with vinca alkaloids (vincristine: topo I poison myth \u2014 actually inhibits tubulin polymerization \u2192 neuropathy + constipation).",
    "keypoints": [
      "Etoposide: topoisomerase II inhibitor \u2192 DNA double-strand breaks",
      "AEs: alopecia, N/V, myelosuppression (classic triad)",
      "Risk of secondary AML with topo II inhibitors",
      "Irinotecan/topotecan = topo I inhibitors; classic AE: severe diarrhea"
    ]
  },
  {
    "tag": "endo",
    "stem": "A 17-year-old boy is referred to endocrinology for gynecomastia. He has sparse axillary and pubic hair, small firm testes bilaterally, and a tall, lanky stature. Karyotyping is ordered.",
    "lead": "What karyotype is expected, and what is the primary mechanism of gynecomastia in this condition?",
    "choices": [
      "46,XY \u2014 gynecomastia results from androgen receptor hypersensitivity causing exaggerated peripheral estrogen signaling",
      "45,X \u2014 gynecomastia results from absence of a second sex chromosome causing loss of testicular androgen production",
      "47,XYY \u2014 gynecomastia results from excess Y-chromosome material activating aromatase and increasing estrogen production",
      "47,XXY \u2014 gynecomastia results from primary hypogonadism causing low testosterone and relative estrogen excess due to aromatization",
      "46,XX (male) \u2014 gynecomastia results from SRY-positive XX males with partial androgen insensitivity and relative estrogen excess"
    ],
    "answer": 3,
    "explanation": "<strong>Klinefelter syndrome: 47,XXY. Extra X chromosomes disrupt seminiferous tubule development \u2192 small, firm hyalinized testes \u2192 primary hypogonadism \u2192 testosterone\u2193 \u2192 FSH/LH\u2191 (no negative feedback). Low testosterone \u2192 increased aromatase conversion of androgens to estrogen in peripheral tissues \u2192 relative estrogen excess \u2192 gynecomastia.</strong><br><br>Clinical features of Klinefelter (47,XXY):<ul style='margin:8px 0 8px 20px;'><li>Tall, lanky stature (eunuchoid body habitus)</li><li>Small, firm testes (hyalinized seminiferous tubules)</li><li>Gynecomastia, infertility (azoospermia)</li><li>Sparse body hair</li><li>\u2191 FSH/LH, \u2193 testosterone, \u2191 estrogen</li><li>Increased risk of breast cancer (compared to 46,XY males)</li></ul>Most common cause of male hypogonadism and infertility.",
    "keypoints": [
      "Klinefelter: 47,XXY \u2014 most common cause of male hypogonadism and infertility",
      "Mechanism of gynecomastia: \u2193testosterone \u2192 \u2191aromatization \u2192 relative estrogen excess",
      "Labs: \u2191FSH/LH, \u2193testosterone, \u2191estrogen",
      "Clinical: tall, lanky, small firm testes, azoospermia, gynecomastia"
    ]
  },
  {
    "tag": "neuro",
    "stem": "A 58-year-old man with a history of smoking presents with right-sided ptosis, miosis, and anhidrosis of the right face. Chest imaging reveals a mass at the right lung apex.",
    "lead": "Which of the following correctly localizes the lesion causing this patient's findings?",
    "choices": [
      "Left-sided hypothalamus \u2014 interruption of the ipsilateral sympathetic pathway at the first-order neuron causes contralateral facial anhidrosis and ptosis",
      "Right-sided T1 spinal cord \u2014 interruption of the ipsilateral sympathetic pathway at the second-order neuron causes ipsilateral ptosis, miosis, and facial anhidrosis",
      "Right-sided superior cervical ganglion \u2014 interruption of the third-order postganglionic fiber causes ipsilateral ptosis and miosis but spares facial sweating",
      "Right-sided brainstem \u2014 interruption of the sympathetic nucleus ambiguus causes contralateral ptosis and pupillary dilation",
      "Left-sided oculomotor nucleus \u2014 pressure on CN III parasympathetic fibers causes ipsilateral ptosis and mydriasis with loss of accommodation"
    ],
    "answer": 1,
    "explanation": "<strong>Horner syndrome: ipsilateral ptosis (drooping upper lid \u2014 loss of superior tarsal muscle/M\u00fcller's muscle sympathetic tone), miosis (small pupil \u2014 loss of iris dilator sympathetic tone), and anhidrosis (loss of sweat gland sympathetic innervation). All findings are on the SAME side as the lesion.</strong><br><br>Three-neuron sympathetic chain:<ul style='margin:8px 0 8px 20px;'><li><strong>First-order (central):</strong> hypothalamus \u2192 ciliospinal center of Budge (C8\u2013T2); lesions: brainstem stroke, syringomyelia, MS</li><li><strong>Second-order (preganglionic):</strong> exits T1, loops over lung apex, under subclavian artery \u2192 superior cervical ganglion; lesions: Pancoast tumor (apex lung mass), thyroid carcinoma, aortic dissection</li><li><strong>Third-order (postganglionic):</strong> rides along internal carotid \u2192 orbit; lesions: carotid dissection, cavernous sinus, cluster headache; anhidrosis SPARED (facial sweat fibers leave at superior cervical ganglion)</li></ul>This patient: right apex mass = Pancoast tumor = second-order neuron lesion \u2192 all three findings present including anhidrosis.",
    "keypoints": [
      "Horner syndrome: ptosis + miosis + anhidrosis \u2014 all IPSILATERAL to the lesion",
      "Ptosis = loss of superior tarsal muscle (M\u00fcller's); miosis = loss of iris dilator; anhidrosis = loss of sweat",
      "Pancoast tumor = apex lung mass = second-order neuron lesion \u2014 all three findings present",
      "Third-order lesion (carotid, cavernous): ptosis + miosis but NO anhidrosis"
    ]
  },
  {
    "tag": "heme",
    "stem": "A medical student is reviewing hemoglobin-oxygen dissociation curves. She notes that during vigorous exercise, red blood cells in peripheral tissues have elevated levels of a glycolytic intermediate that shifts the curve to the right, facilitating oxygen unloading.",
    "lead": "What is the mechanism by which this molecule shifts the oxygen-hemoglobin dissociation curve to the right?",
    "choices": [
      "2,3-BPG binds the oxygenated (R/relaxed) conformation of hemoglobin, stabilizing it and increasing oxygen affinity",
      "2,3-BPG binds the deoxygenated (T/taut) conformation of hemoglobin, stabilizing it and decreasing oxygen affinity",
      "2,3-BPG covalently modifies histidine residues on the alpha chains, allosterically increasing oxygen unloading",
      "2,3-BPG competes with oxygen at the heme iron center, reducing the fractional saturation at any given PO2",
      "2,3-BPG cross-links beta-chain cysteines, preventing the cooperative conformational shift required for oxygen binding"
    ],
    "answer": 1,
    "explanation": "<strong>2,3-BPG (bisphosphoglycerate) binds to the central cavity of deoxy-hemoglobin, stabilizing the T (taut/deoxygenated) conformation. Because it preferentially binds the T form, it shifts the equilibrium away from the R (relaxed/oxygenated) form \u2192 decreased affinity for O\u2082 \u2192 right shift of the dissociation curve \u2192 O\u2082 is released more readily to tissues.</strong><br><br>Right-shift factors ('tissues need more O\u2082'): \u2191 2,3-BPG, \u2191 CO\u2082, \u2191 temperature, \u2191 [H\u207a]/acidosis (Bohr effect)<br>Left-shift factors ('hold onto O\u2082'): \u2193 2,3-BPG, \u2193 CO\u2082, \u2193 temperature, alkalosis, CO, fetal HbF (HbF has \u03b3-chains that bind 2,3-BPG poorly \u2192 left-shifted \u2192 high O\u2082 affinity to extract O\u2082 from maternal circulation)<br><br>Clinical: stored blood has low 2,3-BPG (left-shifted) \u2192 transfused blood less effective at delivering O\u2082 to tissues until 2,3-BPG regenerates.",
    "keypoints": [
      "2,3-BPG stabilizes the T (taut/deoxy) form of hemoglobin \u2192 right shift \u2192 \u2193O\u2082 affinity \u2192 more O\u2082 released to tissues",
      "Right-shift: \u21912,3-BPG, \u2191CO\u2082, \u2191temp, acidosis (Bohr effect)",
      "HbF has \u03b3-chains that bind 2,3-BPG poorly \u2192 left-shifted \u2192 high O\u2082 affinity",
      "Stored blood: low 2,3-BPG \u2192 left-shifted; regenerates hours after transfusion"
    ]
  },
  {
    "tag": "onc",
    "stem": "A pathologist reviewing a biopsy from a patient with colon cancer notes that the tumor cells have invaded through the muscularis mucosae into the submucosa. The tumor is also found in mesenteric lymph nodes. The department chair asks the fellow to explain what allows these cells to penetrate the extracellular matrix.",
    "lead": "Which class of enzymes is primarily responsible for enabling tumor invasion through the extracellular matrix?",
    "choices": [
      "Cyclooxygenases \u2014 upregulated in tumor cells to produce prostaglandins that promote local immunosuppression and angiogenesis",
      "Matrix metalloproteinases \u2014 secreted by tumor cells to degrade collagen and other ECM components, enabling stromal invasion",
      "Telomerases \u2014 reactivated in tumor cells to maintain telomere length and prevent replicative senescence during invasion",
      "Topoisomerases \u2014 overexpressed in invasive tumor cells to relieve torsional stress during rapid proliferation at the invasion front",
      "Protein kinase C isoforms \u2014 phosphorylate E-cadherin cytoplasmic tails, triggering its endocytosis and loss of cell-cell adhesion"
    ],
    "answer": 1,
    "explanation": "<strong>Matrix metalloproteinases (MMPs) are zinc-dependent endopeptidases that degrade virtually all ECM components (collagen, laminin, fibronectin, proteoglycans). Tumor invasion requires: (1) detachment from neighbors (loss of E-cadherin), (2) attachment to ECM (integrins), (3) MMP-mediated ECM degradation, (4) migration through the degraded matrix.</strong><br><br>Steps of metastasis:<ol style='margin:8px 0 8px 20px;'><li>Local invasion: MMPs degrade ECM</li><li>Intravasation into blood/lymphatics</li><li>Survival in circulation (immune evasion)</li><li>Extravasation at distant site</li><li>Colonization and angiogenesis (VEGF)</li></ol>MMP inhibitors have been explored as cancer therapeutics. E-cadherin loss is also critical \u2014 it normally holds epithelial cells together (its loss is a hallmark of epithelial-to-mesenchymal transition, EMT).",
    "keypoints": [
      "MMPs (matrix metalloproteinases) degrade ECM \u2014 required for tumor invasion",
      "Steps of invasion: E-cadherin loss \u2192 integrin-ECM attachment \u2192 MMP secretion \u2192 migration",
      "Metastasis sequence: local invasion \u2192 intravasation \u2192 circulation \u2192 extravasation \u2192 colonization",
      "VEGF drives angiogenesis to support the metastatic niche"
    ]
  },
  {
    "tag": "immuno",
    "stem": "A first-year medical student is studying microbiology and becomes confused when the laboratory manual states that Staphylococcus aureus characteristically appears in 'clusters' on Gram stain, while Streptococcus pneumoniae appears in 'pairs.' She asks her professor to clarify the relationship between morphological arrangement and genus.",
    "lead": "Which pairing of organism and characteristic Gram-stain arrangement is correct?",
    "choices": [
      "Streptococcus \u2014 clusters (resembling a bunch of grapes); Staphylococcus \u2014 chains or pairs",
      "Staphylococcus \u2014 clusters (resembling a bunch of grapes); Streptococcus \u2014 chains or pairs",
      "Staphylococcus \u2014 tetrads arranged in packets of four; Streptococcus \u2014 clusters (resembling a bunch of grapes)",
      "Both Staphylococcus and Streptococcus \u2014 chains; the arrangement cannot distinguish the two genera",
      "Staphylococcus \u2014 pairs (diplococci); Streptococcus \u2014 irregular clusters that mimic Gram-negative rods"
    ],
    "answer": 1,
    "explanation": "<strong>Staphylococcus = clusters (like a bunch of grapes) \u2014 named from 'staphyl\u0113' (Greek for grape cluster). Streptococcus = chains or pairs \u2014 named from 'strept\u00f3s' (Greek for twisted/chain). Both are Gram-positive cocci.</strong><br><br>Quick Gram-positive coccus ID:<ul style='margin:8px 0 8px 20px;'><li><strong>Staph aureus:</strong> clusters; coagulase-positive; catalase-positive; \u03b2-hemolysis</li><li><strong>Staph epidermidis:</strong> clusters; coagulase-negative; novobiocin-sensitive</li><li><strong>Strep pneumoniae:</strong> lancet-shaped diplococci (pairs); \u03b1-hemolysis; bile-soluble; optochin-sensitive</li><li><strong>Strep pyogenes (GAS):</strong> chains; \u03b2-hemolysis; bacitracin-sensitive</li><li><strong>Strep viridans:</strong> chains; \u03b1-hemolysis; optochin-RESISTANT</li></ul>Memory: 'Staph like to stick together in grapes; Strep like to chain dance.'",
    "keypoints": [
      "Staphylococcus = clusters (grape bunches); Streptococcus = chains or pairs",
      "Staph aureus: coagulase+ catalase+ \u03b2-hemolysis",
      "S. pneumoniae: lancet diplococci, \u03b1-hemolysis, optochin-sensitive, bile-soluble",
      "Strep pyogenes: chains, \u03b2-hemolysis, bacitracin-sensitive"
    ]
  },
  {
    "tag": "endo",
    "stem": "A 44-year-old postmenopausal woman with ER-positive, PR-positive, HER2-negative breast cancer is being considered for adjuvant hormonal therapy. Her oncologist discusses the difference between tamoxifen and an aromatase inhibitor.",
    "lead": "Which patients are most appropriately treated with tamoxifen rather than an aromatase inhibitor for ER/PR-positive breast cancer?",
    "choices": [
      "Postmenopausal women only \u2014 tamoxifen's estrogen antagonism at the breast is most effective when ovarian estrogen production has ceased",
      "HER2-positive women only \u2014 tamoxifen has synergistic anti-proliferative effects with trastuzumab in HER2-amplified tumors",
      "Premenopausal women \u2014 tamoxifen is effective regardless of menopausal status, while aromatase inhibitors cannot adequately suppress estrogen when ovaries are functional",
      "Women with BRCA1 mutations only \u2014 tamoxifen reduces BRCA1 transcription and lowers cancer recurrence risk in BRCA1 carriers",
      "Women with PR-negative tumors only \u2014 tamoxifen's benefit is confined to progesterone receptor-negative ER-positive subtypes"
    ],
    "answer": 2,
    "explanation": "<strong>Tamoxifen is the preferred hormonal agent for premenopausal women because it acts directly on estrogen receptors and does not depend on blocking aromatase. Aromatase inhibitors (anastrozole, letrozole, exemestane) only block estrogen synthesis in peripheral tissues \u2014 in premenopausal women, the ovaries produce large amounts of estrogen via non-aromatase pathways, so AIs are inadequate as monotherapy. AIs are first-line in postmenopausal women.</strong><br><br>Tamoxifen indications: ER/PR-positive breast cancer in pre- AND postmenopausal women; DCIS risk reduction; breast cancer chemoprevention in high-risk women.<br><br>AIs (anastrozole, letrozole, exemestane): block conversion of androgens to estrogens; first-line for postmenopausal ER+ breast cancer; AEs: osteoporosis, arthralgias, hot flashes, no endometrial cancer risk.<br><br>Tamoxifen AEs: endometrial cancer (uterine agonist), thromboembolism, hot flashes, cataracts.",
    "keypoints": [
      "Tamoxifen: effective pre- and postmenopausal; indicated for ER/PR-positive breast cancer",
      "Aromatase inhibitors: postmenopausal only (ovarian estrogen overwhelms AI in premenopausal)",
      "Tamoxifen AEs: endometrial cancer, DVT/PE, hot flashes",
      "AIs (anastrozole/letrozole/exemestane): AEs: osteoporosis, arthralgias \u2014 no endometrial cancer risk"
    ]
  },
  {
    "tag": "endo",
    "stem": "During an endocrinology lecture, the professor asks students to identify which enzyme is responsible for converting androstenedione to estrone in adipose tissue, a process that becomes clinically important in obese postmenopausal women.",
    "lead": "Which enzyme catalyzes the conversion of androgens to estrogens in peripheral tissues, and what is the clinical significance of this reaction in postmenopausal women?",
    "choices": [
      "5\u03b1-reductase \u2014 converts testosterone to dihydrotestosterone in peripheral tissues, increasing androgenic activity without estrogen production",
      "17\u03b2-hydroxysteroid dehydrogenase \u2014 converts androstenedione to testosterone, which is then exported and converted to estrogen in bone",
      "Aromatase (CYP19A1) \u2014 converts testosterone and androstenedione to estradiol and estrone, providing the main source of estrogen after menopause",
      "11\u03b2-hydroxylase \u2014 converts 11-deoxycortisol to cortisol, with residual estrogenic activity due to substrate promiscuity at the active site",
      "3\u03b2-hydroxysteroid dehydrogenase \u2014 converts pregnenolone to progesterone, which is then peripherally aromatized to produce estrogen"
    ],
    "answer": 2,
    "explanation": "<strong>Aromatase (CYP19A1) is the enzyme that converts androgens (testosterone, androstenedione) to estrogens (estradiol, estrone). In postmenopausal women, the ovaries cease estrogen production, so peripheral aromatization in adipose tissue becomes the dominant estrogen source. This is why obese postmenopausal women have higher circulating estrogen and higher risk of ER+ breast cancer.</strong><br><br>Aromatase inhibitors (AIs) \u2014 anastrozole, letrozole (non-steroidal), exemestane (steroidal) \u2014 block this conversion and are first-line for postmenopausal ER+ breast cancer.<br><br>Aromatase substrates and products:<ul style='margin:8px 0 8px 20px;'><li>Testosterone \u2192 Estradiol</li><li>Androstenedione \u2192 Estrone</li></ul>Estrone is the dominant estrogen in postmenopausal women. Adipose tissue is rich in aromatase \u2014 link between obesity and breast cancer risk.",
    "keypoints": [
      "Aromatase (CYP19A1): testosterone\u2192estradiol; androstenedione\u2192estrone",
      "Main estrogen source in postmenopausal women = peripheral aromatization in adipose tissue",
      "Obesity \u2191 aromatase \u2192 \u2191 estrogen \u2192 \u2191 ER+ breast cancer risk",
      "AIs block this: anastrozole/letrozole (non-steroidal), exemestane (steroidal)"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A 55-year-old man with pulmonary tuberculosis is started on RIPE therapy (rifampin, isoniazid, pyrazinamide, ethambutol). He has a history of alcoholic cirrhosis with elevated baseline AST and ALT. His physician wants to choose agents least likely to worsen his liver disease.",
    "lead": "Which of the first-line TB drugs has the lowest risk of hepatotoxicity and is safest to continue in this patient's setting?",
    "choices": [
      "Rifampin \u2014 a potent CYP450 inducer that causes transient transaminase elevations but rarely causes clinical hepatitis",
      "Isoniazid \u2014 hepatotoxicity risk increases with age and alcohol use; the safest agent in patients with pre-existing liver disease",
      "Pyrazinamide \u2014 causes mild, reversible hyperuricemia without liver injury and is therefore safe in cirrhosis",
      "Ethambutol \u2014 does not cause hepatotoxicity and is the safest first-line TB agent in patients with pre-existing liver disease",
      "Streptomycin \u2014 an aminoglycoside that avoids hepatic metabolism entirely and carries no hepatotoxicity risk"
    ],
    "answer": 3,
    "explanation": "<strong>Ethambutol does NOT cause hepatotoxicity. Its classic adverse effect is optic neuritis (red-green color discrimination loss, decreased visual acuity) \u2014 not liver toxicity. Among the RIPE drugs, ethambutol is the only one without hepatotoxicity as a major concern.</strong><br><br>TB drug adverse effects \u2014 high-yield:<ul style='margin:8px 0 8px 20px;'><li><strong>Rifampin:</strong> orange body fluids, CYP450 inducer, hepatotoxicity, flu-like symptoms, thrombocytopenia</li><li><strong>Isoniazid:</strong> hepatotoxicity (most common cause of drug-induced hepatitis), peripheral neuropathy (B6 deficiency), SLE-like reaction; treat neuropathy with pyridoxine (B6)</li><li><strong>Pyrazinamide:</strong> hepatotoxicity, hyperuricemia (gout), arthralgias</li><li><strong>Ethambutol:</strong> optic neuritis (red-green color blindness) \u2014 NO hepatotoxicity</li></ul>Memory aid: 'Ethambutol's damage is to the EYE, not the liver.'",
    "keypoints": [
      "Ethambutol: optic neuritis (red-green color blindness) \u2014 NO hepatotoxicity",
      "Isoniazid: most common cause of drug-induced hepatitis; also peripheral neuropathy (B6 depletion)",
      "Rifampin: CYP450 inducer, orange body fluids, hepatotoxicity",
      "Pyrazinamide: hepatotoxicity + hyperuricemia (gout)"
    ]
  },
  {
    "tag": "onc",
    "stem": "A 67-year-old male smoker with a 40-pack-year history develops hemoptysis. Bronchoscopy reveals a central endobronchial mass. Biopsy shows nests of uniform, small cells with round nuclei and scant cytoplasm that stain positive for chromogranin A and synaptophysin. The mass does not invade beyond the bronchial wall and has no lymph node involvement.",
    "lead": "Which tumor type is most consistent with this biopsy finding, and how does it differ from small cell lung carcinoma on pathology?",
    "choices": [
      "Squamous cell carcinoma \u2014 central, keratin pearls and intercellular bridges; neuroendocrine markers are negative",
      "Bronchial carcinoid tumor \u2014 nests of neuroendocrine cells with low mitotic rate; unlike SCLC, carcinoid is well-differentiated and has a much better prognosis",
      "Small cell lung carcinoma \u2014 nests of neuroendocrine cells with high mitotic rate, extensive necrosis, and paraneoplastic syndromes",
      "Large cell neuroendocrine carcinoma \u2014 nests of neuroendocrine cells with large nuclei, prominent nucleoli, and high mitotic rate",
      "Typical adenocarcinoma \u2014 peripheral location with mucin production; chromogranin and synaptophysin staining are non-specific findings"
    ],
    "answer": 1,
    "explanation": "<strong>Bronchial carcinoid tumor: nests of uniform neuroendocrine cells, low mitotic rate, chromogranin+ and synaptophysin+, typically central location, better prognosis. SCLC: also neuroendocrine origin, but HIGH mitotic rate, extensive necrosis, 'oat cells,' devastating prognosis, and associated paraneoplastic syndromes (SIADH, Cushing's, Lambert-Eaton).</strong><br><br>Neuroendocrine lung tumors (spectrum of aggressiveness):<ul style='margin:8px 0 8px 20px;'><li><strong>Typical carcinoid:</strong> low grade, nests, rare mitoses, good prognosis</li><li><strong>Atypical carcinoid:</strong> intermediate grade, some mitoses, focal necrosis</li><li><strong>Large cell neuroendocrine carcinoma:</strong> high grade, large cells, prominent nucleoli, many mitoses</li><li><strong>SCLC:</strong> highest grade, oat cells (small, irregular, neuroendocrine), paraneoplastic syndromes, extremely poor prognosis, centrally located</li></ul>SCLC key facts: treated with platinum + etoposide; NOT surgically resected due to early metastasis.",
    "keypoints": [
      "Bronchial carcinoid: nests of neuroendocrine cells, chromogranin+, low mitotic rate \u2014 good prognosis",
      "SCLC: neuroendocrine origin, oat cells, high mitotic rate, paraneoplastic syndromes (SIADH, Cushing's, Lambert-Eaton)",
      "SCLC: central, not surgically resectable; treat with platinum + etoposide",
      "Neuroendocrine spectrum: typical carcinoid \u2192 atypical \u2192 LCNEC \u2192 SCLC"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A 19-year-old college student with no smoking history presents with three episodes of wheezing and chest tightness over the past year, each triggered by cold air. Spirometry shows FEV1/FVC of 0.68 at baseline that improves to 0.79 after bronchodilator administration. His history is notable for childhood eczema and seasonal allergic rhinitis. A 55-year-old retired factory worker with a 35-pack-year smoking history presents with progressive dyspnea, daily productive cough for 3 years, and FEV1/FVC of 0.61 that does not significantly improve with bronchodilator.",
    "lead": "Which feature most reliably distinguishes the younger patient's diagnosis from the older patient's diagnosis?",
    "choices": [
      "Older patient has barrel chest and pursed-lip breathing; younger patient has normal chest exam \u2014 this physical exam difference distinguishes the two",
      "Younger patient has multiple discrete episodes with full recovery and low smoking history; older patient has progressive irreversible obstruction with heavy smoking history",
      "Younger patient has FEV1/FVC below 0.70 at baseline; older patient has FEV1/FVC above 0.70, which distinguishes asthma from COPD",
      "Older patient has elevated IgE and peripheral eosinophilia; younger patient has normal inflammatory markers distinguishing COPD from atopic asthma",
      "Younger patient has reduced TLC and DLCO; older patient has elevated TLC and normal DLCO consistent with air trapping"
    ],
    "answer": 1,
    "explanation": "<strong>The key distinguishing features: (1) Episodic vs. progressive \u2014 asthma has discrete reversible episodes; COPD is progressive and irreversible. (2) Reversibility \u2014 asthma: bronchodilator reverses obstruction significantly; COPD: little to no reversibility. (3) Smoking history \u2014 COPD is strongly associated with heavy smoking; asthma can occur at any age without smoking. (4) Atopic history \u2014 asthma associated with eczema, allergic rhinitis, atopy; COPD is not.</strong><br><br>Asthma vs. COPD summary:<ul style='margin:8px 0 8px 20px;'><li><strong>Asthma:</strong> young, episodic, reversible, atopic history, IgE\u2191, eosinophilia, low/no smoking</li><li><strong>COPD:</strong> older, progressive, irreversible, smoking history, neutrophilic inflammation, emphysema \u00b1 chronic bronchitis</li></ul>Note: both can have FEV1/FVC &lt;0.70, so spirometry alone doesn't distinguish \u2014 the clinical picture (episodic vs. progressive, smoking history) is decisive.",
    "keypoints": [
      "Asthma: episodic, reversible, atopic, low smoking history, IgE\u2191",
      "COPD: progressive, irreversible, heavy smoking, neutrophilic inflammation",
      "Both have FEV1/FVC <0.70; reversibility with bronchodilator favors asthma",
      "Multiple discrete bouts with normal intervals + low smoking = asthma until proven otherwise"
    ]
  },
  {
    "tag": "onc",
    "stem": "A 62-year-old female non-smoker with a 5-pack-year smoking history presents with a 3-cm peripheral lung mass on CT scan. Biopsy reveals malignant cells arranged in glandular patterns with focal mucin production. EGFR mutation testing is ordered.",
    "lead": "Which lung cancer type most commonly presents as a peripheral mass with mucin-producing glandular histology, and which normal lung cell is it derived from?",
    "choices": [
      "Squamous cell carcinoma \u2014 arises from basal cells of central bronchial epithelium; produces keratin pearls with no mucin",
      "Small cell lung carcinoma \u2014 arises from Kulchitsky neuroendocrine cells of the bronchial mucosa; produces dense-core granules with no mucin",
      "Adenocarcinoma \u2014 arises from club cells (Clara cells) at the periphery; produces mucin and forms glandular structures",
      "Large cell carcinoma \u2014 arises from undifferentiated stem cells at the hilum; lacks specific markers but occasionally shows mucin",
      "Mesothelioma \u2014 arises from pleural mesothelial cells; can produce mucin and mimic peripheral adenocarcinoma on imaging"
    ],
    "answer": 2,
    "explanation": "<strong>Adenocarcinoma is the most common lung cancer overall and the most common in non-smokers and women. It arises from the peripheral mucus-secreting (Club/Clara) cells of the bronchioles and alveoli. Classic: peripheral location, glandular architecture, mucin production, TTF-1 positive, EGFR mutations common (especially in non-smokers).</strong><br><br>Lung cancer subtypes \u2014 location and cell of origin:<ul style='margin:8px 0 8px 20px;'><li><strong>Adenocarcinoma:</strong> peripheral, club cells, mucin+, TTF-1+, EGFR mutations, most common overall</li><li><strong>Squamous cell:</strong> central (hilar), squamous metaplasia from basal cells, keratin pearls, PTHrP\u2192hypercalcemia</li><li><strong>SCLC:</strong> central, neuroendocrine (Kulchitsky), oat cells, paraneoplastic (SIADH, Cushing's, Lambert-Eaton)</li><li><strong>Large cell:</strong> peripheral or central, undifferentiated, diagnosis of exclusion</li></ul>Club (Clara) cells: secrete surfactant components and detoxify xenobiotics in the peripheral bronchioles.",
    "keypoints": [
      "Adenocarcinoma: most common lung cancer; peripheral; mucin-producing; club (Clara) cells",
      "Non-smoker/woman \u2192 think adenocarcinoma; EGFR mutations common",
      "Squamous cell: central, keratin pearls, PTHrP \u2192 hypercalcemia",
      "SCLC: central, oat cells, neuroendocrine, paraneoplastic syndromes"
    ]
  },
  {
    "tag": "onc",
    "stem": "A 55-year-old woman with HER2-overexpressing breast cancer is started on trastuzumab. Her oncologist explains that HER2 is a receptor that drives cell proliferation when it is overexpressed, and that trastuzumab targets it specifically.",
    "lead": "What type of protein is HER2, and what is its role in normal cell signaling?",
    "choices": [
      "HER2 is a G-protein coupled receptor that normally activates adenylyl cyclase; overexpression increases cAMP-mediated proliferation",
      "HER2 is a human epidermal growth factor receptor \u2014 a receptor tyrosine kinase in the ErbB family; overexpression drives constitutive proliferative signaling",
      "HER2 is a nuclear hormone receptor that normally binds estrogen; overexpression causes estrogen-independent transcription of pro-proliferative genes",
      "HER2 is a serine/threonine kinase that normally activates SMAD proteins; overexpression dysregulates TGF-\u03b2-mediated growth control",
      "HER2 is a voltage-gated ion channel that normally regulates intracellular calcium; overexpression activates calcineurin-mediated transcription"
    ],
    "answer": 1,
    "explanation": "<strong>HER2 (ErbB2/neu) is a transmembrane receptor tyrosine kinase belonging to the ErbB (epidermal growth factor receptor) family. It is the human epidermal growth factor receptor 2. When overexpressed (HER2+ breast cancer, ~20% of cases), it drives constitutive activation of RAS/MAPK and PI3K/Akt proliferative signaling without needing a ligand.</strong><br><br>HER2 therapeutics:<ul style='margin:8px 0 8px 20px;'><li><strong>Trastuzumab (Herceptin):</strong> monoclonal antibody targeting HER2 extracellular domain; BBW: cardiomyopathy; requires LVEF monitoring</li><li><strong>Pertuzumab:</strong> monoclonal antibody targeting a different HER2 epitope; used with trastuzumab</li><li><strong>T-DM1 (ado-trastuzumab emtansine):</strong> antibody-drug conjugate; trastuzumab + DM1 microtubule inhibitor</li><li><strong>Lapatinib/neratinib:</strong> small molecule TKIs targeting HER2 (and EGFR for lapatinib)</li></ul>HER2 overexpression: gene amplification on chromosome 17; tested by IHC or FISH; associated with aggressive disease but trastuzumab markedly improves outcomes.",
    "keypoints": [
      "HER2 = human epidermal growth factor receptor 2 \u2014 receptor tyrosine kinase in the ErbB family",
      "HER2 overexpression drives constitutive RAS/MAPK and PI3K/Akt signaling",
      "Trastuzumab targets HER2 extracellular domain; BBW: cardiomyopathy",
      "HER2 gene amplification on chromosome 17; tested by IHC/FISH"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A 58-year-old man with a 20-year history of progressive exertional dyspnea and a dry cough presents. He has never smoked. HRCT shows bilateral basilar ground-glass opacities with honeycombing and traction bronchiectasis. Spirometry reveals a restrictive pattern. His hematocrit is 53% and hemoglobin is 17.2 g/dL.",
    "lead": "What is the most likely cause of this patient's elevated hematocrit, and what is the primary disease process?",
    "choices": [
      "Primary polycythemia vera \u2014 a JAK2-mutant myeloproliferative neoplasm causing autonomous erythrocyte overproduction independent of EPO",
      "Secondary polycythemia from chronic hypoxemia due to idiopathic pulmonary fibrosis \u2014 hypoxia stimulates EPO release, driving compensatory erythrocytosis",
      "Secondary polycythemia from obstructive sleep apnea \u2014 intermittent nocturnal hypoxemia drives EPO-mediated erythrocytosis with daytime normoxemia",
      "Relative polycythemia from dehydration \u2014 plasma volume contraction increases hematocrit without true increase in red cell mass",
      "Secondary polycythemia from right-to-left cardiac shunt \u2014 chronically deoxygenated blood stimulates EPO via the renal oxygen-sensing pathway"
    ],
    "answer": 1,
    "explanation": "<strong>Idiopathic pulmonary fibrosis (IPF) causes progressive restrictive lung disease with impaired gas exchange \u2192 chronic hypoxemia \u2192 renal peritubular cells sense \u2193PO\u2082 \u2192 \u2191EPO secretion \u2192 stimulates erythroid progenitors in bone marrow \u2192 compensatory erythrocytosis (secondary polycythemia). This is the same mechanism as COPD-associated polycythemia.</strong><br><br>IPF: progressive, irreversible fibrosis of unknown cause; HRCT: basilar-predominant honeycombing + traction bronchiectasis; usual interstitial pneumonia (UIP) pattern; treated with pirfenidone or nintedanib (slow progression, not curative); median survival 3\u20135 years after diagnosis.<br><br>The compensatory polycythemia is appropriate/physiological \u2014 EPO is elevated in response to tissue hypoxia. Contrast with polycythemia vera: EPO is LOW (autonomous overproduction), JAK2 V617F mutation, splenomegaly.",
    "keypoints": [
      "IPF causes chronic hypoxemia \u2192 \u2191EPO \u2192 secondary/compensatory polycythemia (appropriate)",
      "IPF: HRCT shows basilar honeycombing + traction bronchiectasis (UIP pattern)",
      "Treatment: pirfenidone or nintedanib \u2014 slow progression; no cure; poor prognosis",
      "Distinguish: secondary polycythemia (EPO\u2191) vs. PV (EPO\u2193, JAK2 mutation)"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A 24-year-old woman with moderate persistent asthma continues to have twice-weekly nighttime awakenings despite using an inhaled corticosteroid. Her allergist considers adding a leukotriene modifier. She asks about the difference between zafirlukast and zileuton.",
    "lead": "Which of the following correctly distinguishes zafirlukast from zileuton in mechanism of action?",
    "choices": [
      "Zafirlukast inhibits 5-lipoxygenase \u2014 blocking leukotriene synthesis upstream; zileuton blocks leukotriene receptors \u2014 preventing leukotrienes from binding their targets",
      "Zafirlukast inhibits leukotriene receptors (CysLT1) \u2014 blocking bronchoconstriction and inflammation; zileuton inhibits 5-lipoxygenase \u2014 preventing leukotriene synthesis",
      "Zafirlukast inhibits phosphodiesterase \u2014 increasing intracellular cAMP and relaxing airway smooth muscle; zileuton inhibits cyclooxygenase \u2014 reducing prostaglandin-mediated bronchospasm",
      "Zafirlukast inhibits mast cell degranulation \u2014 preventing early-phase asthma; zileuton inhibits eosinophil trafficking \u2014 preventing late-phase asthma",
      "Zafirlukast is a \u03b22-agonist prodrug activated in airway epithelium; zileuton is a phosphodiesterase-4 inhibitor reducing eosinophilic airway inflammation"
    ],
    "answer": 1,
    "explanation": "<strong>Zafirlukast and montelukast: leukotriene RECEPTOR antagonists (CysLT1 blockers) \u2014 they block the receptor so leukotrienes cannot exert their bronchoconstricting and pro-inflammatory effects. Zileuton: 5-LIPOXYGENASE inhibitor \u2014 blocks leukotriene SYNTHESIS (prevents formation of LTC4, LTD4, LTE4 from arachidonic acid).</strong><br><br>Leukotriene pathway:<ul style='margin:8px 0 8px 20px;'><li>Arachidonic acid \u2192 (5-LOX, zileuton blocks here) \u2192 LTA4 \u2192 LTC4/LTD4/LTE4 (cysteinyl leukotrienes) \u2192 (zafirlukast/montelukast block CysLT1 receptor here) \u2192 bronchoconstriction, mucus secretion, airway inflammation</li></ul>Zileuton monitoring: LFTs required (hepatotoxicity risk). Zafirlukast: watch for Churg-Strauss (eosinophilic granulomatosis) when steroids tapered. Both: aspirin-exacerbated asthma (Samter's triad) is a great indication.",
    "keypoints": [
      "Zafirlukast/montelukast = leukotriene receptor antagonists (CysLT1 blockers)",
      "Zileuton = 5-lipoxygenase inhibitor (blocks leukotriene synthesis)",
      "Zileuton: monitor LFTs (hepatotoxicity)",
      "Aspirin-exacerbated asthma (Samter's triad) = best indication for both classes"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A 34-year-old man with well-controlled asthma performs a forced expiratory maneuver for spirometry. His technician notes that his peak flow occurs early in the maneuver and falls rapidly. The patient asks why he cannot 'push harder' to increase his flow after the first second.",
    "lead": "What is the mechanism that limits expiratory airflow during forced exhalation, and why is this limitation exaggerated in obstructive lung diseases?",
    "choices": [
      "Dynamic airway compression \u2014 during forced exhalation, increased pleural pressure compresses airways at the equal pressure point, creating a flow-limiting segment regardless of effort",
      "Increased airway resistance at the tracheal level \u2014 turbulent flow from high expiratory velocity creates back-pressure that limits flow in proportion to velocity",
      "Inspiratory muscle fatigue \u2014 incomplete diaphragmatic relaxation during forced exhalation generates a residual inspiratory force that limits expiratory flow",
      "Surfactant depletion during exhalation \u2014 reduced surface tension increases alveolar collapse pressure and limits flow at low lung volumes",
      "Mucus plug formation at the carina \u2014 high-velocity expiratory flow desiccates airway secretions and creates a mechanical obstruction at the carina"
    ],
    "answer": 0,
    "explanation": "<strong>During forced exhalation, the driving pressure that pushes air out also acts to compress the airways. At the 'equal pressure point,' the transmural pressure across the airway wall is zero \u2014 beyond this point toward the mouth, airways are compressed by the high pleural pressure. This creates a choke point: airflow becomes effort-independent (flow-limited). More effort only compresses airways further without increasing flow.</strong><br><br>In obstructive diseases (asthma, COPD): airway walls are weaker (loss of radial traction, inflammation), so the equal pressure point moves upstream (toward the alveoli) \u2192 flow limitation begins at higher lung volumes \u2192 air trapping, hyperinflation, and barrel chest. This is why FEV1 is reduced and the FEV1/FVC ratio falls below 0.70 in obstructive disease. Asthma: affects ALL levels of the conducting zone (bronchi, bronchioles, terminal bronchioles).",
    "keypoints": [
      "Dynamic airway compression limits expiratory flow \u2014 effort-independent beyond the equal pressure point",
      "Increased in obstructive disease: weaker airways compressed earlier \u2192 air trapping",
      "FEV1/FVC <0.70 = obstructive pattern; this limitation is the reason",
      "Asthma: affects all conducting airways (large and small bronchi through terminal bronchioles)"
    ]
  },
  {
    "tag": "immuno",
    "stem": "A 32-year-old African-American woman presents with bilateral hilar lymphadenopathy on chest X-ray, erythema nodosum on her shins, and facial nerve palsy on the right side. Serum ACE is elevated. Biopsy of an enlarged mediastinal lymph node shows non-caseating granulomas with no organisms on special stains.",
    "lead": "What is the immunological mechanism underlying this patient's disease?",
    "choices": [
      "Type I hypersensitivity \u2014 IgE-mediated mast cell degranulation triggered by an inhaled antigen causes granuloma formation and bilateral hilar lymphadenopathy",
      "Type II hypersensitivity \u2014 antibody-mediated complement activation against lung epithelial antigens causes granulomatous destruction and systemic inflammation",
      "Type IV hypersensitivity \u2014 CD4+ Th1 cell-mediated immune response to an unidentified antigen drives macrophage activation and non-caseating granuloma formation",
      "Type III hypersensitivity \u2014 immune complex deposition in alveolar capillaries triggers complement-mediated neutrophil recruitment and granuloma formation",
      "Regulatory T-cell deficiency \u2014 loss of Treg suppression allows unchecked CD8+ cytotoxic responses against lung parenchyma and lymph node antigens"
    ],
    "answer": 2,
    "explanation": "<strong>Sarcoidosis is a systemic granulomatous disease caused by a CD4+ Th1-mediated (Type IV / cell-mediated) immune response to an unknown antigen. The hallmark is non-caseating granulomas (contrast with TB which has caseating granulomas). Macrophages engulf the antigen but cannot destroy it \u2192 macrophages present antigen to CD4+ T cells \u2192 Th1 cytokines (IL-2, IFN-\u03b3, TNF-\u03b1) \u2192 macrophage activation \u2192 epithelioid granuloma formation.</strong><br><br>Sarcoidosis high-yield associations:<ul style='margin:8px 0 8px 20px;'><li>Bilateral hilar lymphadenopathy (most common chest finding)</li><li>Elevated ACE (from granuloma macrophages)</li><li>Elevated 1,25-dihydroxyvitamin D (activated macrophages produce 1\u03b1-hydroxylase) \u2192 hypercalcemia</li><li>Erythema nodosum (panniculitis \u2014 also Type IV)</li><li>Facial nerve palsy (CN VII; Heerfordt syndrome = uveitis + parotitis + facial palsy + fever)</li><li>Uveitis, lupus pernio, arthritis</li></ul>Treatment: systemic corticosteroids.",
    "keypoints": [
      "Sarcoidosis: Type IV (cell-mediated) Th1 response to unknown antigen \u2192 non-caseating granulomas",
      "\u2191ACE, \u21911,25-OH-D (\u2192 hypercalcemia), bilateral hilar LAD",
      "Facial nerve palsy + uveitis + parotitis + fever = Heerfordt syndrome",
      "Erythema nodosum: panniculitis, also Type IV mediated"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A 45-year-old man with HIV is started on a protease inhibitor-based regimen. He also has GERD and routinely drinks large amounts of grapefruit juice. His physician counsels him that grapefruit juice is contraindicated with his new medication.",
    "lead": "What is the mechanism by which grapefruit juice increases plasma levels of many drugs?",
    "choices": [
      "Grapefruit juice activates hepatic CYP3A4, accelerating first-pass metabolism and paradoxically increasing bioavailability by converting prodrugs to active metabolites",
      "Grapefruit juice inhibits intestinal CYP3A4 \u2014 reducing first-pass metabolism of drugs metabolized by this enzyme and increasing their systemic bioavailability",
      "Grapefruit juice alkalinizes urine pH, trapping ionized basic drugs in the renal tubule and reducing urinary excretion",
      "Grapefruit juice inhibits P-glycoprotein efflux pump in the gut, reducing active secretion of drugs back into the intestinal lumen",
      "Grapefruit juice competitively inhibits hepatic UDP-glucuronosyltransferase, reducing glucuronidation and prolonging drug half-life"
    ],
    "answer": 1,
    "explanation": "<strong>Grapefruit juice contains furanocoumarins (e.g., bergamottin) that irreversibly inhibit intestinal CYP3A4. CYP3A4 normally performs first-pass metabolism of many drugs in the intestinal wall before they reach systemic circulation. When CYP3A4 is inhibited by grapefruit, less drug is metabolized during absorption \u2192 higher bioavailability \u2192 potentially toxic plasma levels. A single glass can inhibit CYP3A4 for 24\u201372 hours.</strong><br><br>Drugs affected (CYP3A4 substrates) \u2014 clinically important examples:<ul style='margin:8px 0 8px 20px;'><li>Statins (simvastatin, lovastatin \u2014 but NOT pravastatin/rosuvastatin) \u2192 rhabdomyolysis risk</li><li>Calcium channel blockers (amlodipine, nifedipine)</li><li>Tacrolimus, cyclosporine \u2192 toxicity in transplant patients</li><li>HIV protease inhibitors</li><li>Benzodiazepines (midazolam, triazolam)</li></ul>Other strong CYP3A4 INHIBITORS: azole antifungals, macrolides (erythromycin, clarithromycin), HIV PIs. CYP3A4 INDUCERS (rifampin mnemonic: GRAPES minus the grapefruit): rifampin, phenytoin, carbamazepine, St. John's Wort.",
    "keypoints": [
      "Grapefruit inhibits intestinal CYP3A4 \u2192 \u2191bioavailability of CYP3A4 substrates",
      "Mechanism: furanocoumarins irreversibly inhibit CYP3A4 in intestinal wall",
      "Affected drugs: statins (simvastatin/lovastatin), CCBs, tacrolimus, benzodiazepines, PIs",
      "Duration: inhibition can last 24\u201372 hours from a single serving"
    ]
  },
  {
    "tag": "immuno",
    "stem": "A 28-year-old woman with sarcoidosis presents with a new right-sided facial droop. On exam, she cannot raise her right eyebrow, cannot close her right eye, and has loss of the right nasolabial fold. Her forehead is involved on the right side. She has no hearing loss or vertigo.",
    "lead": "At what level is this lesion, and how does forehead involvement help localize it?",
    "choices": [
      "Right UMN (cortical) lesion \u2014 forehead involvement distinguishes it from LMN lesions because the upper facial muscles receive bilateral cortical representation",
      "Right LMN (CN VII) lesion \u2014 forehead involvement (inability to raise eyebrow) indicates a peripheral CN VII palsy because the upper facial nerve lacks bilateral cortical back-up at this level",
      "Left UMN (cortical) lesion \u2014 contralateral facial droop with forehead sparing indicates cortical involvement; forehead involvement suggests the lesion is at the pons",
      "Left LMN (CN VII) lesion \u2014 the facial nerve decussates at the pons; left-sided forehead involvement with right-sided droop indicates a left peripheral nerve lesion",
      "Bilateral LMN (CN VII) lesion \u2014 sarcoidosis always causes bilateral facial palsy because granulomas affect the facial nerve at the stylomastoid foramen bilaterally"
    ],
    "answer": 1,
    "explanation": "<strong>Forehead sparing = UMN (cortical/central) lesion. Forehead involvement = LMN (peripheral/CN VII) lesion. This is the most tested CN VII localization rule: the forehead muscles (frontalis) receive bilateral cortical input, so an UMN lesion on one side is compensated by the other hemisphere \u2192 forehead is SPARED. In an LMN lesion (CN VII proper), all ipsilateral facial muscles are affected including the forehead.</strong><br><br>Sarcoidosis is a recognized cause of peripheral CN VII palsy (LMN pattern). Bilateral facial palsy (facial diplegia) can occur in sarcoidosis, Lyme disease, and Guillain-Barr\u00e9.<br><br>CN VII branches (temporal, zygomatic, buccal, marginal mandibular, cervical) \u2014 all arise distal to the geniculate ganglion in peripheral palsy. Parotid gland tumors can cause CN VII palsy (parotid wraps around CN VII). Ramsay Hunt syndrome: reactivation of VZV at geniculate ganglion \u2192 painful ear vesicles + LMN CN VII palsy + hearing loss.",
    "keypoints": [
      "Forehead involvement = LMN (peripheral) CN VII palsy",
      "Forehead SPARED = UMN (central) lesion \u2014 bilateral cortical representation of forehead muscles",
      "Sarcoidosis causes peripheral (LMN) CN VII palsy; can be bilateral",
      "Ramsay Hunt: VZV at geniculate ganglion \u2192 ear vesicles + LMN CN VII palsy + hearing loss"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A 48-year-old man with \u03b11-antitrypsin deficiency presents for follow-up. His LFTs show AST 78 U/L and ALT 95 U/L. His physician considers adding rifampin for a latent TB infection identified on screening but is concerned about further hepatic injury.",
    "lead": "Which of the first-line TB drugs is most appropriate to add given this patient's elevated transaminases, and why?",
    "choices": [
      "Isoniazid \u2014 it is renally cleared and does not undergo significant hepatic metabolism at standard doses",
      "Rifampin \u2014 transient transaminase elevations are expected and do not represent true hepatotoxicity",
      "Pyrazinamide \u2014 dose-dependent hepatotoxicity is mild and rarely causes clinical hepatitis in patients with pre-existing liver disease",
      "Ethambutol \u2014 it is not hepatotoxic and is safest in patients with pre-existing liver disease or elevated transaminases",
      "Streptomycin \u2014 aminoglycoside class is renally eliminated and avoids hepatic metabolism entirely"
    ],
    "answer": 3,
    "explanation": "<strong>Among all first-line TB agents, ethambutol is the only one NOT associated with hepatotoxicity. Its adverse effects are entirely distinct: optic neuritis (reversible if caught early) \u2014 manifests as decreased visual acuity and red-green color discrimination defects. In patients with elevated transaminases or pre-existing liver disease, ethambutol is the safest first-line TB agent to continue or add.</strong><br><br>This is a commonly missed distinction \u2014 ethambutol is often incorrectly assumed to cause hepatotoxicity by association with the RIPE regimen. Remember: <em>ethambutol's toxicity is to the eye, not the liver.</em><br><br>TB drug hepatotoxicity ranking (highest to lowest): isoniazid > pyrazinamide > rifampin > ethambutol (no hepatotoxicity). In patients with liver disease, INH + PZA are most concerning. Monitoring: LFTs at baseline and monthly if high risk.",
    "keypoints": [
      "Ethambutol: NO hepatotoxicity \u2014 only AE is optic neuritis (red-green color defects)",
      "Hepatotoxicity ranking: isoniazid > pyrazinamide > rifampin; ethambutol is safe",
      "Monitor visual acuity and color discrimination during ethambutol therapy",
      "In liver disease: ethambutol is safest; avoid or closely monitor isoniazid and pyrazinamide"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A patient being worked up for hypercalcemia is found to have a PTHrP-secreting tumor. She reports colicky right flank pain and visible blood in her urine. Her serum calcium is 13.4 mg/dL.",
    "lead": "What is the mechanistic chain linking PTHrP secretion to this patient's urinary symptoms?",
    "choices": [
      "PTHrP activates osteoblasts \u2192 increased bone matrix formation \u2192 elevated serum phosphate \u2192 calcium-phosphate precipitation in renal tubules \u2192 hematuria",
      "PTHrP mimics PTH at the PTH/PTHrP receptor \u2192 increases osteoclast activity and renal calcium reabsorption \u2192 hypercalcemia \u2192 calcium oxalate/phosphate nephrolithiasis \u2192 ureteral obstruction \u2192 hematuria",
      "PTHrP directly irritates urothelial cells \u2192 inflammation of the collecting duct epithelium \u2192 sterile hematuria without stone formation",
      "PTHrP inhibits 1\u03b1-hydroxylase in the kidney \u2192 decreased calcitriol \u2192 calcium malabsorption \u2192 reactive hyperparathyroidism \u2192 hypercalcemia \u2192 nephrolithiasis",
      "PTHrP stimulates ADH secretion \u2192 SIADH \u2192 dilutional hypercalcemia \u2192 calcium supersaturation in renal tubules \u2192 nephrolithiasis \u2192 hematuria"
    ],
    "answer": 1,
    "explanation": "<strong>PTHrP (parathyroid hormone-related protein) mimics PTH at the PTH/PTHrP receptor \u2192 (1) increased osteoclast-mediated bone resorption \u2192 calcium released from bone \u2192 hypercalcemia; (2) increased renal calcium reabsorption at the DCT \u2192 hypercalcemia. Hypercalcemia \u2192 calcium supersaturation in urine \u2192 kidney stones (nephrolithiasis) \u2192 ureteral obstruction and stone passage \u2192 flank pain + hematuria.</strong><br><br>PTHrP is secreted by squamous cell carcinomas (lung SCC, head/neck SCC, esophageal SCC), renal cell carcinoma, breast cancer, and bladder cancer. It is the most common cause of malignancy-associated hypercalcemia.<br><br>Hypercalcemia mnemonic \u2014 'Bones, Stones, Groans, Moans, Thrones':<ul style='margin:8px 0 8px 20px;'><li>Bones: bone pain, osteitis fibrosa cystica</li><li>Stones: nephrolithiasis, nephrocalcinosis</li><li>Groans: N/V, constipation, pancreatitis</li><li>Moans: depression, confusion, lethargy</li><li>Thrones: polyuria (nephrogenic DI)</li></ul>",
    "keypoints": [
      "PTHrP mimics PTH \u2192 \u2191osteoclast resorption + \u2191renal Ca reabsorption \u2192 hypercalcemia",
      "Hypercalcemia \u2192 nephrolithiasis \u2192 flank pain + hematuria",
      "PTHrP = most common cause of malignancy-associated hypercalcemia (especially SCC)",
      "Mnemonic: Bones, Stones, Groans, Moans, Thrones"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A premature infant born at 28 weeks gestation develops progressive respiratory distress within 2 hours of birth. Chest X-ray shows bilateral ground-glass opacity and air bronchograms. Arterial blood gas shows PaO\u2082 of 45 mmHg on room air. A 35-year-old trauma patient develops bilateral pulmonary infiltrates, PaO\u2082/FiO\u2082 ratio of 180, and no signs of cardiogenic pulmonary edema 48 hours after massive blood transfusion.",
    "lead": "Which pathophysiological mechanism is shared between neonatal respiratory distress syndrome and acute respiratory distress syndrome?",
    "choices": [
      "Bronchospasm \u2014 both conditions feature diffuse airway hyperreactivity causing dynamic airway compression and expiratory flow limitation",
      "Alveolar collapse \u2014 in NRDS from surfactant deficiency; in ARDS from surfactant dysfunction and alveolar flooding with protein-rich exudate",
      "Pulmonary vascular vasoconstriction \u2014 both involve hypoxic pulmonary vasoconstriction leading to right heart strain and interstitial edema",
      "Mucus plug formation \u2014 both conditions involve goblet cell hyperplasia producing excessive mucus that fills and collapses dependent alveoli",
      "Hyaline membrane formation from fibrin deposits \u2014 in NRDS from immature liver albumin synthesis; in ARDS from complement-mediated fibrin deposition"
    ],
    "answer": 1,
    "explanation": "<strong>Both NRDS and ARDS share the final common pathway of alveolar collapse (atelectasis). NRDS: surfactant deficiency (type II pneumocytes immature before 28 weeks) \u2192 increased surface tension \u2192 alveolar collapse at end-expiration \u2192 hypoxemia. ARDS: diffuse alveolar damage \u2192 alveolar flooding with protein-rich exudate \u2192 surfactant dysfunction \u2192 alveolar collapse + impaired gas exchange.</strong><br><br>NRDS key facts: premature infants <28 weeks; surfactant produced after ~28 weeks; treat with exogenous surfactant (beractant) + CPAP/mechanical ventilation; antenatal glucocorticoids (betamethasone) accelerate fetal lung maturity by promoting type II pneumocyte surfactant synthesis.<br><br>ARDS diagnostic criteria: PaO\u2082/FiO\u2082 <300, bilateral infiltrates, non-cardiogenic origin; treated with low tidal volume ventilation (lung-protective strategy: 6 mL/kg IBW), prone positioning, conservative fluid management.<br><br>Phosphatidylcholine (lecithin) is the most abundant and functionally critical component of surfactant.",
    "keypoints": [
      "NRDS and ARDS both cause alveolar collapse \u2014 NRDS from surfactant deficiency, ARDS from surfactant dysfunction",
      "NRDS: treat with exogenous surfactant + respiratory support; antenatal betamethasone for prevention",
      "ARDS: PaO\u2082/FiO\u2082 <300, bilateral infiltrates, non-cardiogenic; treat with low tidal volume (6 mL/kg)",
      "Surfactant: phosphatidylcholine (lecithin) is the most important component"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A neonatologist is counseling a mother whose infant was born at 26 weeks gestation and immediately developed respiratory distress syndrome. She asks what the surfactant that was administered to the infant is made of, and why it works.",
    "lead": "Which phospholipid is the most critical functional component of pulmonary surfactant, and what is its mechanism of action?",
    "choices": [
      "Phosphatidylinositol \u2014 forms a rigid lipid bilayer in the alveolar lining that prevents water vapor loss during exhalation",
      "Phosphatidylserine \u2014 the negatively charged head group repels adjacent alveolar walls and prevents collapse by electrostatic force",
      "Phosphatidylcholine (dipalmitoylphosphatidylcholine) \u2014 reduces alveolar surface tension by inserting between water molecules at the air-liquid interface",
      "Phosphatidylethanolamine \u2014 promotes alveolar macrophage adhesion to reduce alveolar collapse by mechanical scaffolding",
      "Sphingomyelin \u2014 provides structural rigidity to type I pneumocytes, maintaining alveolar geometry and preventing end-expiratory collapse"
    ],
    "answer": 2,
    "explanation": "<strong>Dipalmitoylphosphatidylcholine (DPPC), a form of phosphatidylcholine (lecithin), is the most abundant and functionally essential component of pulmonary surfactant. Its amphipathic structure allows it to insert at the air-liquid interface and disrupt water molecule cohesion, reducing surface tension. By Laplace's law (P = 2T/r), lower surface tension reduces the collapsing pressure of alveoli \u2014 especially critical in small alveoli at end-expiration.</strong><br><br>Surfactant composition: ~70\u201380% phospholipids (DPPC dominant), ~10% neutral lipids, ~10% surfactant proteins (SP-A, SP-B, SP-C, SP-D). SP-B is essential \u2014 SP-B knockout = fatal respiratory failure at birth.<br><br>Lecithin/sphingomyelin (L/S) ratio in amniotic fluid: ratio \u22652 indicates fetal lung maturity. SP-A and SP-D: innate immune defense (opsonins). Type II pneumocytes: secrete surfactant; also progenitors that regenerate type I pneumocytes after lung injury.",
    "keypoints": [
      "Phosphatidylcholine (DPPC/lecithin) = most important surfactant component; reduces surface tension",
      "L/S ratio \u22652 in amniotic fluid = fetal lung maturity",
      "Type II pneumocytes: synthesize and secrete surfactant; SP-B essential for function",
      "Surfactant prevents alveolar collapse at end-expiration (Laplace's law: P = 2T/r)"
    ]
  },
  {
    "tag": "pharm",
    "stem": "A veterinarian notices that a flock of birds she is treating for feather-mite infection are also showing signs of respiratory illness. A 34-year-old man who owns the flock presents to urgent care with a 10-day history of fever, dry cough, and headache. He denies sick contacts and has had no recent travel. Chest X-ray shows bilateral interstitial infiltrates. Urinalysis is normal. CBC shows mild leukocytosis with no eosinophilia.",
    "lead": "Which of the following correctly identifies the organism and the likely exposure source in this patient?",
    "choices": [
      "Histoplasma capsulatum \u2014 inhaled from bat guano or bird droppings in the Ohio-Mississippi river valley; causes granulomatous pneumonia",
      "Coxiella burnetii \u2014 inhaled from contaminated aerosols from placental material of infected sheep or cattle; causes Q fever",
      "Chlamydophila psittaci \u2014 inhaled from aerosolized secretions or dried droppings of infected psittacine birds (parrots, parakeets, and related species); causes psittacosis",
      "Aspergillus fumigatus \u2014 inhaled from moldy bird nesting material; causes allergic bronchopulmonary aspergillosis in atopic hosts",
      "Mycoplasma pneumoniae \u2014 transmitted person-to-person via respiratory droplets; causes atypical pneumonia unrelated to bird exposure"
    ],
    "answer": 2,
    "explanation": "<strong>Psittacosis (ornithosis): caused by Chlamydophila psittaci (an obligate intracellular bacterium). Transmitted by inhaling aerosolized secretions or dried fecal material from infected birds \u2014 classically psittacine birds (parrots, parakeets, cockatiels, macaws) but also pigeons and poultry. Presents as an atypical pneumonia: fever, headache, dry cough, bilateral interstitial infiltrates \u2014 indistinguishable clinically from other atypical organisms.</strong><br><br>Atypical pneumonia organisms and exposures:<ul style='margin:8px 0 8px 20px;'><li><strong>Chlamydophila psittaci:</strong> birds (psittacines, pigeons) \u2014 psittacosis</li><li><strong>Chlamydophila pneumoniae:</strong> person-to-person; common in young adults</li><li><strong>Coxiella burnetii:</strong> farm animals (sheep, goats, cattle) \u2014 Q fever; also rickettsial</li><li><strong>Histoplasma:</strong> bat/bird droppings in Ohio-Mississippi valley</li><li><strong>Mycoplasma:</strong> no specific exposure; cold agglutinins (IgM), erythema multiforme, bullous myringitis</li></ul>Treatment for psittacosis: doxycycline or azithromycin.",
    "keypoints": [
      "Psittacosis: Chlamydophila psittaci; source = birds (psittacines, parrots, parakeets)",
      "Presents as atypical pneumonia: fever, headache, dry cough, interstitial infiltrates",
      "Treatment: doxycycline or azithromycin",
      "Coxiella = farm animals (Q fever); Histoplasma = bat/bird droppings (Ohio-Mississippi valley)"
    ]
  },
  {
    "tag": "heme",
    "stem": "A 67-year-old man with a history of atrial fibrillation on warfarin is admitted with a massive upper GI bleed. His coagulation studies show PT prolonged to 38 seconds (INR 4.2), PTT 32 seconds. He is also on enoxaparin for a deep vein thrombosis diagnosed 10 days ago.",
    "lead": "Which of the following correctly pairs the coagulation test with the anticoagulant it monitors?",
    "choices": [
      "PT/INR monitors heparin/enoxaparin \u2014 measures factor Xa inhibition in the extrinsic pathway; PTT monitors warfarin \u2014 measures factors II, VII, IX, X inhibition",
      "PTT monitors heparin/enoxaparin \u2014 reflects intrinsic pathway factor activity; PT/INR monitors warfarin \u2014 reflects vitamin K-dependent factor activity",
      "Both PT and PTT are equally prolonged by warfarin because it inhibits all coagulation factors simultaneously through vitamin K depletion",
      "Anti-Xa level monitors warfarin \u2014 gold standard for monitoring vitamin K antagonist therapy; PT monitors unfractionated heparin",
      "Thrombin time monitors warfarin \u2014 reflects direct thrombin inhibition; PTT monitors enoxaparin \u2014 reflects factor Xa inhibition in the intrinsic pathway"
    ],
    "answer": 1,
    "explanation": "<strong>PTT (aPTT) = monitors heparin (unfractionated heparin, UFH). PT/INR = monitors warfarin. LMWHs (enoxaparin) are typically monitored by anti-Xa levels in special populations \u2014 PTT is not reliably prolonged by LMWHs at therapeutic doses.</strong><br><br>Why: Heparin enhances antithrombin \u2192 inhibits factors IIa (thrombin) and Xa + IXa, XIa, XIIa (intrinsic pathway factors) \u2192 PTT prolonged. Warfarin inhibits vitamin K epoxide reductase \u2192 cannot carboxylate factors II, VII, IX, X (and proteins C and S) \u2192 extrinsic pathway (factor VII) affected first \u2192 PT/INR prolonged. PT reflects factors I, II, V, VII, X \u2014 warfarin reduces II, VII, IX, X.<br><br>LMWH (enoxaparin): preferentially inhibits Xa > IIa; anti-Xa level used for monitoring in renal insufficiency, obesity, pregnancy. Direct oral anticoagulants (DOACs): dabigatran (direct thrombin inhibitor), rivaroxaban/apixaban/edoxaban (factor Xa inhibitors) \u2014 no routine lab monitoring needed.",
    "keypoints": [
      "PTT monitors heparin (UFH); PT/INR monitors warfarin",
      "LMWH (enoxaparin): monitor with anti-Xa level in special populations",
      "Warfarin inhibits vitamin K epoxide reductase \u2192 \u2193II, VII, IX, X, protein C/S",
      "Heparin enhances antithrombin \u2192 inhibits IIa and Xa (intrinsic pathway)"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A 62-year-old man with a 40-pack-year smoking history presents for routine follow-up. He reports dyspnea on exertion and morning sputum production. FEV1/FVC is 0.55. Complete blood count shows hemoglobin of 18.1 g/dL and hematocrit of 54%. Oxygen saturation is 88% on room air.",
    "lead": "What is the mechanism underlying this patient's elevated hemoglobin and hematocrit?",
    "choices": [
      "Autonomous erythrocyte overproduction from JAK2 V617F mutation \u2014 the same pathway responsible for polycythemia vera",
      "Dehydration from chronic diuretic use reducing plasma volume \u2014 increasing hematocrit without increasing true red cell mass",
      "Chronic hypoxemia from COPD stimulating EPO secretion from peritubular cells \u2014 driving compensatory secondary erythrocytosis",
      "Ectopic EPO production from squamous cell carcinoma of the lung \u2014 a paraneoplastic secondary erythrocytosis",
      "Iron overload from compensatory increased iron absorption \u2014 shifting erythropoiesis toward microcytic hypochromic erythrocyte overproduction"
    ],
    "answer": 2,
    "explanation": "<strong>COPD causes chronic hypoxemia \u2192 renal peritubular cells (interstitial fibroblasts) sense low PO\u2082 \u2192 HIF-1\u03b1 stabilization \u2192 \u2191EPO gene transcription \u2192 \u2191EPO secretion \u2192 stimulates erythroid progenitor proliferation in bone marrow \u2192 compensatory secondary erythrocytosis. This is an appropriate, physiological response \u2014 EPO is elevated.</strong><br><br>This secondary polycythemia is associated with:<ul style='margin:8px 0 8px 20px;'><li>COPD ('blue bloaters' \u2014 hypoxic and hypercapnic)</li><li>IPF (chronic hypoxemia)</li><li>High-altitude residence</li><li>Right-to-left cardiac shunts</li><li>Sleep apnea</li></ul>Compare to PV: EPO is LOW (autonomous overproduction), JAK2 V617F, associated splenomegaly, thrombocytosis, leukocytosis. The 'appropriate' vs. 'autonomous' distinction is the core test concept.",
    "keypoints": [
      "COPD \u2192 chronic hypoxemia \u2192 \u2191EPO \u2192 compensatory secondary erythrocytosis (appropriate)",
      "EPO elevated in secondary polycythemia; EPO suppressed in polycythemia vera",
      "COPD polycythemia: blue bloater phenotype; also occurs in IPF, high altitude, sleep apnea",
      "PV: JAK2 V617F, splenomegaly, pancytosis \u2014 EPO is LOW"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A 45-year-old woman with progressive exertional dyspnea and syncope on exertion is evaluated. Echocardiogram shows RV dilation and a mean pulmonary artery pressure of 42 mmHg. Right heart catheterization confirms pulmonary arterial hypertension. Lung biopsy shows thickened pulmonary arteriolar walls with concentric laminar intimal fibrosis and medial hypertrophy of the smooth muscle layer.",
    "lead": "Which vascular changes on biopsy are most characteristic of pulmonary arterial hypertension?",
    "choices": [
      "Organizing thrombi with recanalization in large elastic pulmonary arteries \u2014 typical of chronic thromboembolic pulmonary hypertension",
      "Medial hypertrophy of smooth muscle and intimal fibrosis \u2014 characteristic of pulmonary arterial hypertension affecting muscular pulmonary arteries",
      "Fibrinoid necrosis of small arterioles with granulomatous inflammation \u2014 typical of vasculitis-associated pulmonary hypertension",
      "Centrilobular emphysematous change with smooth muscle atrophy \u2014 typical of COPD-associated pulmonary hypertension",
      "Dense collagen deposition replacing pulmonary capillaries \u2014 typical of IPF-associated vascular obliteration"
    ],
    "answer": 1,
    "explanation": "<strong>Pulmonary arterial hypertension (PAH) has a characteristic histopathology: medial hypertrophy (smooth muscle proliferation in the tunica media of pulmonary arterioles) + concentric laminar intimal fibrosis \u2192 progressive luminal narrowing \u2192 increased pulmonary vascular resistance. Advanced PAH also shows plexiform lesions ('plexiform arteriopathy') \u2014 chaotic proliferating endothelial channels \u2014 a hallmark of severe PAH.</strong><br><br>PAH classification (WHO groups):<ul style='margin:8px 0 8px 20px;'><li>Group 1 (PAH): idiopathic, heritable (BMPR2 mutation), drug/toxin-induced, connective tissue disease, HIV, portal hypertension</li><li>Group 2: left heart disease</li><li>Group 3: lung disease / hypoxia (COPD, IPF)</li><li>Group 4: chronic thromboembolic PH</li></ul>BMPR2 mutation: autosomal dominant, ~70% of heritable PAH. Treatment of Group 1 PAH: phosphodiesterase-5 inhibitors (sildenafil), endothelin receptor antagonists (bosentan), prostacyclin analogs (epoprostenol).",
    "keypoints": [
      "PAH histology: medial hypertrophy + intimal fibrosis \u2192 luminal narrowing; advanced: plexiform lesions",
      "BMPR2 mutation: heritable PAH; autosomal dominant",
      "PAH treatment: PDE-5 inhibitors, endothelin antagonists, prostacyclin analogs",
      "Distinguish PAH (Group 1) from chronic thromboembolic PH (Group 4): recanalized thrombi on biopsy"
    ]
  },
  {
    "tag": "heme",
    "stem": "A 58-year-old obese woman returns from a 14-hour flight and develops right calf pain and swelling. Duplex ultrasound confirms a right popliteal DVT. Her physician explains that clot propagation in venous thrombosis involves platelet activation by a locally produced eicosanoid.",
    "lead": "Which eicosanoid promotes platelet aggregation and vasoconstriction at the site of DVT formation, and from where is it derived?",
    "choices": [
      "Prostacyclin (PGI\u2082) \u2014 released by endothelial cells; promotes platelet aggregation and vasoconstriction at thrombosis sites",
      "Thromboxane A\u2082 (TXA\u2082) \u2014 released by activated platelets; promotes platelet aggregation and vasoconstriction, amplifying clot formation",
      "Leukotriene B\u2084 (LTB\u2084) \u2014 released by neutrophils; promotes platelet aggregation and vasoconstriction via GPCRs on platelet membranes",
      "Platelet-activating factor (PAF) \u2014 released by mast cells; promotes platelet aggregation and vasoconstriction by binding PAF receptor on platelets",
      "Lipoxin A\u2084 \u2014 released by macrophages at thrombosis sites; promotes platelet aggregation and vasoconstriction via the formyl peptide receptor"
    ],
    "answer": 1,
    "explanation": "<strong>Thromboxane A\u2082 (TXA\u2082) is produced by activated platelets via COX-1 from arachidonic acid. TXA\u2082 acts on its receptor (TP) to: (1) stimulate further platelet aggregation (positive feedback loop), (2) cause vasoconstriction, and (3) promote fibrinogen binding by activating GPIIb/IIIa receptors. TXA\u2082 is the dominant amplifier of platelet plug formation in venous thrombosis.</strong><br><br>Prostacyclin (PGI\u2082) is the physiological antagonist: released by intact endothelium \u2192 inhibits platelet aggregation (\u2191cAMP) and causes vasodilation. The TXA\u2082/PGI\u2082 balance determines whether platelets aggregate or remain quiescent.<br><br>Aspirin: irreversibly inhibits COX-1 (and COX-2) \u2192 \u2193TXA\u2082 production in platelets (platelets have no nucleus, cannot regenerate COX) \u2192 reduced platelet aggregation. This is aspirin's antiplatelet mechanism.",
    "keypoints": [
      "TXA\u2082: released by platelets; promotes platelet aggregation + vasoconstriction (amplifies clot)",
      "PGI\u2082 (prostacyclin): released by endothelium; inhibits platelet aggregation + vasodilates (opposes TXA\u2082)",
      "Aspirin: irreversibly inhibits COX-1 \u2192 \u2193TXA\u2082 \u2192 antiplatelet effect",
      "TXA\u2082 and PGI\u2082 are both COX products from arachidonic acid; opposite effects"
    ]
  },
  {
    "tag": "pulm",
    "stem": "A 26-year-old woman with a 5-year history of asthma presents for an urgent visit during an exacerbation. She had three ER visits last year. Her current medications include a short-acting \u03b22-agonist (albuterol) and low-dose inhaled corticosteroids. Her allergist explains that her persistent symptoms are related to leukotriene signaling and proposes adding an agent that targets this pathway.",
    "lead": "Which leukotriene plays the most prominent role in asthma pathophysiology, and what are its effects on the airway?",
    "choices": [
      "Leukotriene B\u2084 (LTB\u2084) \u2014 promotes neutrophil chemotaxis and airway wall neutrophilia; the dominant leukotriene driving airway remodeling in asthma",
      "Leukotriene C\u2084 (LTC\u2084) \u2014 causes bronchoconstriction, increased vascular permeability, and mucus secretion; a major mediator of asthmatic airway inflammation",
      "Leukotriene D\u2084 (LTD\u2084) \u2014 causes vasoconstriction of pulmonary arterioles, increasing pulmonary arterial pressure and worsening hypoxemia in acute asthma",
      "Leukotriene E\u2084 (LTE\u2084) \u2014 promotes mast cell degranulation and IgE-mediated release of histamine, amplifying the early-phase asthmatic response",
      "Leukotriene A\u2084 (LTA\u2084) \u2014 an epoxide intermediate that directly binds airway smooth muscle receptors, causing sustained bronchospasm independent of downstream leukotrienes"
    ],
    "answer": 1,
    "explanation": "<strong>Cysteinyl leukotrienes (LTC\u2084, LTD\u2084, LTE\u2084) are the key mediators of asthmatic bronchoconstriction. LTC\u2084 is the first cysteinyl leukotriene produced from LTA\u2084 and is converted to LTD\u2084 then LTE\u2084. They bind CysLT1 receptors on airway smooth muscle and mucus-secreting cells \u2192 bronchoconstriction + \u2191vascular permeability + \u2191mucus secretion. LTC\u2084/LTD\u2084 are substantially more potent bronchoconstrictors than histamine.</strong><br><br>Asthma mediator summary:<ul style='margin:8px 0 8px 20px;'><li><strong>Histamine:</strong> early phase; bronchoconstriction, vasodilation, mucus</li><li><strong>LTC\u2084/LTD\u2084/LTE\u2084 (cysteinyl LTs):</strong> bronchoconstriction (potent), \u2191permeability, mucus; targeted by zafirlukast/montelukast</li><li><strong>LTB\u2084:</strong> neutrophil chemotaxis; less role in asthma, more in COPD/neutrophilic inflammation</li><li><strong>IL-5:</strong> eosinophil activation; targeted by mepolizumab</li></ul>LTD\u2084 is actually the most potent bronchoconstrictor among the cysteinyl LTs, but LTC\u2084 is the first produced \u2014 both are testable.",
    "keypoints": [
      "LTC\u2084 (and LTD\u2084, LTE\u2084) = cysteinyl leukotrienes \u2014 key asthma mediators: bronchoconstriction + mucus + \u2191permeability",
      "LTB\u2084: neutrophil chemotaxis; less prominent in asthma (more in COPD/neutrophilic inflammation)",
      "Zafirlukast/montelukast block CysLT1 receptor \u2014 target of cysteinyl leukotrienes",
      "Cysteinyl LTs are more potent bronchoconstrictors than histamine"
    ]
  }
];
