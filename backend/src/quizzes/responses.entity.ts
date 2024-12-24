import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ResponseDocument = Response & Document;

@Schema()
export class Response {
  @Prop({ required: true, default: uuidv4 })
  responseId: string; // Unique identifier for the response

  @Prop({ required: true })
  userId: string; // ID of the user who submitted the response

  @Prop({ required: true })
  quizId: string; // Associated quiz ID

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        answer: { type: Number, required: true }, // Index of the selected option
      },
    ],
    required: true,
  })
  answers: {
    questionId: string;
    answer: number;
  }[];

  @Prop({ required: true })
  score: number; // Score received for the quiz

  @Prop({ default: Date.now })
  submittedAt: Date; // Timestamp of submission
}

export const ResponseSchema = SchemaFactory.createForClass(Response);

