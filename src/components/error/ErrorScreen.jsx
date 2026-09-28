import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorScreen({ message, onRetry, onHome }) {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
      <div className="w-16 h-16 rounded-2xl border border-brand-rose/30 bg-brand-rose/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-brand-rose" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-white">Generation Failed</h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
          {message || 'Something went wrong while generating your study set. Please check your connection and try again.'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          id="error-retry-btn"
          onClick={onRetry}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-brand-indigo to-brand-violet shadow-glow-primary
            hover:opacity-90 transition-all duration-150
          "
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        <button
          id="error-home-btn"
          onClick={onHome}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-400 border border-white/[0.08]
            hover:text-white hover:border-white/20 transition-all duration-150
          "
        >
          <Home className="w-4 h-4" /> Back Home
        </button>
      </div>
    </main>
  );
}
