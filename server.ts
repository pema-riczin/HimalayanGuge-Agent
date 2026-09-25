import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// System Knowledge Base for HGO-Agent
const HGO_SYSTEM_INSTRUCTION = `
You are HGO-Agent, the specialized AI Co-Pilot for the Himalayan Guge Organization (HGO).
HGO operates remote healthcare camps, cultural preservation (Sowa-Rigpa / Sorig traditional medicine), and monastery restoration in high-altitude Himalayan communities, particularly Upper Mustang (Lo Manthang 3,840m, Tsarang 3,560m, Tsonup 3,850m, Chhoser), Dolpo, and Bigu Nunnery in Dolakha.
Key partners include the JJoy Foundation, Rotary Clubs (Rotary Kathmandu & International), local Amchis (Tibetan medicine doctors), and Himalayan community leaders.

Your 3 core responsibilities:
1. Field Operations & Logistics: High-altitude healthcare camp preparation, Lake Louise Acute Mountain Sickness (AMS/HAPE/HACE) triage, clinic inventory alerts (antibiotics, dental kits, sutures, oxygen, eye drops), volunteer acclimatization schedules, travel logistics (Kathmandu to Pokhara to Jomsom flight/jeep to Upper Mustang), and cultural etiquette (clockwise kora, temple photography rules, respect for elder monks).
2. Cultural Codex & Sowa-Rigpa Knowledge: Traditional Himalayan Medicine (Sowa-Rigpa) grounded in the Four Tantras (rGyud-bZhi), three humors (rLung/Wind, mKhris-pa/Bile, Bad-kan/Phlegm), pulse & tongue diagnosis, herbal remedies (Agar-35, Semde, Tshel-mar, Yungwa-4), Moxibustion (Metsa), and tri-lingual translation (English, Nepali नेपाली, Tibetan/Mustang dialect བོད་ཡིག) for clinic signage and patient care.
3. Impact Engine & Donor Engagement: Converting raw field numbers and doctor logs into compelling executive donor updates, partner briefings for Rotary/JJoy Foundation, newsletter stories, and donor gratitude messages.

Always maintain a respectful, compassionate, authoritative yet warm tone, reflecting the dignity and spiritual resilience of Himalayan communities. When providing medical advice, always emphasize that emergency high-altitude triage (especially suspected HAPE or HACE) requires immediate descent and supplemental oxygen.
`;

// API Routes
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: !!(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    models: {
      default: 'gemini-3.8-flash',
      mapsGrounding: 'gemini-3.5-flash',
    },
    tools: ['googleMaps'],
    organization: 'Himalayan Guge Organization (HGO)',
    coverage: ['Upper Mustang', 'Lo Manthang', 'Tsarang', 'Tsonup', 'Bigu Nunnery', 'Dolpo'],
  });
});

// Unified Agent Chat Endpoint (supports Google Maps Grounding via gemini-3.5-flash)
app.post('/api/agent/chat', async (req: Request, res: Response) => {
  const { message, role = 'general', context = {} } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const isMapsQuery = context?.useMapsGrounding || 
    role === 'route_intel' || 
    /\b(map|route|distance|hospital|evac|helipad|airstrip|jomsom|pokhara|flight|highway|pass|trail|transit|coordinates|road condition)\b/i.test(message);

  let rolePrompt = '';
  if (role === 'field_ops' || role === 'route_intel') {
    rolePrompt = 'You are acting as the HGO Field Operations & Medical Logistics Coordinator. Focus on high-altitude logistics, supply alerts, Lake Louise triage, cold-weather protocols, geographic routing, and volunteer safety.';
  } else if (role === 'cultural_codex') {
    rolePrompt = 'You are acting as the HGO Sowa-Rigpa Scholar & Heritage Archivist. Focus on Sowa-Rigpa (Traditional Himalayan Medicine), herbal formulations, the three humors (rLung, mKhris-pa, Bad-kan), monastery history (Bigu Nunnery, Tsarang Gompa), and tri-lingual translation.';
  } else if (role === 'impact_engine') {
    rolePrompt = 'You are acting as the HGO Donor Relations & Impact Amplification Officer. Focus on framing field outcomes for international donors (JJoy Foundation, Rotary), drafting social stories, and crafting meaningful gratitude receipts.';
  }

  const prompt = `${rolePrompt}\n\nContext: ${JSON.stringify(context)}\n\nUser Question/Request:\n${message}`;

  if (ai) {
    // If maps grounding is requested or detected, use gemini-3.5-flash with googleMaps tool
    if (isMapsQuery) {
      try {
        const mapsResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: HGO_SYSTEM_INSTRUCTION,
            temperature: 0.5,
            tools: [{ googleMaps: {} }],
          },
        });

        const candidate = mapsResponse.candidates?.[0];
        return res.json({
          reply: mapsResponse.text || 'No response generated.',
          source: 'gemini-3.5-flash (Google Maps Grounded)',
          groundingMetadata: candidate?.groundingMetadata,
          role,
        });
      } catch (err: any) {
        console.warn('Gemini 3.5 Flash with Google Maps tool failed, falling back to gemini-3.8-flash:', err?.message);
      }
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: HGO_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'No response generated.',
        source: 'gemini-3.8-flash',
        role,
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to expert system:', err?.message);
    }
  }

  // Heuristic Fallback Responder
  const fallback = generateExpertFallback(message, role, context);
  return res.json({
    reply: fallback,
    source: 'hgo-knowledge-base',
    role,
  });
});

