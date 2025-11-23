import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products.service';
import { ToasterService } from '../../../core/services/toaster.service';

type ImageLike = string | { url?: string };
type CategoryLike = { name?: string } | string | null | undefined;

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styles: [`
    .thead-sticky { position: sticky; top: 0; z-index: 1; }
    .img-64x48 { width: 64px; height: 48px; object-fit: cover; }
    .w-80px { width: 80px; }
    .w-160px { width: 160px; }
    .w-22pct { width: 22%; }
    .w-18pct { width: 18%; }
    .truncate-2 {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
  template: `
<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
  <h4 class="mb-0">Manage Products</h4>
  <div class="d-flex gap-2 ms-auto">
    <input type="search" class="form-control form-control-sm" style="min-width:260px"
           placeholder="Search name, SKU, category…"
           [(ngModel)]="filter.q" (ngModelChange)="applyFilters()">
    <button class="btn btn-sm btn-outline-secondary" (click)="resetFilters()">Reset</button>
    <a class="btn btn-primary btn-sm" [routerLink]="['/admin/dashboard/products/add']">+ Add New Product</a>
  </div>
</div>

<!-- ===== Desktop/Tablet table (md and up) ===== -->
<div class="table-responsive d-none d-md-block">
  <table class="table table-sm table-bordered table-striped table-hover align-middle mb-0">
    <thead class="table-light thead-sticky">
      <tr>
        <th class="w-80px">Image</th>
        <th class="w-22pct">
          <button class="btn btn-link p-0 text-decoration-none" (click)="toggleSort('name')">
            Name <small class="text-muted">{{ sortIcon('name') }}</small>
          </button>
        </th>
        <th class="w-18pct">
          <button class="btn btn-link p-0 text-decoration-none" (click)="toggleSort('categoryName')">
            Category <small class="text-muted">{{ sortIcon('categoryName') }}</small>
          </button>
        </th>
        <th>Short Description</th>
        <th class="w-160px">Actions</th>
      </tr>
    </thead>

    <tbody *ngIf="!loading && paged.length; else stateTpl">
      <tr *ngFor="let p of paged; trackBy: trackById">
        <td>
          <img *ngIf="firstImageUrl(p) as src" [src]="src" alt="thumb" class="rounded border img-64x48">
        </td>
        <td class="fw-medium">{{ p.name }}</td>
        <td>{{ p.categoryName || '—' }}</td>
        <td class="text-muted small">
          <div class="truncate-2" [title]="p.shortDesc || p.description">
            {{ p.shortDesc || (p.description?.slice(0, 80) + (p.description?.length > 80 ? '…' : '')) }}
          </div>
        </td>
        <td class="text-nowrap">
          <a class="btn btn-sm btn-outline-primary me-1"
             [routerLink]="['/admin/dashboard/products/edit', p._id]">Edit</a>
          <button class="btn btn-sm btn-outline-danger"
                  (click)="deleteProduct(p._id)" [disabled]="deletingId===p._id">
            <span *ngIf="deletingId!==p._id">Delete</span>
            <span *ngIf="deletingId===p._id" class="spinner-border spinner-border-sm"></span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ===== Mobile cards (under md) ===== -->
<div class="d-md-none">
  <ng-container *ngIf="!loading && paged.length; else stateTpl">
    <div class="card mb-2" *ngFor="let p of paged; trackBy: trackById">
      <div class="card-body">
        <div class="d-flex align-items-start gap-2 mb-2">
          <img *ngIf="firstImageUrl(p) as src" [src]="src" alt="thumb" class="rounded border img-64x48">
          <div class="flex-grow-1">
            <div class="fw-semibold">{{ p.name }}</div>
            <div class="text-muted small">{{ p.categoryName || '—' }}</div>
          </div>
        </div>

        <p class="text-muted small mb-3">
          {{ p.shortDesc || (p.description?.slice(0, 120) + (p.description && p.description.length > 120 ? '…' : '')) }}
        </p>

        <div class="d-flex justify-content-end gap-2">
          <a class="btn btn-sm btn-outline-primary"
             [routerLink]="['/admin/dashboard/products/edit', p._id]">Edit</a>
          <button class="btn btn-sm btn-outline-danger"
                  (click)="deleteProduct(p._id)" [disabled]="deletingId===p._id">
            <span *ngIf="deletingId!==p._id">Delete</span>
            <span *ngIf="deletingId===p._id" class="spinner-border spinner-border-sm"></span>
          </button>
        </div>
      </div>
    </div>
  </ng-container>
</div>

<!-- Shared state -->
<ng-template #stateTpl>
  <div class="p-3" *ngIf="loading">
    <span class="text-muted">Loading products…</span>
  </div>
  <div class="alert alert-secondary m-0" *ngIf="!loading && !paged.length">
    No products found.
  </div>
</ng-template>

<!-- Pagination bar -->
<div class="d-flex flex-wrap align-items-center gap-2 mt-3" *ngIf="!loading && filtered.length">
  <div class="text-muted small me-auto">
    Showing <strong>{{ startIndex + 1 }}</strong>–<strong>{{ endIndex }}</strong>
    of <strong>{{ filtered.length }}</strong>
  </div>

  <div class="d-flex align-items-center gap-2">
    <label class="small text-muted">Rows per page</label>
    <select class="form-select form-select-sm w-auto"
            [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange($event)">
      <option *ngFor="let s of pageSizes" [value]="s">{{ s }}</option>
    </select>

    <nav aria-label="Products pagination">
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" [class.disabled]="page === 1">
          <button class="page-link" (click)="prevPage()" [disabled]="page === 1">«</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">{{ page }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" [class.disabled]="page === totalPages">
          <button class="page-link" (click)="nextPage()" [disabled]="page === totalPages">»</button>
        </li>
      </ul>
    </nav>
  </div>
</div>
  `
})
export class ManageProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toast = inject(ToasterService);

  // source + derived
  private all: any[] = [];
  filtered: any[] = [];
  paged: any[] = [];

  // state
  loading = true;
  deletingId: string | null = null;

  // filters
  filter = { q: '' };

  // sort
  sortKey: 'name' | 'categoryName' | '' = '';
  sortDir: 'asc' | 'desc' | '' = '';

  // pagination
  page = 1;
  pageSize = 10;
  pageSizes = [10, 25, 50];
  totalPages = 1;
  startIndex = 0;
  endIndex = 0;

  ngOnInit(): void { this.loadProducts(); }

  trackById = (_: number, x: any) => x?._id;

  firstImageUrl(p: { images?: ImageLike[] } | any): string | null {
    if (!p?.images?.length) return null;
    const first = p.images[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && (first as any).url) return (first as any).url as string;
    return null;
  }

  // --- data load ---
  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (rows: any[]) => {
        // derive categoryName for sorting/search
        this.all = (rows || []).map(p => ({
          ...p,
          categoryName: typeof p?.category === 'string'
            ? p.category
            : (p?.category as CategoryLike && (p.category as any)?.name) || ''
        }));
        // optional: initial sort by name asc
        this.sortKey = 'name'; this.sortDir = 'asc';
        this.applyFilters();
        this.loading = false;
      },
      error: _ => { this.loading = false; this.toast.loadFailed('products'); }
    });
  }

  // --- filters/search ---
  resetFilters() {
    this.filter.q = '';
    this.applyFilters();
  }

  applyFilters() {
    const q = this.filter.q.trim().toLowerCase();
    this.filtered = this.all.filter(p => {
      if (!q) return true;
      const hay = [
        p.name, p.sku, p.categoryName, p.shortDesc, p.description
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });

    // re-apply sort and paginate
    this.sortAndPaginate(true);
  }

  // --- sort ---
  toggleSort(key: 'name' | 'categoryName') {
    if (this.sortKey !== key) {
      this.sortKey = key; this.sortDir = 'asc';
    } else {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : this.sortDir === 'desc' ? '' : 'asc';
      if (!this.sortDir) this.sortKey = '';
    }
    this.sortAndPaginate(true);
  }

  private sortAndPaginate(resetPage = false) {
    let rows = this.filtered.slice();
    if (this.sortKey && this.sortDir) {
      const k = this.sortKey;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      rows.sort((a: any, b: any) =>
        String(a?.[k] ?? '').localeCompare(String(b?.[k] ?? '')) * dir
      );
    }
    this.filtered = rows;
    if (resetPage) this.page = 1;
    this.repaginate();
  }

  sortIcon(key: 'name' | 'categoryName'): string {
    if (this.sortKey !== key) return '—';
    return this.sortDir === 'asc' ? '↑' : this.sortDir === 'desc' ? '↓' : '—';
  }

  // --- pagination ---
  onPageSizeChange(_: number) {
    this.page = 1;
    this.repaginate();
  }

  prevPage() { if (this.page > 1) { this.page--; this.repaginate(); } }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.repaginate(); } }

  private repaginate() {
    const total = this.filtered.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > this.totalPages) this.page = this.totalPages;
    this.startIndex = (this.page - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, total);
    this.paged = this.filtered.slice(this.startIndex, this.endIndex);
  }

  // --- delete ---
  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.deletingId = id;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.all = this.all.filter(p => p._id !== id);
        this.applyFilters();
        this.toast.deleted('Product');
        this.deletingId = null;
      },
      error: () => { this.toast.actionFailed('Delete product'); this.deletingId = null; }
    });
  }
}
