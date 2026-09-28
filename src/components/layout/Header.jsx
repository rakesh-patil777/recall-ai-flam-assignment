import { Sparkles } from 'lucide-react';

export default function Header({ onLogoClick, breadcrumb, rightContent }) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-surface-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="RecallAI home"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-blue-dark flex items-center justify-center shadow-btn-primary">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base text-brand-text tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            RecallAI
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full border border-brand-blue-mid/40 bg-brand-blue text-[10px] font-bold tracking-widest text-brand-blue-dark uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
            Autonomous
          </span>
        </button>

        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="hidden md:flex items-center gap-2 text-sm text-brand-muted min-w-0 flex-1 justify-center">
            <span className="text-brand-faint">/</span>
            <span className="truncate text-brand-text font-medium">{breadcrumb}</span>
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