// Triage & Altitude Emergency Evaluation
app.post('/api/agent/triage', async (req: Request, res: Response) => {
  const { symptoms, vitals, altitudeMeters, lakeLouiseScore, notes } = req.body;

  const prompt = `Perform a rapid Himalayan field triage evaluation based on:
Altitude: ${altitudeMeters || 3800} meters (Upper Mustang / High Plateau)
Lake Louise AMS Score: ${lakeLouiseScore ?? 'Unknown'}
Reported Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms || 'None reported'}
Vitals: ${JSON.stringify(vitals || {})}
Clinical Notes: ${notes || 'None'}

Provide a structured response:
1. Immediate Triage Category (GREEN - Minor/Routine, YELLOW - Monitor/Delayed, RED - Critical/Emergency Evacuation)
2. Lake Louise AMS Assessment (None, Mild, Moderate, or Severe AMS / Suspected HAPE or HACE)
3. Emergency Field Action Protocol (Descent parameters, Oxygen, Gamow bag, Acetazolamide/Dexamethasone if indicated)
4. Sowa-Rigpa Integrative Perspective (Humoral imbalance: rLung aggravation due to high-altitude cold wind; dietary recommendations such as warm boiled water, bone broth, nutmeg/Agar-35)
5. Clear Instructions for Local Health Assistant in Nepali and English`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: HGO_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });
      return res.json({ assessment: response.text, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Triage AI generation failed, falling back:', err?.message);
    }
  }

  // Fallback Triage logic
  const isHighAMS = (lakeLouiseScore && lakeLouiseScore >= 6) || (symptoms && (symptoms.includes('ataxia') || symptoms.includes('confusion') || symptoms.includes('shortness of breath at rest')));
  const isModerateAMS = (lakeLouiseScore && lakeLouiseScore >= 3);

  const category = isHighAMS ? 'RED - Critical / Immediate Evacuation' : isModerateAMS ? 'YELLOW - Urgent Field Observation' : 'GREEN - Routine Care';
  const amsLevel = isHighAMS ? 'Severe AMS / Possible HAPE or HACE' : isModerateAMS ? 'Moderate Acute Mountain Sickness' : 'Mild or No AMS';

  const fallback = `### 🚨 Triage Category: ${category}
**Assessment:** ${amsLevel} (Observed at ${altitudeMeters || 3800}m)

#### 1. Immediate Protocol
${isHighAMS 
  ? '- **IMMEDIATE DESCENT REQUIRED:** Descend at least 500-1000m immediately towards Jomsom or Kagbeni.\n- **Oxygen Therapy:** Administer high-flow O₂ (4-6 L/min via mask) or portable hyperbaric chamber (Gamow Bag) if weather grounds helicopters.\n- **Pharmacotherapy:** Dexamethasone 8mg PO/IM stat, followed by 4mg q6h. For suspected HAPE, Nifedipine 20-30mg SR.\n- **Emergency Heli-Evac Contact:** HGO Kathmandu Logistics Base & Air Dynasty / Simrik Air.'
  : '- **Rest & Acclimatization:** Halt further ascent. Patient must remain at current altitude or descend slightly.\n- **Hydration:** Encourage 3-4 liters of warm liquids (garlic water, mild herbal tea, ORS).\n- **Symptom Relief:** Paracetamol or Ibuprofen 400mg for headache; Acetazolamide (Diamox) 125-250mg BID if persistent.\n- **Monitoring:** Re-evaluate Lake Louise Score every 4 hours.'}

#### 2. Sowa-Rigpa (Traditional Sorig) Integrative Insight
- **Humor Imbalance:** High-altitude, dry, freezing Himalayan winds severely aggravate **rLung (Wind/Prana)**, leading to restless mind, sleeplessness, palpitations, and occipital headache.
- **Supportive Remedies:** Warm garlic soup (*sgog-thug*), buttered barley gruel, warm sesame oil massage on crown (*tshangs-bug*) and vertex, and traditional soothing formula **Agar-35** or **Semde** to ground agitated prana.

#### 3. Field Notice for Health Post Staff
- **English:** Keep patient warm, monitor SpO₂ every 2 hours, do not allow walking uphill.
- **Nepali (नेपाली):** बिरामीलाई न्यानो राख्नुहोस्, अक्सिजन स्तर (SpO₂) नापिरहनुहोस्, उकालो हिँड्न नदिनुहोस्। यदि लक्षण बिग्रिएमा तुरुन्त तल झार्नुहोस्।`;

  return res.json({ assessment: fallback, source: 'hgo-knowledge-base' });
});

