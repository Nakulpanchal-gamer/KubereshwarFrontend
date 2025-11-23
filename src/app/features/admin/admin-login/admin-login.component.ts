import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="d-flex align-items-center justify-content-center">
  <form class="card p-4 bg-white min-w-360" #f="ngForm" (ngSubmit)="step==='request' ? requestOtp() : verifyOtp(f)">
    <h4 class="mb-3 text-center">Admin Login (OTP)</h4>

    <!-- Step 1: Request OTP -->
    <ng-container *ngIf="step === 'request'">
      <p class="text-muted small mb-3">
        We will send a one-time code to the registered admin email.
      </p>

      <button type="submit" class="btn btn-primary w-100" [disabled]="loading || cooldownLeft>0">
        <span *ngIf="!loading && cooldownLeft===0">Send OTP</span>
        <span *ngIf="!loading && cooldownLeft>0">Resend in {{ cooldownLeft }}s</span>
        <span *ngIf="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </button>

      <div *ngIf="error" class="text-danger text-center small mt-3">{{ error }}</div>
    </ng-container>

    <!-- Step 2: Verify OTP -->
    <ng-container *ngIf="step === 'verify'">
      <div class="mb-3">
        <label class="form-label">Enter OTP</label>
        <input
          class="form-control text-center fs-5"
          type="text"
          name="otp"
          [(ngModel)]="otp"
          required
          autocomplete="one-time-code"
          inputmode="numeric"
          pattern="\\d*"
          maxlength="6"
          placeholder="••••••"
        >
        <div class="form-text">Code is valid for a few minutes.</div>
      </div>

      <button class="btn btn-primary w-100" type="submit" [disabled]="loading || !otp?.trim()">
        <span *ngIf="!loading">Verify & Login</span>
        <span *ngIf="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </button>

      <button type="button"
              class="btn btn-link w-100 mt-2"
              (click)="resendOtp()"
              [disabled]="loading || cooldownLeft>0">
        Resend OTP <span *ngIf="cooldownLeft>0">({{ cooldownLeft }}s)</span>
      </button>

      <div *ngIf="error" class="text-danger text-center small mt-3">{{ error }}</div>
    </ng-container>
  </form>
</div>
  `
})
export class AdminLoginComponent implements OnDestroy {
  // UI state
  step: 'request' | 'verify' = 'request';
  loading = false;
  error = '';
  otp = '';

  // resend cooldown
  cooldownLeft = 0;
  private cooldownTimer?: any;

  // API base
  private base = `${environment.apiBase}/api/admin`;

  constructor(private http: HttpClient, private router: Router, private toast: ToasterService) {}

  ngOnDestroy(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  // ---- Step 1: Request OTP ----
  requestOtp(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';

    this.http.post<{ message: string }>(`${this.base}/otp/request`, {})
      .subscribe({
        next: () => {
          this.loading = false;
          this.toast.info('If the account exists, an OTP has been sent.');
          this.step = 'verify';
          this.startCooldown(30); // UI cooldown; server enforces real one
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Unable to send OTP';
          this.error = msg;
          this.toast.error(msg);
          // If server returns 429, also start cooldown for better UX
          if (err?.status === 429) this.startCooldown(30);
        }
      });
  }

  resendOtp(): void {
    if (this.cooldownLeft > 0 || this.loading) return;
    this.requestOtp();
  }

  // ---- Step 2: Verify OTP ----
  verifyOtp(f: NgForm): void {
    if (this.loading) return;
    if (!this.otp || !this.otp.trim()) return;

    this.loading = true;
    this.error = '';

    this.http.post<{ token: string }>(`${this.base}/otp/verify`, { otp: this.otp.trim() })
      .subscribe({
        next: (res) => {
          this.loading = false;
          localStorage.setItem('token', res.token);
          this.toast.success('Welcome back.', 'Login successful');
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Invalid OTP';
          this.error = msg;
          this.toast.error(msg);
          // Clear OTP on invalid attempt for safety
          if (err?.status === 400) this.otp = '';
        }
      });
  }

  // ---- Cooldown helper (client-side UX only) ----
  private startCooldown(seconds: number): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownLeft = seconds;
    this.cooldownTimer = setInterval(() => {
      this.cooldownLeft -= 1;
      if (this.cooldownLeft <= 0 && this.cooldownTimer) {
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = undefined;
      }
    }, 1000);
  }
}
