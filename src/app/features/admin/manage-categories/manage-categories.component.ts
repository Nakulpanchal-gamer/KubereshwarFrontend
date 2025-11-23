import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../../core/services/category.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { UploadService } from '../../../core/services/upload.service';

// Align with your models: Category.image is { url, publicId } | null going forward.
type ImageRef = { url: string; publicId?: string | null };
type CategoryVM = {
  _id?: string;
  name: string;
  description?: string;
  image: ImageRef | null;     // normalized for UI
  // UI-only helpers (manual URL input & staged preview per row)
  imageInput?: string;
};

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .thead-sticky { position: sticky; top: 0; z-index: 1; }
    .img-64x48 { width: 64px; height: 48px; object-fit: cover; }
    .img-96x72 { width: 96px; height: 72px; object-fit: cover; }
    .img-120x90 { width: 120px; height: 90px; object-fit: cover; }
    .w-80px { width: 80px; }
    .w-160px { width: 160px; }
    .w-22pct { width: 22%; }
    .truncate-2 {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
  template: `
<div class="mb-4">
  <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
    <h4 class="mb-0">Manage Categories</h4>

    <div class="ms-auto d-flex gap-2">
      <input class="form-control form-control-sm" style="min-width:260px"
             placeholder="Search name or description…"
             [(ngModel)]="filter.q" (ngModelChange)="applyFilters()">
      <button class="btn btn-sm btn-outline-secondary" (click)="resetFilters()">Reset</button>
    </div>
  </div>

  <!-- Add new -->
  <form class="row g-2 align-items-center mb-3" (ngSubmit)="createCategory()">
    <div class="col-md-3">
      <input class="form-control form-control-sm" placeholder="Name"
             [(ngModel)]="newCat.name" name="name" autocomplete="off">
    </div>

    <div class="col-md-4">
      <input class="form-control form-control-sm" placeholder="Description (optional)"
             [(ngModel)]="newCat.description" name="desc" autocomplete="off">
    </div>

    <div class="col-md-3">
      <input class="form-control form-control-sm" placeholder="Image URL (optional)"
             [(ngModel)]="newCat.imageInput" name="img" autocomplete="off">
    </div>

    <div class="col-8 col-md-1">
      <input class="form-control form-control-sm input-file-sm" type="file" accept="image/*"
             (change)="onPickNewCatImage($event)">
    </div>

    <div class="col-4 col-md-1 d-grid">
      <button class="btn btn-sm btn-primary" type="submit"
              [disabled]="creating || !newCat.name?.trim()">
        <span *ngIf="!creating">Add</span>
        <span *ngIf="creating" class="spinner-border spinner-border-sm"></span>
      </button>
    </div>

    <!-- Staged preview -->
    <div class="col-12" *ngIf="newCatPreview">
      <div class="d-inline-block position-relative mt-2">
        <img [src]="newCatPreview" class="rounded border img-120x90" alt="staged">
        <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                (click)="removeNewCatStaged()">×</button>
      </div>
      <small class="text-muted d-block">Image uploads when you click Add.</small>
    </div>
  </form>
</div>

<!-- ===== Desktop/Tablet table (md and up) ===== -->
<div class="table-responsive d-none d-md-block">
  <table class="table table-sm table-bordered table-hover align-middle mb-0">
    <thead class="table-light thead-sticky">
      <tr>
        <th class="w-80px">Image</th>
        <th class="w-22pct">
          <button class="btn btn-link p-0 text-decoration-none" (click)="toggleSort('name')">
            Name <small class="text-muted">{{ sortIcon('name') }}</small>
          </button>
        </th>
        <th>
          <button class="btn btn-link p-0 text-decoration-none" (click)="toggleSort('description')">
            Description <small class="text-muted">{{ sortIcon('description') }}</small>
          </button>
        </th>
        <th class="w-160px">Actions</th>
      </tr>
    </thead>

    <tbody *ngIf="!loading && paged.length; else stateTpl">
      <tr *ngFor="let cat of paged; trackBy: trackById">
        <td>
          <img *ngIf="cat.image?.url" [src]="cat.image!.url" alt="cat"
               class="rounded border img-64x48">
        </td>

        <td>
          <input class="form-control form-control-sm"
                 [(ngModel)]="cat.name" name="n{{cat._id}}">
        </td>

        <td>
          <div class="row g-2">
            <div class="col-12">
              <input class="form-control form-control-sm" placeholder="Description"
                     [(ngModel)]="cat.description" name="d{{cat._id}}">
            </div>
            <div class="col-12">
              <input class="form-control form-control-sm" placeholder="Image URL (manual)"
                     [(ngModel)]="cat.imageInput" name="i{{cat._id}}">
            </div>
            <div class="col-12 d-flex align-items-center gap-2">
              <input class="form-control form-control-sm input-file-sm" type="file" accept="image/*"
                     (change)="onPickRowImage($event, cat._id!)">

              <ng-container *ngIf="rowPreviewMap.get(cat._id!) as rowPrev">
                <div class="position-relative">
                  <img [src]="rowPrev" class="rounded border img-96x72" alt="staged row">
                  <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                          (click)="removeRowStaged(cat._id!)">×</button>
                </div>
                <small class="text-muted">Uploads on Save.</small>
              </ng-container>
            </div>
          </div>
        </td>

        <td class="text-nowrap">
          <button class="btn btn-sm btn-outline-primary me-1"
                  (click)="updateCategory(cat)" [disabled]="savingId===cat._id">
            <span *ngIf="savingId!==cat._id">Save</span>
            <span *ngIf="savingId===cat._id" class="spinner-border spinner-border-sm"></span>
          </button>

          <button class="btn btn-sm btn-outline-danger"
                  (click)="deleteCategory(cat._id!)" [disabled]="deletingId===cat._id">
            <span *ngIf="deletingId!==cat._id">Delete</span>
            <span *ngIf="deletingId===cat._id" class="spinner-border spinner-border-sm"></span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ===== Mobile cards (under md) ===== -->
<div class="d-md-none">
  <ng-container *ngIf="!loading && paged.length; else stateTpl">
    <div class="card mb-2" *ngFor="let cat of paged; trackBy: trackById">
      <div class="card-body">
        <div class="d-flex align-items-start gap-2 mb-2">
          <img *ngIf="cat.image?.url" [src]="cat.image!.url" alt="cat" class="rounded border img-64x48">
          <div class="flex-grow-1">
            <input class="form-control form-control-sm mb-2"
                   [(ngModel)]="cat.name" name="mn{{cat._id}}" placeholder="Name">
            <input class="form-control form-control-sm mb-2"
                   [(ngModel)]="cat.description" name="md{{cat._id}}" placeholder="Description">
          </div>
        </div>

        <input class="form-control form-control-sm mb-2" placeholder="Image URL (manual)"
               [(ngModel)]="cat.imageInput" name="mi{{cat._id}}">

        <div class="d-flex align-items-center gap-2 mb-2">
          <input class="form-control form-control-sm input-file-sm" type="file" accept="image/*"
                 (change)="onPickRowImage($event, cat._id!)">
          <ng-container *ngIf="rowPreviewMap.get(cat._id!) as rowPrev">
            <div class="position-relative">
              <img [src]="rowPrev" class="rounded border img-96x72" alt="staged row">
              <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                      (click)="removeRowStaged(cat._id!)">×</button>
            </div>
          </ng-container>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-sm btn-outline-primary"
                  (click)="updateCategory(cat)" [disabled]="savingId===cat._id">
            <span *ngIf="savingId!==cat._id">Save</span>
            <span *ngIf="savingId===cat._id" class="spinner-border spinner-border-sm"></span>
          </button>
          <button class="btn btn-sm btn-outline-danger"
                  (click)="deleteCategory(cat._id!)" [disabled]="deletingId===cat._id">
            <span *ngIf="deletingId!==cat._id">Delete</span>
            <span *ngIf="deletingId===cat._id" class="spinner-border spinner-border-sm"></span>
          </button>
        </div>
      </div>
    </div>
  </ng-container>
</div>

<!-- Shared state template -->
<ng-template #stateTpl>
  <div class="p-3" *ngIf="loading">
    <span class="text-muted">Loading categories…</span>
  </div>
  <div class="alert alert-secondary m-0" *ngIf="!loading && !paged.length">
    No categories found.
  </div>
</ng-template>

<!-- Pagination -->
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

    <nav aria-label="Categories pagination">
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
export class ManageCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toast = inject(ToasterService);
  private uploader = inject(UploadService);

  // source + derived
  categories: CategoryVM[] = []; // full dataset
  filtered: CategoryVM[] = [];
  paged: CategoryVM[] = [];

  loading = true;
  creating = false;
  savingId: string | null = null;
  deletingId: string | null = null;

  // Add-new staged file + preview
  newCat: CategoryVM & { imageInput?: string } = { name: '', description: '', image: null, imageInput: '' };
  private newCatFile: File | null = null;
  newCatPreview: string | null = null;

  // Per-row staged file + preview
  private rowFileMap = new Map<string, File>();
  rowPreviewMap = new Map<string, string>();

  // search/sort/paging
  filter = { q: '' };
  sortKey: 'name' | 'description' | '' = '';
  sortDir: 'asc' | 'desc' | '' = '';
  page = 1;
  pageSize = 10;
  pageSizes = [10, 25, 50];
  totalPages = 1;
  startIndex = 0;
  endIndex = 0;

  ngOnInit(): void { this.loadCategories(); }

  trackById = (_: number, x: any) => x?._id;

  private normalize(c: any): CategoryVM {
    const img: ImageRef | null =
      c?.image == null
        ? null
        : typeof c.image === 'string'
          ? { url: c.image, publicId: null }
          : (c.image?.url ? { url: c.image.url, publicId: c.image.publicId ?? null } : null);

    return {
      _id: c?._id,
      name: c?.name ?? '',
      description: c?.description ?? '',
      image: img,
      imageInput: ''
    };
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories = (res || []).map(x => this.normalize(x));
        // default sort by name asc
        this.sortKey = 'name'; this.sortDir = 'asc';
        this.applyFilters();
        this.loading = false;
      },
      error: _ => { this.loading = false; this.toast.loadFailed('categories'); }
    });
  }

  // ---------- Add new (deferred upload) ----------
  onPickNewCatImage(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.clearNewCatPreview();
    this.newCatFile = file;
    this.newCatPreview = URL.createObjectURL(file);
    this.toast.info('Image staged. It will upload when you click Add.');
    if (input) input.value = '';
  }

  removeNewCatStaged(): void {
    this.clearNewCatPreview();
    this.newCatFile = null;
  }

  private clearNewCatPreview(): void {
    if (this.newCatPreview) URL.revokeObjectURL(this.newCatPreview);
    this.newCatPreview = null;
  }

  async createCategory() {
    const name = (this.newCat.name || '').trim();
    if (!name) return;

    this.creating = true;

    try {
      let image: ImageRef | null = null;

      if (this.newCatFile) {
        this.toast.info('Uploading category image…');
        const up = await this.uploader.uploadFile(this.newCatFile); // {url, publicId}
        image = { url: up.url, publicId: (up as any).publicId ?? (up as any).public_id ?? null };
      } else if (this.newCat.imageInput?.trim()) {
        image = { url: this.newCat.imageInput.trim(), publicId: null };
      }

      const payload: any = {
        name,
        description: (this.newCat.description || '').trim(),
        image: image || null
      };

      await new Promise<void>((resolve, reject) =>
        this.categoryService.createCategory(payload).subscribe({
          next: () => resolve(),
          error: (e) => reject(e)
        })
      );

      this.toast.saved('Category');
      this.newCat = { name: '', description: '', image: null, imageInput: '' };
      this.removeNewCatStaged();
      this.loadCategories();

    } catch (_) {
      this.toast.actionFailed('Add category');
    } finally {
      this.creating = false;
    }
  }

  // ---------- Existing row (optional deferred upload) ----------
  onPickRowImage(evt: Event, id: string): void {
    const input = evt.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !id) return;

    const prev = this.rowPreviewMap.get(id);
    if (prev) URL.revokeObjectURL(prev);

    this.rowFileMap.set(id, file);
    const previewUrl = URL.createObjectURL(file);
    this.rowPreviewMap.set(id, previewUrl);
    this.toast.info('Image staged for this category. It will upload on Save.');

    if (input) input.value = '';
  }

  removeRowStaged(id: string): void {
    const prev = this.rowPreviewMap.get(id);
    if (prev) URL.revokeObjectURL(prev);
    this.rowPreviewMap.delete(id);
    this.rowFileMap.delete(id);
  }

  async updateCategory(cat: CategoryVM) {
    if (!cat?._id) return;
    this.savingId = cat._id;

    try {
      let image: ImageRef | null | undefined = undefined; // undefined => don't change
      const staged = this.rowFileMap.get(cat._id);
      if (staged) {
        this.toast.info('Uploading category image…');
        const up = await this.uploader.uploadFile(staged);
        image = { url: up.url, publicId: (up as any).publicId ?? (up as any).public_id ?? null };
      } else if (typeof cat.imageInput === 'string') {
        const manual = (cat.imageInput || '').trim();
        image = manual ? { url: manual, publicId: null } : null;
      }

      const payload: any = {
        name: (cat.name || '').trim(),
        description: (cat.description || '').trim()
      };
      if (image !== undefined) payload.image = image;

      await new Promise<void>((resolve, reject) =>
        this.categoryService.updateCategory(cat._id!, payload).subscribe({
          next: () => resolve(),
          error: (e) => reject(e)
        })
      );

      this.toast.updated('Category');
      this.removeRowStaged(cat._id!);
      this.loadCategories();

    } catch (_) {
      this.toast.actionFailed('Update category');
    } finally {
      this.savingId = null;
    }
  }

  // ---------- Delete ----------
  deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    this.deletingId = id;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c._id !== id);
        this.applyFilters(); // keep paging consistent
        this.toast.deleted('Category');
        this.deletingId = null;
        this.removeRowStaged(id);
      },
      error: () => { this.toast.actionFailed('Delete category'); this.deletingId = null; }
    });
  }

  // ---------- Search / Sort / Pagination ----------
  resetFilters() {
    this.filter.q = '';
    this.applyFilters();
  }

  applyFilters() {
    const q = this.filter.q.trim().toLowerCase();
    this.filtered = this.categories.filter(cat => {
      if (!q) return true;
      const hay = [cat.name, cat.description].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });

    // re-apply sort & paginate
    this.sortAndPaginate(true);
  }

  toggleSort(key: 'name' | 'description') {
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

  sortIcon(key: 'name' | 'description'): string {
    if (this.sortKey !== key) return '—';
    return this.sortDir === 'asc' ? '↑' : this.sortDir === 'desc' ? '↓' : '—';
  }

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
}
