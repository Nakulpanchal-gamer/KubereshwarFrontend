import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToasterService } from '../../core/services/toaster.service';
import { EnquiryService } from '../../core/services/enquiry.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/products.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


type IdLike = { _id?: string; id?: string };
const getId = (o: IdLike | null | undefined) => (o && (o._id || o.id)) ?? '';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<section class="py-4">
  <div class="container">
    <header class="mb-4">
      <h2 class="mb-1">Contact Us</h2>
      <p class="text-muted mb-0">We usually respond the same business day.</p>
    </header>

    <div class="row g-4">
      <!-- Company / Channels -->
      <div class="col-md-5">
        <div class="card border-0 shadow-sm lift">
          <div class="card-body">
            <div class="d-flex align-items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" class="text-primary"><path fill="currentColor" d="M12 2l8 4v6c0 5-3.5 9-8 10C7.5 21 4 17 4 12V6l8-4zm0 2.2L6 6.7v5.3c0 3.8 2.6 7.1 6 8 3.4-.9 6-4.2 6-8V6.7l-6-2.5z"/></svg>
              <strong>Kubereshwar Mahcine Products</strong>
            </div>

            <!-- Map embed (above the address) -->
<div class="ratio ratio-16x9 mb-3 rounded overflow-hidden border">
  <iframe
    [src]="mapSrc"
    style="border:0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
    title="Kubereshwar location">
  </iframe>
</div>

<a class="small d-inline-block mb-3"
   [href]="mapLink"
   target="_blank" rel="noopener">
  Open in Google Maps
