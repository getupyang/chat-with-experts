# Week 1: 竞品分析与产品定位 - 详细执行指南

**目标**: 明确产品定位,回答"什么时候用户应该用我的产品?"

**总时间**: 40小时

---

## 📅 Day 1-2: 竞品深度对比测试 (16小时)

### 准备工作 (2小时)

#### Task 1.1: 设计20个测试问题 (2h)

创建文件: `research/test_queries_20.md`

**问题分类** (每类4个):

1. **信息检索类** (预期ChatGPT/Perplexity会更好):
   ```
   - Python如何读取CSV文件?
   - 2024年美国GDP是多少?
   - React Hooks有哪些?
   - 什么是RESTful API?
   ```

2. **Trade-off决策类** (预期你的产品会更好):
   ```
   - 我是20人创业团队的CTO,该用微服务还是单体架构?
   - 作为独立开发者,该花时间做SEO还是付费广告?
   - 早期创业公司,该先优化产品还是先拉新用户?
   - Seed轮创业公司,该融资还是bootstrap?
   ```

3. **Peer validation类** (预期你的产品会更好):
   ```
   - 我是5年后端工程师想转PM,现实吗?
   - 作为solo开发者,该不该给产品加AI功能?
   - 独立开发的产品有1000用户但没人付费,是不是该放弃?
   - 30岁转行做程序员,晚不晚?
   ```

4. **创意生成类** (预期ChatGPT会更好):
   ```
   - 帮我写一个健身APP的营销文案
   - 给我的咖啡店起10个名字
   - 写一首关于AI的诗
   - 设计一个logo的创意方案
   ```

5. **复杂调研类** (预期Deep Research会更好):
   ```
   - 2024年AI Agent领域的研究进展和主要论文
   - 独立开发者最常用的技术栈调研
   - SaaS产品定价策略的最佳实践
   - 中国出海创业的法律和税务问题
   ```

**✅ 完成标准**:
- 20个问题涵盖5个类别
- 每个问题附带你的"预期哪个产品会更好"和原因

---

### 执行测试 (12小时)

#### Task 1.2: 在每个产品上测试 (10h)

为每个问题创建测试记录表格:

```markdown
## Query 1: [问题内容]

### 预期最佳产品: [ChatGPT/Deep Research/Perplexity/你的产品]

### ChatGPT测试 (15分钟)
- **Response**: [粘贴完整回答]
- **Speed**: [几秒]
- **Usefulness Score** (1-10): [评分]
- **Why**: [为什么打这个分]
- **Strengths**: [优点]
- **Weaknesses**: [缺点]

### Deep Research测试 (15分钟)
[同上格式]

### Perplexity测试 (15分钟)
[同上格式]

### 你的产品测试 (15分钟)
[同上格式]

### 对比总结
- **Winner**: [哪个产品最好]
- **Key Insight**: [为什么这个产品在这个query上更好]
- **Your Product的Gap**: [如果不是你的产品赢,差距在哪]
```

**时间分配**:
- 每个query × 4个产品 × 15分钟 = 1小时
- 20个queries = 20小时... **太多了!**

**优化方案**:
- 只对10个queries做完整4产品测试 (10h)
- 剩余10个只测试ChatGPT vs 你的产品 (5h)

**实际时间**: ~10-12小时

#### Task 1.3: 撰写竞品分析报告 (2h)

创建文件: `research/competitive_analysis.md`

**报告结构**:

