# Basket — Voice Command Shopping Assistant

A voice-driven shopping list manager built as a client-only React app. Speak
a command, and it's parsed, categorized, and added to your list — with
smart suggestions along the way.

**Live app:** (https://pantry-pulse-voice-shopping-assista.vercel.app)
**Repo:** https://github.com/SREELAKSHMI079/pantry-pulse-voice-shopping-assistant

## Features implemented

- **Voice input** — Web Speech API (`SpeechRecognition`) captures commands;
  works in Chrome/Edge on desktop and Android.
- **Flexible phrasing** — a rule-based intent parser (`src/utils/nlp.js`)
  understands "Add milk", "I need apples", "I want to buy bananas",
  "Remove milk from my list", "Find toothpaste under $5", etc.
- **Multilingual voice recognition** — language selector (English, Hindi,
  Spanish, French) switches the recognizer's locale.
- **Smart suggestions**
  - *Running low*: items bought often in your history but missing from the
    current list.
  - *Seasonal picks*: a small seasonal calendar of produce.
  - *Substitutes*: offered automatically when you add an item that has a
    known alternative (e.g. milk → almond/oat milk).
- **List management** — add, remove, quantities ("2 bottles of water"),
  automatic category grouping (Dairy, Produce, Bakery, etc.).
- **Voice-activated search** — "Find organic apples", "toothpaste under $5"
  searches the catalog and supports adding results directly.
- **UX** — listening indicator, processing/loading state, toast
  confirmations, graceful errors (unsupported browser, no speech detected,
  unrecognized command), and a **manual text-entry fallback** so the app is
  usable without a mic or on unsupported browsers.
- **Persistence** — list and purchase history saved to `localStorage`, so
  suggestions improve as you use it.

## Not implemented (scoped out — see write-up)

- No backend / real database (uses `localStorage` + a static catalog).
- No trained ML model for recommendations (frequency-based heuristic instead).
- No translation of the NLP parser itself — voice *recognition* is
  multilingual, but intent parsing is tuned for English phrasing.

## Tech stack

- **React + Vite** — fast setup, no backend needed for this scope.
- **Web Speech API** — free, built into the browser, no API key or backend
  round-trip required (vs. a paid STT service).
- **Rule-based NLP** — regex/keyword intent matching. For a closed
  vocabulary (add/remove/search + grocery items) this is fast, debuggable,
  and accurate enough; an LLM call would add latency, cost, and a backend
  dependency that isn't justified at this scope.
- **Plain CSS** — no UI framework dependency, keeps the bundle small.

## Project structure

```
src/
  components/
    VoiceButton.jsx      voice capture + language selector
    ShoppingList.jsx      categorized list display
    SuggestionPanel.jsx   running-low / seasonal / substitute chips
    SearchBar.jsx          voice-activated search results
  utils/
    nlp.js                intent + quantity + price-filter parser
    products.js            static product catalog + substitutes + seasonal data
    suggestions.js          suggestion logic
  App.jsx                  app state, wiring, persistence
  index.css                 styling
```

## Setup

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Deploying

This is a static site after build — deploy `dist/` to Vercel, Netlify, or
GitHub Pages:

```bash
npm run build
npx vercel --prod        # or drag-and-drop dist/ into Netlify
```

**Note:** the Web Speech API requires HTTPS (or `localhost`) and browser
mic permission — both Vercel and Netlify serve over HTTPS by default.

## Browser support

Voice recognition relies on `webkitSpeechRecognition` / `SpeechRecognition`,
supported in Chrome, Edge, and Chrome for Android. Safari/Firefox support is
partial/absent — the app detects this and falls back to the text input box
rather than breaking.
