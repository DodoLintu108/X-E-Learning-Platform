import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Column } from 'react-table'; 


export type CourseDocument = Course & Document;

@Schema()
export class Lecture {
  @Prop({ required: true })
  title: string; // Title of the lecture

  @Prop({ required: true, enum: ['video', 'pdf'] })
  type: 'video' | 'pdf'; // Type of lecture

  @Prop({ required: true })
  content: string; // YouTube URL for video or file path for PDF

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp for when the lecture was added
}

// Create the Mongoose schema for Lecture
export const LectureSchema = SchemaFactory.createForClass(Lecture);

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

  @Prop({ type: [LectureSchema], default: [] })
  lectures: Lecture[]; // Array of lectures

  @Column({ default: false })
  isDeleted: boolean;
}

// Create the Mongoose schema for Course
export const CourseSchema = SchemaFactory.createForClass(Course);
