'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useLanguage } from '@/components/Providers';
import { Footer } from '@/components/Footer';
import { ShieldAlert, BookOpen, FileText, Code, AlertTriangle, ShieldCheck, CheckCircle, Moon, Sun, Globe, Terminal, Info, Ghost, Target } from 'lucide-react';

export default function DocsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'education' | 'api'>('guide');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
                <Link prefetch={true} className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="/forensics">Deep Scanner</Link>
                <Link prefetch={true} className="text-primary border-b-2 border-primary pb-1 active:scale-95 transition-transform" href="/docs">Docs</Link>
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

        <main className="flex-grow pt-[100px] z-10 relative px-margin-desktop py-12 max-w-7xl mx-auto w-full flex flex-col">
            <div className="mb-12">
                <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-4">Threat Intelligence Knowledge Base</h1>
                <p className="font-body-md text-on-surface-variant max-w-2xl">
                    {language === 'id' 
                        ? 'Pusat panduan pengguna, edukasi keamanan siber untuk pencari kerja, dan spesifikasi integrasi API.'
                        : 'User guides, cybersecurity education for job seekers, and API integration specifications.'}
                </p>
            </div>

            <div className="flex justify-start gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                <button 
                    onClick={() => setActiveTab('guide')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono-label text-sm transition-all whitespace-nowrap ${activeTab === 'guide' ? 'bg-primary text-[#000000] font-bold shadow-[0_0_15px_rgba(76,215,246,0.5)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border border-outline-variant'}`}
                >
                    <BookOpen className="w-4 h-4" />
                    {language === 'id' ? 'Panduan Membaca Laporan' : 'Threat Report Guide'}
                </button>
                <button 
                    onClick={() => setActiveTab('education')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono-label text-sm transition-all whitespace-nowrap ${activeTab === 'education' ? 'bg-primary text-[#000000] font-bold shadow-[0_0_15px_rgba(76,215,246,0.5)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border border-outline-variant'}`}
                >
                    <AlertTriangle className="w-4 h-4" />
                    {language === 'id' ? 'Edukasi Ghost Jobs & Scams' : 'Ghost Jobs & Scams'}
                </button>
                <button 
                    onClick={() => setActiveTab('api')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono-label text-sm transition-all whitespace-nowrap ${activeTab === 'api' ? 'bg-primary text-[#000000] font-bold shadow-[0_0_15px_rgba(76,215,246,0.5)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border border-outline-variant'}`}
                >
                    <Code className="w-4 h-4" />
                    {language === 'id' ? 'Dokumentasi API' : 'API Documentation'}
                </button>
            </div>

            <div className="glass-panel border border-outline-variant rounded-xl p-8 shadow-2xl min-h-[60vh] bg-surface-container-lowest">
                <AnimatePresence mode="wait">
                    
                    {/* GUIDE TAB */}
                    {activeTab === 'guide' && (
                        <motion.div 
                            key="guide"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="border-b border-outline-variant pb-6">
                                <h2 className="text-2xl font-bold font-display-md flex items-center gap-3 text-on-surface mb-2">
                                    <BookOpen className="text-primary w-6 h-6" />
                                    {language === 'id' ? 'Cara Membaca Laporan Keamanan' : 'How to Read the Threat Report'}
                                </h2>
                                <p className="text-on-surface-variant font-body-md">
                                    {language === 'id' 
                                        ? 'GhostJob AI memberikan analisis instan dengan indikator keamanan bergaya cybersecurity. Berikut cara membaca hasil laporan kami.'
                                        : 'GhostJob AI provides instant analysis with cybersecurity-style indicators. Here is how to interpret our reports.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div>
                                    <h3 className="font-mono-label text-sm text-primary font-bold tracking-widest mb-4 flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4" /> SCAM PROBABILITY SCORE
                                    </h3>
                                    <div className="space-y-4 font-body-md">
                                        <div className="p-4 bg-surface-container rounded border-l-4 border-l-primary/30">
                                            <p className="font-bold text-on-surface">0% - 30% (Low Risk)</p>
                                            <p className="text-on-surface-variant text-sm mt-1">Lowongan terindikasi sah. Perusahaan memiliki transparansi yang jelas dan tidak ada sinyal manipulasi yang terdeteksi.</p>
                                        </div>
                                        <div className="p-4 bg-surface-container rounded border-l-4 border-l-tertiary">
                                            <p className="font-bold text-on-surface">31% - 69% (Medium Risk)</p>
                                            <p className="text-on-surface-variant text-sm mt-1">Status kejelasan dipertanyakan. Bisa jadi loker sah namun ditulis dengan buruk, atau perusahaan outsourcing/MLM (Multi-Level Marketing).</p>
                                        </div>
                                        <div className="p-4 bg-surface-container rounded border-l-4 border-l-error">
                                            <p className="font-bold text-on-surface">70% - 100% (High / Critical Risk)</p>
                                            <p className="text-on-surface-variant text-sm mt-1">Bahaya pencurian identitas atau penipuan biaya di muka. Berhenti berinteraksi dengan kontak yang terkait dengan loker tersebut.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-mono-label text-sm text-primary font-bold tracking-widest mb-4 flex items-center gap-2">
                                        <Terminal className="w-4 h-4" /> KATEGORI ANCAMAN UMUM
                                    </h3>
                                    <ul className="space-y-4 font-body-md">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 text-primary"><AlertTriangle className="w-4 h-4" /></div>
                                            <div>
                                                <strong className="text-on-surface block">Data / Identity Harvesting</strong>
                                                <span className="text-on-surface-variant text-sm border-b border-dashed border-outline-variant pb-1">Meminta nomor identitas (KTP, SSN) atau data perbankan terlalu cepat (bahkan sebelum interview).</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 text-primary"><AlertTriangle className="w-4 h-4" /></div>
                                            <div>
                                                <strong className="text-on-surface block">Advance-Fee Scam</strong>
                                                <span className="text-on-surface-variant text-sm border-b border-dashed border-outline-variant pb-1">Memerlukan pelamar mentransfer uang untuk &quot;training&quot;, &quot;laptop kantor&quot;, atau &quot;proses administrasi&quot;.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 text-primary"><AlertTriangle className="w-4 h-4" /></div>
                                            <div>
                                                <strong className="text-on-surface block">Pyramid / MLM</strong>
                                                <span className="text-on-surface-variant text-sm border-b border-dashed border-outline-variant pb-1">Judul pekerjaan disembunyikan. Fokus deskripsi adalah &quot;menjadi bos sendiri&quot; atau &quot;pendapatan tak terbatas&quot; atau kata kunci &quot;Management Trainee&quot; pasif.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* EDUCATION TAB */}
                    {activeTab === 'education' && (
                        <motion.div 
                            key="education"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                             <div className="border-b border-outline-variant pb-6">
                                <h2 className="text-2xl font-bold font-display-md flex items-center gap-3 text-on-surface mb-2">
                                    <AlertTriangle className="text-primary w-6 h-6" />
                                    {language === 'id' ? 'Anatomi Ghost Jobs & Scams Modern' : 'Anatomy of Ghost Jobs & Modern Scams'}
                                </h2>
                                <p className="text-on-surface-variant font-body-md">
                                    {language === 'id' 
                                        ? 'Pelajari cara kerja penipuan loker modern dan hak privasi data Anda.'
                                        : 'Learn how modern job scams operate and understand your data privacy rights.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div>
                                    <h3 className="font-mono-label text-sm text-primary font-bold tracking-widest mb-4">APA ITU &quot;GHOST JOBS&quot;?</h3>
                                    <div className="bg-surface-container rounded p-6 shadow-inner text-sm font-body-md text-on-surface-variant space-y-4">
                                        <p>
                                            <strong className="text-on-surface block mb-1">Definisi:</strong>
                                            Ghost jobs adalah lowongan pekerjaan palsu yang diiklankan oleh perusahaan, padahal perusahaan tersebut sebenarnya tidak berniat merekrut siapapun untuk posisi tersebut.
                                        </p>
                                        <p>
                                            <strong className="text-on-surface block mb-1">Mengapa Perusahaan Melakukannya?</strong>
                                        </p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><span className="text-on-surface">Membangun ilusi pertumbuhan</span>: Terlihat sedang scaling/ekspansi di mata investor.</li>
                                            <li><span className="text-on-surface">Menenangkan karyawan yang lelah (burnout)</span>: Memberikan harapan semu bahwa bantuan/anggota tim baru akan segera datang.</li>
                                            <li><span className="text-on-surface">Mengumpulkan bank CV</span>: Menyimpan data talenta untuk masa depan, tanpa mempekerjakan sekarang (Data Harvesting).</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-mono-label text-sm text-primary font-bold tracking-widest mb-4">MENGIDENTIFIKASI SCAMS BERBASIS AI</h3>
                                    <div className="bg-surface-container rounded p-6 shadow-inner text-sm font-body-md text-on-surface-variant space-y-4 border border-tertiary/20">
                                         <p>
                                            Scammer saat ini menggunakan Generative AI (LLMs) untuk membuat deskripsi pekerjaan dan profil LinkedIn perekrut palsu yang sangat meyakinkan.
                                        </p>
                                        <div className="p-3 bg-tertiary/10 border-l-2 border-tertiary text-on-surface">
                                            <strong className="block mb-1 flex items-center gap-2"><CheckCircle className="w-3 h-3 text-tertiary" /> Gaya Bahasa LLM Generic</strong>
                                            Teks seringkali terasa terlalu halus, menggunakan kata-kata hiperbolik (misalnya: &quot;Mencari rockstar&quot;, &quot;Bergabunglah dengan perjalanan fantastis kami&quot;), dan memiliki format bullet-point yang seragam tanpa detail teknis yang spesifik/riil tentang stack teknologi perusahaan. 
                                        </div>
                                         <div className="p-3 bg-tertiary/10 border-l-2 border-tertiary text-on-surface">
                                            <strong className="block mb-1 flex items-center gap-2"><Globe className="w-3 h-3 text-tertiary" /> Taktik Domain Homoglyph</strong>
                                            Perekrut palsu akan mengirimkan link &quot;appIe.com&quot; (huruf besar &apos;I&apos; alih-alih huruf &apos;l&apos;) atau &quot;google-careers.site&quot; untuk mengelabui korban agar login. GhostJob AI Forensics Module menangkap anomali domain ini otomatis.
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-4 bg-primary/10 border border-primary/30 p-6 rounded-lg flex items-start gap-4">
                                    <ShieldCheck className="w-8 h-8 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-mono-label text-sm text-primary font-bold tracking-widest mb-2">HAK PRIVASI DATA ANDA (DEFENSIVE OPSEC)</h3>
                                        <p className="text-sm font-body-md text-on-surface-variant mb-4">
                                            Sebagai pencari kerja, Anda adalah target bernilai tinggi untuk Identity Theft. Selalu ingat aturan operasional keamanan dasar:
                                        </p>
                                        <ul className="text-sm font-body-md text-on-surface space-y-2">
                                            <li><span className="text-primary mr-2">1.</span> Jangan pernah mengirimkan foto KTP, Paspor, atau kartu keluarga sebelum memastikan adanya surat kontrak resmi kerja yang sah.</li>
                                            <li><span className="text-primary mr-2">2.</span> Hindari menaruh alamat rumah lengkap pada CV publik yang dipasang di internet. Cukup sebutkan Kota dan Negara.</li>
                                            <li><span className="text-primary mr-2">3.</span> Hindari menyetorkan detail rekening bank kepada pihak &quot;HR&quot; saat masih tahap seleksi. Hal itu hanya dibutuhkan setelah masuk onboarding.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {/* API TAB */}
                    {activeTab === 'api' && (
                        <motion.div 
                            key="api"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="border-b border-outline-variant pb-6">
                                <h2 className="text-2xl font-bold font-display-md flex items-center gap-3 text-on-surface mb-2">
                                    <Code className="text-primary w-6 h-6" />
                                    REST API Integration
                                </h2>
                                <p className="text-on-surface-variant font-body-md">
                                    {language === 'id' 
                                        ? 'Implementasikan GhostJob Analytics ke dalam platform perekrutan atau browser extension Anda.'
                                        : 'Integrate GhostJob Analytics into your hiring platform or browser extension.'}
                                </p>
                            </div>

                            <div className="bg-surface-container dark:bg-[#020617] rounded-lg border border-outline-variant overflow-hidden shadow-inner font-mono text-sm max-w-4xl">
                                <div className="bg-surface-variant flex items-center gap-2 px-4 py-2 border-b border-outline-variant text-on-surface-variant text-xs font-mono-label">
                                    <div className="flex gap-1.5 shrink-0">
                                        <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                    </div>
                                    <span className="ml-2">POST /api/analyze</span>
                                </div>
                                <div className="p-6 overflow-x-auto text-on-surface-variant text-xs md:text-sm">
                                    <p className="text-primary mb-2">{'//'} Request Header</p>
                                    <pre className="mb-6"><span className="text-on-surface">Content-Type:</span> application/json</pre>
                                    
                                    <p className="text-primary mb-2">{'//'} Request Body</p>
                                    <pre className="mb-6 text-on-surface">
{`{
  "jobPosting": "URGENT HIRING: Data Entry Specialist. Work from home, $1000/week. Click this sketchy-link.ru to apply.",
  "language": "en" 
}`}
                                    </pre>
                                    
                                    <p className="text-primary mb-2">{'//'} Response Payload</p>
                                    <pre className="text-primary">
{`{
  "job_title": "Data Entry Specialist",
  "company_name": "Unknown",
  "scam_probability": 95,
  "risk_level": "Critical",
  "trust_score": 10,
  "analysis_confidence": 92,
  "threat_classification": "Advance-Fee / Phishing Scam",
  "summary": "This job posting exhibits extreme artificial urgency combined with unrealistic compensation for a data entry role...",
  "red_flags": [
    "Unrealistic compensation ($1000/wk for remote Data entry)",
    "Suspicious TLD link used (.ru)",
    "Artificial urgency (URGENT HIRING)"
  ]
}`}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
        
        <Footer />
    </div>
  );
}
