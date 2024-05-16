import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../Model/task';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  http: HttpClient = inject(HttpClient);

  errorSubject = new Subject<HttpErrorResponse>();

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ myheader: 'hello-world' });
    this.http
      .post<{ name: string }>(
        'https://angularhttpclient-dfddsd1cb37-default-rtdb.firebaseio.com/tasks.json',
        task,
        { headers: headers }
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }

  deleteTask(id: string | undefined) {
    this.http
      .delete(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks/' +
          id +
          '.json'
      )
      .subscribe({
        next: (response) => {},
        error: (err) => {
          this.errorSubject.next(err);
        },
        complete() {
          alert(
            'Selected record is deleted...! Please click on FetchTask button to see updated Tasks List'
          );
        },
      });
  }

  deleteAllTasks() {
    this.http
      .delete(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks.json'
      )
      .subscribe({
        next: (response) => {},
        error: (err) => {
          this.errorSubject.next(err);
        },
        complete() {
          alert(
            'All records are deleted...! Please click on FetchTask button to see updated Tasks List'
          );
        },
      });
  }
  getAllTasks() {
    //instead of subscribing to MAP observable here, we are going to subscribe in the component class.
    //So return this observable as below
    return this.http
      .get<{ [key: string]: Task }>(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks.json'
      )
      .pipe(
        map((response) => {
          //TRANSFORM DATA

          let tasks = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              // to make sure only actual property is going to add
              tasks.push({ ...response[key], id: key });
            }
          }

          return tasks;
        })
      );
  }
  updateTask(id: string | undefined, data: Task) {
    this.http
      .put(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks/' +
          id +
          '.json',
        data
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }
}
