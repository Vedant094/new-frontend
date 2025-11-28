import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service'; 
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.html',
  styleUrl:'./manager-dashboard.css',
  standalone:false
})
export class ManagerDashboardComponent implements OnInit {

  manager: any = null;
  loading = true;
  error = '';
  base = environment.apiBase;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router:Router
  ) {}

  ngOnInit() {
    const userPayload = this.auth.getUserFromToken();

    if (!userPayload || userPayload.role !== 'ROLE_MANAGER') {
      this.error = "Access denied. Only managers can view this page.";
      this.loading = false;
      return;
    }

    const email = userPayload.sub;

    this.http.get<any>(`${this.base}/managers/by-email/${email}`).subscribe({
      next: res => {
        this.manager = res;
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load manager details";
        this.loading = false;
      }
    });
  }

   logout() {
    this.auth.logout();
    this.router.navigate(['/Home']);
  }
}
