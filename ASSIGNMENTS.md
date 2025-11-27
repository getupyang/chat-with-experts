# Chat-with-Experts 实践作业集

**设计理念**: 参考Stanford CS336,通过hands-on实践建立深度认知

**难度梯度**: Assignment 1-2 (基础) → Assignment 3-4 (进阶) → Assignment 5-6 (高级)

---

## 📚 Assignment 1: Prompt Archaeology (基础,8小时)

### 学习目标
- 理解prompt工程的本质是"找到AI的失败模式,然后针对性修复"
- 掌握"对比分析 → 找gap → 修prompt"的迭代方法
- 建立"数据驱动"的prompt优化习惯

### 任务描述

给你5个"bad outputs"(系统实际生成的低质量输出),你的任务是:
1. 分析为什么这个输出quality低
2. 识别prompt中的问题
3. 修改prompt
4. 重新生成,验证是否改进

---

#### Case 1: Context Mismatch - 专家选择错误

**User Query**:
```
我是一个solo独立开发者,最近在考虑要不要给我的SaaS产品加AI功能。
我的产品现在有1000个免费用户,但只有20个付费用户。
我没有团队,所有开发都是我自己做。
```

**Bad Output** (当前系统生成):
```
**Experts Selected**:
1. Sam Altman (OpenAI CEO)
2. Elon Musk (Tesla/SpaceX CEO)

**Sam Altman**: AI是未来的趋势,每个产品都应该拥抱AI。我建议你...

**Elon Musk**: First principles thinking告诉我们,AI会revolutionize所有行业...
```

**问题分析**:
```
[ 你的分析 ]

提示:
- 专家是否match用户的context?
- Sam Altman和Elon Musk适合给solo dev建议吗?
- 用户真正需要什么类型的建议?
```

**Prompt修改**:
```
[ 粘贴你修改后的expert recruiter prompt ]

关键改动说明:
1. [改动点1]: 为什么加这个instruction?
2. [改动点2]: ...
```

**验证结果**:
```
重新运行后的输出:

**Experts Selected**:
1. [新专家名单]
2. ...

[ 粘贴新的对话输出 ]

改进评估:
- Expert Match Score: 之前 3/10 → 现在 __/10
- 是否解决了context mismatch问题? [是/否]
- 还有什么问题? [...]
```

---

#### Case 2: Lack of Actionability - 建议太抽象

**User Query**:
```
我是AI产品经理,团队5个人,需要改进我们的LLM产品的迭代流程。
现在的问题是迭代太慢,一个功能要2周才能上线。
```

**Bad Output**:
```
**Expert 1**: 你需要建立更高效的workflow。

**Expert 2**: 我同意。敏捷开发很重要,要多做测试。

**Expert 3**: 另外数据驱动也很关键,要关注metrics。
```

**问题分析**:
```
[ 你的分析 ]

提示:
- 这些建议具体吗?用户能立即执行吗?
- "更高效的workflow"具体是什么?
- "多做测试"要怎么做?
- 缺少什么信息?
```

**Prompt修改**:
```
[ 粘贴你修改后的dialogue generation prompt ]

关键改动:
1. 加入"Actionability Template" - 强制要求specific steps
2. 加入"No Vague Language" rule
3. ...
```

**验证结果**:
```
[ 粘贴新输出,应该包含具体的步骤、时间线、工具建议 ]

改进评估:
- Actionability Score: 之前 3/10 → 现在 __/10
- 用户能否在Monday morning知道做什么? [是/否]
```

---

#### Case 3: Expert Redundancy - 专家观点重复

**Bad Output**:
```
**Expert 1**: 我认为微服务的优势是scalability和flexibility...

**Expert 2**: 我同意Expert 1的观点,微服务确实有很好的scalability...

**Expert 3**: 两位专家的洞见很深刻。补充一点,微服务的flexibility很重要...
```

**问题**: 3个专家都在说同样的事情,浪费tokens

**你的任务**:
- 分析为什么会出现redundancy
- 修改prompt,强制专家提供unique perspectives
- 验证修改后每个专家有不同的角度

---

#### Case 4: Hallucination - 专家名字编造

**Bad Output**:
```
**Experts Selected**:
1. 梁文峰 (AI技术专家)  ← 用户想要的真实人物
2. 张晓明 (产品经理)    ← 可能是编造的
3. Deep Wu (吴琦)       ← 名字拼凑,真实人物是吴承霖
```

**问题**: AI编造或混淆了专家名字

