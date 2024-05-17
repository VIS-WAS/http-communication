import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Task } from 'src/app/Model/task';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent {
  @Output()
  CloseDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  currentTask: Task | null = null;

  taskService: TaskService = inject(TaskService);

  ngAfterViewInit() {
    console.log(this.currentTask);
    // this.taskService.getTaskDetails().subscribe();
  }
  onCloseDetail() {
    this.CloseDetailView.emit(false);
  }
}