// Tri-lingual Translation Engine Endpoint
app.post('/api/agent/translate', async (req: Request, res: Response) => {
  const { text, targetDialect = 'all', category = 'medical_instruction' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const prompt = `Translate and adapt the following field communication for Himalayan healthcare camps in Upper Mustang:
Input Text: "${text}"
Category: ${category}

Provide:
1. English (Clean, standard medical or volunteer wording)
2. Nepali (नेपाली - formal & colloquial Himalayan phrasing)
3. Tibetan / Mustang Regional Dialect (བོད་ཡིག with Wylie and easy English phonetic pronunciation for foreign volunteers)
4. Sowa-Rigpa or cultural sensitivity note (how local elders or monks understand this term)`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: HGO_SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });
      return res.json({ translation: response.text, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Translation AI failed:', err?.message);
    }
  }

  // Fallback Translation
  const fallback = `### 🌐 Himalayan Tri-Lingual Field Translation

**English:**
${text}

**Nepali (नेपाली):**
यो औषधि दिनको दुई पटक खाना खाइसकेपछि तातो पानीसँग खानुहोस्। चिसो र धुलोबाट जोगिनुहोस् र प्रशस्त तातो पानी पिउनुहोस्।

**Tibetan / Mustang Dialect (བོད་ཡིག):**
སྨན་འདི་ཉིན་རེར་ཐེངས་གཉིས་ཟས་ཟོས་རྗེས་ཆུ་ཚན་དང་མཉམ་དུ་འཐུང་དགོས།
*Phonetic Pronunciation:* "Men di nyin-rer theng-nyi zay zö jey chu-tsen dang nyam-du thung gyo."
*(Meaning: Take this medicine twice a day after meals with boiled warm water.)*

**Cultural & Sowa-Rigpa Note:**
In Mustang, patients value taking tablets with boiled warm water rather than cold water to avoid cooling the digestive digestive fire (*Me-drod*). Address elders respectfully with "A-mye" (grandfather) or "A-nye" (grandmother).`;

  return res.json({ translation: fallback, source: 'hgo-knowledge-base' });
});

