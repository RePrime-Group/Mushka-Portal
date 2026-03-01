# Mushka AI Portal

A private AI literacy training platform built for **Mushka Gratsiani**, Head of AI Research (in training) at **RePrime Group**. The portal combines a psychometric onboarding assessment with a structured 5-stage AI curriculum, delivered as a progressive web app optimised for iPhone Safari.

---

## Overview

The portal consists of two integrated modules:

**Identity Engine** — A 41-item psychometric assessment (38 scored + 3 validity items) that maps the learner's self-efficacy, grit, metacognition, and AI prior knowledge. It generates a personalised radar profile and a Claude-powered Personal Operating Playbook that configures the adaptive parameters of the curriculum.

**Curriculum Portal** — Five progressive training stages covering AI fundamentals through advanced application in commercial real estate contexts. Each stage contains 5 tasks, tracks XP, and sends automated email notifications to the team at milestone completions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| State Management | Zustand 5 with `persist` middleware (localStorage) |
| Assessment Delivery | SurveyJS 2.5 (`survey-core` + `survey-react-ui`) |
| Charts | Recharts 3 (RadarChart) |
| Animations | Motion (Framer Motion v12+) |
| Celebrations | canvas-confetti |
| Percentile Scoring | jStat (normal CDF) |
| Serverless Functions | Vercel (`api/*.ts`) |
| AI Playbook Generation | Anthropic Claude (`claude-haiku-4-5`) |
| Email Delivery | Resend |

---

## Project Structure

```
├── api/
│   ├── playbook.ts          # Claude API — generates Personal Operating Playbook
│   ├── send-results.ts      # Resend — fires Identity Engine result emails
│   └── send-email.ts        # Resend — fires curriculum milestone emails
├── src/
│   ├── components/
│   │   ├── auth/            # LoginScreen
│   │   ├── dashboard/       # Dashboard, StageCard
│   │   ├── gamification/    # CelebrationModal, ConfettiTrigger
│   │   ├── identity/        # IdentityEngine, AssessmentEngine, ResultsView,
│   │   │                    # RadarProfile, PlaybookSection, ScoringScreen,
│   │   │                    # WelcomeScreen
│   │   ├── layout/          # AppShell, Sidebar, Header
│   │   ├── reflection/      # ReflectionForm
│   │   └── stages/          # StageCard, TaskCard
│   ├── data/
│   │   ├── curriculum.ts    # 5-stage curriculum definition
│   │   ├── items.ts         # All 41 assessment items
│   │   ├── norms.ts         # Published psychometric norms (M, SD)
│   │   ├── rotationOrder.ts # Cyclic item rotation sequence
│   │   └── scoringKeys.ts   # Reverse-score maps, correct answers
│   ├── engine/
│   │   ├── scorer.ts        # Scoring pipeline (reverse, mean, percentile)
│   │   ├── validator.ts     # Validity checks (consistency, infrequency, timing)
│   │   └── aggregator.ts    # Domain aggregation (challenge, structure, start)
│   ├── store/
│   │   ├── useAppStore.ts   # Zustand store (auth, curriculum, assessment state)
│   │   └── types.ts         # Shared TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Tailwind @theme + global styles
├── index.html               # iPhone meta tags (viewport-fit=cover, PWA)
├── vite.config.ts
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Vercel account (for serverless functions in production)

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file at the project root (never commit this):

```env
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
```

These are consumed exclusively by the serverless functions in `api/`. They are never exposed to the browser.

### Development

```bash
npm run dev
```

The Vite dev server runs on `http://localhost:5173`. To test the serverless API routes locally, use the Vercel CLI:

```bash
npx vercel dev
```

### Build

```bash
npm run build
```

### Deploy

Push to the connected GitHub repository. Vercel auto-deploys on every push to the main branch. Set `ANTHROPIC_API_KEY` and `RESEND_API_KEY` in the Vercel project environment variables dashboard.

---

## Identity Engine

### Assessment Battery (41 items)

| Instrument | Items | Scale | Scoring |
|---|---|---|---|
| New General Self-Efficacy Scale (NGSE) | 8 | 5-pt Likert | Mean → percentile |
| MSLQ Self-Efficacy | 8 | 7-pt Likert | Mean → percentile |
| Short Grit Scale (Grit-S) | 8 | 5-pt Likert | Mean → percentile; 2 subscales |
| MSLQ Metacognitive Self-Regulation | 6 | 7-pt Likert | Mean → percentile |
| AI Prior Knowledge | 5 | Multiple choice | Criterion (0–5 correct) |
| Technology Comfort | 3 | 6-pt Likert | Criterion (mean 1–6) |
| Infrequency / Validity Items | 3 | 5-pt Likert | Not scored; validity only |

Items are presented in cyclic rotation order (Schell & Oswald, 2013). Infrequency items are inserted at positions 10, 22, and 35.

### Domain Aggregation

| Domain | Formula | Curriculum Effect |
|---|---|---|
| Challenge Level | NGSE (50%) + MSLQ-SE (50%) | Task difficulty, scaffolding, extension questions |
| Structure Need | 100 − (Metacognition (70%) + Grit (30%)) | Check-in frequency, milestone spacing |
| Starting Point | AI Knowledge (60%) + Tech Comfort (40%) | Content skip logic, vocabulary level |

### Validity Checks

- **Consistency:** 6 semantically paired item comparisons (flags if difference exceeds threshold)
- **Infrequency:** 3 low-base-rate items (flags if answered at the extreme)
- **Response time:** Per-item timing logged via `performance.now()`; items under 1.5 s flagged
- **Overall status:** GREEN / YELLOW / RED — included in team email, never shown to learner

### Email Streams

- **Team email** — full scores, percentiles, validity status, complete Playbook text, response time summary
- **Learner email** — warm message only, no scores or technical data

---

## Curriculum

Five stages of AI training, each with 5 tasks and a reflection prompt:

1. **Your AI, Your World** — Fundamentals and daily AI use
2. **Prompt Like a Pro** — Prompt engineering and system instructions
3. **Building Bridges** — AI in business and CRE contexts
4. **Evaluating AI Tools** — Multi-platform evaluation and API awareness
5. **Leading with AI** — Managing AI-enabled teams and workflows

---

## Access

The portal is single-user. Credentials are hardcoded for the intended recipient. All state persists in `localStorage` under the key `mushka-portal-storage` — the assessment can be resumed after a page close, and results are permanently accessible without retaking.

---

*Confidential — RePrime Group. Built February–March 2026.*
