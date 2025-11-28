  import { Component, OnInit } from '@angular/core';
  import { AuthService } from '../../auth/auth.service';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';

  @Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.html',
    styleUrls: ['./my-requests.css'],
    standalone:false
  })
  export class MyRequestsComponent implements OnInit {
    requests: any[] = [];
    base = environment.apiBase;

    constructor(
      private auth: AuthService,
      private http: HttpClient
    ) {}

    ngOnInit() {
      const payload = this.auth.getUserFromToken();
      const email = payload?.sub;
      if (!email) return;

      this.http.get<any>(`${this.base}/users/by-email/${email}`).subscribe({
        next: user => {
          this.http.get<any[]>(`${this.base}/users/${user.id}/requests`)
            .subscribe(res => this.requests = res || []);
        }
      });
    }
  }
