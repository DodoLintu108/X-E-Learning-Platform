import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  courseId: string; // Link to the course

  
  @Prop([{ question: String, options: [String], correctAnswer: String }])
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;

  @Prop({ default: 0 })
  attempts: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
