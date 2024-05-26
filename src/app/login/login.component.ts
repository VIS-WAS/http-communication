import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginFormService } from '../Services/login-form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoginMode: boolean = true;

  loginService: LoginFormService = inject(LoginFormService);

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  formSubmitted(form: NgForm) {
    console.log(form.value);
    // this.loginService.sendDetails(form.value);
    form.reset();
  }
}
