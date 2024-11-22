import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true, unique: true })
  chatId: string; // Unique identifier for the chat

  @Prop({ required: true })
  invitationId: string; // Unique invitation ID to validate participants

  @Prop({ required: true })
  participants: string[]; // Array of user IDs (student, instructor)

  @Prop({
    type: [
      {
        senderId: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  })
  messages: Array<{
    senderId: string;
    message: string;
    timestamp: Date;
  }>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
