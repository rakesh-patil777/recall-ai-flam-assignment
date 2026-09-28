import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateStudySet, StudySetSchema } from '../../server/schemas/studySet.js';

describe('Phase 3 — Gemini / AI Response Validation (Cases A - S)', () => {
  const validBaseSet = {
    title: 'Binary Search Mastery',
    difficulty: 'Intermediate',
    summary: 'A comprehensive study guide covering binary search monotonic invariants and boundary traps.',
    estimatedMinutes: 15,
    keyConcepts: ['Monotonic Space', 'Loop Invariants', 'Overflow Safety'],
    flashcards: [
      {
        id: 'fc-1',
        question: 'What invariant is required for binary search?',
        answer: 'A monotonic ordering property across the search space.',
        category: 'Invariants',
      },
      {
        id: 'fc-2',
        question: 'How to avoid 32-bit integer overflow when calculating mid?',
        answer: 'Use mid = left + (right - left) / 2 instead of (left + right) / 2.',
        category: 'Numeric Safety',
      },
    ],
    quiz: [
      {
        id: 'q-1',
        question: 'Which midpoint expression is safe from 32-bit signed overflow?',
        options: [
          'mid = (left + right) / 2',
          'mid = left + (right - left) / 2',
          'mid = (left + right) >> 1',
          'mid = right - (right + left) / 2',
        ],
        correctAnswer: 1,
        explanation: 'Using left + (right - left) / 2 guarantees intermediate values never exceed right.',
      },
      {
        id: 'q-2',
        question: 'What is the runtime complexity of binary search over an array of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 1,
        explanation: 'The search partition is halved on each iteration, yielding logarithmic complexity.',
      },
    ],
  };

  it('Case A: Valid structured JSON passes validation', () => {
    const res = validateStudySet(validBaseSet);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.title, 'Binary Search Mastery');
    assert.strictEqual(res.data.quiz.length, 2);
    assert.strictEqual(res.data.flashcards.length, 2);
  });

  it('Case B: Empty response is rejected', () => {
    const res = validateStudySet('');
    assert.strictEqual(res.success, false);
    assert.match(res.error, /failed schema validation/i);
  });

  it('Case C: Null response is rejected', () => {
    const res = validateStudySet(null);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /failed schema validation/i);
  });

  it('Case D: Non-object / invalid JSON primitive is rejected', () => {
    const res = validateStudySet(12345);
    assert.strictEqual(res.success, false);
  });

  it('Case E: Missing title is rejected', () => {
    const bad = { ...validBaseSet, title: undefined };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /title/i);
  });

  it('Case F: Missing or too short summary is rejected', () => {
    const bad = { ...validBaseSet, summary: 'Short' };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /summary/i);
  });

  it('Case G: Missing or empty flashcards array is rejected', () => {
    const bad = { ...validBaseSet, flashcards: [] };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /flashcard/i);
  });

  it('Case H: Missing or empty quiz array is rejected', () => {
    const bad = { ...validBaseSet, quiz: [] };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /quiz/i);
  });

  it('Case I: Invalid difficulty is rejected', () => {
    const bad = { ...validBaseSet, difficulty: 'ExtremeSuperHard' };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /difficulty/i);
  });

  it('Case J: Quiz question with fewer than 4 options is rejected', () => {
    const bad = {
      ...validBaseSet,
      quiz: [
        {
          id: 'q-1',
          question: 'Valid question text here?',
          options: ['Option 1', 'Option 2', 'Option 3'], // only 3
          correctAnswer: 0,
          explanation: 'Valid explanation here',
        },
      ],
    };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /options/i);
  });

  it('Case K: Quiz question with more than 4 options is rejected', () => {
    const bad = {
      ...validBaseSet,
      quiz: [
        {
          id: 'q-1',
          question: 'Valid question text here?',
          options: ['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4', 'Opt 5'], // 5 options
          correctAnswer: 0,
          explanation: 'Valid explanation here',
        },
      ],
    };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /options/i);
  });

  it('Case L: Invalid correctAnswer index is rejected (negative, >= 4, or float)', () => {
    const badNegative = {
      ...validBaseSet,
      quiz: [{ ...validBaseSet.quiz[0], correctAnswer: -1 }],
    };
    assert.strictEqual(validateStudySet(badNegative).success, false);

    const badOutOfRange = {
      ...validBaseSet,
      quiz: [{ ...validBaseSet.quiz[0], correctAnswer: 4 }],
    };
    assert.strictEqual(validateStudySet(badOutOfRange).success, false);

    const badFloat = {
      ...validBaseSet,
      quiz: [{ ...validBaseSet.quiz[0], correctAnswer: 1.5 }],
    };
    assert.strictEqual(validateStudySet(badFloat).success, false);
  });

  it('Case M: Missing explanation is rejected', () => {
    const bad = {
      ...validBaseSet,
      quiz: [{ ...validBaseSet.quiz[0], explanation: '' }],
    };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /explanation/i);
  });

  it('Case N: Wrong data types (e.g. estimatedMinutes as string) are rejected', () => {
    const bad = { ...validBaseSet, estimatedMinutes: 'fifteen' };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
  });

  it('Case O: Duplicate question IDs are rejected', () => {
    const bad = {
      ...validBaseSet,
      quiz: [
        { ...validBaseSet.quiz[0], id: 'duplicate-q-id' },
        { ...validBaseSet.quiz[1], id: 'duplicate-q-id' },
      ],
    };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /unique/i);
  });

  it('Case P: Excessively long generated content is rejected by length safeguards', () => {
    const badLongTitle = { ...validBaseSet, title: 'A'.repeat(301) };
    assert.strictEqual(validateStudySet(badLongTitle).success, false);

    const badLongSummary = { ...validBaseSet, summary: 'B'.repeat(3001) };
    assert.strictEqual(validateStudySet(badLongSummary).success, false);
  });

  it('Case Q: Unexpected additional fields are stripped cleanly by Zod object parsing', () => {
    const withExtraFields = {
      ...validBaseSet,
      unexpectedRogueField: 'should be stripped',
      dangerousScript: '<script>alert(1)</script>',
    };
    const res = validateStudySet(withExtraFields);
    assert.strictEqual(res.success, true);
    assert.strictEqual('unexpectedRogueField' in res.data, false);
    assert.strictEqual('dangerousScript' in res.data, false);
  });

  it('Case R: Malformed structured output (e.g. options as string instead of array) is rejected', () => {
    const bad = {
      ...validBaseSet,
      quiz: [{ ...validBaseSet.quiz[0], options: 'A, B, C, D' }],
    };
    const res = validateStudySet(bad);
    assert.strictEqual(res.success, false);
  });

  it('Case S: Refusal or safety-related response object is rejected', () => {
    const refusal = {
      error: 'I cannot fulfill this request due to safety guidelines.',
    };
    const res = validateStudySet(refusal);
    assert.strictEqual(res.success, false);
    assert.match(res.error, /title/i);
  });
});