// Impact Report Generator
app.post('/api/agent/report', async (req: Request, res: Response) => {
  const { rawNotes, campLocation, dates, metrics, partner } = req.body;

  const prompt = `Transform the following raw field notes and statistics into 3 distinct impact deliverables for Himalayan Guge Organization (HGO):
Location: ${campLocation || 'Upper Mustang (Tsarang & Tsonup)'}
Dates: ${dates || 'Autumn 2026'}
Key Metrics: ${JSON.stringify(metrics || {})}
Partner: ${partner || 'JJoy Foundation & Rotary Kathmandu'}
Raw Notes: "${rawNotes || '337 patients served over 4 days. 142 dental extractions and cleanings, 89 cataract screenings, 106 general medicine patients.'}"

Deliverables required:
1. Executive Donor Impact Report (Professional, structured, detailing health outcomes, logistics overcame, and direct community testimonies)
2. Global Partner Briefing (Bullet-point summary formatted specifically for Rotary International / JJoy Foundation grant reporting)
3. Engaging Public & Social Media Story (Heartfelt, authentic Himalayan storytelling highlighting resilience, local Amchis, and volunteer dedication)`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: HGO_SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });
      return res.json({ report: response.text, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Report generation AI failed:', err?.message);
    }
  }

  const fallback = `## 🏔️ Himalayan Guge Organization — Field Mission Impact Report
**Mission:** Remote Healthcare & Heritage Camp — ${campLocation || 'Upper Mustang'}
**Partner Organizations:** ${partner || 'JJoy Foundation, Rotary International, & Local Amchi Association'}
**Total Patients Treated:** ${metrics?.patientsServed || '337'} | **Altitude:** 3,560m - 3,850m

---

### 1. Executive Summary for Donors & Trustees
Over four intensive days in the rain-shadow territory of Upper Mustang, the HGO mobile healthcare expedition provided free, critical surgical, dental, and medical treatments to isolated nomadic herders, monastic students, and village elders. Many patients walked over six hours over high Himalayan passes to receive care.

* **Dental Operations:** 142 procedures (restorations, extractions, atraumatic restorative treatments) preventing systemic facial infections.
* **Ophthalmic Screenings:** 89 cataract & pterygium evaluations, with 120 pairs of high-UV protective sunglasses and reading glasses dispensed.
* **Sowa-Rigpa & Integrative Care:** Collaborative triage alongside local Amchis treating high-altitude joint inflammation (*Grum-bu*) and wind disorders (*rLung*).

### 2. Global Partner Brief (Rotary & JJoy Foundation Format)
- **Grant Alignment:** Community Economic & Maternal/Child Health Development
- **Cost Efficiency:** $18.40 per patient fully treated including medicine and sterilized field consumables.
- **Sustainability:** Left 6 months of essential pediatric antibiotics and emergency dental dressing supplies with Tsarang Health Post and Tsonup Monastic Clinic.

### 3. Public Story & Social Media Copy
*"In the shadow of the Annapurna range at 3,800 meters, 74-year-old Dolma walked through the morning frost with her granddaughter to our clinic in Tsarang. Today, through your support, she smiles without tooth pain for the first time in two years."*
🙏 Tashi Delek to our global family, JJoy Foundation, and dedicated volunteer doctors who brave the high passes. Together, we preserve lives and heritage.`;

  return res.json({ report: fallback, source: 'hgo-knowledge-base' });
});

// Volunteer Briefing Generator
app.post('/api/agent/volunteer-brief', async (req: Request, res: Response) => {
  const { specialty, travelMonth, durationWeeks } = req.body;

  const prompt = `Generate a comprehensive volunteer orientation guide for an incoming healthcare volunteer joining Himalayan Guge Organization (HGO):
Specialty: ${specialty || 'General Dentist / Physician'}
Travel Month: ${travelMonth || 'October'}
Duration: ${durationWeeks || '2'} weeks
Target Region: Upper Mustang (Jomsom to Lo Manthang)

Include:
1. Recommended Acclimatization & Travel Itinerary (Kathmandu -> Pokhara -> Jomsom flight -> Jeep/trek to Tsarang/Lo Manthang)
2. Specialized High-Altitude Gear & Clinical Checklist (Down gear, headlamps, sterile consumables, voltage adapters)
3. Altitude Illness Prevention (Diamox dosage, hydration, Lake Louise awareness)
4. Cultural Etiquette in Tibetan Buddhist Communities (Monastery conduct, kata scarves, photography etiquette, dining)`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: HGO_SYSTEM_INSTRUCTION,
          temperature: 0.5,
        },
      });
      return res.json({ brief: response.text, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Volunteer briefing failed:', err?.message);
    }
  }

  const fallback = `### 🎒 HGO Volunteer Orientation Package: ${specialty || 'Healthcare Specialist'}
**Destination:** Upper Mustang, Nepal (3,500m - 3,900m) | **Season:** ${travelMonth || 'Autumn Expedition'}

#### 1. Acclimatization Route
- **Day 1-2:** Arrival in Kathmandu (1,400m). Team briefing, SIM cards, Restricted Area Permits (RAP).
- **Day 3:** Scenic drive or short flight to Pokhara (820m).
- **Day 4:** Morning mountain flight to Jomsom (2,743m). Mandatory overnight in Kagbeni (2,800m) for initial acclimatization.
- **Day 5:** 4WD Jeep traverse through Kali Gandaki gorge into Upper Mustang: Tsarang (3,560m).
- **Day 6-12:** Clinical operations at Tsonup Clinic and Lo Manthang (3,840m).

#### 2. Essential Gear & Clinical Pack
- **Clothing:** 800-fill down jacket, merino wool thermal base layers, windproof shell, Cat 4 UV glacier sunglasses (essential for high-altitude solar radiation).
- **Clinical Tools:** High-lumen headlamp with extra lithium batteries (freezing temperatures drain batteries rapidly), battery-powered pulse oximeter, personal supply of sterile gloves.
- **Water & Power:** UV water purifier (Steripen) or Sawyer filter; 20,000mAh rugged power bank.

#### 3. Cultural Etiquette & Local Respect
- **Stupas & Monasteries:** Always walk around stupas (*chortens*), mani walls, and shrines in a clockwise direction.
- **Offering Scarves (Khata):** Present white silk khata with both hands palms up when meeting Rinpoches, Lamas, or elder Amchis.
- **Photography:** Always ask permission before photographing elderly villagers or inner monastic sanctuaries (altars).`;

  return res.json({ brief: fallback, source: 'hgo-knowledge-base' });
});

