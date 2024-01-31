import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken } from '@nestjs/mongoose';
import { TaskListDto } from './models/dto';
import { Task, TaskDocument } from './models/task';

class MockModel<T> {
  constructor(private data: T[] = []) {}

  find() {
    return {
      exec: async () => this.data,
    };
  }

  // Fügen Sie weitere Methoden hinzu, die Sie für Ihre Tests benötigen
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
          useValue: new MockModel<TaskDocument>(), // Hier verwenden Sie TaskDocument
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    appController = module.get<AppController>(AppController);
  });

  test('should mock getAll method with test data', async () => {
    // Mocken Sie die getAll-Methode von appService
    jest.spyOn(appService, 'getAll').mockImplementation(async () => {
      return [
        {
          id: '1',
          description: 'Test Task 1',
          creationDate: new Date(),
          completionDate: new Date(),
          priority: 'none',
          completed: false,
        },
      ] as TaskListDto;
    });
    // Führen Sie den Test durch
    const result = await appController.getAll();

    // Hier können Sie Ihre Jest-Assertions für das Ergebnis durchführen
    expect(result).toEqual([
      {
        id: '1',
        description: 'Test Task 1',
        creationDate: expect.any(Date),
        completionDate: null,
        priority: 'none',
        completed: false,
      },
      // Fügen Sie weitere Assertions hinzu
    ]);
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
//     it('should return "Hello API"', () => {
//       const appController = app.get<AppController>(AppController);
//       expect(appController.getData()).toEqual({ message: 'Hello API' });
//     });
//   });
//   describe('getAll', ()=> {
//     it ('should return correct Data-Array', () => {
//       const appController = app.get<AppController>(AppController); 
//       expect (appController.getAll()).toEqual({})
//     })
//   })
// });
