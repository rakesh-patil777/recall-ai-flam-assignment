import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  const hasGemini = !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
    process.env.GEMINI_API_KEY !== 'your_api_key_here'
  );
  const hasGroq = !!(
    process.env.GROQ_API_KEY &&
    process.env.GROQ_API_KEY.trim() !== '' &&
    process.env.GROQ_API_KEY !== 'your_groq_api_key_here'
  );
  const hasApiKey = hasGemini || hasGroq;
  const provider = hasGemini ? 'Google Gemini' : hasGroq ? 'Groq (qwen3.8-27b)' : 'None';
  console.log(`✦ RecallAI Server running on http://localhost:${PORT}`);
  console.log(`✦ Mode: ${hasApiKey ? `🟢 Live (${provider})` : '🟡 Demo (no API key)'}`);
});
