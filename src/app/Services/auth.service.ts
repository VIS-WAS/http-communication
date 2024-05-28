import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  signUp(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCHt5WwI5Q0EgqOHGidOOYdrTJF7BlFWEs',
        data
      )
      .pipe(
        catchError((err) => {
          let errorMessage = 'An unknown error has occured';
          if (!err.error || !err.error.error) {
            return throwError(() => errorMessage);
          }
          switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage =
                'The email address is already in use by another account.';
              break;
            case 'OPERATION_NOT_ALLOWED':
              errorMessage = 'Password sign-in is disabled for this project.';
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              errorMessage =
                'We have blocked all requests from this device due to unusual activity. Try again later.';
          }
          return throwError(() => errorMessage);
        })
      );
  }
}
