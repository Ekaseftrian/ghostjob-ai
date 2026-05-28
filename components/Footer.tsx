export function Footer() {
    return (
        <footer className="bg-surface-container-lowest text-primary font-body-sm font-headline-sm border-t border-outline-variant w-full px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="flex flex-col items-center md:items-start gap-2">
                <span className="font-headline-sm text-lg font-bold">GhostJob AI</span>
                <span className="font-mono-data text-xs text-on-surface-variant">© 2026 GHOSTJOB AI // NEURAL DEFENSE ENGINE</span>
                <span className="font-mono-data text-[10px] text-outline">Job seeker defense system built securely on Gemini 3.1.</span>
            </div>
            
            <div className="font-mono-label text-sm text-on-surface-variant flex items-center gap-2">
                <span className="text-secondary opacity-80">{'<'}</span>
                Made by Eka Seftrian
                <span className="text-secondary opacity-80">{'>'}</span>
            </div>
        </footer>
    );
}
