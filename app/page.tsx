'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/Providers';
import { ShieldAlert, Activity, ShieldCheck, AlertTriangle, Moon, Sun, Globe } from 'lucide-react';

interface AnalysisResult {
  job_title: string;
  company_name: string;
  scam_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  trust_score: number;
  analysis_confidence: number;
  threat_classification: string;
  summary: string;
  red_flags: string[];
  positive_signals: string[];
  manipulation_tactics: string[];
  transparency_analysis: string;
  salary_realism: string;
  recommended_action: string;
  heatmap: {
    urgency: number;
    greed_bait: number;
    authority_pressure: number;
    transparency_risk: number;
  };
}

const DEMOS: Record<string, AnalysisResult> = {
  high_risk: {
    job_title: "Senior Remote Product Architect",
    company_name: "Nexus Global Solutions (Unregistered)",
    scam_probability: 84,
    risk_level: "Critical",
    trust_score: 12,
    analysis_confidence: 95,
    threat_classification: "Data Collection Scam",
    summary: "The posting exhibits significant patterns of psychological manipulation, including false urgency and inflated compensation structures designed to harvest personal sensitive data. Missing verified company registration and reliance on unsecured messaging apps highly indicate fraudulent intent.",
    red_flags: [
      "Unsecured communication (WhatsApp/Telegram only)",
      "Mandatory 'Equipment Deposit' required upon signing",
      "Official company domain registration < 30 days old",
      "Interview process bypassed technical verification"
    ],
    positive_signals: [],
    manipulation_tactics: [
      "Urgency Pressure: 'Position closes in 4 hours. Immediate start.'",
      "Love Bombing: 'You are the perfect candidate without even a screening.'"
    ],
    transparency_analysis: "Critical Data Obfuscation Detected. No physical address, verifiable LinkedIn company presence, or registered business entity found.",
    salary_realism: "$240k - $310k USD/Year (+312% ABOVE MARKET)",
    recommended_action: "IMMEDIATE CEASE & BLOCK",
    heatmap: { urgency: 92, greed_bait: 88, authority_pressure: 65, transparency_risk: 95 }
  },
  medium_risk: {
    job_title: "Marketing Executive (Immediate Hiring)",
    company_name: "Global Visionary Partners",
    scam_probability: 65,
    risk_level: "Medium",
    trust_score: 45,
    analysis_confidence: 82,
    threat_classification: "MLM Recruitment",
    summary: "While technically a registered business, the employment terms heavily reflect a Multi-Level Marketing (MLM) or commission-only structure. The description relies on exaggerated earning potentials and minimizes actual day-to-day responsibilities.",
    red_flags: [
      "Vague job duties focusing purely on 'unlimited earning'",
      "Requires attendance at uncompensated training seminars",
      "No guaranteed base salary mentioned"
    ],
    positive_signals: ["Registered business entity", "Public physical office address"],
    manipulation_tactics: [
      "Greed Bait: 'Be your own boss and earn a six-figure income in 3 months!'"
    ],
    transparency_analysis: "Company exists but intentionally obfuscates the commission-only nature of the compensation plan.",
    salary_realism: "'Unlimited Potential' (Highly risky, 0 guaranteed base)",
    recommended_action: "PROCEED WITH CAUTION - VERIFY BASE PAY",
    heatmap: { urgency: 40, greed_bait: 75, authority_pressure: 30, transparency_risk: 60 }
  },
  low_risk: {
    job_title: "Frontend Software Engineer",
    company_name: "TechFlow Inc.",
    scam_probability: 8,
    risk_level: "Low",
    trust_score: 92,
    analysis_confidence: 96,
    threat_classification: "Likely Legitimate",
    summary: "The job posting represents a standard, legitimate corporate hiring req. Responsibilities are clearly defined, the company holds verified history, and benefits/salary bands are shared transparently.",
    red_flags: [],
    positive_signals: [
      "Clearly defined technical requirements",
      "Standard multi-step interview process",
      "Verified corporate email address",
      "Verifiable company LinkedIn and public founders"
    ],
    manipulation_tactics: [],
    transparency_analysis: "Excellent transparency. Salary band ($110k-130k) listed, clear reporting structure, standard benefits package documented.",
    salary_realism: "Highly realistic, closely matching standard market rates for the role.",
    recommended_action: "SAFE TO APPLY",
    heatmap: { urgency: 10, greed_bait: 5, authority_pressure: 0, transparency_risk: 5 }
  }
};

