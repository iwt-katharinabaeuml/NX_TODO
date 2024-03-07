export interface TaskDto {
  id: string;
  description: string;
  creationDate: Date;
  completionDate: Date;
  priority: Priority;
  completed: boolean;
}

export enum Priority {
  none = 'none',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export type TaskListDto = TaskDto[];

export interface CreateTaskDto {
  description: string;
  creationDate: Date;
  priority: Priority;
  completed: boolean;
}

export interface UpdateTaskDto {
  description: string;
  creationDate: Date;
  completionDate: Date;
  priority: Priority;
  completed: boolean;
}