**你的任务**:
- 在prompt中加入verification机制
- 加入famous expert优先规则
- 测试能否减少hallucination

---

#### Case 5: Missing User Context - 没理解用户真实需求

**User Query**:
```
我的产品已经上线3个月了,有1000个用户,但conversion rate很低(2%)。
不知道是产品功能问题还是定价问题。
```

**Bad Output**:
```
[ 专家给了很多提升conversion rate的通用方法,但没人问"是哪个环节流失的?" ]
```

**问题**: 专家没有先clarify问题,直接给generic建议

**你的任务**:
- 让专家先"诊断"再"开药方"
- 修改prompt,加入"Ask clarifying questions"机制
- 验证专家是否能识别需要更多信息

---

### 提交要求

创建文件: `assignments/assignment1_prompt_archaeology.md`

**格式**:
```markdown
# Assignment 1: Prompt Archaeology

## Case 1: Context Mismatch
### 问题分析
[...]

### Prompt修改
[...]

### 验证结果
[...]

### 反思
[ 从这个case学到了什么?未来如何避免类似问题? ]

---

## Case 2: Lack of Actionability
[同上格式]

---

[ 5个cases的完整分析 ]

---

## 总结

### 最重要的3个learnings:
1. [...]
2. [...]
3. [...]

### 下一步优化方向:
[基于这5个cases,你认为当前prompt的最大问题是什么?]
```

### 评分标准

| 维度 | 描述 | 分值 |
|------|------|------|
| **问题分析深度** | 是否识别出根本原因(不是表面现象) | 30% |
| **Prompt修改合理性** | 改动是否针对性强,不是random试错 | 30% |
| **验证有效性** | 是否真的改进了,有before/after对比 | 25% |
| **反思质量** | 是否提炼出可复用的原则 | 15% |

**Pass标准**: 5个cases中至少3个有明显改进(+3分以上)

---

## 📚 Assignment 2: Build a Judge (进阶,10小时)

### 学习目标
- 理解LLM-as-a-Judge的设计原则
- 掌握如何定义可量化的评测标准
- 建立"评测先行"的开发习惯

### 背景

你已经有2个judges (actionability, expert-division),现在需要构建第3个:
**Context-Match Judge** - 评测专家是否匹配用户的context

---

### Part 1: 定义评测标准 (2小时)

**任务**: 写一个详细的rubric

```markdown
# Context-Match Judge Rubric

## 评分标准 (0-10分)

### 10分 (Perfect Match):
- 每个专家都有类似context的经验(如:solo dev匹配solo dev)
- 专家的建议考虑了用户的资源限制
- 没有"大公司方法用在小团队"的mismatch
- Example: [举一个10分的例子]

### 7-9分 (Good Match):
- 大部分专家match用户context
- 偶尔有轻微mismatch但不影响建议质量
- Example: [举一个8分的例子]

### 4-6分 (Partial Match):
- 部分专家match,部分不match
- 建议中有明显的context gap
- Example: [举一个5分的例子]

### 1-3分 (Poor Match):
- 多数专家不match用户context
- 建议明显不适用(如大厂方法给indie dev)
- Example: [举一个2分的例子]

### 0分 (Complete Mismatch):
- 所有专家都不match
- 或者专家身份本身就错了(如财务专家讨论技术问题)
- Example: [举一个0分的例子]
```

**提交**: `assignments/assignment2_context_match_rubric.md`

---

### Part 2: 实现Judge (4小时)

**任务**: 实现 `eval/judges/context-match-judge.ts`

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ContextMatchInput {
  userQuery: string;
  userContext: string;  // 用户的角色、资源、阶段等
  selectedExperts: Array<{
    name: string;
    title: string;
    reason: string;
  }>;
  dialogue: string;  // 完整的对话内容
}

interface ContextMatchOutput {
  score: number;  // 0-10
  analysis: {
    matchedExperts: string[];  // 哪些专家match
    mismatchedExperts: string[];  // 哪些专家不match
    contextGaps: string[];  // 具体的context gap
    evidence: string[];  // 支持判断的具体evidence
  };
  feedback: string;  // 给系统开发者的改进建议
}

