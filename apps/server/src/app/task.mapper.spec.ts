import { Test, TestingModule } from '@nestjs/testing';
import { TaskMapper } from './task.mapper';
import {
  CreateTaskDto,
  TaskDto,
  TaskListDto,
  UpdatePartialTaskDto,
  UpdateTaskDto,
} from './models/dto';
import { Task, Priority, TaskDocument } from './models/task';
import { InternalServerErrorException } from '@nestjs/common';
import { Types, Model } from 'mongoose';
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
            provide: getModelToken('Task'),
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

    describe('taskDocumentsMapper', () => {
      test('should map array of documents to array of TaskDtos', () => {
        const id1 = new Types.ObjectId();
        const id2 = new Types.ObjectId();
        const id3 = new Types.ObjectId();
        const id4 = new Types.ObjectId();
        const documentsArray: any = [
          {
            _id: id1,
            description: 'Test Task',
            creationDate: new Date(),
            completionDate: null,
            priority: Priority.high,
            completed: true,
          },
          {
            _id: id2,
            description: 'Test Task',
            creationDate: new Date(),
            completionDate: null,
            priority: Priority.high,
            completed: false,
          },
          {
            _id: id3,
            description: 'Test Task',
            creationDate: new Date(),
            completionDate: null,
            priority: Priority.high,
            completed: true,
          },
          {
            _id: id4,
            description: 'Test Task',
            creationDate: new Date(),
            completionDate: null,
            priority: Priority.high,
            completed: false,
          },
        ];

        const mappedArray: TaskListDto = [
          {
            id: id1.toString(),
            description: documentsArray[0].description,
            creationDate: documentsArray[0].creationDate,
            completionDate: documentsArray[0].completionDate,
            priority: documentsArray[0].priority as Priority,
            completed: documentsArray[0].completed,
          },
          {
            id: id2.toString(),
            description: documentsArray[1].description,
            creationDate: documentsArray[1].creationDate,
            completionDate: documentsArray[1].completionDate,
            priority: documentsArray[1].priority as Priority,
            completed: documentsArray[1].completed,
          },
          {
            id: id3.toString(),
            description: documentsArray[2].description,
            creationDate: documentsArray[2].creationDate,
            completionDate: documentsArray[2].completionDate,
            priority: documentsArray[2].priority as Priority,
            completed: documentsArray[2].completed,
          },
          {
            id: id4.toString(),
            description: documentsArray[3].description,
            creationDate: documentsArray[3].creationDate,
            completionDate: documentsArray[3].completionDate,
            priority: documentsArray[3].priority as Priority,
            completed: documentsArray[3].completed,
          },
        ];

        const result = taskMapper.taskDocumentsMapper(documentsArray);

        expect(result).toEqual(mappedArray);
      });
      test('should throw InternalServerErrorException for null ', () => {
        try {
          taskMapper.taskDocumentMapper(null);
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
