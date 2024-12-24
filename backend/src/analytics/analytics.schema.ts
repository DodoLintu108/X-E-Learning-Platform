// src/analytics/analytics.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 1) Document Types
 */
export type AnalyticsDocument = Analytics & Document;
export type QuizDocument = Quiz & Document;

/**
 * 2) Analytics Schema
 */
@Schema()
export class Analytics {
  // The ID of the module/lecture this analytics entry corresponds to
  @Prop({ required: true })
  moduleId: string;

  // The array of submissions (userId, score, date)
  @Prop({ type: [{ userId: String, score: Number, submittedAt: Date }] })
  submittedBy: Array<{
    userId: string;
    score: number;
    submittedAt: Date;
  }>;

  @Prop({ required: true })
  level: string;

  // Unique identifier for analytics entry
  @Prop({ required: true, unique: true })
  analyticsId: string;

  // The user who owns this analytics record (could be teacher or student)
  @Prop({ required: true })
  userId: string;

  // Course Completion Rate (for students)
  @Prop()
  completionPercentage?: number;

  // Average Quiz Score (for students)
  @Prop()
  averageScore?: number;

  // Engagement Trends (modules used/time spent)
  @Prop({ type: [String] })
  engagementModules?: string[];

  @Prop({ type: [Number] })
  engagementTime?: number[];

  // Assessment Results (passed/failed counts)
  @Prop({ type: Map, of: Number })
  assessmentResults?: Map<string, number>; // e.g. { "passed": 10, "failed": 2 }

  // Content effectiveness (for instructors)
  @Prop({
    type: [
      {
        quizId: String,
        difficulty: String,
        averageScore: Number,
      },
    ],
  })
  contentEffectiveness?: Array<{
    quizId: string;
    difficulty: string;
    averageScore: number;
  }>;

  // Downloadable Report URL
  @Prop()
  reportUrl?: string;

  // Timestamp for when the analytics entry was created
  @Prop({ default: Date.now })
  createdAt: Date;
}

/**
 * 3) Quiz Schema
 */
@Schema()
export class Quiz {
  // The ID of the module/lecture this quiz belongs to
  @Prop({ required: true })
  moduleId: string;

  // The difficulty level or classification
  @Prop({ required: true })
  level: string;

  // The array of submissions for this quiz
  @Prop({ type: [{ userId: String, score: Number, submittedAt: Date }] })
  submittedBy: Array<{
    userId: string;
    score: number;
    submittedAt: Date;
  }>;
}

/**
 * 4) Export the compiled schemas
 */
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
export const QuizSchema = SchemaFactory.createForClass(Quiz);
