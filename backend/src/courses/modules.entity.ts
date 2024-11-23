import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ModuleDocument = Module & Document;

@Schema()
export class Version {
  @Prop({ required: true })
  updatedBy: string;

  @Prop()
  changeSummary: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VersionSchema = SchemaFactory.createForClass(Version);

@Schema()
export class Module {
  @Prop({ required: true, default: uuidv4 })
  moduleId: string;

  @Prop({ required: true })
  courseId: string; // Associated course ID

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  resources: string[]; // Array of URLs

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [VersionSchema] })
  versionHistory: Version[]; // Version control for the module
}

export const ModuleSchema = SchemaFactory.createForClass(Module);