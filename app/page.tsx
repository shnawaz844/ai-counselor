"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Headphones, ChevronDown, Menu, Sparkles, GraduationCap, ArrowRight, ShieldCheck, Stethoscope, Briefcase, Code, Compass, Play } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import EmversityLogo from "@/components/EmversityLogo";

interface Counselor {
  id: string;
  name: string;
  specialization: string;
  description: string;
  avatar_url: string;
}

const COUNSELORS: Counselor[] = [
  {
    id: "1",
    name: "Engineering Career Advisor",
    specialization: "Engineering, Technology, IT",
    description: "Expert guidance for IIT, NIT, tech career tracks, and software industry pathways.",
    avatar_url: "/counselors/male3.png",
  },
  {
    id: "2",
    name: "Medical & Healthcare Counselor",
    specialization: "Allied Health, Nursing, Medical",
    description: "Guidance for hospital internships, Allied Health degree programs, and clinical careers.",
    avatar_url: "/counselors/medical.jpg",
  },
  {
    id: "3",
    name: "Commerce & Business Specialist",
    specialization: "Commerce, Business, Finance",
    description: "Career pathways for corporate management, banking, financial analytics, and commerce.",
    avatar_url: "/counselors/commerce.jpg",
  },
  {
    id: "4",
    name: "Arts & Humanities Guide",
    specialization: "Arts, Media, Social Sciences",
    description: "Personalized advice for communication, public administration, and creative careers.",
    avatar_url: "/counselors/cs.png",
  },
  {
    id: "5",
    name: "Computer Science & AI Expert",
    specialization: "CS, AI, Cloud & Data",
    description: "High-impact mentorship for modern AI engineering, fullstack development, and tech placement.",
    avatar_url: "/counselors/cs.jpg",
  },
  {
    id: "6",
    name: "Hospitality & Management Coach",
    specialization: "Hospitality, Tourism, Aviation",
    description: "Global career training for international luxury hospitality, airlines, and service leadership.",
    avatar_url: "/counselors/male4.png",
  },
];

