# Chat-with-Experts 项目完整规划

**项目经理**: Claude (模拟角色: 有5年Agent项目经验的PM)
**目标受众**: Agent新手开发者
**项目类型**: 前沿Multi-Agent对话系统
**当前阶段**: MVP已完成,进入产品打磨和数据驱动优化阶段

---

## 📋 执行摘要 (Executive Summary)

### 项目核心问题
你正在构建一个"通过多专家讨论强制AI深度思考"的产品,但面临三个根本问题:

1. **产品定位不清**: 什么时候用户应该用你的产品而不是ChatGPT/Deep Research?
2. **质量标准模糊**: 什么样的输出才算"比普通chat好"?
3. **迭代路径不明**: 如何系统性地提升prompt质量?

### 对标产品分析

| 产品 | 核心机制 | 适用场景 | 你的差异化 |
|------|---------|---------|-----------|
| ChatGPT/Claude | 单一AI回答 | 信息检索,单一明确答案 | **多视角trade-off** |
| Deep Research | 多步推理+搜索 | 需要全面调研的开放问题 | **Context-aware peer validation** |
| Perplexity | 搜索+引用溯源 | 需要实时信息和来源 | **专家身份credibility** |
| Character.AI | 角色扮演聊天 | 娱乐,情感陪伴 | **决策支持,actionability** |

**你的护城河**: Context-Aware Expert Matching + Multi-perspective Trade-off Guidance

### 如果你是Isa Fulford (OpenAI Developer Relations)

她会这样做这个项目:

1. **Week 1-2**: 先做50次"Wizard of Oz"测试(你手动扮演系统,用户不知道)来验证需求
2. **Week 3-4**: 提炼出3-5个"golden queries"(最能体现产品价值的问题类型)
3. **Week 5-8**: 针对这些queries手工打磨prompt,直到90%的情况下输出quality > baseline
4. **Week 9-12**: 构建评测harness,扩展到100个test cases,开始迭代优化

**核心原则**: "Don't scale what doesn't work. Make 10 users love you before making 1000 users like you."

### 如果你是Josh Tobin (Gantry/Full Stack Deep Learning创始人)

他会这样做:

1. **Product-Market Fit First**: 先定义3个"hero scenarios"(最有价值的场景),手工优化到极致
2. **Data Flywheel**: 从day 1就记录所有输入输出,构建evaluation harness
3. **Model Iteration**: 先用prompt engineering到极限,再考虑fine-tuning(如果需要)
4. **Metrics-Driven**: 定义清晰的成功指标(如"85% of queries在actionability维度 > 8分")

**核心原则**: "Data is the moat. Models are commodities."

---

## 🎯 Phase 1: 产品定位与假设验证 (2周,80小时)

**目标**: 回答"什么场景下用户应该用我的产品?"

### Week 1: 竞品深度分析 (40小时)

#### Day 1-2: 自己成为重度用户 (16h)

**任务**:
1. 准备20个不同类型的问题(覆盖信息检索/决策支持/创意生成/情感支持等)
2. 在ChatGPT, Deep Research, Perplexity, 你的产品上各问一遍
3. 每个对比做详细笔记:
   - 哪个产品的回答最有用?为什么?
   - 用户体验差异(速度/格式/可读性)
   - 情感反应(信任度/满意度)

**产出**: `research/competitive_analysis.md` (包含20个case的详细对比)

**时间分配**:
- 准备问题: 2h
- ChatGPT测试: 3h
- Deep Research测试: 4h (因为慢)
- Perplexity测试: 2h
- 你的产品测试: 3h
- 撰写分析: 2h

#### Day 3-4: 用户访谈准备与执行 (16h)

**任务**:
1. 找5-10个目标用户(创业者/PM/独立开发者)
2. 让他们同时试用你的产品和ChatGPT
3. 观察他们的反应,记录verbatim quotes

**关键问题**:
- "你会在什么情况下用这个产品而不是ChatGPT?"
- "这个产品最让你满意/不满意的是什么?"
- "如果要为这个产品付费,它必须做到什么?"

**产出**: `research/user_interviews.md`

