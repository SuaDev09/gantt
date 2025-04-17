import { Component, inject } from '@angular/core';
import Task from '../../../models/task.model';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-new-task',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-new-task.component.html',
  styleUrls: [
    './add-new-task.component.css',
    '../../../../shared/styles/dialog.style.css',
  ],
})
export class AddNewTaskComponent {
  _currentDate: Date = new Date();
  dialogRef = inject<DialogRef<Task>>(DialogRef<Task>);
  taskName: string = '';

  task: Task = {
    id: 0,
    name: 'task',
    start: this._currentDate,
    end: new Date(this._currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Add 7 days
  };

  // Getter and setter for startDate
  get startDate(): string {
    return this.formatDate(this.task.start);
  }

  set startDate(value: string) {
    this.task.start = new Date(value);
  }

  // Getter and setter for endDate
  get endDate(): string {
    return this.formatDate(this.task.end);
  }

  set endDate(value: string) {
    this.task.end = new Date(value);
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