```markdown
# 竞品深度分析报告

## 1. 测试方法论
- 测试时间: [日期]
- 测试queries数量: 20个
- 产品版本: ChatGPT (GPT-4), Deep Research, Perplexity, Chat-with-Experts v2

## 2. 场景胜率分析

| 场景类型 | ChatGPT | Deep Research | Perplexity | 你的产品 |
|---------|---------|--------------|-----------|---------|
| 信息检索 | 3/4 | 1/4 | 0/4 | 0/4 |
| Trade-off决策 | 0/4 | 1/4 | 0/4 | 3/4 |
| Peer validation | 0/4 | 0/4 | 0/4 | 4/4 |
| 创意生成 | 4/4 | 0/4 | 0/4 | 0/4 |
| 复杂调研 | 0/4 | 4/4 | 0/4 | 0/4 |

**关键发现**:
- 你的产品在Trade-off和Peer validation场景胜出
- 在信息检索和创意生成场景完全不适合

## 3. 用户应该何时选择你的产品?

### ✅ 适合场景 (Must-Use Cases):
1. **复杂Trade-off决策**
   - Example query: "20人团队,微服务 vs 单体?"
   - Why you win: 多视角分析利弊,给出针对20人团队的具体建议
   - vs ChatGPT: ChatGPT给理论pros/cons,不帮用户决策

2. **Peer Validation场景**
   - Example query: "工程师转PM现实吗?"
   - Why you win: 匹配过来人专家,提供真实经验
   - vs ChatGPT: ChatGPT科普PM职责,缺乏credibility

### ❌ 不适合场景 (Don't Use):
1. **纯信息检索**
   - Example: "Python如何读CSV?"
   - Why you lose: 多专家讨论是overkill,ChatGPT直接给答案更快

2. **创意生成**
   - Example: "给咖啡店起名"
   - Why you lose: 专家辩论不会提升创意质量

## 4. 产品定位建议

**Current Positioning**: "AI专家圆桌"
**Recommended Positioning**: "为复杂决策提供多视角权衡的AI顾问"

**Tagline**: "当你需要trade-off,不是答案"
```

**✅ 完成标准**:
- 明确列出3-5个你赢的场景
- 明确列出3-5个你不适合的场景
- 每个场景有具体example和数据支撑

---

## 📅 Day 3-4: 用户访谈 (16小时)

### 准备阶段 (4小时)

#### Task 2.1: 招募用户 (4h)

**目标**: 找到8-10个目标用户

**渠道**:
1. **Twitter/X** (1h):
   ```
   发推文:
   "正在做一个AI产品研究,需要5位创业者/PM/独立开发者
   帮忙测试一个'AI专家圆桌'产品(15分钟)

   作为感谢,我会:
   - 给你一个详细的产品使用报告
   - [或者] $20 Amazon礼品卡

   感兴趣请DM!"
   ```

2. **Indie Hackers** (1h):
   - 在论坛发帖征集测试用户
   - 主动DM活跃的indie hackers

3. **朋友圈/微信群** (1h):
   - 找创业者/PM朋友
   - 强调"只需要15分钟"

4. **Reddit** (1h):
   - r/SaaS, r/startups, r/entrepreneur

**✅ 完成标准**: 至少预约到8个用户

---

### 执行访谈 (8小时)

#### Task 2.2: 用户访谈 (每个1小时 × 8人)

**访谈脚本**:

```markdown
# 用户访谈脚本 (60分钟)

## Part 1: 背景了解 (5分钟)
- 你的职业/角色?
- 平时用AI工具吗?哪些?
- 最近有什么决策让你纠结?

## Part 2: 产品试用 (30分钟)

**Step 1**: 先用ChatGPT (10分钟)
"请你用ChatGPT问一个真实的问题(最好是最近让你纠结的决策)"

[观察用户行为,记录]

**Step 2**: 再用Chat-with-Experts (15分钟)
"现在请用这个产品问同样的问题"

[观察用户反应,记录verbatim quotes]

**Step 3**: 对比反馈 (5分钟)
- 哪个产品的回答更有用?为什么?
- 两个产品的差异是什么?

## Part 3: 深度挖掘 (20分钟)

关键问题:
1. **使用场景**: "你会在什么情况下用这个产品而不是ChatGPT?"
2. **最大价值**: "这个产品最让你满意的是什么?"
3. **最大问题**: "最不满意的是什么?"
4. **付费意愿**: "如果要付费,它必须做到什么?你愿意付多少?"
5. **替代品**: "如果这个产品不存在,你会用什么?"

## Part 4: 收集更多场景 (5分钟)
"除了刚才的问题,你还有什么其他类型的问题想问这个产品?"
[记录至少3个问题]
```

