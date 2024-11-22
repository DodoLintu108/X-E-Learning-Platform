import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  /**
   * Create a chat invitation for a student and instructor.
   * @param studentId - The ID of the student
   * @param instructorId - The ID of the instructor
   */
  async createInvitation(studentId: string, instructorId: string) {
    const chatId = `${studentId}-${instructorId}`;
    const invitationId = Math.random().toString(36).substring(2, 15); // Generate random string

    const existingChat = await this.chatModel.findOne({ chatId });
    if (existingChat) {
      return existingChat; // Chat already exists
    }

    const newChat = new this.chatModel({
      chatId,
      invitationId,
      participants: [studentId, instructorId],
      messages: [],
    });

    return newChat.save();
  }

  /**
   * Validate a participant's access to a chat.
   * @param chatId - The chat ID
   * @param userId - The user ID
   */
  async validateParticipant(chatId: string, userId: string) {
    const chat = await this.chatModel.findOne({ chatId });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!chat.participants.includes(userId)) {
      throw new UnauthorizedException('Access denied');
    }
    return chat;
  }

  /**
   * Add a message to the chat.
   * @param chatId - The chat ID
   * @param senderId - The ID of the sender
   * @param message - The message text
   */
  async addMessage(chatId: string, senderId: string, message: string) {
    const chat = await this.validateParticipant(chatId, senderId);
    chat.messages.push({ senderId, message, timestamp: new Date() });
    return chat.save();
  }

  /**
   * Get chat messages.
   * @param chatId - The chat ID
   * @param userId - The ID of the requesting user
   */
  async getMessages(chatId: string, userId: string) {
    const chat = await this.validateParticipant(chatId, userId);
    return chat.messages;
  }
}
