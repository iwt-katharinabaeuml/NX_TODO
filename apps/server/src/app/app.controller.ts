import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  NotFoundException,
} from '@nestjs/common';

import { AppService } from './app.service';

import {
  CreateTaskDto,
  ErrorDto,
  TaskDto,
  TaskListDto,
  UpdatePartialTaskDto,
  UpdateTaskDto,
} from './models/dto';

import { Task } from './models/task';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, isArray: true, type: TaskDto })
  @ApiResponse({ status: 404, description: 'No Tasks found', type: ErrorDto })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
    type: ErrorDto,
  })
  async getAll(): Promise<TaskListDto> {
    return this.appService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskDto })
  @ApiResponse({
    status: 404,
    description: 'No Task with this ID found',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
    type: ErrorDto,
  })
  async getOne(@Param('id') id: string): Promise<TaskDto> {
    return this.appService.getOne(id);
  }

  @Post('')
  @ApiCreatedResponse({ type: TaskDto }) //201
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorDto })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
    type: ErrorDto,
  })
  async create(@Body() newTask: CreateTaskDto): Promise<TaskDto> {
    return this.appService.create(newTask);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorDto })
  @ApiResponse({
    status: 404,
    description: 'No Task with this ID found',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
    type: ErrorDto,
  })
  async deleteOne(@Param('id') id: string): Promise<TaskDto> {
    return this.appService.deleteOne(id);
  }

  // PUT as example for the other Requests
  @Put(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorDto })
  @ApiResponse({
    status: 404,
    description: 'No Task with this ID found',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
    type: ErrorDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatedTask: UpdateTaskDto
  ): Promise<TaskDto> {
    return this.appService.update(id, updatedTask);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorDto })
  @ApiResponse({
    status: 404,
    description: 'No Task with with this ID found',
    type: ErrorDto,
  })
  // @ApiResponse({
  //   status: 409,
  //   description: 'The task could not be updated due to a conflict.',
  //   type: ErrorDto,
  // })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
    type: ErrorDto,
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() tasksToUpdate: UpdatePartialTaskDto
  ) {
    return await this.appService.updatePartial(id, tasksToUpdate);
  }
}

// https://swagger.io/tools/swagger-codegen/

//http://localhost:3300/api-docs => SwaggerUI
//