</a>


            <div class="text-muted small mb-3">
              Jay Bharat Rangshala Compound, 15/4/26, near Tirupati Industrial Estate, <br>Dhobi Ghat, Kailash Nagar, Saraspur,<br> Ahmedabad, Gujarat 380018
            </div>

            <div class="d-flex flex-column gap-2">
              <a class="text-decoration-none d-inline-flex align-items-center gap-2" href="mailto:contact@kubereshwar.in">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z"/></svg>
                Laxmichetan&#64;gmail.com
              </a>
              <a class="text-decoration-none d-inline-flex align-items-center gap-2" href="mailto:contact@kubereshwar.in">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z"/></svg>
                Nakulpanchal428&#64;gmail.com
              </a>
              <a class="text-decoration-none d-inline-flex align-items-center gap-2" href="tel:+918347878904">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.3 21 3 12.7 3 2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                  Chetan panchal: 9426063375
              </a>
              <a class="text-decoration-none d-inline-flex align-items-center gap-2" href="tel:+919898395983">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.3 21 3 12.7 3 2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                Nakul panchal: 9898395983
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="col-md-7">
        <form #form="ngForm" (ngSubmit)="submitForm(form)" class="card border-0 shadow-sm" [attr.aria-busy]="submitting">
          <div class="card-body p-4">
            <div class="row g-3">
              <!-- Basic details -->
              <div class="col-md-6">
                <label class="form-label">Your Name</label>
                <div class="input-icon">
                  <input #nameInput="ngModel"
                         type="text" 
                         class="form-control" 
                         [(ngModel)]="formData.name" 
                         name="name" 
                         required 
                         minlength="2"
                         [class.is-invalid]="formSubmitted && (!formData.name || formData.name.trim().length < 2)">
                  <span class="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"/></svg>
                  </span>
                </div>
                <div class="invalid-feedback" *ngIf="formSubmitted && (!formData.name || formData.name.trim().length < 2)">
                  <span *ngIf="!formData.name || formData.name.trim().length === 0">Name is required.</span>
                  <span *ngIf="formData.name && formData.name.trim().length > 0 && formData.name.trim().length < 2">Name must be at least 2 characters.</span>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Your Email</label>
                <div class="input-icon">
                  <input #emailInput="ngModel"
                         type="email" 
                         class="form-control" 
                         [(ngModel)]="formData.email" 
                         name="email" 
                         email
                         [class.is-invalid]="formSubmitted && (hasContactError() || (formData.email?.trim() && emailInput.errors?.['email']))">
                  <span class="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v1l10 6l10-6V6a2 2 0 0 0-2-2Zm0 5.2L12 15L4 9.2V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.2Z"/></svg>
                  </span>
                </div>
                <div class="small text-muted">We'll use this to reply to your enquiry.</div>
                <div class="invalid-feedback" *ngIf="formSubmitted && formData.email && formData.email.trim() && emailInput.errors?.['email']">Enter a valid email address.</div>
                <div class="invalid-feedback" *ngIf="formSubmitted && hasContactError() && !formData.email?.trim()">Please provide either email or phone.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Phone</label>
                <div class="input-icon">
                  <input #phoneInput="ngModel"
                         type="tel" 
                         class="form-control" 
                         [(ngModel)]="formData.phone" 
                         name="phone"
                         [class.is-invalid]="formSubmitted && hasContactError() && !formData.phone?.trim()">
                  <span class="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.3 21 3 12.7 3 2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                  </span>
                </div>
                <div class="invalid-feedback" *ngIf="formSubmitted && hasContactError() && !formData.phone?.trim()">Please provide either email or phone.</div>
              </div>

              <!-- Category / Product selection -->
              <div class="col-md-6">
                <label class="form-label">Category</label>
                <select class="form-select"
                        name="categoryId"
                        [(ngModel)]="formData.categoryId"
                        (ngModelChange)="onCategoryChange($event)"
                        [disabled]="loading.categories"
                        required>
                  <option value="" disabled selected>Choose a category…</option>
                  <option *ngFor="let c of categories" [value]="getId(c)">{{ c.name }}</option>
                </select>
                <div class="invalid small text-danger" *ngIf="formSubmitted && form.controls['categoryId']?.invalid">
                  Please select a category.
                </div>
              </div>

              <div class="col-md-6 d-flex align-items-end">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="chkAllOfCat"
                         [(ngModel)]="formData.allProductsOfCategory"
                         name="allProductsOfCategory">
                  <label for="chkAllOfCat" class="form-check-label">Enquire for the entire category</label>
                </div>
              </div>

              <div class="col-12" *ngIf="!formData.allProductsOfCategory">
                <label class="form-label">Products in selected category</label>
                <select class="form-select"
                        name="productIds"
                        multiple
                        [(ngModel)]="formData.productIds"
                        [disabled]="loading.products || !formData.categoryId"
                        size="6">
                  <option *ngFor="let p of products" [value]="getId(p)">
                    {{ p.name }}
                  </option>
                </select>
                <div class="small text-muted mt-1">
                  Hold Ctrl/⌘ to select multiple. Leave empty to enquire about the category only.
                </div>
              </div>

              <!-- Message -->
              <div class="col-12">
                <label class="form-label">Message</label>
                <textarea rows="5" class="form-control" [(ngModel)]="formData.message" name="message" required minlength="10"></textarea>
                <div class="invalid small text-danger" *ngIf="formSubmitted && form.controls['message']?.invalid">
                  Add a short message (min 10 chars).
                </div>
              </div>


              <!-- Honeypot -->
              <input type="text" name="website" [(ngModel)]="formData.website" class="visually-hidden" tabindex="-1" autocomplete="off">
            </div>
          </div>

          <div class="card-footer bg-white border-0 p-4 pt-0">
            <button class="btn btn-primary w-100" type="submit" [disabled]="submitting">
              <ng-container *ngIf="!submitting; else busyTpl">Send Message</ng-container>
            </button>
            <ng-template #busyTpl>
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Sending…
            </ng-template>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
  `,
  styles: [`
    .lift { transition: transform .18s ease, box-shadow .18s ease; }
    .lift:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.08) !important; }
    .input-icon { position: relative; }
    .input-icon .icon { position: absolute; right: .75rem; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: .55; }
    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }
    .form-control.is-invalid {
      border-color: #dc3545;
      padding-right: calc(1.5em + 0.75rem);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6 .4.4.4-.4'/%3e%3cpath d='m6.2 8.4-.4-.4-.4.4'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    .visually-hidden { position: absolute !important; height: 1px; width: 1px; overflow: hidden; clip: rect(1px,1px,1px,1px); white-space: nowrap; }
  `]
})
export class ContactComponent implements OnInit {
   constructor(
    private toast: ToasterService,
    private enquiries: EnquiryService,
    private categoriesApi: CategoryService,
    private productsApi: ProductService,
    private sanitizer: DomSanitizer,           // <-- add this
  ) {}

  loading = { categories: false, products: false };
  categories: any[] = [];
  products: any[] = [];

  submitting = false;
  formSubmitted = false;
  formData: {
    name: string; email: string; message: string;
    phone?: string; topic?: string; consent?: boolean; website?: string;
    categoryId?: string; productIds: string[]; allProductsOfCategory: boolean;
  } = { name: '', email: '', message: '', phone: '', topic: '', consent: false, website: '',
        categoryId: '', productIds: [], allProductsOfCategory: false };

  hasContactError(): boolean {
    const email = (this.formData.email || '').trim();
    const phone = (this.formData.phone || '').trim();
    return !email && !phone;
  }
  
  // Map data
  mapAddress = 'Kubereshwar Machine Products / hydraulic press manufacturer, Jay Bharat Rangshala Compound, 15/4/26, near Tirupati Industrial Estate, Dhobi Ghat, Kailash Nagar, Saraspur, Ahmedabad, Gujarat 380018';
  mapSrc!: SafeResourceUrl;
  mapLink = '';

  ngOnInit() {
    this.fetchCategories();
    this.buildMapLinks(); 
  }

  private buildMapLinks() {
    const q = encodeURIComponent(this.mapAddress);
    this.mapLink = `https://www.google.com/maps?q=${q}`;
    this.mapSrc  = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.mapLink}&z=16&output=embed`);
  }

  getId = getId;

  fetchCategories() {
    this.loading.categories = true;
    this.categoriesApi.getCategories().subscribe({
      next: (list: any[]) => { this.categories = list || []; },
      error: () => this.toast.error?.('Could not load categories.', 'Error'),
      complete: () => this.loading.categories = false
    });
  }

  onCategoryChange(categoryId: string) {
    this.formData.productIds = [];
    if (!categoryId) { this.products = []; return; }

    this.loading.products = true;
    this.productsApi.getProducts({ category: categoryId }).subscribe({
      next: (list: any[]) => { this.products = list || []; },
      error: () => this.toast.error?.('Could not load products for this category.', 'Error'),
      complete: () => this.loading.products = false
    });
  }

  submitForm(form: NgForm) {
    // Mark form as submitted to show validation messages
    this.formSubmitted = true;

    // Check if name is provided
    const nameValid = this.formData.name && this.formData.name.trim().length >= 2;
    
    // Check if at least one of email or phone is provided
    const email = (this.formData.email || '').trim();
    const phone = (this.formData.phone || '').trim();
    const contactValid = email || phone;
    
    // Validate email format if provided
    const emailFormatValid = !email || (form.controls['email'] && !form.controls['email'].errors?.['email']);
    
    // Check other form validations (category, message)
    const otherFieldsValid = form.controls['categoryId']?.valid && 
                            form.controls['message']?.valid;

    // If any validation fails, show error and return
    if (!nameValid || !contactValid || !emailFormatValid || !otherFieldsValid) {
      this.toast.error?.('Please correct the errors and try again.', 'Validation Error');
      return;
    }

    // spam trap
    if (this.formData.website) {
      this.toast.info('Thanks for reaching out.', 'Received');
      form.resetForm();
      this.formSubmitted = false;
      return;
    }

    this.submitting = true;

    const category = this.categories.find(c => getId(c) === this.formData.categoryId);
    const payload = {
      name: (this.formData.name || '').trim(),
      email: (this.formData.email || '').trim(),
      phone: (this.formData.phone || ''),
      topic: (this.formData.topic || '').trim(),
      message: (this.formData.message || '').trim(),

      categoryId: this.formData.categoryId || null,
      categoryName: category?.name || null,
      allProductsOfCategory: !!this.formData.allProductsOfCategory,
      productIds: this.formData.allProductsOfCategory ? [] : (this.formData.productIds || [])
    };

    this.enquiries.createEnquiry(payload).subscribe({
      next: () => {
        this.toast.success("Thanks, we'll get back to you shortly.", 'Message sent');
        this.submitting = false;
        this.formSubmitted = false;
        form.resetForm();
      },
      error: (err) => {
        console.error('Enquiry submit failed:', err);
        this.toast.error?.('Could not send your message. Please try again.', 'Error');
        this.submitting = false;
      }
    });
  }
}
