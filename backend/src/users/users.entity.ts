import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, default: uuidv4, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['student', 'teacher', 'admin'] })
  role: string;

  @Prop({ enum: ['pdf', 'video'], default: null })
  learningPreference?: string;

  @Prop({ type: [String], default: [] })
  subjectsOfInterest?: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 0 })
  failedLoginAttempts: number;  // <-- NEW: Tracks failed logins

  @Prop({ type: [{ date: Date, ipAddress: String }], default: [] })
  unauthorizedAccessLogs: Array<{ date: Date; ipAddress: string }>;  // <-- NEW: Unauthorized logs

  
}


export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
export class Log extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const LogSchema = SchemaFactory.createForClass(Log);
