/**
 * Vercel Serverless Function - 接收并存储conversation数据
 *
 * Endpoint: POST /api/conversations
 *
 * 自动保存到Vercel Postgres数据库（需要先在Vercel Dashboard创建数据库）
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { conversation, clientTimestamp, environment } = req.body;

    if (!conversation || !conversation.id) {
      return res.status(400).json({ error: 'Invalid conversation data' });
    }

    // 记录到标准输出（Vercel logs，方便调试）
    console.log('📊 Conversation received:', {
      id: conversation.id,
      timestamp: clientTimestamp,
      query: conversation.userQuery?.substring(0, 100), // 只记录前100字符
      expertsCount: conversation.selectedExperts?.length || 0,
      messagesCount: conversation.debateMessages?.length || 0,
      duration: conversation.metadata?.totalDuration,
      language: conversation.metadata?.language,
      feedback: conversation.feedback,
    });

    // 保存到Vercel Postgres数据库
    try {
      await sql`
        INSERT INTO conversations (
          id,
          data,
          created_at,
          user_query,
          experts_count,
          language,
          duration_ms,
          strategy_version
        ) VALUES (
          ${conversation.id},
          ${JSON.stringify(conversation)}::jsonb,
          ${new Date(conversation.createdAt)},
          ${conversation.userQuery},
          ${conversation.selectedExperts?.length || 0},
          ${conversation.metadata?.language || 'unknown'},
          ${conversation.metadata?.totalDuration || 0},
          ${conversation.metadata?.strategyVersion || 'unknown'}
        )
        ON CONFLICT (id) DO UPDATE SET
          data = ${JSON.stringify(conversation)}::jsonb,
          user_query = ${conversation.userQuery},
          experts_count = ${conversation.selectedExperts?.length || 0},
          duration_ms = ${conversation.metadata?.totalDuration || 0}
      `;

      console.log('✅ Saved to database:', conversation.id);
    } catch (dbError) {
      // 如果数据库还没创建或表不存在，给出友好提示
      console.error('❌ Database error:', dbError);

      // 但仍然返回成功（避免影响用户体验）
      // 数据至少已经记录到logs了
      return res.status(200).json({
        success: true,
        conversationId: conversation.id,
        message: 'Logged (DB not ready, see docs)',
        warning: 'Please create database table - see ANALYTICS.md'
      });
    }

    return res.status(200).json({
      success: true,
      conversationId: conversation.id,
      message: 'Conversation saved to database'
    });

  } catch (error) {
    console.error('❌ Error processing conversation:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