**记录模板**:

```markdown
## User Interview #1

**Profile**:
- Role: [独立开发者/PM/创业者/...]
- AI Usage: [每天用ChatGPT/偶尔用/...]
- Date: [日期]

**Test Query**: "[用户问的问题]"

**Observations**:
- ChatGPT反应: [用户的body language, comments]
- Chat-with-Experts反应: [用户的第一反应, quotes]

**Key Quotes**:
> "这个太有用了!ChatGPT只告诉我pros/cons,但这个产品帮我权衡了我的具体情况"

**Insights**:
- 用户最看重: [多视角/具体建议/peer credibility/...]
- 用户最不满: [太慢/专家不够famous/...]
- 付费意愿: [$10/month, 如果...]

**Additional Queries Collected**:
1. [用户提出的其他问题]
2. ...
```

**✅ 完成标准**:
- 完成8个访谈
- 每个访谈有详细记录
- 收集到至少20个新的真实用户queries

---

### 整理分析 (4小时)

#### Task 2.3: 访谈数据分析 (4h)

创建文件: `research/user_interviews_analysis.md`

**分析维度**:

1. **用户类型分布**:
   ```
   - 独立开发者: 3人
   - 创业者: 2人
   - PM: 2人
   - 其他: 1人
   ```

2. **最常提到的价值点** (Affinity Mapping):
   ```
   "多视角" - 6人提到
   "具体建议" - 5人提到
   "peer credibility" - 4人提到
   "帮助决策" - 4人提到
   ```

3. **最常抱怨的问题**:
   ```
   "太慢" - 4人
   "专家选的不对" - 3人
   "不够具体" - 2人
   ```

4. **使用场景归纳**:
   ```
   高频场景:
   - 技术选型决策 (5人)
   - 职业发展决策 (4人)
   - 产品功能优先级 (3人)

   低频场景:
   - 学习新知识 (0人)
   - 创意生成 (0人)
   ```

5. **付费意愿**:
   ```
   愿意付费: 6/8人
   价格区间: $5-20/month
   付费前提: "必须比ChatGPT Plus明显更好"
   ```

**✅ 完成标准**:
- 清晰的用户价值排序
- 识别出3-5个高频使用场景
- 明确产品的最大问题

---

## 📅 Day 5: 提炼产品定位 (8小时)

### Task 3.1: 更新产品定位文档 (6h)

更新文件: `eval/PRODUCT_POSITIONING.md`

**新增内容**:

