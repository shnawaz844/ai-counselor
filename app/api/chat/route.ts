import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, counselorId } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: "Google Gemini API Key is missing. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env file."
      }), { status: 401 });
    }

    // Map counselor ID to their specific role
    const roles: Record<string, string> = {
      '1': 'Engineering Career Advisor',
      '2': 'Medical & Healthcare Counselor',
      '3': 'Commerce & Business Specialist',
      '4': 'Arts & Humanities Guide',
      '5': 'Computer Science Expert',
      '6': 'Entrepreneurship Coach'
    };
    const specificRole = counselorId ? roles[counselorId] || 'Career Counselor' : 'Career Counselor';

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash'
    ].filter(Boolean) as string[];

    // ---------------- Knowledge Base Data: Bangalore (Bengaluru) ----------------
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
** Medical Institutes (MBBS, MD, MS, BAMS, Super-Specialty):**
- Bangalore Medical College and Research Institute (BMCRI), Fort / K.R. Market: Karnataka's #1 government medical college, attached to Victoria Hospital, Bowring & Lady Curzon Hospital, and Vani Vilas Hospital with 3000+ beds. Admission via NEET-UG with top state ranks.
- St. John's Medical College, Koramangala: Nationally renowned premier private missionary medical college, 1350-bed hospital, recognized by WHO and NMC for clinical excellence and research.
- M.S. Ramaiah Medical College (MSRMC), Mathikere: Part of the famous Ramaiah Group, advanced multi-specialty teaching hospital, MBBS, PG, and super-specialty training.
- Kempegowda Institute of Medical Sciences (KIMS), Banashankari: Established in 1980 by Vokkaligara Sangha, multi-specialty 1000-bed hospital, affiliated to RGUHS.
- Vydehi Institute of Medical Sciences & Research Centre (VIMS), Whitefield: 1600-bed hospital in the IT corridor, multi-disciplinary healthcare programs.
- Dr. B.R. Ambedkar Medical College (BRAMC), Kadugondanahalli.
- Rajiv Gandhi University of Health Sciences (RGUHS): The apex state medical university headquartered in Jayanagar, Bangalore, administering medical education across Karnataka.

** Pharmacy Colleges (B.Pharm, Pharm.D, M.Pharm):**
- Al-Ameen College of Pharmacy, Lalbagh Road: Top PCI-approved pharmacy institution, pioneer in Pharm.D and clinical pharmacy education.
- The Oxford College of Pharmacy, Bommanahalli: Leading pharmacy education and pharmaceutical research hub.
- Dayananda Sagar College of Pharmacy, Kumaraswamy Layout.
- M.S. Ramaiah University of Applied Sciences (Faculty of Pharmacy), Gnanagangothri.

** Paramedical & Nursing Institutes:**
- St. John's College of Nursing & Paramedical Sciences, Koramangala.
- Ramaiah Institute of Nursing Education and Research, Mathikere.
- Bangalore Institute of Paramedical Sciences (BIPS), Manipal Hospital Academy of Health Sciences, and Florence Group of Institutions.`;

    const comKb = `### Knowledge Base: Bangalore (Bengaluru) Commerce, Business, & Finance Colleges
