
# UNWRITTEN — System & Architecture Specification

## 1. Architectural Philosophy

UNWRITTEN is **event-driven**, **motion-first**, and **identity-free**.

Key constraints:

* No user identity at entry
* No persistence unless explicitly triggered
* No blocking flows
* Frontend is the product
* Backend reacts, never leads

The system is built as a **state machine responding to motion, pause, and choice**.

---

## 2. High-Level System Overview

**Phase 1 (Threshold / Landing)**

* Frontend-only
* Canvas-based interaction
* In-memory state
* No auth, no database required

**Phase 2 (Notebook Emergence)**

* Lightweight backend
* Anonymous session tokens
* Pattern-based analysis
* Optional monetization

**Phase 3 (Continuity / 20-Day Path)**

* Persistent anonymous sessions
* Aggregated pattern intelligence
* Export / book generation

This document focuses on **Phase 1 + Phase 2 entry**.

---

## 3. Technology Stack (Recommended)

### Frontend

* Framework: **Vanilla JS** or **React (minimal)**
* Rendering: **HTML5 Canvas**
* Animation: `requestAnimationFrame`
* Input: **Pointer Events API**
* Audio: Web Audio API (lazy-loaded)

### Backend (when enabled)

* Firebase Functions (HTTP-triggered)
* Firestore (anonymous documents)
* Stripe (later, friction payments)

### Hosting

* Firebase Hosting (single-page app)
* CDN enabled
* No SSR required

---

## 4. Core Frontend Modules

### 4.1 Canvas Engine

Responsible for:

* Drawing strokes
* Velocity-based brush width
* Chalk texture simulation
* Decay & blur effects

Key methods:

* `drawStroke(point, velocity)`
* `applyDecay()`
* `clearCanvas()`

No text rendering.
Everything is stroke-based.

---

### 4.2 Motion Detector

Tracks:

* Pointer position
* Velocity
* Idle time

Key logic:

* Motion > 3px activates system
* Inactivity > 1200ms triggers release
* Hover intent modifies environment state

This module **drives all state transitions**.

---

### 4.3 State Machine (Critical)

States:

```
IDLE
ACTIVE_DRAW
DRAWING
RELEASE
FIELD
CHOICE
NOTEBOOK_ENTRY
SECOND_CHANCE
```

Rules:

* Only one active state at a time
* Transitions are one-directional
* No skipping states
* No external triggers allowed

State is held **in memory only**.

---

## 5. State-by-State Technical Behavior

### IDLE

* Canvas visible
* No listeners active
* No audio context

Exit condition:

* Pointer movement > 3px

---

### ACTIVE_DRAW

* Initialize audio context
* Enable drawing listeners
* Hide cursor

Immediate transition to `DRAWING`

---

### DRAWING

* Continuous stroke capture
* Velocity sampling per frame
* Chalk dust particle spawn (optional)

Exit condition:

* No motion for 1200ms

---

### RELEASE

* Stroke opacity animation (100% → 70%)
* Blur pass or glow shadow
* Sound fade-out

Duration: ~800ms
Auto-transition to `FIELD`

---

### FIELD

* Horizontal translation of canvas container
* Inject synthetic “other boards”
* Disable drawing input

After 2000ms:

* Transition to `CHOICE`

---

### CHOICE

* Render ◯ and ✕ symbols (canvas or DOM overlay)
* Pointer hover affects:

  * Stroke glow
  * Slider velocity
  * Ambient sound pitch

Selection:

* ◯ → `NOTEBOOK_ENTRY`
* ✕ → `SECOND_CHANCE`

---

### NOTEBOOK_ENTRY

* Freeze motion
* Apply depth transform (scale + vignette)
* Show vertical cursor line
* Type **one short system phrase**
* Fade phrase after ~2000ms

No interaction beyond observation (v1).

---

### SECOND_CHANCE

* Fade to black
* Draw `$` symbol
* Draw ◯ beside it
* On select:

  * Reset memory
  * Return to `IDLE`

Payment not wired yet (Phase 1.5).

---

## 6. Backend Entry Point (Phase 2 Trigger)

Backend is **not active until user chooses ◯**.

On `NOTEBOOK_ENTRY`:

* Generate anonymous session ID:

  * UUID v4
  * Stored in memory + localStorage
* POST `/session/init`

  * Payload: abstract features only (length, stroke density, pauses)
  * Never raw text

Backend responds with:

* Pattern ID
* Phrase set (pre-approved vocabulary)

Notebook responses are **pattern-mapped**, not generated live at first.

---

## 7. Data Model (Anonymous by Design)

### Session Document

```json
{
  "sessionId": "uuid",
  "createdAt": timestamp,
  "strokeMetrics": {
    "duration": number,
    "density": number,
    "pauseCount": number
  },
  "published": true
}
```

No text.
No identity.
No IP stored.

---

## 8. Pattern Intelligence (Safe Aggregation)

Patterns are derived from:

* Stroke duration
* Motion variance
* Pause rhythm

Not from content semantics initially.

This avoids:

* IP issues
* surveillance perception
* creepiness

Language intelligence can be layered later.

---

## 9. Monetization Architecture (Later)

* `$` gate → Stripe Payment Link
* Payment unlocks:

  * Additional cycles
  * Notebook continuity
* Link payment to anonymous `sessionId`
* No account creation required

---

## 10. Security & Privacy Guarantees

* No auth in Phase 1
* Anonymous sessions only
* No user content reuse
* No raw text storage
* No analytics beyond state transitions

This makes UNWRITTEN **legally low-risk**.

---

## 11. Scaling Strategy

* Frontend scales via CDN
* Backend load minimal (event-based)
* No real-time requirements
* Stateless functions

This system can handle **large traffic early**.

---

## 12. What Is Explicitly Deferred

Not built now:

* User accounts
* Book export
* AI rewriting
* 20-day scheduler
* Notifications
* Emails

These attach cleanly later **without refactoring core logic**.

---

## 13. Developer Summary (One Paragraph)

UNWRITTEN is a canvas-based, motion-driven state machine that treats movement as intent and hesitation as signal. The frontend controls the experience entirely, while the backend only activates after user confidence is expressed. Identity is never required; persistence is earned. The system scales by reducing data, not increasing it.

---
