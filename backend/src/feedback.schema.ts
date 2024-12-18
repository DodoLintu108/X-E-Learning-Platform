import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  quizId: string; // Optional: Could be related to quizzes

  @Prop({ default: false })
  resolved: boolean;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
