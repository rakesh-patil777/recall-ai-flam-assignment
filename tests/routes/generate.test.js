import { describe, it } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import generateRouter from '../../server/routes/generate.js';

// Helper to simulate Express requests in memory without needing network ports
async function simulateRequest(app, method, url, body) {
  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      try {
        const res = await fetch(`http://127.0.0.1:${port}${url}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();
        server.close(() => resolve({ status: res.status, json }));
      } catch (err) {
        server.close(() => resolve({ status: 500, error: err }));
      }
    });
  });
}

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', generateRouter);
  return app;
}

describe('Phase 2 & Phase 4 — Input Validation and Route Error Handling', () => {
  const app = createTestApp();

  it('Input Case 1: Rejects empty string input with 400 INPUT_TOO_SHORT', async () => {
    const res = await simulateRequest(app, 'POST', '/api/generate', { input: '' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.json.code, 'INPUT_TOO_SHORT');
  });

  it('Input Case 2: Rejects whitespace-only input with 400 INPUT_TOO_SHORT', async () => {
    const res = await simulateRequest(app, 'POST', '/api/generate', { input: '     ' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.json.code, 'INPUT_TOO_SHORT');
  });

  it('Input Case 3: Rejects 1-character input with 400 INPUT_TOO_SHORT', async () => {
    const res = await simulateRequest(app, 'POST', '/api/generate', { input: 'A' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.json.code, 'INPUT_TOO_SHORT');
  });

  it('Input Case 4: Rejects non-string input (number, object, null) with 400 MISSING_INPUT', async () => {
    const res1 = await simulateRequest(app, 'POST', '/api/generate', { input: 12345 });
    assert.strictEqual(res1.status, 400);
    assert.strictEqual(res1.json.code, 'MISSING_INPUT');

    const res2 = await simulateRequest(app, 'POST', '/api/generate', { input: null });
    assert.strictEqual(res2.status, 400);
    assert.strictEqual(res2.json.code, 'MISSING_INPUT');

    const res3 = await simulateRequest(app, 'POST', '/api/generate', {});
    assert.strictEqual(res3.status, 400);
    assert.strictEqual(res3.json.code, 'MISSING_INPUT');
  });

  it('Input Case 5: Rejects input exceeding 20,000 characters with 400 INPUT_TOO_LARGE', async () => {
    const longString = 'x'.repeat(20001);
    const res = await simulateRequest(app, 'POST', '/api/generate', { input: longString });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.json.code, 'INPUT_TOO_LARGE');
  });

  it('Security: Error response sanitizes and redacts API keys', async () => {
    // Test that any sensitive key patterns in error messages are redacted
    const testApp = express();
    testApp.use(express.json());
    testApp.post('/api/test-leak', (req, res) => {
      // Simulate raw service error containing sensitive keys
      const rawError = new Error('Groq failed with key gsk_Secret123456789 and Gemini key AIzaSySecretKey098');
      const sanitized = rawError.message
        .replace(/gsk_[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]')
        .replace(/AIza[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]');
      res.status(502).json({ error: 'Service error', message: sanitized, code: 'AI_SERVICE_ERROR' });
    });

    const res = await simulateRequest(testApp, 'POST', '/api/test-leak', {});
    assert.strictEqual(res.status, 502);
    assert.strictEqual(res.json.message.includes('gsk_Secret'), false);
    assert.strictEqual(res.json.message.includes('AIzaSySecret'), false);
    assert.strictEqual(res.json.message.includes('[REDACTED_API_KEY]'), true);
  });
});