export default function HomePage() {
  const [counselors] = useState<Counselor[]>(COUNSELORS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const counselorsRef = useRef<HTMLDivElement>(null);

  const scrollToCounselors = () => {
    counselorsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#E8654A]/30 selection:text-white overflow-x-hidden">
      {/* Ambient background glow matching Emversity */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] bg-gradient-to-b from-[#98230a]/25 via-[#E8654A]/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] bg-[#E8654A]/10 blur-[150px] rounded-full" />
      </div>

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#C8654A] via-[#D85A3A] to-[#C8654A] text-white text-center py-2 px-4 text-xs font-semibold tracking-wide relative overflow-hidden z-50">
        <span className="flex items-center justify-center gap-2">
          <GraduationCap className="w-4 h-4" />
          <span>Emversity Career Skilling · Admissions & Counseling Open</span>
          <button onClick={scrollToCounselors} className="underline hover:no-underline font-bold ml-1 cursor-pointer">
            Explore Advisors →
          </button>
        </span>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 w-full border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <EmversityLogo subtitle="AI Counselor" className="h-6 md:h-7" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-5 text-sm font-medium transition-colors">
                History
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-5 text-sm font-medium transition-colors">
                Profile
              </Button>
            </Link>
            <Button
              onClick={scrollToCounselors}
              className="rounded-full px-6 bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white font-bold text-xs hover:opacity-95 shadow-md shadow-[#E8654A]/30 border-0"
            >
              Start Consultation
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#0E0E12] border-b border-white/10 p-5 flex flex-col gap-3">
            <Link href="/history" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 h-11 rounded-xl">
                History
              </Button>
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 h-11 rounded-xl">
                Profile
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 md:pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-semibold text-white/90 tracking-wide mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E8654A] animate-pulse" />
          <span>India&apos;s Career Skilling & Employment Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-1.5px] md:tracking-[-2.5px] leading-[1.08] text-white max-w-4xl mx-auto mb-6">
          From Classroom <br />
          <span className="bg-gradient-to-r from-[#f26a3d] via-[#f97316] to-[#c79f33] bg-clip-text text-transparent">
            to Career Clarity.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
          Personalized 1-on-1 AI career counseling tailored to your strengths, academic passions, and industry ambitions in Healthcare, Technology, and Global Pathways.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={scrollToCounselors}
            size="lg"
            className="h-13 px-8 rounded-full text-base font-bold bg-gradient-to-r from-[#E8654A] to-[#F97316] hover:opacity-95 text-white shadow-[0_0_30px_rgba(232,101,74,0.4)] transition-all hover:scale-105 active:scale-95 border-0 cursor-pointer"
          >
            <span>Choose Your Counselor</span>
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
          <Link href="/history">
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 rounded-full text-base font-bold border-white/30 text-white hover:bg-white/10 hover:text-white transition-all hover:scale-105"
            >
              Past Guidance Sessions
            </Button>
          </Link>
        </div>

        <p className="text-xs text-white/50 mt-6 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#E8654A]" />
          Industry Skilling by Emversity · Approved Training Partner of NSDC
        </p>

        {/* Key Domain Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 max-w-4xl mx-auto text-left">
          <div className="bg-[#111114] p-5 rounded-3xl border border-white/10 shadow-lg flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#E8654A]/20 text-[#FF8566] shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Healthcare & Allied</h4>
              <p className="text-xs text-white/60 mt-1">Direct hospital linkages, nursing & diagnostic careers.</p>
            </div>
          </div>

          <div className="bg-[#111114] p-5 rounded-3xl border border-white/10 shadow-lg flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#E8654A]/20 text-[#FF8566] shrink-0">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Technology & Engineering</h4>
              <p className="text-xs text-white/60 mt-1">Fullstack, AI, IT engineering & placement prep.</p>
            </div>
          </div>

          <div className="bg-[#111114] p-5 rounded-3xl border border-white/10 shadow-lg flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Global Career Tracks</h4>
              <p className="text-xs text-white/60 mt-1">Work abroad readiness & international certification pathways.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Counselors Grid (Matches Reference Screenshot Format) */}
      <main ref={counselorsRef} className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-white/10">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8654A]/15 border border-[#E8654A]/30 text-[#FF8566] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E8654A]" />
            <span>Interactive AI Advisors</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Select Your Emversity Career Counselor
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl">
            Choose an AI mentor for real-time voice consultations or text-based roadmap generation.
          </p>
        </div>

        {/* Redesigned Card Grid Matching the Reference Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselors.map((counselor) => {
            return (
              <div
                key={counselor.id}
                className="group relative flex flex-col justify-end overflow-hidden rounded-[26px] bg-[#0A0A0A] border border-white/10 hover:border-[#E8654A]/60 shadow-2xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(232,101,74,0.25)] hover:-translate-y-1 min-h-[420px] w-full"
              >
                {/* Warm Ambient Spotlight in background (Matches Emversity aesthetic) */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#C8654A]/35 via-[#98230a]/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute top-1/4 left-0 w-32 h-32 bg-[#E8654A]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Left Frosted Play Button (Matches screenshot) */}
                <Link
                  href={`/voice/new?counselor=${counselor.id}`}
                  className="absolute top-3.5 left-3.5 z-20 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[#E8654A] group-hover:border-[#E8654A] transition-all duration-300"
                >
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </Link>

                {/* Top Right Track Badge */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/85 tracking-wide">
                    {counselor.specialization.split(",")[0]}
                  </span>
                </div>

                {/* Full Portrait Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={counselor.avatar_url}
                    alt={counselor.name}
                    fill
                    className="object-cover object-top filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Seamless bottom fade gradient into solid dark card base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent" />
                </div>

                {/* Card Content Overlay (Matches screenshot typography & layout) */}
                <div className="relative z-20 p-5 pt-10 flex flex-col justify-end">
                  <h3 className="font-bold text-lg md:text-xl text-white tracking-tight leading-snug group-hover:text-[#FF8566] transition-colors">
                    {counselor.name}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 mt-1 font-normal leading-relaxed">
                    {counselor.description}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8654A]" />
                    <span className="text-[11px] font-medium text-white/85 tracking-wide">
                      Emversity Career Advisory Track
                    </span>
                  </div>

                  {/* Stat + Consultation Actions */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-end mb-3 text-[11px] text-white/60">
                      <span className="text-[#FF8566] font-semibold">Live Interactive</span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/chat/new?counselor=${counselor.id}`} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-8 rounded-full text-xs font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#E8654A]" />
                          Chat
                        </Button>
                      </Link>
                      <Link href={`/voice/new?counselor=${counselor.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full h-8 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E8654A] to-[#F97316] text-white hover:opacity-95 shadow-md shadow-[#E8654A]/25 border-0"
                        >
                          <Headphones className="w-3.5 h-3.5 mr-1" />
                          Voice Call
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070708] py-8 px-6 text-xs text-white/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <EmversityLogo subtitle="AI Counselor" className="h-6" />
          <p>© {new Date().getFullYear()} Emversity Platform. An Approved Training Partner of NSDC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