export async function judgeContextMatch(
  input: ContextMatchInput
): Promise<ContextMatchOutput> {
  // TODO: 你的实现

  const prompt = `
  你是一个expert judge,评测AI专家圆桌的专家选择是否匹配用户的context。

  [ 插入你在Part 1设计的rubric ]

  用户Query: ${input.userQuery}
  用户Context: ${input.userContext}
  选择的专家: ${JSON.stringify(input.selectedExperts)}
  对话内容: ${input.dialogue}

  请评分并给出详细分析。输出JSON格式。
  `;

  // TODO: 调用Gemini API
  // TODO: Parse输出
  // TODO: 返回结构化结果
}
```

**关键要求**:
1. 必须使用few-shot examples(至少3个good + 3个bad)
2. 输出必须是structured JSON
3. 必须给出具体evidence(不是笼统的"不匹配")

---

### Part 3: Calibration (2小时)

**任务**: 在20个cases上测试你的judge,与人工评分对比

创建文件: `assignments/assignment2_calibration_results.md`

```markdown
# Context-Match Judge Calibration Results

## Methodology
- Test set: 20个golden cases
- Human raters: 我自己(或1-2个朋友)
- 每个case先人工打分,再用judge打分

## Results

| Case ID | Human Score | Judge Score | Diff | Agreement |
|---------|-------------|-------------|------|-----------|
| case-001 | 8 | 7 | -1 | ✅ Close |
| case-002 | 3 | 5 | +2 | ❌ Mismatch |
| ... | ... | ... | ... | ... |

## Statistical Analysis

- **Pearson Correlation**: 0.xx (目标 > 0.75)
- **Mean Absolute Error**: x.x (目标 < 1.5)
- **Agreement Rate** (±1分内): xx% (目标 > 80%)

## Error Analysis

### Judge打分过高的cases:
- Case-002: Judge给了5分,但人工只给3分
- 原因分析: [Judge没发现XX这个context gap]
- 修复方案: [在prompt中加强XX的检查]

### Judge打分过低的cases:
- Case-007: Judge给了4分,但人工给了7分
- 原因分析: [Judge对"部分匹配"过于严格]
- 修复方案: [调整rubric的4-6分标准]

## Iteration Log

### V1 (初始版本):
- Correlation: 0.65
- 问题: 对"famous but irrelevant"的专家过于宽容

### V2 (改进后):
- Correlation: 0.78 ✅
- 改动: 加入"context over fame"规则

### V3 (最终版本):
- Correlation: 0.82 ✅
- MAE: 1.2 ✅
```

---

### Part 4: 撰写Judge文档 (2小时)

**任务**: 为其他开发者写使用文档

创建文件: `eval/judges/README_CONTEXT_MATCH.md`

```markdown
# Context-Match Judge 使用文档

## 用途
评测专家选择是否匹配用户的具体context(角色、资源、阶段)

## 使用方法

\`\`\`typescript
import { judgeContextMatch } from './context-match-judge';

const result = await judgeContextMatch({
  userQuery: "...",
  userContext: "独立开发者,6个月runway",
  selectedExperts: [...],
  dialogue: "..."
});

console.log(result.score);  // 8
console.log(result.analysis.mismatchedExperts);  // []
\`\`\`

## 评分解释

| Score | 含义 | 何时出现 |
|-------|------|---------|
| 9-10 | Perfect match | 专家完美匹配用户处境 |
| 7-8 | Good match | 轻微mismatch但不影响质量 |
| 4-6 | Partial match | 部分专家不合适 |
| 1-3 | Poor match | 多数专家context错误 |
| 0 | Complete mismatch | 专家完全不相关 |

## 常见问题

### Q: Judge给了低分,但我觉得专家挺合适的?
A: 检查`analysis.contextGaps`,看具体是哪里mismatch。常见情况:
- "大公司CEO给indie dev建议" - 即使建议正确,context不match
- "退休专家给现役问题建议" - 信息可能过时

### Q: Judge的分数和人工评分差异>2分?
A: 可能需要re-calibration。收集这些cases,改进rubric。

## 已知局限

1. **Famous Expert Bias**: Judge有时会因为专家famous就给高分,即使context不match
   - Mitigation: 在prompt中强调"context over fame"

2. **Partial Context情况**: 如果user context信息不全,Judge可能无法准确评估
   - Mitigation: 在这种情况下给中等分(5-6),并在feedback中说明

## Changelog

- v1.0 (2025-11-27): 初始版本,correlation 0.65
- v1.1 (2025-11-28): 加入few-shot examples,correlation提升到0.78
- v1.2 (2025-11-29): 调整rubric,correlation 0.82
```

---

### 提交清单

- [ ] `assignments/assignment2_context_match_rubric.md`
- [ ] `eval/judges/context-match-judge.ts` (可运行的代码)
- [ ] `assignments/assignment2_calibration_results.md`
- [ ] `eval/judges/README_CONTEXT_MATCH.md`

