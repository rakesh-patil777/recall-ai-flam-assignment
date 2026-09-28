import { useState, useRef, useCallback, useEffect } from 'react';
import { generateStudySet } from '../lib/api.js';
import { validateStudySetResult } from '../lib/validateResult.js';

/**
 * Central state machine for the RecallAI study flow.
 *
 * view: 'landing' | 'loading' | 'overview' | 'flashcards' | 'quiz' | 'results' | 'review' | 'error'
 */
export function useStudySession() {
  // ─── Request lifecycle ───────────────────────────────────────────────────────
  const [view, setView] = useState('landing');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');

  // ─── Study content ───────────────────────────────────────────────────────────
  const [studySet, setStudySet] = useState(null);

  // ─── Flashcard state ─────────────────────────────────────────────────────────
  const [cardIndex, setCardIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);

  // ─── Quiz state ──────────────────────────────────────────────────────────────
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);   // index 0-3
  const [submittedAnswer, setSubmittedAnswer] = useState(null); // index 0-3 after submit
  const [incorrectIds, setIncorrectIds] = useState([]);          // quiz question ids
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // ─── Retry / review state ─────────────────────────────────────────────────────
  const [retryMode, setRetryMode] = useState(false);
  const [retryQuestions, setRetryQuestions] = useState([]);
  const [retryIndex, setRetryIndex] = useState(0);
  const [retryScore, setRetryScore] = useState(0);
  const [retrySelectedOption, setRetrySelectedOption] = useState(null);
  const [retrySubmittedAnswer, setRetrySubmittedAnswer] = useState(null);
  const [retryDone, setRetryDone] = useState(false);

  // ─── Stale-request protection ─────────────────────────────────────────────────
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  // Cleanup in-flight requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ─── Generate ─────────────────────────────────────────────────────────────────
  const generate = useCallback(async (rawInput) => {
    const trimmed = rawInput?.trim() ?? '';
    if (!trimmed) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Issue a new unique request id for stale-response guard
    const thisRequestId = ++requestIdRef.current;

    setInput(trimmed);
    setStatus('loading');
    setView('loading');
    setError(null);

    // Timeout safety net (60 s)
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
      const rawData = await generateStudySet(trimmed, controller.signal);

      clearTimeout(timeoutId);

      // Stale-response guard — ignore if a newer request has started
      if (thisRequestId !== requestIdRef.current) return;

      const validation = validateStudySetResult(rawData);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Reset all sub-state before setting new content
      resetStudyState();
      setStudySet(validation.data);
      setStatus('success');
      setView('overview');
    } catch (err) {
      clearTimeout(timeoutId);
      if (thisRequestId !== requestIdRef.current) return;

      if (err.name === 'AbortError') {
        setError('Generation was cancelled or timed out. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
      setStatus('error');
      setView('error');
    }
  }, []);

  const resetStudyState = () => {
    setCardIndex(0);
    setCardRevealed(false);
    setQuizIndex(0);
    setSelectedOption(null);
    setSubmittedAnswer(null);
    setIncorrectIds([]);
    setScore(0);
    setQuizDone(false);
    setRetryMode(false);
    setRetryQuestions([]);
    setRetryIndex(0);
    setRetryScore(0);
    setRetrySelectedOption(null);
    setRetrySubmittedAnswer(null);
    setRetryDone(false);
  };

  // ─── Navigation helpers ────────────────────────────────────────────────────────
  const goToOverview = () => setView('overview');
  const goToFlashcards = () => { setCardIndex(0); setCardRevealed(false); setView('flashcards'); };
  const goToQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setSubmittedAnswer(null);
    setScore(0);
    setIncorrectIds([]);
    setQuizDone(false);
    setRetryMode(false);
    setRetryQuestions([]);
    setRetryIndex(0);
    setRetryScore(0);
    setRetrySelectedOption(null);
    setRetrySubmittedAnswer(null);
    setRetryDone(false);
    setView('quiz');
  };
  const goToResults = () => setView('results');
  const goToLanding = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setView('landing');
    setStudySet(null);
    setStatus('idle');
    setError(null);
  };

  // ─── Flashcard controls ───────────────────────────────────────────────────────
  const revealCard = () => setCardRevealed(true);
  const nextCard = () => {
    if (!studySet) return;
    if (cardIndex < studySet.flashcards.length - 1) {
      setCardIndex(i => i + 1);
      setCardRevealed(false);
    }
  };
  const prevCard = () => {
    if (cardIndex > 0) {
      setCardIndex(i => i - 1);
      setCardRevealed(false);
    }
  };
  const flipCard = () => setCardRevealed(r => !r);

  // ─── Quiz controls ─────────────────────────────────────────────────────────────
  const selectOption = (idx) => {
    if (submittedAnswer !== null) return; // already answered
    setSelectedOption(idx);
  };

  const submitAnswer = () => {
    const currentSelected = retryMode ? retrySelectedOption : selectedOption;
    const currentSubmitted = retryMode ? retrySubmittedAnswer : submittedAnswer;
    if (currentSelected === null || currentSubmitted !== null || !studySet) return;

    const activeQuestions = retryMode ? retryQuestions : studySet.quiz;
    const activeIndex = retryMode ? retryIndex : quizIndex;
    const question = activeQuestions[activeIndex];
    if (!question) return;

    const isCorrect = currentSelected === question.correctAnswer;

    if (retryMode) {
      setRetrySubmittedAnswer(currentSelected);
      if (isCorrect) setRetryScore(s => s + 1);
    } else {
      setSubmittedAnswer(currentSelected);
      if (isCorrect) {
        setScore(s => s + 1);
      } else {
        setIncorrectIds(ids => (ids.includes(question.id) ? ids : [...ids, question.id]));
      }
    }
  };

  const nextQuestion = () => {
    if (retryMode) {
      if (retryIndex < retryQuestions.length - 1) {
        setRetryIndex(i => i + 1);
        setRetrySelectedOption(null);
        setRetrySubmittedAnswer(null);
      } else {
        setRetryDone(true);
        setView('results');
      }
    } else {
      if (!studySet) return;
      if (quizIndex < studySet.quiz.length - 1) {
        setQuizIndex(i => i + 1);
        setSelectedOption(null);
        setSubmittedAnswer(null);
      } else {
        setQuizDone(true);
        setView('results');
      }
    }
  };

  // ─── Mistake review ───────────────────────────────────────────────────────────
  const startRetry = () => {
    if (!studySet || incorrectIds.length === 0) return;
    const questions = studySet.quiz.filter(q => incorrectIds.includes(q.id));
    setRetryQuestions(questions);
    setRetryIndex(0);
    setRetryScore(0);
    setRetrySelectedOption(null);
    setRetrySubmittedAnswer(null);
    setRetryDone(false);
    setRetryMode(true);
    setView('quiz');
  };

  // Derive active quiz state based on retry mode
  const activeQuestions = retryMode ? retryQuestions : (studySet?.quiz ?? []);
  const activeQuizIndex = retryMode ? retryIndex : quizIndex;
  const activeSelectedOption = retryMode ? retrySelectedOption : selectedOption;
  const activeSubmittedAnswer = retryMode ? retrySubmittedAnswer : submittedAnswer;
  const activeScore = retryMode ? retryScore : score;
  const activeQuizDone = retryMode ? retryDone : quizDone;
  const activeSelectOption = retryMode
    ? (idx) => { if (retrySubmittedAnswer === null) setRetrySelectedOption(idx); }
    : selectOption;

  return {
    // view & status
    view, status, error, input,
    // content
    studySet,
    // actions
    generate, goToOverview, goToFlashcards, goToQuiz, goToResults, goToLanding,
    // flashcard
    cardIndex, cardRevealed, revealCard, nextCard, prevCard, flipCard,
    // quiz (active - works for both normal and retry)
    activeQuestions, activeQuizIndex, activeSelectedOption, activeSubmittedAnswer,
    activeScore, activeQuizDone, activeSelectOption,
    submitAnswer, nextQuestion,
    // results & review
    score, incorrectIds, retryMode, retryDone, retryScore, retryQuestions,
    startRetry,
  };
}
