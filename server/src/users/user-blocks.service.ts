import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserBlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async block(blockerId: string, blockedId: string): Promise<{ ok: true }> {
    if (blockerId === blockedId) {
      throw new BadRequestException('Cannot block yourself');
    }
    const target = await this.prisma.user.findUnique({
      where: { id: blockedId },
      select: { id: true },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      create: { blockerId, blockedId },
      update: {},
    });
    return { ok: true };
  }

  async unblock(blockerId: string, blockedId: string): Promise<{ ok: true }> {
    await this.prisma.userBlock.deleteMany({ where: { blockerId, blockedId } });
    return { ok: true };
  }

  /** Users blocked by `blockerId` (the blocked side never learns about it). */
  async listBlockedUserIds(blockerId: string): Promise<{ blocked_user_ids: string[] }> {
    const rows = await this.prisma.userBlock.findMany({
      where: { blockerId },
      select: { blockedId: true },
      orderBy: { createdAt: 'desc' },
    });
    return { blocked_user_ids: rows.map((r) => r.blockedId) };
  }
}

export type UserBlockDirection = 'blocked_by_me' | 'blocked_by_peer' | null;

/** Is there a block between two users, and who set it. */
export async function findUserBlock(
  prisma: PrismaService,
  userId: string,
  peerId: string,
): Promise<UserBlockDirection> {
  if (!userId || !peerId || userId === peerId) return null;
  const rows = await prisma.userBlock.findMany({
    where: {
      OR: [
        { blockerId: userId, blockedId: peerId },
        { blockerId: peerId, blockedId: userId },
      ],
    },
    select: { blockerId: true },
  });
  if (rows.length === 0) return null;
  return rows.some((r) => r.blockerId === userId) ? 'blocked_by_me' : 'blocked_by_peer';
}
