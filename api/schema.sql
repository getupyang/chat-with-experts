-- Vercel Postgres数据库表结构
-- 在Vercel Dashboard的Postgres数据库中执行此SQL

CREATE TABLE IF NOT EXISTS conversations (
  -- 主键
  id TEXT PRIMARY KEY,

  -- 完整JSON数据（包含所有详细信息）
  data JSONB NOT NULL,

  -- 常用查询字段（从JSON提取，方便查询和分析）
  created_at TIMESTAMP NOT NULL,
  user_query TEXT NOT NULL,
  experts_count INTEGER DEFAULT 0,
  language TEXT DEFAULT 'unknown',
  duration_ms INTEGER DEFAULT 0,
  strategy_version TEXT DEFAULT 'unknown',

  -- 索引优化
  -- 按时间查询（最近的对话）
  -- 按策略版本查询（对比V2 vs V3）
  -- 按语言查询
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引（提升查询速度）
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_strategy ON conversations(strategy_version);
CREATE INDEX IF NOT EXISTS idx_conversations_language ON conversations(language);

-- 查看表结构（验证）
-- \d conversations

-- 示例查询：最近10条对话
-- SELECT id, created_at, user_query, experts_count, language, strategy_version, duration_ms
-- FROM conversations
-- ORDER BY created_at DESC
-- LIMIT 10;

-- 示例查询：V3策略的平均时长
-- SELECT
--   strategy_version,
--   AVG(duration_ms) as avg_duration,
--   COUNT(*) as total_conversations
-- FROM conversations
-- GROUP BY strategy_version;

-- 示例：导出完整数据为JSON
-- SELECT data FROM conversations ORDER BY created_at DESC;
