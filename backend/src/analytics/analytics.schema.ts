import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema()
export class Analytics {
  // Unique identifier for analytics entry
  @Prop({ required: true, unique: true })
  analyticsId: string;

  // User ID (Student or Instructor)
  @Prop({ required: true })
  userId: string;

  // Course Completion Rate (For students)
  @Prop()
  completionPercentage?: number;

  // Average Quiz Score (For students)
  @Prop()
  averageScore?: number;

  // Engagement Trends (Modules and Time Spent)
  @Prop({ type: [String] })
  engagementModules?: string[];

  @Prop({ type: [Number] })
  engagementTime?: number[];

  // Assessment Results (Passed and Failed counts for instructors)
  @Prop({ type: Map, of: Number })
  assessmentResults?: Map<string, number>; // e.g., { "passed": 100, "failed": 20 }

  // Content Effectiveness (For instructors)
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

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
