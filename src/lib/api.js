/**
 * Frontend API layer — all backend communication goes through here.
 * React components must never call fetch() directly or touch Gemini.
 */

const RAW_BASE = import.meta.env?.VITE_API_URL;
const API_BASE = RAW_BASE ? `${RAW_BASE.replace(/\/$/, '')}/api` : '/api';
const HEALTH_BASE = RAW_BASE ? `${RAW_BASE.replace(/\/$/, '')}/health` : '/health';
const TIMEOUT_MS = 60_000; // 60 seconds for AI generation

/**
 * Generate a structured study set from free-form input.
 * Includes AbortController support to cancel stale requests.
 *
 * @param {string} input  - User's study notes or topic description
 * @param {AbortSignal} [signal] - AbortController signal for cancellation
 * @returns {Promise<import('../lib/validateResult.js').ClientStudySet>}
 */
export async function generateStudySet(input, signal) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    signal,
  });

  const json = await response.json().catch(() => ({
    error: 'Server returned an unparseable response.',
  }));

  if (!response.ok) {
    const errorMessage =
      json.error ||
      json.message ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.code = json.code || 'API_ERROR';
    error.status = response.status;
    throw error;
  }

  if (!json.success || !json.data) {
    throw new Error('Server response missing expected "data" payload.');
  }

  return json.data;
}

/**
 * Check server health and whether Gemini is configured.
 * @returns {Promise<{ status: string, geminiConfigured: boolean, mode: string }>}
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(HEALTH_BASE, { method: 'GET' });
    return await res.json();
  } catch {
    return { status: 'unreachable', geminiConfigured: false, mode: 'offline' };
  }
}
