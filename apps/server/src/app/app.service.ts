import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Task } from './models/task';
import {
  CreateTaskDto,
  TaskDto,
  TaskListDto,
  UpdatePartialTaskDto,
  UpdateTaskDto,
} from './models/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  async getAll(): Promise<TaskListDto> {
    const taskDocuments = await this.model.find().exec();

    return taskDocuments.map((taskDocument) => this.taskDocumentMapper(taskDocument));
  }

  async getOne(id: string): Promise<TaskDto> {
    const taskDocument = await this.model.findById(id).exec();

    return this.taskDocumentMapper(taskDocument);
  }

  async create(task: CreateTaskDto): Promise<TaskDto> {
    return new Promise<TaskDto>((resolve, reject) => {
      this.model
        .create(this.createDtoMapper(task))
        .then((taskDocument) => {
          resolve(this.taskDocumentMapper(taskDocument));
        });
    });
  }

  async deleteOne(id: string): Promise<TaskDto> {
    const task = await this.model.findByIdAndDelete(id).exec();
    console.log(task);
    return null;
  }

  async update(id: string, task: UpdateTaskDto): Promise<TaskDto> {
    try {
      const updateQuery = this.updateDtoMapper(task);

      const taskDocument = await this.model
        .findOneAndReplace({ _id: id }, updateQuery, {
          new: true,
          useFindAndModify: false,
      }).exec();

      if (!taskDocument) {
        throw new NotFoundException();
      }
      
      return this.taskDocumentMapper(taskDocument);
    }
    catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updatePartial(id: string, task: UpdatePartialTaskDto): Promise<TaskDto> {
    try {
      const updateQuery = this.updateDtoMapper(task);

      const taskDocument = await this.model
        .findByIdAndUpdate(id, updateQuery, {
        new: true,
      }).exec();

      if (!taskDocument) {
        throw new NotFoundException();
      }

      return this.taskDocumentMapper(taskDocument);
    }
    catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  private createDtoMapper (dto: CreateTaskDto) {
    return {
      description: dto.description,
      creationDate: new Date(dto.creationDate),
      completionDate: Date.parse('1970-01-01T00:00:00.000+00:00'),
      priority: dto.priority,
      completed: dto.completed,
    }
  }

  private updateDtoMapper (dto: UpdateTaskDto | UpdatePartialTaskDto) {
    return {
      description: dto.description,
      creationDate: dto.creationDate
        ? new Date(dto.creationDate)
        : undefined,
      completionDate: dto.completionDate
        ? new Date(dto.completionDate)
        : undefined,
      priority: dto.priority,
      completed: dto.completed,
      $inc: { _version: 1 },
    };
  }

  private taskDocumentMapper (document: Task & { _id: Types.ObjectId }): TaskDto {
    return {
      id: document['_id'].toString(),
      description: document.description,
      creationDate: document.creationDate,
      completionDate: document.completionDate,
      priority: document.priority,
      completed: document.completed
    } as TaskDto;
  }
}
