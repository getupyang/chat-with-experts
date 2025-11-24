# Project Handover Document - Chat with Experts

**Last Updated**: 2025-11-24
**Version**: v2.0.0 (Architecture Refactor)
**Tech Stack**: React (Vite), Google GenAI SDK (Gemini 3 Pro + 2.5 Flash), Strategy Pattern

---

## 1. Current Status (✅ Done)

The project has evolved from a simple MVP into a **Configuration-Driven AI Architecture**.

### Core Architecture: Strategy Pattern
*   **Config-Driven**: The app behavior is controlled by `services/geminiConfig.ts`.
*   **Pluggable Strategies**: We can switch between different debate logic implementations instantly via `activeStrategyId`.
    *   `v1_legacy`: The original single-shot prompt logic (Stable).
    *   **`v2_intent_cot` (Active)**: The new "Intent-First" Chain-of-Thought engine.

### Feature: Intent-First CoT (Strategy V2)
*   **Two-Stage Pipeline**:
    1.  **Director Agent (Gemini 2.5 Flash)**: Analyzes user intent, critiques previous context, and writes a "script" (JSON) for the next turn. It detects underlying needs (e.g., "User is frustrated by vague advice -> Needs concrete KPIs").
    2.  **Actor Agent (Gemini 3 Pro)**: Executes the debate based on the Director's hidden notes, ensuring high reasoning quality and context adherence.
*   **Why**: Solves the "Context Drift" and "Pedantic Error" issues where experts would philosophize instead of solving root problems.

### Core Features (Retained)
*   **Expert Matching**: Generates 2-4 unique expert personas.
*   **Roundtable Simulation**: Simulates conversation using a "Spotlight Rule".
*   **Expert Reroll**: Users can swap out a specific expert.
*   **Multi-language Support**: en/zh/es/fr/ja.

---

## 2. Engineering & Infrastructure

*   **Folder Structure**:
    *   `services/geminiConfig.ts`: Global brain configuration.
    *   `services/strategies/`: Contains distinct logic implementations (`LegacyStrategy.ts`, `IntentCoTStrategy.ts`).
    *   `services/geminiClient.ts`: Shared API client with **Hybrid Env Var Support** (Vite + Standard) and **Retry Logic**.
*   **Observability**:
    *   **Director's Cut Logging**: The `IntentCoTStrategy` logs the *hidden* planning step (`v2_cot_planning`) to the Debug Logger. Developers can see exactly what the "Director" thought before the "Actors" spoke.

---

## 3. Technical Debt & Known Issues (⚠️ Attention Needed)

### A. Markdown Parsing (Legacy Issue)
*   The `fetchDebateResponse` (in both strategies) still relies on Regex (`^\*\*(.*?)\*\*:\s*(.*)`) to parse the expert's name.
*   **Mitigation**: The CoT strategy (V2) tends to follow formatting rules better due to the stronger model (Gemini 3 Pro), but the underlying parsing mechanism remains fragile.

### B. Latency
*   **V2 Strategy**: Requires **2 sequential API calls** (Planning + Execution). This increases response time (approx 5-8s total).
*   **UI Feedback**: The current UI shows "Experts are gathering their thoughts..." which is acceptable, but could be more granular (e.g., "Analyzing intent...", "Drafting response...").

---

## 4. Roadmap & Pending Tasks (📅 To Do)

### High Priority
1.  **UI Visualization for CoT**:
    *   Expose the "Director's Note" in the UI (perhaps as a collapsible "Thought Bubble" for the user). This adds transparency and "AI Magic" feel.
2.  **Strategy V3 (JSON Output)**:
    *   Fully migrate the *Execution Phase* to Structured Output (JSON Schema) to kill the Regex parser forever.

### Medium Priority
3.  **Automated Regression Testing**:
    *   Use the exported `debug_log.json` to run offline benchmarks comparing V1 vs V2 quality.

---

## 5. How to Debug (Developer Workflow)

1.  **Switch Strategies**:
    *   Open `services/geminiConfig.ts`.
    *   Change `activeStrategyId` to `'v1_legacy'` to rollback.
    *   Change to `'v2_intent_cot'` to enable the new engine.
2.  **Analyze CoT**:
    *   Go to **Settings** -> **Developer Mode** -> **Export Debug Data**.
    *   Look for `action: "v2_cot_planning"`.
    *   Read the `userUnderlyingNeed` and `contextCritique` fields to see if the AI understood the user correctly.