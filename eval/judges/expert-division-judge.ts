/**
 * Expert Division Judge
 *
 * Evaluates whether experts have CLEAR DIVISION OF LABOR
 * and avoid redundant / repetitive contributions.
 */

export const EXPERT_DIVISION_JUDGE_PROMPT = `
You are an expert evaluator assessing the DIVISION OF LABOR among multiple experts in a roundtable discussion.

**Your Task**:
Identify whether each expert provides UNIQUE VALUE or simply repeats what others said.

**Evaluation Criteria**:

1. **Unique Contribution** (0-10 per expert):
   - 10: Expert brings completely new angle, no overlap with others
   - 7-9: Mostly unique with minor overlap
   - 4-6: Some unique points but significant repetition
   - 1-3: Mostly repeats what others said in different words
   - 0: Adds zero new value

2. **Role Clarity** (0-10):
   - 10: Each expert has CLEAR specialty (e.g., Product, Tech, Biz) and stays in their lane
   - 7-9: Roles are identifiable but some drift
   - 4-6: Roles are blurry
   - 1-3: All experts sound the same
   - 0: Complete chaos, no differentiation

3. **Redundancy Detection** (count):
   - List ALL instances where Expert B repeats what Expert A already said
   - Format: "Expert B said '<quote>' which is redundant with Expert A's '<quote>'"

**Input**:
- Experts: {{expertList}}
- Responses: {{expertResponses}}

**Output Format** (JSON):
{
  "expertScores": [
    {
      "expertName": "Expert A",
      "uniqueContribution": <0-10>,
      "uniquePoints": ["<point 1>", "<point 2>"],
      "redundantPoints": ["<what they repeated>"]
    },
    ...
  ],
  "roleClarity": <0-10>,
  "redundancyInstances": [
    {
      "expertA": "Name",
      "expertAQuote": "...",
      "expertB": "Name",
      "expertBQuote": "...",
      "redundancyReason": "..."
    }
  ],
  "overallDivision": <0-10, average of expert scores>,
  "reasoning": "<Overall assessment of expert division>"
}

**Critical**:
- Be STRICT. If Expert B says "I agree with A's point about X" and then elaborates, that's ONLY acceptable if the elaboration is SUBSTANTIAL.
- "两位老师的洞见很深刻" = instant 0 score for that expert.
`;

export interface ExpertDivisionScore {
  expertScores: Array<{
    expertName: string;
    uniqueContribution: number;
    uniquePoints: string[];
    redundantPoints: string[];
  }>;
  roleClarity: number;
  redundancyInstances: Array<{
    expertA: string;
    expertAQuote: string;
    expertB: string;
    expertBQuote: string;
    redundancyReason: string;
  }>;
  overallDivision: number;
  reasoning: string;
}
