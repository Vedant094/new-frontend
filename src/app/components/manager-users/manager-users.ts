import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-manager-users',
  templateUrl: './manager-users.html',
  styleUrl:'./manager-users.css',
  standalone:false
})
export class ManagerUsersComponent implements OnInit {
  users: any[] = [];
  managerId: number | null = null;
  loading = true;
  error = '';
  base = environment.apiBase;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const payload = this.auth.getUserFromToken();
    const email = payload?.sub;

    this.http.get<any>(`${this.base}/managers/by-email/${email}`).subscribe({
      next: manager => {
        this.managerId = manager.id;

        this.http.get<any[]>(`${this.base}/managers/${this.managerId}/users`)
          .subscribe({
            next: res => {
              this.users = res;
              this.loading = false;
            },
            error: () => {
              this.error = "Failed to load users.";
              this.loading = false;
            }
          });
      },
      error: () => {
        this.error = "Manager not found.";
        this.loading = false;
      }
    });
  }
}
