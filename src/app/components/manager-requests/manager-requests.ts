// src/app/components/manager-requests/manager-requests.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-manager-requests',
  templateUrl: './manager-requests.html',
  styleUrls: ['./manager-requests.css'],
  standalone: false
})
export class ManagerRequestsComponent implements OnInit {

  requests: any[] = [];
  managerId: number | null = null;
  base = environment.apiBase;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    const payload = this.auth.getUserFromToken();
    const email = payload?.sub;
    if (!email) return;

    this.http.get<any>(`${this.base}/managers/by-email/${email}`).subscribe({
      next: (manager) => {
        this.managerId = manager.id;
        this.loadRequests();
      },
      error: () => console.error('Get manager by email failed')
    });
  }

  // Load requests and compute "canAct" flag
  loadRequests() {
    if (!this.managerId) return;

    this.http.get<any[]>(`${this.base}/managers/${this.managerId}/requests`).subscribe({
      next: (res) => {
        // Add UI flags
        this.requests = (res || []).map(r => ({
          ...r,
          canAct: r.status === 'PENDING'   // Only PENDING requests show action buttons
        }));
      },
      error: (err) => console.error('Load requests failed', err)
    });
  }

  approve(id: number) {
    if (!this.managerId) return;

    this.http.post(`${this.base}/managers/approve-request/${id}/${this.managerId}`, {})
      .subscribe({
        next: () => this.loadRequests(),  // reload and hide buttons
        error: (err) => console.error('Approve failed', err)
      });
  }

  reject(id: number) {
    if (!this.managerId) return;

    this.http.post(`${this.base}/managers/reject-request/${id}/${this.managerId}`, {})
      .subscribe({
        next: () => this.loadRequests(),  // reload and hide buttons
        error: (err) => {
          console.error('Reject failed', err);
          this.loadRequests(); // still reload to reflect changes
        }
      });
  }
}

