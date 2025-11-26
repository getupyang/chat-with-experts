# Chat-with-Experts Evaluation System

基于LLM as a Judge的专家圆桌对话质量评测系统。

## 📁 项目结构

```
chat-with-experts-eval/
├── PRODUCT_POSITIONING.md    # 产品定位和竞争优势分析
├── golden-dataset/           # Golden test cases (当前5个)
│   ├── INDEX.md             # Golden cases索引和使用指南
│   ├── schema.ts            # 数据结构定义
│   ├── case-001-ai-pm-product-iteration.json
│   ├── case-002-indie-dev-ai-features.json
│   ├── case-003-architecture-tradeoff.json
│   ├── case-004-career-transition-dev-to-pm.json
│   └── case-005-early-founder-pmf-validation.json
├── judges/                   # LLM Judge评测器
│   ├── actionability-judge.ts       # 可执行性评测
│   ├── expert-division-judge.ts     # 专家分工评测
│   ├── relevance-judge.ts           # 相关性评测（TODO）
│   └── conciseness-judge.ts         # 简洁性评测（TODO）
├── reports/                  # 评测报告
│   └── v0.2.4-evaluation.md
├── main.ts                   # 主评测运行器（TODO）
└── package.json
```

## 🎯 评测维度

### 1. **Actionability（可执行性）** - 权重30%
- **Specificity**: 是否有具体的步骤和时间线
- **Trade-off Guidance**: 是否帮用户做权衡（什么该做，什么可以暂时不做）
- **Resource Awareness**: 是否考虑用户的资源限制
- **Clarity of Next Step**: 用户是否清楚"Monday morning应该做什么"

### 2. **Expert Division（专家分工）** - 权重15%
- **Unique Contribution**: 每个专家是否有独特贡献
- **Role Clarity**: 专家角色是否清晰
- **Redundancy**: 是否有重复观点

### 3. **Relevance（相关性）** - 权重20%
- 是否针对用户的具体问题回答
- 是否理解用户的真实处境

### 4. **Conciseness（简洁性）** - 权重10%
- 信息密度
- 无废话

### 5. **Expert Match（专家匹配度）** - 权重15%
- 专家是否匹配用户处境
- 是否避免context mismatch

### 6. **Novelty（新颖性）** - 权重10%
- 是否有新观点、新角度

## 🚀 使用方法

### 1. 添加Golden Case

```bash
# 基于真实对话创建测试用例
cp your-debug-log.json golden-dataset/case-002.json
# 编辑case-002.json，添加expected输出和评测标准
```

### 2. 运行评测

```bash
cd chat-with-experts-eval
npm install
npm run evaluate -- --case case-001
```

### 3. 查看报告

```bash
cat reports/case-001-result.json
```

## 📊 评测输出示例

```json
{
  "caseId": "case-001",
  "strategyVersion": "v3_context_aware_cot",
  "scores": {
    "actionability": 6.5,
    "expertDivision": 7.0,
    "relevance": 8.0,
    "conciseness": 9.0,
    "expertMatch": 8.5,
    "novelty": 7.0,
    "overall": 7.4
  },
  "analysis": {
    "actionabilityAnalysis": {
      "hasActionPlan": true,
      "steps": [
        "选择一个窄而深的场景",
        "构建轻量级知识图谱"
      ],
      "feedback": "有行动计划，但缺乏时间线和具体工具建议。没说'本周做什么'。"
    },
    "expertDivisionAnalysis": {
      "repetitionFound": true,
      "expertContributions": [
        {
          "expertName": "王慧文",
          "uniquePoints": ["窄而深战略", "PMF验证"],
          "redundantPoints": []
        },
        {
          "expertName": "李开复",
          "uniquePoints": [],
          "redundantPoints": ["重复了王慧文的'窄而深'论点"]
        }
      ]
    }
  }
}
```

## 🔧 开发计划

- [x] Golden Dataset结构设计
- [x] Actionability Judge
- [x] Expert Division Judge
- [ ] Relevance Judge
- [ ] Conciseness Judge
- [ ] 主评测运行器
- [ ] 批量评测脚本
- [ ] 可视化报告生成

## 💡 使用场景

1. **版本对比**：V2 vs V3性能对比
2. **Prompt迭代**：测试新prompt的效果
3. **Regression测试**：确保新功能不破坏已有quality
4. **用户反馈验证**：用户说"不够具体"，用Actionability Judge量化验证

## 🎪 Golden Dataset设计理念

**核心原则**: 每个golden case都必须代表我们相比通用AI Chat的**明确竞争优势**。

### 当前5个Cases覆盖的优势场景：

| Case ID | 场景 | 竞争优势 | 难度 |
|---------|------|---------|------|
| case-001 | AI产品经理咨询产品迭代 | Context-Aware + 跨领域 + Actionability | Hard |
| case-002 | 独立开发者是否加AI功能 | Context-Aware + Peer Validation | Medium |
| case-003 | 微服务vs单体架构选择 | Multi-perspective Trade-off | Hard |
| case-004 | 开发者转PM职业转型 | Peer Validation + 情感支持 | Medium |
| case-005 | 早期创始人验证PMF | 跨领域 + Actionability | Hard |

**详细说明**: 见 [PRODUCT_POSITIONING.md](./PRODUCT_POSITIONING.md) 和 [golden-dataset/INDEX.md](./golden-dataset/INDEX.md)

### 为什么这些场景能区分我们和通用AI？

通用AI的典型失败模式：
- ❌ 给"大公司最佳实践"（context mismatch）
- ❌ 列举pros/cons但不帮用户决策（缺乏trade-off guidance）
- ❌ 理论正确但不可执行（缺乏actionability）
- ❌ 缺乏peer credibility（没有"过来人"的社会proof）

我们的优势：
- ✅ 根据用户处境（资源、角色、阶段）匹配专家
- ✅ 多视角呈现trade-off，帮用户权衡
- ✅ 提供具体时间线和行动计划
- ✅ 提供peer validation（"我的同行怎么做"）

**评测标准**: 如果我们的输出和通用AI差不多 = 测试失败
