import { Component } from '@angular/core';
import { GanttComponent } from './features/gantt/gantt.component';

@Component({
  selector: 'app-root',
  imports: [GanttComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ng-gantt';
}
