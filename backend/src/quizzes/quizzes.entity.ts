import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({ required: true, default: uuidv4 })
  quizId: string; // Unique identifier for the quiz

  @Prop({ required: true })
  courseId: string; // Associated course ID

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true }, // Index of correct option
      },
    ],
    required: true,
  })
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp for quiz creation
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

