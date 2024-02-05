import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Priority, Task } from './models/task';
import { Model, Types } from 'mongoose';
import { TaskDto, TaskListDto } from './models/dto';
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
    it('should return data in the correct format', async () => {
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
    const id1 = new Types.ObjectId();

    const id2 = new Types.ObjectId();

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
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);

    jest.spyOn(mapper, 'taskDocumentsMapper').mockImplementation(() => {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        statusCode: 500,
      });
    });

    // Act
    try {
      const result: Task[] = await service.getAll();
    } catch (e) {
      // Assert
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

    // Act
    try {
      const result: Task[] = await service.getAll();
    } catch (e) {
      // Assert
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
      }as TaskDto
  
      const expected = {
        id: validId.toString(),
        description: 'Task 1',
        creationDate: new Date(),
        completionDate: null,
        priority: Priority.high,
        completed: false,
      } as TaskDto;
  
   
      jest.spyOn(TaskModelMock,'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedTasksDataBaseForReturning),
      } as any);
  

      jest.spyOn(mapper, 'taskDocumentMapper').mockReturnValueOnce(expected);

      const result: TaskDto = await service.getOne(validId.toString());
      console.log('thats the result', result)
  
      expect(result).toEqual(expected);
     
    });
  });
});

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
