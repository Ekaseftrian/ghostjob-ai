'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useLanguage } from '@/components/Providers';
import { Footer } from '@/components/Footer';
import { ShieldAlert, Activity, ShieldCheck, AlertTriangle, Moon, Sun, Globe, Upload, Link as LinkIcon, Type, FileImage, CheckCircle, X, RefreshCw, Users, ThumbsUp, Download, BrainCircuit, Search, DollarSign, Ghost, Target } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const loadingMessages = [
  '> [SYS] Initiating linguistic analysis...',
  '> [WARN] Scanning for generic corporate jargon...',
  '> [WARN] Verifying unrealistic salary bands...',
  '> [SYS] Cross-referencing digital footprint...',
  '> [ALERT] Calculating final threat vector...'
];

export default function ForensicsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'link' | 'image'>('text');
  
  const [textInput, setTextInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loadingText, setLoadingText] = useState('> [SYS] Initiating linguistic analysis...');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (inputType === 'text' && !textInput.trim()) return;
    if (inputType === 'link' && !linkInput.trim()) return;
    if (inputType === 'image' && !imagePreview) return;

    setIsAnalyzing(true);
    setResult(null);
    setError('');

    try {
      let payload = { language, jobPosting: '', imageBase64: '' };
      
      if (inputType === 'text') {
        payload.jobPosting = textInput;
      } else if (inputType === 'link') {
        payload.jobPosting = linkInput;
      } else if (inputType === 'image' && imagePreview) {
        payload.imageBase64 = imagePreview;
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Intelligence extraction failed.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to contact the threat intelligence engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="font-body-md min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="grid-scan-overlay"></div>
        {/* TopNavBar */}
        <nav className="bg-surface/80 backdrop-blur-md font-headline-sm text-headline-sm text-mono-label border-b border-outline-variant shadow-[0_0_15px_rgba(76,215,246,0.1)] fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
            <div className="flex items-center gap-4">
                <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-cyan border border-primary/30">
                    <Ghost className="w-4 h-4 text-primary absolute" strokeWidth={2.5}/>
                    <Target className="w-6 h-6 text-primary/70 animate-pulse absolute" />
                </div>
                <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">GhostJob AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-mono-label text-mono-label">
                <Link prefetch={true} className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="/">Home</Link>
                <Link prefetch={true} className="text-primary border-b-2 border-primary pb-1 active:scale-95 transition-transform" href="/forensics">Deep Scanner</Link>
                <Link prefetch={true} className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="/docs">Docs</Link>
                <Link prefetch={true} className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="/live">Live Status</Link>
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

        <main className="flex-grow pt-[100px] z-10 relative px-margin-desktop py-12 max-w-7xl mx-auto w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-4">Deep Forensics Module</h1>
                <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">
                    Advanced inspection suite. Submit raw text, URLs, or image evidence for multi-layered Neural Threat Detection.
                </p>
            </div>

            <div className="w-full max-w-4xl glass-panel border border-outline-variant rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                
                {/* Input Modes Selection */}
                <div className="w-full md:w-64 bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant p-4 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto">
                    <span className="font-mono-label text-xs tracking-widest font-bold text-on-surface-variant mb-2 hidden md:block px-2">CAPTURE MODE</span>
                    
                    <button 
                        onClick={() => setInputType('text')}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-mono transition-colors text-left whitespace-nowrap ${inputType === 'text' ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                    >
                        <Type className="w-4 h-4" />
                        Raw Text
                    </button>
                    
                    <button 
                        onClick={() => setInputType('link')}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-mono transition-colors text-left whitespace-nowrap ${inputType === 'link' ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                    >
                        <LinkIcon className="w-4 h-4" />
                        Target URL
                    </button>
                    
                    <button 
                        onClick={() => setInputType('image')}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-mono transition-colors text-left whitespace-nowrap ${inputType === 'image' ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                    >
                        <FileImage className="w-4 h-4" />
                        Image / OCR
                    </button>
                </div>

                {/* Input Area */}
                <div className="flex-grow p-6 flex flex-col relative bg-surface dark:bg-surface/50 min-h-[400px]">
                    {!result && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-mono-label text-xs tracking-widest font-bold text-primary flex items-center gap-2">
                                     INPUT_BUFFER
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                {inputType === 'text' && (
                                    <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-grow flex flex-col h-full">
                                        <textarea 
                                            className="flex-grow bg-surface-container dark:bg-[#0b1326] border border-outline-variant rounded p-4 font-mono-data text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none shadow-inner" 
                                            placeholder="Paste raw email header, script, or job description text here..."
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            disabled={isAnalyzing}
                                        />
                                    </motion.div>
                                )}

                                {inputType === 'link' && (
                                    <motion.div key="link" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-grow flex flex-col h-full justify-center px-8">
                                        <div className="space-y-4">
                                            <div className="font-mono text-sm text-on-surface-variant text-center">
                                                Enter the URL of the suspicious job posting or company website.
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <LinkIcon className="h-5 w-5 text-on-surface-variant" />
                                                </div>
                                                <input 
                                                    type="url" 
                                                    value={linkInput}
                                                    onChange={(e) => setLinkInput(e.target.value)}
                                                    placeholder="https://example-jobs.corp/apply/..."
                                                    className="block w-full pl-12 pr-4 py-4 bg-surface-container dark:bg-[#0b1326] border border-outline-variant rounded text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-mono text-sm shadow-inner"
                                                    disabled={isAnalyzing}
                                                />
                                            </div>
                                            <div className="text-center font-mono text-xs text-error/80 bg-error/10 p-2 rounded border border-error/20 inline-block mx-auto w-full">
                                                <AlertTriangle className="w-3 h-3 inline-block mr-1 -mt-0.5" /> 
                                                Note: We cannot scrape gated sites (e.g. LinkedIn, JobStreet). Please use Raw Text or Image/Screenshot mode for those platforms.
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {inputType === 'image' && (
                                    <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-grow flex flex-col h-full">
                                        {!imagePreview ? (
                                            <div className="flex-grow border-2 border-dashed border-outline-variant rounded flex flex-col items-center justify-center p-8 text-center bg-surface-container/30 hover:bg-surface-container/60 transition-colors cursor-pointer relative group">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={handleImageUpload}
                                                    disabled={isAnalyzing}
                                                />
                                                <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-8 h-8 text-on-surface-variant" />
                                                </div>
                                                <div className="font-mono text-sm text-on-surface mb-2 font-bold">DRAG & DROP OR CLICK TO BROWSE</div>
                                                <div className="font-mono text-xs text-on-surface-variant">PNG, JPG, WEBP (Max 5MB)</div>
                                            </div>
                                        ) : (
                                            <div className="flex-grow relative bg-surface-container dark:bg-[#0b1326] rounded border border-outline-variant overflow-hidden flex flex-col items-center justify-center p-4">
                                                <button 
                                                    onClick={() => setImagePreview(null)}
                                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error hover:bg-error/40 transition-colors z-20"
                                                    disabled={isAnalyzing}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={imagePreview} alt="Evidence Preview" className="max-w-full max-h-[300px] object-contain rounded" />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <div className="mt-4 p-3 bg-error-container text-error text-sm font-mono rounded border border-error/50 flex justify-between items-start gap-4">
                                    <span>[ERR] {error}</span>
                                    <button 
                                        onClick={startAnalysis}
                                        className="uppercase text-[10px] border border-error text-error hover:bg-error/10 px-2 py-1 rounded whitespace-nowrap transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end shrink-0">
                                 <button 
                                    onClick={startAnalysis}
                                    disabled={isAnalyzing || (inputType === 'text' && !textInput.trim()) || (inputType === 'link' && !linkInput.trim()) || (inputType === 'image' && !imagePreview)}
                                    className="bg-surface-bright text-on-surface font-mono-label text-sm px-8 py-4 rounded border border-outline-variant execute-btn flex items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzing ? <Activity className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                                    {isAnalyzing ? 'RUNNING DEEP ENGINE' : 'EXECUTE FORENSICS'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Results Overlay */}
                    <AnimatePresence>
                        {isAnalyzing && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-surface/90 dark:bg-[#020617]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center"
                            >
                                <div className="w-16 h-16 border-4 border-outline-variant border-t-primary rounded-full animate-spin mb-4"></div>
                                <div className="font-mono text-primary text-sm font-bold tracking-widest text-center space-y-2">
                                    {loadingText}
                                </div>
                            </motion.div>
                        )}

                        {result && !isAnalyzing && (
                             <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className="flex-grow flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4 shrink-0">
                                    <span className="font-mono-label text-xs tracking-widest font-bold text-on-surface-variant flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" /> FORENSIC_REPORT_GENERATED
                                    </span>
                                    <button 
                                        onClick={() => {
                                            setResult(null);
                                            setTextInput('');
                                            setLinkInput('');
                                            setImagePreview(null);
                                        }}
                                        className="text-primary hover:bg-primary/10 transition-colors font-mono text-[10px] uppercase font-bold flex items-center gap-1 border border-primary px-3 py-1.5 rounded"
                                    >
                                        <RefreshCw className="w-3 h-3" /> SCAN NEW TARGET
                                    </button>
                                </div>

                                <div className="bg-surface dark:bg-[#020617] border border-tertiary/30 p-6 rounded flex items-center justify-between mb-6 shrink-0 relative">
                                    <div className="absolute top-4 right-4 max-md:hidden">
                                        <button 
                                            onClick={() => window.print()}
                                            className="text-on-surface hover:text-primary transition-colors font-mono text-[10px] uppercase font-bold flex items-center gap-2 border border-outline-variant hover:border-primary px-3 py-1.5 rounded-full bg-surface-container"
                                        >
                                            <Download className="w-3 h-3" /> EXPORT REPORT (PDF)
                                        </button>
                                    </div>
                                    <div>
                                        <div className="font-mono-label text-xs font-bold text-on-surface-variant mb-2">THREAT LEVEL</div>
                                        <div className={`font-display-lg text-4xl font-bold leading-none ${result.scam_probability > 70 ? 'text-error' : result.scam_probability > 40 ? 'text-tertiary' : 'text-secondary'}`}>{result.risk_level || 'CRITICAL'}</div>
                                    </div>
                                    <div className="text-right mt-12 md:mt-0 md:pr-48">
                                         <div className="font-mono-label text-xs font-bold text-on-surface-variant mb-2">SCAM PROBABILITY</div>
                                         <div className={`font-display-lg text-4xl font-bold leading-none ${result.scam_probability > 70 ? 'text-error' : result.scam_probability > 40 ? 'text-tertiary' : 'text-secondary'}`}>{result.scam_probability}%</div>
                                    </div>
                                    <div className="md:hidden absolute bottom-4 right-4">
                                        <button 
                                            onClick={() => window.print()}
                                            className="text-on-surface hover:text-primary transition-colors font-mono text-[10px] uppercase font-bold flex items-center gap-2 border border-outline-variant hover:border-primary px-3 py-1.5 rounded-full bg-surface-container"
                                        >
                                            <Download className="w-3 h-3" /> EXPORT
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                     <div className="p-4 bg-surface-container border border-outline-variant rounded border-l-2 border-l-error/50 text-sm italic text-on-surface-variant">
                                        &quot;{result.summary}&quot;
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Radar Chart */}
                                        <div className="bg-surface dark:bg-[#020617] border border-outline-variant p-4 rounded flex flex-col">
                                            <div className="font-mono-label text-[10px] font-bold text-on-surface-variant flex items-center gap-2 mb-2"><Activity className="w-3 h-3"/> THREAT VECTOR MATRIX</div>
                                            <div className="h-48 w-full relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                                        { subject: 'Urgency', A: result.heatmap?.urgency || 0 },
                                                        { subject: 'Greed', A: result.heatmap?.greed_bait || 0 },
                                                        { subject: 'Authority', A: result.heatmap?.authority_pressure || 0 },
                                                        { subject: 'Transparency', A: result.heatmap?.transparency_risk || 0 },
                                                    ]}>
                                                        <PolarGrid stroke="#334155" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} />
                                                        <Radar name="Threat" dataKey="A" stroke={result.scam_probability > 70 ? '#ef4444' : '#06b6d4'} fill={result.scam_probability > 70 ? '#ef4444' : '#06b6d4'} fillOpacity={0.4} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Psych Profile */}
                                        <div className="bg-surface dark:bg-[#020617] border border-outline-variant p-4 rounded flex flex-col justify-between">
                                            <div>
                                                <div className="font-mono-label text-[10px] font-bold text-on-surface-variant flex items-center gap-2 mb-3"><BrainCircuit className="w-3 h-3"/> SCAMMER PSYCHOLOGY</div>
                                                <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                    {(result.manipulation_tactics || []).map((tactic: string, idx: number) => (
                                                        <li key={idx} className="font-mono-data text-xs text-on-surface bg-surface-container-highest p-2.5 rounded flex items-start gap-2 border-l-2 border-primary/50">
                                                            <span className="text-primary mt-0.5">&bull;</span> {tactic}
                                                        </li>
                                                    ))}
                                                    {(!result.manipulation_tactics || result.manipulation_tactics.length === 0) && (
                                                        <li className="font-mono-data text-xs text-on-surface-variant italic">No manipulation tactics detected.</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-surface dark:bg-[#020617] border border-outline-variant p-4 rounded flex flex-col">
                                            <div className="font-mono-label text-[10px] font-bold text-on-surface-variant flex items-center gap-2 mb-2"><Search className="w-3 h-3"/> TRANSPARENCY CHECK</div>
                                            <p className="font-body-md text-sm text-on-surface leading-relaxed text-pretty">{result.transparency_analysis}</p>
                                        </div>
                                        <div className="bg-surface dark:bg-[#020617] border border-outline-variant p-4 rounded flex flex-col">
                                            <div className="font-mono-label text-[10px] font-bold text-on-surface-variant flex items-center gap-2 mb-2"><DollarSign className="w-3 h-3"/> SALARY REALISM</div>
                                            <p className="font-body-md text-sm text-on-surface leading-relaxed text-pretty">{result.salary_realism}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="font-mono-label text-xs font-bold text-on-surface-variant mb-3">CRITICAL INDICATORS</div>
                                        <ul className="space-y-2">
                                            {result.red_flags.map((flag: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 font-mono-data text-xs text-on-surface bg-error-container/10 border border-error/20 p-3 rounded">
                                                    <div className="text-error mt-0.5"><AlertTriangle className="w-4 h-4"/></div>
                                                    {flag}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Community Shield */}
                                    <div className="bg-surface-container-highest border border-outline-variant p-4 rounded flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="font-mono-label text-[10px] font-bold text-on-surface-variant flex items-center gap-2">
                                                <Users className="w-3 h-3 text-primary" /> COMMUNITY INTELLIGENCE
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${result.scam_probability > 50 ? 'bg-error/10 text-error border-error/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                                                    {result.scam_probability > 50 ? 'MULTIPLE FLAGS DETECTED' : 'NO PRIOR REPORTS'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-mono-data text-on-surface leading-relaxed">
                                            {result.scam_probability > 50 ? (
                                                <><span className="text-error font-bold">Warning:</span> Database matches show similar linguistic patterns to known ghost-job templates. 3 users have submitted similar variations of this text.</>
                                            ) : (
                                                <span className="text-on-surface-variant">This listing does not match any current community-flagged scam templates.</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <button className="flex-1 bg-surface border border-outline-variant hover:border-primary text-[10px] font-mono py-2 rounded transition-colors flex items-center justify-center gap-2 text-on-surface hover:text-primary font-bold">
                                                <ThumbsUp className="w-3 h-3" /> VERIFY LEGIT
                                            </button>
                                            <button className="flex-1 bg-surface border border-outline-variant hover:border-error text-[10px] font-mono px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 text-on-surface hover:text-error font-bold">
                                                <ShieldAlert className="w-3 h-3" /> REPORT SUSPICIOUS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
        
        <Footer />
    </div>
  );
}
