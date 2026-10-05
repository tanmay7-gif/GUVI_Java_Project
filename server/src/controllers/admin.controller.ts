import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

export const getDashboardKPIs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, activeWorkoutsToday, pendingContentCount, ongoingChallengesCount, recentAuditLogs] =
      await Promise.all([
        prisma.user.count(),
        prisma.workoutLog.count({
          where: {
            date: { gte: today },
          },
        }),
        prisma.fitnessContent.count({
          where: { status: 'PENDING' },
        }),
        prisma.challenge.count({
          where: {
            end_date: { gte: new Date() },
          },
        }),
        prisma.auditLog.findMany({
          take: 10,
          orderBy: { timestamp: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        }),
      ]);

    // Engagement chart over past 7 days: workouts count + registrations
    const engagementTrend: Array<{ day: string; workouts: number; activeUsers: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const [workoutsCount, workouts] = await Promise.all([
        prisma.workoutLog.count({
          where: { date: { gte: start, lte: end } },
        }),
        prisma.workoutLog.findMany({
          where: { date: { gte: start, lte: end } },
          select: { user_id: true },
        }),
      ]);

      const distinctUsers = new Set(workouts.map((w) => w.user_id)).size;

      engagementTrend.push({
        day: start.toLocaleDateString('en-US', { weekday: 'short' }),
        workouts: workoutsCount,
        activeUsers: distinctUsers,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          activeWorkoutsToday,
          pendingContentApprovals: pendingContentCount,
          ongoingChallenges: ongoingChallengesCount,
        },
        recentActivity: recentAuditLogs,
        engagementTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, role, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query as any;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    if (role && (role === 'USER' || role === 'ADMIN')) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_active: true,
          profile_image: true,
          created_at: true,
          _count: {
            select: {
              workouts: true,
              userChallenges: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: take,
          totalPages: Math.ceil(total / take) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUserByAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      res.status(409).json({ success: false, message: 'Email is already in use.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password_hash,
        role: role || 'USER',
        profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });

    await logAudit(req.user!.userId, 'ADMIN_CREATE_USER', { targetUserId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserByAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, is_active } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (email && email.toLowerCase() !== existing.email) {
      const duplicate = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (duplicate) {
        res.status(409).json({ success: false, message: 'Email address already assigned to another user.' });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(role && { role }),
        ...(is_active !== undefined && { is_active }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        updated_at: true,
      },
    });

    await logAudit(req.user!.userId, 'ADMIN_UPDATE_USER', { targetUserId: id, updates: req.body });

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserByAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (id === req.user!.userId) {
      res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account.',
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    await prisma.user.delete({ where: { id } });

    await logAudit(req.user!.userId, 'ADMIN_DELETE_USER', { targetUserId: id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'User deleted permanently.',
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSystemSetting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    const adminId = req.user!.userId;

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: {
        value,
        ...(description && { description }),
        updated_by: adminId,
      },
      create: {
        key,
        value,
        description: description || null,
        updated_by: adminId,
      },
    });

    await logAudit(adminId, 'UPDATE_SYSTEM_SETTING', { key, value });

    res.status(200).json({
      success: true,
      message: `System setting "${key}" updated successfully.`,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 50, action } = req.query as any;

    const where: any = {};
    if (action) {
      where.action = action;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      take: Number(limit),
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
