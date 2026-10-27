# Project Brief: FairShift Hisaab

PROJECT: "FairShift Hisaab", a workplace fairness app for UN SDG 8 (Decent Work and Economic Growth).
Two interfaces: (1) Worker Companion, a mobile-first PWA; (2) Employer Command Cockpit, desktop-first admin. It must work for 2+ sectors through config, not copy-paste code.

CORE RULE (the "Two-Key Rule"): no pay mismatch, hazard or complaint is marked resolved unless the worker confirms it OR independent proof exists.

STACK: Next.js 15 App Router, TypeScript strict, Tailwind CSS, Zod, Vitest + Testing Library + vitest-axe. No Vercel-only packages (no @vercel/*). next.config uses output: "standalone".

NON-NEGOTIABLES:
- No secrets in the repo. Read everything from process.env. Ship .env.example with empty values.
- Every user-facing string comes from messages/<lang>.json. No hardcoded UI text.
- Business logic (pay, overtime, fatigue, heat, escrow, escalation, ledger) is pure TypeScript in src/core with unit tests. AI is used only for vision, transcription, translation, paraphrase and plain-language explanation, and always has a deterministic fallback so the app works with no API key.
- Semantic HTML first (button, a, label, nav, main), visible focus ring, full keyboard flow, WCAG AA contrast minimum.
- Repo under 10 MB: SVG icons only, no videos, no large images. One branch: main.
- Load only the active language's font and messages. Dynamic-import heavy parts.

LANGUAGES: en (default), hi, bn, ta, pa, ur. Urdu is right-to-left. Use CSS logical properties everywhere (margin-inline-start, not margin-left).

COLOURS (CSS variables):
- black #0A0B0A
- obsidian #101310
- grey-900 #1A1D1B
- grey-700 #2E332F
- grey-500 #6B726C
- grey-300 #B8BEB9
- text #F2F5F1
- lime #A3E635
- lime-deep #4D7C0F
- danger #FF5A4F
- warn #FBBF24
Text on lime is always black.

TYPOGRAPHY:
- Plus Jakarta Sans (English)
- Noto Sans Devanagari (Hindi)
- Noto Sans Bengali (Bangla)
- Noto Sans Tamil (Tamil)
- Noto Sans Gurmukhi (Punjabi)
- Noto Nastaliq Urdu (Urdu, RTL, line-height 2.1, >=18px)
- Patrick Hand (Sketch theme English)

Scale:
- Screen title: 28px, 700, Sentence case
- Card title: 20px, 600, Sentence case
- Body text: 18px, 400 (admin 15 to 16px), Sentence case
- Buttons: 20px, 700, Sentence case, verb first ("Check in now")
- Money amounts: 44px, 800, tabular numbers
- Small label above section: 12px, 700, +0.08em spacing, ALL CAPS (English only)
- Status chips: 13px, 700, ALL CAPS in English (PAID, OPEN, URGENT, NEEDS REVIEW), plus an icon

Hard rules:
- Never use CAPS for sentences or buttons.
- Never bold a whole paragraph. Use one bold phrase per sentence at most.
- Never apply uppercase, italic, letter-spacing or fake bold to Hindi, Bangla, Tamil, Punjabi or Urdu. Use real font weights.
- Use 0 to 9 digits in every language, so money is easy to read.

TONE: plain words at a Class 5 reading level. Short sentences. Verb-first buttons. Say "Money earned", not "Gross remuneration". Every icon has a text label.
