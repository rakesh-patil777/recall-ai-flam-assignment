import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import generateRouter from './routes/generate.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '100kb' }));

// Routes
app.use('/api', generateRouter);

// Health check
app.get('/health', (_, res) => {
  const hasGemini = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' && process.env.GEMINI_API_KEY !== 'your_api_key_here');
  const hasGroq = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '' && process.env.GROQ_API_KEY !== 'your_groq_api_key_here');
  const hasApiKey = hasGemini || hasGroq;
  res.json({
    status: 'ok',
    service: 'RecallAI Backend',
    geminiConfigured: hasApiKey,
    provider: hasGemini ? 'gemini' : (hasGroq ? 'groq' : 'none'),
    mode: hasApiKey ? 'live' : 'demo',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[RecallAI Server Uncaught Error]:', err);
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
});

app.listen(PORT, () => {
  const hasGemini = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' && process.env.GEMINI_API_KEY !== 'your_api_key_here');
  const hasGroq = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '' && process.env.GROQ_API_KEY !== 'your_groq_api_key_here');
  const hasApiKey = hasGemini || hasGroq;
  const provider = hasGemini ? 'Google Gemini' : (hasGroq ? 'Groq (qwen3.8-27b)' : 'None');
  console.log(`✦ RecallAI Server running on http://localhost:${PORT}`);
  console.log(`✦ Mode: ${hasApiKey ? `🟢 Live (${provider})` : '🟡 Demo (no API key)'}`);
});
