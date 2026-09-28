import { Check, X, ChevronRight } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen({
  questions, quizIndex, selectedOption, submittedAnswer,
  onSelectOption, onSubmitAnswer, onNextQuestion, retryMode,
}) {
  const total = questions?.length ?? 0;
  const question = questions?.[quizIndex];
  const progress = total ? ((quizIndex) / total) * 100 : 0;

  if (!question) return null;

  const isAnswered = submittedAnswer !== null;
  const isCorrect = isAnswered && submittedAnswer === question.correctAnswer;

  const getOptionState = (idx) => {
    if (!isAnswered) {
      return selectedOption === idx ? 'selected' : 'idle';
    }
    if (idx === question.correctAnswer) return 'correct';
    if (idx === submittedAnswer && submittedAnswer !== question.correctAnswer) return 'wrong';
    return 'idle';
  };

  const optionStyles = {
    idle: 'border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-brand-indigo/30 hover:bg-brand-indigo/5 cursor-pointer',
    selected: 'border-brand-indigo/60 bg-brand-indigo/15 text-white cursor-pointer shadow-glow-primary',
    correct: 'border-brand-emerald/60 bg-brand-emerald/10 text-brand-emerald cursor-default',
    wrong: 'border-brand-rose/60 bg-brand-rose/10 text-brand-rose cursor-default',
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {retryMode && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-amber border border-brand-amber/30 bg-brand-amber/10 px-2 py-0.5 rounded-full">
              Retry Mode
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {quizIndex + 1} / {total}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-indigo transition-all duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-indigo/20 to-brand-violet/10 border border-brand-indigo/20 flex items-center justify-center text-xs font-bold text-brand-indigo shrink-0">
            Q{quizIndex + 1}
          </div>
          <p className="text-base sm:text-lg font-semibold text-white leading-snug pt-1">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options?.map((opt, idx) => {
            const state = getOptionState(idx);
            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                onClick={() => !isAnswered && onSelectOption(idx)}
                disabled={isAnswered}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left
                  transition-all duration-150 text-sm font-medium
                  ${optionStyles[state]}
                  ${isAnswered ? 'cursor-default' : ''}
                `}
              >
                <span className={`
                  w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0
                  ${state === 'correct' ? 'bg-brand-emerald/20 text-brand-emerald' :
                    state === 'wrong' ? 'bg-brand-rose/20 text-brand-rose' :
                    state === 'selected' ? 'bg-brand-indigo/20 text-brand-indigo' :
                    'bg-white/[0.05] text-slate-500'}
                `}>
                  {state === 'correct' ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> :
                   state === 'wrong' ? <X className="w-3.5 h-3.5" strokeWidth={3} /> :
                   OPTION_LABELS[idx]}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {isAnswered && question.explanation && (
          <div className={`rounded-xl p-4 border flex items-start gap-3 text-sm ${
            isCorrect
              ? 'border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald'
              : 'border-brand-amber/20 bg-brand-amber/5 text-brand-amber'
          }`}>
            <span className="text-lg shrink-0">{isCorrect ? '✅' : '💡'}</span>
            <p className="leading-relaxed text-slate-300">
              <span className={`font-bold mr-1 ${isCorrect ? 'text-brand-emerald' : 'text-brand-amber'}`}>
                {isCorrect ? 'Correct! ' : 'Not quite. '}
              </span>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          {!isAnswered ? (
            <button
              id="quiz-submit-btn"
              onClick={onSubmitAnswer}
              disabled={selectedOption === null}
              className="
                ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-brand-indigo to-brand-violet shadow-glow-primary
                hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150
              "
            >
              Submit Answer
            </button>
          ) : (
            <button
              id="quiz-next-btn"
              onClick={onNextQuestion}
              className="
                ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-brand-indigo to-brand-violet shadow-glow-primary
                hover:opacity-90 transition-all duration-150
              "
            >
              {quizIndex < total - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
