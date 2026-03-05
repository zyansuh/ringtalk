import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ErrorCode } from '@ringtalk/shared-server';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: '유저를 찾을 수 없습니다.' });
    }
    const { phoneHash: _, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    const { phoneHash: _, ...safe } = user;
    return safe;
  }

  async searchByPhoneHash(phoneHashes: string[]) {
    return this.prisma.user.findMany({
      where: { phoneHash: { in: phoneHashes } },
      select: { id: true, displayName: true, profileImageUrl: true, statusMessage: true },
    });
  }

  async blockUser(userId: string, targetId: string) {
    await this.prisma.friend.upsert({
      where: { userId_friendId: { userId, friendId: targetId } },
      create: { userId, friendId: targetId, status: 'blocked' },
      update: { status: 'blocked' },
    });
  }

  async getFriends(userId: string) {
    return this.prisma.friend.findMany({
      where: { userId, status: 'accepted' },
      include: {
        friend: {
          select: { id: true, displayName: true, profileImageUrl: true, statusMessage: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
