import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RoomsService } from '../rooms/rooms.service';
import { CreateDirectRoomDto } from '../rooms/dto/create-direct-room.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  getChats(@CurrentUser() user: JwtPayload) {
    return this.rooms.getRooms(user.sub);
  }

  @Post('direct')
  createDirectChat(@CurrentUser() user: JwtPayload, @Body() dto: CreateDirectRoomDto) {
    return this.rooms.createDirectRoom(user.sub, dto);
  }
}
