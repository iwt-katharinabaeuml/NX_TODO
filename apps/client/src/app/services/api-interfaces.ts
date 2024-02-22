export interface TaskDto {
    id: string;
    description: string;
    creationDate: Date;
    completionDate: Date;
    priority: Priority
    completed: boolean;
  }

  export enum Priority {
    none = 'none',
    low = 'low',
    medium = 'medium',
    high = 'high',
  }

  
export type TaskListDto = TaskDto[];
