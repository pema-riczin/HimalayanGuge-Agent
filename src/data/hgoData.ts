import { ClinicSite, InventoryItem, SowaRigpaRemedy, MonasteryArchive, TriageRecord } from '../types/index.ts';

export const CLINIC_SITES: ClinicSite[] = [
  {
    id: 'tsonup',
    name: 'Tsonup Community Clinic & Health Post',
    nameTibetan: 'མཚོ་ནུབ་སྨན་ཁང་།',
    location: 'Upper Mustang, Northern Border Ridge',
    altitudeMeters: 3850,
    coordinator: 'Amchi Karma Tenzin & Field Nurse Dolma',
    contactChannel: 'Satellite Radio Ch 4 / Gar-min InReach',
    populationServed: 820,
    status: 'restock_urgently',
    description: 'Serves nomadic yak herder families and Tsonup Monastic School. Extreme wind chill and complete winter snow lock-in from November through March.',
    coordinates: '29.1842° N, 83.9512° E',
    distanceFromJomsom: '14 hours by rugged high-clearance 4WD jeep'
  },
  {
    id: 'tsarang',
    name: 'Tsarang Rural Health Post & Dental Hub',
    nameTibetan: 'ཙ་རང་འཕྲོད་བསྟེན་ས་ཚིགས།',
    location: 'Tsarang Village, Upper Mustang',
    altitudeMeters: 3560,
    coordinator: 'Dr. Sarah Lin (HGO Volunteer) & Amchi Pema',
    contactChannel: 'Ncell / Nepal Telecom (intermittent) & WhatsApp',
    populationServed: 1250,
    status: 'operational',
    description: 'Base of the annual HGO dental and cataract surgical camps adjacent to the 14th-century Tsarang Gompa. High caseload of chronic dental abscesses and cataract pterygium.',
    coordinates: '29.0528° N, 83.9267° E',
    distanceFromJomsom: '10 hours by jeep'
  },
  {
    id: 'lomanthang',
    name: 'Lo Manthang Walled Capital Clinic',
    nameTibetan: 'གློ་སྨོན་ཐང་སྨན་ཁང་།',
    location: 'Lo Manthang Core, Upper Mustang',
    altitudeMeters: 3840,
    coordinator: 'Kunga Dhondup (HGO Mustang Director)',
    contactChannel: 'Ncell 4G tower (solar powered, 6 hrs/day)',
    populationServed: 2100,
    status: 'operational',
    description: 'Central triage node for all medical expeditions entering Upper Mustang. Houses temporary dental chairs and the regional Sowa-Rigpa herbal dispensary.',
    coordinates: '29.1824° N, 83.9567° E',
    distanceFromJomsom: '12 hours via Kagbeni & Chhusang passes'
  },
  {
    id: 'bigu',
    name: 'Bigu Nunnery Health Outpost (Tashi Chime Gatsal)',
    nameTibetan: 'བི་གུ་ཇོ་མོ་དགོན་པའི་སྨན་ཁང་།',
    location: 'Bigu Valley, Dolakha District',
    altitudeMeters: 2500,
    coordinator: 'Ani Choden (Health Sister)',
    contactChannel: 'VHF Handheld & WhatsApp via mountain booster',
    populationServed: 450,
    status: 'winter_standby',
    description: 'Provides primary healthcare and winter health packs for 45 Buddhist nuns (Anis) and neighboring Tamang & Sherpa subsistence farming hamlets.',
    coordinates: '27.8105° N, 86.1523° E',
    distanceFromJomsom: 'Central-Eastern Himalayas (6 hrs from Charikot by foot/jeep)'
  },
  {
    id: 'chhoser',
    name: 'Chhoser High Cave Hermitage Post',
    nameTibetan: 'ཆོས་ཤར་བྲག་ཕུག་སྨན་བཅོས་ས་ཚིགས།',
    location: 'Chhoser Sky Caves, Tibetan Frontier',
    altitudeMeters: 3920,
    coordinator: 'Amchi Nyima & Field Paramedic Pasang',
    contactChannel: 'Satellite InReach Satellite Node 2',
    populationServed: 630,
    status: 'restock_urgently',
    description: 'Ultra-high altitude post supporting cave retreat hermits and border nomadic pastoralists during harsh blizzards.',
    coordinates: '29.2311° N, 83.9840° E',
    distanceFromJomsom: '16 hours by high-clearance 4WD'
  },
  {
    id: 'kagbeni',
    name: 'Kagbeni Gateway Acclimatization Station',
    nameTibetan: 'སྐག་བེན་ནི་ལ་དུག་བརྟག་དཔྱད་ཁང་།',
    location: 'Kagbeni, Lower Mustang Entry',
    altitudeMeters: 2800,
    coordinator: 'Dr. Rajesh Shrestha',
    contactChannel: 'Ncell Fiber Broadband / Landline',
    populationServed: 950,
    status: 'operational',
    description: 'First mandatory medical checkpoint where incoming international volunteers and porters undergo baseline Lake Louise AMS screening.',
    coordinates: '28.8353° N, 83.7820° E',
    distanceFromJomsom: '45 mins by jeep from Jomsom Airport'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Tsonup Clinic
  {
    id: 'inv-1',
    clinicId: 'tsonup',
    name: 'Amoxicillin + Clavulanic Acid 625mg',
    category: 'antibiotic',
    quantity: 18,
    minThreshold: 40,
    unit: 'boxes (10 tabs)',
    expiryDate: '2027-04',
    criticalForWinter: true,
    notes: 'Urgent: severe dental and respiratory infection treatments before passes freeze.'
  },
  {
    id: 'inv-2',
    clinicId: 'tsonup',
    name: 'Portable O₂ Canisters (10L with Mask)',
    category: 'altitude_emergency',
    quantity: 3,
    minThreshold: 8,
    unit: 'cylinders',
    expiryDate: '2028-12',
    criticalForWinter: true,
    notes: 'Critical buffer for acute HAPE/AMS evacuations from high passes.'
  },
  {
    id: 'inv-3',
    clinicId: 'tsonup',
    name: 'Acetazolamide (Diamox) 250mg',
    category: 'altitude_emergency',
    quantity: 120,
    minThreshold: 100,
    unit: 'tablets',
    expiryDate: '2027-09',
    criticalForWinter: true,
    notes: 'Essential for incoming porters, drivers, and ascending villagers.'
  },
  {
    id: 'inv-4',
    clinicId: 'tsonup',
    name: 'Agar-35 (Traditional Sowa-Rigpa Formula)',
    category: 'sowa_rigpa',
    quantity: 8,
    minThreshold: 20,
    unit: 'bottles (100 pills)',
    expiryDate: '2028-06',
    criticalForWinter: true,
    notes: 'For cold wind rLung aggravation, palpitations, insomnia, and altitude anxiety.'
  },
  {
    id: 'inv-5',
    clinicId: 'tsonup',
    name: 'Sterile Dental Extraction Forceps Set',
    category: 'dental',
    quantity: 2,
    minThreshold: 4,
    unit: 'sets (autoclaved)',
    expiryDate: '2030-01',
    criticalForWinter: false,
    notes: 'One forceps hinge worn from heavy field use.'
  },
  {
    id: 'inv-5b',
    clinicId: 'tsonup',
    name: 'Pediatric Amoxicillin Suspension 125mg/5ml',
    category: 'antibiotic',
    quantity: 12,
    minThreshold: 25,
    unit: 'bottles',
    expiryDate: '2027-01',
    criticalForWinter: true,
    notes: 'High incidence of winter bronchiolitis in nomad toddlers.'
  },

  // Tsarang Health Post
  {
    id: 'inv-6',
    clinicId: 'tsarang',
    name: 'Lidocaine 2% with Epinephrine 1:100,000',
    category: 'dental',
    quantity: 45,
    minThreshold: 80,
    unit: 'ampoules',
    expiryDate: '2026-11',
    criticalForWinter: true,
    notes: 'Critical restock needed before upcoming 4-day volunteer dental camp.'
  },
  {
    id: 'inv-7',
    clinicId: 'tsarang',
    name: 'Ciprofloxacin Eye Drops 0.3%',
    category: 'ophthalmic',
    quantity: 24,
    minThreshold: 50,
    unit: 'vials',
    expiryDate: '2027-02',
    criticalForWinter: false,
    notes: 'High demand due to indoor wood smoke & dry Himalayan dust irritation.'
  },
  {
    id: 'inv-8',
    clinicId: 'tsarang',
    name: 'Ibuprofen 400mg & Paracetamol 500mg',
    category: 'analgesic',
    quantity: 650,
    minThreshold: 400,
    unit: 'tablets',
    expiryDate: '2027-10',
    criticalForWinter: false,
    notes: 'Good standing buffer for osteoarthritis in elderly yak herders.'
  },
  {
    id: 'inv-9',
    clinicId: 'tsarang',
    name: 'Dexamethasone 4mg/ml (Injectable)',
    category: 'altitude_emergency',
    quantity: 12,
    minThreshold: 15,
    unit: 'vials',
    expiryDate: '2027-08',
    criticalForWinter: true,
    notes: 'Emergency protocol for severe High-Altitude Cerebral Edema (HACE).'
  },
  {
    id: 'inv-10',
    clinicId: 'tsarang',
    name: 'Semde (Sorig Calming Mental Peace Pills)',
    category: 'sowa_rigpa',
    quantity: 25,
    minThreshold: 15,
    unit: 'pouches',
    expiryDate: '2028-05',
    criticalForWinter: false,
    notes: 'Calms agitated heart rLung, improves restful sleep in cold dry winds.'
  },
  {
    id: 'inv-10b',
    clinicId: 'tsarang',
    name: 'Glass Ionomer Dental Filling Kit (Fuji IX)',
    category: 'dental',
    quantity: 6,
    minThreshold: 10,
    unit: 'kits',
    expiryDate: '2027-12',
    criticalForWinter: false,
    notes: 'Atraumatic restorative treatment in children without drill requirements.'
  },

  // Lo Manthang Clinic
  {
    id: 'inv-11',
    clinicId: 'lomanthang',
    name: 'Suture Kits (3-0 & 4-0 Ethilon Nylon)',
    category: 'surgical',
    quantity: 35,
    minThreshold: 20,
    unit: 'packs',
    expiryDate: '2029-03',
    criticalForWinter: false,
    notes: 'Stocked for trauma and laceration repairs.'
  },
  {
    id: 'inv-12',
    clinicId: 'lomanthang',
    name: 'Pulse Oximeters (Fingertip High-Altitude calibrated)',
    category: 'altitude_emergency',
    quantity: 4,
    minThreshold: 6,
    unit: 'devices',
    expiryDate: '2032-01',
    criticalForWinter: true,
    notes: 'Battery compartments need lithium AAA cells (cold resistance).'
  },
  {
    id: 'inv-12b',
    clinicId: 'lomanthang',
    name: 'Nifedipine 20mg Sustained Release',
    category: 'altitude_emergency',
    quantity: 60,
    minThreshold: 40,
    unit: 'tablets',
    expiryDate: '2027-08',
    criticalForWinter: true,
    notes: 'Pulmonary vasodilator for suspected High Altitude Pulmonary Edema (HAPE).'
  },
  {
    id: 'inv-12c',
    clinicId: 'lomanthang',
    name: 'Tshel-mar-25 (Bile-Liver Sorig Formula)',
    category: 'sowa_rigpa',
    quantity: 32,
    minThreshold: 20,
    unit: 'bottles',
    expiryDate: '2028-04',
    criticalForWinter: false,
    notes: 'For hepatic heat, yellow eye sclera, and bilious headaches.'
  },

  // Bigu Nunnery
  {
    id: 'inv-13',
    clinicId: 'bigu',
    name: 'Metformin 500mg & Amlodipine 5mg',
    category: 'analgesic',
    quantity: 320,
    minThreshold: 200,
    unit: 'tablets',
    expiryDate: '2027-07',
    criticalForWinter: true,
    notes: 'Maintenance therapy for senior elderly nuns.'
  },
  {
    id: 'inv-14',
    clinicId: 'bigu',
    name: 'Tshel-mar-25 (Digestive & Spleen Sorig Formulation)',
    category: 'sowa_rigpa',
    quantity: 14,
    minThreshold: 10,
    unit: 'bottles',
    expiryDate: '2028-01',
    criticalForWinter: false,
    notes: 'Enhances metabolic heat (Me-drod) during winter fasting retreats.'
  },
  {
    id: 'inv-14b',
    clinicId: 'bigu',
    name: 'Diclofenac Topical Pain Gel (1%)',
    category: 'analgesic',
    quantity: 42,
    minThreshold: 30,
    unit: 'tubes',
    expiryDate: '2027-06',
    criticalForWinter: true,
    notes: 'For nun knee osteoarthritis caused by stone floor prostrations.'
  },

  // Chhoser High Cave Post
  {
    id: 'inv-15',
    clinicId: 'chhoser',
    name: 'Gamow Bag Portable Hyperbaric Chamber',
    category: 'altitude_emergency',
    quantity: 1,
    minThreshold: 2,
    unit: 'unit',
    expiryDate: '2030-01',
    criticalForWinter: true,
    notes: 'Vital lifesaving chamber when blizzard prevents helicopter extraction.'
  },
  {
    id: 'inv-16',
    clinicId: 'chhoser',
    name: 'Thermal Foil Space Blankets (Heavy Duty)',
    category: 'altitude_emergency',
    quantity: 28,
    minThreshold: 50,
    unit: 'blankets',
    expiryDate: '2035-01',
    criticalForWinter: true,
    notes: 'Hypothermia prevention in nomadic yak caravans.'
  },

  // Kagbeni Acclimatization Gateway
  {
    id: 'inv-17',
    clinicId: 'kagbeni',
    name: 'UV Cat 4 Glacier Glasses (Protective)',
    category: 'ophthalmic',
    quantity: 85,
    minThreshold: 100,
    unit: 'pairs',
    expiryDate: '2035-01',
    criticalForWinter: false,
    notes: 'Dispensed to ascending porters and local children.'
  }
];

export const SOWA_RIGPA_HERBS: SowaRigpaRemedy[] = [
  {
    id: 'agar-35',
    nameTibetan: 'ཨ་གར་སོ་ལྔ།',
    nameWylie: 'A-gar so lnga',
    nameEnglish: 'Eaglewood 35 Compounded Formula',
    primaryHumor: 'rLung (Wind)',
    thermalNature: 'Neutral',
    dominantTastes: ['Astringent', 'Bitter', 'Sweet'],
    primaryIndication: 'High-altitude rLung disturbance, palpitations, insomnia, upper back tension, cold wind vertigo, mental restlessness.',
    traditionalPreparation: 'Compound of Aquilaria agallocha (Agarwood), nutmeg (*dza-ti*), clove (*li-shi*), cardamom, and 31 alpine minerals and herbs. Taken with boiled warm water.',
    dosageGuidelines: '1-2 round pills crushed, taken in evening with warm boiled water or hot bone broth.',
    highAltitudeContext: 'Primary remedy in Mustang for non-acclimatized travelers and local elders experiencing wind-chill agitation and sleep fragmentation.',
    contraindications: 'Do not take with cold icy water or excessive raw refrigerated foods.'
  },
  {
    id: 'semde',
    nameTibetan: 'སེམས་བདེ།',
    nameWylie: 'Sems bde',
    nameEnglish: 'Semde (Mental Bliss & Heart-Lung Calmer)',
    primaryHumor: 'rLung (Wind)',
    thermalNature: 'Warm / Hot',
    dominantTastes: ['Sweet', 'Aromatic', 'Pungent'],
    primaryIndication: 'Sorrow, grief, emotional distress, tightness in chest, cold numbness in extremities, nervous exhaustion.',
    traditionalPreparation: 'Nutmeg, bamboo manna (*cu-gang*), safflower (*gur-kum*), frankincense (*spos-dkar*).',
    dosageGuidelines: '1 pill daily in the morning or late afternoon with warm sweet tea or butter tea.',
    highAltitudeContext: 'Used during high pass crossings when severe fatigue produces spiritual and physical despondency.',
    contraindications: 'Acute high fever or active bleeding disorders.'
  },
  {
    id: 'tshel-mar-25',
    nameTibetan: 'ཚལ་དམར་ཉེར་ལྔ།',
    nameWylie: 'Tshal dmar nyer lnga',
    nameEnglish: 'Red Cinnabar 25 / Tshel-mar',
    primaryHumor: 'mKhris-pa (Bile)',
    thermalNature: 'Cool / Cold',
    dominantTastes: ['Bitter', 'Astringent'],
    primaryIndication: 'Liver heat, biliary stasis, yellow eye sclera, headache radiating behind temples, acid dyspepsia.',
    traditionalPreparation: 'Gentiana chiretta, Swertia chirayita (*tig-ta*), Picrorhiza kurroa, saffron.',
    dosageGuidelines: '1 pill twice daily before meals with lukewarm water.',
    highAltitudeContext: 'Frequent among herders consuming heavy alcohol or rancid fats during winter.',
    contraindications: 'Severe digestive fire deficiency (cold stomach).'
  },
  {
    id: 'yungwa-4',
    nameTibetan: 'གཡུང་བ་བཞི་པ།',
    nameWylie: 'gYung-ba bzhi pa',
    nameEnglish: 'Turmeric 4 (Anti-inflammatory & Urinary Sorig Compound)',
    primaryHumor: 'Bad-kan (Phlegm)',
    thermalNature: 'Warm / Hot',
    dominantTastes: ['Pungent', 'Bitter'],
    primaryIndication: 'Joint stiffness in cold damp valleys, urinary tract discomfort, sluggish metabolism, lymphatic stagnation.',
    traditionalPreparation: 'Himalayan mountain Curcuma longa (Turmeric), Terminalia chebula (*A-ru-ra*), Piper longum.',
    dosageGuidelines: '2 tablets morning with warm honey water or barley water.',
    highAltitudeContext: 'Counteracts joint stiffness from sub-zero night temperatures in stone stone-walled Mustang dwellings.',
    contraindications: 'Dehydration with acute heat exhaustion.'
  },
  {
    id: 'zhidche-11',
    nameTibetan: 'ཞི་བྱེད་བཅུ་གཅིག',
    nameWylie: 'Zhi byed bcu gcig',
    nameEnglish: 'Pacifier 11 (Gastric Fire Restorer)',
    primaryHumor: 'Dual / Complex',
    thermalNature: 'Warm / Hot',
    dominantTastes: ['Pungent', 'Sour', 'Salty'],
    primaryIndication: 'Loss of digestive metabolic fire (*Me-drod*), chronic indigestion, feeling cold in the abdomen, fullness after eating.',
    traditionalPreparation: 'Pomegranate seeds (*se-’bru*), ginger (*sman-sgog*), long pepper, cinnamon bark.',
    dosageGuidelines: '1/2 teaspoon powder or 2 pills dissolved in warm water 15 minutes before lunch.',
    highAltitudeContext: 'Essential at altitudes >3,500m where boiling point drops to 88°C and food digestion takes significantly longer.',
    contraindications: 'Gastric peptic ulceration with active bleeding.'
  },
  {
    id: 'gurkum-13',
    nameTibetan: 'གུར་ཀུམ་བཅུ་གསུམ།',
    nameWylie: 'Gur-kum bcu gsum',
    nameEnglish: 'Saffron 13 (Hepatic & Blood Purifier)',
    primaryHumor: 'mKhris-pa (Bile)',
    thermalNature: 'Cool / Cold',
    dominantTastes: ['Astringent', 'Sweet'],
    primaryIndication: 'Liver inflammation, blood heat disorders, dry cracked skin from UV exposure, eye redness.',
    traditionalPreparation: 'Kashmir Saffron, sandalwood (*tsan-dan*), bamboo concretion, licorice.',
    dosageGuidelines: '1 pill daily with warm boiled milk or water.',
    highAltitudeContext: 'Protects capillary integrity under intense high-altitude ultraviolet radiation.',
    contraindications: 'Cold phlegm accumulation.'
  }
];

export const MONASTERY_ARCHIVES: MonasteryArchive[] = [
  {
    id: 'bigu-nunnery',
    name: 'Bigu Nunnery (Tashi Chime Gatsal)',
    nameTibetan: 'བཀྲ་ཤིས་འཆི་མེད་དགའ་ཚལ་ཇོ་མོ་དགོན་པ།',
    location: 'Bigu Valley, Dolakha District',
    establishedCentury: '1933 CE (Founded by Lama Tomden)',
    tradition: 'Drukpa Kagyu',
    altitudeMeters: 2500,
    communityMembers: 45,
    restorationStatus: 'In Progress',
    targetFundingUSD: 24000,
    raisedFundingUSD: 16800,
    keyProjects: [
      {
        title: 'Passive Solar Wall & Thermal Insulation for Elder Nuns Living Quarters',
        description: 'Winter temperatures plunge below -8°C; retrofitting double-glazed timber framing and sheep wool insulation.',
        urgency: 'high',
        costUSD: 9500
      },
      {
        title: 'Clean Water Micro-Catchment & Filtration Unit',
        description: 'Replaces earthquake-damaged terracotta channel with food-grade HDPE pipes from upper spring.',
        urgency: 'high',
        costUSD: 4200
      },
      {
        title: 'Sacred Tara Shrine Woodwork & Roof Weatherproofing',
        description: 'Restoration of hand-carved cedar beams and traditional copper guttering.',
        urgency: 'medium',
        costUSD: 3100
      }
    ],
    description: 'A sanctuary of deep silence and continuous Nyungne fasting practice. The 45 resident nuns live an austere monastic lifestyle while serving as herbal caretakers for neighboring hill tribes.',
    heritageSignificance: 'One of the few remaining autonomous women’s monastic colleges in Nepal specializing in the Avalokiteshvara 1,000-Armed Nyungne transmission lineage.'
  },
  {
    id: 'tsarang-gompa',
    name: 'Tsarang Monastery & Royal Medical Library',
    nameTibetan: 'ཙ་རང་དགོན་པ།',
    location: 'Tsarang, Upper Mustang',
    establishedCentury: '1395 CE (Built by King Ame Pal)',
    tradition: 'Sakya',
    altitudeMeters: 3560,
    communityMembers: 32,
    restorationStatus: 'Urgent Appeal',
    targetFundingUSD: 38000,
    raisedFundingUSD: 21500,
    keyProjects: [
      {
        title: 'Preservation of Sowa-Rigpa Medical Block Prints & Xylographs',
        description: 'High-resolution digitization and archival non-acidic storage of 300-year-old Mustang Amchi medicinal folios.',
        urgency: 'high',
        costUSD: 8500
      },
      {
        title: 'South Wall Buttress Stabilization',
        description: 'Reinforcing drying mud-brick rampart eroded by windstorms along the Kali Gandaki tributary canyon.',
        urgency: 'high',
        costUSD: 14000
      },
      {
        title: 'Monastic Youth Study Room Solar Heating',
        description: 'Solar air heaters to allow young novice monks to study Tibetan script through deep winter.',
        urgency: 'medium',
        costUSD: 5500
      }
    ],
    description: 'An iconic crimson fortress-gompa towering over the canyon. It houses priceless golden statues, 600-year-old murals depicting the medicine Buddha, and Mustang’s premier historical library.',
    heritageSignificance: 'Original royal seat of the Mustang Kingdom prior to the founding of Lo Manthang; historical center of Sowa-Rigpa training for Lo kingdom Amchis.'
  },
  {
    id: 'chhoser-cave',
    name: 'Chhoser Shija Jhong Cave Hermitage & Nunnery',
    nameTibetan: 'ཆོས་ཤར་ཞི་བ་རྫོང་བྲག་ཕུག',
    location: 'Chhoser, Northern Mustang (near Tibet border)',
    establishedCentury: '8th - 11th Century CE',
    tradition: 'Nyingma',
    altitudeMeters: 3900,
    communityMembers: 18,
    restorationStatus: 'In Progress',
    targetFundingUSD: 18000,
    raisedFundingUSD: 13200,
    keyProjects: [
      {
        title: 'Internal Cave Structural Supports & Safety Ladder Retrofit',
        description: 'Replacing unsafe rotting timber climb-shafts inside the 5-story cliff cave complex with powder-coated steel anchors.',
        urgency: 'high',
        costUSD: 6200
      },
      {
        title: 'Cliff-Drip Water Harvesting & Disinfection Basin',
        description: 'Capturing clean mineral cliff runoff for the resident meditation hermits.',
        urgency: 'medium',
        costUSD: 3800
      }
    ],
    description: 'A 5-story multi-chamber cave city carved directly into vertical conglomerate cliffs. Ancient retreat cells where Padmasambhava disciples and meditation masters practiced.',
    heritageSignificance: 'Archaeological marvel of pre-Buddhist and early Tibetan Buddhist sky caves with intact clay ovens, storage silos, and sacred meditation chambers.'
  }
];

export const SAMPLE_TRIAGE_RECORDS: TriageRecord[] = [
  {
    id: 'TR-2026-081',
    timestamp: '2026-09-24T09:15:00Z',
    patientName: 'Pema Wangmo',
    age: 58,
    gender: 'Female',
    village: 'Ghemi (3,510m)',
    clinicSiteId: 'tsarang',
    altitudeMeters: 3560,
    chiefComplaint: 'Severe throbbing lower right molar pain with submandibular swelling for 5 days. Unable to chew tsampa.',
    lakeLouise: {
      headache: 1,
      gastrointestinal: 0,
      fatigueWeakness: 1,
      dizzinessLightheadedness: 0,
      functionalImpairment: 1
    },
    totalAMSScore: 3,
    vitals: {
      spo2: 91,
      heartRate: 84,
      bpSystolic: 128,
      bpDiastolic: 82,
      respRate: 18,
      tempCelsius: 37.8
    },
    triageCategory: 'YELLOW',
    allopathicRecommendations: 'Acute periapical abscess #30. Infiltrate 2% Lidocaine w/ Epi. Surgical dental extraction indicated. Prescribe Amoxicillin 500mg TID + Metronidazole 400mg TID for 5 days. Ibuprofen 400mg TID PRN.',
    sowaRigpaDiagnosis: 'Excess mKhris-pa (Bile heat) converging with localized infection; wind-chill exposure aggravates facial nerves.',
    sowaRigpaHerbalSuggestions: ['Tshel-mar-25', 'Warm salt-water mouth gargle with crushed clove'],
    nepaliInstructions: 'दाँतको जरामा गम्भीर संक्रमण छ। दाँत उखेल्नुपर्छ। यो एन्टिबायोटिक ५ दिनसम्म खानापछि तातो पानीसँग खानुहोस्।',
    tibetanInstructions: 'སོ་རྩ་ལ་གཉན་ཁ་ཤོར་འདུག སོ་འདི་འདྲུད་དགོས། སྨན་འདི་ཉིན་ལྔའི་རིང་ཆུ་ཚན་དང་མཉམ་དུ་འཐུང་དགོས།',
    synced: true
  },
  {
    id: 'TR-2026-082',
    timestamp: '2026-09-24T14:40:00Z',
    patientName: 'Tsering Gyalpo',
    age: 34,
    gender: 'Male',
    village: 'Chhoser nomad camp',
    clinicSiteId: 'tsonup',
    altitudeMeters: 3850,
    chiefComplaint: 'Rapid ascent from Kagbeni today on motorcycle. Severe incapacitating headache, vomiting, unable to walk straight (ataxic gait), SpO2 71%.',
    lakeLouise: {
      headache: 3,
      gastrointestinal: 2,
      fatigueWeakness: 3,
      dizzinessLightheadedness: 3,
      functionalImpairment: 3
    },
    totalAMSScore: 14,
    vitals: {
      spo2: 71,
      heartRate: 118,
      bpSystolic: 145,
      bpDiastolic: 95,
      respRate: 28,
      tempCelsius: 36.6
    },
    triageCategory: 'RED',
    allopathicRecommendations: 'IMMEDIATE EMERGENCY: Severe Acute Mountain Sickness with impending HACE/HAPE. Put on 6L O₂ mask stat. Administer Dexamethasone 8mg PO/IM immediately. Start descent to Jomsom (2,700m) or Kagbeni immediately via emergency 4WD jeep.',
    sowaRigpaDiagnosis: 'Violent upward rushing of life-bearing Wind (Srog-rlung) combined with severe lack of oxygen and cold shock.',
    sowaRigpaHerbalSuggestions: ['Agar-35 (crushed)', 'Warm sesame oil to crown of head (tshangs-bug) while descending'],
    nepaliInstructions: 'अत्यन्त गम्भीर लेक लागेको (हाइ-अल्टिच्युड) आपतकालीन अवस्था! तुरुन्तै अक्सिजन मास्क लगाउनुहोस् र तुरुन्तै गाडीमा जोमसोमतर्फ तल झार्नुहोस्।',
    tibetanInstructions: 'ལ་དུག་དྲག་པོ་ཕོག་འདུག མྱུར་དུ་དབུགས་རླུང་ (Oxygen) སྦྱིན་ནས་མར་ཇོ་མོ་སོ་མོ་ཕྱོགས་སུ་མར་བབས་དགོས། དུས་ཚོད་མ་འགྱངས་བར་མར་ཁྲིད་ཤོག',
    synced: true,
    evacuationRequested: true
  },
  {
    id: 'TR-2026-083',
    timestamp: '2026-09-25T08:30:00Z',
    patientName: 'Ani Yangchen',
    age: 67,
    gender: 'Female',
    village: 'Bigu Nunnery',
    clinicSiteId: 'bigu',
    altitudeMeters: 2500,
    chiefComplaint: 'Bilateral knee pain, worse in morning and during circumambulation (kora). Mild crepitus, no acute effusion.',
    lakeLouise: {
      headache: 0,
      gastrointestinal: 0,
      fatigueWeakness: 1,
      dizzinessLightheadedness: 0,
      functionalImpairment: 1
    },
    totalAMSScore: 2,
    vitals: {
      spo2: 95,
      heartRate: 72,
      bpSystolic: 132,
      bpDiastolic: 84,
      respRate: 16,
      tempCelsius: 36.7
    },
    triageCategory: 'GREEN',
    allopathicRecommendations: 'Chronic osteoarthritis of knees. Provide knee support braces, topical NSAID gel (Diclofenac), and Paracetamol 500mg PRN. Encourage quadriceps strengthening exercises.',
    sowaRigpaDiagnosis: 'Cold Grum-bu (joint disorder) caused by Bad-kan (Phlegm) & cold rLung settling in synovial joints from damp stone floors.',
    sowaRigpaHerbalSuggestions: ['Yungwa-4', 'Moxibustion (Metsa) gentle warming therapy on knee points', 'Warm mustard oil application'],
    nepaliInstructions: 'घुँडाको जोर्नी खिइएको दुखाइ हो। बिहान घाममा बस्नुहोस्, तातो तोरीको तेलले मालिस गर्नुहोस्, र आवश्यक परे यो चक्की खानुहोस्।',
    tibetanInstructions: 'པུས་མོའི་ཚིགས་ལ་གྲུམ་བུའི་ནད་ཞུགས་འདུག ཉི་མར་བསྲོ་བ་དང་ཏིལ་མར་དྲོན་མོས་བྱུག་དགོས།',
    synced: false
  },
  {
    id: 'TR-2026-084',
    timestamp: '2026-09-25T10:15:00Z',
    patientName: 'Kunga Dorje',
    age: 46,
    gender: 'Male',
    village: 'Lo Manthang Northern Outskirts',
    clinicSiteId: 'lomanthang',
    altitudeMeters: 3840,
    chiefComplaint: 'Extreme bilateral eye burning, excessive tearing, photophobia after 8 hours herding yaks across snowfields without sunglasses. Corneal punctate fluorescein uptake.',
    lakeLouise: {
      headache: 1,
      gastrointestinal: 0,
      fatigueWeakness: 1,
      dizzinessLightheadedness: 0,
      functionalImpairment: 2
    },
    totalAMSScore: 4,
    vitals: {
      spo2: 89,
      heartRate: 78,
      bpSystolic: 122,
      bpDiastolic: 78,
      respRate: 16,
      tempCelsius: 36.9
    },
    triageCategory: 'YELLOW',
    allopathicRecommendations: 'Severe High-Altitude Photokeratitis (Snow Blindness). Apply antibiotic ophthalmic ointment (Erythromycin or Ciprofloxacin 0.3%), oral Ibuprofen 400mg, patch eye for 24h, issue Cat 4 UV glacier goggles.',
    sowaRigpaDiagnosis: 'Violent Bile and Wind heat (mKhris-rlung) searing the subtle channels of the eye organ (*Mig-gi dbang-po*).',
    sowaRigpaHerbalSuggestions: ['Gurkum-13', 'Sterile cold rosewater compress', 'Avoid looking into fire or direct sunlight for 3 days'],
    nepaliInstructions: 'हिउँको कडा घामले आँखामा घाउ भएको छ (स्नो ब्लाइन्डनेस)। आँखामा यो मलम हाल्नुहोस्, कालो चश्मा लगाउनुहोस् र घाममा ननिस्कनुहोस्।',
    tibetanInstructions: 'གངས་འོད་ཀྱིས་མིག་ལ་སྐྱོན་ཤོར་འདུག མིག་སྨན་འདི་བརྒྱབ་ནས་ཉི་ཤེལ་ནག་པོ་རྒྱག་དགོས།',
    synced: true
  },
  {
    id: 'TR-2026-085',
    timestamp: '2026-09-25T11:20:00Z',
    patientName: 'Dolma Tenzin',
    age: 72,
    gender: 'Female',
    village: 'Tsonup Nomad Camp',
    clinicSiteId: 'tsonup',
    altitudeMeters: 3850,
    chiefComplaint: 'Severe sleeplessness, heart racing at night, cold chills in lower extremities, weeping easily when wind howls.',
    lakeLouise: {
      headache: 1,
      gastrointestinal: 0,
      fatigueWeakness: 1,
      dizzinessLightheadedness: 0,
      functionalImpairment: 0
    },
    totalAMSScore: 2,
    vitals: {
      spo2: 88,
      heartRate: 88,
      bpSystolic: 138,
      bpDiastolic: 86,
      respRate: 18,
      tempCelsius: 36.5
    },
    triageCategory: 'GREEN',
    allopathicRecommendations: 'Altitude-induced sleep fragmentation and mild chronic hypertension. Maintain hydration. Continue low-dose Amlodipine 5mg. Avoid caffeine in evening.',
    sowaRigpaDiagnosis: 'Classic sNying-rLung (Heart-Wind) disturbance with cold exhaustion from sub-zero autumn drafts.',
    sowaRigpaHerbalSuggestions: ['Agar-35 (crushed in hot butter milk)', 'Semde pills', 'Gentle warm nutmeg-infused sesame oil rub on chest & crown'],
    nepaliInstructions: 'चिसो हावा र उचाइले मुटुको धड्कन बढेको र निद्रा नपरेको हो। बेलुका तातो पानी वा झोल खानुहोस्, यो आयुर्वेदिक चक्की खानुहोस् र न्यानो भएर सुत्नुहोस्।',
    tibetanInstructions: 'སྙིང་རླུང་ལངས་ནས་གཉིད་མི་ཁུག་པ་རེད། ཨ་གར་སོ་ལྔ་དང་སེམས་བདེ་ཆུ་ཚན་དང་མཉམ་དུ་འཐུང་དགོས།',
    synced: false
  },
  {
    id: 'TR-2026-086',
    timestamp: '2026-09-25T11:45:00Z',
    patientName: 'Dawa Norbu (Trekking Porter)',
    age: 27,
    gender: 'Male',
    village: 'Kagbeni Ascent Zone',
    clinicSiteId: 'kagbeni',
    altitudeMeters: 2800,
    chiefComplaint: 'Carried 35kg load rapidly from Pokhara/Jomsom. Productive cough with pink frothy sputum, severe breathlessness at rest, SpO2 68%, bilateral pulmonary crackles.',
    lakeLouise: {
      headache: 3,
      gastrointestinal: 2,
      fatigueWeakness: 3,
      dizzinessLightheadedness: 2,
      functionalImpairment: 3
    },
    totalAMSScore: 13,
    vitals: {
      spo2: 68,
      heartRate: 124,
      bpSystolic: 152,
      bpDiastolic: 98,
      respRate: 34,
      tempCelsius: 37.4
    },
    triageCategory: 'RED',
    allopathicRecommendations: 'CRITICAL HIGH-ALTITUDE PULMONARY EDEMA (HAPE). Immediate high-flow oxygen (6-8 L/min via non-rebreather mask). Administer Nifedipine 20mg SR and Dexamethasone 8mg stat. Keep warm and evacuate downhill immediately to Pokhara/Jomsom hospital.',
    sowaRigpaDiagnosis: 'Catastrophic Glo-ba Chu-shor (Fluid inundation of lungs) provoked by extreme physical overexertion under cold hypoxia.',
    sowaRigpaHerbalSuggestions: ['Immediate emergency evacuation paramount; do not delay for traditional compounds'],
    nepaliInstructions: 'फोक्सोमा पानी जमेको अत्यन्त गम्भीर लेक लागेको अवस्था (HAPE)! तुरुन्तै ८ लिटर अक्सिजन लगाउनुहोस् र तुरुन्तै तल जोमसोम अस्पताल लैजानुहोस्।',
    tibetanInstructions: 'གློ་བར་ཆུ་བསགས་པའི་ལ་དུག་ཚབས་ཆེན་ཕོག་འདུག མྱུར་དུ་དབུགས་རླུང་སྦྱིན་ཏེ་མར་བབས་དགོས།',
    synced: true,
    evacuationRequested: true
  }
];

export const DUMMY_TRIAGE_TEMPLATES = [
  {
    title: 'Severe HAPE/HACE Ascent (RED - 3,850m)',
    patientName: 'Tsering Gyalpo',
    age: 34,
    gender: 'Male' as const,
    village: 'Chhoser Nomad Camp',
    clinicSiteId: 'tsonup',
    chiefComplaint: 'Rapid ascent on motorcycle. Severe vomiting, ataxic staggering gait, confusion, pink sputum, SpO2 71%.',
    lakeLouise: { headache: 3, gastrointestinal: 2, fatigueWeakness: 3, dizzinessLightheadedness: 3, functionalImpairment: 3 },
    vitals: { spo2: 71, heartRate: 118, bpSystolic: 145, bpDiastolic: 95, tempCelsius: 36.6 }
  },
  {
    title: 'Acute Dental Abscess & Facial Swelling (YELLOW - 3,560m)',
    patientName: 'Pema Wangmo',
    age: 58,
    gender: 'Female' as const,
    village: 'Ghemi Village',
    clinicSiteId: 'tsarang',
    chiefComplaint: 'Throbbing lower right molar abscess for 5 days. Unable to chew solid food. Local submandibular lymphadenitis.',
    lakeLouise: { headache: 1, gastrointestinal: 0, fatigueWeakness: 1, dizzinessLightheadedness: 0, functionalImpairment: 1 },
    vitals: { spo2: 91, heartRate: 84, bpSystolic: 128, bpDiastolic: 82, tempCelsius: 37.8 }
  },
  {
    title: 'Snow Blindness / UV Keratitis (YELLOW - 3,840m)',
    patientName: 'Kunga Dorje',
    age: 46,
    gender: 'Male' as const,
    village: 'Lo Manthang Outskirts',
    clinicSiteId: 'lomanthang',
    chiefComplaint: 'Severe photophobia, ocular burning and foreign-body sensation after 8 hours herding yaks across snow fields without UV glasses.',
    lakeLouise: { headache: 1, gastrointestinal: 0, fatigueWeakness: 1, dizzinessLightheadedness: 0, functionalImpairment: 2 },
    vitals: { spo2: 89, heartRate: 78, bpSystolic: 122, bpDiastolic: 78, tempCelsius: 36.9 }
  },
  {
    title: 'Elderly Nun Knee Osteoarthritis (GREEN - 2,500m)',
    patientName: 'Ani Yangchen',
    age: 67,
    gender: 'Female' as const,
    village: 'Bigu Nunnery',
    clinicSiteId: 'bigu',
    chiefComplaint: 'Bilateral knee stiffness and crepitus aggravated by cold temple flagstones during Nyungne fasting retreat.',
    lakeLouise: { headache: 0, gastrointestinal: 0, fatigueWeakness: 1, dizzinessLightheadedness: 0, functionalImpairment: 1 },
    vitals: { spo2: 95, heartRate: 72, bpSystolic: 132, bpDiastolic: 84, tempCelsius: 36.7 }
  },
  {
    title: 'Sowa-Rigpa Heart rLung Insomnia (GREEN - 3,850m)',
    patientName: 'Dolma Tenzin',
    age: 72,
    gender: 'Female' as const,
    village: 'Tsonup Plateau',
    clinicSiteId: 'tsonup',
    chiefComplaint: 'Night palpitations, inability to sleep, mental restlessness provoked by freezing north wind drafts.',
    lakeLouise: { headache: 1, gastrointestinal: 0, fatigueWeakness: 1, dizzinessLightheadedness: 0, functionalImpairment: 0 },
    vitals: { spo2: 88, heartRate: 88, bpSystolic: 138, bpDiastolic: 86, tempCelsius: 36.5 }
  }
];

export const DUMMY_CAMP_TEMPLATES = [
  {
    title: 'Upper Mustang 4-Day Dental Camp (337 Patients)',
    location: 'Upper Mustang (Tsarang & Tsonup Clinics)',
    dates: 'Autumn Expedition 2026',
    partner: 'JJoy Foundation & Rotary International',
    patientsServed: 337,
    dentalProcedures: 142,
    cataractScreenings: 89,
    rawNotes: '337 patients served over 4 days across Tsarang and Tsonup. 142 dental extractions and fillings performed by volunteer dentists. 89 cataract screenings; 112 pairs of Cat 4 UV sunglasses dispensed to elderly yak herders. Severe osteoarthritis prevalent in elders. Local Amchis provided integrative Sowa-Rigpa Agar-35 treatments for high-altitude cold wind rLung.'
  },
  {
    title: 'Bigu Nunnery & Dolakha Eye Camp (195 Patients)',
    location: 'Bigu Nunnery & Surrounding Tamang Hamlets, Dolakha',
    dates: 'Winter Pre-Freeze Medical Mission 2026',
    partner: 'Rotary Club of Kathmandu & Himalayan Guge Org',
    patientsServed: 195,
    dentalProcedures: 48,
    cataractScreenings: 134,
    rawNotes: '195 Buddhist nuns and rural subsistence farmers screened. 134 eye evaluations completed with 68 reading glasses and 42 antibiotic eye ointments distributed. 48 dental fillings and preventative scaling sessions completed in the nunnery courtyard clinic. 18 nuns treated for chronic knee osteoarthritis with supportive braces and warming moxibustion.'
  },
  {
    title: 'Nomadic Border Plateau Sorig Camp (260 Patients)',
    location: 'Chhoser Sky Caves & Northern Border Ridge (3,900m)',
    dates: 'High Plateau Summer Mission',
    partner: 'JJoy Foundation & Lo Amchi Association',
    patientsServed: 260,
    dentalProcedures: 86,
    cataractScreenings: 72,
    rawNotes: '260 semi-nomadic pastoralists and family units treated at high altitude. 86 emergency tooth extractions relieving chronic infection. 72 ophthalmic checkups. Distributed 150 thermal blankets and pediatric winter vitamins. Amchi Karma Tenzin led pulse diagnostics for 140 villagers, dispensing traditional Tshel-mar-25 and Semde formulas.'
  }
];

export const DUMMY_DONOR_PROFILES = [
  {
    name: 'JJoy Foundation Global Health Fund',
    amount: 12500,
    project: 'Tsarang Dental Clinic & High-Altitude Restock Expedition',
    notes: 'Full sponsorship of portable dental delivery unit, autoclave, and 6 months of anesthetic.'
  },
  {
    name: 'Rotary International District 3292',
    amount: 8400,
    project: 'Mobile High-Altitude Oxygen & Lake Louise Triage Stations',
    notes: 'Providing 12 lightweight composite O2 cylinders and emergency Gamow hyperbaric bag.'
  },
  {
    name: 'Dr. Elizabeth Vance, DDS (Volunteer Alumna)',
    amount: 2500,
    project: 'Bigu Nunnery Living Quarters Solar Wall & Thermal Insulation',
    notes: 'In honor of the dedicated Nyungne nuns of Tashi Chime Gatsal.'
  },
  {
    name: 'Karma & Dolma Himalayan Cultural Trust',
    amount: 1500,
    project: 'Tsarang Gompa 14th-Century Sowa-Rigpa Xylograph Digitization',
    notes: 'Archiving rare Tibetan botanical block-prints and medical tantra folios.'
  }
];

export const VOLUNTEER_GEAR_CHECKLIST = [
  { item: '800+ Fill Power Expedition Down Jacket (with hood)', category: 'Clothing', required: true, notes: 'Night temps drop to -15°C in Mustang.' },
  { item: 'Category 4 Glacier Glasses (100% UV, side shields)', category: 'Eye Protection', required: true, notes: 'Extreme solar radiation reflected off bare desert shale.' },
  { item: 'High-Lumen Medical Headlamp + Rechargeable Lithium Batteries', category: 'Clinical', required: true, notes: 'Electricity cuts out in clinics after 8 PM.' },
  { item: 'Sterile Surgical / Examination Gloves (2 boxes own size)', category: 'Clinical', required: true, notes: 'Field clinics often run low on small/medium sizes.' },
  { item: 'Acetazolamide (Diamox 250mg) x 20 tablets', category: 'Medical Kit', required: true, notes: 'Start 125mg BID in Pokhara/Jomsom prior to ascending.' },
  { item: 'UV Water Purifier (Steripen) or 0.1 Micron Filter', category: 'Health', required: true, notes: 'Plastic bottled water is prohibited in parts of Upper Mustang to reduce waste.' },
  { item: 'Satellite Messenger / InReach or e-SIM (Ncell/Namaste)', category: 'Comms', required: true, notes: 'Check in with HGO base daily.' },
  { item: 'Merino Wool Thermal Long Underwear (2 pairs)', category: 'Clothing', required: true, notes: 'Moisture wicking; stone clinic buildings lack central heat.' }
];

export const QUICK_TRANSLATIONS = [
  {
    english: 'Please sit here and breathe slowly.',
    nepali: 'कृपया यहाँ बस्नुहोस् र बिस्तारै श्वास लिनुहोस्।',
    tibetan: 'སྐུ་མཁྱེན་འདིར་བཞུགས་ནས་དབུགས་དལ་བུར་རྔུབ་གཏོང་གནོངས།',
    phonetic: 'Ku-khyen dir zhuk ne yuk dal-bur ngup-tong nong.'
  },
  {
    english: 'Does this hurt when I press here?',
    nepali: 'यहाँ थिच्दा दुख्छ कि दुख्दैन?',
    tibetan: 'འདིར་མནན་ན་ན་གི་འདུག་གས?',
    phonetic: 'Dir nen-na na-gi duk-gay?'
  },
  {
    english: 'Open your mouth wide and bite down gently on this gauze.',
    nepali: 'मुख ठूलो पारेर खोल्नुहोस् र यो गजलाई बिस्तारै टोक्नुहोस्।',
    tibetan: 'ཁ་ཆེན་པོ་ཕྱེ་ནས་རས་འདི་ལ་དལ་བུར་སོ་ཐོབ།',
    phonetic: 'Kha chen-po che ne ray di la dal-bur so thob.'
  },
  {
    english: 'Take this pill after eating with warm boiled water.',
    nepali: 'खाना खाएपछि यो चक्की तातो पानीसँग खानुहोस्।',
    tibetan: 'ཟས་ཟོས་རྗེས་སྨན་འདི་ཆུ་ཚན་དང་མཉམ་དུ་འཐུང་དགོས།',
    phonetic: 'Zay zö jey men di chu-tsen dang nyam-du thung gyo.'
  },
  {
    english: 'Tashi Delek! How can our medical team help you today?',
    nepali: 'नमस्ते / टासी देलेक! आज हाम्रो मेडिकल टोलीले तपाईंलाई कसरी सहयोग गर्न सक्छ?',
    tibetan: 'བཀྲ་ཤིས་བདེ་ལེགས། དེ་རིང་ང་ཚོའི་སྨན་པའི་ཚོགས་པས་ཁྱེད་ལ་རོགས་རམ་ག་རེ་ཞུ་དགོས?',
    phonetic: 'Tashi Delek! De-ring nga-tsoi men-pei tsok-pay khyed la rok-ram ga-re zhu gyo?'
  }
];
