'use client';

import { ThemeProvider } from 'next-themes';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    heroTitle: "AI-Powered Recruitment Threat Intelligence",
    heroSubtitle: "Analyze suspicious job postings, detect scam patterns, and protect job seekers from recruitment fraud in seconds.",
    inputLabel: "Paste Job Description",
    inputPlaceholder: "Paste suspicious job posting, recruiter message, or job description here...",
    analyzeBtn: "Analyze Posting",
    analyzingBtn: "Analyzing...",
    reportTitle: "Threat Intelligence Report",
    readyTitle: "Ready for Analysis",
    readyDesc: "Paste a job description on the left to evaluate it for potential recruitment fraud and manipulation.",
    scamLabel: "Scam Probability",
    trustLabel: "Trust Score",
    summaryTitle: "AI Executive Summary",
    classificationTitle: "Threat Classification",
    manipulationTitle: "Psychological Manipulation",
    redFlagsTitle: "Detected Red Flags",
    noRedFlags: "No critical red flags detected.",
    compAnalysis: "Compensation Analysis",
    recAction: "Recommended Action",
    transAnalysis: "Entity Transparency Assessment",
    urgency: "Urgency Pressure",
    greed: "Greed Bait",
    authority: "Authority Pressuring",
    transRisk: "Transparency Obfuscation",
    systemOnline: "System Online",
    recentThreats: "Recent Threat Detections",
    demoData: "Demonstration Data",
    tryThis: "Try this example",
  },
  id: {
    heroTitle: "Intelijen Ancaman Rekrutmen Bertenaga AI",
    heroSubtitle: "Analisis lowongan kerja mencurigakan, deteksi pola penipuan, dan lindungi pencari kerja dari kecurangan rekrutmen dalam hitungan detik.",
    inputLabel: "Tempel Deskripsi Pekerjaan",
    inputPlaceholder: "Tempel lowongan mencurigakan, pesan rekruter, atau deskripsi pekerjaan di sini...",
    analyzeBtn: "Analisis Lowongan",
    analyzingBtn: "Menganalisis...",
    reportTitle: "Laporan Intelijen Ancaman",
    readyTitle: "Siap untuk Analisis",
    readyDesc: "Tempel deskripsi pekerjaan di sebelah kiri untuk mengevaluasinya dari potensi penipuan dan manipulasi rekrutmen.",
    scamLabel: "Probabilitas Penipuan",
    trustLabel: "Skor Kepercayaan",
    summaryTitle: "Ringkasan Eksekutif AI",
    classificationTitle: "Klasifikasi Ancaman",
    manipulationTitle: "Manipulasi Psikologis",
    redFlagsTitle: "Bendera Merah Terdeteksi",
    noRedFlags: "Tidak ada bendera merah kritis yang terdeteksi.",
    compAnalysis: "Analisis Kompensasi",
    recAction: "Tindakan yang Disarankan",
    transAnalysis: "Penilaian Transparansi Entitas",
    urgency: "Tekanan Urgensi",
    greed: "Umpan Keserakahan",
    authority: "Tekanan Otoritas",
    transRisk: "Obfuskasi Transparansi",
    systemOnline: "Sistem Online",
    recentThreats: "Deteksi Ancaman Terbaru",
    demoData: "Data Demonstrasi",
    tryThis: "Coba contoh ini",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('ghostjob_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ghostjob_lang', lang);
  };

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
