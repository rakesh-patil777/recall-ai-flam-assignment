import { z } from 'zod';

// ─── Raw AI response schema (server-side field names) ────────────────────
const RawFlashcardSchema = z.object({
  id: z.string().min(1).max(100).default(() => `fc-${Math.random().toString(36).substr(2, 9)}`),
  question: z.string().min(3, 'Flashcard question must be at least 3 characters').max(1000),
  answer: z.string().min(1, 'Flashcard answer cannot be empty').max(2000),
  category: z.string().max(100).optional().default('Core Concept'),
});

const RawQuizQuestionSchema = z.object({
  id: z.string().min(1).max(100).default(() => `q-${Math.random().toString(36).substr(2, 9)}`),
  question: z.string().min(5, 'Quiz question must be at least 5 characters').max(1000),
  options: z.array(z.string().min(1).max(500)).length(4, 'Quiz question must have exactly 4 options'),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(5, 'Explanation must be at least 5 characters').max(2000),
});

const RawStudySetSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(300),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Technical Interview'], {
    errorMap: () => ({ message: 'Invalid difficulty level' }),
  }),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(3000),
  estimatedMinutes: z.number().int().positive().max(300).default(15),
  keyConcepts: z.array(z.string().max(200)).default([]),
  flashcards: z.array(RawFlashcardSchema).min(1, 'At least 1 flashcard is required')
    .refine(items => new Set(items.map(f => f.id)).size === items.length, { message: 'Duplicate flashcard IDs' }),
  quiz: z.array(RawQuizQuestionSchema).min(1, 'At least 1 quiz question is required')
    .refine(items => new Set(items.map(q => q.id)).size === items.length, { message: 'Duplicate quiz question IDs' }),
});

/**
 * Normalizes raw server response to the canonical client StudySet shape
 * used by every component in this app.
 *
 * Server → Client field mapping:
 *   title         → topic
 *   question      → front  (flashcard)
 *   answer        → back   (flashcard)
 *   keyConcepts   → keyPoints
 *
 * The `commonMistakes` field is synthesised from the raw data if absent.
 *
 * @typedef {Object} ClientStudySet
 * @property {string}   topic
 * @property {string}   subject         - keyConcepts joined (for display badge)
 * @property {string}   difficulty
 * @property {string}   summary
 * @property {number}   estimatedMinutes
 * @property {string[]} keyPoints
 * @property {string[]} commonMistakes
 * @property {{ id: string, front: string, back: string, hint?: string, category?: string }[]} flashcards
 * @property {{ id: string, question: string, options: string[], correctAnswer: number, explanation: string }[]} quiz
 * @property {{ time?: string, space?: string } | null} complexity
 */
function normalizeToClientShape(raw) {
  const flashcards = raw.flashcards.map(fc => ({
    id: fc.id,
    front: fc.question,
    back: fc.answer,
    category: fc.category,
    hint: undefined,
  }));

  // Infer complexity from keyConcepts / summary if possible
  let complexity = null;
  const summaryLower = (raw.summary ?? '').toLowerCase();
  const timePat = /o\(([^)]+)\).*?time|time.*?o\(([^)]+)\)/i.exec(raw.summary ?? '');
  const spacePat = /o\(([^)]+)\).*?space|space.*?o\(([^)]+)\)/i.exec(raw.summary ?? '');
  if (timePat || spacePat) {
    complexity = {
      time: timePat ? `O(${timePat[1] || timePat[2]})` : undefined,
      space: spacePat ? `O(${spacePat[1] || spacePat[2]})` : undefined,
    };
  }
  // Simple O(log N), O(N) detection in title
  if (!complexity) {
    const tp = /O\([^)]+\)/g.exec(raw.title ?? '');
    if (tp) complexity = { time: tp[0] };
  }

  // Extract common mistakes from quiz explanations (heuristic)
  const commonMistakes = raw.quiz
    .slice(0, 3)
    .map(q => q.explanation)
    .filter(Boolean)
    .map(exp => exp.slice(0, 120) + (exp.length > 120 ? '…' : ''));

  return {
    topic: raw.title,
    subject: raw.keyConcepts?.slice(0, 2).join(' · ') || null,
    difficulty: raw.difficulty,
    summary: raw.summary,
    estimatedMinutes: raw.estimatedMinutes,
    keyPoints: raw.keyConcepts ?? [],
    commonMistakes,
    flashcards,
    quiz: raw.quiz,
    complexity,
  };
}

/**
 * Validates raw server response and returns normalized client shape.
 * @param {unknown} responseData
 * @returns {{ valid: boolean, data?: ClientStudySet, error?: string }}
 */
export function validateStudySetResult(responseData) {
  if (!responseData || typeof responseData !== 'object') {
    return { valid: false, error: 'Received empty or non-object response from study synthesis engine.' };
  }

  const parseResult = RawStudySetSchema.safeParse(responseData);

  if (!parseResult.success) {
    const errorDetails = parseResult.error.issues
      .map(issue => `[${issue.path.join('.') || 'root'}]: ${issue.message}`)
      .join('; ');
    return { valid: false, error: `Validation failed: ${errorDetails}` };
  }

  return { valid: true, data: normalizeToClientShape(parseResult.data) };
}

// Legacy export alias (kept for type imports)
export const ClientStudySetSchema = RawStudySetSchema;
