// Real-time messaging APIs (Task 6.1)

import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('invite') // Endpoint is `/chat/invite`
  async createInvitation(@Body() body: { studentId: string; instructorId: string }) {
    return this.chatService.createInvitation(body.studentId, body.instructorId);
  }

  @Post('message')
  async addMessage(
    @Body() body: { chatId: string; senderId: string; message: string }
  ) {
    return this.chatService.addMessage(body.chatId, body.senderId, body.message);
  }

  @Get(':chatId/:userId/messages')
  async getMessages(@Param('chatId') chatId: string, @Param('userId') userId: string) {
    return this.chatService.getMessages(chatId, userId);
  }
}
