# Approach (write-up)

I scoped this as a client-only app to fit an 8-hour budget while still
touching every required feature area. Voice capture uses the browser's
native Web Speech API — free, no backend, and supports language switching
for the multilingual requirement. For understanding varied phrasing, I used
a rule-based intent parser (keyword/regex matching for add/remove/search,
plus number-word extraction for quantities and price-filter parsing) rather
than an LLM call: for a bounded shopping vocabulary it's fast, predictable,
and easy to debug, and avoids adding API latency/cost/backend complexity
that wouldn't be justified at this scope.

Smart suggestions are similarly lightweight: "running low" uses purchase-
frequency from local history, seasonal picks come from a small static
calendar, and substitutes come from a static map keyed to common items —
all easily swappable for a real recommendation service later.

Data lives in `localStorage` and a static product catalog rather than a
database, since a backend wasn't needed to demonstrate the core UX.

**With more time**, I'd add: a real STT/NLU service (e.g. Web Speech
fallback to a cloud STT API) for noisy environments, a backend for
cross-device sync, and an actual collaborative-filtering recommendation
model instead of frequency heuristics.
