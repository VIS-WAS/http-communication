import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../Model/task';
import { Subject, catchError, map, throwError } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  http: HttpClient = inject(HttpClient);

  errorSubject = new Subject<HttpErrorResponse>();

  loggingService: LoggingService = inject(LoggingService);

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ myheader: 'hello-world' });
    this.http
      .post<{ name: string }>(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks.json',
        task,
        { headers: headers }
      )
      .pipe(
        catchError((err) => {
          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            dateTime: new Date(),
          };
          this.loggingService.logError(errorObj);
          return throwError(() => err);
        })
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
      .pipe(
        catchError((err) => {
          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            dateTime: new Date(),
          };
          this.loggingService.logError(errorObj);
          return throwError(() => err);
        })
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
      .pipe(
        catchError((err) => {
          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            dateTime: new Date(),
          };
          this.loggingService.logError(errorObj);
          return throwError(() => err);
        })
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
    let header = new HttpHeaders();
    header = header.append('content-type', 'application/json');
    header = header.append('content-type', 'text/html');

    let queryParams = new HttpParams();

    queryParams = queryParams.set('page', 2);
    queryParams = queryParams.set('items', 10);
    return this.http
      .get<{ [key: string]: Task }>(
        // method to pass query string
        // 'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks.json?page =2&item=10',
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks.json',

        { headers: header, params: queryParams }
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
        }),
        catchError((err) => {
          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            dateTime: new Date(),
          };
          this.loggingService.logError(errorObj);
          return throwError(() => err);
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
      .pipe(
        catchError((err) => {
          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            dateTime: new Date(),
          };
          this.loggingService.logError(errorObj);
          return throwError(() => err);
        })
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }

  getTaskDetails(id: string | undefined) {
    return this.http
      .get(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/tasks/' +
          id +
          '.json'
      )
      .pipe(
        map((response) => {
          let task = {};
          task = { ...response, id: id };
          return task;
        })
      );
  }
}
