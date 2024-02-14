import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
export enum Priority {
  'high' = 'high',
  'medium' = 'medium',
  'low' = 'low',
  'none' = 'none',
}
@Schema()
export class Task {
  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  creationDate: Date;

  @Prop()
  completionDate: Date;

  @Prop({ type: String, enum: Object.values(Priority) })
  @IsEnum(Priority, { message: 'Invalid priority' })
  priority: Priority;

  @Prop({ default: false })
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set('versionKey', '_version');
