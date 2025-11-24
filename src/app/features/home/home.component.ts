// pages/home/home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';

type Img = string | { url?: string; publicId?: string };
type Category = { _id: string; name: string; description?: string; image?: Img | null };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="hero-pattern"></div>
      </div>
      <div class="container">
        <div class="row align-items-center hero-row">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="hero-title">
                Industrial Solutions & Machinery
              </h1>
              <p class="hero-subtitle">
                Discover our comprehensive range of industrial equipment, machinery, and solutions designed for modern manufacturing and production needs.
              </p>
              <div class="hero-actions">
                <a class="btn btn-primary btn-lg me-3" routerLink="/products">
                  <i class="fas fa-cogs me-2"></i>Browse Products
                </a>
                <a class="btn btn-primary btn-lg" routerLink="/contact">
                  <i class="fas fa-phone me-2"></i>Get Quote
                </a>
              </div>
              <div class="hero-stats mt-5">
                <div class="row g-4">
                  <div class="col-4">
                    <div class="stat-item">
                      <div class="stat-number">500+</div>
                      <div class="stat-label">Products</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-item">
                      <div class="stat-number">50+</div>
                      <div class="stat-label">Categories</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-item">
                      <div class="stat-number">5000+</div>
                      <div class="stat-label">Happy Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 hero-visual">
            <div class="hero-image">
              <div class="floating-card card-1">
                <i class="fas fa-cog text-primary"></i>
                <span>Industrial Machinery</span>
              </div>
              <div class="floating-card card-2">
                <i class="fas fa-tools text-success"></i>
                <span>Tools & Equipment</span>
              </div>
              <div class="floating-card card-3">
                <i class="fas fa-industry text-warning"></i>
                <span>Manufacturing Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED CATEGORIES -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Our Product Categories</h2>
          <p class="section-subtitle">Explore our comprehensive range of industrial solutions</p>
        </div>

        <!-- Loading skeleton -->
        <ng-container *ngIf="loading; else categoriesTpl">
          <div class="row g-4">
            <div class="col-12 col-sm-6 col-lg-3" *ngFor="let _ of skeleton; index as i">
              <div class="card category-card h-100 shadow-sm">
                <div class="skeleton skeleton-img rounded-top"></div>
                <div class="card-body">
                  <div class="skeleton skeleton-text w-75 mb-2"></div>
                  <div class="skeleton skeleton-text w-100"></div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Categories grid -->
        <ng-template #categoriesTpl>
          <ng-container *ngIf="categories?.length; else emptyTpl">
            <div class="row g-4">
              <div class="col-12 col-sm-6 col-lg-3" *ngFor="let c of categories trackBy: trackById">
                <a class="card category-card h-100 text-decoration-none text-reset shadow-sm lift"
                   [routerLink]="['/products']"
                   [queryParams]="{ category: c._id }">
                  <div class="category-image-container">
                    <img
                      class="category-image"
                      [src]="catImg(c) || placeholder"
                      [alt]="c.name"
                      loading="lazy"
                      referrerpolicy="no-referrer" />
                    <div class="category-overlay">
                      <i class="fas fa-arrow-right"></i>
                    </div>
                  </div>
                  <div class="card-body">
                    <h3 class="category-title">{{ c.name }}</h3>
                    <p class="category-description">
                      {{ (c.description || 'Explore our ' + c.name + ' solutions') | slice:0:80 }}{{ (c.description || '').length > 80 ? '…' : '' }}
                    </p>
                    <div class="category-arrow">
                      <i class="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </ng-container>

          <ng-template #emptyTpl>
            <div class="empty-state text-center py-5">
              <div class="empty-icon mb-3">
                <i class="fas fa-box-open text-muted" style="font-size: 3rem;"></i>
              </div>
              <h4 class="text-muted">No categories available</h4>
              <p class="text-muted">We're working on adding our product categories. <a routerLink="/contact" class="text-primary">Contact us</a> for more information.</p>
            </div>
          </ng-template>
        </ng-template>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Why Choose Kubereshwar?</h2>
          <p class="section-subtitle">Your trusted partner for industrial solutions</p>
        </div>
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-award"></i>
              </div>
              <h4 class="feature-title">Quality Assurance</h4>
              <p class="feature-description">Reliable, tested products with consistent quality and performance standards.</p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h4 class="feature-title">Expert Support</h4>
              <p class="feature-description">Professional technical support and guidance for all your industrial needs.</p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-shipping-fast"></i>
              </div>
              <h4 class="feature-title">Fast Delivery</h4>
              <p class="feature-description">Quick turnaround times and efficient delivery across all locations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  `,
  styles: [`
    :host { display: block; }

    /* HERO SECTION */
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      z-index: 1;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }

    .hero-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      z-index: 3;
    }

    .hero-content {
      position: relative;
      z-index: 4;
      color: white;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: #ffffff !important;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      color: #ffffff !important;
      font-weight: 400;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .hero-actions .btn {
      padding: 0.75rem 2rem;
      font-weight: 600;
      border-radius: 50px;
      transition: all 0.3s ease;
      flex: 1;
      min-width: 200px;
    }

    .hero-stats {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .hero-image {
      position: relative;
      z-index: 4;
      height: 500px;
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      padding: 1.5rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      animation: float 6s ease-in-out infinite;
    }

    .card-1 {
      top: 20%;
      right: 10%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 50%;
      right: 30%;
      animation-delay: 2s;
    }

    .card-3 {
      bottom: 20%;
      right: 5%;
      animation-delay: 4s;
    }

    .floating-card i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      display: block;
    }

    .floating-card span {
      font-weight: 600;
      color: #333;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* SECTION STYLES */
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 0;
    }

    /* CATEGORY CARDS */
    .category-card {
      border: none;
      border-radius: 15px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
    }

    .category-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .category-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-image {
      transform: scale(1.1);
    }

    .category-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .category-card:hover .category-overlay {
      opacity: 1;
    }

    .category-overlay i {
      color: white;
      font-size: 2rem;
    }

    .category-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.75rem;
    }

    .category-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .category-arrow {
      color: #007bff;
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-arrow {
      transform: translateX(5px);
    }

    /* FEATURE CARDS */
    .feature-card {
      text-align: center;
      padding: 2rem;
      border-radius: 15px;
      background: white;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      height: 100%;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .feature-icon i {
      font-size: 2rem;
      color: white;
    }

    .feature-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .feature-description {
      color: #666;
      line-height: 1.6;
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
      height: 200px;
    }

    .skeleton-text {
      height: 12px;
      margin-bottom: 0.5rem;
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
    @media (max-width: 1200px) {
      .hero-section {
        min-height: 80vh;
      }
      
      .hero-title {
        font-size: 3rem;
      }
      
      .hero-image {
        height: 400px;
      }
    }

    @media (max-width: 992px) {
      .hero-visual {
        display: none;
      }

      .hero-section {
        min-height: auto;
        padding: 2rem 0 2.5rem;
      }

      .hero-row {
        min-height: auto;
      }

      .hero-content {
        text-align: center;
      }
      
      .hero-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
      }
      
      .hero-actions {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
        justify-content: center;
      }
      
      .hero-actions .btn {
        min-width: auto;
        width: 100%;
        padding: 0.75rem 1.5rem;
      }
      
      .hero-stats {
        padding-top: 1.5rem;
      }
      
      .stat-number {
        font-size: 1.5rem;
      }

      .hero-stats .row {
        justify-content: center;
        row-gap: 1rem;
      }
      
      .hero-image {
        height: 350px;
        margin-top: 2rem;
      }
      
      .floating-card {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        min-height: auto;
        padding: 1.75rem 0 2rem;
      }

      .hero-content {
        text-align: center;
      }
      
      .hero-title {
        font-size: 2rem;
        line-height: 1.3;
      }
      
      .hero-subtitle {
        font-size: 1rem;
        margin-bottom: 1.25rem;
      }
      
      .hero-actions .btn {
        padding: 0.6rem 1.25rem;
        font-size: 0.9rem;
      }

      .hero-actions {
        align-items: center;
      }
      
      .hero-stats {
        padding-top: 1.25rem;
      }
      
      .stat-number {
        font-size: 1.25rem;
      }
      
      .stat-label {
        font-size: 0.8rem;
      }
      
      .hero-image {
        height: 250px;
        margin-top: 1.5rem;
      }
      
      .section-title {
        font-size: 1.75rem;
      }
      
      .category-card {
        margin-bottom: 1rem;
      }
      
      .category-title {
        font-size: 1rem;
      }
      
      .category-description {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 576px) {
      .hero-section {
        min-height: auto;
        padding: 1.5rem 0 1.75rem;
      }
      
      .hero-title {
        font-size: 1.75rem;
        margin-bottom: 0.75rem;
      }
      
      .hero-subtitle {
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      
      .hero-actions .btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }
      
      .hero-stats {
        padding-top: 1rem;
      }
      
      .stat-number {
        font-size: 1.1rem;
      }
      
      .stat-label {
        font-size: 0.75rem;
      }
      
      .hero-image {
        height: 200px;
        margin-top: 1rem;
      }

      .hero-content {
        text-align: center;
      }
      
      .section-title {
        font-size: 1.5rem;
      }
      
      .category-card {
        padding: 1rem;
      }
      
      .category-title {
        font-size: 0.9rem;
      }
      
      .category-description {
        font-size: 0.8rem;
      }
      
      .feature-card {
        padding: 1.25rem;
        margin-bottom: 1rem;
      }
      
      .feature-icon {
        width: 50px;
        height: 50px;
        font-size: 1.25rem;
      }
      
      .feature-title {
        font-size: 1rem;
      }
      
      .feature-description {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .hero-section {
        padding: 1.25rem 0 1.5rem;
      }
      
      .hero-actions {
        width: 100%;
      }

      .hero-stats .row {
        row-gap: 1.5rem;
      }

      .stat-item {
        text-align: center;
      }
    }

    /* UTILITY CLASSES */
    .min-vh-75 {
      min-height: 75vh;
    }
  `]
})
export class HomeComponent implements OnInit {
  private categoriesApi = inject(CategoryService);

  categories: Category[] = [];
  loading = true;
  placeholder = 'assets/placeholder-4x3.png';
  skeleton = Array.from({ length: 8 });

  // Removed hero images as we're using floating cards instead


  ngOnInit(): void {
    this.categoriesApi.getCategories().subscribe({
      next: (res) => { this.categories = (res || []) as Category[]; this.loading = false; },
      error: () => { this.loading = false; this.categories = []; }
    });
  }

  trackById = (_: number, c: Category) => c._id;

  catImg(c: Category): string | null {
    const img = c?.image as any;
    if (!img) return null;
    return typeof img === 'string' ? img : (img.url || null);
  }

  getDescription(c: Category): string {
    return c.description || `Explore our ${c.name} solutions`;
  }

}
