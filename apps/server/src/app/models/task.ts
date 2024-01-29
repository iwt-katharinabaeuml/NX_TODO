import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  creationDate: Date;

  @Prop()
  completionDate: Date;

  @Prop({ enum: ['high', 'medium', 'low', 'none'], default: 'none' })
  priority: string;

  @Prop({ default: false })
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set('versionKey', '_version');