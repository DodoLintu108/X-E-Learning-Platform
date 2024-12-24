import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ChatRoom {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  participants: string[];  // User IDs (teachers and students)
}

export type ChatRoomDocument = ChatRoom & Document;
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
