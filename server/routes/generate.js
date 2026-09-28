import express from 'express';
import { generateStudySetFromGemini } from '../services/gemini.js';

const router = express.Router();

// Input boundary constants
const MIN_INPUT_LENGTH = 2;
const MAX_INPUT_LENGTH = 20000; // ~4,000 words safeguard

/**
 * Strips sensitive keys/tokens from error messages to avoid information disclosure
 */
function sanitizeErrorMessage(msg) {
  if (!msg || typeof msg !== 'string') return '';
  return msg
    .replace(/gsk_[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]')
    .replace(/AIza[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]')
    .replace(/AQ\.[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]');
}

router.post('/generate', async (req, res) => {
  try {
    const { input } = req.body || {};

    // 1. Validate existence and type
    if (input === undefined || input === null || typeof input !== 'string') {
      return res.status(400).json({
        error: 'Bad Request: "input" field is required and must be a string.',
        code: 'MISSING_INPUT',
      });
    }

    const trimmedInput = input.trim();

    // 2. Validate empty or too short input
    if (trimmedInput.length < MIN_INPUT_LENGTH) {
      return res.status(400).json({
        error: `Input is too short. Please provide at least ${MIN_INPUT_LENGTH} characters of study material or topic description.`,
        code: 'INPUT_TOO_SHORT',
      });
    }

    // 3. Validate maximum size limit
    if (trimmedInput.length > MAX_INPUT_LENGTH) {
      return res.status(400).json({
        error: `Input exceeds maximum limit of ${MAX_INPUT_LENGTH} characters. Please condense your study notes.`,
        code: 'INPUT_TOO_LARGE',
      });
    }

    // 4. Delegate to AI Service
    const studySet = await generateStudySetFromGemini(trimmedInput);

    return res.status(200).json({
      success: true,
      data: studySet,
    });
  } catch (error) {
    const sanitizedMsg = sanitizeErrorMessage(error.message);
    console.error('[RecallAI API Error]:', sanitizedMsg);

    const isValidationError = sanitizedMsg.includes('invalid study structure') || sanitizedMsg.includes('failed schema validation');
    const isRateLimit = sanitizedMsg.toLowerCase().includes('rate limit') || sanitizedMsg.includes('429') || sanitizedMsg.toLowerCase().includes('quota');
    const isUnconfigured = sanitizedMsg.toLowerCase().includes('not configured');
    const isTimeout = sanitizedMsg.toLowerCase().includes('timeout') || sanitizedMsg.toLowerCase().includes('timed out');

    let status = 502;
    let code = 'AI_SERVICE_ERROR';
    let userMessage = 'Failed to synthesize study set. Service encountered an error.';

    if (isValidationError) {
      status = 422;
      code = 'SCHEMA_VALIDATION_ERROR';
      userMessage = 'The AI synthesis output did not pass our strict quality validation checks. Please retry.';
    } else if (isRateLimit) {
      status = 429;
      code = 'RATE_LIMIT_EXCEEDED';
      userMessage = 'The AI service rate limit was reached. Please wait a few moments and try again.';
    } else if (isUnconfigured) {
      status = 503;
      code = 'SERVICE_UNCONFIGURED';
      userMessage = 'The AI service is not yet configured. Please configure an API key in server/.env.';
    } else if (isTimeout) {
      status = 504;
      code = 'GATEWAY_TIMEOUT';
      userMessage = 'The AI request timed out. Please try again with a shorter or more specific prompt.';
    }

    return res.status(status).json({
      error: userMessage,
      message: sanitizedMsg,
      code,
    });
  }
});

export default router;