```markdown
## 🔬 产品定位 v2 (基于竞品分析+用户访谈)

### 核心发现

**数据来源**:
- 20个query的竞品对比测试
- 8个目标用户的深度访谈
- 测试日期: 2025-11-27 to 2025-11-29

### 我们的"护城河场景" (Moat Scenarios)

基于数据,我们在以下场景有**明显优势**:

#### 1. 复杂Trade-off决策 🏆
**数据支撑**:
- 竞品测试: 4个queries中3个胜出
- 用户访谈: 8人中6人认为这是最大价值

**Example Queries**:
- "20人团队,微服务 vs 单体?"
- "独立开发者,做SEO还是付费广告?"

**Why we win**:
- ChatGPT: 列举pros/cons,但不帮决策 → "看完还是不知道怎么选"
- 我们: 2-3个专家从不同角度分析,给出针对用户context的权衡 → "终于有人帮我做决策了"

**用户Quote**:
> "ChatGPT告诉我微服务的优缺点,但我早就知道。我需要的是:对于我这个20人团队,现在该不该迁移?你的产品给了我这个答案。" - User #3

#### 2. Peer Validation场景 🏆
**数据支撑**:
- 竞品测试: 4个queries全部胜出
- 用户访谈: 8人中5人表示"这是ChatGPT完全做不到的"

**Example Queries**:
- "工程师转PM现实吗?"
- "Solo dev该不该加AI功能?"

**Why we win**:
- ChatGPT: 给理论知识和职责科普 → "正确但没用"
- 我们: 匹配过来人(实际转型成功的PM),分享真实经历 → "感觉是在和一个过来人聊"

**用户Quote**:
> "ChatGPT科普了PM的职责,但我需要的不是科普,而是一个转型成功的人告诉我'可行,我就是这么做的'。" - User #5

#### 3. Context-Sensitive建议 🏆
**数据支撑**:
- 用户访谈中最常提到的差异点: "它考虑了我的具体情况"

**Example Queries**:
- "早期创业团队如何验证PMF?" (6个月runway vs 2年runway,建议完全不同)

**Why we win**:
- ChatGPT: 给"大公司最佳实践" → context mismatch
- 我们: 根据用户资源/阶段匹配专家 → "感觉是在和懂我的人聊"

### 我们的"避雷场景" (Anti-Scenarios)

基于数据,明确**不要做**的场景:

#### ❌ 1. 纯信息检索
**数据**: 竞品测试0/4胜出,用户反馈"overkill"

**Example**: "Python如何读CSV?"
**Problem**: 多专家讨论浪费时间,ChatGPT直接给答案更快

#### ❌ 2. 创意生成
**数据**: 竞品测试0/4胜出

**Example**: "给咖啡店起名"
**Problem**: 专家辩论不会提升创意质量

### Hero Scenarios (优先优化的3个场景)

基于数据,这3个场景是我们的重点:

1. **技术选型决策** (最高频,8人中5人问到)
2. **职业发展决策** (第二高频,8人中4人问到)
3. **早期创业PMF验证** (最高价值,付费意愿最强)

### 更新后的Product Positioning Statement

**For**: 创业者、PM、独立开发者 - 需要做复杂决策的行动者

**Who**: 面临trade-off选择、需要peer validation、context-sensitive建议

**Our Product**: Context-Aware的AI专家圆桌

**That**: 根据你的处境匹配2-4个专家,通过多视角讨论帮你权衡利弊

**Unlike**: ChatGPT给"标准答案", Deep Research做"全面调研"

**We**: 提供"适合你处境的peer建议" + "明确的trade-off guidance"

**Tagline**: "当你需要权衡,不是答案" (When you need trade-offs, not answers)
```

### Task 3.2: 创建竞争对比矩阵 (2h)

创建文件: `research/competitive_matrix.md`

```markdown
# 产品竞争矩阵

## 对比维度

| 维度 | ChatGPT | Deep Research | Perplexity | Chat-with-Experts |
|------|---------|--------------|-----------|------------------|
| **核心机制** | Single AI | Multi-step reasoning + Search | Search + Citation | Multi-expert debate |
| **响应速度** | 2-5s ⚡ | 30-60s 🐌 | 5-10s ⚡ | 8-15s ⚡ |
| **信息检索** | 9/10 🏆 | 10/10 🏆 | 10/10 🏆 | 4/10 |
| **Trade-off决策** | 5/10 | 7/10 | 4/10 | 9/10 🏆 |
| **Peer validation** | 3/10 | 4/10 | 3/10 | 10/10 🏆 |
| **创意生成** | 9/10 🏆 | 5/10 | 4/10 | 4/10 |
| **复杂调研** | 6/10 | 10/10 🏆 | 8/10 | 5/10 |
| **Context awareness** | 5/10 | 6/10 | 4/10 | 9/10 🏆 |
| **Actionability** | 6/10 | 7/10 | 5/10 | 8/10 🏆 |
| **价格** | $20/mo | Free | $20/mo | TBD |

## 用户选择指南

### 选择ChatGPT的场景:
- 快速信息查询
- 创意生成
- 代码辅助
- 日常问答

### 选择Deep Research的场景:
- 需要全面调研的开放问题
- 需要最新信息和引用来源
- 学术研究
- 市场分析

### 选择Perplexity的场景:
- 需要实时信息
- 需要可验证的来源
- 新闻事件查询

### 选择Chat-with-Experts的场景:
- 复杂的trade-off决策
- 需要peer validation
- Context-sensitive的建议
- 多视角分析

**Key Insight**: 我们不是"更聪明的ChatGPT",而是"解决不同问题的专门工具"
```

