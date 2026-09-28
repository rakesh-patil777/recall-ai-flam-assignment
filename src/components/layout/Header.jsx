import { Sparkles, Home } from 'lucide-react';

export default function Header({ onLogoClick, breadcrumb, rightContent }) {
  return (
    <header className="glass-panel border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="RecallAI home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center shadow-glow-primary">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            RecallAI
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full border border-brand-indigo/30 bg-brand-indigo/10 text-[10px] font-bold tracking-widest text-brand-indigo uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
            Autonomous
          </span>
        </button>

        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 min-w-0 flex-1 justify-center">
            <span className="text-slate-600">/</span>
            <span className="truncate text-slate-300">{breadcrumb}</span>
          </div>
        )}

        {/* Right slot */}
        {rightContent && (
          <div className="flex items-center gap-2 shrink-0">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}
