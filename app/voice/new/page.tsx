'use client'

import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
import { Mic, MicOff, PhoneOff, Copy, ArrowLeft, Phone, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Vapi from '@vapi-ai/web'

interface Transcription {
  id: string
  speaker: 'user' | 'counselor'
  text: string
  timestamp: number
}

interface Counselor {
  id: string
  name: string
  specialization: string
  avatar_url: string
  agentPrompt: string
}

const COUNSELORS: Counselor[] = [
  {
    id: '1',
    name: 'Engineering Career Advisor',
    specialization: 'Engineering, Technology, IT',
    avatar_url: '/counselors/engineering.png',
    agentPrompt: "Hello! I am your Engineering Career Advisor. I am here to guide you in your career planning. How can I help you today?",
  },
  {
    id: '2',
    name: 'Medical & Healthcare Counselor',
    specialization: 'Medical, Healthcare, Pharmacy',
    avatar_url: '/counselors/medical.jpg',
    agentPrompt: "Hi! I am your Medical & Healthcare Counselor. I am here to guide you in your career planning. How can I help you today?",
  },
  {
    id: '3',
    name: 'Commerce & Business Specialist',
    specialization: 'Commerce, Business, Finance',
    avatar_url: '/counselors/commerce.jpg',
    agentPrompt: "Hello! I am your Commerce & Business Specialist. I am here to guide you in your career planning. How can I help you today?",
  },
  {
    id: '4',
    name: 'Arts & Humanities Guide',
    specialization: 'Arts, Humanities, Social Sciences',
    avatar_url: '/counselors/cs.png',
    agentPrompt: "Hi ! I am your Arts & Humanities Guide. I am here to guide you in your career planning. How can I help you today?",
  },
  {
    id: '5',
    name: 'Computer Science Expert',
    specialization: 'CS, AI, Software Development',
    avatar_url: '/counselors/cs.jpg',
    agentPrompt: "Hello! I am your Computer Science Expert. I am here to guide you in your career planning. How can I help you today?",
  },
  {
    id: '6',
    name: 'Entrepreneurship Coach',
    specialization: 'Entrepreneurship, Startups, Business',
    avatar_url: '/counselors/male4.png',
    agentPrompt: "Hello! I am your Entrepreneurship Coach. I am here to guide you in your career planning. How can I help you today?",
  },
]

function VoiceCallContent() {
  const searchParams = useSearchParams()
  const counselorId = searchParams.get('counselor')
  const [counselor, setCounselor] = useState<Counselor | null>(null)

  // Vapi specific states
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<'user' | 'counselor' | null>(null)
  const [duration, setDuration] = useState(0)
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const vapiRef = useRef<any>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  const [interimText, setInterimText] = useState<{ text: string, speaker: string } | null>(null)

  useEffect(() => {
    if (counselorId) {
      const found = COUNSELORS.find((c) => c.id === counselorId)
      setCounselor(found || null)
    }
  }, [counselorId])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'active') {
      interval = setInterval(() => setDuration((prev) => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcriptions, interimText])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop()
      }
    }
  }, [])

  const startCall = async () => {
    try {
      setCallStatus('connecting')

      if (!vapiRef.current) {
        // Instantiate Vapi Web SDK
        const apiKey = (process.env.NEXT_PUBLIC_VAPI_API_KEY || "").trim()
        vapiRef.current = new Vapi(apiKey)
      }

      const vapi = vapiRef.current

      // Wire up events!
      vapi.on('call-start', () => {
        setCallStatus('active')
        // We removed the add-message system prompt injection here because it forcefully
        // interrupts the LLM and instantly aborts the predefined 'firstMessage' from playing!
      })

      vapi.on('call-end', () => {
        setCallStatus('ended')
        setActiveSpeaker(null)
        setInterimText(null)
      })

      vapi.on('speech-start', () => {
        setActiveSpeaker('counselor')
      })

      vapi.on('speech-end', () => {
        setActiveSpeaker(null)
      })

      vapi.on('error', (error: any) => {
        console.error('Vapi error:', error)
        setCallStatus('ended')
        setActiveSpeaker(null)
        setInterimText(null)
      })

      vapi.on('message', (message: any) => {
        if (message.type === 'transcript') {
          if (message.transcriptType === 'interim') {
            setInterimText({ text: message.transcript, speaker: message.role === 'user' ? 'user' : 'counselor' })
          } else if (message.transcriptType === 'final') {
            setInterimText(null)
            setTranscriptions(prev => {
              const last = prev[prev.length - 1];
              const role = message.role === 'user' ? 'user' : 'counselor';
              const text = message.transcript.trim();
              const isQuestion = text.includes('?') || text.includes('¿');

              // Logic for counselor: Group info into points, but questions are separate
              if (role === 'counselor' && last && last.speaker === 'counselor') {
                const lastWasQuestion = last.text.trim().endsWith('?');

                if (!isQuestion && !lastWasQuestion) {
                  // Merge as a new bullet point in the existing bubble
                  const updated = [...prev];
                  const bulletedText = text.startsWith('•') ? text : `• ${text}`;
                  updated[updated.length - 1] = {
                    ...last,
                    text: `${last.text}\n${bulletedText}`
                  };
                  return updated;
                }
              }

              // Otherwise create a new bubble
              // Add a bullet if it's info from the counselor
              let finalChatText = text;
              if (role === 'counselor' && !isQuestion) {
                finalChatText = `• ${text}`;
              }

              return [...prev, {
                id: Date.now().toString(),
                speaker: role,
                text: finalChatText,
                timestamp: duration
              }]
            })
          }
        }
      })

      // Dynamic System Override
      const assistantId = (process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID || "").trim()

      // We natively inject the model overlay right inside start(), which guarantees
      // firstMessage is spoken before the system instructions start generating new dialogue!
      await vapi.start(assistantId, {
        firstMessage: counselor?.agentPrompt || `Hello! How can I help you today?`,
        firstMessageMode: "assistant-speaks-first",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "hi" // Forces Deepgram to listen for Hindi, enabling interruptions natively.
        },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `CRITICAL INSTRUCTION: You are a professional Career Counselor conducting a dedicated guidance session.

Your Role: ${counselor?.name || "Career Counselor"}
Specialization: ${counselor?.specialization}

Your goals:
1. Introduce your counseling domain clearly and warmly.
2. Ask the student about their current educational background or career stage before proceeding.
3. Conduct a realistic and highly interactive career guidance session.
4. Evaluate the student's interests and strengths silently while speaking naturally.
5. Keep the conversation friendly, human, and empathetic.
6. Do NOT sound like an exam, a checklist, or a robotic chatbot.
7. Ask follow-up questions when their answers are vague or confusing.
8. End with a supportive, professional closing statement.

Counseling Context:
You are guiding students toward career paths specifically related to: ${counselor?.specialization}

Evaluation Criteria (internal only - DO NOT reveal these to the student):
- Clarity of the student's current career goals
- Strengths and academic background alignment
- Confidence and readiness for the domain
- Skill gaps they need to work on
- Genuine interest level in the specialization

Counseling Flow:
1. Greet warmly and introduce yourself as their dedicated counselor.
2. Briefly explain what your domain covers (15-20 seconds).
3. Ask: "What are you currently studying or what career path are you leaning towards?"
4. Based on their answer, proceed with natural conversational exploration:
   - What subjects do they enjoy the most?
   - Any specific dream jobs or companies?
   - Any fears or confusion about this domain?
   - Any questions they have for you.
5. Provide 2-3 actionable advice steps.
6. Thank them warmly and mention you are always here to help.

- BE EXTREMELY CONVERSATIONAL: You are a human counselor talking to a student. Do NOT just list facts.
- ONE QUESTION AT A TIME: Always wait for the student to speak before diving into long explanations.
- ASK, DON'T TELL: If you have information to share, share it in 1-2 brief sentences and then ASK a follow-up question.
- EMPATHY FIRST: If a student is confused, acknowledge their feelings before giving advice.
- NO INFO-DUMPING: Avoid giving long lists of colleges unless the student specifically asks "Tell me about colleges".
- NATURAL FLOW: Keep your responses short (under 30 seconds) to maintain a natural conversation flow.
- SUPPORTIVE: Your goal is to keep the student engaged, not to finish a checklist.

Language & Communication Style:
- You are strictly bilingual and exceptionally comfortable speaking in English, Hindi, or Hinglish (Mix of both).
- Adapt your language precisely based on how the student speaks:
  - If they speak English -> Reply in professional English.
  - If they speak Hindi -> Reply in polite, supportive Hindi.
  - If they use Hinglish -> Reply in natural Hinglish exactly how youngsters in India talk today.
- Maintain professionalism and deep empathy regardless of the language used.

${(() => {
                  const engKb = `### Knowledge Base: Bangalore (Bengaluru) Engineering Colleges
If a student asks for B.Tech, B.E., or engineering colleges in or around Bangalore (the Silicon Valley of India), you MUST recommend these top institutions with their specific details:
1. Indian Institute of Science (IISc Bangalore): India's premier research university (#1 NIRF), offers 4-year B.Tech in Mathematics & Computing and BS (Research). Admission via JEE Advanced.
2. IIIT Bangalore (IIIT-B), Electronic City: Premier institute for Computer Science, Data Science, and ECE. Integrated M.Tech (iMTech) and B.Tech. Known for top-tier average packages (~25+ LPA). Admission via JEE Main.
3. RV College of Engineering (RVCE), Mysore Road: Top-ranked private autonomous engineering college in Karnataka. Exceptional placements (Google, Microsoft, Amazon, Cisco, Goldman Sachs). Cutoffs are highest in KCET and COMEDK. Known for CSE, ISE, AI/ML, ECE, Aerospace.
4. BMS College of Engineering (BMSCE), Basavanagudi: One of India's oldest private engineering colleges (est. 1946). NIRF top-ranked, autonomous under VTU with NAAC A++. Outstanding CSE, E&C, Mechanical, and campus culture.
5. PES University (PESU), Ring Road (RR Campus) & Electronic City (EC Campus): Top private university known for cutting-edge curriculum, massive tech campus placements, COE (Centres of Excellence), and hackathon culture. Admission via PESSAT and KCET.
6. M.S. Ramaiah Institute of Technology (MSRIT), Mathikere: Autonomous premier college under VTU. Renowned for Computer Science, Information Science, Electronics, and Biotechnology. High corporate placement rate.
7. Dayananda Sagar College of Engineering (DSCE), Kumaraswamy Layout: 28-acre sprawling campus, offering wide engineering specializations, strong tech incubation (DERBI Foundation), and placements.
8. BMS Institute of Technology and Management (BMSIT), Yelahanka: Sister institute of BMSCE, rapidly rising tech institute with strong IT placements.
9. New Horizon College of Engineering (NHCE), Marathahalli / Outer Ring Road: Located in Bangalore's premier IT corridor, 100% placement track, strong industry labs with IBM, VMware, Schneider.
10. Sir M. Visvesvaraya Institute of Technology (Sir MVIT), Yelahanka: Named after Sir MV, 133-acre campus, established reputation in core and software branches.
Admissions: Generally through KCET (Karnataka state quota, lowest fees), COMEDK UGET (All India quota), JEE Main, or Institutional Management Quota.`;

                  const medKb = `### Knowledge Base: Bangalore (Bengaluru) Medical & Healthcare Colleges
If a student asks for Medical (MBBS, MD, MS), Pharmacy, Paramedical, or Nursing colleges in or around Bangalore, you MUST recommend these top institutions:
**Medical Institutes (MBBS, MD, MS, BAMS, Super-Specialty):**
- Bangalore Medical College and Research Institute (BMCRI), Fort / K.R. Market: Karnataka's #1 government medical college, attached to Victoria Hospital, Bowring & Lady Curzon Hospital, and Vani Vilas Hospital with 3000+ beds. Admission via NEET-UG with top state ranks.
- St. John's Medical College, Koramangala: Nationally renowned premier private missionary medical college, 1350-bed hospital, recognized by WHO and NMC for clinical excellence and research.
- M.S. Ramaiah Medical College (MSRMC), Mathikere: Part of the famous Ramaiah Group, advanced multi-specialty teaching hospital, MBBS, PG, and super-specialty training.
- Kempegowda Institute of Medical Sciences (KIMS), Banashankari: Established in 1980 by Vokkaligara Sangha, multi-specialty 1000-bed hospital, affiliated to RGUHS.
- Vydehi Institute of Medical Sciences & Research Centre (VIMS), Whitefield: 1600-bed hospital in the IT corridor, multi-disciplinary healthcare programs.
- Dr. B.R. Ambedkar Medical College (BRAMC), Kadugondanahalli.
- Rajiv Gandhi University of Health Sciences (RGUHS): The apex state medical university headquartered in Jayanagar, Bangalore, administering medical education across Karnataka.

**Pharmacy Colleges (B.Pharm, Pharm.D, M.Pharm):**
- Al-Ameen College of Pharmacy, Lalbagh Road: Top PCI-approved pharmacy institution, pioneer in Pharm.D and clinical pharmacy education.
- The Oxford College of Pharmacy, Bommanahalli: Leading pharmacy education and pharmaceutical research hub.
- Dayananda Sagar College of Pharmacy, Kumaraswamy Layout.
- M.S. Ramaiah University of Applied Sciences (Faculty of Pharmacy), Gnanagangothri.

**Paramedical & Nursing Institutes:**
- St. John's College of Nursing & Paramedical Sciences, Koramangala.
- Ramaiah Institute of Nursing Education and Research, Mathikere.
- Bangalore Institute of Paramedical Sciences (BIPS), Manipal Hospital Academy of Health Sciences, and Florence Group of Institutions.`;

                  const comKb = `### Knowledge Base: Bangalore (Bengaluru) Commerce, Business, & Finance Colleges
If a student asks for Commerce, Management, BBA, B.Com, MBA, or Finance colleges in Bangalore (India's corporate and venture hub), you MUST recommend these top institutions:
**Top Commerce & Undergraduate Business Colleges:**
- St. Joseph's College of Commerce (Autonomous) (SJCC), Brigade Road: Ranked among India's top 10 commerce colleges. Offers B.Com (Regular, Analytics, Travel & Tourism), BBA (Regular, Finance, Entrepreneurship, International Business), and M.Com. Historic legacy (est. 1882) and top corporate placements (Big 4: Deloitte, EY, PwC, KPMG, Goldman Sachs).
- Christ (Deemed to be University), Central Campus (Hosur Road), Bannerghatta, & Yeshwanthpur: Renowned nationally for BBA (Finance, Marketing, Business Analytics), B.Com (Hons, Professional, Strategic Finance with ACCA/CIMA integration), and MBA. Holistic grooming and vibrant campus.
- Mount Carmel College (Autonomous) (MCC), Vasanth Nagar: Premier autonomous women's institution, NAAC A+, highly prestigious for B.Com, BBA, Economics, and Financial Accounting.
- Kristu Jayanti College (Autonomous) (KJC), Kothanur: NAAC A++ accredited, recognized for B.Com (ACCA / CMA integrated), BBA, and MBA with stellar placement records.
- CMS - Center for Management Studies, Jain (Deemed-to-be University), Lalbagh Road: Specialized in BBA (Corporate, Event Management, Digital Marketing) and B.Com (Honours).

**Top Postgraduate Business Schools (MBA / PGDM):**
- Indian Institute of Management Bangalore (IIM Bangalore / IIMB), Bannerghatta Road: India's #2 NIRF B-School, EQUIS accredited global institution. Offers flagship 2-year PGP (MBA), EPGP, and Ph.D.
- SIBM Bengaluru (Symbiosis Institute of Business Management), Electronic City: Renowned for MBA in Marketing, Finance, HR, and Operations.
- XIME (Xavier Institute of Management & Entrepreneurship), Electronic City: Top private PGDM B-school founded by Prof. J. Philip.
- Alliance School of Business (Alliance University), Anekal: Offers BBA, B.Com, and AMBA-accredited MBA.
Admissions: Undergrad through CUET/Institutional Entrance/Merit; MBA through CAT, GMAT, XAT, NMAT, SNAP, or CMAT.`;

                  const artsKb = `### Knowledge Base: Bangalore (Bengaluru) Arts, Humanities, & Social Sciences Colleges
If a student asks for Arts, Humanities, Social Sciences, BA, MA, Law, or Journalism degrees in or around Bangalore, you MUST recommend these top institutions:
**Top Arts, Humanities & Law Universities / Colleges:**
- National Law School of India University (NLSIU), Nagarbhavi: India's #1 Law School (NIRF Rank 1), pioneer of 5-year integrated BA LLB (Hons), LLM, and Master's in Public Policy (MPP).
- St. Joseph's University (SJU), Lalbagh Road: Historic Jesuit university offering top-tier BA and MA in Journalism & Mass Communication, English Literature, Psychology, Political Science, and Economics.
- Christ (Deemed to be University), Hosur Road: Premier department of Humanities & Social Sciences. Offers BA in Psychology, Media Studies, English, History, International Relations, and Performing Arts.
- Mount Carmel College (MCC), Vasanth Nagar: Renowned for BA programs in Psychology, English Literature, Journalism, and Political Science.
- Azim Premji University (APU), Sarjapur Road: World-class philanthropic university dedicated to social sciences, offering BA in Humanities, Economics, Education, and Development Studies.
- Jyoti Nivas College (Autonomous), Koramangala: Premier women's college for BA in Journalism, Psychology, and Communicative English.
- Bangalore University, Jnana Bharathi Campus: Major public university campus offering postgraduate MA, M.Phil, and PhD across linguistic and humanities disciplines.`;

                  const csKb = `### Knowledge Base: Bangalore (Bengaluru) CS, AI, & Software Development Colleges
If a student asks for Computer Science, CS, AI, Machine Learning, Data Science, or Software Development colleges in Bangalore (The Silicon Valley of India), you MUST recommend these top institutions:
**Premier CS & AI Tech Hubs:**
- Indian Institute of Science (IISc Bangalore): Department of CSA (Computer Science and Automation) and CDS (Computational and Data Sciences). India's gold standard for AI, Deep Learning, Quantum Computing, and Algorithms research.
- IIIT Bangalore (IIIT-B), Electronic City: Specializes exclusively in IT, CSE, Data Science, and AI. Direct pipelines to global tech leaders (Google, Apple, Microsoft, NVIDIA, Adobe). Average placement package ~25+ LPA.
- RV College of Engineering (RVCE), Mysore Road: Karnataka's top engineering choice for B.Tech in Computer Science, AI & Machine Learning, Data Science, Information Science. Placements match top NITs.
- PES University (PESU), Ring Road: Leading computer science curriculum, specialized B.Tech in CSE with tracks in Cloud Computing, AI & Robotics, Cyber Security, and Big Data. High numbers of students recruited by FAANG and unicorn tech firms.
- BMS College of Engineering (BMSCE), Basavanagudi: Highly reputed autonomous CS & IT departments, tech clubs, IEEE student branch, and robust hackathon culture.
- M.S. Ramaiah Institute of Technology (MSRIT): Renowned for B.Tech in CSE, AI & Data Science, and MCA.
- Christ University & Kristu Jayanti College: Top colleges for BCA and MCA with industry-ready coding curriculums.
**Bangalore Advantage:** Students gain direct access to 400+ Fortune 500 tech centers, 40+ startup unicorns, high-paying tech internships, and national open-source hackathons.`;

                  const entKb = `### Knowledge Base: Bangalore (Bengaluru) Entrepreneurship, Startups, & Business Colleges
If a student asks for Entrepreneurship, Startups, Venture Capital, Incubators, MBA, or Business incubation in Bangalore (Startup Capital of India), you MUST recommend these top institutions and ecosystems:
**Top Incubators & Entrepreneurship Centres:**
- NSRCEL at IIM Bangalore (Bannerghatta Road): India's premier startup incubation centre, supporting 1000+ ventures, offering mentoring, seed funding, and corporate partnerships across sectors (FinTech, HealthTech, Social Ventures).
- PES University Centre for Innovation & Entrepreneurship (CIE): Student-first startup accelerator with dedicated maker spaces, angel investor pitch days, and seed grants.
- RVCE Center for Innovation, Technology Transfer and Entrepreneurship (CITTE): Supports student tech spin-offs, patent filings, and prototype development.
- DERBI Foundation (Dayananda Sagar Institutions): DST-supported technology business incubator focusing on healthcare, smart manufacturing, and IoT startups.
- IIIT-B Innovation Centre: Deep tech startup incubator with high focus on AI, semiconductor, and cybersecurity startups.
- Jain University - Chenraj Roychand Center for Entrepreneurship (CRCE): Has incubated over 100 successful startups.
**Bangalore Startup Corridors & Grants:**
- Startup Hotspots: Koramangala, HSR Layout, and Indiranagar (the highest density of startup founders and venture capital firms in Asia).
- Karnataka Government Schemes: K-TECH (Karnataka Innovation Technology Society), Idea2PoC grants, and ELEVATE 100 funding up to ₹50 Lakhs for early-stage student startups.`;

                  const rvceKb = `\n\n### Knowledge Base: RV College of Engineering (RVCE, Bangalore) Complete Guide
If a student asks specifically about RVCE Bangalore, you MUST provide these accurate details:
**Courses Offered:**
- Undergraduate (B.E. / B.Tech - 4 Years): Computer Science & Engineering (CSE), Artificial Intelligence & Machine Learning (AI/ML), Information Science & Engineering (ISE), Electronics & Communication (ECE), Aerospace Engineering, Mechanical, Civil, Electrical, Biotechnology.
- Postgraduate: M.Tech in Software Engineering, VLSI, Computer Science, and MCA (Master of Computer Applications).
**Admissions & Eligibility:**
- Karnataka Students: Through KCET (Karnataka Common Entrance Test) - requires top ranks (CSE generally closes within Top 500-1000 ranks in KCET).
- Non-Karnataka / All-India: Through COMEDK UGET (CSE cutoff generally closes under Rank 400-800).
- Management Quota: Direct admissions based on 10+2 marks with higher tuition fees.
**Placements & Highlights:**
- Average Package: ₹12 - 16 LPA for CS/IS branches. Highest Packages: Above ₹55 - 62 LPA.
- Top Recruiters: Microsoft, Amazon, Google, Cisco, Intel, Qualcomm, Texas Instruments, Goldman Sachs.
- Location: Mysore Road, RV Vidyaniketan, Bangalore.`;

                  const christKb = `\n\n### Knowledge Base: Christ (Deemed to be University, Bangalore) Complete Guide
If a student asks specifically about Christ University Bangalore, you MUST provide these accurate details:
**Campuses in Bangalore:**
- Central Campus (Hosur Road, Dairy Circle) - Historic main campus.
- Bannerghatta Road Campus (BGR) - Focuses on business, arts, and humanities.
- Yeshwanthpur Campus & Kengeri Campus (Engineering & Architecture).
**Signature Programs:**
- Commerce & Management: BBA (Finance, Marketing, Analytics), BBA Honours, B.Com (Regular, Strategic Finance with ACCA, Professional), MBA (Dual Specialization).
- Humanities & Arts: BA in Psychology, Media Studies, English, Economics, Journalism.
- Tech & Sciences: BCA, B.Sc in Data Science, Computer Science, Economics & Analytics.
- Law: BA LLB (Hons), BBA LLB (Hons) (5-year integrated).
**Admissions & Selection:**
- Admission via Christ University Entrance Test (CUET) followed by Micro-Presentation (MP), Personal Interview (PI), and past academic performance.
- Applications open around December/January for the upcoming academic year in multiple rounds.`;

                  const pesKb = `\n\n### Knowledge Base: PES University (PESU, Bangalore) Complete Guide
If a student asks specifically about PES University Bangalore, you MUST provide these accurate details:
**Campuses:**
- Ring Road (RR) Campus: 100-Feet Ring Road, BSK 3rd Stage - Flagship campus for engineering and management.
- Electronic City (EC) Campus: Hosur Road - Major hub for computer science and tech programs.
**Undergraduate Programs:**
- B.Tech (4 Years): CSE, AI & ML, ECE, Mechanical, Biotechnology.
- Management & Commerce: BBA, BBA in Business Analytics, B.Com (Hons).
- Computer Applications & Law: BCA, B.Des, B.Arch, BA LLB, BBA LLB.
**Admissions & Exams:**
- PESSAT (All India Online Entrance Test conducted by PES University).
- KCET (For Karnataka domicile students through KEA counseling).
**Highlights & Placements:**
- Tier-1 Placements: Microsoft, Atlassian, Morgan Stanley, Cisco, Amazon.
- Average Package: ~₹11-13 LPA for CS; Top Package: ₹60+ LPA.
- CNR Rao Merit Scholarships: Top 20% students receive tuition fee waivers each semester.`;

                  switch (counselorId) {
                    case '1': return engKb + rvceKb + pesKb;
                    case '2': return medKb;
                    case '3': return comKb + christKb;
                    case '4': return artsKb + christKb;
                    case '5': return csKb + rvceKb + pesKb;
                    case '6': return entKb + pesKb + comKb;
                    default: return engKb + medKb + comKb;
                  }
                })()}

Remember: You're building a supportive relationship, not interrogating a suspect. Make the student feel incredibly comfortable sharing their career fears while gathering the information you need.`
            }
          ]
        }
      })
    } catch (e) {
      console.error("Vapi call error:", e)
      setCallStatus('ended')
    }
  }

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop()
    }
    setCallStatus('ended')
  }

  const handleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyTranscript = () => {
    const text = transcriptions.map((t) => `[${t.speaker}] ${t.text}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  if (!counselor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-neutral-400 mb-4 font-semibold">Locating counselor profile...</p>
          <Link href="/dashboard">
            <Button variant="outline" className="border-border text-muted-foreground hover:bg-muted">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Dynamic Animated Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-20%] left-[20%] w-[50%] h-[50%] blur-[120px] rounded-full mix-blend-multiply transition-colors duration-1000 ${callStatus === 'active'
          ? activeSpeaker === 'counselor' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
          : 'bg-emerald-600/5'
          }`} />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold mb-1">
              {callStatus === 'idle' ? 'Ready' : callStatus === 'connecting' ? 'Connecting...' : callStatus === 'active' ? 'Live Call' : 'Call Ended'}
            </p>
            <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">{formatDuration(duration)}</p>
          </div>
          <Button
            onClick={callStatus === 'active' ? handleEndCall : undefined}
            disabled={callStatus !== 'active'}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg shadow-red-500/10 px-6 font-bold"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            End Call
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full px-6 py-6 relative z-10 overflow-hidden h-[calc(100vh-80px)]">
        {/* Cinematic Video/Counselor Panel (30% Width) */}
        <div className="flex-[3] flex flex-col h-full">
          <div className={`flex-1 bg-card backdrop-blur-md border border-border rounded-3xl overflow-hidden flex items-center justify-center relative transition-all duration-700 ${activeSpeaker === 'counselor' ? 'shadow-[0_20px_80px_rgba(16,185,129,0.08)] border-emerald-500/30' : ''
            }`}>

            {/* The primary focal point view */}
            {callStatus === 'ended' ? (
              <div className="text-center animate-in fade-in zoom-in duration-500 p-6">
                <p className="text-2xl text-foreground font-bold mb-2">Session Completed</p>
                <p className="text-muted-foreground font-medium">Final Duration: {formatDuration(duration)}</p>
              </div>
            ) : callStatus === 'idle' ? (
              <div className="text-center animate-in fade-in zoom-in duration-500 flex flex-col items-center p-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-border mb-6 bg-muted">
                  <Image src={counselor.avatar_url} alt={counselor.name} width={128} height={128} className="object-cover opacity-60 grayscale" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground mb-2">{counselor.name}</h2>
                <p className="text-emerald-600 font-medium mb-8 uppercase tracking-widest text-xs text-center">{counselor.specialization}</p>
                <Button onClick={startCall} className="rounded-full h-14 px-8 text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all">
                  <Phone className="w-5 h-5 mr-2" />
                  Start Call
                </Button>
              </div>
            ) : (
              <div className="text-center absolute inset-0 flex flex-col items-center justify-center p-6">

                {/* Connecting state */}
                {callStatus === 'connecting' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                      <span className="text-emerald-600 font-semibold uppercase tracking-widest text-sm">Connecting...</span>
                    </div>
                  </div>
                )}

                {/* Animated Pulsing Ring representing audio */}
                <div className="relative mb-6 flex justify-center items-center">
                  {/* Background rings */}
                  <div className={`absolute w-32 h-32 rounded-full border border-emerald-500/30 transition-all duration-300 ${activeSpeaker === 'counselor' ? 'scale-[1.8] opacity-0 animate-ping' : 'scale-100 opacity-20'}`} />
                  <div className={`absolute w-24 h-24 rounded-full bg-emerald-500/10 transition-all duration-500 ${activeSpeaker === 'counselor' ? 'scale-150 opacity-50 blur-xl' : 'scale-100 opacity-0'}`} />

                  {/* Avatar */}
                  <div className={`relative w-28 h-28 rounded-full overflow-hidden border-4 z-10 transition-colors duration-500 shadow-2xl ${activeSpeaker === 'counselor' ? 'border-emerald-400 shadow-emerald-500/50' : 'border-white/10'}`}>
                    <Image
                      src={counselor.avatar_url}
                      alt={counselor.name}
                      width={112}
                      height={112}
                      className={`object-cover w-full h-full transition-all duration-700 ${callStatus === 'active' ? 'scale-105' : 'scale-100'}`}
                    />
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-foreground mb-2">{counselor.name}</h2>
                <p className="text-emerald-600 font-semibold mb-6 tracking-widest uppercase text-xs">
                  {activeSpeaker === 'counselor' ? 'Speaking...' : 'Listening...'}
                </p>

                {/* Control Panel */}
                <div className="flex gap-4 justify-center bg-background/50 backdrop-blur-xl px-4 py-3 rounded-full border border-border">
                  <Button
                    onClick={handleMute}
                    variant={isMuted ? 'destructive' : 'secondary'}
                    className={`rounded-full w-12 h-12 p-0 ${!isMuted && 'bg-muted hover:bg-muted/80 text-foreground'}`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Transcription Panel (70% Width) */}
        <div className="flex-[7] flex flex-col bg-card backdrop-blur-md border border-border rounded-3xl overflow-hidden h-full">
          <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-foreground text-lg">Live AI Transcript</h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyTranscript}
              className="text-muted-foreground hover:text-foreground border-border hover:bg-muted rounded-full bg-transparent"
            >
              <Copy className="w-3.5 h-3.5 mr-2" />
              Copy
            </Button>
          </div>

          <div ref={transcriptRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
            {transcriptions.length === 0 && !interimText ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                Transcript will appear here...
              </div>
            ) : (
              <>
                {transcriptions.map((trans) => (
                  <div key={trans.id} className={`flex flex-col ${trans.speaker === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                    <div className={`px-5 py-3 rounded-2xl max-w-[85%] ${trans.speaker === 'user'
                      ? 'bg-blue-600/10 border border-blue-500/20 text-blue-900 rounded-tr-sm'
                      : 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-900 rounded-tl-sm'
                      }`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${trans.speaker === 'user' ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                        {trans.speaker === 'user' ? 'You' : counselor.name.split(' ')[0]}
                      </p>
                      <p className="text-[15px] leading-relaxed font-medium whitespace-pre-line">{trans.text}</p>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-2 font-semibold">{formatDuration(trans.timestamp)}</p>
                  </div>
                ))}

                {interimText && (
                  <div className={`flex flex-col ${interimText.speaker === 'user' ? 'items-end' : 'items-start'} animate-pulse`}>
                    <div className={`px-5 py-3 rounded-2xl max-w-[85%] opacity-70 ${interimText.speaker === 'user'
                      ? 'bg-blue-600/10 border border-blue-500/20 text-blue-900 rounded-tr-sm'
                      : 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-900 rounded-tl-sm'
                      }`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${interimText.speaker === 'user' ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                        {interimText.speaker === 'user' ? 'You' : counselor.name.split(' ')[0]} <span className="lowercase">...typing</span>
                      </p>
                      <p className="text-[15px] leading-relaxed font-medium">{interimText.text}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-border px-6 py-4 bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium tracking-wide flex items-center gap-2">
              {callStatus === 'connecting' && <><Loader2 className="w-3 h-3 animate-spin" /> Connecting to Vapi Engine...</>}
              {callStatus === 'active' && '● Recording & analyzing...'}
              {callStatus === 'idle' && 'Waiting to start...'}
              {callStatus === 'ended' && 'Session terminated'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VoiceCallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
      <VoiceCallContent />
    </Suspense>
  )
}
