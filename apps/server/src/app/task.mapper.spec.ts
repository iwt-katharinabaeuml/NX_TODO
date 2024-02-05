import { Test, TestingModule } from '@nestjs/testing';
import { TaskMapper } from './task.mapper';
import {
  CreateTaskDto,
  TaskDto,
  UpdatePartialTaskDto,
  UpdateTaskDto,
} from './models/dto';
import { Task, Priority, TaskDocument } from './models/task';
import { InternalServerErrorException } from '@nestjs/common';
import { Types, Document, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('TaskMapper', () => {
  let taskMapper: TaskMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskMapper],
    }).compile();

    taskMapper = module.get<TaskMapper>(TaskMapper);
  });

  describe('createDtoMapper', () => {
    test('should map CreateTaskDto', () => {
      const createTaskDto: CreateTaskDto = {
        description: 'Test Task',
        creationDate: new Date('2022-01-01T12:00:00.000Z'),
        priority: Priority.high,
        completed: false,
      };

      const result = taskMapper.createDtoMapper(createTaskDto);

      expect(result).toEqual({
        description: 'Test Task',
        creationDate: new Date('2022-01-01T12:00:00.000Z'),
        completionDate: Date.parse('1970-01-01T00:00:00.000+00:00'),
        priority: Priority.high,
        completed: false,
      } as CreateTaskDto);
    });
    test('should throw InternalServerErrorException for null', () => {
      try {
        taskMapper.createDtoMapper(null);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('updateDtoMapper', () => {
    test('should map UpdateTaskDto ', () => {
      const updateTaskDto: UpdateTaskDto | UpdatePartialTaskDto = {
        description: 'Test Task',
        creationDate: new Date('2022-01-01T12:00:00.000Z'),
        completionDate: new Date('2077-02-02'),
        priority: Priority.high,
        completed: false,
      };
      const result = taskMapper.updateDtoMapper(updateTaskDto);

      expect(result).toEqual({
        description: 'Test Task',
        creationDate: new Date('2022-01-01T12:00:00.000Z'),
        completionDate: new Date('2077-02-02'),
        priority: Priority.high,
        completed: false,
        $inc: { _version: 1 },
      });
    });
    test('should throw InternalServerErrorException for null', () => {
      try {
        taskMapper.updateDtoMapper(null);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('TaskMapper', () => {
    let taskMapper: TaskMapper;
    let TaskModelMock: Model<Task>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TaskMapper,
          {
            provide: getModelToken('Task'), // Stellen Sie sicher, dass dies der korrekte Token ist
            useValue: {
              findById: jest.fn(),
            },
          },
        ],
      }).compile();

      taskMapper = module.get<TaskMapper>(TaskMapper);
      TaskModelMock = module.get<Model<Task>>(getModelToken('Task'));
    });

    describe('taskDocumentMapper', () => {
      test('should map TaskDocument to TaskDto', async () => {
        const taskId = new Types.ObjectId();
        const validTaskDocument: any = {
          _id: taskId,
          description: 'Test Task',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: false,
        };
        jest
          .spyOn(TaskModelMock, 'findById')
          .mockResolvedValueOnce(validTaskDocument as TaskDocument);

        const result: TaskDto =
          taskMapper.taskDocumentMapper(validTaskDocument);

        expect(result).toEqual({
          id: taskId.toString(),
          description: 'Test Task',
          creationDate: validTaskDocument.creationDate,
          completionDate: validTaskDocument.completionDate,
          priority: Priority.high,
          completed: false,
        } as TaskDto);
      });
    });
  });
});