**时间分配**:
- 招募用户: 4h
- 每个访谈: 1h × 8人 = 8h
- 整理笔记: 4h

#### Day 5: 提炼产品定位假设 (8h)

**任务**: 基于前4天的数据,完成以下分析:

1. **用户痛点矩阵**:
   ```
   | 痛点 | ChatGPT解决程度 | Deep Research解决程度 | 我的产品解决程度 | 证据来源 |
   ```

2. **Hero Scenarios** (你最有优势的3个场景):
   - Scenario 1: [描述]
   - Scenario 2: [描述]
   - Scenario 3: [描述]

3. **Anti-Scenarios** (明确不适合的场景,避免浪费时间):
   - 纯信息检索
   - 创意生成
   - ...

**产出**: `research/product_positioning_v2.md` (迭代你现有的PRODUCT_POSITIONING.md)

### Week 2: Golden Dataset设计 (40小时)

#### Day 1-3: 收集真实用户query (24h)

**目标**: 收集100个真实用户问题

**方法**:
1. 在Twitter/Reddit/Indie Hackers发帖征集:"有什么决策让你纠结超过1周的?"
2. 从你的访谈中提取真实问题
3. 从竞品的公开demo/case studies中提取
4. 自己brainstorm(基于persona)

**分类标准**:
```
- Trade-off类 (A vs B选择)
- Context-sensitive类 (通用建议无效)
- Peer-validation类 (需要同行经验)
- Cross-domain类 (需要多领域视角)
```

**产出**: `eval/golden-dataset/raw_queries_100.json`

**时间分配**:
- 社区征集: 8h (发帖+回复+整理)
- 从访谈提取: 4h
- 竞品研究: 6h
- Brainstorm: 4h
- 分类和标注: 2h

#### Day 4-5: 手工标注"期望输出" (16h)

**任务**: 从100个中精选20个,手工撰写"理想输出"

**标注内容**:
1. **Expected Experts**: 最合适的2-4个专家(真实姓名)
2. **Expected Key Points**: 每个专家应该讲的核心观点
3. **Expected Structure**: 讨论的理想结构(先讨论什么,后讨论什么)
4. **Success Criteria**: 针对这个case,什么样的输出算成功

**标注示例**:
```json
{
  "query": "我是solo开发者,该不该给产品加AI功能?",
  "user_context": "独立开发者,6个月runway,产品有1000个用户",
  "expected_experts": [
    "Pieter Levels (Nomad List创始人)",
    "Daniel Vassallo (前AWS工程师,独立开发者)"
  ],
  "expected_key_points": {
    "Pieter Levels": [
      "opportunity cost: 加AI功能 vs 其他功能的trade-off",
      "验证需求: 先做landing page测试,别直接做"
    ],
    "Daniel Vassallo": [
      "避免FOMO: 不是所有产品都需要AI",
      "关注PMF: 如果现有1000用户都不付费,加AI不会解决问题"
    ]
  },
  "anti_patterns": [
    "Sam Altman/Elon Musk等大佬观点(context mismatch)",
    "理论性的'AI是趋势'说教",
    "没有考虑资源限制的建议"
  ],
  "success_score": {
    "expert_match": 9,
    "actionability": 8,
    "context_awareness": 9
  }
}
```

**产出**: `eval/golden-dataset/annotated_20.json`

**时间分配**: 每个case标注约40分钟 × 20 = ~16h

---

## 🎯 Phase 2: Prompt工程与质量提升 (4周,160小时)

**目标**: 将核心prompt的质量提升到"在20个golden cases上,80%达到success criteria"

### Week 3-4: Prompt深度优化 (80小时)

#### 核心方法论: "Prompt Archaeology"

不要从零开始写prompt,而是:
1. 运行你的系统在20个golden cases上
2. 对比"实际输出" vs "期望输出",找到gap
3. 分类gap类型(专家选错/观点太浅/缺乏actionability/...)
4. 针对每类gap,在prompt中加入specific instruction
5. 重新测试,直到gap缩小

#### Day 1-5: 专家招募prompt优化 (40h)

