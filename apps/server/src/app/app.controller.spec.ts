import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken } from '@nestjs/mongoose';
import { ErrorDto, TaskListDto, TaskDto, CreateTaskDto, Priority } from './models/dto';
import { Task, TaskDocument } from './models/task';


class MockModel<T> {
  constructor(private data: T[] = []) {}

  find() {
    return {
      exec: async () => this.data,
    };
  }

  //evtl weitere Methoden ??
}

describe('Testing AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getModelToken(Task.name),
          useValue: new MockModel<TaskDocument>(),
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    appController = module.get<AppController>(AppController);
  });

  test('should mock getAll method with test data', async () => {
    jest.spyOn(appService, 'getAll').mockImplementation(async () => {
      return [
        {
          id: '1',
          description: 'Test Task 1',
          creationDate: new Date(),
          completionDate: new Date(),
          priority: Priority[Priority.none],
          completed: false,
        },
        {
          id: '2',
          description: 'Test Task 1',
          creationDate: new Date(),
          completionDate: new Date(),
          priority: Priority[Priority.none],
          completed: false,
        },
        {
          id: '3',
          description: 'Test Task 1',
          creationDate: new Date(),
          completionDate: new Date(),
          priority: Priority[Priority.none],
          completed: false,
        },
      ] as TaskListDto;
    });
    // Test durchführen
    const result = await appController.getAll();
    expect(result).toEqual([
      {
        id: '1',
        description: 'Test Task 1',
        creationDate: expect.any(Date),
        completionDate: expect.any(Date),
        priority: 'none',
        completed: false,
      },
      {
        id: '2',
        description: 'Test Task 1',
        creationDate: expect.any(Date),
        completionDate: expect.any(Date),
        priority: 'none',
        completed: false,
      },
      {
        id: '3',
        description: 'Test Task 1',
        creationDate: expect.any(Date),
        completionDate: expect.any(Date),
        priority: 'none',
        completed: false,
      },
    ]);
  });

  describe('getOne', () => {
    test('should call appService.getOne and return a task', async () => {
      const taskId = '1';
      const task: TaskDto = {
        id: taskId,
        description: 'Test Task 1',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.none,
        completed: false,
      };

      jest.spyOn(appService, 'getOne').mockResolvedValue(task);
      const result = await appController.getOne(taskId);
      expect(result).toEqual(task);
    });

    test('should throw Error when appService.getOne returns no task', async () => {
      jest.spyOn(appService, 'getOne').mockRejectedValue(new ErrorDto());
      try {
        await appController.getOne('nonexistentId');
        fail('Expected ErrorDto but method did not return an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorDto);
      }
    });

    describe('error / response testing', () => {
      test('should throw error 404, when Task not found', async () => {
        jest
          .spyOn(appService, 'getOne')
          .mockImplementation(async (id: string): Promise<any> => {
            // "any" no me gusta
            if (id === 't1h2i3s4i5s6a7n8i9d1lalala') {
              return {
                statusCode: 404,
                error: 'error',
                message: 'message',
              } as ErrorDto;
            }
          });

        const result = await appController.getOne('t1h2i3s4i5s6a7n8i9d1lalala');
        expect(result).toEqual({
          statusCode: 404,
          error: 'error',
          message: 'message',
        } as ErrorDto);
      });
    });
  });

  describe('create', () => {
    test('should call appService.create and return the created task', async () => {
      // Mocken Sie die create-Methode von appService
      jest.spyOn(appService, 'create').mockImplementation(async (newTask) => {
        const createdTask: TaskDto = {
          id: '1',
          description: newTask.description,
          creationDate: newTask.creationDate,
          completionDate: null,
          priority: newTask.priority as Priority,
          completed: newTask.completed,
        };
  
        return createdTask;
      });
  
      // Konfigurieren Sie Ihre Testdaten
      const newTask: CreateTaskDto = {
        description: 'New Task',
        creationDate: new Date('2025-02-02'),
        completed: true,
        priority: Priority.high, // kleingeschriebener Enum-Wert
      };
  
      // Führen Sie die create-Methode aus
      const result = await appController.create(newTask);
  
      // Überprüfen Sie, ob die Methode mit den erwarteten Argumenten aufgerufen wurde
      expect(appService.create).toHaveBeenCalledWith(newTask);
  
      // Erwarten Sie, dass das Ergebnis mit der erstellten Aufgabe übereinstimmt
      expect(result).toEqual({
        id: '1',
        description: 'New Task',
        creationDate: newTask.creationDate,
        completionDate: null,
        priority: Priority.high, // kleingeschriebener Enum-Wert
        completed: true,
      });
    });
  });
  
});
  

// describe('AppController', () => {
//   let app: TestingModule;

//   beforeAll(async () => {
//     app = await Test.createTestingModule({
//       controllers: [AppController],
//       providers: [AppService],
//     }).compile();
//   });

//   describe('getData', () => {
//     test('should return "Hello API"', () => {
//       const appController = app.get<AppController>(AppController);
//       expect(appController.getData()).toEqual({ message: 'Hello API' });
//     });
//   });
//   describe('getAll', ()=> {
//     test ('should return correct Data-Array', () => {
//       const appController = app.get<AppController>(AppController);
//       expect (appController.getAll()).toEqual({})
//     })
//   })
// })