import prisma from '../config/database.js';

export async function logAudit(userId: string | null, action: string, details?: Record<string, any> | string) {
  try {
    const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        details: detailsString || null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
