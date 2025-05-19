import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private form: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginInFormInitialize();
  }

  loginInFormInitialize() {
    this.loginForm = this.form.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.router.navigate(['/main/inventory']);
    }
  }
}