### 评分标准

| 维度 | 分值 |
|------|------|
| Rubric清晰度(是否有clear criteria) | 20% |
| 实现质量(代码可运行,输出正确) | 30% |
| Calibration(correlation > 0.75) | 30% |
| 文档完整性 | 20% |

**Pass标准**: Correlation > 0.75 且 MAE < 1.5

---

## 📚 Assignment 3: Data Flywheel (进阶,12小时)

### 学习目标
- 理解"用户反馈 → 数据收集 → 评测 → 改进"的闭环
- 掌握如何从真实用户获取有价值的feedback
- 建立"数据驱动迭代"的工作流

### Part 1: 收集真实用户反馈 (4小时)

**任务**: 找10个真实用户,让他们试用你的产品

**步骤**:

1. **招募用户** (1h):
   - 目标: 10个真实用户(朋友、Twitter、Reddit等)
   - 标准: 必须是目标用户(创业者/PM/开发者)

2. **用户测试** (2h):
   ```
   给每个用户:
   1. 让他们问1个真实的问题
   2. 看完输出后,立即问:
      - "这个回答有用吗?" (1-10分)
      - "最满意的是什么?"
      - "最不满意的是什么?"
      - "如果重新来一次,你会问什么?"
   3. 记录所有反馈
   ```

3. **整理数据** (1h):
   创建文件: `data/user_feedback_10.jsonl`
   ```jsonl
   {"user_id": "user_001", "query": "...", "score": 7, "satisfied": "多视角很好", "unsatisfied": "太抽象,缺乏具体步骤", "improved_query": "..."}
   {"user_id": "user_002", ...}
   ```

---

### Part 2: 分析反馈模式 (3小时)

**任务**: 从10个反馈中找到common patterns

创建文件: `assignments/assignment3_feedback_analysis.md`

```markdown
# 用户反馈分析

## 数据概览
- 总用户数: 10
- 平均分: x.x / 10
- 分数分布:
  - 9-10分: x人
  - 7-8分: x人
  - 4-6分: x人
  - 1-3分: x人

## 满意点分析 (Affinity Mapping)

Top 3最常提到的优点:
1. "多视角" - 6人提到
2. "具体建议" - 4人提到
3. "专家匹配好" - 3人提到

## 不满意点分析

Top 3最常抱怨的问题:
1. "太抽象,缺乏actionable steps" - 5人
2. "专家选的不对" - 3人
3. "太慢" - 2人

## 根因分析

### Problem 1: "太抽象"
**Evidence**:
- User #2: "告诉我'需要注意风险'但没说具体风险"
- User #5: "建议'优化流程'但没说怎么优化"

**Root Cause**: Prompt缺乏"Actionability Template"

**Failed Cases**:
- case_user_002: Expert说"需要做市场调研"但没说具体怎么做
- case_user_005: Expert说"优化工作流"但没给步骤

### Problem 2: "专家选的不对"
**Evidence**:
- User #3: "给我推荐了Sam Altman,但我是solo dev"
- User #7: "专家都是大公司的,不理解我的资源限制"

**Root Cause**: Expert recruiter没有强制context match

**Failed Cases**:
- case_user_003: 给indie dev推荐了大公司CEO
- case_user_007: 给早期创业者推荐了成熟公司的方法
```

---

### Part 3: 针对性改进Prompt (3小时)

**任务**: 基于反馈,修改prompt解决top 2问题

```markdown
# Prompt Iteration Log

## Issue #1: "太抽象" - Actionability不足

### Before (当前prompt):
\`\`\`
[当前的dialogue generation prompt片段]
\`\`\`

### After (改进后):
\`\`\`
[新的prompt,加入Actionability Template:]

When giving advice, you MUST follow this format:
1. **Context**: 为什么这个建议适合这个用户(not generic)
2. **Specific Steps**: 3-5个可执行的步骤(not "需要做XX")
   - Step 1: [Verb] [Specific Action] [Timeline]
   - Example: "本周内,用Hotjar录制10个用户session"
3. **Success Metric**: 怎么判断做对了
4. **Common Pitfall**: 最容易犯的错误

Banned phrases:
❌ "需要注意..."
❌ "应该提升..."
❌ "要关注..."

Required patterns:
✅ "具体来说,你要..."
✅ "第一步,本周内..."
✅ "成功标准是..."
\`\`\`

### Why this works:
[解释为什么这个改动能解决问题]

---

## Issue #2: "专家选的不对" - Context Mismatch

### Before:
[...]

### After:
[加入更强的context match规则]

### Why this works:
[...]
```

