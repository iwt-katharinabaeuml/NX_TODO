import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Priority, Task } from './models/task';
import { Model, Types } from 'mongoose';
import { TaskDto, TaskListDto } from './models/dto';

describe('AppService', () => {
  let service: AppService;
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
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    TaskModelMock = module.get<Model<Task>>(getModelToken('Task'));
  });

  describe('getAll', () => {
    it('should return data in the correct format', async () => {
      const id1 = new Types.ObjectId();

      const id2 = new Types.ObjectId();
      // Arrange
      const mockedTasksDataBaseForReturning: any = [
        {
          _id: id1, // Mock a valid ObjectId
          description: 'Task 1',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: false,
        },
        {
          _id: id2, // Mock another valid ObjectId
          description: 'Task 2',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: true,
        },
      ];

      const expected = [
        {
          id: id1.toString(), // Mock a valid ObjectId
          description: 'Task 1',
          creationDate: new Date(),
          completionDate: null,
          priority: Priority.high,
          completed: false,
        },
        {
          id: id2.toString(), // Mock another valid ObjectId
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
      
      // Act
      const result: Task[] = await service.getAll();
      // Assert
      expect(result).toEqual(expected);
      expect(TaskModelMock.find).toHaveBeenCalled();
      expect(TaskModelMock.find().exec).toHaveBeenCalled();
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
//   }
