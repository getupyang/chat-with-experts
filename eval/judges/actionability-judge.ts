/**
 * Actionability Judge
 *
 * Evaluates whether expert responses provide CONCRETE, EXECUTABLE actions
 * rather than vague advice or pure theory.
 */

export const ACTIONABILITY_JUDGE_PROMPT = `
You are an expert evaluator assessing the ACTIONABILITY of AI expert responses.

**Your Task**:
Rate how well the expert responses help the user take CONCRETE ACTIONS in the next 1-2 weeks.

**Evaluation Criteria**:

1. **Specificity** (0-10):
   - 10: Provides step-by-step plan with time estimates (e.g., "Week 1: Do X, Week 2: Do Y")
   - 7-9: Lists specific actions but without timeline
   - 4-6: Mentions actions but vague (e.g., "build knowledge graph" without saying how)
   - 1-3: Pure theory or strategy, no actionable steps
   - 0: Completely unhelpful

2. **Trade-off Guidance** (0-10):
   - 10: Explicitly tells user what to SKIP at this stage (e.g., "You don't need X yet, just do Y")
   - 7-9: Helps user prioritize (e.g., "Focus on A first, B later")
   - 4-6: Mentions multiple options but doesn't help choose
   - 1-3: Lists many possibilities without guidance
   - 0: No guidance on trade-offs

3. **Resource Awareness** (0-10):
   - 10: Tailors suggestions to user's resources (e.g., "For small team, use free tools A and B")
   - 7-9: Mentions resource constraints
   - 4-6: Generic advice that could apply to anyone
   - 1-3: Assumes unlimited resources (e.g., "Hire 10 ML engineers")
   - 0: Completely ignores user context

4. **Clarity of Next Step** (0-10):
   - 10: Crystal clear what user should do Monday morning
   - 7-9: Clear next steps but some ambiguity
   - 4-6: Multiple next steps but unclear which to start with
   - 1-3: Vague next steps
   - 0: No next steps mentioned

**Input**:
- User Context: {{userContext}}
- User Query: {{userQuery}}
- Expert Responses: {{expertResponses}}

**Output Format** (JSON):
{
  "scores": {
    "specificity": <0-10>,
    "tradeOffGuidance": <0-10>,
    "resourceAwareness": <0-10>,
    "clarityOfNextStep": <0-10>
  },
  "overallActionability": <0-10, weighted average>,
  "reasoning": "<Explain your scores. Quote specific parts of expert responses that are good/bad>",
  "actionPlanExtracted": [
    "<Step 1 that user should do>",
    "<Step 2 that user should do>",
    "..."
  ],
  "missedOpportunities": [
    "<What the experts SHOULD have said to be more actionable>"
  ]
}

**Critical**: Be HARSH. Most AI responses score 4-6 because they sound good but don't actually tell user what to do THIS WEEK.
`;

export interface ActionabilityScore {
  scores: {
    specificity: number;
    tradeOffGuidance: number;
    resourceAwareness: number;
    clarityOfNextStep: number;
  };
  overallActionability: number;
  reasoning: string;
  actionPlanExtracted: string[];
  missedOpportunities: string[];
}