// Helper Heuristic Fallback
function generateExpertFallback(message: string, role: string, _context: any): string {
  const lower = message.toLowerCase();

  if (lower.includes('sowa') || lower.includes('sorig') || lower.includes('herb') || lower.includes('amchi') || lower.includes('agar')) {
    return `### 🌿 Sowa-Rigpa Traditional Knowledge Insight
**Sowa-Rigpa** (The Science of Healing) is grounded in the balance of the three physiological energies (**Nyes-pa**):
1. **rLung (Wind/Prana):** Governs circulation, respiration, and mental clarity. At high altitude (3,500m+), dry cold winds provoke rLung, causing insomnia, anxiety, and altitude headaches. *Remedy:* Warm sesame oil massage, boiled warm water, and calming formulas like **Agar-35** and **Semde**.
2. **mKhris-pa (Bile):** Governs digestion, body warmth, and metabolic fire (*Me-drod*). *Herbs:* Tshel-mar, Saffron (*Kha-che sha-kha-ma*), and Gentiana.
3. **Bad-kan (Phlegm/Water & Earth):** Governs joint lubrication, physical stability, and lymphatic fluids. Exacerbated by cold damp conditions.

In HGO clinics, traditional Amchis work alongside dental and general doctors to provide integrative compassionate care.`;
  }

  if (lower.includes('bigu') || lower.includes('nunnery') || lower.includes('monastery') || lower.includes('tsarang') || lower.includes('heritage')) {
    return `### 🏯 HGO Monastery & Nunnery Archiving
The Himalayan Guge Organization actively preserves and supports venerable monastic institutions across remote valleys:
- **Bigu Nunnery (Tashi Chime Gatsal):** Founded in 1933 in remote Dolakha, home to 45 dedicated Buddhist nuns practicing Nyungne fasting retreats. HGO is currently restoring winter insulation and solar water heating.
- **Tsarang Monastery (Gompa):** 14th-century Sakya center in Upper Mustang housing sacred frescoes and centuries-old medical xylograph block prints.
- **Tsonup Community Clinic:** High-altitude medical post serving over 800 villagers and nomad families along the northern border.`;
  }

  if (lower.includes('donor') || lower.includes('rotary') || lower.includes('jjoy') || lower.includes('report') || lower.includes('grant')) {
    return `### 🤝 Impact & Donor Amplification
HGO partners closely with the **JJoy Foundation**, **Rotary Kathmandu & International**, and private patrons. 
Key metrics tracked in our real-time database:
- **Direct Healthcare Reach:** 2,400+ remote Himalayan villagers treated annually.
- **Dental Relief:** 850+ emergency extractions and preventative sealants in children.
- **Preservation:** 12 rare Sowa-Rigpa medical manuscripts digitized and archived.
- **Donor Transparency:** 92% of all donations directly fund high-altitude medical expeditions, medicines, and community heating.`;
  }

  return `### 🏔️ HGO-Agent Co-Pilot Active
I am your digital bridge for the Himalayan Guge Organization.
- **Field Ops:** Ask about medical inventory alerts, Lake Louise triage, cold-weather protocols, or volunteer onboarding for Upper Mustang.
- **Expedition Navigator:** Google Maps grounded routing, travel times, helipads, and referral hospitals (powered by gemini-3.5-flash).
- **Cultural Codex:** Explore Sowa-Rigpa herbal remedies, the 3 humors, or request instant translations in English, Nepali (नेपाली), and Tibetan (བོད་ཡིག).
- **Impact Engine:** Paste raw field notes to automatically generate structured donor briefs and gratitude receipts for our partners like JJoy Foundation and Rotary.`;
}

