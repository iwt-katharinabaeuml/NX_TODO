import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({required: true})
  description: string;

  @Prop({default: Date.now})
  creationDate: Date;

  @Prop()
  completionDate: Date;

  @Prop({enum: ["high", "medium", "low", "none"], default: 'none' })
  priority: string;

  @Prop({default: false})
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);



// export const todoSchema = new Schema(
//   {
//     description: {
//       type: String,
//       required: true,
//     },
//     creationDate: {
//       type: Date,
//       default: Date.now,
//     },
//     completionDate: {
//       type: Date,
//     }, // folgeTag
//     priority: {
//       type: String,
//       enum: ["high", "medium", "low", "none"],
//       default: "none",
//     },
//     completed: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { versionKey: "_version" }
// );

// mongoose.models.Task || mongoose.model("Task", todoSchema);
