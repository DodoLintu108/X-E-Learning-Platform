import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Quiz {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  level: string;

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
      },
    ],
  })
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;

  @Prop({ type: [Object], default: [] })
  submittedBy: Array<{ userId: string; score: number; submittedAt: Date }>;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema()
export class Lecture {
  @Prop({ type: Types.ObjectId, auto: true, required: false })
  _id?: Types.ObjectId;  // <-- make `_id` optional

  @Prop({ required: true, default: 'Untitled Quiz' })
  title: string;

  @Prop({ required: true, enum: ['video', 'pdf'] })
  type: 'video' | 'pdf';

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [SchemaFactory.createForClass(Quiz)], default: [] })
  quizzes: Quiz[];


}
@Schema()
export class Feedback {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true, default: Date.now })
  submittedAt: Date;
}
@Schema()
export class Course {
  @Prop({ required: true, default: uuidv4 })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  difficultyLevel: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: [] })
  enrolledStudents: string[];

  @Prop({ default: 'default-image.jpg' })
  courseImage: string;

  @Prop({ type: String })
  courseMaterial: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [SchemaFactory.createForClass(Lecture)], default: [] })
  lectures: Lecture[];

  @Prop({ default: false })
  isEnded: boolean;

  @Prop({ type: [Feedback], default: [] })
  feedback: Feedback[];
}

// This interface merges your schema and Mongoose Document
export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);
