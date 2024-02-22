export class Task {
  constructor(
    public id: string,
    public description: string,
    public creationDate: Date,
    public completionDate: Date,
    public priority: string,
    public completed: boolean
  ) {}
}
