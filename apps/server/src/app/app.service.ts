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

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  async getAll(): Promise<TaskListDto> {
    try {
      const taskDocuments = await this.model.find().exec();

      return taskDocuments.map((taskDocument) =>
        this.taskDocumentMapper(taskDocument)
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOne(id: string): Promise<TaskDto> {
    try {
      const taskDocument = await this.model.findById(id).exec();

      return this.taskDocumentMapper(taskDocument);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async create(task: CreateTaskDto): Promise<TaskDto> {
    try {
      return new Promise<TaskDto>((resolve, reject) => {
        this.model.create(this.createDtoMapper(task)).then((taskDocument) => {
          resolve(this.taskDocumentMapper(taskDocument));
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
      const updateQuery = this.updateDtoMapper(task);

      taskDocument = await this.model
        .findOneAndReplace({ _id: id }, updateQuery, {
          new: true,
          useFindAndModify: false,
        })
        .exec();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }

    if (!taskDocument) {
      throw new NotFoundException('Task not found');
    }

    return this.taskDocumentMapper(taskDocument);
  }

  async updatePartial(
    id: string,
    task: UpdatePartialTaskDto
  ): Promise<TaskDto> {
    let taskDocument: TaskDocument;

    try {
      const updateQuery = this.updateDtoMapper(task);

      taskDocument = await this.model
        .findByIdAndUpdate(id, updateQuery, {
          new: true,
        })
        .exec();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }

    if (!taskDocument) {
      throw new NotFoundException('Task not found');
    }

    return this.taskDocumentMapper(taskDocument);
  }

  private createDtoMapper(dto: CreateTaskDto) {
    try {
      return {
        description: dto.description,
        creationDate: new Date(dto.creationDate),
        completionDate: Date.parse('1970-01-01T00:00:00.000+00:00'),
        priority: dto.priority,
        completed: dto.completed,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  private updateDtoMapper(dto: UpdateTaskDto | UpdatePartialTaskDto) {
    try {
      return {
        description: dto.description,
        creationDate: dto.creationDate ? new Date(dto.creationDate) : undefined,
        completionDate: dto.completionDate
          ? new Date(dto.completionDate)
          : undefined,
        priority: dto.priority,
        completed: dto.completed,
        $inc: { _version: 1 },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  private taskDocumentMapper(
    document: Task & { _id: Types.ObjectId }
  ): TaskDto {
    try {
      return {
        id: document['_id'].toString(),
        description: document.description,
        creationDate: document.creationDate,
        completionDate: document.completionDate,
        priority: document.priority as Priority,
        completed: document.completed,
      } as TaskDto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
