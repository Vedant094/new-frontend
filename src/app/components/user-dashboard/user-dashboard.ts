import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
  standalone:false
})
export class UserDashboardComponent implements OnInit {
  user: any = null;
  loading = true;
  error = '';
  base = environment.apiBase;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const payload = this.auth.getUserFromToken();
    const email = payload?.sub;
    if (!email) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>(`${this.base}/users/by-email/${email}`).subscribe({
      next: (u: any) => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.error = "User not found";
        this.loading = false;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/Home']);
  }
}