**当前问题**(基于你的PRODUCT_POSITIONING.md):
- 容易选到"名气大但context不match"的专家(如给indie dev推荐Sam Altman)
- 缺乏"peer validation"意识

**优化策略**:

1. **Few-shot Examples** (2h):
   在prompt中加入3个好例子和3个坏例子:
   ```
   Good Example:
   Query: "我是solo dev,该不该加AI功能?"
   Context: 独立开发者,资源有限
   ✅ Correct: Pieter Levels (indie hacker peer)
   ❌ Wrong: Sam Altman (context mismatch - 大公司CEO)

   Bad Example:
   Query: "早期创业团队如何验证PMF?"
   Context: 6个月runway,5人团队
   ✅ Correct: 早期创业者(如YC alum with 0-1 exp)
   ❌ Wrong: 500强公司创新总监
   ```

2. **Chain-of-Thought for Expert Selection** (8h):
   让模型在选专家前,先分析user context:
   ```
   Step 1: 分析用户处境
   - Role: [solo dev / PM at startup / ...]
   - Resources: [limited / well-funded / ...]
   - Stage: [idea stage / growth stage / ...]

   Step 2: 匹配标准
   - Must have: 在类似context下工作过的人
   - Avoid: 大公司高管/纯理论家/...

   Step 3: 候选专家
   - Expert 1: [name] - [why match]
   - Expert 2: [name] - [why match]
   ```

3. **Verification Checklist** (2h):
   在prompt末尾加入self-check:
   ```
   Before finalizing, verify:
   [ ] 每个专家都是widely-known的真实人物?
   [ ] 专家的background match用户的context?
   [ ] 如果用户明确要求某人,是否包含了?
   [ ] 是否避免了"名气陷阱"(famous but irrelevant)?
   ```

4. **迭代测试** (20h):
   - 在20个golden cases上测试新prompt
   - 记录每个case的专家选择
   - 计算Expert Match分数
   - 目标: 平均分 > 8/10

5. **Edge Cases处理** (8h):
   针对特殊情况加入handling:
   - 用户明确指定某个专家
   - 用户complain某个专家没用
   - 高度专业化的话题(如"城投债")

**产出**:
- `services/prompts_v3_expert_recruiter.ts`
- `eval/reports/expert_selection_improvement.md`

**时间分配**:
- 分析当前gap: 8h
- 设计优化方案: 8h
- 实现+测试: 20h
- Edge cases: 4h

#### Day 6-10: 对话生成prompt优化 (40h)

**当前问题**:
- 专家容易重复观点("我同意XX所说的...")
- 缺乏具体例子(说"需要注意风险"但不说具体风险)
- 不够actionable(缺乏时间线和具体步骤)

**优化策略**:

1. **NO FLUFF规则强化** (8h):
   ```
   Banned Patterns (立即拒绝):
   ❌ "两位专家的洞见很深刻..."
   ❌ "我同意XX的观点..." (除非后面有NEW insight)
   ❌ "需要注意..." (必须说具体是什么风险)
   ❌ "应该提升能力" (必须说怎么提升)

   Required Patterns:
   ✅ Specific numbers/companies/timeframes
   ✅ "For example, when I worked on X, we did Y..."
   ✅ "Here's a 3-step plan: Week 1... Week 2..."
   ```

2. **Few-shot Examples for Dialogue** (12h):
   在prompt中加入高质量对话示例:
   ```
   Bad Output:
   **专家A**: 我认为AI是未来趋势,应该关注。
   **专家B**: 我同意A的观点,确实很重要。

   Good Output:
   **Pieter Levels**: 我去年给Nomad List加了AI功能,结果发现80%用户根本不用。
   最后我删了,因为维护成本(每月$500 API费)超过了价值。
   我的建议:先做个landing page,写"AI-powered XX功能即将推出",看有多少人点击。
   如果<10%,别做。

   **Daniel Vassallo**: 补充一点opportunity cost。加AI功能可能要2周。
   这2周你本可以做什么?如果是修10个用户反馈的bug,后者ROI更高。
   ```

