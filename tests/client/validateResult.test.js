import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateStudySetResult } from '../../src/lib/validateResult.js';

describe('Client Layer — validateStudySetResult & Normalization', () => {
  const serverPayload = {
    title: 'Operating Systems: Virtual Memory & Page Tables',
    difficulty: 'Advanced',
    summary: 'Virtual memory isolates process address spaces using multi-level page tables and TLBs. Time complexity for translation is O(1) with TLB hit.',
    estimatedMinutes: 20,
    keyConcepts: ['Page Table Walk', 'TLB Invalidation', 'Page Fault Handler'],
    flashcards: [
      {
        id: 'fc-1',
        question: 'What is a Translation Lookaside Buffer (TLB)?',
        answer: 'A hardware cache storing recent virtual-to-physical address translations.',
        category: 'Hardware Architecture',
      },
    ],
    quiz: [
      {
        id: 'q-1',
        question: 'What occurs during a TLB shootdown in a multi-core processor?',
        options: [
          'All cores immediately reboot the kernel',
          'An inter-processor interrupt (IPI) invalidates stale TLB entries on other cores',
          'Page tables are serialized to persistent NVMe swap',
          'CPU frequency is throttled to prevent cache coherence race conditions',
        ],
        correctAnswer: 1,
        explanation: 'Multi-core systems use IPIs to synchronize TLB invalidation across all executing cores.',
      },
    ],
  };

  it('Normalizes server fields to canonical client structure (topic, front, back, keyPoints)', () => {
    const result = validateStudySetResult(serverPayload);
    assert.strictEqual(result.valid, true);

    const clientSet = result.data;
    assert.strictEqual(clientSet.topic, serverPayload.title);
    assert.strictEqual(clientSet.flashcards[0].front, serverPayload.flashcards[0].question);
    assert.strictEqual(clientSet.flashcards[0].back, serverPayload.flashcards[0].answer);
    assert.deepStrictEqual(clientSet.keyPoints, serverPayload.keyConcepts);
    assert.strictEqual(clientSet.quiz.length, 1);
    assert.strictEqual(clientSet.quiz[0].options.length, 4);
  });

  it('Infers asymptotic complexity from summary when present', () => {
    const result = validateStudySetResult(serverPayload);
    assert.strictEqual(result.valid, true);
    assert.ok(result.data.complexity);
    assert.strictEqual(result.data.complexity.time, 'O(1)');
  });

  it('Rejects malformed client responses with clear error message', () => {
    const bad = { ...serverPayload, quiz: [] };
    const result = validateStudySetResult(bad);
    assert.strictEqual(result.valid, false);
    assert.match(result.error, /validation failed/i);
  });

  it('Rejects non-object responses safely', () => {
    assert.strictEqual(validateStudySetResult(null).valid, false);
    assert.strictEqual(validateStudySetResult(undefined).valid, false);
    assert.strictEqual(validateStudySetResult('not json').valid, false);
  });
});
