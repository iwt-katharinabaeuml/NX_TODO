import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Priority, Task, TaskDocument } from './models/task';
import { Model, Types } from 'mongoose';
import {
  CreateTaskDto,
  TaskDto,
  TaskListDto,
  UpdatePartialTaskDto,
  UpdateTaskDto,
} from './models/dto';
import { TaskMapper } from './task.mapper';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('AppService', () => {
  let service: AppService;
  let mapper: TaskMapper;
  let TaskModelMock: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken('Task'),
          useValue: {
            find: jest.fn(),
            exec: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findOneAndReplace: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        TaskMapper,
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    mapper = module.get<TaskMapper>(TaskMapper);
    TaskModelMock = module.get<Model<Task>>(getModelToken('Task'));
  });

  describe('getAll', () => {
    test('should return data in the correct format', async () => {
      const id1 = new Types.ObjectId();

      const id2 = new Types.ObjectId();

      const mockedTasksDataBaseForReturning: any = [
        {
          _id: id1,
          description: 'Task 1',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: false,
        },
        {
          _id: id2,
          description: 'Task 2',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: true,
        },
      ];

      const expected = [
        {
          id: id1.toString(),
          description: 'Task 1',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: false,
        },
        {
          id: id2.toString(),
          description: 'Task 2',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: true,
        },
      ] as TaskListDto;

      jest.spyOn(TaskModelMock, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedTasksDataBaseForReturning),
      } as any);

      jest.spyOn(mapper, 'taskDocumentsMapper').mockReturnValueOnce(expected);

      const result: Task[] = await service.getAll();

      expect(result).toEqual(expected);
    });

    test('should return an error', async () => {
      jest.spyOn(TaskModelMock, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      jest.spyOn(mapper, 'taskDocumentsMapper').mockImplementation(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });

      try {
        const result: Task[] = await service.getAll();
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });

    test('should return an error #2', async () => {
      const id1 = null;

      const id2 = new Types.ObjectId();

      const mockedTasksDataBaseForReturning: any = [
        {
          _id: id1,
          description: 'Task 1',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: false,
        },
        {
          _id: id2,
          description: 'Task 2',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: true,
        },
      ];

      jest.spyOn(TaskModelMock, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedTasksDataBaseForReturning),
      } as any);

      jest.spyOn(mapper, 'taskDocumentsMapper').mockImplementation(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });

      try {
        const result: Task[] = await service.getAll();
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });
  });

  describe('getOne', () => {
    test('should return data in correct format', async () => {
      const validId = new Types.ObjectId();

      const mockedTasksDataBaseForReturning = {
        id: validId.toString(),
        description: 'Task 1',
        creationDate: new Date(),
        completionDate: null,
        priority: Priority.high,
        completed: true,
      } as TaskDto;

      const expected = {
        id: validId.toString(),
        description: 'Task 1',
        creationDate: new Date(),
        completionDate: null,
        priority: Priority.high,
        completed: false,
      } as TaskDto;

      jest.spyOn(TaskModelMock, 'findById').mockReturnValueOnce({
        // keine Möglichkeit Id anzugeben
        exec: jest.fn().mockResolvedValueOnce(mockedTasksDataBaseForReturning),
      } as any);

      jest.spyOn(mapper, 'taskDocumentMapper').mockReturnValueOnce(expected);

      const result: TaskDto = await service.getOne(validId.toString()); // Id völlig egal --> how to change? need to change?

      expect(result).toEqual(expected);
    });
    test('should return new InternalErrorExpectation ', async () => {
      jest.spyOn(TaskModelMock, 'findById').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce(new InternalServerErrorException()),
      } as any);

      try {
        await service.getOne(null);
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });
  });
  describe('create', () => {
    test('should create Task in correct Format', async () => {
      // do not touch this test

      const mockedCreateTaskDto: CreateTaskDto = {
        description: 'description',
        creationDate: new Date(),
        priority: 'high' as any,
        completed: true,
      };

      const expectedTaskDocument = {
        _id: new Types.ObjectId(),
        description: 'description',
        creationDate: new Date(),
        priority: 'high' as any,
        completed: true,
      };

      const expectedTaskDto: TaskDto = {
        id: expectedTaskDocument._id.toString(),
        description: 'description',
        creationDate: new Date(),
        completionDate: null,
        priority: 'high' as any,
        completed: true,
      };

      jest
        .spyOn(TaskModelMock, 'create')
        .mockResolvedValueOnce(expectedTaskDocument as any); // das wird dann ja kaum getestet wa?

      jest
        .spyOn(mapper, 'taskDocumentMapper')
        .mockReturnValueOnce(expectedTaskDto);

      const result: TaskDto = await service.create(mockedCreateTaskDto);

      expect(result).toEqual(expectedTaskDto); // hier evtl den Task ausschreiben? Type?
    });

    test('should throw error because of mapper internal server error', async () => {
      const mockedCreateTaskDto: CreateTaskDto = {
        description: 'description',
        creationDate: new Date(),
        priority: Priority.high,
        completed: true,
      };

      const expectedTaskDocument = {
        _id: new Types.ObjectId(),
        description: 'description',
        creationDate: new Date(),
        priority: Priority.high,
        completed: true,
      };
      jest
        .spyOn(TaskModelMock, 'create')
        .mockResolvedValueOnce(expectedTaskDocument as any);
      jest.spyOn(mapper, 'createDtoMapper').mockImplementationOnce(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });

      try {
        const result: CreateTaskDto = await service.create(mockedCreateTaskDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });

    test('should throw error because of mapper / null ', async () => {
      const mockedCreateTaskDto: CreateTaskDto = {
        description: 'description',
        creationDate: new Date(),
        priority: Priority.high,
        completed: true,
      };

      jest.spyOn(TaskModelMock, 'create').mockResolvedValueOnce(null);
      jest.spyOn(mapper, 'createDtoMapper').mockImplementationOnce(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });

      try {
        const result: CreateTaskDto = await service.create(mockedCreateTaskDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });
  });

  describe('put / update', () => {
    test('should update task and return updated task', async () => {
      const id = 'task-id';
      const updateTaskDto: UpdateTaskDto = {
        description: 'updated description',
        creationDate: new Date('2088/02/02'),
        completed: true,
        completionDate: new Date('2077/02/02'),
        priority: Priority.high,
      };

      const updatedTaskDocument = {
        _id: 'task-id',
        description: 'updated description',
        creationDate: new Date('2088/02/02'),
        completionDate: new Date('2077/02/02'),
        priority: Priority.high,
        completed: true,
      };
      const expectedTaskDto: TaskDto = {
        id: updatedTaskDocument._id,
        description: updatedTaskDocument.description,
        creationDate: updatedTaskDocument.creationDate,
        completionDate: updatedTaskDocument.completionDate,
        priority: updatedTaskDocument.priority,
        completed: updatedTaskDocument.completed,
      };
      jest
        .spyOn(mapper, 'updateDtoMapper')
        .mockReturnValueOnce(expectedTaskDto as any);
      jest
        .spyOn(mapper, 'taskDocumentMapper')
        .mockReturnValueOnce(expectedTaskDto);

      jest.spyOn(TaskModelMock, 'findOneAndReplace').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(updatedTaskDocument),
      } as any);

      const result: TaskDto = await service.update(id, updateTaskDto); // id-value total irrelevant

      expect(mapper.updateDtoMapper).toHaveBeenCalledWith(updateTaskDto); // überprüfen, dass der Mapper auch wirklich aufgrufen wurde; Funktion in seperatem File geprüft
      expect(mapper.taskDocumentMapper).toHaveBeenCalledWith(
        updatedTaskDocument
      ); // überprüfen, dass der Mapper auch wirklich aufgrufen wurde; Funktion in seperatem File geprüft
      expect(result).toEqual(expectedTaskDto);
    });
    test('should return Internal Server Error Mapping', async () => {
      const id = 'task-id';
      const updateTaskDto: UpdateTaskDto = {
        description: 'updated description',
        creationDate: new Date('2088/02/02'),
        completed: true,
        completionDate: new Date('2077/02/02'),
        priority: Priority.high,
      };

      //   jest.spyOn(TaskModelMock, 'findOneAndReplace').mockReturnValueOnce({
      //     exec: jest.fn().mockResolvedValueOnce(null),
      //   } as any);

      jest.spyOn(mapper, 'updateDtoMapper').mockImplementation(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });

      try {
        const result: TaskDto = await service.update(id, updateTaskDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });
    test('should return Internal Server Error / null', async () => {
      // sinnfrei?
      const updateTaskDto: UpdateTaskDto = {
        description: 'updated description',
        creationDate: new Date('2088/02/02'),
        completed: true,
        completionDate: new Date('2077/02/02'),
        priority: Priority.high,
      };

      // jest.spyOn(TaskModelMock, 'findOneAndReplace').mockReturnValueOnce({
      //   exec: jest.fn().mockResolvedValueOnce(updateTaskDto),
      // } as any);

      jest.spyOn(mapper, 'updateDtoMapper').mockImplementation(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });

      try {
        const result: TaskDto = await service.update(null, null);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });
  });
  describe('patch / updatePartial', () => {
    test('should update task partially and return updated task correctly', async () => {
      const id = 'task-id';
      const updatePartialTaskDto: UpdatePartialTaskDto = {
        description: 'updated description',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.high,
        completed: true,
      };
      const updatedTaskDocument = {
        _id: id,
        description: 'updated description',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.high,
        completed: true,
        $inc: { _version: 1 },
      };
      const expectedTaskDto: TaskDto = {
        id: updatedTaskDocument._id,
        description: updatedTaskDocument.description,
        creationDate: updatedTaskDocument.creationDate,
        completionDate: updatedTaskDocument.completionDate,
        priority: updatedTaskDocument.priority,
        completed: updatedTaskDocument.completed,
      };
      jest
        .spyOn(mapper, 'updateDtoMapper')
        .mockReturnValue(updatePartialTaskDto as any);
      jest.spyOn(TaskModelMock, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(updatedTaskDocument),
      } as any);

      const result: TaskDto = await service.updatePartial(
        id,
        updatePartialTaskDto
      );

      expect(result).toEqual(expectedTaskDto);
      expect(mapper.updateDtoMapper).toHaveBeenCalledWith(updatePartialTaskDto);
      expect(TaskModelMock.findByIdAndUpdate).toHaveBeenCalled();
    });
    test('should throw Internal Server Error because of updateDtoMapper', async () => {
      const updatePartialTaskDto: UpdatePartialTaskDto = {
        description: 'updated description',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.high,
        completed: true,
      };

      jest.spyOn(mapper, 'updateDtoMapper').mockImplementationOnce(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });
      jest.spyOn(TaskModelMock, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      try {
        await service.updatePartial('id', updatePartialTaskDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
    });
    test('should throw Internal Server Error because of taskDocumentMapper', async () => {
      const updatePartialTaskDto: UpdatePartialTaskDto = {
        description: 'updated description',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.high,
        completed: true,
      };
      const updatedTaskDocument = {
        _id: 'id',
        description: 'updated description',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.high,
        completed: true,
        $inc: { _version: 1 },
      };
      jest
        .spyOn(mapper, 'updateDtoMapper')
        .mockReturnValue(updatePartialTaskDto as any);

      jest.spyOn(TaskModelMock, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(updatedTaskDocument),
      } as any);

      jest.spyOn(mapper, 'taskDocumentMapper').mockImplementationOnce(() => {
        throw new InternalServerErrorException({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      });
      
      try {
        await service.updatePartial('id', updatePartialTaskDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
      expect(mapper.updateDtoMapper).toHaveBeenCalledWith(updatePartialTaskDto);
      expect(TaskModelMock.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
});
