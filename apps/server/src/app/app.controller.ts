import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';

import { AppService } from './app.service';

import { CreateTaskDto, TaskDto, TaskListDto, UpdateTaskDto } from './models/dto';
import { Task } from './models/task';
import { ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}


@Get()
@ApiResponse({ status: 200, isArray: true, type: TaskDto})
async getAll():Promise<TaskDto[]> {
return this.appService.getAll();
}

@Get(':id')
@ApiResponse({ status: 200, type: TaskDto})
async getOne(@Param('id') id:string):Promise<TaskDto>{
  return this.appService.getOne(id);
}

@Post('')
@ApiResponse({ status: 201, type: TaskDto})
async create(@Body() newTask:CreateTaskDto): Promise<TaskDto>{
return this.appService.create(newTask);
}

@Delete(':id')
@ApiResponse({ status: 200, type: TaskDto})
async deleteOne(@Param('id') id: string):Promise<TaskDto> {
  return this.appService.deleteOne(id)
}

@Put(':id')
@ApiResponse({ status: 200, type: UpdateTaskDto })
async update(@Param('id') id: string, @Body() updatedTask: UpdateTaskDto): Promise<UpdateTaskDto> {
  return this.appService.update(id, updatedTask);
}

@Patch(':id')
updatePartial(@Param('id') id: string, @Body() updateTask: UpdateTaskDto): TaskDto{
      return 
}



  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }
}

// ein response model, ein request model