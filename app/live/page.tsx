'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useLanguage } from '@/components/Providers';
import { Footer } from '@/components/Footer';
import { ShieldAlert, Globe, Activity, AlertTriangle, Monitor, ShieldCheck, Moon, Sun, Ghost, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ThreatFeedItem {
    id: string;
    timestamp: Date;
    type: string;
    description: string;
    tag: string;
    riskScore: number;
    isUserScan?: boolean;
}

const initialFeeds: ThreatFeedItem[] = [
    { id: '1', timestamp: new Date(Date.now() - 60000), type: 'XSS/Data Harvesting', description: 'Deteksi XSS/Data Harvesting Scam pada posisi Remote Data Entry', tag: 'Remote', riskScore: 94 },
    { id: '2', timestamp: new Date(Date.now() - 300000), type: 'Fake Company / Ghost Job', description: 'Deteksi Fake Company / Ghost Job di Sektor Tech', tag: 'Tech', riskScore: 72 },
    { id: '3', timestamp: new Date(Date.now() - 900000), type: 'Advance-Fee Scam', description: 'Upfront payment requested for "equipment" in Customer Support role', tag: 'Support', riskScore: 88 },
];

export default function LiveStatusPage() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    
    // Live Feed State
    const [feeds, setFeeds] = useState<ThreatFeedItem[]>(initialFeeds);
    
    const [chartData, setChartData] = useState([
        { time: '00:00', value: 4200 },
        { time: '06:00', value: 3100 },
        { time: '12:00', value: 6800 },
        { time: '18:00', value: 5400 },
        { time: 'NOW', value: 8900 },
    ]);
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        
        const handleNewUserScan = () => {
            try {
                const stored = localStorage.getItem('ghostjob_user_scans_v1');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.length > 0) {
                        const latestScan = parsed[0];
                        
                        // Prevent adding duplicate if effect reruns
                        setFeeds(prev => {
                            if (prev.some(f => f.id === latestScan.id)) return prev;
                            const newFeedItem: ThreatFeedItem = {
                                ...latestScan,
                                timestamp: new Date(latestScan.timestamp)
                            };
                            return [newFeedItem, ...prev].slice(0, 15);
                        });
                    }
                }
            } catch (e) {}
        };
        
        window.addEventListener('ghostjob-new-user-scan', handleNewUserScan);
        // Initial load of user scans
        handleNewUserScan();

        // Setup mock real-time feed interval
        const feedInterval = setInterval(() => {
            if (Math.random() > 0.65) { // ~35% chance every 7.5 seconds to add new feed
                const threatTypes = [
                    'DATA HARVESTING', 
                    'GHOST JOB DETECTED', 
                    'FINANCIAL EXPLOITATION', 
                    'PSYCHOLOGICAL MANIPULATION', 
                    'IDENTITY THEFT VECTOR',
                    'SPOOFING SCHEME'
                ];
                const descriptions = [
                    "Phishing campaign disguised as 'Entry Level Virtual Assistant' targeting regional applicants.",
                    "Unverified tech entity farming resumes for data-brokering pipelines. Position: Remote Software Intern.",
                    "Upfront mandatory 'training module fee' required post-interview invitation.",
                    "Post-midnight rapid interview scheduling using high-pressure urgency tactics.",
                    "Illegitimate corporate entity requesting government ID before initial screening phase.",
                    "Sophisticated homoglyph vulnerability used in recruiter email domain spoofing."
                ];
                const tags = ['Marketing', 'Remote', 'Sales', 'Design', 'Engineering', 'Finance'];
                
                const randomType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
                const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
                const randomTag = tags[Math.floor(Math.random() * tags.length)];
                const randomRisk = Math.floor(Math.random() * 50) + 50; // 50 to 99
                
                const newFeed: ThreatFeedItem = {
                    id: Math.random().toString(36).substring(7),
                    timestamp: new Date(),
                    type: randomType,
                    description: randomDesc,
                    tag: randomTag,
                    riskScore: randomRisk
                };
                
                setFeeds(prev => [newFeed, ...prev].slice(0, 15)); // Keep max 15
            }
        }, 7500);
        
        const chartInterval = setInterval(() => {
            setChartData(prevData => {
                const newData = [...prevData];
                const lastIdx = newData.length - 1;
                // Add a random shift to the last data point
                const shift = (Math.random() - 0.5) * 3000;
                let newValue = newData[lastIdx].value + shift;
                if (newValue < 5000) newValue = 5000;
                if (newValue > 14000) newValue = 14000;
                newData[lastIdx] = { ...newData[lastIdx], value: Math.floor(newValue) };
                return newData;
            });
        }, 3000);
        
        return () => {
            clearInterval(feedInterval);
            clearInterval(chartInterval);
            window.removeEventListener('ghostjob-new-user-scan', handleNewUserScan);
        };
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const getRiskColorClasses = (score: number) => {
        if (score >= 80) return "bg-error/10 border-error/20 text-error";
        if (score >= 50) return "bg-tertiary/10 border-tertiary/20 text-tertiary";
        return "bg-secondary/10 border-secondary/20 text-secondary";
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor(diffMs / 1000);
        
        if (diffMins === 0) {
            return `${diffSecs} seconds ago`;
        } else if (diffMins === 1) {
            return `1 minute ago`;
        } else {
            return `${diffMins} minutes ago`;
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
                    <Link prefetch={true} className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="/forensics">Deep Scanner</Link>
                    <Link prefetch={true} className="text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 transition-all duration-200 py-1 px-2 active:scale-95" href="/docs">Docs</Link>
                    <Link prefetch={true} className="text-primary border-b-2 border-primary pb-1 active:scale-95 transition-transform" href="/live">Live Status</Link>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden lg:inline-flex text-secondary-fixed font-mono-label text-mono-label items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                        Status: Optimal
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

            <main className="flex-grow pt-[100px] z-10 relative px-margin-desktop py-12 w-full flex flex-col">
                <div className="mb-10 text-center max-w-4xl mx-auto">
                    <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface mb-4 flex items-center justify-center gap-4">
                        <Activity className="text-secondary w-10 h-10 animate-pulse" />
                        Global Threat Map
                    </h1>
                    <p className="font-body-md text-on-surface-variant">
                        {language === 'id' 
                            ? 'Feed real-time dari deteksi penipuan rekrutmen di seluruh dunia.'
                            : 'Real-time feed of recruitment fraud detections across the globe.'}
                    </p>
                </div>

                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* STATS PANE */}
                    <div className="md:col-span-1 border border-outline-variant rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-outline-variant bg-surface-variant flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-primary" />
                            <span className="font-mono-label text-xs tracking-widest font-bold text-on-surface">NETWORK STATUS</span>
                        </div>
                        <div className="p-6 flex-grow flex flex-col gap-6">
                            <div>
                                <div className="text-on-surface-variant font-mono-label text-xs mb-1">SCANS TODAY</div>
                                <div className="text-3xl font-display-md text-on-surface font-bold">14,289</div>
                            </div>
                            <div>
                                <div className="text-on-surface-variant font-mono-label text-xs mb-1">BLOCKED THREATS</div>
                                <div className="text-3xl font-display-md text-error font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" /> 3,942
                                </div>
                            </div>
                            <div>
                                <div className="text-on-surface-variant font-mono-label text-xs mb-1">PROTECTION RATE</div>
                                <div className="text-3xl font-display-md text-tertiary font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5" /> 99.8%
                                </div>
                            </div>
                            <div className="mt-auto">
                                <div className="w-full h-40 bg-surface border border-outline-variant rounded p-2 pt-6 relative overflow-hidden flex items-end justify-between">
                                     <div className="absolute top-2 left-2 text-[10px] font-mono text-on-surface-variant z-10 uppercase tracking-widest">ACTIVITY GRAPH</div>
                                     <div className="absolute inset-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={true} horizontal={true} opacity={0.5} />
                                                <XAxis dataKey="time" stroke="#475569" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} dy={5} />
                                                <YAxis stroke="#475569" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}K`} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontFamily: 'monospace', fontSize: '12px' }}
                                                    itemStyle={{ color: '#06b6d4' }}
                                                />
                                                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={true} animationDuration={1000} animationEasing="ease-in-out" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LIVE FEED PANE */}
                    <div className="md:col-span-2 border border-outline-variant rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-outline-variant bg-surface-variant flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                                <span className="font-mono-label text-xs tracking-widest font-bold text-on-surface">LIVE DETECTION FEED</span>
                            </div>
                            <span className="font-mono-data text-[10px] text-tertiary">POLLING: ACTIVE</span>
                        </div>
                        
                        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 relative bg-surface dark:bg-[#020617]">
                            <AnimatePresence>
                                {feeds.map((feed) => (
                                    <motion.div 
                                        key={feed.id}
                                        initial={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto', marginBottom: 12 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`border transition-all rounded bg-surface-container p-4 font-mono-data text-xs relative overflow-hidden ${feed.isUserScan ? 'border-primary ai-pulse' : 'border-outline-variant hover:border-primary/50'}`}
                                    >
                                        {feed.isUserScan && <div className="absolute top-0 left-0 w-1 h-full bg-primary ai-pulse"></div>}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-secondary opacity-80">{formatTimestamp(feed.timestamp)}</span>
                                                <span className="bg-surface-variant px-2 py-0.5 rounded text-on-surface-variant">[{feed.tag}]</span>
                                                {feed.isUserScan && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">USER SCANNED</span>}
                                            </div>
                                            <div className={`border px-2 py-0.5 rounded font-bold ${getRiskColorClasses(feed.riskScore)}`}>
                                                Risk: {feed.riskScore}%
                                            </div>
                                        </div>
                                        <div className="text-on-surface text-sm font-body-md leading-relaxed">
                                            {feed.description}
                                        </div>
                                        <div className="mt-2 text-[10px] opacity-60 text-primary flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3" /> {feed.type}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
