import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/products.service';

type Category = { _id: string; name: string };
type Product  = { _id: string; name: string };

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-xxl">
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <div class="brand-logo me-2">
            <i class="fas fa-cogs text-primary"></i>
          </div>
          <div class="brand-text">
            <div class="brand-name">Kubereshwar</div>
            <div class="brand-tagline">Machine Products</div>
          </div>
        </a>

        <!-- Mobile Toggle -->
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Menu -->
        <div id="navMain" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <!-- Home -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-home me-1"></i>Home
              </a>
            </li>

            <!-- Products Mega Menu -->
            <li class="nav-item dropdown position-static"
                (mouseenter)="onHover(true)"
                (mouseleave)="onHover(false)">
              <a class="nav-link dropdown-toggle"
                href="javascript:void(0)"
                [class.show]="megaOpen"
                (click)="toggleMega()">
                <i class="fas fa-th-large me-1"></i>Products
              </a>

              <div class="dropdown-menu mega-menu p-0" [class.show]="megaOpen">
                <div class="mega-container">
                  <div class="row g-0">
                    <!-- Categories Sidebar -->
                    <div class="col-12 col-lg-4">
                      <div class="categories-sidebar">
                        <div class="sidebar-header">
                          <h6 class="sidebar-title">
                            <i class="fas fa-list me-2"></i>Categories
                          </h6>
                          <a class="view-all-link" [routerLink]="['/products']" (click)="closeMega()">
                            View all <i class="fas fa-arrow-right"></i>
                          </a>
                        </div>
                        <div class="category-list">
                          <button
                            *ngFor="let c of categories; trackBy: trackById"
                            type="button"
                            class="category-item"
                            [class.active]="activeCatId===c._id"
                            (mouseenter)="selectCategory(c._id)"
                            (click)="selectCategory(c._id)">
                            <i class="fas fa-folder me-2"></i>
                            {{ c.name }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Products Preview -->
                    <div class="col-12 col-lg-8">
                      <div class="products-preview">
                        <div class="preview-header">
                          <h6 class="preview-title">
                            <i class="fas fa-box me-2"></i>{{ categoryName(activeCatId) }}
                          </h6>
                          <a class="view-category-link"
                             *ngIf="activeCatId"
                             [routerLink]="['/products']" 
                             [queryParams]="{ category: activeCatId }"
                             (click)="closeMega()">
                            View all <i class="fas fa-arrow-right"></i>
                          </a>
                        </div>

                        <div class="preview-content">
                          <div *ngIf="!activeCatId" class="empty-state">
                            <i class="fas fa-mouse-pointer text-muted"></i>
                            <p class="text-muted">Select a category to preview products</p>
                          </div>
                          
                          <div *ngIf="activeCatId && loadingProducts.has(activeCatId)" class="loading-state">
                            <div class="spinner-border spinner-border-sm me-2"></div>
                            Loading products...
                          </div>

                          <div *ngIf="activeCatId && !loadingProducts.has(activeCatId)" class="products-grid">
                            <div class="product-item"
                                 *ngFor="let p of (productsByCat[activeCatId] ?? []).slice(0, 8); trackBy: trackById">
                              <a class="product-link"
                                 [routerLink]="['/product', p._id]"
                                 (click)="closeMega()">
                                <i class="fas fa-cog me-2"></i>
                                {{ p.name }}
                              </a>
                            </div>
                            <div *ngIf="(productsByCat[activeCatId] ?? []).length === 0"
                                 class="empty-products">
                              <i class="fas fa-box-open text-muted"></i>
                              <p class="text-muted">No products available</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <!-- About -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/about" routerLinkActive="active">
                <i class="fas fa-info-circle me-1"></i>About
              </a>
            </li>

            <!-- Contact -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/contact" routerLinkActive="active">
                <i class="fas fa-envelope me-1"></i>Contact
              </a>
            </li>

            <!-- CTA Button -->
            <li class="nav-item ms-lg-3">
              <a class="btn btn-primary" routerLink="/contact">
                <i class="fas fa-phone me-1"></i>Get Quote
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    /* NAVBAR STYLES */
    .navbar {
      padding: 1rem 0;
      transition: all 0.3s ease;
    }

    .navbar-brand {
      text-decoration: none;
      color: #333;
      font-weight: 700;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
    }

    .brand-text {
      margin-left: 0.5rem;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
      line-height: 1;
    }

    .brand-tagline {
      font-size: 0.75rem;
      color: #666;
      font-weight: 500;
      line-height: 1;
    }

    .nav-link {
      color: #333 !important;
      font-weight: 500;
      padding: 0.75rem 1rem !important;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link:hover {
      background: var(--color-secondary-light);
      color: var(--color-primary) !important;
    }

    .nav-link.active {
      background: var(--color-primary);
      color: white !important;
    }

    .nav-link i {
      font-size: 0.9rem;
    }

    /* MEGA MENU */
    .mega-menu {
      left: 0;
      right: 0;
      top: 100%;
      position: absolute;
      z-index: 1050;
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border-radius: 0 0 15px 15px;
      overflow: hidden;
    }

    .mega-menu::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: -8px;
      height: 8px;
    }

    .mega-container {
      background: white;
      min-height: 400px;
    }

    /* CATEGORIES SIDEBAR */
    .categories-sidebar {
      background: #f8f9fa;
      padding: 2rem;
      height: 100%;
      min-height: 400px;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .sidebar-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .view-all-link {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .view-all-link:hover {
      color: var(--color-primary-dark);
    }

    .category-list {
      max-height: 300px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .category-item {
      width: 100%;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      border: 1px solid #e9ecef;
      background: white;
      border-radius: 8px;
      text-align: left;
      transition: all 0.3s ease;
      color: #333;
      font-weight: 500;
    }

    .category-item:hover {
      border-color: var(--color-primary);
      background: var(--color-secondary-light);
      transform: translateX(5px);
    }

    .category-item.active {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: white;
    }

    .category-item i {
      color: var(--color-primary);
    }

    .category-item.active i {
      color: white;
    }

    /* PRODUCTS PREVIEW */
    .products-preview {
      padding: 2rem;
      background: white;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .preview-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .view-category-link {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .view-category-link:hover {
      color: var(--color-primary-dark);
    }

    .preview-content {
      min-height: 200px;
    }

    .empty-state,
    .loading-state,
    .empty-products {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #666;
    }

    .empty-state i,
    .empty-products i {
      font-size: 2rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .product-item {
      margin-bottom: 0.5rem;
    }

    .product-link {
      display: block;
      padding: 0.75rem 1rem;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .product-link:hover {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(14, 116, 144, 0.3);
    }

    .product-link i {
      color: var(--color-primary);
    }

    .product-link:hover i {
      color: white;
    }

    /* CTA BUTTON */
    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      border: none;
      border-radius: 25px;
      padding: 0.5rem 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(14, 116, 144, 0.4);
    }

    /* CHEVRON ROTATION */
    .rotate {
      transform: rotate(180deg);
    }

    /* RESPONSIVE */
    @media (max-width: 991.98px) {
      .mega-menu {
        position: static;
        box-shadow: none;
        border-radius: 0;
      }

      .mega-container {
        min-height: auto;
      }

      .categories-sidebar {
        padding: 1rem;
        min-height: auto;
      }

      .products-preview {
        padding: 1rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .navbar-brand {
        flex-direction: column;
        align-items: flex-start;
      }

      .brand-text {
        margin-left: 0;
        margin-top: 0.25rem;
      }

      .brand-name {
        font-size: 1.1rem;
      }

      .brand-tagline {
        font-size: 0.7rem;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  private categoriesApi = inject(CategoryService);
  private productsApi = inject(ProductService);

  // in NavbarComponent
hoverCloseTimer?: any;

onHover(inside: boolean) {
  if (inside) {
    if (this.hoverCloseTimer) { clearTimeout(this.hoverCloseTimer); this.hoverCloseTimer = undefined; }
    this.megaOpen = true;
    return;
  }
  // small delay avoids flicker when crossing tiny gaps
  this.hoverCloseTimer = setTimeout(() => {
    this.megaOpen = false;
    this.hoverCloseTimer = undefined;
  }, 180); // 150–250ms is typical
}

// replace old handlers:
openMega()  { this.onHover(true); }
closeMega() { this.onHover(false); }



  categories: Category[] = [];
  productsByCat: Record<string, Product[]> = {};
  loadingProducts = new Set<string>();

  megaOpen = false;
  activeCatId: string | null = null;  // current selection in mega

  ngOnInit(): void {
    this.categoriesApi.getCategories().subscribe({
      next: cs => {
        this.categories = cs ?? [];
        // default to first category when opening
        if (!this.activeCatId && this.categories.length) {
          this.activeCatId = this.categories[0]._id;
          this.ensureLoaded(this.activeCatId);
        }
      },
      error: () => this.categories = []
    });
  }

  trackById = (_: number, x: { _id: string }) => x._id;
  toggleMega()      { this.megaOpen = !this.megaOpen; }

  selectCategory(id: string) {
    if (this.activeCatId !== id) {
      this.activeCatId = id;
      this.ensureLoaded(id);
    }
  }

  ensureLoaded(id: string | null) {
    if (!id) return;
    if (this.productsByCat[id] || this.loadingProducts.has(id)) return;
    this.loadingProducts.add(id);
    this.productsApi.getProducts({ category: id }).subscribe({
      next: ps => {
        const list = (ps ?? [])
          .map(p => ({ _id: p._id, name: (p.name ?? '').trim() }))
          .filter((p, i, arr) =>
            p.name && arr.findIndex(x => x.name.toLowerCase() === p.name.toLowerCase()) === i);
        this.productsByCat[id] = list;
        this.loadingProducts.delete(id);
      },
      error: () => { this.productsByCat[id] = []; this.loadingProducts.delete(id); }
    });
  }

  categoryName(id: string | null): string {
    if (!id) return 'Category';
    return this.categories.find(x => x._id === id)?.name ?? 'Category';
  }
}
