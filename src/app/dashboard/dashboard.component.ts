import { Component, inject } from '@angular/core';
import { Task } from '../Model/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }
  createTask(data: Task) {
    const headers = new HttpHeaders({ myheader: 'hello-world' });
    this.http
      .post<{ name: string }>(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks.json',
        data,
        { headers: headers }
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
