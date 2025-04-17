import { Injectable } from '@angular/core';
import Task from '../../../models/task.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GanttTasksService {
  private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  currentTasks$ = this._tasks.asObservable();

  constructor() {}

  get getTasks(): Promise<Task[]> {
    return firstValueFrom(this._tasks);
  }

  set setTasks(tasks: Task[]) {
    this._tasks.next(tasks);
  }

  async addNewTask(task: Task) {
    this._tasks.next([...(await this.getTasks), task]);
  }
}