3. **Actionability Template** (8h):
   强制每个建议都follow这个结构:
   ```
   When giving advice, use this format:
   1. **Context**: 为什么这个建议适合这个用户
   2. **Specific Action**: 3-5个具体步骤
   3. **Timeline**: 每步大概多久
   4. **Success Metric**: 怎么判断做对了
   5. **Pitfall**: 最容易犯的错误
   ```

4. **迭代测试** (12h):
   - 在20个cases上测试
   - 计算Actionability分数
   - 目标: 平均分 > 7.5/10

**产出**:
- `services/prompts_v3_dialogue.ts`
- `eval/reports/dialogue_quality_improvement.md`

### Week 5-6: 自动化评测系统 (80小时)

#### Day 1-3: 完成4个核心Judge (24h)

你已经有2个judge(actionability, expert-division),需要补齐:

1. **Relevance Judge** (8h):
   ```typescript
   // 评测维度:
   - 是否回答了用户的真实问题(不是表面问题)
   - 是否理解了user context
   - 是否有"答非所问"的情况
   ```

2. **Conciseness Judge** (6h):
   ```typescript
   // 评测维度:
   - 信息密度(有用信息 / 总字数)
   - 是否有废话和套话
   - 是否过于冗长
   ```

3. **Expert Match Judge** (6h):
   ```typescript
   // 评测维度:
   - 专家是否match用户context
   - 是否避免了"名气陷阱"
   - 是否有context mismatch(大公司方法用在小团队)
   ```

4. **Novelty Judge** (4h):
   ```typescript
   // 评测维度:
   - 是否有counter-intuitive观点
   - 是否有ChatGPT不会说的内容
   - 是否提供了peer validation
   ```

**时间分配**: 每个judge约4-8小时(设计评测标准+实现+测试)

#### Day 4-5: 评测运行器与报告 (16h)

**任务**:
1. 实现`eval/main.ts`: 批量运行20个golden cases
2. 生成对比报告: V1 vs V2 vs V3
3. 可视化: 雷达图显示各维度分数

**产出**:
- `eval/main.ts`
- `eval/reports/v1_vs_v2_vs_v3_comparison.md`

#### Day 6-10: 扩展到100个测试用例 (40h)

**方法**: 使用LLM辅助生成

1. **Prompt设计** (8h):
   ```
   基于这20个hand-crafted golden cases,生成80个类似质量的测试用例。

   要求:
   - 覆盖相同的场景类型(trade-off/peer-validation/...)
   - 变化user context(不同角色/资源/阶段)
   - 确保多样性(不要20个都是"独立开发者")
   ```

2. **生成+人工筛选** (20h):
   - 让Claude/GPT-4生成100个
   - 人工review,删除质量差的
   - 保留80个高质量的

3. **标注** (12h):
   - 对80个新case做简化标注(不需要像前20个那么详细)
   - 至少标注expected expert类型和成功标准

**产出**: `eval/golden-dataset/cases_100.json`

---

## 🎯 Phase 3: 数据生产与训练准备 (3周,120小时)

**目标**: 为potential fine-tuning准备高质量数据

### Week 7: 数据收集pipeline (40小时)

#### Day 1-2: Production logging (16h)

**任务**: 在production环境收集真实用户数据

1. **隐私设计** (4h):
   ```typescript
   // 收集什么:
   ✅ Query (anonymized)
   ✅ User context
   ✅ Selected experts
   ✅ Generated dialogue
   ✅ User feedback (if any)

   // 不收集什么:
   ❌ User identity
   ❌ Session history beyond current query
   ```

2. **实现logging middleware** (8h):
   - 每次对话自动记录到`data/production_logs/`
   - 格式: JSON Lines
   - 包含timestamp, version, model等metadata

3. **用户反馈收集** (4h):
   - 在UI中加入"这个回答有用吗?" 👍👎
   - 如果👎,收集原因(太抽象/专家不合适/...)

**产出**: `data/production_logs/YYYY-MM-DD.jsonl`

#### Day 3-5: 人工标注workflow (24h)

**目标**: 前20条必须人工标注,建立质量标准

