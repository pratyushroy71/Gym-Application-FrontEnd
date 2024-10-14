
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[]
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLogin: boolean = true; 

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService,private toaster: ToastrService) {
    this.loginForm = this.fb.group({
      name: [''], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  toggleMode() {
    this.isLogin = !this.isLogin; 
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, name } = this.loginForm.value; 

      if (this.isLogin) {
        // Call login API
        this.loginService.login(email, password).subscribe(
          (response) => {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/landing']);
            this.toaster.success('Login Successful');
          },
          (error) => {
            this.toaster.error(error.error.msg);
          }
        );
      } else {
        // Call sign-up API
        this.loginService.register(name, email, password).subscribe(
          (response) => {
            this.toaster.success('Login Successful');
            localStorage.setItem('token', response.token);
            this.router.navigate(['/landing']);
          },
          (error) => {
            this.toaster.error(error.error.msg);
          }
        );
      }
    }
  }
}

