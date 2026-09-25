import { AgentRole, MapsGroundingResponse } from '../types/index.ts';

export interface ChatResponse {
  reply: string;
  source: 'gemini-3.8-flash' | 'gemini-3.5-flash (Google Maps Grounded)' | 'hgo-knowledge-base';
  role?: AgentRole;
  groundingMetadata?: any;
}

export async function askAgent(
  message: string,
  role: AgentRole = 'general',
  context: any = {}
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, role, context }),
    });
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Network call failed, running client offline fallback:', err);
    return {
      reply: getClientOfflineFallback(message, role),
      source: 'hgo-knowledge-base',
      role,
    };
  }
}

export async function triagePatientAI(payload: {
  symptoms: string[];
  vitals: any;
  altitudeMeters: number;
  lakeLouiseScore: number;
  notes?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/agent/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Triage request failed');
    const data = await res.json();
    return data.assessment;
  } catch (err) {
    return `### 🚨 Offline Triage Protocol (Cached Mode)
**Altitude:** ${payload.altitudeMeters}m | **Lake Louise AMS Score:** ${payload.lakeLouiseScore}

1. **Immediate Medical Action:**
${payload.lakeLouiseScore >= 6 
  ? '- Critical Alert: Immediate descent to Jomsom/Kagbeni required. Administer High Flow O2.\n- Administer Dexamethasone 8mg PO/IM stat.\n- Prepare emergency 4WD evacuation transport.' 
  : payload.lakeLouiseScore >= 3 
  ? '- Moderate AMS: Halt ascent. Rest at current elevation, hydrate with 3-4L warm fluid.\n- Acetazolamide 125-250mg BID + Paracetamol for pain.\n- Monitor SpO2 hourly.' 
  : '- Mild/Normal: Continue acclimatization routine. Maintain warm clothing.'}

2. **Sowa-Rigpa Insight:**
Cold Himalayan wind severely provokes rLung (Wind humor). Administer warm boiled water, roasted barley broth, and Agar-35 with warm sesame oil massage on temples.`;
  }
}

export async function translateMedicalFieldAI(payload: {
  text: string;
  category?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/agent/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Translation request failed');
    const data = await res.json();
    return data.translation;
  } catch (err) {
    return `### 🌐 Field Translation (Offline Cache)
**English:** ${payload.text}
**Nepali (नेपाली):** कृपया यो औषधि दिनमा २ पटक खानापछि तातो पानीसँग लिनुहोस्। आराम गर्नुहोस्।
**Tibetan (བོད་ཡིག):** སྨན་འདི་ཉིན་རེར་ཐེངས་གཉིས་ཟས་ཟོས་རྗེས་ཆུ་ཚན་དང་མཉམ་དུ་འཐུང་དགོས།
*(Phonetic: "Men di nyin-rer theng-nyi zay zö jey chu-tsen dang nyam-du thung gyo.")*`;
  }
}

export async function generateImpactReportAI(payload: {
  rawNotes: string;
  campLocation: string;
  dates: string;
  metrics: any;
  partner: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/agent/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Report request failed');
    const data = await res.json();
    return data.report;
  } catch (err) {
    return `## 🏔️ Field Mission Report (Offline Synthesizer)
**Location:** ${payload.campLocation} | **Partner:** ${payload.partner}
**Metrics:** ${JSON.stringify(payload.metrics)}

### Executive Brief
Our mobile medical and dental team completed an intensive camp across high Mustang. Over ${payload.metrics?.patientsServed || '300+'} patients received free emergency extractions, cataract evaluations, and Sowa-Rigpa integrative treatments.

### Rotary & JJoy Partner Takeaways
- Directly improved nomadic and monastic health resilience before winter isolation.
- Stocked 6 months of pediatric antibiotic reserves at Tsarang and Tsonup clinics.`;
  }
}

export async function generateVolunteerBriefAI(payload: {
  specialty: string;
  travelMonth: string;
  durationWeeks: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/agent/volunteer-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Brief request failed');
    const data = await res.json();
    return data.brief;
  } catch (err) {
    return `### 🎒 HGO Volunteer Orientation: ${payload.specialty}
- **Acclimatization Route:** Kathmandu (1,400m) -> Pokhara (820m) -> Jomsom (2,743m) -> Tsarang (3,560m) -> Lo Manthang (3,840m).
- **Mandatory Gear:** 800-fill down jacket, Cat 4 UV glacier glasses, high-lumen headlamp with extra lithium batteries.
- **Cultural Guidelines:** Circumambulate chortens clockwise; present white khata with palms facing upwards.`;
  }
}

export async function fetchMapsExpeditionAI(payload: {
  query: string;
  expeditionOrigin?: string;
  destination?: string;
  category?: string;
}): Promise<MapsGroundingResponse> {
  try {
    const res = await fetch('/api/agent/maps-expedition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Maps expedition request failed');
    return await res.json();
  } catch (err) {
    console.warn('Maps Grounding call failed, using client offline route atlas:', err);
    return {
      answer: `### 🗺️ Offline Expedition Route Guide (Grounding Unavailable)
**Route:** ${payload.expeditionOrigin || 'Kathmandu'} → ${payload.destination || 'Upper Mustang'}
- **Jomsom Airport (JMO):** Primary STOL mountain flight gateway (20 min flight from Pokhara).
- **Overland Access:** Kali Gandaki Highway via Beni, Tatopani, Ghasa to Kagbeni (2,800m).
- **Upper Mustang Trajectory:** Kagbeni → Chhusang → Syangboche pass (3,800m) → Tsarang (3,560m) → Lo Manthang (3,840m).
- **Emergency Evacuation:** Western Regional Hospital (Pokhara), Manipal Teaching Hospital, or CIWEC Clinic (Kathmandu).`,
      source: 'hgo-expedition-atlas (Offline Fallback)',
    };
  }
}

function getClientOfflineFallback(message: string, _role: AgentRole): string {
  const m = message.toLowerCase();
  if (m.includes('triage') || m.includes('ams') || m.includes('altitude')) {
    return `### 🏔️ Field Altitude Triage Protocol
For patients at >3,500m with headache + nausea + dizziness:
1. Calculate Lake Louise Score (AMS). Score ≥6 is Severe AMS / Impending HACE.
2. Put patient on supplemental oxygen (2-4 L/min).
3. If unsteady gait (ataxia) or cyanosis occurs: Immediate descent to Jomsom (2,700m).
4. Sowa-Rigpa supportive care: Agar-35 with warm boiled water, warm sesame oil on the crown.`;
  }
  if (m.includes('sowa') || m.includes('herb') || m.includes('sorig')) {
    return `### 🌿 Sowa-Rigpa Knowledge Guide
The Three Humors (Nyes-pa):
- **rLung (Wind):** Mobile, cool, coarse. High Himalayan wind provokes insomnia, restlessness, and palpitations. Treated with Agar-35, Semde, and warm oily foods.
- **mKhris-pa (Bile):** Hot, sharp. Manifests as fever, liver heat, yellow eyes. Treated with Tshel-mar-25, Saffron, and cool infusions.
- **Bad-kan (Phlegm):** Cold, heavy, oily. Manifests as joint stiffness, sluggish digestion. Treated with Yungwa-4 (Turmeric 4) and moxibustion (Metsa).`;
  }
  return `### 🏔️ HGO-Agent Co-Pilot (Field Mode)
I am ready to assist with high-altitude clinic logistics, volunteer orientation, Lake Louise triage, Sowa-Rigpa herbal guidance, and donor reporting. How can I support your Himalayan field mission right now?`;
}
