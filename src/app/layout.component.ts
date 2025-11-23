import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { FloatingActionsComponent } from "./floating-actions.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, FloatingActionsComponent],
  template: `
<div class="d-flex flex-column min-vh-100">
  <app-navbar *ngIf="showHeaderFooter"></app-navbar>
  <main class="py-4 flex-grow-1"><router-outlet></router-outlet></main>
  <app-footer *ngIf="showHeaderFooter"></app-footer>
  <app-floating-actions *ngIf="showHeaderFooter"
    [phone]="'9426063375'"
    [message]="'Hello, I am interested in Kubereshwar products.'">
  </app-floating-actions>
</div>
  `
})
export class LayoutComponent {
  private router = inject(Router);
  showHeaderFooter = true;

  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.showHeaderFooter = !e.url.startsWith('/admin');
      }
    });
  }
}