**标注内容**:
```json
{
  "query": "...",
  "system_output": {
    "experts": [...],
    "dialogue": "..."
  },
  "human_annotation": {
    "quality_score": 7.5,
    "issues": [
      "Expert 2的观点太浅",
      "缺乏具体时间线"
    ],
    "ideal_output": "理想情况下应该...",
    "labels": {
      "actionability": 6,
      "expert_match": 8,
      "relevance": 9,
      "conciseness": 7,
      "novelty": 5
    }
  }
}
```

**标注guideline** (8h):
   - 撰写详细的标注手册
   - 包含每个维度的评分标准
   - 包含good/bad examples

**标注执行** (16h):
   - 每条标注约30-40分钟
   - 20条 × 40分钟 = ~13小时
   - Review和calibration: 3小时

**产出**:
- `data/annotated/manual_20.jsonl`
- `data/annotation_guidelines.md`

### Week 8-9: 半自动数据生成 (80小时)

**目标**: 基于20条人工标注,生成500条高质量训练数据

#### Method 1: LLM-as-Labeler (40h)

**Day 1-2: 设计评分prompt** (16h):

1. **Few-shot learning** (8h):
   ```
   你是一个expert judge。基于以下20个人工标注的例子,
   对新的系统输出进行评分。

   [插入20个hand-labeled examples]

   评分标准:
   - Actionability: [详细标准]
   - Expert Match: [详细标准]
   - ...

   新的case:
   [待评测的输出]

   输出JSON格式的评分和理由。
   ```

2. **Calibration** (4h):
   - 在10个held-out cases上测试
   - 对比LLM评分 vs 人工评分
   - 调整prompt直到相关系数 > 0.8

3. **批量评分** (4h):
   - 对production logs中的100条数据评分
   - 生成带label的数据集

**Day 3-5: 数据清洗与过滤** (24h):

1. **质量过滤** (8h):
   - 删除低质量对话(任何维度 < 5分)
   - 删除重复/近似重复的queries
   - 保留高质量样本(平均分 > 7)

2. **多样性检查** (8h):
   - 确保覆盖不同场景类型
   - 确保user context多样性
   - 使用embedding clustering检测多样性

3. **数据增强** (8h):
   - 对高质量cases做paraphrasing
   - 变换user context
   - 生成counter-factual examples

**产出**: `data/training/high_quality_500.jsonl`

#### Method 2: Synthetic Data Generation (40h)

**Day 6-10: 用AI生成训练数据**:

1. **Query generation** (16h):
   ```
   给Claude/GPT-4一个prompt:
   "生成100个符合以下特征的query:
   - 场景类型: Trade-off decision
   - 用户角色: 早期创业者
   - 复杂度: 需要2-3个expert的multi-perspective

   每个query必须包含:
   - 明确的user context
   - 具体的决策困境
   - 隐含的资源限制"
   ```

2. **人工筛选** (8h):
   - Review生成的queries
   - 删除不现实/太简单/太复杂的
   - 保留最像真实用户的

3. **生成完整对话** (16h):
   - 用你的系统生成对话
   - 用judge自动评分
   - 保留高分样本

**产出**: `data/synthetic/generated_300.jsonl`

---

## 🎯 Phase 4: 评测与迭代 (2周,80小时)

### Week 10: 构建评测agent (40小时)

**目标**: 自动化评测系统,可以快速对比不同版本

#### Day 1-2: Evaluation harness (16h)

**功能**:
1. 输入: 一个prompt版本
2. 运行: 在100个golden cases上测试
3. 输出:
   - 各维度分数分布
   - 对比baseline的improvement
   - 识别regression cases

**技术栈**:
```typescript
// eval/harness/runner.ts
interface EvalResult {
  version: string;
  scores: {
    actionability: number[];
    expert_match: number[];
    // ...
  };
  overall: number;
  regression_cases: string[];  // 比baseline差的cases
  improvement_cases: string[]; // 比baseline好的cases
}
```

**产出**: `eval/harness/runner.ts`

#### Day 3-5: 对比分析工具 (24h)

**功能**:
1. 可视化: 不同版本的雷达图对比
2. Statistical testing: 改进是否显著(t-test)
3. Case-level diff: 哪些cases变好了/变差了

