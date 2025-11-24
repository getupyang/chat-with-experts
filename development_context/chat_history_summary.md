# Chat with Experts - 项目背景与决策日志

## 1. 项目概览与价值主张
*   **产品名称**: Chat with Experts (专家圆桌会)
*   **核心概念**: 一个 AI 角色扮演模拟器，由 1-4 位世界级专家围绕用户话题展开圆桌讨论。
*   **差异化**: 不同于通用的“你是一个专家”提示词，本项目专注于 **具象化 (Personification)**、**冲突 (Conflict)** 和 **视角 (Perspective)**。我们贩卖的是“视角”，而不仅仅是“知识”。

## 2. 架构决策 (MVP 阶段)
*   **纯前端架构**: 无后端数据库，所有数据持久化存储于浏览器 `localStorage`。
*   **鉴权策略**: 无需登录，降低用户试用门槛。
*   **隐私策略**:
    *   严格执行“不记录内容”策略，建立用户信任。
    *   仅允许错误监控 (如 Sentry) 用于 Debug。
    *   提供“清空所有历史”按钮，作为用户的数据安全出口。
*   **API 模型**: 
    *   从 `gemini-3-pro-preview` (因 RPC 错误不稳定) 切换至 **`gemini-2.5-flash`** (速度快且稳定)。
    *   实现了 **静默重试 (Silent Retry)** 逻辑，以应对网络抖动。

## 3. 产品哲学与“第一性原理”

### A. 溯源 vs. 拟真 (Grounding vs. Simulation)
*   **决策**: MVP 阶段 **不** 实现搜索溯源 (如 Perplexity 模式)。
*   **理由**: 
    *   溯源会显著增加延迟 (3秒+)，破坏对话的“心流 (Flow)”。
    *   我们的核心价值是“视角的模拟”而非“事实的检索”。
    *   Sam Altman (AI) 的洞察：“匹配本身就是一个巨大的反馈漏斗”。

### B. Token 分布权与质量
*   **痛点**: 简单的多专家对话容易导致“平均主义”，每个人都说几句正确的废话。
*   **策略**:
    *   **聚光灯原则 (Spotlight Rule)**: 每轮对话必须选出一位“主讲人 (Key Speaker)”，占用 70% 的 Token 预算进行深度阐述。
    *   **强制冲突 (Forced Conflict)**: 配角必须是“挑战者”或提供“正交补充 (Orthogonal Supplement)”，禁止单纯的附和。
*   **实现**:
    *   **第一轮**: 强制所有专家进行立场介绍 (Opening Round)。
    *   **后续轮次**: 根据对话流，动态选择 1-2 位最自然的专家接话。

### C. 专家动态管理
*   **认知负荷**: 将活跃专家席位限制在 **3-4 人**，避免对话混乱。
*   **替换机制**: 
    *   实现了 **单人换一换 (Expert Reroll)** 功能，而非“全部重置”。
    *   逻辑：在保留当前话题和其他专家的前提下，寻找“Next Best Match”。

## 4. 技术演进与特性

### A. Prompt 工程
*   **结构流**: 
    *   Step 1: 找专家 (使用 JSON Mode 确保格式)。
    *   Step 2: 生成对话 (使用 Markdown + Speaker 标签)。
*   **国际化**: 支持 en/zh/es/fr/ja。专家人设、介绍理由及对话内容均跟随目标语言。
*   **兜底逻辑**: 目前依赖 Regex 解析 Markdown。*未来目标: 将对话生成也迁移至严格的 JSON Schema，以彻底消除 "Expert Panel" 这种非结构化幻觉。*

### B. 评测与调试 (黑匣子/飞行记录仪)
*   **痛点**: 无后端日志，无法科学评测 Prompt 迭代的效果。
*   **方案**: 构建了 **应用内开发者模式 (In-App Developer Mode)**。
    *   **调试日志 (Debug Logger)**: 捕获 **运行时 Prompt (Runtime Prompt)** (即实际拼接发送给 API 的完整字符串)、延迟数据及原始响应。
    *   **导出功能**: 支持导出 JSON 格式日志，以便离线使用 LLM (如 "LLM-as-a-Judge") 进行自动化评测。
    *   **版本控制**: 代码中硬编码 `PROMPT_VERSION`，用于追踪不同版本 Prompt 的表现。

### C. UI/UX 优化
*   **状态隔离**: 修复了加载一个会话时导致所有会话输入框被禁用的 Bug。
*   **布局优化**: 优化了 `ExpertCard` 的信息密度 (移除了用户不需要看到的“说话风格”字段)。
*   **交互逻辑**: 切换会话时自动清空输入框缓存。

## 5. 重大架构重构 (v2.0 - 2025.11.24)
*   **痛点**:
    *   Vercel 部署在中国大陆无法访问 API (DNS 污染)。
    *   单一 Prompt 策略导致模型在面对用户负反馈（“太虚了”）时无法有效调整上下文，产生“学究式错误”。
*   **决策**:
    1.  **Cloudflare 代理方案** (Code Ready, Deployment Pending): 支持通过自定义 `baseUrl` 绕过 GFW。
    2.  **配置驱动开发 (Config-Driven)**: 引入 `AI_CONFIG` 和 `Strategy Pattern`，允许在不同策略间一键切换，便于 A/B 测试。
    3.  **Intent-First CoT (思维链策略)**:
        *   引入 **Director (Flash) -> Actor (Pro)** 双模型流水线。
        *   在生成对话前，先由 Director 分析用户潜在需求 (`UserUnderlyingNeed`) 和批评当前上下文 (`ContextCritique`)。
        *   通过 Hidden Notes 指导 Actor 进行更有针对性的回复，解决“上下文丢失”问题。

## 6. 未来路线图 (Pending)
1.  **Prompt 2.0**: 重构 `fetchDebateResponse` 为结构化 JSON 输出，解决解析稳定性问题。
2.  **UI 可视化**: 将 CoT 的思考过程（导演笔记）在 UI 中对开发者或用户可见。
3.  **自动化评测**: 利用导出的 JSON 日志构建回归测试套件。