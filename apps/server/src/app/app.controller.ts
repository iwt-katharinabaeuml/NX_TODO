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
  UpdateTaskDto
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
  @ApiResponse({ status: 404, description: 'No Tasks found' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  async getAll(): Promise<TaskListDto> {
    return this.appService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskDto })
  @ApiNotFoundResponse({})
  //@ApiResponse({ status: 404, description: "No Task with this ID found"})
  @ApiResponse({ status: 500, description: 'internal server error' })
  async getOne(@Param('id') id: string): Promise<TaskDto> {
    return this.appService.getOne(id);
  }

  @Post('')
  @ApiCreatedResponse({ type: TaskDto }) //201


  //@ApiResponse({ status: 400,  isArray: true, })
  

  @ApiResponse({ status: 500, description: 'internal server error' })
  async create(@Body() newTask: CreateTaskDto): Promise<TaskDto> {
    return this.appService.create(newTask);
  }



  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  //@ApiResponse({ status: 400, description: "Bad Request"})
  //@ApiResponse({ status: 404, description: "No Task with with ID found"})
  @ApiResponse({ status: 500, description: 'internal server error' })
  async deleteOne(@Param('id') id: string): Promise<TaskDto> {
    return this.appService.deleteOne(id);
  }



  @Put(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiResponse({ status: 400, description: "Bad Request", type: ErrorDto})
  @ApiResponse({ status: 404, description: 'No Task with this ID found', type: ErrorDto })
  @ApiResponse({ status: 500, description: 'internal server error', type: ErrorDto })
  async update(
    @Param('id') id: string,
    @Body() updatedTask: UpdateTaskDto
  ): Promise<TaskDto> {
    return this.appService.update(id, updatedTask);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  //@ApiResponse({ status: 400, description: "Bad Request"})
  @ApiResponse({ status: 404, description: 'No Task with with this ID found' })
  @ApiResponse({
    status: 409,
    description: 'The task could not be updated due to a conflict.',
  })
  @ApiResponse({ status: 500, description: 'internal server error' })
  async updatePartial(
    @Param('id') id: string,
    @Body() tasksToUpdate: UpdatePartialTaskDto
  ): Promise<TaskDto> {
    return this.appService.updatePartial(id, tasksToUpdate);
  }
}

// ein response model, ein request model

// ERROR-Model für 404, ggf. Array an Messages
// https://swagger.io/tools/swagger-codegen/

//http://localhost:3300/api-docs => SwaggerUI
//