**产出**:
- `eval/harness/visualize.ts`
- `eval/reports/v2_vs_v3_statistical_analysis.md`

### Week 11: 迭代优化 (40小时)

#### Day 1-5: 基于评测结果迭代 (40h)

**Workflow**:
```
1. 运行evaluation harness
2. 识别最大的weakness维度
3. 分析失败cases的common patterns
4. 修改prompt针对这些patterns
5. 重新测试
6. 如果improvement显著,commit; 否则rollback
```

**迭代节奏**: 每天2-3次迭代

**目标**:
- Overall score > 8.0
- 每个维度 > 7.5
- 无明显regression

**产出**: `CHANGELOG.md` 记录每次迭代的改动和效果

---

## 🎯 Phase 5: Fine-tuning探索 (可选,2-4周,80-160小时)

**前提**: 只有当prompt engineering到达瓶颈时才考虑fine-tuning

### 判断标准: 什么时候需要fine-tuning?

1. ✅ Prompt已经优化到极限(3000+ tokens的复杂prompt)
2. ✅ 有明确的pattern是prompt无法解决的
3. ✅ 有足够的高质量数据(至少500条)
4. ✅ Cost/latency成为瓶颈(fine-tuned小模型可能更快更便宜)

**如果不满足以上条件,不要fine-tune!**

### Week 12-13: Fine-tuning实验 (如果需要)

**Platform选择**:
- OpenAI GPT-3.5/4 fine-tuning
- Anthropic Claude fine-tuning (如果available)
- 或开源模型(Llama 3, Mistral)

**实验设计**:
1. Train/Val/Test split: 400/50/50
2. Baseline: Best prompt engineering版本
3. Metrics: 在held-out test set上的各维度分数
4. Goal: Fine-tuned model至少要比baseline好15%才值得部署

**时间估算**:
- 数据准备: 16h
- Training: 8h (主要是等待)
- Evaluation: 16h
- Iteration: 40h

---

## 📚 学习路径与必读材料

### 核心Paper (必读,20小时)

#### Week 1: Prompt Engineering基础

1. **"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"** (Wei et al., 2022)
   - 时间: 2h
   - 重点: 为什么让模型"慢思考"会更好
   - 作业: 实现一个CoT版本的expert selection

2. **"Large Language Models are Human-Level Prompt Engineers"** (Zhou et al., 2022)
   - 时间: 2h
   - 重点: 自动优化prompt的方法
   - 作业: 写一个prompt,让Claude优化你的expert recruiter prompt

3. **Anthropic's "Prompt Engineering Interactive Tutorial"**
   - 时间: 4h
   - 重点: Few-shot, XML tags, thinking step-by-step
   - 作业: 重构你的prompts用Anthropic的最佳实践

#### Week 2: Multi-Agent Systems

4. **"Communicative Agents for Software Development"** (ChatDev, 2023)
   - 时间: 2h
   - 重点: 多agent协作的设计模式
   - 作业: 分析你的"Director-Actor"模式 vs ChatDev的差异

5. **"More Agents Is All You Need"** (Li et al., 2024)
   - 时间: 2h
   - 重点: 多agent sampling提升quality
   - 作业: 实验运行3次dialogue generation,取最好的一次

6. **"AutoGen: Enabling Next-Gen LLM Applications"** (Microsoft, 2023)
   - 时间: 3h
   - 重点: Agent orchestration patterns
   - 作业: 画出你的系统的agent flow diagram

#### Week 3: Evaluation

7. **"Judging LLM-as-a-Judge with MT-Bench"** (Zheng et al., 2023)
   - 时间: 2h
   - 重点: 如何设计可靠的LLM评测
   - 作业: 检查你的judge是否有bias(给10个bad outputs,看是否能准确识别)

8. **"RLHF: Reinforcement Learning from Human Feedback"** (Ouyang et al., 2022)
   - 时间: 3h
   - 重点: 如何用人类偏好做训练
   - 作业: 设计一个"用户点赞"→反馈训练的pipeline

### 实践课程 (40小时)

#### CS336风格的Assignments

