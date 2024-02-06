import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  ErrorDto,
  TaskListDto,
  TaskDto,
  CreateTaskDto,
  Priority,
  UpdateTaskDto,
  UpdatePartialTaskDto,
} from './models/dto';
import { Task, TaskDocument } from './models/task';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskMapper } from './task.mapper';

class MockModel<T> {
  constructor(private data: T[] = []) {}

  find() {
    return {
      exec: async () => this.data,
    };
  }
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
        TaskMapper
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

  describe('testing GET by ID', () => {
    test('should call appService.getOne and return a task', async () => { 
      const taskId = '1'; // hier komplett überflüssig, wa ... 
      const task: TaskDto = {
        id: taskId,
        description: 'Test Task 1',
        creationDate: new Date(),
        completionDate: new Date(),
        priority: Priority.none,
        completed: false,
      };

      jest.spyOn(appService, 'getOne').mockResolvedValue(task);
      const result = await appController.getOne(taskId); // funktioniert mit jedem String 
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

  describe('testing POST', () => {
    test('should call appService.create and return the created task', async () => {
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

      const newTask: CreateTaskDto = {
        description: 'New Task',
        creationDate: new Date('2025-02-02'),
        completed: true,
        priority: Priority.high,
      };
      const result = await appController.create(newTask);

      expect(appService.create).toHaveBeenCalledWith(newTask); // überflüssig?

      expect(result).toEqual({
        id: '1',
        description: 'New Task',
        creationDate: new Date('2025-02-02'),
        completionDate: null,
        priority: Priority.high,
        completed: true,
      } as CreateTaskDto);
    });
  });
  describe('testing DELETE', () => {
    test('should call appService.deleteOne', async () => {
      jest
        .spyOn(appService, 'deleteOne')
        .mockImplementation(async (id: string) => {
          if (id === 't1h2i3s4i5s6a7n8i9d1lalala') {
            return null;
          }
        });
      const result = await appController.deleteOne(
        't1h2i3s4i5s6a7n8i9d1lalala'
      );
      expect(appService.deleteOne).toHaveBeenCalledWith(
        't1h2i3s4i5s6a7n8i9d1lalala'
      );
      expect(result).toBeNull();
    });

    test('should call appService.deleteOne not found', async () => {
      jest
        .spyOn(appService, 'deleteOne')
        .mockImplementationOnce((id: any) =>
          Promise.reject(new NotFoundException('Task not found'))
        );
      try {
        await appController.deleteOne(null);
      } catch (e) {
        expect(e.response).toEqual({
          error: 'Not Found',
          message: 'Task not found',
          statusCode: 404,
        });
      }
      expect(appService.deleteOne).toHaveBeenCalledWith(null);
    });
    test('should call appService.deleteOne null', async () => {
      jest
        .spyOn(appService, 'deleteOne')
        .mockImplementationOnce((id: any) =>
          Promise.reject(new InternalServerErrorException())
        );
      try {
        await appController.deleteOne(null);
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        });
      }
      expect(appService.deleteOne).toHaveBeenCalledWith(null);
    });
  });

  describe('testing PUT', () => {
    test('should call appService.update with correct data and return corret data', async () => {
      jest
        .spyOn(appService, 'update')
        .mockImplementation(
          async (id, newTaskafterUpdate): Promise<TaskDto> => {
            const createdTask: TaskDto = {
              id: id,
              description: newTaskafterUpdate.description,
              creationDate: newTaskafterUpdate.creationDate,
              completionDate: null,
              priority: newTaskafterUpdate.priority as Priority,
              completed: newTaskafterUpdate.completed,
            };
            return createdTask;
          }
        );
      const newTask = {
        description: 'Patched Task',
        creationDate: new Date('2025-02-02'),
        completionDate: null,
        priority: Priority.high,
        completed: true,
      };
      const result = await appController.update('1', newTask);
      expect(appService.update).toHaveBeenCalledWith('1', newTask);

      expect(result).toEqual({
        id: '1',
        description: 'Patched Task',
        creationDate: new Date('2025-02-02'),
        completionDate: null,
        priority: 'high',
        completed: true,
      });
    });

    test('should call appService.update id = null ', async () => {
      jest
        .spyOn(appService, 'update')
        .mockImplementation(
          async (id: any, newTaskafterUpdate: any): Promise<TaskDto> =>
            Promise.reject(new InternalServerErrorException())
        );
      const createdTask = {
        description: 'description',
        creationDate: new Date(),
        completionDate: null,
        priority: 'high' as Priority,
        completed: true,
      };
      try {
        await appController.update(null, createdTask);
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        } as ErrorDto);
      }
      expect(appService.update).toHaveBeenCalledWith(null, createdTask);
    });
    test('should call appService.update with missing description ', async () => {
      jest
        .spyOn(appService, 'update')
        .mockImplementation(
          async (id: any, newTaskafterUpdate: any): Promise<TaskDto> => {
            if (id && !newTaskafterUpdate.description) {
              return Promise.reject(new BadRequestException());
            }
            return Promise.resolve(null);
          }
        );

      const createdTask = {
        creationDate: new Date(),
        completionDate: null,
        priority: 'high' as Priority,
        completed: true,
        // 'description' fehlt hier bewusst
      };

      try {
        await appController.update(
          '65b7908ef6f302b2ee9e5f89',
          createdTask as any
        );
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Bad Request',
          statusCode: 400,
        } as ErrorDto);
      }

      expect(appService.update).toHaveBeenCalledWith(
        '65b7908ef6f302b2ee9e5f89',
        createdTask
      );
    });
    test('should call appService.update with incorrect id but correct id format ', async () => {
      jest
        .spyOn(appService, 'update')
        .mockImplementation(
          async (id: any, newTaskafterUpdate: any): Promise<TaskDto> => {
            if (id === '65b7908ef6f302b2ee9e5f89') {
              return Promise.reject(new NotFoundException('Task not found'));
            }
            return Promise.resolve(null);
          }
        );

      const createdTask = {
        description: 'some test description',
        creationDate: new Date(),
        completionDate: null,
        priority: 'high' as Priority,
        completed: true,
      };

      try {
        await appController.update(
          '65b7908ef6f302b2ee9e5f89',
          createdTask as any
        );
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Task not found',
          error: 'Not Found',
          statusCode: 404,
        } as ErrorDto);
      }

