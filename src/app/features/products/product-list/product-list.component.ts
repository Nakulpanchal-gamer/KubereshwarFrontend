// src/app/features/products/product-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/category.service';

type Img = string | { url?: string; publicId?: string };
type Product = {
  _id: string;
  name: string;
  description?: string;
  shortDesc?: string;
  images?: Img[];
  category?: string;
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO SECTION -->
    <section class="products-hero">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-8">
            <div class="hero-content">
              <h1 class="hero-title">Our Product Catalog</h1>
              <p class="hero-subtitle">
                Discover our comprehensive range of industrial equipment and solutions designed for modern manufacturing needs.
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="hero-stats">
              <div class="stat-card">
                <div class="stat-number">{{ products.length }}+</div>
                <div class="stat-label">Products Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTERS AND SEARCH -->
    <section class="py-4 bg-light border-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="d-flex align-items-center gap-3">
              <div class="filter-info">
                <h2 class="mb-1">Our Products</h2>
                <div class="text-muted small" *ngIf="activeCategoryId">
                  Filtered by category
                  <span class="badge rounded-pill bg-primary ms-2">
                    {{ activeCategoryName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 text-lg-end">
            <a class="btn btn-outline-primary" [routerLink]="['/contact']">
              <i class="fas fa-envelope me-2"></i>Request Quote
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS GRID -->
    <section class="py-5">
      <div class="container">
        <!-- Loading state (skeletons) -->
        <ng-container *ngIf="loading; else loadedTpl">
          <div class="row g-4">
            <div class="col-12 col-sm-6 col-lg-4" *ngFor="let _ of skeleton">
              <div class="card product-card h-100 shadow-sm">
                <div class="skeleton skeleton-img rounded-top"></div>
                <div class="card-body">
                  <div class="skeleton skeleton-text w-75 mb-2"></div>
                  <div class="skeleton skeleton-text w-100 mb-1"></div>
                  <div class="skeleton skeleton-text w-60"></div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Loaded -->
        <ng-template #loadedTpl>
          <ng-container *ngIf="products?.length; else emptyTpl">
            <div class="row g-4">
              <div class="col-12 col-sm-6 col-lg-4" *ngFor="let p of products; trackBy: trackById">
                <div class="card product-card h-100 shadow-sm lift"
                     [routerLink]="['/product', p._id]">
                  <div class="product-image-container">
                    <img class="product-image"
                         [src]="primaryImage(p) || placeholder"
                         [alt]="p.name + ' image'"
                         loading="lazy" 
                         referrerpolicy="no-referrer">
                  </div>
                  <div class="card-body">
                    <h3 class="product-title" [title]="p.name">{{ p.name }}</h3>
                    <p class="product-description">
                      {{ summary(p) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- Empty -->
          <ng-template #emptyTpl>
            <div class="empty-state text-center py-5">
              <div class="empty-icon mb-4">
                <i class="fas fa-box-open text-muted" style="font-size: 4rem;"></i>
              </div>
              <h3 class="text-muted mb-3">No products found</h3>
              <p class="text-muted mb-4" *ngIf="activeCategoryName">
                We don't have any products in the "{{ activeCategoryName }}" category yet.
              </p>
              <p class="text-muted mb-4" *ngIf="!activeCategoryName">
                We're working on adding our product catalog.
              </p>
              <a class="btn btn-primary" [routerLink]="['/contact']">
                <i class="fas fa-phone me-2"></i>Contact Us for Information
              </a>
            </div>
          </ng-template>
        </ng-template>
      </div>
    </section>

  `,
  styles: [`
    /* HERO SECTION */
    .products-hero {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 4rem 0;
    }

    .hero-content {
      color: #333;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #666;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-actions .btn {
      padding: 0.75rem 2rem;
      font-weight: 600;
      border-radius: 50px;
      transition: all 0.3s ease;
    }

    .hero-stats {
      text-align: center;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #007bff;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1rem;
      color: #666;
      font-weight: 500;
    }

    /* PRODUCT CARDS */
    .product-card {
      border: none;
      border-radius: 15px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .product-image-container {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.1);
    }



    .product-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .product-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
      min-height: 2.5rem;
    }


    /* EMPTY STATE */
    .empty-state {
      padding: 4rem 0;
    }

    .empty-icon {
      opacity: 0.5;
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
      height: 250px;
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

    /* LIFT EFFECT */
    .lift {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
    }

    /* UTILITY CLASSES */
    .min-vh-50 {
      min-height: 50vh;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);


  products: Product[] = [];
  loading = true;
  activeCategoryId = '';
  activeCategoryName = '';
  placeholder = 'assets/placeholder-4x3.png';
  skeleton = Array.from({ length: 9 });

  ngOnInit() {
    // react to category filter changes
    this.route.queryParamMap
  .pipe(map(q => q.get('category') || ''))
  .subscribe(categoryId => {
    this.activeCategoryId = categoryId;
    this.activeCategoryName = '';

    if (categoryId) {
      this.categoryService.getCategories().subscribe({
        next: (cats: any[]) => {
          const match = cats.find(c => c._id === categoryId || c.id === categoryId);
          this.activeCategoryName = match?.name || '';
        }
      });
    }

    this.loading = true;
    this.productService.getProducts({ category: categoryId || undefined })
      .subscribe({
        next: (data) => { this.products = (data || []) as Product[]; this.loading = false; },
        error: () => { this.products = []; this.loading = false; }
      });
  });

  }

  trackById = (_: number, x: Product) => x?._id;

  primaryImage(p: Product): string | null {
    const first: Img | undefined = p?.images?.[0];
    if (!first) return null;
    return typeof first === 'string' ? first : (first.url || null);
  }

  summary(p: Product): string {
    const s = p.shortDesc?.trim();
    if (s && s.length) return s;
    const d = (p.description || '').trim();
    return d.length > 120 ? d.slice(0, 120) + '…' : d || 'Tap to view details';
  }
}