**Assignment 1: Prompt Archaeology** (8h)
```
任务: 给你5个"bad outputs",找出prompt的问题并修复

Case 1: 专家选择了Sam Altman给indie dev建议
问题: [你的分析]
修复: [你的prompt改动]
验证: [重新运行的结果]

Case 2: 专家说"需要注意风险"但没说具体风险
问题: [你的分析]
修复: [你的prompt改动]
验证: [重新运行的结果]

...
```

**Assignment 2: Build a Judge** (10h)
```
任务: 实现一个"Context-Match Judge"

要求:
1. 定义评分标准(0-10分)
2. 提供至少5个good examples和5个bad examples
3. 在20个cases上测试,与人类评分的相关系数 > 0.75
4. 撰写evaluation report
```

**Assignment 3: Data Flywheel** (12h)
```
任务: 构建一个数据收集→评测→迭代的闭环

Step 1: 收集10个真实用户query (via friends/Twitter)
Step 2: 运行你的系统
Step 3: 让用户评分(1-10)
Step 4: 分析低分cases的common patterns
Step 5: 修改prompt
Step 6: A/B test新旧版本
Step 7: 写report: "从用户反馈到prompt改进"
```

**Assignment 4: Competitive Analysis** (10h)
```
任务: 深度对比你的产品 vs Deep Research

选择5个queries,同时在两个产品上运行
对比维度:
- Speed
- Quality (盲测,找5个人评分)
- Cost (API费用)
- User satisfaction

撰写report: "何时用Deep Research, 何时用Chat-with-Experts"
```

### 业内博客与Case Studies (20小时)

1. **OpenAI Cookbook** - Prompt Engineering Guide (4h)
2. **Anthropic's Claude Prompt Library** (4h)
3. **Lenny's Podcast** - Episodes about AI product development (6h, 可以听着做其他事)
4. **Eugene Yan's Blog** - "Patterns for Building LLM-based Systems" (3h)
5. **Hamel Husain's Blog** - "Your AI Product Needs Evals" (3h)

---

## ⏱️ 总时间估算

| Phase | Duration | Hours | 关键产出 |
|-------|----------|-------|---------|
| Phase 1: 产品定位与假设验证 | 2周 | 80h | 产品定位v2, Golden dataset 20个 |
| Phase 2: Prompt工程与质量提升 | 4周 | 160h | Prompt v3, 评测系统, 100个test cases |
| Phase 3: 数据生产与训练准备 | 3周 | 120h | 500条高质量数据 |
| Phase 4: 评测与迭代 | 2周 | 80h | 评测harness, Overall score > 8.0 |
| Phase 5: Fine-tuning (可选) | 2-4周 | 80-160h | Fine-tuned model |
| **学习** | 贯穿全程 | 80h | Paper阅读+作业 |
| **Total (不含fine-tuning)** | **11周** | **520h** | Production-ready agent |
| **Total (含fine-tuning)** | **13-15周** | **600-680h** | + Fine-tuned model |

### 按周分配

```
Week 1:  竞品分析 + 用户访谈
Week 2:  Golden dataset设计
Week 3-4:  Prompt深度优化(专家招募+对话生成)
Week 5-6:  自动化评测系统
Week 7:  数据收集pipeline
Week 8-9:  半自动数据生成(500条)
Week 10: 评测agent
Week 11: 迭代优化
Week 12-13: (可选) Fine-tuning实验
```

### 每周工作量

- 如果全职: ~40-50h/week → 11-13周完成
- 如果兼职(20h/week): ~26周完成
- 如果业余时间(10h/week): ~52周完成

---

## 🎓 新手常见陷阱与避坑指南

### Trap 1: "我要训练一个大模型"

❌ **错误思路**: 一开始就想fine-tune或从头训练

✅ **正确思路**:
1. 先用prompt engineering到极限
2. 80%的问题都能靠更好的prompt解决
3. Fine-tuning是最后手段,不是第一步

**判断**: 如果你的prompt还不到2000 tokens,说明优化空间还很大

### Trap 2: "我要做100个功能"

❌ **错误思路**: 想做情感支持/创意生成/信息检索/...所有功能

