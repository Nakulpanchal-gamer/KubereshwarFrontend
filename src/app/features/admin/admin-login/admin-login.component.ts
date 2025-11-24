import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="d-flex align-items-center justify-content-center min-vh-100">
  <form class="card p-4 bg-white min-w-360" #f="ngForm" (ngSubmit)="login(f)">
    <h4 class="mb-3 text-center">Admin Login</h4>

    <div class="mb-3">
      <label class="form-label">Password</label>
      <div class="position-relative">
        <input
          class="form-control"
          [type]="showPassword ? 'text' : 'password'"
          name="password"
          [(ngModel)]="password"
          required
          autocomplete="current-password"
          placeholder="Enter password"
        >
        <button
          type="button"
          class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
          (click)="togglePasswordVisibility()"
          style="border: none; background: none; z-index: 10; color: #6c757d; padding: 0.25rem 0.5rem;"
          title="{{ showPassword ? 'Hide password' : 'Show password' }}"
        >
          <span style="font-size: 1.2rem; cursor: pointer; user-select: none;">{{ showPassword ? '🙈' : '👁️' }}</span>
        </button>
      </div>
    </div>

    <button class="btn btn-primary w-100" type="submit" [disabled]="loading || !password?.trim()">
      <span *ngIf="!loading">Login</span>
      <span *ngIf="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </button>

    <div *ngIf="error" class="text-danger text-center small mt-3">{{ error }}</div>
  </form>
</div>
  `
})
export class AdminLoginComponent {
  loading = false;
  error = '';
  password = '';
  showPassword = false;

  private base = `${environment.apiBase}/api/admin`;

  constructor(private http: HttpClient, private router: Router, private toast: ToasterService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(f: NgForm): void {
    if (this.loading || !f.valid) return;
    if (!this.password || !this.password.trim()) return;

    this.loading = true;
    this.error = '';

    this.http.post<{ token: string }>(`${this.base}/login`, { password: this.password.trim() })
      .subscribe({
        next: (res) => {
          this.loading = false;
          localStorage.setItem('token', res.token);
          this.toast.success('Welcome back.', 'Login successful');
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Invalid credentials';
          this.error = msg;
          this.toast.error(msg);
          this.password = '';
        }
      });
  }
}
