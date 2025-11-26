/**
 * Golden Dataset Schema for Chat-with-Experts Evaluation
 *
 * This defines the structure of test cases used to evaluate
 * the quality of expert roundtable discussions.
 */

export interface GoldenCase {
  id: string;
  version: string; // e.g., "v0.2.4"
  createdAt: string;

  // --- Input ---
  input: {
    userQuery: string;
    userContext?: {
      role?: string;           // "独立开发者", "AI产品经理"
      resourceLevel?: string;  // "资源少", "有资金"
      expertiseLevel?: string; // "初学者", "专家"
      emotionalState?: string; // "焦虑", "求知欲强"
      expectationType?: string; // "具体步骤", "战略框架", "同行验证"
    };
  };

  // --- Expected Output ---
  expected: {
    // 专家选择期望
    expertSelection: {
      mustInclude?: string[];    // 必须包含的专家类型
      mustNotInclude?: string[]; // 绝对不能包含的专家类型
      minExperts: number;
      maxExperts: number;
    };

    // 回答质量期望
    responseQuality: {
      mustAnswer: string[];      // 必须回答的问题点
      mustAvoid: string[];       // 必须避免的模式
      actionability: {
        required: boolean;       // 是否必须有可执行建议
        minSteps?: number;       // 最少几步行动计划
        timeframe?: string;      // "下周", "本月"
      };
    };

    // 专家分工期望
    expertDivision: {
      noRepetition: boolean;     // 不能重复观点
      mustHaveDifferentAngles: boolean; // 必须有不同角度
    };
  };

  // --- Evaluation Criteria ---
  criteria: {
    relevance: {
      weight: number;           // 权重 0-1
      description: string;
    };
    actionability: {
      weight: number;
      description: string;
    };
    expertMatch: {
      weight: number;
      description: string;
    };
    expertDivision: {
      weight: number;
      description: string;
    };
    conciseness: {
      weight: number;
      description: string;
    };
    novelty: {
      weight: number;
      description: string;
    };
  };

  // --- Metadata ---
  metadata: {
    category: string;           // "产品", "技术", "金融"
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    notes?: string;             // 评测时的额外说明
  };
}

/**
 * Actual evaluation result from running the test
 */
export interface EvaluationResult {
  caseId: string;
  strategyVersion: string;      // "v2_intent_cot" or "v3_context_aware_cot"
  evaluatedAt: string;

  // --- Actual Output ---
  actual: {
    experts: Array<{
      name: string;
      title: string;
      reason: string;
    }>;
    responses: Array<{
      expertName: string;
      content: string;
    }>;
    latencyMs: number;
  };

  // --- Scores (0-10) ---
  scores: {
    relevance: number;
    actionability: number;
    expertMatch: number;
    expertDivision: number;
    conciseness: number;
    novelty: number;
    overall: number;            // weighted average
  };

  // --- Detailed Analysis ---
  analysis: {
    expertMatchAnalysis: {
      matched: string[];
      mismatched: string[];
      reason: string;
    };
    actionabilityAnalysis: {
      hasActionPlan: boolean;
      steps: string[];
      timeframe?: string;
      feedback: string;
    };
    expertDivisionAnalysis: {
      repetitionFound: boolean;
      expertContributions: Array<{
        expertName: string;
        uniquePoints: string[];
        redundantPoints: string[];
      }>;
    };
  };

  // --- LLM Judge Reasoning ---
  judgeReasoning: string;

  // --- Human Feedback (optional) ---
  humanFeedback?: {
    score: number;              // 1-10
    comments: string;
    agree: boolean;             // agree with LLM judge?
  };
}
