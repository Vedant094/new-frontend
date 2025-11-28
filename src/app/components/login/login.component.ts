import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        const role = this.auth.getRole();
        if (role === 'ROLE_MANAGER') this.router.navigate(['/manager-dashboard']);
        else if (role === 'ROLE_USER') this.router.navigate(['/user-dashboard']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = (err?.error && typeof err.error === 'object') ? (err.error.error || JSON.stringify(err.error)) : (err?.error || 'Login failed. Check credentials');
      }
    });
  }
}