If a student asks for Commerce, Management, BBA, B.Com, MBA, or Finance colleges in Bangalore (India's corporate and venture hub), you MUST recommend these top institutions:
** Top Commerce & Undergraduate Business Colleges:**
- St. Joseph's College of Commerce (Autonomous) (SJCC), Brigade Road: Ranked among India's top 10 commerce colleges. Offers B.Com (Regular, Analytics, Travel & Tourism), BBA (Regular, Finance, Entrepreneurship, International Business), and M.Com. Historic legacy (est. 1882) and top corporate placements (Big 4: Deloitte, EY, PwC, KPMG, Goldman Sachs).
- Christ (Deemed to be University), Central Campus (Hosur Road), Bannerghatta, & Yeshwanthpur: Renowned nationally for BBA (Finance, Marketing, Business Analytics), B.Com (Hons, Professional, Strategic Finance with ACCA/CIMA integration), and MBA. Holistic grooming and vibrant campus.
- Mount Carmel College (Autonomous) (MCC), Vasanth Nagar: Premier autonomous women's institution, NAAC A+, highly prestigious for B.Com, BBA, Economics, and Financial Accounting.
- Kristu Jayanti College (Autonomous) (KJC), Kothanur: NAAC A++ accredited, recognized for B.Com (ACCA / CMA integrated), BBA, and MBA with stellar placement records.
- CMS - Center for Management Studies, Jain (Deemed-to-be University), Lalbagh Road: Specialized in BBA (Corporate, Event Management, Digital Marketing) and B.Com (Honours).

** Top Postgraduate Business Schools (MBA / PGDM):**
- Indian Institute of Management Bangalore (IIM Bangalore / IIMB), Bannerghatta Road: India's #2 NIRF B-School, EQUIS accredited global institution. Offers flagship 2-year PGP (MBA), EPGP, and Ph.D.
- SIBM Bengaluru (Symbiosis Institute of Business Management), Electronic City: Renowned for MBA in Marketing, Finance, HR, and Operations.
- XIME (Xavier Institute of Management & Entrepreneurship), Electronic City: Top private PGDM B-school founded by Prof. J. Philip.
- Alliance School of Business (Alliance University), Anekal: Offers BBA, B.Com, and AMBA-accredited MBA.
Admissions: Undergrad through CUET/Institutional Entrance/Merit; MBA through CAT, GMAT, XAT, NMAT, SNAP, or CMAT.`;

    const artsKb = `### Knowledge Base: Bangalore (Bengaluru) Arts, Humanities, & Social Sciences Colleges
If a student asks for Arts, Humanities, Social Sciences, BA, MA, Law, or Journalism degrees in or around Bangalore, you MUST recommend these top institutions:
** Top Arts, Humanities & Law Universities / Colleges:**
- National Law School of India University (NLSIU), Nagarbhavi: India's #1 Law School (NIRF Rank 1), pioneer of 5-year integrated BA LLB (Hons), LLM, and Master's in Public Policy (MPP).
- St. Joseph's University (SJU), Lalbagh Road: Historic Jesuit university offering top-tier BA and MA in Journalism & Mass Communication, English Literature, Psychology, Political Science, and Economics.
- Christ (Deemed to be University), Hosur Road: Premier department of Humanities & Social Sciences. Offers BA in Psychology, Media Studies, English, History, International Relations, and Performing Arts.
- Mount Carmel College (MCC), Vasanth Nagar: Renowned for BA programs in Psychology, English Literature, Journalism, and Political Science.
- Azim Premji University (APU), Sarjapur Road: World-class philanthropic university dedicated to social sciences, offering BA in Humanities, Economics, Education, and Development Studies.
- Jyoti Nivas College (Autonomous), Koramangala: Premier women's college for BA in Journalism, Psychology, and Communicative English.
- Bangalore University, Jnana Bharathi Campus: Major public university campus offering postgraduate MA, M.Phil, and PhD across linguistic and humanities disciplines.`;

    const csKb = `### Knowledge Base: Bangalore (Bengaluru) CS, AI, & Software Development Colleges
If a student asks for Computer Science, CS, AI, Machine Learning, Data Science, or Software Development colleges in Bangalore (The Silicon Valley of India), you MUST recommend these top institutions:
** Premier CS & AI Tech Hubs:**
- Indian Institute of Science (IISc Bangalore): Department of CSA (Computer Science and Automation) and CDS (Computational and Data Sciences). India's gold standard for AI, Deep Learning, Quantum Computing, and Algorithms research.
- IIIT Bangalore (IIIT-B), Electronic City: Specializes exclusively in IT, CSE, Data Science, and AI. Direct pipelines to global tech leaders (Google, Apple, Microsoft, NVIDIA, Adobe). Average placement package ~25+ LPA.
- RV College of Engineering (RVCE), Mysore Road: Karnataka's top engineering choice for B.Tech in Computer Science, AI & Machine Learning, Data Science, Information Science. Placements match top NITs.
- PES University (PESU), Ring Road: Leading computer science curriculum, specialized B.Tech in CSE with tracks in Cloud Computing, AI & Robotics, Cyber Security, and Big Data. High numbers of students recruited by FAANG and unicorn tech firms.
- BMS College of Engineering (BMSCE), Basavanagudi: Highly reputed autonomous CS & IT departments, tech clubs, IEEE student branch, and robust hackathon culture.
- M.S. Ramaiah Institute of Technology (MSRIT): Renowned for B.Tech in CSE, AI & Data Science, and MCA.
- Christ University & Kristu Jayanti College: Top colleges for BCA and MCA with industry-ready coding curriculums.
** Bangalore Advantage:** Students gain direct access to 400+ Fortune 500 tech centers, 40+ startup unicorns, high-paying tech internships, and national open-source hackathons.`;

    const entKb = `### Knowledge Base: Bangalore (Bengaluru) Entrepreneurship, Startups, & Business Colleges
If a student asks for Entrepreneurship, Startups, Venture Capital, Incubators, MBA, or Business incubation in Bangalore (Startup Capital of India), you MUST recommend these top institutions and ecosystems:
** Top Incubators & Entrepreneurship Centres:**
- NSRCEL at IIM Bangalore (Bannerghatta Road): India's premier startup incubation centre, supporting 1000+ ventures, offering mentoring, seed funding, and corporate partnerships across sectors (FinTech, HealthTech, Social Ventures).
- PES University Centre for Innovation & Entrepreneurship (CIE): Student-first startup accelerator with dedicated maker spaces, angel investor pitch days, and seed grants.
- RVCE Center for Innovation, Technology Transfer and Entrepreneurship (CITTE): Supports student tech spin-offs, patent filings, and prototype development.
- DERBI Foundation (Dayananda Sagar Institutions): DST-supported technology business incubator focusing on healthcare, smart manufacturing, and IoT startups.
- IIIT-B Innovation Centre: Deep tech startup incubator with high focus on AI, semiconductor, and cybersecurity startups.
- Jain University - Chenraj Roychand Center for Entrepreneurship (CRCE): Has incubated over 100 successful startups.
** Bangalore Startup Corridors & Grants:**
- Startup Hotspots: Koramangala, HSR Layout, and Indiranagar (the highest density of startup founders and venture capital firms in Asia).
- Karnataka Government Schemes: K-TECH (Karnataka Innovation Technology Society), Idea2PoC grants, and ELEVATE 100 funding up to ₹50 Lakhs for early-stage student startups.`;

    const rvceKb = `\n\n### Knowledge Base: RV College of Engineering (RVCE, Bangalore) Complete Guide
If a student asks specifically about RVCE Bangalore, you MUST provide these accurate details:
** Courses Offered:**
- Undergraduate (B.E. / B.Tech - 4 Years): Computer Science & Engineering (CSE), Artificial Intelligence & Machine Learning (AI/ML), Information Science & Engineering (ISE), Electronics & Communication (ECE), Aerospace Engineering, Mechanical, Civil, Electrical, Biotechnology.
- Postgraduate: M.Tech in Software Engineering, VLSI, Computer Science, and MCA (Master of Computer Applications).
** Admissions & Eligibility:**
- Karnataka Students: Through KCET (Karnataka Common Entrance Test) - requires top ranks (CSE generally closes within Top 500-1000 ranks in KCET).
- Non-Karnataka / All-India: Through COMEDK UGET (CSE cutoff generally closes under Rank 400-800).
- Management Quota: Direct admissions based on 10+2 marks with higher tuition fees.
** Placements & Highlights:**
- Average Package: ₹12 - 16 LPA for CS/IS branches. Highest Packages: Above ₹55 - 62 LPA.
- Top Recruiters: Microsoft, Amazon, Google, Cisco, Intel, Qualcomm, Texas Instruments, Goldman Sachs.
- Location: Mysore Road, RV Vidyaniketan, Bangalore.`;

    const christKb = `\n\n### Knowledge Base: Christ (Deemed to be University, Bangalore) Complete Guide
If a student asks specifically about Christ University Bangalore, you MUST provide these accurate details:
** Campuses in Bangalore:**
- Central Campus (Hosur Road, Dairy Circle) - Historic main campus.
- Bannerghatta Road Campus (BGR) - Focuses on business, arts, and humanities.
- Yeshwanthpur Campus & Kengeri Campus (Engineering & Architecture).
** Signature Programs:**
- Commerce & Management: BBA (Finance, Marketing, Analytics), BBA Honours, B.Com (Regular, Strategic Finance with ACCA, Professional), MBA (Dual Specialization).
- Humanities & Arts: BA in Psychology, Media Studies, English, Economics, Journalism.
- Tech & Sciences: BCA, B.Sc in Data Science, Computer Science, Economics & Analytics.
- Law: BA LLB (Hons), BBA LLB (Hons) (5-year integrated).
** Admissions & Selection:**
- Admission via Christ University Entrance Test (CUET) followed by Micro-Presentation (MP), Personal Interview (PI), and past academic performance.
- Applications open around December/January for the upcoming academic year in multiple rounds.`;

    const pesKb = `\n\n### Knowledge Base: PES University (PESU, Bangalore) Complete Guide
If a student asks specifically about PES University Bangalore, you MUST provide these accurate details:
** Campuses:**
- Ring Road (RR) Campus: 100-Feet Ring Road, BSK 3rd Stage - Flagship campus for engineering and management.
- Electronic City (EC) Campus: Hosur Road - Major hub for computer science and tech programs.
** Undergraduate Programs:**
- B.Tech (4 Years): CSE, AI & ML, ECE, Mechanical, Biotechnology.
- Management & Commerce: BBA, BBA in Business Analytics, B.Com (Hons).
- Computer Applications & Law: BCA, B.Des, B.Arch, BA LLB, BBA LLB.
** Admissions & Exams:**
- PESSAT (All India Online Entrance Test conducted by PES University).
- KCET (For Karnataka domicile students through KEA counseling).
** Highlights & Placements:**
- Tier-1 Placements: Microsoft, Atlassian, Morgan Stanley, Cisco, Amazon.
- Average Package: ~₹11-13 LPA for CS; Top Package: ₹60+ LPA.
- CNR Rao Merit Scholarships: Top 20% students receive tuition fee waivers each semester.`;

    // Select the appropriate knowledge base based on counselorId
    let selectedKb = "";
    switch (counselorId) {
      case '1':
        selectedKb = engKb + rvceKb + pesKb;
        break;
      case '2':
        selectedKb = medKb;
        break;
      case '3':
        selectedKb = comKb + christKb;
        break;
      case '4':
        selectedKb = artsKb + christKb;
        break;
      case '5':
        selectedKb = csKb + rvceKb + pesKb;
        break;
      case '6':
        selectedKb = entKb + pesKb + comKb;
        break;
      default:
        selectedKb = engKb + medKb + comKb;
    }

    const systemPrompt = `You are a highly specialized ${specificRole} in Bangalore (Bengaluru), India. Your ONLY job is to provide expert guidance in this specific field, with deep and accurate knowledge of Bangalore colleges, universities, admission exams (KCET, COMEDK, PESSAT, NEET, CUET, CAT), tech parks, and startup ecosystems. Do NOT ask the user which field they are interested in, because you already know they came to you for ${specificRole} advice! Respond professionally, encouragingly, and natively adapt to the user's language (English, Hindi, Kannada, or Hinglish). Keep responses well-structured and concise.

${selectedKb} `;

    // Convert messages to Gemini format
    const contents = [
      { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt} ` }] },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    let text = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({ contents });
        const response = await result.response;
        text = response.text();
        if (text) {
          console.log(`Successfully generated chat response using ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} attempt failed: ${err?.message || err}`);
        lastError = err;
      }
    }

    if (!text) {
      throw lastError || new Error("Empty response from Gemini models");
    }

    // Format response as Vercel AI Data Stream Protocol
    return new Response(`0:${JSON.stringify(text)} \n`, {
      headers: {
        "Content-Type": "text/plain",
        "x-vercel-ai-data-stream": "v1"
      }
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    const errorMessage = error?.message || error?.toString() || 'Chat failed';
    const isApiKeyError = errorMessage.includes('API_KEY_INVALID') || 
                          errorMessage.includes('API key not valid') || 
                          errorMessage.includes('pass a valid API key') ||
                          error?.status === 400;

    const friendlyError = isApiKeyError
      ? "Google Gemini API key is invalid or expired. Please update GOOGLE_GENERATIVE_AI_API_KEY in your .env file with a valid key from Google AI Studio (https://aistudio.google.com/)."
      : errorMessage;

    return new Response(JSON.stringify({
      error: friendlyError,
      isApiKeyError,
      details: errorMessage
    }), {
      status: isApiKeyError ? 401 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
