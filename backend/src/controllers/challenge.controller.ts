import { Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

export const listChallenges = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const challenges = await prisma.challenge.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
        participants: userId
          ? {
              where: { user_id: userId },
              select: {
                id: true,
                status: true,
                current_progress: true,
                joined_at: true,
                completed_at: true,
              },
            }
          : false,
      },
      orderBy: { created_at: 'desc' },
    });

    const formatted = challenges.map((c) => {
      const userParticipation = c.participants && c.participants.length > 0 ? c.participants[0] : null;
      const progressPercent = userParticipation
        ? Math.min(100, Math.round((userParticipation.current_progress / c.target_value) * 100))
        : 0;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        target_metric: c.target_metric,
        target_value: c.target_value,
        start_date: c.start_date,
        end_date: c.end_date,
        reward_badge: c.reward_badge,
        total_participants: c._count.participants,
        user_status: userParticipation?.status || 'NOT_JOINED',
        user_progress: userParticipation?.current_progress || 0,
        progress_percent: progressPercent,
        completed_at: userParticipation?.completed_at || null,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const joinChallenge = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { challengeId } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      res.status(404).json({
        success: false,
        message: 'Challenge not found.',
      });
      return;
    }

    const existing = await prisma.userChallenge.findUnique({
      where: {
        user_id_challenge_id: {
          user_id: userId,
          challenge_id: challengeId,
        },
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: 'You have already joined this challenge.',
      });
      return;
    }

    const userChallenge = await prisma.userChallenge.create({
      data: {
        user_id: userId,
        challenge_id: challengeId,
        status: 'IN_PROGRESS',
        current_progress: 0,
      },
    });

    await logAudit(userId, 'JOIN_CHALLENGE', { challengeId, title: challenge.title });

    res.status(201).json({
      success: true,
      message: `Successfully joined "${challenge.title}" challenge!`,
      data: userChallenge,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyChallenges = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const userChallenges = await prisma.userChallenge.findMany({
      where: { user_id: userId },
      include: { challenge: true },
      orderBy: { joined_at: 'desc' },
    });

    const active = userChallenges
      .filter((uc) => uc.status === 'IN_PROGRESS')
      .map((uc) => ({
        ...uc,
        progress_percentage: Math.min(100, Math.round((uc.current_progress / uc.challenge.target_value) * 100)),
      }));

    const completed = userChallenges
      .filter((uc) => uc.status === 'COMPLETED')
      .map((uc) => ({
        ...uc,
        badge: uc.challenge.reward_badge,
      }));

    res.status(200).json({
      success: true,
      data: {
        active,
        completed,
        total_badges_earned: completed.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createChallenge = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.user!.userId;
    const { title, description, target_metric, target_value, start_date, end_date, reward_badge } = req.body;

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        target_metric,
        target_value,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        reward_badge,
      },
    });

    await logAudit(adminId, 'CREATE_CHALLENGE', { challengeId: challenge.id, title });

    res.status(201).json({
      success: true,
      message: 'New challenge launched successfully.',
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
};
