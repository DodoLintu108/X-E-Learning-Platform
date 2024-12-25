import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
  questions: Array<{ question: string; options: string[]; correctAnswer: number }>;

  @Prop({ type: [Object], default: [] }) // Submitted details
  submittedBy: Array<{ userId: string; score: number; submittedAt: Date }>;

  @Prop({ default: Date.now })
  createdAt: Date;
}


@Schema()
class Lecture {
  @Prop({ required: true, default: 'Untitled Quiz' })
  title: string;

  @Prop({ required: true, enum: ['video', 'pdf'] })
  type: 'video' | 'pdf'; // Type of lecture

  @Prop({ required: true })
  content: string; // YouTube URL for video or file path for PDF

  @Prop({
    type: [
      {
        quizId: { type: String, required: true },
        title: { type: String, required: true, default: 'Untitled Quiz' },
        level: { type: String, required: true },
        questions: [
          {
            question: { type: String, required: true },
            options: { type: [String], required: true },
            correctAnswer: { type: Number, required: true },
          },
        ],
        submittedBy: { type: [Object], default: [] },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  quizzes: Quiz[]; // Array of quizzes associated with the lecture

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp for when the lecture was added
}

@Schema()
export class Course {
  @Prop({ required: true, default: uuidv4 })
  courseId: string; // Unique identifier for the course

  @Prop({ required: true })
  title: string; // Course title

  @Prop({ required: true })
  description: string; // Course description

  @Prop({ required: true })
  category: string; // Course category (e.g., Mathematics, Physics)

  @Prop({ required: true })
  difficultyLevel: string; // Beginner, Intermediate, Advanced

  @Prop({ required: true })
  createdBy: string; // ID of the instructor who created the course

  @Prop({ default: [] })
  enrolledStudents: string[]; // Array of student IDs enrolled in the course

  @Prop({ default: 'default-image.jpg' })
  courseImage: string; // Default course image

  @Prop({ type: String })
  courseMaterial: string; // Additional course material, if any

  @Prop({ default: Date.now })
  createdAt: Date; // Course creation date

  @Prop({ type: [Lecture], default: [] })
  lectures: Lecture[]; // Array of lectures


}
export interface Course {
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  isEnded: boolean; // Add this line
}
// Create the Mongoose schema for Course
export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);