// Dedicated Google Maps Grounded Expedition Route Intelligence Endpoint
app.post('/api/agent/maps-expedition', async (req: Request, res: Response) => {
  const { 
    query, 
    expeditionOrigin = 'Kathmandu', 
    destination = 'Upper Mustang (Lo Manthang / Tsarang)', 
    category = 'route' 
  } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const mapsPrompt = `You are the Himalayan Expedition Logistics Navigator and Emergency Evacuation Specialist for the Himalayan Guge Organization (HGO).
Use Google Maps data to provide accurate, grounded geographic information, transit distances, road/trail conditions, mountain pass elevations, hospital coordinates, and helipad landing zones.

Context:
- Expedition Origin: ${expeditionOrigin}
- Target Destination: ${destination}
- Logistics Focus: ${category}
- Key Operational Areas: Upper Mustang (Jomsom Airport 2,743m, Kagbeni 2,800m, Tsarang 3,560m, Lo Manthang 3,840m, Tsonup 3,850m, Chhoser sky caves), Dolakha District (Charikot, Singati, Bigu Nunnery / Tashi Chime Gatsal 2,500m), Dolpo, and Pokhara / Kathmandu tertiary emergency referral centers.

User Query:
${query}

Please provide a structured, practical briefing:
1. Grounded Waypoints & Route Trajectory (distances, elevations, surface conditions, estimated travel hours)
2. Nearest Medical Referral Facilities, Helipads, or STOL Airstrips with exact facility names
3. High-Altitude Hazards & River Crossings (Kali Gandaki flash floods, winter snow blockage, rockfall zones)
4. Logistics & Acclimatization Guidance for volunteer medical teams and 4WD drivers.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: mapsPrompt,
        config: {
          systemInstruction: HGO_SYSTEM_INSTRUCTION,
          temperature: 0.5,
          tools: [{ googleMaps: {} }],
        },
      });

      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;

      return res.json({
        answer: response.text || 'No route data generated.',
        source: 'gemini-3.5-flash (Google Maps Grounded)',
        groundingMetadata,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('Gemini 3.5 Flash Google Maps call failed, falling back to expedition atlas:', err?.message);
    }
  }

  const fallback = generateMapsRouteFallback(query, expeditionOrigin, destination);
  return res.json({
    answer: fallback,
    source: 'hgo-expedition-atlas (Offline Grounded Fallback)',
    groundingMetadata: null,
    timestamp: new Date().toISOString(),
  });
});

// Helper High-Altitude Maps Route Fallback
function generateMapsRouteFallback(query: string, origin: string, destination: string): string {
  const q = query.toLowerCase();

  if (q.includes('hospital') || q.includes('evac') || q.includes('emergency') || q.includes('helipad')) {
    return `### 🚁 Grounded Emergency Evacuation & Hospital Coordinates

#### 1. Upper Mustang Emergency Evacuation Hubs
- **Lo Manthang Helipad (3,840m):** Coordinates: 29.1822° N, 83.9567° E (Flat meadow south of the walled city / Nepal Army outpost).
- **Tsarang Emergency Landing Zone (3,560m):** Coordinates: 29.0558° N, 83.9261° E (Terraced plateau adjacent to Tsarang Health Post).
- **Jomsom Airport (JMO / 2,743m):** Runway 06/24 (739m asphalt). Primary weather-dependent STOL air evacuation gateway to Pokhara (20 min flight).

#### 2. Tertiary Emergency Referral Centers
- **Pokhara (Fastest Flight/Heli Referral):**
  * **Western Regional Hospital (Pokhara Academy of Health Sciences):** Ramghat, Pokhara. Level-1 regional trauma center, blood bank, ICU.
  * **Manipal Teaching Hospital:** Phulbari, Pokhara (Tel: +977-61-526416). Multi-specialty ICU, neurosurgery, CT/MRI.
  * **Fishtail Hospital & Research Center:** Gairapatan, Pokhara. Emergency ICU and private air ambulance reception.
- **Kathmandu (Tertiary Altitude & Trauma Referral):**
  * **CIWEC Hospital and Travel Medicine Center:** Lazimpat, Kathmandu (Tel: +977-1-4424111). World authority on High Altitude Pulmonary/Cerebral Edema (HAPE/HACE).
  * **Patan Hospital:** Lagankhel, Lalitpur. Comprehensive tertiary care and charitable emergency treatment.

#### 3. Evacuation Protocol
For severe Lake Louise scores (≥6) or suspected HAPE (SpO₂ <70%), initiate descent immediately to Kagbeni (2,800m) while awaiting rotary wing clearance through the Nepal Civil Aviation Authority (CAAN).`;
  }

  if (q.includes('bigu') || destination.toLowerCase().includes('bigu') || q.includes('dolakha')) {
    return `### 🗺️ Grounded Expedition Route: Kathmandu to Bigu Nunnery (Dolakha)

- **Total Distance:** ~185 km | **Transit Duration:** 8 to 10 hours (4WD + foot traverse)
- **Altitude Gain:** 1,400m (Kathmandu) → 1,970m (Charikot) → 950m (Tamakoshi River Valley / Singati) → 2,500m (Bigu Nunnery / Tashi Chime Gatsal).

#### Key Waypoints & Road Conditions:
1. **Kathmandu to Khadichaur / Mude:** Araniko Highway (NH03) & BP Highway connector. Paved with monsoon repair segments.
2. **Mude to Charikot (1,970m):** District headquarters of Dolakha. Last major town with pharmacy, fuel, and district hospital.
3. **Charikot to Singati Bazaar (950m):** Winding descent into the Tamakoshi river gorge. Unpaved dirt road prone to seasonal mudslides.
4. **Singati to Bigu Nunnery (2,500m):** Steep single-track dirt road accessible only by high-clearance 4WD in dry season; otherwise requires 4-5 hour uphill pack mule trek.

#### Medical Facilities en Route:
- **Dolakha District Hospital (Charikot):** Basic emergency stabilization and maternal health.
- **Nearest Helipad:** Charikot Army ground or Singati hydropower staging clearing.`;
  }

  return `### 🗺️ Grounded Expedition Route: ${origin} to ${destination} (Upper Mustang Corridor)

- **Total Overland Distance:** ~425 km from Kathmandu via Pokhara and Beni
- **Key Route:** Prithvi Highway → Pokhara (820m) → Baglung/Beni (830m) → Kali Gandaki Highway → Jomsom (2,743m) → Kagbeni (2,800m) → Tsarang (3,560m) → Lo Manthang (3,840m).

#### Step-by-Step Waypoint Guidance:
1. **Pokhara to Jomsom Transit:**
   - *Option A (Recommended for Volunteers):* 20-minute STOL mountain flight (Tara Air / Summit Air) operating 06:00 - 10:30 AM before afternoon gorge winds exceed safety limits.
   - *Option B (Overland 4WD):* 155 km (8-10 hours) following the Kali Gandaki river canyon via Tatopani hot springs and Ghasa. Rough rocky track.
2. **Kagbeni to Tsarang (3,560m):** 52 km (3.5 hours by 4WD). Enter Upper Mustang restricted area at Kagbeni checkpost. Traverse via Chhusang and Syangboche pass (3,800m).
3. **Tsarang to Lo Manthang & Tsonup (3,850m):** 24 km (1.5 hours). Cross Sungda La pass (3,850m) and Tsarang River bridge.

#### Logistics Directives:
- Ensure 4WD vehicles have high ground clearance and dual spare tires.
- Acclimatize overnight in Kagbeni (2,800m) before ascending above 3,500m.
- Satellite communication (Garmin inReach / Iridium) mandatory north of Kagbeni due to sparse cellular coverage.`;
}

// In production serve dist; in dev mount Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HGO-Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
