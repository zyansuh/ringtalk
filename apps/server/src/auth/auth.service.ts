import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  TooManyRequestsException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { OtpResponse, AuthTokens, ErrorCode } from '@ringtalk/shared';
import {
  OTP_LENGTH,
  OTP_EXPIRES_IN,
  OTP_MAX_ATTEMPTS,
  OTP_RATE_LIMIT_WINDOW,
  OTP_RATE_LIMIT_MAX,
} from '@ringtalk/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── OTP 요청 ──────────────────────────────────────────────────────────────

  async requestOtp(dto: RequestOtpDto, ip: string): Promise<OtpResponse> {
    const { phoneNumber } = dto;

    // Rate Limit 확인 (전화번호 기준)
    await this.checkOtpRateLimit(phoneNumber, ip);

    // OTP 생성 (6자리 숫자)
    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    // Redis에 OTP 저장
    await this.redis.setJson(
      RedisService.otpKey(phoneNumber),
      { hash: otpHash, attempts: 0 },
      OTP_EXPIRES_IN,
    );

    // Rate Limit 카운터 증가
    await this.incrementRateLimit(phoneNumber, ip);

    // OTP 발송
    await this.sendOtp(phoneNumber, otp);

    return {
      success: true,
      expiresIn: OTP_EXPIRES_IN,
    };
  }

  // ─── OTP 검증 + 로그인/회원가입 ────────────────────────────────────────────

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthTokens & { isNewUser: boolean }> {
    const { phoneNumber, otp, deviceId, deviceName, platform, pushToken } = dto;

    // OTP 조회
    const stored = await this.redis.getJson<{ hash: string; attempts: number }>(
      RedisService.otpKey(phoneNumber),
    );

    if (!stored) {
      throw new BadRequestException({
        code: ErrorCode.OTP_EXPIRED,
        message: 'OTP가 만료되었거나 존재하지 않습니다.',
      });
    }

    if (stored.attempts >= OTP_MAX_ATTEMPTS) {
      await this.redis.del(RedisService.otpKey(phoneNumber));
      throw new BadRequestException({
        code: ErrorCode.OTP_MAX_ATTEMPTS,
        message: '최대 시도 횟수를 초과했습니다. 새로운 OTP를 요청하세요.',
      });
    }

    const isValid = await bcrypt.compare(otp, stored.hash);

    if (!isValid) {
      // 시도 횟수 증가
      await this.redis.setJson(
        RedisService.otpKey(phoneNumber),
        { ...stored, attempts: stored.attempts + 1 },
        await this.redis.ttl(RedisService.otpKey(phoneNumber)),
      );
      throw new BadRequestException({
        code: ErrorCode.OTP_INVALID,
        message: `잘못된 OTP입니다. 남은 시도: ${OTP_MAX_ATTEMPTS - stored.attempts - 1}회`,
      });
    }

    // OTP 사용 완료 → Redis에서 삭제
    await this.redis.del(RedisService.otpKey(phoneNumber));

    // 유저 조회 또는 생성
    const { user, isNewUser } = await this.findOrCreateUser(phoneNumber);

    // 세션 생성 (디바이스별)
    const tokens = await this.createSession(user.id, {
      deviceId,
      deviceName,
      platform,
      pushToken,
    });

    this.logger.log(`로그인 성공: userId=${user.id} device=${deviceName} (신규: ${isNewUser})`);

    return { ...tokens, isNewUser };
  }

  // ─── 토큰 갱신 ─────────────────────────────────────────────────────────────

  async refresh(dto: RefreshTokenDto): Promise<AuthTokens> {
    const { refreshToken, deviceId } = dto;

    let payload: { sub: string; deviceId: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }) as typeof payload;
    } catch {
      throw new UnauthorizedException({
        code: ErrorCode.TOKEN_EXPIRED,
        message: '리프레시 토큰이 만료되었거나 유효하지 않습니다.',
      });
    }

    if (payload.deviceId !== deviceId) {
      throw new UnauthorizedException({
        code: ErrorCode.TOKEN_INVALID,
        message: '토큰과 디바이스가 일치하지 않습니다.',
      });
    }

    // DB에서 세션 확인
    const session = await this.prisma.userSession.findUnique({
      where: { userId_deviceId: { userId: payload.sub, deviceId } },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException({
        code: ErrorCode.TOKEN_EXPIRED,
        message: '세션이 만료되었습니다. 다시 로그인해 주세요.',
      });
    }

    // 리프레시 토큰 해시 검증
    const isValid = await bcrypt.compare(refreshToken, session.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException({
        code: ErrorCode.TOKEN_INVALID,
        message: '유효하지 않은 리프레시 토큰입니다.',
      });
    }

    // 새 토큰 발급 (Refresh Token Rotation)
    return this.rotateTokens(payload.sub, deviceId);
  }

  // ─── 로그아웃 ──────────────────────────────────────────────────────────────

  async logout(userId: string, deviceId: string): Promise<void> {
    await this.prisma.userSession.deleteMany({
      where: { userId, deviceId },
    });
    await this.redis.del(RedisService.sessionKey(userId, deviceId));
    this.logger.log(`로그아웃: userId=${userId} deviceId=${deviceId}`);
  }

  // ─── 내 세션 목록 ──────────────────────────────────────────────────────────

  async getSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId },
      select: {
        id: true,
        deviceId: true,
        deviceName: true,
        platform: true,
        lastSeenAt: true,
        createdAt: true,
      },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  // ─── 특정 세션 강제 종료 ────────────────────────────────────────────────────

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.prisma.userSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (session) {
      await this.prisma.userSession.delete({ where: { id: sessionId } });
      await this.redis.del(RedisService.sessionKey(userId, session.deviceId));
    }
  }

  // ─── 내부 헬퍼 ─────────────────────────────────────────────────────────────

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOtp(phone: string, otp: string): Promise<void> {
    const isMock = this.config.get('OTP_MOCK') === 'true';

    if (isMock) {
      this.logger.log(`[개발] OTP for ${phone}: ${otp}`);
      return;
    }

    // TODO: Twilio 연동
    // const client = twilio(this.config.get('TWILIO_ACCOUNT_SID'), this.config.get('TWILIO_AUTH_TOKEN'));
    // await client.messages.create({ body: `[링톡] 인증번호: ${otp}`, from: this.config.get('TWILIO_PHONE_NUMBER'), to: phone });
  }

  private async checkOtpRateLimit(phone: string, ip: string): Promise<void> {
    const phoneKey = RedisService.otpRateLimitKey(phone);
    const ipKey = RedisService.otpIpRateLimitKey(ip);

    const [phoneCount, ipCount] = await Promise.all([
      this.redis.get(phoneKey).then((v) => parseInt(v ?? '0')),
      this.redis.get(ipKey).then((v) => parseInt(v ?? '0')),
    ]);

    if (phoneCount >= OTP_RATE_LIMIT_MAX || ipCount >= OTP_RATE_LIMIT_MAX * 2) {
      const retryAfter = await this.redis.ttl(phoneKey);
      throw new TooManyRequestsException({
        code: ErrorCode.RATE_LIMIT,
        message: '너무 많은 OTP 요청입니다. 잠시 후 다시 시도하세요.',
        details: { retryAfter },
      });
    }
  }

  private async incrementRateLimit(phone: string, ip: string): Promise<void> {
    const phoneKey = RedisService.otpRateLimitKey(phone);
    const ipKey = RedisService.otpIpRateLimitKey(ip);

    const [phoneCount] = await Promise.all([
      this.redis.incr(phoneKey),
      this.redis.incr(ipKey),
    ]);

    if (phoneCount === 1) {
      await Promise.all([
        this.redis.expire(phoneKey, OTP_RATE_LIMIT_WINDOW),
        this.redis.expire(ipKey, OTP_RATE_LIMIT_WINDOW),
      ]);
    }
  }

  private async findOrCreateUser(phoneE164: string) {
    const existing = await this.prisma.user.findUnique({
      where: { phoneE164 },
    });

    if (existing) {
      return { user: existing, isNewUser: false };
    }

    const user = await this.prisma.user.create({
      data: {
        phoneE164,
        phoneHash: await bcrypt.hash(phoneE164, 12),
        displayName: `링톡 사용자`,
      },
    });

    return { user, isNewUser: true };
  }

  private async createSession(
    userId: string,
    opts: { deviceId: string; deviceName: string; platform: string; pushToken?: string },
  ): Promise<AuthTokens> {
    const { deviceId, deviceName, platform, pushToken } = opts;

    const accessToken = this.jwt.sign(
      { sub: userId, deviceId },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: userId, deviceId },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.userSession.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      create: {
        userId,
        deviceId,
        deviceName,
        platform: platform as any,
        pushToken,
        refreshToken: refreshTokenHash,
        expiresAt,
      },
      update: {
        deviceName,
        pushToken,
        refreshToken: refreshTokenHash,
        expiresAt,
        lastSeenAt: new Date(),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15분 (초 단위)
    };
  }

  private async rotateTokens(userId: string, deviceId: string): Promise<AuthTokens> {
    const accessToken = this.jwt.sign(
      { sub: userId, deviceId },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: userId, deviceId },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.userSession.update({
      where: { userId_deviceId: { userId, deviceId } },
      data: { refreshToken: refreshTokenHash, expiresAt, lastSeenAt: new Date() },
    });

    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }
}
