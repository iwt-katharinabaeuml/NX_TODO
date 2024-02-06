import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskDocument } from './models/task';
import {
  CreateTaskDto,
  Priority,
  TaskDto,
  TaskListDto,
  UpdatePartialTaskDto,
  UpdateTaskDto,
} from './models/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskMapper } from './task.mapper';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Task.name) private model: Model<Task>,
    private readonly mapper: TaskMapper
  ) {}

  async getAll(): Promise<TaskListDto> {
    try {
      const taskDocuments = await this.model.find().exec();

      return this.mapper.taskDocumentsMapper(taskDocuments);
    } catch (error) {
      // console.error('Error in getAll', error);
      throw new InternalServerErrorException();
    }
  }

  async getOne(id: string): Promise<TaskDto> {
    try {
      const taskDocument = await this.model.findById(id).exec();

      return this.mapper.taskDocumentMapper(taskDocument);
    } catch (error) {
      // console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async create(task: CreateTaskDto): Promise<TaskDto> {
    try {
      return new Promise<TaskDto>((resolve, reject) => {
        this.model
          .create(this.mapper.createDtoMapper(task))
          .then((taskDocument) => {
            resolve(this.mapper.taskDocumentMapper(taskDocument));
          });
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteOne(id: string): Promise<TaskDto> {
    try {
      return new Promise<TaskDto>(async (resolve, reject) => {
        await this.model
          .findByIdAndDelete(id)
          .then((t) => resolve(null))
          .catch((e) => reject(new NotFoundException('Task not found')));
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, task: UpdateTaskDto): Promise<TaskDto> {
    let taskDocument: TaskDocument;
    try {
      const updateQuery = this.mapper.updateDtoMapper(task);

      taskDocument = await this.model
        .findOneAndReplace({ _id: id }, updateQuery, {
          new: true,
          useFindAndModify: false,
        })
        .exec();
    } catch (error) {
      //console.error(error);
      throw new InternalServerErrorException();
    }

    if (!taskDocument) {
      throw new NotFoundException('Task not found'); // das geschieht ja gar nicht
    }

    return this.mapper.taskDocumentMapper(taskDocument);
  }

  async updatePartial(
    id: string,
    task: UpdatePartialTaskDto
  ): Promise<TaskDto> {
    let taskDocument: TaskDocument;

    try {
      const updateQuery = this.mapper.updateDtoMapper(task);

      taskDocument = await this.model
        .findByIdAndUpdate(id, updateQuery, {
          new: true,
        })
        .exec();
    } catch (error) {
      // console.error(error);
      throw new InternalServerErrorException();
    }

    // if (!taskDocument) {
    //   throw new NotFoundException('Task not found');
    // }

    return this.mapper.taskDocumentMapper(taskDocument);
  }
}
