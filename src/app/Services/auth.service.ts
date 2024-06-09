import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import {
  BehaviorSubject,
  Subject,
  catchError,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../Model/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);

  user = new BehaviorSubject<User>(null);

  router: Router = inject(Router);

  private tokenExpireTimer: any;

  constructor() {}

  signUp(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCHt5WwI5Q0EgqOHGidOOYdrTJF7BlFWEs',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  login(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCHt5WwI5Q0EgqOHGidOOYdrTJF7BlFWEs',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  private handleError(err) {
    console.log(err.error.error.message);
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
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'The username or password does not exists';
        break;
      case 'USER_DISABLED':
        errorMessage =
          'The user account has been disabled by an administrator.';
        break;
    }
    return throwError(() => errorMessage);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
    if (this.tokenExpireTimer) {
      clearTimeout(this.tokenExpireTimer);
    }
    this.tokenExpireTimer = null;
  }

  private handleCreateUser(res) {
    const expiresInTS = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTS);
    const user = new User(res.email, res.localId, res.idToken, expiresIn);
    this.user.next(user);

    this.autoLogout(res.expiresIn * 1000);

    localStorage.setItem('user', JSON.stringify(user));
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }
    const loggedUser = new User(
      user.email,
      user.id,
      user._token,
      user._expiresIn
    );

    if (loggedUser.token) {
      this.user.next(loggedUser);
      const timerValue = user._expiresIn.getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }
  }

  autoLogout(expireTime: number) {
    this.tokenExpireTimer = setTimeout(() => {
      this.logout();
    }, expireTime);
  }
}
