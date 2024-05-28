import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Model/AuthResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoginMode: boolean = true;

  isLoading: boolean = false;

  authService: AuthService = inject(AuthService);
  errorMessage: string | null = null;

  authObs: Observable<AuthResponse>;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  formSubmitted(form: NgForm) {
    this.isLoading = true;
    if (this.isLoginMode) {
      this.authObs = this.authService.login(
        form.value.useremail,
        form.value.userpassword
      );
    } else {
      this.isLoading = true;
      this.authObs = this.authService.signUp(
        form.value.useremail,
        form.value.userpassword
      );
    }
    this.authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
      },
      error: (errMSG) => {
        this.isLoading = false;
        this.errorMessage = errMSG;
        this.hideSnackbar();
      },
    });
    form.reset();
  }

  hideSnackbar() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
