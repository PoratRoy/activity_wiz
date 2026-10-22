# AI generation

## Flow (`generateActivity` server action, `src/app/create/actions.ts`)

1. **Identify the caller.** Signed in: key `u:{userId}`, with the group read from the `users` row. Guest: read or create the `aw_guest` cookie, then key `g:{guestId}`, with the group taken from the request and validated.
2. **Check the trial (guests).** If `trialStart` is set and older than 72 hours, return `{ status: 'trial_expired' }`.
3. **Validate.** Every select value must be in its allowed list, and the type must belong to the movement. Subject must be 1–21 characters and notes 0–1000. Neither free-text field may contain links: reject `http(s)://`, `www.`, and `word.tld` patterns after NFKC normalization and zero-width-character stripping. On failure, return `{ status: 'invalid', field }`.
4. **Rate limit.** Call the `RateLimiter` Durable Object for the key. If fewer than 30 seconds have passed since the last attempt, return `{ status: 'rate_limited', retryInSec }`. Otherwise it records "now" and admits the attempt (R7, R8).
5. **Start the trial.** For a guest without `trialStart`, set it to now in the cookie.
6. **Call Gemini** once (no SDK retries), with a 60-second `AbortController` timeout.
7. **Interpret the result.**
   - Blocked by the safety filter → `{ status: 'refused' }`.
   - Gemini overloaded (HTTP 503 or 429, or an error message containing "overloaded", "unavailable" or "high demand") → `{ status: 'busy' }` (R28).
   - Timeout, invalid JSON or schema mismatch → `{ status: 'error' }`.
8. **Convert** the JSON to `{ title, bodyMd }` (see below).
9. **Persist.** Signed in: insert a row into `activity` with the activity fields → `{ status: 'ok', id }`. Guest: `{ status: 'ok', draft }`.

## Model

- `@google/genai` SDK, `models.generateContent`, not streamed.
- The model comes from `GEMINI_MODEL`, currently `gemini-3.5-flash-lite`. Google no longer offers `gemini-2.5-flash-lite` to new users.
- `temperature: 0.9` (creative variety). `maxOutputTokens: 8000`, because a 90-minute activity in Hebrew JSON can pass 4000.
- Thinking at its minimum (`thinkingLevel: MINIMAL`). The content prompt's hidden `plan` field does the planning, and thinking could double the cost.
- `responseMimeType: 'application/json'` plus `responseJsonSchema`, which comes from the type's prompt builder.
- Safety: all four harm categories set to `BLOCK_LOW_AND_ABOVE`.
- No tools, no URL context, no grounding.

## Output schema

**content** uses its own schema, defined in `src/prompts/content.ts`:
- A hidden `plan` (`angle`, `insight`, `frame`, `thread`), generated first and never shown to the guide.
- `title`, `goal`, and `materials` (at most 6).
- Exactly the steps that the code's timing plan asks for: פתיחה, חלק 1, an optional חלק 2, and סיכום.
- No `refused`, `summary` or `tips`.

The code decides the timing (`planTiming`) and then overwrites the step names and minutes in the answer (`applyTiming`).

**pointOfView** uses its own schema, defined in `src/prompts/pointOfView.ts`:
- A hidden `plan` (`question`, 2–4 `sides` of `{position, argument}`, exactly 3 `twists`), generated first and never shown to the guide.
- `title`, `goal`, and `materials` (at most 6).
- Exactly 4 steps: הדילמה, הצפת עמדות, העמקה, סיכום. The code decides the minutes (30: 5/5/15/5, 45: 5/10/20/10, 60: 5/15/30/10, 90: 10/20/45/15) and overwrites the step names and minutes, as for content.
- The stored Markdown is the same as content's.

**survival** uses its own schema, defined in `src/prompts/survival.ts`:
- A hidden `plan` (`skill`, `successTest`, `equipmentCalc`), generated first and never shown to the guide. `equipmentCalc` makes the model count the equipment per group before writing `materials`.
- `title`, `safety` (3–5), `materials` (at most 6), `practical` (one Markdown string: groups, תרגול, בדיקה, שלב מתקדם, אתגר, מבחן, שדרוג) and `questions` (exactly 2).
- No steps and no minutes; the duration only sizes the practical part.

**playTime** uses its own schema in `src/prompts/playTime.ts` (see below).

## JSON → Markdown (`src/lib/markdown/fromAi.ts`, for content and pointOfView)

