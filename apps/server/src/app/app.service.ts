import { Injectable } from '@nestjs/common';
import {Task, TaskSchema, TaskDocument} from './models/task'
import { CreateTaskDto, TaskDto, TaskListDto } from './models/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  async getAll(): Promise<TaskDto[]> {
    const tasks = await this.model.find().exec();

    return tasks.map((task) => { return {
      id: task['_id'].toString(),
      description: task.description,
      creationDate: task.creationDate,
      completionDate: task.completionDate,
      priority: task.priority,
      completed: task.completed
    } as TaskDto});
  }

  async getOne(id: string): Promise<TaskDto> {
    const task = await this.model.findById(id).exec();

    return {
      id: task['_id'].toString(),
      description: task.description,
      creationDate: task.creationDate,
      completionDate: task.completionDate,
      priority: task.priority,
      completed: task.completed
    } as TaskDto
  }

  async create(task :CreateTaskDto): Promise<TaskDto> {
   return new Promise<TaskDto>((resolve, reject) => {
    this.model.create({
      description: task.description,
      creationDate: new Date(task.creationDate),
      completionDate: Date.parse('1970-01-01T00:00:00.000+00:00'),
      priority: task.priority,
      completed: task.completed,
    }).then((task) => {
      resolve({
        id: task['_id'].toString(),
        description: task.description,
        creationDate: task.creationDate,
        completionDate: task.completionDate,
        priority: task.priority,
        completed: task.completed
      } as TaskDto)
      });
    });
  }
}