---

### Part 4: A/B Test验证改进 (2小时)

**任务**: 用同样的10个queries,测试新旧版本

创建文件: `assignments/assignment3_ab_test_results.md`

```markdown
# A/B Test Results: V2 (old) vs V3 (new)

## Test Setup
- Test queries: 10个(来自用户反馈的真实queries)
- Version A (baseline): V2 with old prompts
- Version B (treatment): V3 with improved prompts

## Results

| Query ID | V2 Score | V3 Score | Delta | Improved? |
|----------|----------|----------|-------|-----------|
| query_001 | 6 | 8 | +2 | ✅ |
| query_002 | 5 | 7 | +2 | ✅ |
| query_003 | 7 | 7 | 0 | - |
| ... | ... | ... | ... | ... |

## Statistical Summary

- **Mean improvement**: +x.x points
- **Win rate**: x/10 queries improved
- **Regression**: x/10 queries got worse
- **No change**: x/10 queries same

## Dimension Analysis

| Dimension | V2 Average | V3 Average | Improvement |
|-----------|------------|------------|-------------|
| Actionability | 5.2 | 7.8 | +2.6 ✅ |
| Context Match | 6.5 | 8.1 | +1.6 ✅ |
| Overall | 6.1 | 7.5 | +1.4 ✅ |

## Case Studies

### Biggest Improvement: Query #2 (5 → 8, +3)
**Query**: "我是solo dev,该不该加AI功能?"

**V2 Output Problem**:
- 专家说"AI是趋势,应该关注"
- 太abstract,没有具体建议

**V3 Output Improvement**:
- 专家说"第一步:本周做个landing page测试需求"
- 给了3-step plan with timeline

**Why it worked**: Actionability template强制了具体步骤

---

### Regression Case: Query #7 (7 → 6, -1)
**Query**: [...]

**Why it got worse**: [分析为什么改进导致了这个case变差]

**Lesson learned**: [如何避免类似regression]
```

---

### 提交清单

- [ ] `data/user_feedback_10.jsonl`
- [ ] `assignments/assignment3_feedback_analysis.md`
- [ ] `assignments/assignment3_prompt_improvements.md`
- [ ] `assignments/assignment3_ab_test_results.md`

### 评分标准

| 维度 | 分值 |
|------|------|
| 反馈数据质量(真实用户,详细记录) | 25% |
| 分析深度(找到root cause,不是表面现象) | 25% |
| Prompt改进合理性(针对性强) | 25% |
| A/B test结果(有明显improvement) | 25% |

**Pass标准**: A/B test显示平均improvement > 1.0分,且无major regression

---

## 📚 Assignment 4: Competitive Deep Dive (高级,10小时)

### 任务描述

选择一个竞品(推荐: Deep Research或Perplexity),做深度拆解分析。

### Part 1: Product Teardown (4h)

**创建**: `assignments/assignment4_competitive_teardown.md`

**分析维度**:

1. **核心技术架构**:
   - 用什么模型?(如何推测)
   - Multi-agent还是single-shot?
   - 有搜索吗?有多少steps?

2. **Prompt Engineering**:
   - 通过试探性问题,reverse engineer他们的prompt
   - Example:故意问edge case,看如何处理

3. **用户体验**:
   - 响应速度
   - 输出格式
   - 交互流程

4. **强项与弱项**:
   - 在什么场景明显优于你的产品?
   - 在什么场景不如你?

### Part 2: Feature Gap Analysis (3h)

**任务**: 列出竞品有而你没有的features,评估是否应该做

```markdown
# Feature Gap Analysis: Chat-with-Experts vs Deep Research

| Feature | 他们有 | 我们有 | 是否应该做? | 优先级 | 工作量 |
|---------|--------|--------|------------|--------|--------|
| 搜索引用 | ✅ | ❌ | ? | ? | ? |
| Multi-step reasoning | ✅ | Partially | ? | ? | ? |
| ... | ... | ... | ... | ... | ... |

## Feature #1: 搜索引用

**描述**: Deep Research会搜索最新信息并给出引用

**Pros**(如果我们做):
- 可以处理需要最新信息的queries
- 增加credibility(可验证)

**Cons**(如果我们做):
- 增加响应时间(+5s)
- 偏离核心定位(我们是"视角模拟"不是"信息检索")

**决策**: ❌ 不做
**理由**: 不在我们的core value prop上。用户需要搜索时,应该用Perplexity。

---

## Feature #2: Multi-step reasoning

**描述**: Deep Research会分多步thinking

**Pros**:
- 可以处理更复杂的问题
- 思考过程更透明

**Cons**:
- 我们已经有Director-Actor模式,是另一种multi-step

**决策**: ✅ 改进现有的CoT机制
**理由**: 提升现有架构,而不是照搬竞品

---

[对每个feature gap做类似分析]
```

