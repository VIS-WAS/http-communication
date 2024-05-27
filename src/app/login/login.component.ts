import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoginMode: boolean = true;

  authService: AuthService = inject(AuthService);

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  formSubmitted(form: NgForm) {
    if (this.isLoginMode) {
      return;
    } else {
      this.authService
        .signUp(form.value.useremail, form.value.userpassword)
        .subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
    form.reset();
  }
}
