import { boxAddToQueue } from '@ng-icons/boxicons/regular';
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import GanttChart from './helpers/gantt-chart.helper'; // Ensure this helper is properly typed and exported
import { AddNewTaskComponent } from './components/add-new-task/add-new-task.component';
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { GanttTasksService } from './services/gantt-tasks/gantt-tasks.service';
import Task from '../models/task.model';
@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  standalone: true,
  imports: [CommonModule, NgIcon, DialogModule],
  viewProviders: [provideIcons({ boxAddToQueue })],

  styleUrls: ['./gantt.component.css'],
})
export class GanttComponent implements AfterViewInit {
  tasks: { id: number; name: string }[] = [];
  taskDuration: { id: string; start: Date; end: Date; task: number }[] = [];

  constructor(
    private _dialog: Dialog,
    private _ganttTasksService: GanttTasksService
  ) {}

  ngAfterViewInit(): void {
    this.tasks = [
      { id: 1, name: 'Task 1' },
      { id: 2, name: 'Task 2' },
      { id: 3, name: 'Task 3' },
      { id: 4, name: 'Task 4' },
      { id: 5, name: 'Task 5' },
      { id: 6, name: 'Task 6' },
      { id: 7, name: 'Task 7' },
      { id: 8, name: 'Task 8' },
    ];
    this.taskDuration = [
      {
        id: '1',
        start: new Date('2022/1/2'),
        end: new Date('2022/1/8'),
        task: 1,
      },
      {
        id: '2',
        start: new Date('2022/1/10'),
        end: new Date('2022/1/15'),
        task: 2,
      },
      {
        id: '3',
        start: new Date('2022/1/11'),
        end: new Date('2022/1/18'),
        task: 4,
      },
    ];

    const ganttCharts = document.querySelectorAll('[role=gantt-chart]');
    ganttCharts.forEach((gantChart) => {
      GanttChart(gantChart as HTMLElement, this.tasks, this.taskDuration);
    });
  }

  openDialog(component: 'add-task') {
    const dialogRef = this._dialog.open<Task>(AddNewTaskComponent, {
      width: '250px',
      // data: { name: this.name, animal: this.animal },
    });

    dialogRef.closed.subscribe((newTask) => {
      if (newTask) {
        this._ganttTasksService.addNewTask(newTask);
        // this.tasks.push({
        //   id: this.tasks.length + 1,
        //   name: newTask,
        // });
        // this.taskDuration.push({
        //   id: (this.taskDuration.length + 1).toString(),
        //   start: new Date(),
        //   end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // add 7 days to current date
        //   task: this.tasks.length,
        // });
        // const ganttCharts = document.querySelectorAll('[role=gantt-chart]');
        // ganttCharts.forEach((gantChart) => {
        //   GanttChart(gantChart as HTMLElement, this.tasks, this.taskDuration);
        // });
      }
    });
  }
}
