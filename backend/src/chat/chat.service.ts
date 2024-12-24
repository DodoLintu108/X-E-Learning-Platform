import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  // Send a new message
  async sendMessage(chatRoomId: string, senderId: string, content: string) {
    const message = new this.messageModel({ chatRoomId, senderId, content });
    return message.save();
  }

  // Get all messages in a chat room
  async getMessages(chatRoomId: string) {
    return this.messageModel.find({ chatRoomId }).sort({ sentAt: 1 }).exec();
  }

  // Create or fetch an existing chat room
  async createOrFetchChatRoom(studentId: string, courseId: string) {
    const existingRoom = await this.messageModel.findOne({
      participants: { $all: [studentId, courseId] },
    });

    if (existingRoom) {
      return existingRoom;
    }

    const newRoom = new this.messageModel({
      courseId,
      participants: [studentId, courseId],
    });
    return newRoom.save();
  }
}
