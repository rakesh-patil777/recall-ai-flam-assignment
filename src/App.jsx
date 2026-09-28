import { AnimatePresence, motion } from 'framer-motion';
import AppShell from './components/layout/AppShell.jsx';
import Header from './components/layout/Header.jsx';
import LandingScreen from './components/landing/LandingScreen.jsx';
import LoadingScreen from './components/loading/LoadingScreen.jsx';
import OverviewScreen from './components/overview/OverviewScreen.jsx';
import FlashcardScreen from './components/flashcards/FlashcardScreen.jsx';
import QuizScreen from './components/quiz/QuizScreen.jsx';
import ResultsScreen from './components/results/ResultsScreen.jsx';
import ErrorScreen from './components/error/ErrorScreen.jsx';
import { useStudySession } from './hooks/useStudySession.js';

const BREADCRUMB_MAP = {
  loading: 'Synthesising…',
  overview: 'Study Overview',
  flashcards: 'Flashcards',
  quiz: 'Quiz',
  results: 'Results',
  error: 'Error',
};

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function App() {
  const session = useStudySession();
  const {
    view, status, error, input,
    studySet,
    generate, goToOverview, goToFlashcards, goToQuiz, goToResults, goToLanding,
    cardIndex, cardRevealed, revealCard, nextCard, prevCard, flipCard,
    activeQuestions, activeQuizIndex, activeSelectedOption, activeSubmittedAnswer,
    activeSelectOption, submitAnswer, nextQuestion, retryMode,
    score, incorrectIds, retryScore, startRetry,
  } = session;

  const breadcrumb = BREADCRUMB_MAP[view] ?? null;

  const navItems = ['overview', 'flashcards', 'quiz', 'results'];
  const navActions = {
    overview: goToOverview,
    flashcards: goToFlashcards,
    quiz: goToQuiz,
    results: goToResults,
  };

  return (
    <AppShell>
      <Header
        onLogoClick={goToLanding}
        breadcrumb={view !== 'landing' ? breadcrumb : null}
        rightContent={
          studySet && view !== 'landing' && view !== 'loading' ? (
            <div className="flex items-center gap-1.5">
              {navItems.map(v => (
                <button
                  key={v}
                  onClick={navActions[v]}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                    ${view === v
                      ? 'bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                    }
                  `}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          ) : null
        }
      />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" {...PAGE_VARIANTS}>
            <LandingScreen onGenerate={generate} isLoading={status === 'loading'} />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div key="loading" {...PAGE_VARIANTS}>
            <LoadingScreen topic={input} />
          </motion.div>
        )}

        {view === 'overview' && studySet && (
          <motion.div key="overview" {...PAGE_VARIANTS}>
            <OverviewScreen
              studySet={studySet}
              onFlashcards={goToFlashcards}
              onQuiz={goToQuiz}
            />
          </motion.div>
        )}

        {view === 'flashcards' && studySet && (
          <motion.div key="flashcards" {...PAGE_VARIANTS}>
            <FlashcardScreen
              flashcards={studySet.flashcards}
              cardIndex={cardIndex}
              cardRevealed={cardRevealed}
              onReveal={revealCard}
              onNext={nextCard}
              onPrev={prevCard}
              onFlip={flipCard}
              onQuiz={goToQuiz}
              onOverview={goToOverview}
            />
          </motion.div>
        )}

        {view === 'quiz' && (
          <motion.div key="quiz" {...PAGE_VARIANTS}>
            <QuizScreen
              questions={activeQuestions}
              quizIndex={activeQuizIndex}
              selectedOption={activeSelectedOption}
              submittedAnswer={activeSubmittedAnswer}
              onSelectOption={activeSelectOption}
              onSubmitAnswer={submitAnswer}
              onNextQuestion={nextQuestion}
              retryMode={retryMode}
            />
          </motion.div>
        )}

        {view === 'results' && (
          <motion.div key="results" {...PAGE_VARIANTS}>
            <ResultsScreen
              score={score}
              total={studySet?.quiz?.length ?? 0}
              incorrectIds={incorrectIds}
              retryMode={retryMode}
              retryScore={retryScore}
              retryTotal={session.retryQuestions?.length}
              onRetry={startRetry}
              onOverview={goToOverview}
              onFlashcards={goToFlashcards}
              onQuizAgain={goToQuiz}
              studySet={studySet}
            />
          </motion.div>
        )}

        {view === 'error' && (
          <motion.div key="error" {...PAGE_VARIANTS}>
            <ErrorScreen
              message={error}
              onRetry={() => generate(input)}
              onHome={goToLanding}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
