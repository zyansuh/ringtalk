import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateDirectRoomDto } from './dto/create-direct-room.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  getRooms(@CurrentUser() user: JwtPayload) {
    return this.rooms.getRooms(user.sub);
  }

  @Post()
  createDirectRoom(@CurrentUser() user: JwtPayload, @Body() dto: CreateDirectRoomDto) {
    return this.rooms.createDirectRoom(user.sub, dto);
  }
}
