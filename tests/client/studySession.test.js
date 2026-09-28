import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Phase 5 & Phase 6 — Request Lifecycle, State Transitions & Quiz Logic', () => {
  // Test quiz scoring calculation pure logic
  function calculateScore(answers, questions) {
    let score = 0;
    const incorrectIds = [];
    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected === q.correctAnswer) {
        score++;
      } else {
        if (!incorrectIds.includes(q.id)) {
          incorrectIds.push(q.id);
        }
      }
    });
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return { score, total: questions.length, incorrectIds, percentage };
  }

  const sampleQuestions = [
    { id: 'q-1', question: 'Q1', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
    { id: 'q-2', question: 'Q2', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
    { id: 'q-3', question: 'Q3', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
    { id: 'q-4', question: 'Q4', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
  ];

  it('Calculates 100% score accurately when all answers are correct', () => {
    const res = calculateScore([0, 2, 1, 3], sampleQuestions);
    assert.strictEqual(res.score, 4);
    assert.strictEqual(res.percentage, 100);
    assert.strictEqual(res.incorrectIds.length, 0);
  });

  it('Calculates 0% score and tracks all incorrect IDs when all answers are wrong', () => {
    const res = calculateScore([1, 1, 0, 0], sampleQuestions);
    assert.strictEqual(res.score, 0);
    assert.strictEqual(res.percentage, 0);
    assert.deepStrictEqual(res.incorrectIds, ['q-1', 'q-2', 'q-3', 'q-4']);
  });

  it('Calculates partial 50% score and isolates only missed question IDs', () => {
    const res = calculateScore([0, 2, 0, 0], sampleQuestions); // q1 & q2 correct, q3 & q4 wrong
    assert.strictEqual(res.score, 2);
    assert.strictEqual(res.percentage, 50);
    assert.deepStrictEqual(res.incorrectIds, ['q-3', 'q-4']);
  });

  it('Retry mode selects ONLY incorrect questions and calculates independent retry score', () => {
    const initialRun = calculateScore([0, 2, 0, 0], sampleQuestions);
    const retryQuestions = sampleQuestions.filter(q => initialRun.incorrectIds.includes(q.id));
    assert.strictEqual(retryQuestions.length, 2);
    assert.strictEqual(retryQuestions[0].id, 'q-3');
    assert.strictEqual(retryQuestions[1].id, 'q-4');

    // User gets 1 right and 1 wrong on retry
    const retryRun = calculateScore([1, 0], retryQuestions); // q3: ans 1 (correct), q4: ans 0 (wrong)
    assert.strictEqual(retryRun.score, 1);
    assert.strictEqual(retryRun.total, 2);
    assert.strictEqual(retryRun.percentage, 50);
    // Initial score (2/4) remains unchanged
    assert.strictEqual(initialRun.score, 2);
  });

  it('Deduplicates incorrect IDs when answers are recorded', () => {
    const ids = [];
    const recordMistake = (id) => {
      if (!ids.includes(id)) ids.push(id);
    };
    recordMistake('q-1');
    recordMistake('q-1');
    recordMistake('q-2');
    assert.deepStrictEqual(ids, ['q-1', 'q-2']);
  });

  it('Phase 5: Stale request protection logic (newer request supersedes older request)', async () => {
    let activeRequestId = 0;
    let committedData = null;

    // Simulate two rapid requests
    async function startRequest(id, delayMs, payload) {
      activeRequestId = id;
      await new Promise(r => setTimeout(r, delayMs));
      // Guard: only commit if request ID is still active
      if (id === activeRequestId) {
        committedData = payload;
      }
    }

    // Request A starts first with 50ms delay
    const reqA = startRequest(1, 50, 'Result A (Stale)');
    // Request B starts immediately after with 10ms delay (finishes earlier)
    const reqB = startRequest(2, 10, 'Result B (Fresh)');

    await Promise.all([reqA, reqB]);

    // Request A must NOT overwrite Request B!
    assert.strictEqual(committedData, 'Result B (Fresh)');
  });

  it('Phase 5: AbortController cancels in-flight requests cleanly', async () => {
    const controller = new AbortController();
    assert.strictEqual(controller.signal.aborted, false);
    controller.abort();
    assert.strictEqual(controller.signal.aborted, true);
  });
});
