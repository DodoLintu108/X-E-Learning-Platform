// Schema for courses and versioning (Tasks 2.1, 2.2)
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
  difficultyLevel: string; // Beginner, Intermediate, Advanced// Instructor ID

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: 'default-image.jpg' })
  courseImage: string;
  @Prop(String)
  courseMaterial: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
