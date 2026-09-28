import { z } from 'zod';

/**
 * Zod schema for individual flashcard
 */
export const FlashcardSchema = z.object({
  id: z.string().min(1).max(100).default(() => `fc-${Math.random().toString(36).substr(2, 9)}`),
  question: z.string().min(3, "Flashcard question must be at least 3 characters").max(1000, "Flashcard question cannot exceed 1000 characters"),
  answer: z.string().min(1, "Flashcard answer cannot be empty").max(2000, "Flashcard answer cannot exceed 2000 characters"),
  category: z.string().max(100).optional().default("Core Concept"),
});

/**
 * Zod schema for individual quiz question
 * Enforces exactly 4 multiple choice options and a valid correctAnswer index (0-3)
 */
export const QuizQuestionSchema = z.object({
  id: z.string().min(1).max(100).default(() => `q-${Math.random().toString(36).substr(2, 9)}`),
  question: z.string().min(5, "Quiz question must be at least 5 characters").max(1000, "Quiz question cannot exceed 1000 characters"),
  options: z.array(z.string().min(1, "Option text cannot be empty").max(500, "Option text cannot exceed 500 characters"))
    .length(4, "Each quiz question must have exactly 4 options"),
  correctAnswer: z.number().int().min(0).max(3, "correctAnswer index must be between 0 and 3"),
  explanation: z.string().min(5, "Explanation must be provided for the correct answer").max(2000, "Explanation cannot exceed 2000 characters"),
});

/**
 * Comprehensive Study Set Schema
 * Validates the full structure returned by Gemini/Groq or parsed from backend response
 */
export const StudySetSchema = z.object({
  title: z.string().min(2, "Study set title is required").max(300, "Study set title cannot exceed 300 characters"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Technical Interview"], {
    errorMap: () => ({ message: "Difficulty must be one of: Beginner, Intermediate, Advanced, Technical Interview" }),
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(3000, "Summary cannot exceed 3000 characters"),
  estimatedMinutes: z.number().int().positive().max(300).default(15),
  keyConcepts: z.array(z.string().max(200)).default([]),
  flashcards: z.array(FlashcardSchema).min(1, "At least 1 flashcard is required")
    .refine(
      items => new Set(items.map(fc => fc.id)).size === items.length,
      { message: "Flashcards must have unique IDs" }
    ),
  quiz: z.array(QuizQuestionSchema).min(1, "At least 1 quiz question is required")
    .refine(
      items => new Set(items.map(q => q.id)).size === items.length,
      { message: "Quiz questions must have unique IDs" }
    ),
});

/**
 * Validates and defensively coerces raw data into a safe StudySet
 * @param {unknown} data 
 * @returns {{ success: true, data: z.infer<typeof StudySetSchema> } | { success: false, error: string, details?: z.ZodIssue[] }}
 */
export function validateStudySet(data) {
  const result = StudySetSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const issueMessages = result.error.issues
    .map(i => `${i.path.join('.') || 'root'}: ${i.message}`)
    .join('; ');
    
  return {
    success: false,
    error: `Data failed schema validation: ${issueMessages}`,
    details: result.error.issues,
  };
}
