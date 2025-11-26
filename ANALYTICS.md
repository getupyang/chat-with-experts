# 📊 Analytics & Conversation Logging

## 概述

自动记录用户对话数据，用于产品迭代和评测。

### 设计原则
- ✅ **本地优先**：立即存localStorage，用户刷新后能看历史
- ✅ **自动上传**：异步POST到后端，失败不影响用户体验
- ✅ **匿名设计**：不收集IP、设备指纹等隐私信息

---

## 🚀 快速开始

### 1. 本地开发（无需后端）

**默认行为**：
- ✅ 所有对话自动保存到localStorage
- ✅ 用户刷新页面后历史对话依然存在
- ❌ 不会上传到服务器（因为没有配置endpoint）

**查看数据**：
```javascript
// 在浏览器Console执行
JSON.parse(localStorage.getItem('conversation_history_v1'))
```

### 2. 部署到Vercel + 启用数据收集

**Step 1: 部署到Vercel**
```bash
vercel deploy
```

**Step 2: 配置环境变量**

在Vercel Dashboard添加环境变量：
```
VITE_ANALYTICS_ENDPOINT=https://your-app.vercel.app/api/conversations
```

或者在本地`.env`文件：
```bash
cp .env.example .env
# 编辑.env，填入你的Vercel URL
VITE_ANALYTICS_ENDPOINT=https://your-app.vercel.app/api/conversations
```

**Step 3: 重新部署**
```bash
vercel deploy --prod
```

现在每个对话都会自动上传到`/api/conversations`！

---

## 📂 数据结构

### ConversationRecord

```typescript
{
  // 基础信息
  id: "conv_1732234567_a1b2c3d4e",
  createdAt: "2025-11-26T08:30:00.000Z",
  completedAt: "2025-11-26T08:31:15.000Z",

  // 用户输入
  userQuery: "我是一个独立开发者，做了一个小众的项目管理工具...",

  // 系统输出
  selectedExperts: [
    {
      name: "Pieter Levels",
      title: "Indie Hacker",
      expertise: "独立开发、产品增长"
    }
  ],

  debateMessages: [
    {
      role: "expert",
      expertName: "Pieter Levels",
      content: "作为独立开发者...",
      timestamp: "2025-11-26T08:30:45.000Z"
    }
  ],

  // 元数据
  metadata: {
    strategyVersion: "v3_context_aware_cot",
    totalDuration: 75000,  // 75秒
    expertSelectionTime: 3200,
    debateGenerationTime: 8500,
    language: "zh"
  },

  // 用户反馈（可选）
  feedback: {
    rating: 4,
    thumbs: "up",
    comment: "很有帮助！",
    submittedAt: "2025-11-26T08:32:00.000Z"
  }
}
```

---

## 🔍 查看数据

### 方法1: Vercel Logs（实时）

```bash
vercel logs --follow
```

你会看到：
```
📊 Conversation received: {
  id: 'conv_1732234567_a1b2c3d4e',
  query: '我是一个独立开发者，做了一个小众的项目管理工具...',
  expertsCount: 2,
  duration: 75000,
  language: 'zh'
}
```

### 方法2: 用户手动导出

用户可以在代码中调用：
```typescript
import { conversationLogger } from './utils/conversationLogger';

// 导出所有对话为JSON文件
conversationLogger.exportAll();
```

---

## 💾 持久化存储（可选）

### 选项A: Vercel Postgres（推荐）

**1. 安装**
```bash
npm install @vercel/postgres
```

**2. 在Vercel Dashboard创建Postgres数据库**

**3. 更新`api/conversations.ts`**
```typescript
import { sql } from '@vercel/postgres';

await sql`
  INSERT INTO conversations (id, data, created_at)
  VALUES (${conversation.id}, ${JSON.stringify(conversation)}, NOW())
`;
```

### 选项B: Supabase

**1. 创建Supabase项目**

**2. 创建表**
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**3. 配置环境变量**
```
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

**4. 更新`api/conversations.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

await supabase
  .from('conversations')
  .insert({ id: conversation.id, data: conversation });
```

---

## 📈 数据分析建议

### 关键指标

1. **对话完成率**
   ```typescript
   const completed = conversations.filter(c => c.completedAt).length;
   const rate = completed / conversations.length;
   ```

2. **平均响应时间**
   ```typescript
   const avgTime = conversations.reduce((sum, c) =>
     sum + c.metadata.totalDuration, 0
   ) / conversations.length;
   ```

3. **专家选择分布**
   ```typescript
   const expertCounts = {};
   conversations.forEach(c => {
     c.selectedExperts.forEach(e => {
       expertCounts[e.name] = (expertCounts[e.name] || 0) + 1;
     });
   });
   ```

4. **用户满意度**
   ```typescript
   const ratings = conversations
     .filter(c => c.feedback?.rating)
     .map(c => c.feedback.rating);
   const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
   ```

---

## 🔒 隐私说明

### 收集的数据
- ✅ 用户query内容
- ✅ 专家选择
- ✅ 辩论消息
- ✅ 时间、时长
- ✅ 语言、时区（匿名环境信息）

### 不收集的数据
- ❌ IP地址
- ❌ User Agent详情
- ❌ 设备指纹
- ❌ 用户身份信息（本来就没有登录）

### 建议
在产品中添加隐私说明：
"我们会记录对话内容用于改进产品质量，所有数据匿名处理。"

---

## 🛠️ API Reference

### conversationLogger

```typescript
import { conversationLogger } from './utils/conversationLogger';

// 开始新对话
const conversationId = conversationLogger.startConversation(
  "用户query",
  "zh"
);

// 记录专家选择
conversationLogger.logExpertSelection(
  conversationId,
  experts,
  selectionTimeMs
);

// 记录辩论消息
conversationLogger.logDebateMessage(conversationId, message);

// 完成对话
conversationLogger.completeConversation(
  conversationId,
  totalDurationMs,
  debateTimeMs
);

// 添加用户反馈
conversationLogger.addFeedback(conversationId, {
  rating: 4,
  thumbs: 'up',
  comment: '很有帮助'
});

// 获取所有对话
const conversations = conversationLogger.getConversations();

// 导出所有对话
conversationLogger.exportAll();

// 清空所有对话
conversationLogger.clearAll();
```

---

## 🧪 用于Evaluation

自动记录的数据可以直接用于evaluation系统：

```typescript
// 从conversationLogger导出数据
const conversations = conversationLogger.getConversations();

// 转换为golden dataset格式
conversations.forEach(conv => {
  const goldenCase = {
    input: {
      userQuery: conv.userQuery
    },
    actual: {
      selectedExperts: conv.selectedExperts,
      debateMessages: conv.debateMessages
    },
    feedback: conv.feedback
  };

  // 保存到eval/golden-dataset/
});
```

---

## ❓ FAQ

**Q: 数据存在哪里？**
A: 默认存localStorage。如果配置了`VITE_ANALYTICS_ENDPOINT`，会异步上传到服务器。

**Q: 上传失败会影响用户吗？**
A: 不会。上传是异步的，失败会静默处理，数据仍保存在本地。

**Q: 如何禁用数据收集？**
A: 删除`VITE_ANALYTICS_ENDPOINT`环境变量即可。本地存储会继续工作。

**Q: 能否让用户选择是否上传？**
A: 可以！在Settings添加toggle，控制`conversationLogger.uploadConversation`的调用。

**Q: 数据量会很大吗？**
A: localStorage限制50条对话。服务器端建议定期归档旧数据。
