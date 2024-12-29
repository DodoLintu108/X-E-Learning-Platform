import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Send a message in a chat room
  @Post(':chatRoomId/send')
  async sendMessage(
    @Param('chatRoomId') chatRoomId: string,
    @Body() body: { senderId: string; content: string },
  ) {
    return this.chatService.sendMessage(chatRoomId, body.senderId, body.content);
  }

  // Retrieve all messages from a chat room
  @Get(':chatRoomId/messages')
  async getMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId);
  }

  // Initiate a new chat between teacher and student
  @Post('initiate')
  async initiateChat(
    @Body() body: { studentId: string; courseId: string },
  ) {
    return this.chatService.createOrFetchChatRoom(body.studentId, body.courseId);
  }
}