      expect(appService.update).toHaveBeenCalledWith(
        '65b7908ef6f302b2ee9e5f89',
        createdTask
      );
    });
  });

  describe('testing PATCH', () => {
    test('should call appService.updatePartial with correct data and return correct data', async () => {
      jest
        .spyOn(appService, 'updatePartial')
        .mockImplementation(async (id, tasksToUpdate) => {
          const beforeTask: TaskDto = {
            id: '65b7908ef6f302b2ee9effff',
            description: 'some description',
            creationDate: new Date('2025/02/02'),
            completionDate: new Date('2025/02/02'),
            priority: 'high' as Priority,
            completed: true,
          };

          return beforeTask;
        });

      const result = await appController.updatePartial(
        '65b7908ef6f302b2ee9effff',
        { description: 'some new description' } as UpdatePartialTaskDto
      );
      expect(appService.updatePartial).toHaveBeenCalledWith(
        '65b7908ef6f302b2ee9effff',
        { description: 'some new description' } as UpdatePartialTaskDto
      );
      expect(result).toEqual({
        id: '65b7908ef6f302b2ee9effff',
        description: 'some description',
        creationDate: new Date('2025/02/02'),
        completionDate: new Date('2025/02/02'),
        priority: 'high',
        completed: true,
      } as UpdatePartialTaskDto);
    });
    test('should call appService.updatePartial with incorrect id format', async () => {
      jest
        .spyOn(appService, 'updatePartial')
        .mockImplementation(async (id, tasksToUpdate) =>
          Promise.reject(new InternalServerErrorException())
        );
      const createdTask = {
        description: 'description',
        creationDate: new Date(),
        completionDate: null,
        priority: 'high' as Priority,
        completed: true,
      };
      try {
        await appController.updatePartial('IdWithFalseFormat', createdTask);
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Internal Server Error',
          statusCode: 500,
        } as ErrorDto);
      }
    });
    test('should call appService.updatePartial with incorrect data format (Boolean expected, String given) and return Bad Request', async () => {
      jest
        .spyOn(appService, 'updatePartial')
        .mockImplementation(async (id, tasksToUpdate) =>
          Promise.reject(new BadRequestException())
        );
      const createdTask = {
        completed: 'false is a string',
      } as any;
      try {
        await appController.updatePartial('id', createdTask);
      } catch (e) {
        expect(e.response).toEqual({
          message: 'Bad Request',
          statusCode: 400,
        } as ErrorDto);
      }
    });
  });
});
