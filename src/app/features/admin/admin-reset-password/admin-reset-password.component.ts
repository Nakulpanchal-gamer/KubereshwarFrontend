import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-admin-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="d-flex align-items-center justify-content-center min-vh-100">
  <form class="card p-4 bg-white min-w-360" #f="ngForm" (ngSubmit)="resetPassword(f)">
    <h4 class="mb-3 text-center">Reset Password</h4>

    <div class="mb-3">
      <label class="form-label">New Password</label>
      <div class="position-relative">
        <input
          class="form-control"
          [type]="showPassword ? 'text' : 'password'"
          name="password"
          [(ngModel)]="password"
          required
          minlength="6"
          autocomplete="new-password"
          placeholder="Enter new password (min 6 characters)"
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
      <div class="form-text">Password must be at least 6 characters long.</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Confirm Password</label>
      <div class="position-relative">
        <input
          class="form-control"
          [type]="showConfirmPassword ? 'text' : 'password'"
          name="confirmPassword"
          [(ngModel)]="confirmPassword"
          required
          autocomplete="new-password"
          placeholder="Confirm new password"
        >
        <button
          type="button"
          class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
          (click)="toggleConfirmPasswordVisibility()"
          style="border: none; background: none; z-index: 10; color: #6c757d; padding: 0.25rem 0.5rem;"
          title="{{ showConfirmPassword ? 'Hide password' : 'Show password' }}"
        >
          <span style="font-size: 1.2rem; cursor: pointer; user-select: none;">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
        </button>
      </div>
    </div>

    <button class="btn btn-primary w-100" type="submit" [disabled]="loading || !password?.trim() || !confirmPassword?.trim()">
      <span *ngIf="!loading">Reset Password</span>
      <span *ngIf="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </button>

    <div class="text-center mt-3">
      <a routerLink="/admin/login" class="text-decoration-none">Back to Login</a>
    </div>

    <div *ngIf="error" class="text-danger text-center small mt-3">{{ error }}</div>
    <div *ngIf="success" class="text-success text-center small mt-3">{{ success }}</div>
  </form>
</div>
  `
})
export class AdminResetPasswordComponent {
  loading = false;
  error = '';
  success = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  private base = `${environment.apiBase}/api/admin`;

  constructor(private http: HttpClient, private router: Router, private toast: ToasterService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword(f: NgForm): void {
    if (this.loading || !f.valid) return;
    if (!this.password || !this.password.trim()) {
      this.error = 'Password is required';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.http.post<{ message: string }>(`${this.base}/reset-password`, { password: this.password.trim() })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.success = res.message || 'Password reset successfully';
          this.toast.success(this.success);
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Failed to reset password';
          this.error = msg;
          this.toast.error(msg);
        }
      });
  }
}

