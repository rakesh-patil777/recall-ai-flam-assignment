import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorScreen({ message, onRetry, onHome }) {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
      <div className="w-16 h-16 rounded-2xl border border-brand-rose/30 bg-brand-rose-bg flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-brand-rose" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-brand-text">Generation Failed</h2>
        <p className="text-sm text-brand-muted leading-relaxed max-w-sm">
          {message || 'Something went wrong while generating your study set. Please check your connection and try again.'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          id="error-retry-btn"
          onClick={onRetry}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
            bg-brand-blue-dark shadow-btn-primary
            hover:bg-blue-700 transition-all duration-150
          "
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        <button
          id="error-home-btn"
          onClick={onHome}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-brand-muted border border-surface-border bg-white shadow-card
            hover:text-brand-text hover:border-brand-blue-mid/50 transition-all duration-150
          "
        >
          <Home className="w-4 h-4" /> Back Home
        </button>
      </div>
    </main>
  );
}
