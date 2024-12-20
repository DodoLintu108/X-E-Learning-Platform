import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CourseDocument = Course & Document;

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
  difficultyLevel: string; // Beginner, Intermediate, Advanced

  @Prop({ required: true })
  createdBy: string; // ID of the instructor who created the course

  @Prop({ default: [] })
  enrolledStudents: string[]; // Array of student IDs enrolled in the course

  @Prop({ default: 'default-image.jpg' })
  courseImage: string;

  @Prop(String)
  courseMaterial: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
