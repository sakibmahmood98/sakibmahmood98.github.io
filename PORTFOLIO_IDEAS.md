# New Section Ideas: Writing (Medium) + a Playable Game

Suggestions only — nothing implemented yet. Pick what you like and I'll build it.

---

## 1. Writing / Blog section (Medium links)

### Placement
New section between **Work** and **Experience** on the home page, styled like the
existing horizontal-scroll Work strip (reuse `appDragScroll` + `.tile`). Add
`Writing` to the nav jump links and to the `#work`-style section anchors.

### How to source the posts
Two options:

| Approach | Pros | Cons |
|---|---|---|
| **A. Static data file** (`blogs.data.ts`, same pattern as `projects.data.ts`) | Zero moving parts, no CORS/API risk, full control over title/excerpt/tags | You update the file by hand each time you publish |
| **B. Live-fetch Medium's RSS feed** via a free RSS→JSON proxy (e.g. `api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@yourhandle`) | Auto-updates when you publish | Third-party dependency, rate limits, feed HTML needs sanitizing, occasional downtime |

**Recommendation: start with A (static file).** It matches how `projects.data.ts`
already works, ships today with zero risk, and you can swap in B later behind the
same interface if you want it to auto-update.

### Data shape (`blogs.data.ts`)
```ts
export interface BlogPost {
  title: string;
  slug: string;        // for the card's anchor, mirrors projects.data.ts
  publishedOn: string; // "Aug 2026"
  readTime: string;    // "6 min read"
  excerpt: string;
  tags: string[];
  url: string;          // full Medium URL, opens in new tab
}
```

### Card content
- Title, publish date, read-time chip (mirrors the year badge on project cards)
- 1–2 line excerpt
- Tag chips (reuse `.chip`)
- External-link icon (already used on project cards) — since these leave the site,
  open with `target="_blank" rel="noreferrer noopener"` instead of `routerLink`

### Nice-to-have later
- A "Read all on Medium" link (mirrors "View all N" on Work) pointing straight at
  your Medium profile.

---

## 2. A playable mini-game

A game is a great differentiator for a *software engineer* portfolio, but it
should stay small, on-brand, and not distract from the professional content.
Best placed as its own section low on the page (e.g. after Education, before
Footer) or as a collapsible/expandable panel so it doesn't compete with the
resume content up top.

### Options considered

| Game | Effort | Fit | Notes |
|---|---|---|---|
| **Debug-the-line** — a code snippet flashes on screen, user clicks the buggy line before a timer runs out; score + streak | Low–Med | ⭐⭐⭐⭐⭐ | Directly plays on "software engineer / competitive programmer" branding. Fully DOM-based, no canvas needed. |
| **Type racer** — race to type a short code snippet, shows WPM + accuracy | Low | ⭐⭐⭐⭐ | Also on-brand, very simple to build (just an `<input>` + diffing), but less "game"-feeling |
| **Snake** (canvas, teal/dark themed) | Med | ⭐⭐⭐ | Classic, nostalgic, easy on mobile via swipe (you already have swipe/drag code to reuse) |
| **Memory match** with tech-stack logos (.NET, Angular, React, etc.) | Med | ⭐⭐⭐ | Visually fits the bento aesthetic, reuses your existing tech chip icons |
| **Reaction-time click test** with local leaderboard | Low | ⭐⭐ | Fun but generic, no personal branding tie-in |
| **Flappy-bird-style runner** with your avatar dodging tech-logo obstacles | High | ⭐⭐⭐ | Most delightful/memorable, but by far the most build + tuning effort |

### Recommendation
**"Debug the Line"** — a short round-based game:
1. A realistic-looking code snippet renders (syntax-highlighted, reuse `font-mono-ui`)
2. One line has an obvious-once-you-see-it bug (off-by-one, `=` vs `==`, wrong var, etc.)
3. Player clicks the buggy line before a 5–8s timer runs out
4. Score increments, next (harder) snippet loads; 3 misses ends the run
5. High score saved in `localStorage` ("Your best: 12 🔥")

Why this one: it's the game most likely to make a recruiter smile *and* it reflects
actual engineering skill, it's cheap to build (no canvas/physics), it's fully
keyboard/mouse/touch friendly, and the "snippet bank" is just a data file you can
keep adding to — same pattern as `projects.data.ts` and `blogs.data.ts`.

### Data shape (`debug-game.data.ts`)
```ts
export interface CodeSnippet {
  language: string;       // for the header chip, e.g. "TypeScript"
  lines: string[];        // rendered with line numbers
  buggyLineIndex: number; // 0-based
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### Build sketch
- New `GameComponent` (standalone), own section + nav entry ("Play")
- Plain Angular signals for state (score, lives, timer, current snippet)
- `setInterval`/`requestAnimationFrame` for the countdown ring (reuse `.tile` styling
  so it visually matches the rest of the bento grid)
- No external game library needed — keeps bundle size down

### If you'd rather go simpler first
Snake or Type Racer are both good "phase 1" fallbacks if Debug-the-Line feels like
too much scope right now — happy to build whichever you pick.

---

## Suggested next step
Tell me which of these you want (blog section, game, both, or a different game
pick) and I'll implement it.
