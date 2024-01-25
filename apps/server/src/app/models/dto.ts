import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty()
    description: string;
    
    @ApiProperty()
    creationDate: Date;
    
    @ApiProperty()
    priority: string;

    @ApiProperty()
    completed: boolean;
}

export class UpdateTaskDto {
    @ApiProperty()
    description: string;
    
    @ApiProperty()
    creationDate: Date;

    @ApiProperty()
    completionDate: Date;

    @ApiProperty()
    priority: string;
    
    @ApiProperty()
    completed: boolean;
}

export class TaskDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    creationDate: Date;
    
    @ApiProperty()
    completionDate: Date;
    
    @ApiProperty()
    priority: string;
    
    @ApiProperty()
    completed: boolean;
}

export type TaskListDto = TaskDto[];