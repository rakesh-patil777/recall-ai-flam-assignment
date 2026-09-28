# RecallAI — Autonomous AI Study Workspace

<div align="center">

**Turn raw knowledge into permanent memory.**

An AI-powered study tool that transforms free-form notes, topics, and textbook excerpts into structured overviews, interactive 3D flashcards, and diagnostic quizzes — without conversational clutter.

[🚀 Live Demo](https://recall-ai-flam-assignment.vercel.app/) · [Screen Recording](#screen-recording) · [Architecture](#architecture)

<br/>

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://recall-ai-flam-assignment.vercel.app/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-recall--ai--flam--assignment.vercel.app-00df8f?style=flat-square&logo=google-chrome&logoColor=white)](https://recall-ai-flam-assignment.vercel.app/)

</div>

---

## ✦ What is RecallAI?

RecallAI is **not a chatbot**. It is a structured AI study workspace that takes your unorganized study material and produces:

1. **Study Overview** — Topic title, difficulty badge, key concepts, common traps, and complexity analysis
2. **Interactive Flashcards** — 3D flip cards with keyboard navigation (← → Space) and progress tracking
3. **Diagnostic Quiz** — 4-option multiple-choice with instant grading, explanations, and visual feedback
4. **Results Dashboard** — Radial score visualization, grade classification, and missed question review
5. **Retry Mode** — Re-quiz only the questions you got wrong for targeted weak-area practice

The AI's output is treated as **structured application data**, validated through Zod schemas at both server and client layers, and rendered through real interactive React components.

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 3, Framer Motion |
| Backend | Express.js, Node.js |
| AI | Google Gemini 1.5 Flash (structured JSON output) |
| Validation | Zod (dual-layer: server + client) |
| Icons | Lucide React |
| Typography | Plus Jakarta Sans, Inter, JetBrains Mono |

---

## ✦ Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- (Optional) Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/rakesh-patil777/recall-ai-flam-assignment.git
cd recall-ai-flam-assignment

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (or leave blank for demo mode)

# Start development (runs both frontend + backend)
npm run dev
```

The app will be available at `http://localhost:5173`.

### Demo Mode

If no `GEMINI_API_KEY` is provided, the server returns a high-fidelity pre-built study set (Binary Search for Technical Interviews) so you can explore the full UI without an API key.

---

## ✦ Architecture

```
User Input (free-form text)
        ↓
React Frontend (Vite + Tailwind)
        ↓
POST /api/generate
        ↓
Express Backend
        ↓
Google Gemini API (structured JSON schema)
        ↓
Server-side Zod Validation
        ↓
Client-side Zod Validation + Normalization
        ↓
React State Machine (useStudySession hook)
        ↓
Interactive UI Components
```

### Key Design Decisions

**State Machine Architecture** — The entire study flow is managed by a single `useStudySession` custom hook that acts as a finite state machine. Views (`landing → loading → overview → flashcards → quiz → results → error`) are driven by state, not by a router. This keeps the data flow unidirectional and predictable.

**Dual-Layer Validation** — Both the server (`server/schemas/studySet.js`) and client (`src/lib/validateResult.js`) independently validate AI output through Zod. The server validates immediately after Gemini responds; the client re-validates and normalizes field names before rendering. This ensures no malformed data reaches components even if the server schema drifts.

**Field Normalization** — The Gemini API returns field names like `title`, `question` (flashcards), and `keyConcepts`. The client normalizes these to component-friendly names (`topic`, `front`, `keyPoints`) to decouple API shape from UI shape.

**Stale Request Protection** — A monotonically increasing `requestIdRef` ensures that if a user fires multiple generate requests in rapid succession, only the latest response is applied to state. Older responses are silently discarded.

**AbortController Timeout** — Every request has a 60-second timeout implemented via `AbortController`. If the previous request is still in-flight when a new one starts, it is aborted.

---

## ✦ Handling AI Output Failures

| Scenario | How It's Handled |
|----------|-----------------|
| **Empty response** | Zod `.min(1)` constraints reject empty strings; user sees error screen |
| **Missing fields** | Zod `.default()` fills safe defaults (e.g., `difficulty → "Intermediate"`) |
| **Wrong field types** | Zod type coercion catches type mismatches; error screen with retry |
| **Extra/unknown fields** | Zod strips unknown keys silently |
| **Malformed JSON** | Server-side try/catch on `JSON.parse` returns 502 with friendly message |
| **Markdown-wrapped JSON** | Server strips ` ```json ` fences before parsing |
| **Wrong number of options** | Zod `.length(4)` enforces exactly 4 quiz options |
| **Invalid correctAnswer index** | Zod `.min(0).max(3)` rejects out-of-range indices |
| **No flashcards or quiz** | Zod `.min(1)` ensures at least 1 flashcard and 1 quiz question |
| **Network timeout** | AbortController cancels after 60s; error screen shown |
| **Server unreachable** | Fetch catch block surfaces user-friendly error |
| **Stale response race** | Request ID guard prevents older responses from overwriting newer state |

---

## ✦ UI/UX Features

- **Dark-first design** with deep navy/near-black backgrounds and violet/indigo accent system
- **Glassmorphism** panels with backdrop blur
- **3D flashcard flip** with CSS `transform: rotateY(180deg)` and `preserve-3d`
- **Keyboard navigation** — Arrow keys for flashcards, Space to flip
- **Framer Motion** page transitions with `AnimatePresence`
- **Staggered card entrance** animations
- **Radial SVG score** visualization on results screen
- **Responsive design** — optimized for mobile, tablet, and desktop
- **Accessibility** — focus-visible outlines, ARIA labels, `prefers-reduced-motion` support
- **Custom scrollbars** matching the dark theme

---

## ✦ Project Structure

```
recall-ai/
├── index.html                    # Entry HTML with SEO meta, fonts
├── vite.config.js                # Vite + React + proxy config
├── tailwind.config.js            # Design tokens (colors, shadows, fonts)
├── package.json
├── .env.example
│
├── server/                       # Express backend
│   ├── index.js                  # Server entry, CORS, routes, health check
│   ├── routes/
│   │   └── generate.js           # POST /api/generate with input validation
│   ├── schemas/
│   │   └── studySet.js           # Server-side Zod schema + validator
│   └── services/
│       └── gemini.js             # Gemini API integration + demo fallback
│
└── src/                          # React frontend
    ├── main.jsx                  # React DOM entry
    ├── App.jsx                   # Root component + Framer Motion transitions
    ├── index.css                 # Global styles, glassmorphism, animations
    ├── hooks/
    │   └── useStudySession.js    # Central state machine (237 lines)
    ├── lib/
    │   ├── api.js                # Fetch wrapper with error handling
    │   └── validateResult.js     # Client-side Zod validation + normalization
    └── components/
        ├── layout/
        │   ├── AppShell.jsx      # Root layout with ambient background glows
        │   └── Header.jsx        # Sticky header with logo, breadcrumb, nav
        ├── landing/
        │   └── LandingScreen.jsx # Hero, textarea input, example chips
        ├── loading/
        │   └── LoadingScreen.jsx # Multi-stage animated loading experience
        ├── overview/
        │   └── OverviewScreen.jsx # Study set dashboard with stats grid
        ├── flashcards/
        │   └── FlashcardScreen.jsx # 3D flip cards with keyboard controls
        ├── quiz/
        │   └── QuizScreen.jsx    # Multiple-choice with instant feedback
        ├── results/
        │   └── ResultsScreen.jsx # Score dashboard + mistake review
        └── error/
            └── ErrorScreen.jsx   # Error state with retry
```

---

## ✦ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend (Vite) + backend (Express) concurrently |
| `npm test` | Run automated test suites (Zod validation, API routes, state machine) |
| `npm run client` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run build` | Production bundle build (Vite) |
| `npm run preview` | Preview production build |

---

## ✦ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/apikey)) |
| `GROQ_API_KEY` | Optional | Groq API key for high-speed inference (e.g., `qwen/qwen3.8-27b`) |
| `PORT` | Optional | Backend port (default: 3001) |
| `NODE_ENV` | Optional | Environment mode (default: `development`) |

> **Note**: At least one valid key (`GEMINI_API_KEY` or `GROQ_API_KEY`) is required for live generation. If neither is provided or keys are placeholders, the server returns clean status warnings and graceful error screens. All API keys remain strictly backend-only and are excluded from Git.

---

## ✦ Deploying to Vercel

RecallAI is deployed and live on **Vercel**:

> 🔗 **Live URL:** [https://recall-ai-flam-assignment.vercel.app/](https://recall-ai-flam-assignment.vercel.app/)

The application runs full-stack on Vercel with serverless execution (Vite React frontend + Express API backend).

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "Configure Vercel full-stack deployment"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository (`recall-ai-flam-assignment`).
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `GROQ_API_KEY`: *(Optional)* Your Groq API key
   - `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will build the frontend into `dist/` and configure the Express serverless function at `/api/index.js` automatically.

### Method 2: Deploy via Vercel CLI

```bash
# Log in to your Vercel account
npx vercel login

# Deploy preview
npx vercel

# Deploy directly to production
npx vercel --prod
```

---

## ✦ Screen Recording

> A short screen recording demonstrating the full user flow is available at:
> [TODO: Add link after recording]

---

## ✦ License

MIT

---

<div align="center">
  <sub>Built for the Flam Frontend Internship Assignment</sub>
</div>
