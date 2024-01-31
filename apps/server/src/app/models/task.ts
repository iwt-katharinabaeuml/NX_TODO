import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEnum } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
export enum Priority {
  'high',
  'medium',
  'low',
  'none',
}
@Schema()
export class Task {
  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  creationDate: Date;

  @Prop()
  completionDate: Date;

  @Prop()
  priority: Priority

  @Prop({ default: false })
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set('versionKey', '_version');