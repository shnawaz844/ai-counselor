"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Headphones, Zap, ArrowLeft, Sparkles, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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

export default function DashboardPage() {
  const [counselors] = useState<Counselor[]>(COUNSELORS);

  return (
    <div className="min-h-screen bg-[#070708] text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 bg-[#0A0A0A]/95 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <EmversityLogo subtitle="AI Counselor" className="h-6 md:h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full text-xs sm:text-sm">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Home
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full text-xs sm:text-sm">
                History
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section Banner (Matches teacher-ai dashboard) */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#111114] via-[#17171C] to-[#121216] p-7 md:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8654A] to-transparent" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8654A]/20 border border-[#E8654A]/30 text-[#FF8566] text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Emversity Career Advisory Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Student Career Guidance
              </h1>
              <p className="text-white/70 text-sm md:text-base mt-2 leading-relaxed">
                Connect with 24/7 AI-powered advisors for personalized degree program selection, internship pathways, and interview readiness.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[130px] text-center">
                <p className="text-[11px] text-white/50 font-medium">Advisors</p>
                <p className="text-2xl font-bold text-white mt-0.5">{COUNSELORS.length}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[130px] text-center">
                <p className="text-[11px] text-white/50 font-medium">Modes</p>
                <p className="text-2xl font-bold text-[#FF8566] mt-0.5">Chat & Voice</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[130px] text-center">
                <p className="text-[11px] text-white/50 font-medium">Availability</p>
                <p className="text-2xl font-bold text-emerald-400 mt-0.5">24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Counselors Grid (Matches Reference Screenshot Format) */}
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Select Your Advisor</h2>
            <p className="text-sm text-white/60 mt-1">Start with real-time interactive voice consultation or deep-dive text chat.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => {
              return (
                <div
                  key={counselor.id}
                  className="group relative flex flex-col justify-end overflow-hidden rounded-[26px] bg-[#0A0A0A] border border-white/10 hover:border-[#E8654A]/60 shadow-2xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(232,101,74,0.25)] hover:-translate-y-1 min-h-[420px] w-full"
                >
                  {/* Warm Ambient Spotlight in background */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#C8654A]/35 via-[#98230a]/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute top-1/4 left-0 w-32 h-32 bg-[#E8654A]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Left Frosted Play Button */}
                  <Link
                    href={`/voice/new?counselor=${counselor.id}`}
                    className="absolute top-3.5 left-3.5 z-20 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[#E8654A] group-hover:border-[#E8654A] transition-all duration-300"
                  >
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </Link>

                  {/* Top Right Specialty Badge */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent" />
                  </div>

                  {/* Card Content Overlay */}
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
                        Emversity Career Track
                      </span>
                    </div>

                    {/* Stat + Action Buttons */}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070708] py-8 text-center text-xs text-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} Emversity Platform. An Approved Training Partner of NSDC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
