import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../Model/task';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Subscription, map } from 'rxjs';
import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  editMode: boolean = false;

  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);

  allTasks: Task[] = [];

  currentTaskId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  taskService: TaskService = inject(TaskService);
  selectedTask: Task;

  errSub: Subscription;
  ngOnInit() {
    this.fetchAllTasks();
    this.errSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      },
    });
  }

  ngOnDestroy() {
    this.errSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: '',
      description: '',
      assignedTo: '',
      createAt: '',
      priority: '',
      status: '',
    };
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }
  createOrUpdateTask(data: Task) {
    if (!this.editMode) {
      this.taskService.CreateTask(data);
    } else {
      this.taskService.updateTask(this.currentTaskId, data);
    }
  }
  fetchAllTask() {
    this.fetchAllTasks();
  }
  private fetchAllTasks() {
    this.isLoading = true;
    // here you can subscribe to the observable with emit from getAllTasks() method
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
      },
      error: (err) => {
        this.setErrorMessage(err);
        this.isLoading = false;
      },
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    if (err.error.error === 'Permission denied') {
      this.errorMessage = 'You do not have permission to perform this action';
    } else if (err.error.error === '404 Not Found') {
      this.errorMessage =
        'Not able to create right now. Please try again later';
    } else {
      this.errorMessage = err.message;
    }
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
  deleteTask(id: string | undefined) {
    this.taskService.deleteTask(id);
  }

  deleteAllTeask() {
    this.taskService.deleteAllTasks();
  }
  editTask(id: string | undefined) {
    this.currentTaskId = id;
    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
  }

  infoClicked: boolean = false;

  currentTask: Task | null = null;
  onInfoClicked(taskID: string | undefined) {
    this.infoClicked = true;
    this.taskService.getTaskDetails(taskID).subscribe({
      next: (data: Task) => {
        this.currentTask = data;
      },
    });
  }
  infoClosed(action) {
    this.infoClicked = action;
  }
}
