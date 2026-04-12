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
    avatar_url: '/counselors/engineering.jpg',
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
    avatar_url: '/counselors/arts.jpg',
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
    avatar_url: '/counselors/entrepreneurship.jpg',
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
              // If the last message is from the SAME speaker, merge them to avoid chopped up bubbles
              if (last && last.speaker === message.role) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...last,
                  text: `${last.text.trim()} ${message.transcript.trim()}`
                }
                return updated;
              }
              // Otherwise, create a new bubble
              return [...prev, {
                id: Date.now().toString(),
                speaker: message.role === 'user' ? 'user' : 'counselor',
                text: message.transcript,
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

Behavior Guidelines:
- Speak as a real human expert career counselor would on a 1-on-1 coaching call.
- Keep responses natural, warm, and highly conversational.
- Listen actively and express empathy if they are confused about their future.
- Don't be overly formal or robotic.
- Keep the call focused but not rushed (aim for 5-8 minutes).
- End on a highly positive, encouraging note.

Language & Communication Style:
- You are strictly bilingual and exceptionally comfortable speaking in English, Hindi, or Hinglish (Mix of both).
- Adapt your language precisely based on how the student speaks:
  - If they speak English -> Reply in professional English.
  - If they speak Hindi -> Reply in polite, supportive Hindi.
  - If they use Hinglish -> Reply in natural Hinglish exactly how youngsters in India talk today.
- Maintain professionalism and deep empathy regardless of the language used.

${(() => {
    const engKb = `### Knowledge Base: Bareilly Engineering Colleges
If a student asks for B.Tech or engineering colleges in or around Bareilly, you MUST recommend these top institutions with their specific details:
1. Invertis University: Known for varied engineering courses and good infrastructure.
2. Shri Ram Murti Smarak College of Engineering and Technology (SRMSCET): Highly regarded private institution for B.Tech in CSE and other streams.
3. Future Institute of Engineering and Technology (FIET): Offers B.Tech in Computer Science, AI, and Electronics.
4. Rajshree Institute of Management and Technology: Provides diverse technical courses with a focus on practical learning.
5. Shri Siddhi Vinayak Group of Institutions (SSVGI): Offers B.Tech in Civil, Electrical, and other disciplines.
6. Mahatma Jyotiba Phule Rohilkhand University (MJPRU): Government university with a prestigious Department of Engineering and Technology.`;

    const medKb = `### Knowledge Base: Bareilly Medical & Healthcare Colleges
If a student asks for Medical, Pharmacy, Paramedical, or Nursing colleges in or around Bareilly, you MUST recommend these top institutions:
**Medical Institutes (MBBS, MD, MS, BAMS):**
- Shri Ram Murti Smarak Institute of Medical Sciences (SRMS): Known for MBBS, MD, MS, and nursing, located on Nainital Road.
- Rohilkhand Medical College & Hospital: A major hospital with 1200+ beds offering comprehensive medical training.
- Rajshree Medical Research Institute: Provides MBBS and PG courses, affiliated with Atal Bihari Vajpayee Medical University.
- Bareilly International University: Includes Rohilkhand College of Pharmacy and medical studies.
- ANA Group of Institutions: Offers BAMS (Ayurvedic), Nursing, and Pharmacy programs.

**Pharmacy Colleges (B.Pharm/D.Pharm):**
- RBMI Group of Institutions: Offers PCI-approved B.Pharm affiliated with AKTU.
- Arya College of Pharmacy: Located on Pilibhit Road.
- Sardar Ballabh Bhai Patel Group of Institutions: Offers Diploma in Pharmacy.
- Keshlata College of Pharmacy: Offers D.Pharm.
- ACME Institute of Pharmacy, Future Institute of Pharmacy, & ANA Institute of Pharmaceutical Science and Research.

**Paramedical & Nursing Institutes:**
- DPMI Delhi Paramedical & Management Institute, Indian Paramedical Institute, Asian College of Nursing, SM Bareilly Para-Medical Institute, & G K Group of Institutions.`;

    const comKb = `### Knowledge Base: Bareilly Commerce, Business, & Finance Colleges
If a student asks for Commerce, Management, BBA, B.Com, or Finance colleges/tutors in or around Bareilly, you MUST recommend these top institutions:
**Top Commerce & Management Colleges:**
- Khandelwal College of Management Science & Technology (KCMT): Known for management studies and industry MoUs.
- RBMI Group of Institutions: Offers B.Com Hons, authorized by MJP Rohilkhand University.
- Invertis University: Offers B.Com and BBA, a top-ranked private university.
- Future University: Offers commerce and business degrees with a focus on placements.
- Rajshree Institute of Management and Technology: Offers business management programs.
- Regional College: Offers various business and commerce specializations.
- Shri Siddhi Vinayak Group of Institutions: Known for BBA programs.

**Finance & Commerce Institutes/Tutors:**
- Royal Commerce Classes: Specializes in B.Com Hons and commercial coaching.
- NIIT Ltd: Offers specialized share trading and financial training.

**General Information:**
- Affiliation: Most commerce colleges are affiliated with MJP Rohilkhand University.
- Courses: B.Com (Hons), B.Com (Pass), BBA, MBA, and various professional certificate programs.
- Admissions: Generally merit-based or through entrance exams like CUET.`;

    const artsKb = `### Knowledge Base: Bareilly Arts, Humanities, & Social Sciences Colleges
If a student asks for Arts, Humanities, Social Sciences, BA, MA, or related degrees in or around Bareilly, you MUST recommend these top institutions:
**Top Arts & Humanities Universities/Colleges:**
- Bareilly College, Rampur Garden: Offers BA and various PG courses.
- Mahatma Jyotiba Phule Rohilkhand University (MJPRU): A major state university offering diverse arts programs.
- Khandelwal College of Management Science & Technology: Offers programs like B.Sc in Home Science.
- Future University: Located on Bareilly-Lucknow Road, offering varied humanities courses.
- Shree Dev Vidhya Peeth Mahila Mahavidhyalaya: Women's college offering arts education.

**Other Notable Colleges & Private Institutes:**
- Aala Hazrat Degree College: Private institution.
- Adarsh College: Private institution.
- Aryadev Mahavidyalaya: Situated in Tisua.
- Sardar Ballabh Bhai Patel Group of Institutions: Located in Bhojipura.
- Ganga Sheel Mahavidhyalaya: Offers B.A. courses.`;

    const csKb = `### Knowledge Base: Bareilly CS, AI, & Software Development Colleges
If a student asks for Computer Science, CS, AI, Machine Learning, Data Science, or Software Development colleges/institutes in or around Bareilly, you MUST recommend these top institutions:
**Top Engineering & Tech Colleges for CS/AI:**
- Invertis University: Offers specialized B.Tech (CSE) in AI & ML, Data Science, and BCA in Artificial Intelligence.
- SRMS College of Engineering & Technology (SRMS CET): Known for B.Tech in Computer Science & Engineering (AI & ML).
- Future Institute of Engineering and Technology (FIET): Offers B.Tech in CSE, AI & Data Science, and AI & Machine Learning.
- Future University: Offers B.Tech and BCA (Hons) specialized in AI and Data Science.
- Rakshpal Bahadur Management Institute (RBMI): Provides B.Tech in Computer Science Engineering with high placement rates.
- Bareilly Regional Engineering College (RBCET): Offers B.Tech CSE, affiliated with AKTU.

**Specialized Technical & Vocational Institutes:**
- DigiStackEdu: Known for practical Artificial Intelligence and Machine Learning certificate courses.
- Aptech Computer Education: Offers specialized training in Artificial Intelligence.
- Rajeev Gandhi Computer Training Institute: Focuses on computer skills and various IT courses.`;

    const entKb = `### Knowledge Base: Bareilly Entrepreneurship, Startups, & Business Colleges
If a student asks for Entrepreneurship, Startups, MBA, BBA, or Business incubation colleges/institutes in or around Bareilly, you MUST recommend these top institutions:
**Top Business & Entrepreneurship Colleges:**
- Invertis University: Known for its incubation centre, supporting startups and innovation.
- Mahatma Jyotiba Phule Rohilkhand University (MJPRU): Offers management courses (P.G.D, MBA) with a focus on entrepreneurship.
- Khandelwal College of Management Science & Technology (KCMT): Located on Pilibhit Bypass, recognized for management studies.
- Shri Ram Murti Smarak College of Engineering & Technology (SRMS CET): Offers top-tier MBA programs.
- ANA Group of Institutions: Offers BBA with a focus on entrepreneurship and 100% placement support.
- Future Group of Institutions: Offers comprehensive MBA programs.
- RBMI Group of Institutions: Known for BBA programs.

**Entrepreneurship and Startup Support Initiatives:**
- Invertis University Incubation Centre: Provides mentorship, resources, and support to transform ideas into startups.
- MBA Specializations: Many colleges, including Invertis and KCMT, offer specializations in Entrepreneurship, Finance, and Marketing.
- Industry Connect: Institutes like ANA Group provide mandatory internships for practical business exposure.`;

    const invertisKb = `\n\n### Knowledge Base: Invertis University Complete Course Guide
If a student asks specifically about courses, admission, or degrees offered at Invertis University, you MUST provide these accurate details:
**Undergraduate Courses (UG):**
- Engineering & Tech: B.Tech (CSE, Mechanical, Civil, Electrical, ECE), BCA, BCA (Hons) in Data Science.
- Management & Commerce: BBA, BBA (Hons) in Business Analytics, B.Com, B.Com (Hons).
- Science: B.Sc (Hons) in PCM, Biotechnology, Microbiology, Food Technology.
- Law & Pharmacy: LLB (3 yrs), BA LLB/BBA LLB (5 yrs), B. Pharma.
- Arts & Journalism: BA, BA (Hons) in English, Psychology, BJMC.

**Postgraduate Courses (PG):**
- Management: MBA (Dual Specialization), MBA in Fintech with AI, MBA in Business Analytics.
- Engineering & Tech: M.Tech (CS, Mechanical, Civil), MCA, MCA in AI & ML.
- Science: M.Sc in Chemistry, Mathematics, Physics, Food Tech, Biotechnology, Microbiology.
- Law, Arts & Education: LLM, MA, M.A. in Education.

**Other Courses & Admission Details:**
- Doctoral & Diploma: Ph.D. in various disciplines, Polytechnic/Diploma in Civil, Mechanical, Computer Science.
- UG Entrance: Accepts CUET-UG for BCA/BBA/BSc and JEE Main for B.Tech.
- PG Management: MBA admissions based on IUCET, CAT, MAT, XAT, or ATMA scores.
- Application Timeline: Generally starts around December/March for the following academic session.`;

    const srmsKb = `\n\n### Knowledge Base: Shri Ram Murti Smarak (SRMS) Group of Institutions
If a student asks specifically about courses or degrees offered at the SRMS Group of Institutions (Bareilly), you MUST provide these accurate details:
**Engineering & Technology (SRMS CET & CETR):**
- B.Tech (4 Years): Computer Science & Engineering (CSE), Electronics & Communication, Mechanical, Electrical & Electronics, Information Technology, and CSE (Cyber Security).
- B.Tech Lateral Entry: Available for diploma holders.
- M.Tech (2 Years): Software Engineering, CAD/CAM, Microwave Engineering, Electrical Drives and Control.
- Other: MCA (Master of Computer Applications).

**Management, Commerce & Computer Applications:**
- Bachelor's: BBA (3 years), BCA (3 years), B.Com.
- Master's: MBA (2 years) with specializations in HR, Marketing, Finance, International Business, IT, Rural Development.

**Pharmacy (SRMS COP):**
- B.Pharm: 4 years.
- M.Pharm: Pharmacology, Pharmaceutics.

**Medical & Paramedical (SRMS IMS):**
- Medical: MBBS (5.5 years), MD/MS in Respiratory Medicine, General Surgery, OBG, Ophthalmology, and others.
- Paramedical (B.Sc/Diploma): Radiological Imaging Techniques, Medical Laboratory Technology (MLT), Operation Theatre Technology, Optometry, Blood Transfusion Technician.

**Hospitality:**
- BHMCT: Bachelor of Hotel Management and Catering Technology.`;

    const ssvgiKb = `\n\n### Knowledge Base: Shri Siddhi Vinayak Group of Institutions (SSVGI)
If a student asks specifically about courses or degrees offered at SSVGI (Bareilly), you MUST provide these accurate details:
**Engineering (B.Tech - 4 Years):** Computer Science & Engineering, Information Technology, Mechanical Engineering, Electrical Engineering, Electronics & Communication Engineering, Civil Engineering.
**Management & Computer Applications:** MBA, BBA, BCA, B.Com (Hons).
**Pharmacy:** B.Pharm (4 years), D.Pharma (2 years).
**Nursing:** ANM (Auxiliary Nurse Midwifery), GNM (General Nursing and Midwifery).
**Paramedical Diplomas:** Diploma in Optometry (DOPT), Emergency & Trauma Care Technician (DECT), X-Ray Technician (DXRT), OT Technician (DOOT), Dialysis Technician (DDT), Physiotherapy (DPT).
**Science & Other Courses:** B.Sc. PCM (Physics, Chemistry, Maths), B.Sc. ZBC (Zoology, Botany, Chemistry), B.Sc. Bio-Tech, B.Sc. Home Science.
**Polytechnic:** Diploma in Engineering (various specializations like Civil, Mechanical, Electrical).`;

    switch(counselorId) {
       case '1': return engKb + invertisKb + srmsKb + ssvgiKb;
       case '2': return medKb + srmsKb + ssvgiKb;
       case '3': return comKb + invertisKb + srmsKb + ssvgiKb;
       case '4': return artsKb + invertisKb;
       case '5': return csKb + invertisKb + srmsKb + ssvgiKb;
       case '6': return entKb + invertisKb + srmsKb + ssvgiKb;
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
                      <p className="text-[15px] leading-relaxed font-medium">{trans.text}</p>
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
