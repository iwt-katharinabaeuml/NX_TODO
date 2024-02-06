import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Priority, Task, TaskDocument } from './models/task';
import { Model, Types } from 'mongoose';
import { CreateTaskDto, TaskDto, TaskListDto } from './models/dto';
import { TaskMapper } from './task.mapper';
import { InternalServerErrorException } from '@nestjs/common';

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

  describe('getOne', () => {
    test('should return data in correct format for valid ID', async () => {
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
      console.log('thats the result', result);

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
});

//   test('should call appService.deleteOne null', async () => {
//     jest
//       .spyOn(appService, 'deleteOne')
//       .mockImplementationOnce((id: any) =>
//         Promise.reject(new InternalServerErrorException())
//       );
//     try {
//       await appController.deleteOne(null);
//     } catch (e) {
//       expect(e.response).toEqual({
//         message: 'Internal Server Error',
//         statusCode: 500,
//       });
//     }
//     expect(appService.deleteOne).toHaveBeenCalledWith(null);
//   });

// @Injectable()
// export class AppService {
//   constructor(@InjectModel(Task.name) private model: Model<Task>) {}

//   async getAll(): Promise<TaskListDto> {
//     try {
//       const taskDocuments = await this.model.find().exec();

//       return taskDocuments.map((taskDocument) =>
//         this.taskDocumentMapper(taskDocument)
//       );
//     } catch (error) {
//       console.error(error);
//       throw new InternalServerErrorException();
//     }
