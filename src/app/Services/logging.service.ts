import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  logError(data: { statusCode: number; errorMessage: string; dateTime: Date }) {
    this.http
      .post(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/log.json',
        data
      )
      .subscribe();
  }

  fetchErrors() {
    this.http
      .get(
        'https://angularhttpclient-1cb37-default-rtdb.firebaseio.com/log.json'
      )
      .subscribe((error) => {
        console.log(error);
      });
  }
}
