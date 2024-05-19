import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      headers: req.headers.append('auth', 'abcxyz'),
    });
    return next.handle(modifiedReq).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Sent) {
          console.log('Response has arrived');
          console.log(event);
        }
      })
    );
  }
}
