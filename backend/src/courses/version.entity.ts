// version.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VersionDocument = Version & Document;

@Schema()
export class Version {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop()
  changeSummary: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VersionSchema = SchemaFactory.createForClass(Version);