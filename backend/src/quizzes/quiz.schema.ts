import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  quizId: string; // Unique identifier for the quiz

  @Prop({ required: true })
  courseId: string; // Associated course ID

  @Prop({ required: true })
  title: string; // Title of the quiz

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
  
  @Prop({ type: [String], default: [] }) // Add submittedBy property
  submittedBy: string[];

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp for quiz creation
}
export class Response {
  @Prop()
  userId: string;

  @Prop()
  quizId: string;

  @Prop({ type: Array })
  answers: { questionId: string; answer: number }[];

  @Prop({ default: Date.now })
  submittedAt: Date;
}
export const QuizSchema = SchemaFactory.createForClass(Quiz);
