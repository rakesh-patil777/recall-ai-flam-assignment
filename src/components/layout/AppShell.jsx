export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-canvas text-brand-text relative overflow-x-hidden">
      {/* Subtle ambient washes — blue top-left, peach bottom-right */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-brand-blue opacity-50 blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-brand-peach opacity-40 blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-40 rounded-full bg-brand-blue opacity-30 blur-3xl" />
      </div>
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
