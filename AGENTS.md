# Project: Save The TOMMY

## 1. Project Overview
A web-based party game designed to ensure "Ultra-Strict Legal Consent" amidst a "King's Game" setting.
While the backstory involves protecting a character named "Tommy" from legal disputes, the game itself is a generic King's Game for 2-5 players. The core feature is a legally "excessive" consent flow using GPS and Audio recording to unlock high-intimacy tasks.

## 2. Technical Stack
- **Framework:** React (Vite)
- **Language:** TypeScript (.tsx)
- **UI Library:** Chakra UI (specifically styled for mobile).
- **Styling Strategy:** Use `dvh` (Dynamic Viewport Height) instead of `vh` to prevent layout issues on mobile browsers (Safari/Chrome on iOS/Android).
- **State Management:** React Context API.
- **Hosting:** GitHub Pages.
- **Key APIs/Libraries:**
  - `navigator.geolocation` (for GPS stamping).
  - `MediaRecorder API` (for voice consent).
  - `react-signature-canvas` (for digital signatures).

## 3. Game Mechanics

### Phase 1: Setup
- **Users:** 2-5 players.
- **Input:** Nicknames only.

### Phase 2: King's Game Loop
- **Roles:** King (1 person) vs Targets (Random).
- **Card Selection (Blind Choice):**
  - King sees 3 cards.
  - **Obfuscation:** Text is truncated or censored initially (e.g., "耳元で甘く...", "相手の●●を...", "後ろから優しく...").
  - Full text is revealed only *after* selection.
- **Content Policy:**
  - **Euphemisms:** Avoid explicit words. Use euphemisms or censorship (伏せ字) like "ハグ", "愛の囁き", "●●", "触れ合う".
  - **Safety:** Tasks are physically safe (e.g., holding hands, staring contest).

### Phase 3: The Consent Trigger
- **Turn 3:** "同意手続きを開始" (Initiate Consent Procedure) button appears (Static).
- **Turn 5:** Button begins to vibrate/pulse (Animation).
- **Trigger:** Clicking the button pauses the game and opens the Consent Modal.

### Phase 4: Excessive Consent Modal (Legal Theater)
Designed to mimic strict compliance with Japanese Penal Code (Reference: 不同意性交等罪 - Non-consensual sexual intercourse):
1.  **Legal Text:** Formal agreement stating clear, active consent, freedom from coercion, and sobriety checks.
2.  **GPS Data Evidence:** Fetch and display current coordinates (Lat/Long) + Timestamp to prove specific place/time.
3.  **Voice Recording (Active Confirmation):**
    - User must hold a button and read: "私 [Name] は、酩酊状態になく、威迫を受けておらず、自由意志に基づき、本ゲームにおける身体的接触に同意します。"
    - App simulates "Saving..." (Client-side memory).
4.  **Signature:** Canvas input for all players.
5.  **Completion:** Unlocks "Deep" (Max Intimacy) mode.

### Phase 5: Post-Consent
- Game resumes.
- Card selection pool shifts to high-intimacy (but euphemistic) tasks.

## 4. UI/UX Guidelines
- **Mobile First:** Layouts must fit within `100dvh`. Avoid scrolling where possible during gameplay.
- **Visuals:**
  - **Game Phase:** Pop, dark mode, neon accents.
  - **Consent Phase:** White background, Serif fonts, official document look, "Hanko" (stamp) animations.