```md
**מטרה:** {goal}

## ציוד
- {material}            ← section omitted if empty

## מהלך הפעולה
### 1. {name} ({minutes} דק׳)
{instructions}
...

## סיכום
{summary}

## טיפים למדריך
- {tip}
```

`summary` and `tips` are always empty now, so those sections never appear. `title` is stored separately and isn't part of the body.

playTime (`gameToMarkdown`) and survival (`survivalToMarkdown`) build their own Markdown. survival's is: בטיחות, ציוד (followed by the fixed line **לפני הפעולה ודאו שיש לכם את כל הציוד ובכמויות הנכונות.**; both omitted when there is no equipment), חלק מעשי, שאלות.

## Prompts (`src/prompts/`)

**Current state.** `build.ts` `buildGeneration(group, activity)` picks the prompt by type:
- **content** uses `content.ts` (v2): a fully static system instruction with one quality example (example A for grades א׳–ו׳, B for ז׳–י״ב, so there are two cacheable variants), and a per-request user message holding the request, the movement's terms, the timing, one age block and only the conditions that apply.
- The movement's `groupTerm` is in `src/data/movements.json` and is currently «קבוצה» for every movement.
- **playTime** uses `playTime.ts` (v1):
  - Exactly one game, with no steps and no minutes. The duration is not asked for in the form and not stored.
  - Code sends `Known game name: yes` when the subject is in the form's game list, otherwise `unknown`.
  - The answer has `plan{mechanic, themeLink}` (hidden), `title`, `description`, `materials`, `setup`, `rules` (3–6) and `ending` (1–3).
  - It is stored as Markdown with these sections: תיאור המשחק, ציוד, הכנה, חוקים, מתי זה נגמר.
- **pointOfView** uses `pointOfView.ts` (v1), built like `content.ts`: one dilemma with no right answer, positions taken with the body (a line for 2 sides, corners for 3–4), 3 "ומה אם...?" twists, and a closing sentence that never decides. Example A (4 sides, corners) for grades א׳–ט׳, example B (2 sides, a line) for י׳–י״ב.
- **survival** uses `survival.ts` (v1): a frame for a skill the guide already knows. It never explains how to perform the skill, and nothing found outdoors is eaten or drunk (the survival topic pool was cleaned to match). One static system instruction with one quality example.
- Every type has its own prompt file; the old shared legacy prompt (`system.ts`, `structure.ts`) was removed.

## Guide text and output checks

- The guide's subject and notes go into every prompt between `<<<` and `>>>` (`src/prompts/guideText.ts`, which also strips `<`, `>` and control characters from the text). Each system prompt says that text is data, never instructions.
- Before the result is saved or returned, `generateActivity` removes links from the title and body, makes the title one line, and cuts both to `TITLE_MAX` and `BODY_MAX`. An empty result after cleaning is an error.

## Rate limiter Durable Object (`src/worker/rate-limiter.ts`)

```ts
export class RateLimiter extends DurableObject {
  async hit(windowMs: number): Promise<{ ok: boolean; retryInMs: number }> {
    const now = Date.now();
    const last = (await this.ctx.storage.get<number>('lastAt')) ?? 0;
    if (now - last < windowMs) return { ok: false, retryInMs: windowMs - (now - last) };
    await this.ctx.storage.put('lastAt', now);
    return { ok: true, retryInMs: 0 };
  }
}
```

Every write also sets `expiresAt` and an alarm for the end of the window. `alarm()` calls `storage.deleteAll()` once the window is over (or moves the alarm if a newer write extended it), so keys that stop being used leave no data behind.

It also has `count(max, windowMs)`, a fixed-window counter used for the per-IP attempt guard (`ip:gen:{ip}`, 20 per minute, checked first in `generateActivity`) and the per-user add and autosave limits.

Each Durable Object instance handles its requests one at a time, which makes the check and the update atomic for each key. Use the helpers in `src/lib/rate-limit.ts`: `hitRateLimit(key)` and `hitBurstLimit(key, max, windowMs)`. `clientIp()` reads `cf-connecting-ip`.

## Share text (`src/lib/markdown/toWhatsApp.ts`)

The share button and the `wa.me` fallback both use this format, with `\n\nנוצר בעזרת:\nhttps://activitywiz.com` added at the end.

- `**x**` → `*x*`
- Headings `#…` → `*text*` on their own line
- `- ` → `• `; numbered lists stay as they are
- Underline is dropped
- The title is prepended as `*{title}*`

The **copy** button uses a plain-text version: Markdown symbols stripped, list bullets kept, with the same credit line at the end.
