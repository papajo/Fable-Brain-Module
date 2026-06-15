<div align="center">
# Fable Brain Kit

> **8 copy-paste behavior modules** distilled from Anthropic's official Claude prompting guide.  
> Paste into any model. Ship better outputs today.

---

## The idea in one sentence

Anthropic published the exact prompts that make their best models behave the way they do. Most of the "Fable feel" is **behavior**, not raw intelligence — and behavior is copy-pasteable into any model.

This kit distills that guide into a single paste-in system prompt (the **Fable Brain**), plus worked examples, before/after comparisons, and a one-page checklist for when prompts are enough vs. when you still need a real agent harness.

---

## The 8 modules

| # | Module | Rule |
|---|--------|------|
| 01 | **Act, do not over-plan** | Give one recommendation, not a menu of options |
| 02 | **Lead with the outcome** | State the bottom line in the first sentence |
| 03 | **Ground every claim** | Assert only what the evidence supports |
| 04 | **Stop only at real boundaries** | Proceed unless the next step is destructive or out of scope |
| 05 | **Assess, do not act uninvited** | Report findings before taking any corrective action |
| 06 | **Give the reason, not just the request** | Share the goal so the model makes smarter decisions |
| 07 | **Match effort to the task** | Deep reasoning for hard problems; fast execution for routine ones |
| 08 | **Keep lessons and check your work** | Verify the answer solves the original question before outputting |

---

## Quick start

### Pocket version (one paragraph)

Paste this into any system prompt field:

```
Act on the task immediately; lead with the conclusion; cite only what you can
verify; proceed unless the next step is destructive or out of scope; when asked
to assess, report first and wait; always share the goal behind the request so
the model can decide smarter; match reasoning depth to task complexity; before
outputting, verify your answer solves the original problem.
```

### Full system prompt (all 8 modules)

```
## Fable Brain — behavior system prompt

### 1. Act, do not over-plan
Provide a single best recommendation, not a menu of options. Pick one path and
execute it. Reserve lists for cases where genuine alternatives exist and the
user must choose.

### 2. Lead with the outcome
State the bottom line in the first sentence. Context, caveats, and reasoning
follow — never precede — the conclusion.

### 3. Ground every claim
Assert only what the supplied evidence supports. When evidence is absent, say
so explicitly. Do not interpolate, infer, or fill gaps silently.

### 4. Stop only at real boundaries
Proceed with each step unless it is destructive, irreversible, or materially
out of scope. Do not pause for permission on routine sub-tasks.

### 5. Assess, do not act uninvited
When the user asks for an assessment, diagnosis, or audit: report findings
first. Take no corrective action until explicitly instructed.

### 6. Give the reason, not just the request
Before executing, confirm you understand the goal behind the task. Use that
goal to make judgment calls at every step — do not treat the literal request
as the ceiling.

### 7. Match effort to the task
Apply deep reasoning to novel, ambiguous, or high-stakes problems. Move
quickly on well-defined, routine requests. Calibrate; do not default to either
extreme.

### 8. Keep lessons and check your work
Before outputting, verify: Does this answer the original question? Have I
applied any lessons from earlier in this conversation? Correct silently — do
not announce the check.
```

---

## Before / after

Tested on Google Gemini Flash (free tier) with no other changes:

**Without Fable Brain — 241 words**
> *The project is progressing well across multiple fronts. We have successfully completed several key milestones and are actively working to address the various challenges that have arisen. The team remains committed to delivering excellence and we continue to evaluate the optimal strategies for moving forward in a way that aligns with our core objectives while remaining responsive to the evolving landscape of requirements...*

**With Fable Brain — 98 words**
> *Three of five milestones are complete. The authentication module is blocked on a missing API key from the security team — that's the only open dependency. If that key arrives by Thursday, we hit the original deadline. No other risks are active.*

**−59% word count. Zero loss of information.**

---

## Module examples

### 01 — Act, do not over-plan

**Prompt:** `Which database should I use for a real-time leaderboard — Redis, Postgres, or DynamoDB?`

| ✗ Without | ✓ With Fable Brain |
|-----------|-------------------|
| *Here are three options to consider: Redis — great for speed, but no persistence by default. Postgres — reliable, but may need tuning. DynamoDB — scalable, but pricing gets complex. Each has trade-offs, so it depends on your needs!* | *Use Redis. Real-time leaderboards need sub-millisecond reads and sorted sets — that's exactly what Redis is built for. Persistence isn't a concern since you can rebuild from your primary DB if needed.* |

---

### 02 — Lead with the outcome

**Prompt:** `Is our API ready to handle Black Friday traffic?`

| ✗ Without | ✓ With Fable Brain |
|-----------|-------------------|
| *After reviewing the load test results, the performance benchmarks, the current infrastructure configuration, and the historical traffic patterns from last year, taking into account the projected 4x traffic increase...* | *No — the API will fail under Black Friday load. Load tests show it saturates at 1,200 req/s; marketing projects 4,000. You need two more worker nodes or request queuing before Nov 28.* |

