import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../Model/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
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

  taskService: TaskService = inject(TaskService);
  selectedTask: Task;
  ngOnInit() {
    this.fetchAllTasks();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: '',
      desc: '',
      assignedTo: '',
      createdAt: '',
      priority: '',
      status: '',
    };
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }
  createTask(data: Task) {
    this.taskService.CreateTask(data);
  }
  fetchAllTask() {
    this.fetchAllTasks();
  }
  private fetchAllTasks() {
    // here you can subscribe to the observable with emit from getAllTasks() method
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
      },
    });
  }
  deleteTask(id: string | undefined) {
    this.taskService.deleteTask(id);
  }

  deleteAllTeask() {
    this.taskService.deleteAllTasks();
  }
  editTask(id: string | undefined) {
    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
  }
}
