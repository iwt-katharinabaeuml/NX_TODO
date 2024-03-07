import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Task, TaskSchema } from './models/task';
import { TaskMapper } from './task.mapper';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/to_do'),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, TaskMapper],
})
export class AppModule {}