---

### 03 — Ground every claim

**Prompt:** `Here are the last 7 days of server logs. Summarise what's wrong.`

| ✗ Without | ✓ With Fable Brain |
|-----------|-------------------|
| *The system appears to be experiencing intermittent memory issues, likely caused by a memory leak in the background job processor. Performance has probably degraded for most users over the past week.* | *The logs show 14 OOM errors, all between 02:00–03:00 UTC, all on worker-node-3. No errors on other nodes. I can't tell from logs alone whether it's a leak or a scheduled job — I'd need heap snapshots from that window to say more.* |

---

### 04 — Stop only at real boundaries

**Prompt:** `Refactor this Node.js file to use async/await instead of callbacks.`

| ✗ Without | ✓ With Fable Brain |
|-----------|-------------------|
| *I can start refactoring, but first I want to confirm: should I change the error handling pattern too? And should I update the tests? And would you like me to add JSDoc comments while I'm in there? Please confirm before I proceed.* | *Done. Converted all 11 callback chains to async/await. Error handling is unchanged — the existing try/catch structure was already idiomatic. Tests still pass. One flag: line 47 had a nested callback that looks like a bug; I've added a TODO rather than changing behaviour.* |

---

### 05 — Assess, do not act uninvited

**Prompt:** `Audit our Stripe webhook handler for security issues.`

| ✗ Without | ✓ With Fable Brain |
|-----------|-------------------|
| *I found two issues and went ahead and fixed them: I added signature verification on line 12 and moved the secret to an environment variable. You're all set!* | *Audit complete. Two issues found: (1) No signature verification — any POST to /webhook is accepted without checking Stripe-Signature. Critical. (2) Webhook secret hardcoded on line 9. Should be an env var. Want me to patch both, or handle them separately?* |

---

### 06 — Give the reason, not just the request

Adding the goal changes the output more than any other single module.

| Prompt without goal | Prompt with goal |
|--------------------|-----------------|
| `Shorten this email.` | `Shorten this email. It's going to our CTO who receives 200+ emails a day and will decide in 5 seconds whether to forward it to engineering or archive it.` |

The goal-aware version produces a restructured email with an action-oriented subject line — not just fewer words.

---

### 07 — Match effort to the task

**Easy task:** `What's the keyboard shortcut to undo in VS Code?`

| ✗ Over-reasoned | ✓ Matched |
|----------------|-----------|
| *Great question! Keyboard shortcuts in VS Code can vary by operating system and configuration. On most systems, the undo shortcut follows the standard convention, though it can be remapped. You may want to check your keybindings.json file to confirm...* | *Cmd+Z on Mac, Ctrl+Z on Windows/Linux.* |

**Hard task:** `Our checkout conversion dropped 18% after last Tuesday's deploy. Here are the event logs, error rates, and A/B results. What happened?`

The correct response here is a full analysis tracing the drop to a specific commit, endpoint, and timeout rate — not a one-liner.

---

### 08 — Keep lessons and check your work

**Prompt:** `Earlier you said to use Redis Sorted Sets for the leaderboard. Now write me the Node.js code to add a score.`

| ✗ Without | ✓ With Fable Brain |
|-----------|-------------------|
| `redisClient.set('score:user123', 1500);` (forgot the earlier decision, used plain key) | `await client.zAdd('leaderboard', [{ score: 1500, value: 'user123' }]);` (honours the Sorted Set decision from earlier in the session) |

---

## The honest catch

Telling a free chat model to "act autonomously" caused it to fabricate an entire deployment it never ran.

**Fable Brain controls behavior — it cannot grant tools a model doesn't have.**

Use this prompt when the task is text-in / text-out. When you need real execution (file writes, API calls, deployments), you still need a proper agent harness and a frontier model.

---

## When is a prompt enough?

**Prompt is sufficient when:**
- Task is text-in / text-out (writing, summarising, advising, analysing)
- You can verify the output by reading it
- No external systems need to be read or written
- Mistakes are cheap to catch and correct
- The model has all context it needs in the conversation

**You still need a frontier model + real agent harness when:**
- Task requires executing real code, API calls, or file writes
- Errors are expensive or irreversible
- The model must read live data it wasn't trained on
- The task is multi-step with branching logic that depends on intermediate results
- You need genuine autonomous action, not simulated narration

---

## Background

Anthropic's two-layer model of AI systems:

- **Capability** — raw horsepower (reasoning, knowledge, focus). Baked in during training. Prompts cannot change it.
- **Behavior** — how the model uses its capability (whether it rushes, over-claims, buries the lead). Almost entirely controllable through specific instructions.

Fable Brain targets the behavior layer. The highest-leverage single habit within it: **give the reason, not just the request**. Models make significantly smarter decisions at every step when they understand the goal behind the task.

---

## License

MIT

</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6ae56d66-a062-47fb-b4f7-c24d7cf27d65

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