---

## 📊 Week 1 交付物清单

### 必须完成 (Must Have):
- [ ] `research/test_queries_20.md` - 20个测试问题
- [ ] `research/competitive_analysis.md` - 竞品分析报告
- [ ] `research/user_interviews_analysis.md` - 8个用户访谈分析
- [ ] `eval/PRODUCT_POSITIONING.md` (updated) - 产品定位v2
- [ ] `research/competitive_matrix.md` - 竞争对比矩阵

### 关键决策文档:
- [ ] **Hero Scenarios确认**: 3个优先优化的场景
- [ ] **Anti-Scenarios确认**: 明确不做的3个场景

### 成功标准:
- [ ] 能用一句话回答"什么时候用我的产品 vs ChatGPT"
- [ ] 有数据支撑(不是拍脑袋)
- [ ] 至少3个用户quote支持你的产品定位

---

## 💡 执行Tips

### 如何高效完成用户访谈?

1. **不要追求完美的用户**
   - 找你能找到的人(朋友、朋友的朋友)
   - 8个"还可以"的用户 > 0个"完美"的用户

2. **记录verbatim quotes**
   - 用户的原话最有价值
   - 录音(征得同意) + 事后整理

3. **观察行为 > 听用户说**
   - 用户说"这个很好",但body language说"一般" → 相信后者
   - 注意用户的停顿、犹豫、重复

### 时间管理

**Full-time模式** (8h/day):
- Day 1: 8h (测试前10个queries)
- Day 2: 8h (测试后10个queries + 写报告)
- Day 3: 8h (4个访谈)
- Day 4: 8h (4个访谈 + 整理)
- Day 5: 8h (产品定位文档)

**Part-time模式** (4h/day):
- 把每个任务时间减半,延长到10天

---

## 🚨 常见问题

### Q1: 找不到8个用户怎么办?
**A**: 降低标准到5个,质量 > 数量。5个深度访谈 > 10个敷衍访谈。

### Q2: 用户都说"挺好的",没有明确preference?
**A**: 你的问题太抽象了。改问"如果只能留一个产品,你选哪个?为什么?"

### Q3: 竞品测试太花时间,能缩短吗?
**A**: 可以。只测10个queries,但每个都要深入分析why win/lose。

### Q4: Deep Research太慢,等不及?
**A**: 可以跳过Deep Research,重点对比ChatGPT vs 你的产品。

---

## ✅ Week 1 完成检查清单

在进入Week 2之前,确保:

- [ ] 我能用一句话说清"用户什么时候应该用我的产品"
- [ ] 我有至少3个hero scenarios,每个都有数据支撑
- [ ] 我明确知道哪些场景不适合我的产品
- [ ] 我有至少5个真实用户的verbatim quotes
- [ ] 我的产品定位文档已更新,团队(如果有)达成共识

**如果以上任何一项是"否",不要进入Week 2!**

---

## 📞 需要帮助?

如果遇到以下情况,立即停下来重新思考:

1. ❌ 测试了20个queries,发现你的产品在所有场景都不如ChatGPT
   → 说明产品可能有根本性问题,需要review architecture

2. ❌ 用户访谈中,8个人都说"和ChatGPT差不多"
   → 说明差异化不够明显,需要加强prompt或重新思考机制

3. ❌ 无法找到3个hero scenarios
   → 说明产品定位可能太窄或太宽,需要调整

**记住**: Week 1的目标是"找到product-market fit的信号",如果没找到,不要硬推进到Week 2!