### Part 3: 战略定位建议 (3h)

**基于以上分析,撰写战略定位建议**

```markdown
# 战略定位建议

## 核心问题: 我们应该和Deep Research竞争吗?

**答案**: ❌ 不应该直接竞争

**理由**:
1. Deep Research的核心价值是"全面调研",我们的核心价值是"多视角权衡"
2. 如果我们试图在"调研全面性"上竞争,会稀释我们的差异化
3. 更好的策略是"场景互补",不是"功能对标"

## 建议的产品演进路径

### 不要做 (No-Go):
- ❌ 加入搜索引擎(偏离定位)
- ❌ 做成"更全面的Deep Research"(打不赢)
- ❌ 增加大量general features(稀释focus)

### 应该做 (Yes-Go):
- ✅ 深化Context-Aware Expert Matching(护城河)
- ✅ 提升Actionability(差异化)
- ✅ 针对3个hero scenarios做到极致
- ✅ 在landing page明确说"什么时候用我们 vs Deep Research"

## 6个月后的目标状态

**用户心智**:
- 需要全面调研 → Deep Research
- 需要多视角权衡决策 → Chat-with-Experts
- 需要快速答案 → ChatGPT

**Metrics**:
- 在hero scenarios上,NPS > Deep Research
- 用户能清楚说出"什么时候用谁"
```

---

### 提交清单

- [ ] `assignments/assignment4_competitive_teardown.md`
- [ ] `assignments/assignment4_feature_gap.md`
- [ ] `assignments/assignment4_strategy.md`

### 评分标准

| 维度 | 分值 |
|------|------|
| 拆解深度(不是表面对比) | 35% |
| Feature gap分析合理性 | 30% |
| 战略建议可行性 | 35% |

---

## 📚 Assignment 5: Build an Evaluation Harness (高级,16小时)

### 任务描述

构建一个自动化评测系统,可以快速对比不同prompt版本的效果。

### Part 1: 设计架构 (4h)

**需求**:
1. 输入: 一个prompt版本ID
2. 运行: 在100个golden cases上测试
3. 输出: 各维度分数 + 对比baseline的improvement

**创建**: `eval/harness/ARCHITECTURE.md`

```markdown
# Evaluation Harness Architecture

## 系统设计

### Components

1. **Test Case Loader**
   - 读取golden dataset (100个cases)
   - Parse query, expected experts, success criteria

2. **Test Runner**
   - 对每个case,调用系统生成output
   - 记录latency, errors

3. **Judge Orchestrator**
   - 运行所有judges (actionability, expert-match, context-match等)
   - 汇总分数

4. **Reporter**
   - 生成对比报告
   - 识别regression cases
   - 可视化(雷达图)

### Data Flow

\`\`\`
Test Cases (100)
  → Test Runner (generate outputs)
  → Judge Orchestrator (evaluate outputs)
  → Aggregator (compute scores)
  → Reporter (generate report)
\`\`\`

### 文件结构

\`\`\`
eval/
├── harness/
│   ├── runner.ts          # 主运行器
│   ├── loader.ts          # 加载test cases
│   ├── judgeOrchestrator.ts  # 协调所有judges
│   ├── reporter.ts        # 生成报告
│   └── visualize.ts       # 可视化
├── results/
│   └── v2_vs_v3_vs_v4.json
└── golden-dataset/
    └── cases_100.json
\`\`\`
```

---

### Part 2: 实现核心组件 (8h)

#### Task 2.1: Test Runner (3h)

