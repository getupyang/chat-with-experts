/**
 * Vercel Serverless Function - 接收并存储conversation数据
 *
 * Endpoint: POST /api/conversations
 *
 * 部署后自动可用，无需额外配置
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

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

    // 记录到标准输出（Vercel会自动收集logs）
    console.log('📊 Conversation received:', {
      id: conversation.id,
      timestamp: clientTimestamp,
      query: conversation.userQuery?.substring(0, 100), // 只记录前100字符
      expertsCount: conversation.selectedExperts?.length || 0,
      messagesCount: conversation.debateMessages?.length || 0,
      duration: conversation.metadata?.totalDuration,
      language: conversation.metadata?.language,
      feedback: conversation.feedback,
      environment: {
        language: environment?.language,
        timezone: environment?.timezone
      }
    });

    // TODO: 如果需要持久化存储，可以连接数据库
    // 例如：Vercel Postgres, Supabase, MongoDB Atlas等
    //
    // 示例（需要先配置POSTGRES_URL环境变量）:
    // const { sql } = require('@vercel/postgres');
    // await sql`
    //   INSERT INTO conversations (id, data, created_at)
    //   VALUES (${conversation.id}, ${JSON.stringify(conversation)}, NOW())
    // `;

    return res.status(200).json({
      success: true,
      conversationId: conversation.id,
      message: 'Conversation logged successfully'
    });

  } catch (error) {
    console.error('❌ Error processing conversation:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
