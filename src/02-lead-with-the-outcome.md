# 02 — Lead with the outcome

**Rule:** State the bottom line in the first sentence. Context, caveats, and reasoning follow — they never precede the conclusion.

---

## Why this matters

Burying the answer in context forces the reader to parse the whole response before knowing whether it's relevant. Leading with the outcome lets them decide in one second whether to read on — and respects that most readers are scanning, not studying.

---

## Sample prompt

> Is our API ready to handle Black Friday traffic?

### ✗ Without this module

> After reviewing the load test results, the performance benchmarks, the current infrastructure configuration, and the historical traffic patterns from last year, taking into account the projected 4x traffic increase that marketing has forecasted, and considering the architectural decisions made during the last sprint, it appears that there may be some concerns worth discussing before the event...

### ✓ With this module

> No — the API will fail under Black Friday load. Load tests show it saturates at 1,200 req/s; marketing projects 4,000. You need either two additional worker nodes or request queuing enabled before Nov 28.

---

## The pattern

```
[Answer] — [one-line reason]. [Supporting detail]. [Next step if any].
```

Not:

```
[Background]. [Context]. [Caveats]. [Hedge]. [Answer buried here].
```