✅ **正确思路**:
1. 先找3个"hero scenarios"
2. 在这3个场景做到极致(90%用户满意)
3. 再考虑扩展

**判断**: 如果你不能用一句话说清"我比ChatGPT强在哪",说明定位不够sharp

### Trap 3: "我觉得这个输出不错"

❌ **错误思路**: 靠主观感觉评价质量

✅ **正确思路**:
1. 定义clear metrics
2. 收集用户反馈(不是自己的感觉)
3. A/B test不同版本

**判断**: 如果你不能说"版本B比版本A的actionability分数高15%",说明评测不够严谨

### Trap 4: "我需要更多数据"

❌ **错误思路**: 盲目收集大量数据

✅ **正确思路**:
1. 先手工标注20条高质量数据
2. 确保你能说清楚"什么是好输出"
3. 再考虑scale

**判断**: 如果20条数据的标注标准都不一致,收集1000条也没用

### Trap 5: "用户会理解我的产品"

❌ **错误思路**: 用户会主动发现你的产品适合什么场景

✅ **正确思路**:
1. 在landing page明确说"适合XX场景,不适合YY场景"
2. 提供example queries
3. 引导用户问对的问题

**判断**: 如果30%的用户queries都不适合你的产品,说明positioning不清晰

---

## 📊 成功标准 (Definition of Done)

### Phase 1完成标准
- [ ] 产品定位文档v2完成,明确3个hero scenarios
- [ ] 20个golden cases标注完成
- [ ] 能用一句话回答"什么时候用我的产品 vs ChatGPT vs Deep Research"

### Phase 2完成标准
- [ ] 在20个golden cases上,80%达到success criteria
- [ ] 4个judge全部实现且calibrated
- [ ] 100个test cases准备完成
- [ ] Overall score > 7.5/10

### Phase 3完成标准
- [ ] 500条高质量数据生成完成
- [ ] 数据多样性验证通过(embedding clustering)
- [ ] 标注质量验证通过(LLM judge vs 人工评分相关系数 > 0.8)

### Phase 4完成标准
- [ ] 评测harness实现
- [ ] Overall score > 8.0/10
- [ ] 在至少3个真实用户上做了usability testing
- [ ] 无major regression cases

### 最终交付标准
- [ ] 产品在hero scenarios上明显优于baseline(ChatGPT)
- [ ] 有clear documentation解释什么场景用/不用
- [ ] 有自动化评测pipeline,可以快速验证新版本
- [ ] 如果做了fine-tuning,比best prompt好15%+

---

## 🚀 立即行动 - 本周任务清单

### 今天(Day 1) - 4小时
- [ ] 阅读这份规划,提问clarify任何疑问
- [ ] 准备20个不同类型的测试问题
- [ ] 在ChatGPT和你的产品上各测试10个

### 本周(Week 1) - 40小时
- [ ] 完成竞品深度分析
- [ ] 至少5个用户访谈
- [ ] 更新产品定位文档
- [ ] 阅读Chain-of-Thought paper

### 下周(Week 2) - 40小时
- [ ] 收集100个真实queries
- [ ] 标注20个golden cases
- [ ] 开始优化expert recruiter prompt

---

## 📞 何时寻求帮助

### 红色信号(立即停下来重新思考):
1. 连续迭代3次,分数没有提升
2. 不同版本的分数差异 < 5%,说明评测指标可能有问题
3. 用户反馈和你的judge评分严重不一致
4. 花了2周还说不清"我比ChatGPT好在哪"

### 黄色信号(需要调整策略):
1. Prompt已经超过3000 tokens但效果还不够好
2. 数据收集困难,找不到真实用户queries
3. 评测分数提升了但用户满意度没提升

---

## 🎯 下一步行动

我建议你:

1. **先花2小时理解这个规划**,提出任何疑问
2. **今天下午就开始Day 1任务**:准备20个测试问题,对比你的产品和ChatGPT
3. **明天我们review你的测试结果**,根据实际情况调整规划

需要我现在:
- A) 帮你准备20个测试问题?
- B) 一起做竞品分析?
- C) 开始优化expert recruiter prompt?
- D) 其他?
