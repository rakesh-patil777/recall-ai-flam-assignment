import { useEffect, useState } from 'react';
import { Sparkles, Brain, Layers, Target } from 'lucide-react';

const STAGES = [
  { id: 'parse',    Icon: Brain,    label: 'Parsing your content',    sub: 'Extracting topics, concepts & relationships' },
  { id: 'structure',Icon: Layers,   label: 'Structuring knowledge',   sub: 'Building flashcards & concept hierarchy' },
  { id: 'quiz',     Icon: Target,   label: 'Generating quiz',         sub: 'Crafting questions with answer explanations' },
  { id: 'validate', Icon: Sparkles, label: 'Validating study set',    sub: 'Running quality & completeness checks' },
];

export default function LoadingScreen({ topic }) {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 450);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timings = [0, 4000, 10000, 18000];
    const timers = timings.map((t, i) =>
      setTimeout(() => setActiveStage(Math.max(i, 0)), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let prog = 0;
    const speeds = [2, 0.8, 0.4, 0.2];
    let raf;
    const tick = () => {
      const speed = speeds[Math.min(activeStage, speeds.length - 1)];
      const cap = [30, 58, 82, 97][Math.min(activeStage, 3)];
      if (prog < cap) {
        prog = Math.min(cap, prog + speed);
        setProgress(prog);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeStage]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] gap-10 px-4 max-w-2xl mx-auto text-center">

      {/* Pulsing icon */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-brand-blue animate-ping" />
        <div className="relative z-10 w-20 h-20 rounded-full bg-brand-blue-dark flex items-center justify-center shadow-btn-primary">
          <Sparkles className="w-9 h-9 text-white" strokeWidth={1.8} />
        </div>
      </div>

      {/* Headline */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text tracking-tight">
          Building your study set{dots}
        </h2>
        {topic && (
          <p className="text-sm text-brand-muted max-w-sm leading-relaxed">
            <span className="text-brand-blue-dark font-semibold">"{topic.slice(0, 80)}{topic.length > 80 ? '…' : ''}"</span>
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 rounded-full bg-surface-border overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-blue-dark transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-[11px] text-brand-faint mt-1.5 font-mono">{Math.round(progress)}%</p>
      </div>

      {/* Stage list */}
      <div className="w-full max-w-sm flex flex-col gap-3 text-left">
        {STAGES.map((stage, i) => {
          const isDone   = i < activeStage;
          const isActive = i === activeStage;
          return (
            <div
              key={stage.id}
              className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-400 ${
                isActive
                  ? 'border-brand-blue-mid/60 bg-brand-blue shadow-card'
                  : isDone
                  ? 'border-brand-emerald/30 bg-brand-emerald-bg/40'
                  : 'border-surface-border opacity-40'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDone ? 'bg-brand-emerald/15' : isActive ? 'bg-brand-blue-dark/10' : 'bg-surface-2'
              }`}>
                {isDone ? (
                  <svg className="w-4 h-4 text-brand-emerald" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <stage.Icon
                    className={`w-4 h-4 ${isActive ? 'text-brand-blue-dark animate-pulse' : 'text-brand-faint'}`}
                    strokeWidth={1.8}
                  />
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold ${isDone ? 'text-brand-emerald' : isActive ? 'text-brand-text' : 'text-brand-muted'}`}>
                  {stage.label}
                </p>
                <p className="text-[11px] text-brand-faint">{stage.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
