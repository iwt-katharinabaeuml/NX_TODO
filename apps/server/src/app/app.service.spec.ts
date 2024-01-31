// import { Test } from '@nestjs/testing';

// import { AppService } from './app.service';

// describe('AppService', () => {
//   let service: AppService;

//   beforeAll(async () => {
//     const app = await Test.createTestingModule({
//       providers: [AppService],
//     }).compile();

//     service = app.get<AppService>(AppService);
//   });

//   describe('getData', () => {
//     it('should return "Hello API"', () => {
//       expect(service.getData()).toEqual({ message: 'Hello API' });
//     });
//   });
// });

// import { Test } from '@nestjs/testing';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// describe('AppController', () => {
//   let catsController: CatsController;
//   let catsService: CatsService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//         controllers: [CatsController],
//         providers: [CatsService],
//       }).compile();

//     catsService = moduleRef.get<CatsService>(CatsService);
//     catsController = moduleRef.get<CatsController>(CatsController);
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result = ['test'];
//       jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

//       expect(await catsController.findAll()).toBe(result);
//     });
//   });
// });