import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdatePartialTaskDto,
  TaskDto,
  TaskListDto,
} from './models/dto';
import { Task, Priority, TaskDocument } from './models/task';

@Injectable()
export class TaskMapper {
  createDtoMapper(dto: CreateTaskDto) {
    try {
      return {
        description: dto.description,
        creationDate: new Date(dto.creationDate),
        completionDate: Date.parse('1970-01-01T00:00:00.000+00:00'),
        priority: dto.priority,
        completed: dto.completed,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  updateDtoMapper(dto: UpdateTaskDto | UpdatePartialTaskDto) {
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
      throw new InternalServerErrorException();
    }
  }

  taskDocumentMapper(document: TaskDocument): TaskDto {
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
      throw new InternalServerErrorException();
    }
  }

  taskDocumentsMapper(documents: TaskDocument[]): TaskListDto {
    try {
      return documents.map((document: TaskDocument) =>
        this.taskDocumentMapper(document)
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

