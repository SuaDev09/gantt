import { Component, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  dependencies?: string[];
}

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  standalone: true,
  imports: [CommonModule, DragDropModule],

  styleUrls: ['./gantt.component.css'],
})
export class GanttComponent implements OnInit {
  @Input() tasks: GanttTask[] = [];

  cellWidth = 50;
  dateRange: Date[] = [];

  ngOnInit() {
    this.tasks = [
      {
        id: '1',
        name: 'Task 1',
        start: new Date('2023-10-01'),
        end: new Date('2023-10-05'),
        dependencies: [],
      },
      {
        id: '2',
        name: 'Task 2',
        start: new Date('2023-10-03'),
        end: new Date('2023-10-07'),
        dependencies: ['1'],
      },
      {
        id: '3',
        name: 'Task 3',
        start: new Date('2023-10-06'),
        end: new Date('2023-10-10'),
        dependencies: ['2'],
      },
    ];
    this.buildDateRange();
  }

  buildDateRange() {
    const start = new Date(
      Math.min(...this.tasks.map((t) => t.start.getTime()))
    );
    const end = new Date(Math.max(...this.tasks.map((t) => t.end.getTime())));
    const range: Date[] = [];

    const date = new Date(start);
    while (date <= end) {
      range.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    console.log('Date Range:', range);
    this.dateRange = range;
  }

  getBarStyle(task: GanttTask) {
    const startIndex = this.dateRange.findIndex(
      (d) => d.toDateString() === task.start.toDateString()
    );
    const duration =
      (task.end.getTime() - task.start.getTime()) / (1000 * 3600 * 24);
    return {
      left: `${startIndex * this.cellWidth}px`,
      width: `${duration * this.cellWidth}px`,
    };
  }

  getTaskPosition(task: GanttTask) {
    const startIndex = this.dateRange.findIndex(
      (d) => d.toDateString() === task.start.toDateString()
    );
    return { x: startIndex * this.cellWidth, y: 0 };
  }

  onDragEnded(event: CdkDragEnd, task: GanttTask) {
    const totalX = event.source.getFreeDragPosition().x;
    const snappedX = Math.round(totalX / this.cellWidth) * this.cellWidth;
    const daysMoved = Math.round(snappedX / this.cellWidth);

    const newStart = new Date(task.start);
    newStart.setDate(newStart.getDate() + daysMoved);

    const duration =
      (task.end.getTime() - task.start.getTime()) / (1000 * 3600 * 24);
    const newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + duration);

    const latestDepEnd = this.getLatestDependencyEnd(task);
    const earliestDependentStart = this.getEarliestDependentStart(task);

    if (
      (!latestDepEnd || newStart >= latestDepEnd) &&
      (!earliestDependentStart || newEnd <= earliestDependentStart)
    ) {
      task.start = newStart;
      task.end = newEnd;
    }
    this.buildDateRange();

    event.source._dragRef.reset();
  }

  onResizeEnded(event: CdkDragEnd, task: GanttTask, edge: 'start' | 'end') {
    const deltaX = event.distance.x;
    const daysMoved = Math.round(deltaX / this.cellWidth);

    if (edge === 'start') {
      const newStart = new Date(task.start);
      newStart.setDate(newStart.getDate() + daysMoved);

      const latestDepEnd = this.getLatestDependencyEnd(task);
      if (newStart < task.end && (!latestDepEnd || newStart >= latestDepEnd)) {
        task.start = newStart;
      }
    } else {
      const newEnd = new Date(task.end);
      newEnd.setDate(newEnd.getDate() + daysMoved);

      const earliestDependentStart = this.getEarliestDependentStart(task);
      if (
        newEnd > task.start &&
        (!earliestDependentStart || newEnd <= earliestDependentStart)
      ) {
        task.end = newEnd;
      }
    }
    this.buildDateRange();

    event.source._dragRef.reset();
  }

  getLatestDependencyEnd(task: GanttTask): Date | null {
    if (!task.dependencies?.length) return null;

    const depEndDates = task.dependencies
      .map((id) => this.tasks.find((t) => t.id === id))
      .filter((t) => !!t)
      .map((t) => t!.end);

    return depEndDates.length
      ? new Date(Math.max(...depEndDates.map((d) => d.getTime())))
      : null;
  }

  getEarliestDependentStart(task: GanttTask): Date | null {
    const dependents = this.tasks.filter((t) =>
      t.dependencies?.includes(task.id)
    );
    const startDates = dependents.map((t) => t.start);

    return startDates.length
      ? new Date(Math.min(...startDates.map((d) => d.getTime())))
      : null;
  }

  getDependencyPaths(task: GanttTask): { path: string }[] {
    const paths: any[] = [];

    if (task.dependencies?.length) {
      task.dependencies.forEach((depId) => {
        const dep = this.tasks.find((t) => t.id === depId);
        if (!dep) return;

        const startX =
          this.dateRange.findIndex(
            (d) => d.toDateString() === dep.end.toDateString()
          ) *
            this.cellWidth +
          this.cellWidth;
        const endX =
          this.dateRange.findIndex(
            (d) => d.toDateString() === task.start.toDateString()
          ) * this.cellWidth;
        const startY = this.tasks.indexOf(dep) * 40 + 24;
        const endY = this.tasks.indexOf(task) * 40 + 24;
        const midX = (startX + endX) / 2;

        const path = `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`;
        paths.push({ path });
      });
    }

    return paths;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  onClick() {
    console.log('Clicked', this.tasks);
  }
}
