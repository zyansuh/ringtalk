import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { WsEvents } from '@ringtalk/shared-server';

export interface AuthenticatedSocket extends Socket {
  data: Socket['data'] & { user?: JwtPayload };
}

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket.io',
})
export class WebSocketGatewayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebSocketGatewayService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    server.use(async (socket: Socket, next) => {
      const token =
        socket.handshake.auth?.accessToken ?? socket.handshake.auth?.token;

      if (!token) {
        this.logger.warn(`WS 연결 거부: 토큰 없음 (socket ${socket.id})`);
        return next(new Error('UNAUTHORIZED'));
      }

      try {
        const payload = this.jwt.verify<JwtPayload>(token, {
          secret: this.config.get('JWT_SECRET', 'fallback-secret'),
        });

        const session = await this.prisma.userSession.findUnique({
          where: {
            userId_deviceId: { userId: payload.sub, deviceId: payload.deviceId },
          },
        });

        if (!session) {
          this.logger.warn(`WS 연결 거부: 세션 없음 (userId=${payload.sub})`);
          return next(new Error('UNAUTHORIZED'));
        }

        (socket as AuthenticatedSocket).data.user = {
          sub: payload.sub,
          deviceId: payload.deviceId,
        };
        next();
      } catch {
        this.logger.warn(`WS 연결 거부: 토큰 검증 실패 (socket ${socket.id})`);
        return next(new Error('UNAUTHORIZED'));
      }
    });

    this.logger.log('WebSocket Gateway 초기화 완료');
  }

  handleConnection(client: AuthenticatedSocket) {
    const user = client.data.user;
    if (user) {
      this.logger.log(`WS 연결: userId=${user.sub} socket=${client.id}`);
      client.emit(WsEvents.AUTHENTICATED, { userId: user.sub });
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = client.data.user;
    if (user) {
      this.logger.log(`WS 연결 해제: userId=${user.sub} socket=${client.id}`);
    }
  }
}