```typescript
// eval/harness/runner.ts

import { loadGoldenDataset } from './loader';
import { runAllJudges } from './judgeOrchestrator';

interface EvalConfig {
  version: string;  // 'v2', 'v3', etc.
  testCases: string[];  // case IDs to test, or 'all'
  judgeWeights: {
    actionability: number;
    expertMatch: number;
    contextMatch: number;
    // ...
  };
}

interface EvalResult {
  version: string;
  timestamp: string;
  results: Array<{
    caseId: string;
    query: string;
    systemOutput: {
      experts: any[];
      dialogue: string;
    };
    scores: {
      actionability: number;
      expertMatch: number;
      contextMatch: number;
      overall: number;
    };
    latency: number;
    error?: string;
  }>;
  summary: {
    overall: number;
    actionability: number;
    expertMatch: number;
    // ...
  };
}

export async function runEvaluation(
  config: EvalConfig
): Promise<EvalResult> {
  const testCases = loadGoldenDataset(config.testCases);

  const results = [];

  for (const testCase of testCases) {
    const startTime = Date.now();

    try {
      // 1. 生成output
      const systemOutput = await generateResponse(
        testCase.query,
        testCase.userContext,
        config.version
      );

      // 2. 运行所有judges
      const scores = await runAllJudges({
        query: testCase.query,
        userContext: testCase.userContext,
        systemOutput: systemOutput,
      });

      // 3. 记录结果
      results.push({
        caseId: testCase.id,
        query: testCase.query,
        systemOutput: systemOutput,
        scores: scores,
        latency: Date.now() - startTime,
      });

    } catch (error) {
      results.push({
        caseId: testCase.id,
        query: testCase.query,
        error: error.message,
      });
    }
  }

  // 4. 计算summary
  const summary = computeSummary(results, config.judgeWeights);

  return {
    version: config.version,
    timestamp: new Date().toISOString(),
    results: results,
    summary: summary,
  };
}

function computeSummary(results, weights) {
  // TODO: 计算加权平均分
}
```

#### Task 2.2: Reporter (3h)

```typescript
// eval/harness/reporter.ts

interface ComparisonReport {
  baseline: EvalResult;
  treatment: EvalResult;
  comparison: {
    overallImprovement: number;  // +1.2
    dimensionImprovements: {
      actionability: number;
      expertMatch: number;
      // ...
    };
    regressionCases: string[];  // case IDs that got worse
    improvementCases: string[];  // case IDs that got better
    statisticalSignificance: boolean;  // t-test result
  };
}

export function generateComparisonReport(
  baseline: EvalResult,
  treatment: EvalResult
): ComparisonReport {
  // TODO: 实现对比逻辑

  // 1. 计算overall improvement
  const overallImprovement =
    treatment.summary.overall - baseline.summary.overall;

  // 2. 找regression cases
  const regressionCases = [];
  for (let i = 0; i < baseline.results.length; i++) {
    const baseScore = baseline.results[i].scores.overall;
    const treatScore = treatment.results[i].scores.overall;
    if (treatScore < baseScore - 1.0) {  // 降低超过1分算regression
      regressionCases.push(baseline.results[i].caseId);
    }
  }

  // 3. Statistical test
  const pValue = tTest(
    baseline.results.map(r => r.scores.overall),
    treatment.results.map(r => r.scores.overall)
  );

  return {
    baseline,
    treatment,
    comparison: {
      overallImprovement,
      dimensionImprovements: { /* ... */ },
      regressionCases,
      improvementCases: /* ... */,
      statisticalSignificance: pValue < 0.05,
    },
  };
}

export function exportMarkdownReport(report: ComparisonReport): string {
  return `
# Evaluation Report: ${report.treatment.version} vs ${report.baseline.version}

## Summary

- **Overall Improvement**: ${report.comparison.overallImprovement > 0 ? '+' : ''}${report.comparison.overallImprovement.toFixed(2)}
- **Statistical Significance**: ${report.comparison.statisticalSignificance ? '✅ Yes (p < 0.05)' : '❌ No'}

## Dimension Breakdown

| Dimension | Baseline | Treatment | Delta |
|-----------|----------|-----------|-------|
| Actionability | ${report.baseline.summary.actionability.toFixed(1)} | ${report.treatment.summary.actionability.toFixed(1)} | ${/* ... */} |
| Expert Match | ... | ... | ... |

## Regression Cases (${report.comparison.regressionCases.length})

${report.comparison.regressionCases.map(caseId => {
  const baseCase = report.baseline.results.find(r => r.caseId === caseId);
  const treatCase = report.treatment.results.find(r => r.caseId === caseId);
  return `
### ${caseId}
- **Query**: ${baseCase.query}
- **Baseline Score**: ${baseCase.scores.overall}
- **Treatment Score**: ${treatCase.scores.overall}
- **Delta**: ${(treatCase.scores.overall - baseCase.scores.overall).toFixed(1)}
`;
}).join('\n')}

## Recommendation

${report.comparison.overallImprovement > 0.5 && !report.comparison.regressionCases.length
  ? '✅ Safe to deploy treatment version'
  : '⚠️ Review regression cases before deploying'}
  `;
}
```

#### Task 2.3: CLI Interface (2h)