const loadingMessages = [
  '> [SYS] Initiating linguistic analysis...',
  '> [WARN] Scanning for generic corporate jargon...',
  '> [WARN] Verifying unrealistic salary bands...',
  '> [SYS] Cross-referencing digital footprint...',
  '> [ALERT] Calculating final threat vector...'
];

export default function GhostJobPage() {
  const [jobPosting, setJobPosting] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loadingText, setLoadingText] = useState('> [SYS] Initiating linguistic analysis...');
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isAutoPlaying) return;

    let analyzeTimeout: NodeJS.Timeout;
    let nextDemoTimeout: NodeJS.Timeout;

    const demoKeys = Object.keys(DEMOS);
    const demoData = DEMOS[demoKeys[autoPlayIndex]];

    const prefix = language === 'id' ? '[Data Contoh Otomatis:' : '[Auto-Demo Source Data:';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJobPosting(`${prefix} ${demoData.job_title} at ${demoData.company_name}]`);
     
    setResult(null);
     
    setIsAnalyzing(true);
     
    setError('');

    // Wait 2s for analysis loading simulation
    analyzeTimeout = setTimeout(() => {
      setResult(demoData);
      setIsAnalyzing(false);

      // Wait 10s before proceeding to the next demo
      nextDemoTimeout = setTimeout(() => {
        setAutoPlayIndex((prev) => (prev + 1) % demoKeys.length);
      }, 10000);
    }, 2000);

    return () => {
      clearTimeout(analyzeTimeout);
      clearTimeout(nextDemoTimeout);
    };
  }, [mounted, isAutoPlaying, autoPlayIndex, language]);

  const stopAutoPlay = () => setIsAutoPlaying(false);

  useEffect(() => {
    if (!isAnalyzing) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[i]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleDemoClick = (demoKey: string) => {
    stopAutoPlay();
    const demoData = DEMOS[demoKey];
    setJobPosting(`[Demo Source Data for: ${demoData.job_title} at ${demoData.company_name}]`);
    setResult(null);
    setIsAnalyzing(true);
    setError('');
    
    setTimeout(() => {
      setResult(demoData);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Auto-analyze manual input
  useEffect(() => {
    if (!mounted || isAutoPlaying || !jobPosting.trim()) return;

    const timeout = setTimeout(async () => {
      setIsAnalyzing(true);
      setError('');
      setResult(null);

      try {
        const payload = { jobPosting: jobPosting.trim(), language };
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Intelligence extraction failed.');
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [jobPosting, mounted, isAutoPlaying, language]);

  return (
    <div className="font-body-md min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="grid-scan-overlay"></div>
        {/* TopNavBar */}
        <nav className="bg-surface/80 backdrop-blur-md font-headline-sm text-headline-sm text-mono-label border-b border-outline-variant shadow-[0_0_15px_rgba(76,215,246,0.1)] fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-cyan">
                    <ShieldAlert className="w-5 h-5 text-primary" />
                </div>
                <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">GhostJob AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-mono-label text-mono-label">
                <a className="text-primary border-b-2 border-primary pb-1 active:scale-95 transition-transform" href="#scanner-section">Analyzer</a>
                <a className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="#">Forensics</a>
                <a className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="#">Docs</a>
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden lg:inline-flex text-secondary-fixed font-mono-label text-mono-label items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                    System Status: Optimal
                </span>
                
                {mounted && (
                    <div className="flex gap-2 text-on-surface-variant items-center">
                        <div className="relative">
                            <button 
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-highest transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {isLangMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                                    <motion.div 
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-36 bg-surface-container-highest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden text-sm"
                                    >
                                    <button 
                                        onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 font-medium transition-colors ${language === 'en' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-high'}`}
                                    >
                                        English
                                    </button>
                                    <button 
                                        onClick={() => { setLanguage('id'); setIsLangMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 font-medium transition-colors ${language === 'id' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-high'}`}
                                    >
                                        Indonesia
                                    </button>
                                    </motion.div>
                                </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button 
                            onClick={toggleTheme}
                             className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-highest transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        </nav>

        <main className="flex-grow pt-[80px] z-10 relative">
            {/* Hero Section */}
            <section className="min-h-[80vh] flex items-center px-margin-desktop py-12 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
                    <div className="space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 border border-outline-variant rounded-full px-3 py-1 font-mono-data text-mono-data text-primary glow-cyan bg-surface/50">
                            <Activity className="w-4 h-4 animate-pulse" />
                            DEFENSE ENGINE ACTIVE
                        </div>
                        <h1 className="font-display-lg text-[40px] md:text-display-lg font-bold text-on-surface leading-tight">
                            Exposing the Ghost in the Machine: <br/>
                            <span className="text-primary flicker-text">Job Threat Intelligence.</span>
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                            {language === 'id' ? 'Pasar kerja modern tercemar oleh lowongan fiktif, jebakan pencurian identitas, dan penipuan canggih. Gunakan telemetri kami untuk memvalidasi lowongan sebelum melamar.' : 'The modern job market is polluted with phantom listings, identity harvesting traps, and sophisticated scams. Deploy advanced telemetry to validate opportunities before you engage.'}
                        </p>
                        <a href="#scanner-section" className="bg-primary text-[#000000] font-headline-sm text-headline-sm px-8 py-4 rounded hover:bg-primary-fixed transition-colors active:scale-95 glow-cyan-active inline-flex items-center gap-2 transition-all">
                            {language === 'id' ? 'Analisis Ancaman Sekarang' : 'Analyze Threat Now'}
                        </a>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="relative glass-panel shimmer-effect rounded-xl border border-outline-variant p-6 z-10 shadow-2xl">
                        <div className="scanner-line"></div>
                        <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
                            <span className="font-mono-label text-mono-label text-on-surface-variant">THREAT_REPORT_CARD_v2.4</span>
                            <ShieldAlert className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
                            {/* Circular Gauge */}
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" className="text-outline-variant/30" strokeWidth="8"></circle>
                                    <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" className="gauge-circle text-tertiary" strokeDasharray="282.7" strokeDashoffset="62.19" strokeWidth="8" strokeLinecap="round"></circle>
                                </svg>
                                <div className="text-center">
                                    <div className="font-headline-md text-headline-md text-tertiary">78</div>
                                    <div className="font-mono-label text-[10px] text-on-surface-variant">RISK SCORE</div>
                                </div>
                            </div>

                            <div className="space-y-4 flex-grow w-full">
                                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                                    <span className="font-mono-data text-mono-data text-on-surface-variant">TARGET</span>
                                    <span className="font-mono-data text-mono-data text-on-surface">Senior F/S Engineer</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                                    <span className="font-mono-data text-mono-data text-on-surface-variant">ORIGIN</span>
                                    <span className="font-mono-data text-mono-data text-on-surface">LinkedIn_0x8f2a</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-data text-mono-data text-on-surface-variant">STATUS</span>
                                    <span className="font-mono-label text-[10px] bg-tertiary/10 text-tertiary px-2 py-1 rounded ai-pulse">HIGH PROBABILITY GHOST</span>
                                </div>
                            </div>
                        </div>

                        {/* Telemetry Data */}
                        <div className="bg-[#020617] rounded p-4 border border-outline-variant font-mono-data text-[12px] text-on-surface-variant h-32 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617] pointer-events-none z-10"></div>
                            <div className="space-y-2 opacity-90 font-mono flex flex-col">
                                <p className="text-primary">&gt; [SYS] Initiating linguistic analysis...</p>
                                <p className="text-tertiary">&gt; [WARN] Generic corporate jargon detected (freq: 0.84)</p>
                                <p className="text-tertiary">&gt; [WARN] Unrealistic salary band identified (+45% market avg)</p>
                                <p className="text-error font-bold">&gt; [ALERT] Pattern matches known identity harvesting template.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="px-margin-desktop py-24 bg-surface-container-lowest border-y border-outline-variant">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-4">The Job Market Has Been Compromised.</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                            Traditional job boards operate on volume, not validation. Our forensic engine identifies the vectors used to exploit job seekers.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface p-6 rounded-lg border border-outline-variant interactive-card group">
                            <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-tertiary/20 transition-all duration-300">
                                <Activity className="w-6 h-6 text-tertiary" />
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-tertiary transition-colors">Ghost Jobs</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Listings kept open indefinitely to simulate company growth or placate overworked employees, with zero intent to hire.
                            </p>
                        </div>
                        <div className="bg-surface p-6 rounded-lg border border-outline-variant interactive-card group">
                            <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-tertiary/20 transition-all duration-300">
                                <ShieldAlert className="w-6 h-6 text-tertiary" />
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-tertiary transition-colors">Identity Harvesting</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Fake postings designed solely to collect resumes, email addresses, and personal data for resale or phishing attacks.
                            </p>
                        </div>
                        <div className="bg-surface p-6 rounded-lg border border-outline-variant interactive-card group">
                            <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-tertiary/20 transition-all duration-300">
                                <AlertTriangle className="w-6 h-6 text-tertiary" />
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-tertiary transition-colors">Psychological Exploitation</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Manipulative descriptions using high-pressure tactics or unrealistic promises to exploit desperate candidates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Interface Section */}
            <section className="px-margin-desktop py-24 relative" id="scanner-section">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-4">Deploy Counter-Intelligence Instantly.</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">Input suspicious job data and let the neural engine render a verdict.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-outline-variant border border-outline-variant rounded-xl overflow-hidden shadow-2xl min-h-[500px]">
                        {/* Left Pane: Input */}
                        <div className="bg-[#020617] dark:bg-surface-container-lowest p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-4 shrink-0">
                                <span className="font-mono-label text-xs tracking-widest font-bold text-primary">INPUT_BUFFER</span>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full border border-outline-variant bg-outline-variant/30 animate-pulse"></span>
                                    <span className="w-3 h-3 rounded-full border border-outline-variant"></span>
                                </div>
                            </div>
                            
                            <textarea 
                                className="flex-grow min-h-[300px] lg:min-h-0 bg-[#0b1326] dark:bg-surface-container border border-outline-variant rounded p-4 font-mono-data text-sm text-[rgba(255,255,255,0.9)] dark:text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none shadow-inner" 
                                placeholder={t('inputPlaceholder')}
                                value={jobPosting}
                                onChange={(e) => {
                                    stopAutoPlay();
                                    setJobPosting(e.target.value);
                                }}
                                disabled={isAnalyzing && isAutoPlaying}
                            />
                            
                            {error && (
                                <div className="mt-4 p-3 bg-error-container text-error text-sm font-mono rounded border border-error/50">
                                    [ERR] {error}
                                </div>
                            )}

                            <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                                <div className="flex flex-wrap gap-2 w-full">
                                    <button 
                                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                        className={`text-[10px] uppercase font-mono px-2 py-1 border rounded transition-colors flex items-center gap-1 ${
                                            isAutoPlaying 
                                                ? 'border-primary text-primary bg-primary/10' 
                                                : 'border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary'
                                        }`}
                                    >
                                        {isAutoPlaying ? <Activity className="w-3 h-3 animate-pulse" /> : null}
                                        {isAutoPlaying ? 'AUTO ON' : 'AUTO OFF'}
                                    </button>
                                    {Object.keys(DEMOS).map((key) => (
                                        <button 
                                            key={key}
                                            onClick={() => handleDemoClick(key)}
                                            className="text-[10px] uppercase font-mono px-2 py-1 border border-outline-variant rounded hover:text-primary hover:border-primary transition-colors text-on-surface-variant"
                                        >
                                            Load {key.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Pane: Output */}
                        <div className="bg-surface-container-highest p-6 relative flex flex-col">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Activity className="w-48 h-48" />
                            </div>
                            
                            <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-2 relative z-10">
                                <span className="font-mono-label text-xs tracking-widest font-bold text-on-surface-variant">ANALYSIS_OUTPUT</span>
                                <span className="font-mono-data text-xs text-on-surface-variant">ID: {result ? `${(result.scam_probability * 7) % 1000}X-ALPHA` : 'WAITING'}</span>
                            </div>

                            <AnimatePresence mode="wait">
                                {!isAnalyzing && !result && (
                                    <motion.div 
                                        key="empty"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex-1 flex items-center justify-center text-on-surface-variant font-mono opacity-50 text-sm"
                                    >
                                        [ AWAITING INPUT DATA ]
                                    </motion.div>
                                )}

                                {isAnalyzing && (
                                    <motion.div 
                                        key="scanning"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center space-y-6 relative"
                                    >
                                        <div className="w-16 h-16 border-4 border-outline-variant border-t-primary rounded-full animate-spin"></div>
                                        <div className="font-mono text-primary text-sm font-bold tracking-widest">
                                            {loadingText}
                                        </div>
                                    </motion.div>
                                )}

                                {!isAnalyzing && result && (
                                    <motion.div 
                                        key="results"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="space-y-6 relative z-10 flex-1"
                                    >
                                        {/* Threat Level */}
                                        <div className="bg-[#020617] dark:bg-surface border border-tertiary/30 p-4 rounded">
                                            <div className="font-mono-label text-xs font-bold text-on-surface-variant mb-2">SCAM PROBABILITY</div>
                                            <div className="flex items-end gap-4">
                                                <span className={`font-display-lg text-4xl font-bold leading-none ${result.scam_probability > 70 ? 'text-error' : result.scam_probability > 40 ? 'text-tertiary' : 'text-secondary'}`}>
                                                    {result.scam_probability}%
                                                </span>
                                                <div className="flex-grow h-2 bg-surface-container rounded-full overflow-hidden mb-2">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.scam_probability}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full ${result.scam_probability > 70 ? 'bg-error' : result.scam_probability > 40 ? 'bg-tertiary' : 'bg-secondary'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#020617] dark:bg-surface border border-outline-variant p-4 rounded flex flex-col">
                                                <span className="font-mono text-[10px] text-on-surface-variant mb-1">CLASSIFICATION</span>
                                                <span className="font-bold text-sm text-on-surface">{result.threat_classification}</span>
                                            </div>
                                            <div className="bg-[#020617] dark:bg-surface border border-outline-variant p-4 rounded flex flex-col">
                                                <span className="font-mono text-[10px] text-on-surface-variant mb-1">TRUST SCORE</span>
                                                <span className="font-bold text-sm text-on-surface">{result.trust_score}/100</span>
                                            </div>
                                        </div>

                                        {/* Red Flags */}
                                        {result.red_flags.length > 0 && (
                                            <div>
                                                <div className="font-mono-label text-xs font-bold text-on-surface-variant mb-3">IDENTIFIED RED FLAGS</div>
                                                <ul className="space-y-2">
                                                    {result.red_flags.map((flag, idx) => (
                                                        <motion.li 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            key={idx} 
                                                            className="flex items-start gap-2 font-mono-data text-xs text-on-surface bg-error-container/10 border border-error/20 p-3 rounded"
                                                        >
                                                            <div className="text-error mt-0.5"><AlertTriangle className="w-4 h-4"/></div>
                                                            {flag}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {result.red_flags.length === 0 && (
                                            <div className="p-3 bg-secondary/10 border border-secondary/20 rounded text-secondary text-sm font-mono flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" /> NO CRITICAL RED FLAGS DETECTED
                                            </div>
                                        )}

                                        <div className="p-4 bg-surface-container border border-outline-variant rounded border-l-2 border-l-primary/50 text-sm italic text-on-surface-variant">
                                            &quot;{result.summary}&quot;
                                        </div>

                                        {/* Recommendation */}
                                        <div className={`border rounded p-4 flex justify-between items-center ${result.risk_level === 'Critical' || result.risk_level === 'High' ? 'bg-error/10 border-error/30' : 'bg-secondary/10 border-secondary/30'}`}>
                                            <span className="font-mono-label text-xs font-bold text-on-surface-variant">RECOMMENDED ACTION</span>
                                            <span className={`font-mono-label text-xs font-bold px-3 py-1 rounded ${result.risk_level === 'Critical' || result.risk_level === 'High' ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary'}`}>
                                                {result.recommended_action}
                                            </span>
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer className="bg-surface-container-lowest text-primary font-body-sm font-headline-sm border-t border-outline-variant w-full px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-gutter relative z-10">
            <div className="flex flex-col items-center md:items-start gap-2">
                <span className="font-headline-sm text-lg font-bold">GhostJob AI</span>
                <span className="font-mono-data text-xs text-on-surface-variant">© 2026 GHOSTJOB AI // NEURAL DEFENSE ENGINE</span>
                <span className="font-mono-data text-[10px] text-outline">Job seeker defense system built securely on Gemini 3.1.</span>
            </div>
            
            <div className="flex gap-6 font-mono-label text-sm text-on-surface-variant">
                <a className="hover:text-secondary transition-all" href="#">Privacy Protocol</a>
                <a className="hover:text-secondary transition-all" href="#">Terminal Terms</a>
                <a className="hover:text-secondary transition-all" href="#">API Docs</a>
            </div>
        </footer>
    </div>
  );
}
