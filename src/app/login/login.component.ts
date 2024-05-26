import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoginMode: boolean = true;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
