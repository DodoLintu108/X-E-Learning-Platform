import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the TypeScript type for a Forum document
export type ForumDocument = Forum & Document;

@Schema()
export class Forum {
  @Prop({ required: true })
  courseId: string; // ID of the associated course

  @Prop({
    type: [
      {
        threadId: String, // Unique identifier for the thread
        title: String, // Title of the thread
        authorId: String, // ID of the user who created the thread
        replies: [
          {
            replyId: String, // Unique identifier for the reply
            content: String, // Content of the reply
            authorId: String, // ID of the user who wrote the reply
            timestamp: { type: Date, default: Date.now }, // Timestamp of the reply
          },
        ],
        createdAt: { type: Date, default: Date.now }, // Timestamp when the thread was created
      },
    ],
  })
  threads: Array<{
    threadId: string;
    title: string;
    authorId: string;
    replies: Array<{
      replyId: string;
      content: string;
      authorId: string;
      timestamp: Date;
    }>;
    createdAt: Date;
  }>;
}

// Generate the MongoDB schema for the Forum model
export const ForumSchema = SchemaFactory.createForClass(Forum);
