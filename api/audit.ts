import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tableName, actionType, limit = '20', page = '1' } = req.query;

    const take = Math.min(parseInt(limit as string) || 20, 100);
    const skip = (parseInt(page as string) - 1) * take;

    const where: any = {};
    if (tableName && tableName !== 'all') where.tableName = tableName;
    if (actionType && actionType !== 'all') where.actionType = actionType;

    // Parallel queries for efficiency
    const [logs, total, actionSummary, tableSummary, recentActivity] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: { user: { select: { name: true, email: true, role: true } } }
      }),
      prisma.auditLog.count({ where }),
      // Action type breakdown
      prisma.auditLog.groupBy({
        by: ['actionType'],
        _count: { actionType: true },
        orderBy: { _count: { actionType: 'desc' } }
      }),
      // Table-level activity breakdown
      prisma.auditLog.groupBy({
        by: ['tableName'],
        _count: { tableName: true },
        orderBy: { _count: { tableName: 'desc' } }
      }),
      // Last 7 days activity for sparkline
      prisma.auditLog.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        select: { createdAt: true, actionType: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // Build daily activity for charting
    const dailyMap: Record<string, { INSERT: number; UPDATE: number; DELETE: number }> = {};
    for (const log of recentActivity) {
      const day = log.createdAt.toISOString().split('T')[0];
      if (!dailyMap[day]) dailyMap[day] = { INSERT: 0, UPDATE: 0, DELETE: 0 };
      if (log.actionType === 'INSERT') dailyMap[day].INSERT++;
      else if (log.actionType === 'UPDATE') dailyMap[day].UPDATE++;
      else if (log.actionType === 'DELETE') dailyMap[day].DELETE++;
    }

    return res.json({
      logs,
      pagination: { total, page: parseInt(page as string), take, totalPages: Math.ceil(total / take) },
      stats: {
        total,
        actionSummary: actionSummary.map(a => ({ type: a.actionType, count: a._count.actionType })),
        tableSummary: tableSummary.map(t => ({ table: t.tableName, count: t._count.tableName })),
        dailyActivity: Object.entries(dailyMap).map(([date, counts]) => ({ date, ...counts }))
      }
    });
  } catch (error: any) {
    console.error('Audit log error:', error);
    return res.status(500).json({ error: 'Failed to fetch audit logs', details: error.message });
  }
}
