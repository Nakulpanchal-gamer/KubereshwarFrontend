// src/app/features/products/product-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../core/services/products.service';
import { EnquiryService } from '../../../core/services/enquiry.service';
import { ToasterService } from '../../../core/services/toaster.service';

type Img = string | { url?: string; publicId?: string };
type Spec = { key: string; value: string };

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `

    <!-- PRODUCT DETAILS -->
    <section class="py-5" *ngIf="!loading && product; else loadingTpl">
      <div class="container">
        <div class="row g-5">
          <!-- Gallery -->
          <div class="col-lg-7">
            <div class="product-gallery">
              <div class="main-image-container">
                <img class="main-image"
                     [src]="activeImgUrl() || placeholder"
                     [alt]="product.name + ' image'"
                     loading="lazy"
                     referrerpolicy="no-referrer" />
                <div class="image-overlay">
                  <button class="btn btn-light btn-lg" (click)="openImageModal()">
                    <i class="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              
              <div class="thumbnail-gallery" *ngIf="product.images && product.images.length > 1">
                <button
                  *ngFor="let img of (product.images || []); let i = index; trackBy: trackByIndex"
                  type="button"
                  class="thumbnail-btn"
                  [class.active]="i === activeIdx"
                  (click)="activeIdx = i"
                  [attr.aria-label]="'Image ' + (i + 1)">
                  <img [src]="imgUrl(img) || placeholder"
                       [alt]="product.name + ' thumbnail ' + (i + 1)"
                       loading="lazy" 
                       referrerpolicy="no-referrer" />
                </button>
              </div>
            </div>

            <!-- Description -->
            <div class="product-description mt-4">
              <h3 class="section-title">Product Description</h3>
              <p class="description-text" *ngIf="product.description">{{ product.description }}</p>
              <p class="description-text text-muted" *ngIf="!product.description">
                Detailed product information will be available soon. Please contact us for more details.
              </p>
            </div>

            <!-- Specifications -->
            <div class="product-specifications mt-4" *ngIf="product.specs?.length">
              <h3 class="section-title">Technical Specifications</h3>
              <div class="specs-table">
                <div class="spec-row" *ngFor="let s of product.specs">
                  <div class="spec-key">{{ s.key }}</div>
                  <div class="spec-value">{{ s.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enquiry Form -->
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h5 class="mb-3">Submit an enquiry</h5>

                <form #f="ngForm" (ngSubmit)="submitEnquiry(f)" novalidate>
                  <!-- NAME -->
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input class="form-control"
                           [(ngModel)]="enquiry.name"
                           name="name"
                           required minlength="2"
                           [class.is-invalid]="f.submitted && f.controls['name'].invalid">
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['name']?.errors?.['required']">
                      Name is required.
                    </div>
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['name']?.errors?.['minlength']">
                      Name must be at least 2 characters.
                    </div>
                  </div>

                  <!-- EMAIL -->
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input class="form-control"
                           [(ngModel)]="enquiry.email"
                           name="email"
                           type="email"
                           required email
                           [class.is-invalid]="f.submitted && f.controls['email'].invalid">
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['email']?.errors?.['required']">
                      Email is required.
                    </div>
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['email']?.errors?.['email']">
                      Enter a valid email address.
                    </div>
                  </div>

                  <!-- PHONE -->
                  <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input class="form-control"
                           [(ngModel)]="enquiry.phone"
                           name="phone"
                           type="tel"
                           inputmode="tel"
                           required
                           pattern="^[0-9+()\\-\\s]{7,20}$"
                           maxlength="20"
                           [class.is-invalid]="f.submitted && f.controls['phone'].invalid">
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['phone']?.errors?.['required']">
                      Phone is required.
                    </div>
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['phone']?.errors?.['pattern']">
                      Enter a valid phone number (digits, +, (), - allowed).
                    </div>
                  </div>

                  <!-- MESSAGE -->
                  <div class="mb-3">
                    <label class="form-label">Message</label>
                    <textarea class="form-control"
                              rows="4"
                              [(ngModel)]="enquiry.message"
                              name="message"
                              required minlength="10"
                              [class.is-invalid]="f.submitted && f.controls['message'].invalid"></textarea>
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['message']?.errors?.['required']">
                      Message is required.
                    </div>
                    <div class="invalid-feedback" *ngIf="f.submitted && f.controls['message']?.errors?.['minlength']">
                      Message must be at least 10 characters.
                    </div>
                  </div>

                  <!-- Honeypot (spam trap) -->
                  <input type="text" class="visually-hidden" name="website" [(ngModel)]="enquiry.website" tabindex="-1" autocomplete="off">

                  <button class="btn btn-primary w-100" type="submit" [disabled]="f.invalid || submitting">
                    <ng-container *ngIf="!submitting; else busyTpl">Submit</ng-container>
                  </button>
                  <ng-template #busyTpl>
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending…
                  </ng-template>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <ng-template #loadingTpl>
      <section class="py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-7">
              <div class="skeleton skeleton-img mb-3"></div>
              <div class="skeleton skeleton-text w-75 mb-2"></div>
              <div class="skeleton skeleton-text w-100"></div>
            </div>
            <div class="col-lg-5">
              <div class="skeleton skeleton-img"></div>
            </div>
          </div>
        </div>
      </section>
    </ng-template>

    <!-- Error / Not found -->
    <ng-template #errorTpl>
      <section class="py-5">
        <div class="container">
          <div class="text-center">
            <div class="error-icon mb-4">
              <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
            </div>
            <h3 class="text-muted mb-3">Product Not Found</h3>
            <p class="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <a class="btn btn-primary" [routerLink]="['/products']">
              <i class="fas fa-arrow-left me-2"></i>Back to Products
            </a>
          </div>
        </div>
      </section>
    </ng-template>
  `,
  styles: [`

    /* PRODUCT GALLERY */
    .product-gallery {
      margin-bottom: 2rem;
    }

    .main-image-container {
      position: relative;
      border-radius: 15px;
      overflow: hidden;
      margin-bottom: 1rem;
      background: #f8f9fa;
    }

    .main-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .image-overlay {
      position: absolute;
      top: 1rem;
      right: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .main-image-container:hover .image-overlay {
      opacity: 1;
    }

    .thumbnail-gallery {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }

    .thumbnail-btn {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
      background: none;
      padding: 0;
      transition: all 0.3s ease;
    }

    .thumbnail-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-btn.active {
      border-color: #007bff;
    }

    .thumbnail-btn:hover {
      border-color: #007bff;
      transform: scale(1.05);
    }

    /* SECTION STYLES */
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .description-text {
      font-size: 1rem;
      line-height: 1.6;
      color: #666;
    }

    /* SPECIFICATIONS */
    .specs-table {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .spec-row {
      display: flex;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .spec-row:last-child {
      border-bottom: none;
    }

    .spec-key {
      flex: 0 0 40%;
      font-weight: 600;
      color: #333;
    }

    .spec-value {
      flex: 1;
      color: #666;
    }


    .invalid-feedback {
      font-size: 0.875rem;
      color: #dc3545;
      margin-top: 0.25rem;
    }

    /* CONTACT INFO */
    .contact-info {
      margin-top: 2rem;
    }

    .info-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 1.5rem;
      border-left: 4px solid #007bff;
    }

    .info-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.75rem;
    }

    .info-text {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .contact-methods {
      display: flex;
      gap: 1rem;
    }

    .contact-method {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: white;
      border-radius: 8px;
      text-decoration: none;
      color: #007bff;
      font-weight: 500;
      transition: all 0.3s ease;
      border: 1px solid #e9ecef;
    }

    .contact-method:hover {
      background: #007bff;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    }

    /* SKELETON LOADING */
    .skeleton {
      position: relative;
      overflow: hidden;
      background: #f0f0f0;
      border-radius: 8px;
    }

    .skeleton::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shimmer 1.5s infinite;
    }

    .skeleton-img {
      height: 300px;
    }

    .skeleton-text {
      height: 12px;
      margin-bottom: 0.5rem;
      border-radius: 6px;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* ERROR STATE */
    .error-icon {
      opacity: 0.7;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
      .thumbnail-gallery {
        justify-content: center;
      }
      
      .contact-methods {
        flex-direction: column;
      }
      
      .enquiry-card {
        position: static;
      }
    }

    /* UTILITY CLASSES */
    .min-vh-50 {
      min-height: 50vh;
    }

    .visually-hidden {
      position: absolute !important;
      height: 1px;
      width: 1px;
      overflow: hidden;
      clip: rect(1px, 1px, 1px, 1px);
      white-space: nowrap;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private enquiryService = inject(EnquiryService);
  private toast = inject(ToasterService);

  product: { _id: string; name: string; shortDesc?: string; description?: string; images?: Img[]; specs?: Spec[]; } | null = null;

  loading = true;
  submitting = false;
  activeIdx = 0;

  enquiry: { name: string; email: string; phone: string; message: string; website?: string } = {
    name: '', email: '', phone: '', message: '', website: ''
  };

  placeholder = 'assets/placeholder-4x3.png';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.loading = false; this.product = null; return; }

    this.productService.getProductById(id).subscribe({
      next: (res: any) => { this.product = res || null; this.activeIdx = 0; this.loading = false; },
      error: _ => { this.toast.loadFailed?.('product'); this.product = null; this.loading = false; }
    });
  }

  submitEnquiry(form: NgForm) {
    if (!this.product?._id) return;

    // If invalid, mark and show messages
    if (form.invalid) {
      // Angular shows invalid-feedback because we bind is-invalid to `f.submitted && invalid`.
      // Trigger submitted state:
      (form as any).submitted = true;
      this.toast.error?.('Please correct the errors and try again.');
      return;
    }

    // Spam trap
    if (this.enquiry.website) {
      this.toast.success?.('Thanks, we’ll get back to you shortly.', 'Message received');
      form.resetForm();
      return;
    }

    this.submitting = true;
    const payload = {
      name: (this.enquiry.name || '').trim(),
      email: (this.enquiry.email || '').trim(),
      phone: (this.enquiry.phone || '').trim(),
      message: (this.enquiry.message || '').trim(),
      product: this.product._id
    };

    this.enquiryService.createEnquiry(payload).subscribe({
      next: () => {
        this.toast.success('Your enquiry has been submitted.', 'Thank you');
        this.enquiry = { name: '', email: '', phone: '', message: '' };
        form.resetForm();
        this.submitting = false;
      },
      error: () => {
        this.toast.actionFailed?.('Submit enquiry');
        this.submitting = false;
      }
    });
  }

  activeImgUrl(): string | null {
    const imgs = this.product?.images || [];
    if (!imgs.length) return null;
    const first: Img = imgs[this.activeIdx] ?? imgs[0];
    return this.imgUrl(first);
  }

  imgUrl(i: Img): string | null { return typeof i === 'string' ? i : (i?.url || null); }

  trackByIndex = (i: number) => i;

  openImageModal() {
    // Placeholder for image modal functionality
    console.log('Open image modal');
  }
}
