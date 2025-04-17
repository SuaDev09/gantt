import { TestBed } from '@angular/core/testing';

import { GanttTasksService } from './gantt-tasks.service';

describe('GanttTasksService', () => {
  let service: GanttTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanttTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