```bash
# 运行单个版本评测
npm run eval -- --version v3 --cases all

# 对比两个版本
npm run eval:compare -- --baseline v2 --treatment v3

# 只测试部分cases
npm run eval -- --version v3 --cases case-001,case-002,case-003

# 生成报告
npm run eval:report -- --baseline v2 --treatment v3 --output report.md
```

---

### Part 3: 实战测试 (4h)

**任务**: 用你的harness对比V2 vs V3

1. 运行evaluation
2. 生成报告
3. 分析regression cases
4. 撰写总结

**提交**: `assignments/assignment5_eval_results.md`

```markdown
# V2 vs V3 Evaluation Results

## Test Setup
- Baseline: V2 (old prompts)
- Treatment: V3 (improved prompts after user feedback)
- Test cases: 100 golden cases
- Date: 2025-11-27

## Summary Results

| Metric | V2 | V3 | Delta | Significant? |
|--------|----|----|-------|--------------|
| Overall | 6.8 | 7.9 | +1.1 | ✅ (p=0.003) |
| Actionability | 6.2 | 8.1 | +1.9 | ✅ |
| Expert Match | 7.5 | 8.3 | +0.8 | ✅ |
| Context Match | 6.5 | 7.6 | +1.1 | ✅ |

## Key Findings

### 🎉 Major Improvements
1. **Actionability +1.9**: 新prompt的actionability template起作用了
2. **63% of cases improved**: 100个cases中63个有提升

### ⚠️ Regression Cases (8个)

**Case-007**: "早期创业者PMF验证"
- V2 Score: 8.2 → V3 Score: 7.1 (-1.1)
- **问题**: 新prompt过于强调"具体步骤",导致专家没有先clarify用户的具体情况就直接给方案
- **修复建议**: 在actionability template前加"Clarification Phase"

**Case-023**: ...
[分析其他7个regression cases]

### 💡 Insights

1. **Actionability Template works**: 强制要求specific steps确实提升了可执行性
2. **Trade-off**: 过于关注actionability可能牺牲了contextual understanding
3. **Next step**: 需要平衡actionability和context awareness

## Deployment Decision

✅ **Recommend deploying V3**, but with following improvements:
1. 修复case-007类的clarification问题
2. 监控production数据,看是否有类似regression
3. 2周后重新评测
```

---

### 提交清单

- [ ] `eval/harness/` (完整代码)
- [ ] `assignments/assignment5_architecture.md`
- [ ] `assignments/assignment5_eval_results.md`
- [ ] 可运行的CLI命令

### 评分标准

| 维度 | 分值 |
|------|------|
| 架构设计合理性 | 25% |
| 代码实现质量 | 30% |
| 报告分析深度 | 25% |
| 可用性(其他开发者能用) | 20% |

---

## 📚 Assignment 6: End-to-End Project (综合,40小时)

### 任务描述

从用户访谈到prompt优化到评测,完整走一遍workflow。

这是一个综合性作业,检验你是否掌握了整个agent开发流程。

### Week 1: 发现问题 (16h)

- [ ] 招募并访谈5个用户
- [ ] 识别最大的1-2个问题
- [ ] 撰写problem statement

### Week 2: 设计方案 (8h)

- [ ] 设计prompt改进方案
- [ ] 写出expected improvement hypothesis
- [ ] 准备A/B test计划

### Week 3: 实现与测试 (12h)

- [ ] 修改prompt
- [ ] 在20个cases上测试
- [ ] 运行evaluation harness

### Week 4: 分析与报告 (4h)

- [ ] 对比before/after
- [ ] 分析regression cases
- [ ] 撰写最终报告

### 最终提交

`assignments/assignment6_final_report.md`:
- 用户访谈摘要
- Problem statement
- 解决方案设计
- 实现细节
- A/B test结果
- Lessons learned

**这个assignment没有标准答案,评分完全基于你的workflow严谨性和改进效果。**

---

## 🎓 总结

完成这6个assignments后,你将掌握:

1. **Prompt Engineering**: 从失败案例学习,系统性优化
2. **Evaluation Design**: 构建可靠的LLM judge
3. **Data-Driven Iteration**: 用户反馈 → 分析 → 改进 → 验证的闭环
4. **Competitive Strategy**: 如何定位产品,不盲目对标
5. **Infrastructure**: 构建自动化评测系统
6. **End-to-End Execution**: 完整的agent开发workflow

**时间投入**: ~86小时
**建议节奏**: 每周完成1-2个assignments

**Good luck! 🚀**
