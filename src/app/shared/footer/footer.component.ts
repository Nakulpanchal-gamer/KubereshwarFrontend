// shared/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

<footer class="app-footer footer-dark mt-auto">
  <div class="container-xxl py-5">

    <!-- Top: 5 responsive columns -->
    <div class="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-5">

      <!-- Col 1: Certificates + Global Presence + Admin (admin at last, left) -->
      <div class="col">
        <h6 class="fw-semibold mb-3">Certificates</h6>
        <ul class="list-unstyled small mb-4">
          <li><a class="footer-link" routerLink="/certificates">View Certificates</a></li>
        </ul>

        <h6 class="fw-semibold mb-3">Global Presence</h6>
        <p class="small text-secondary mb-3">US | Spain | Singapore | Malaysia</p>

        <!-- Admin button (as requested: last item at left) -->
        <a class="btn btn-sm btn-outline-light px-3 d-inline-flex align-items-center gap-2"
           routerLink="/admin/login" aria-label="Admin section">
          <i class="fa-solid fa-user-tie"></i> Admin
        </a>
      </div>

      <!-- Col 2: Quick Links (only the marked) + Catalogue -->
      <div class="col">
        <h6 class="fw-semibold mb-3">Quick Links</h6>
        <ul class="list-unstyled small mb-4">
          <li><a class="footer-link" routerLink="/certificates">Certificates</a></li>
          <li><a class="footer-link" routerLink="/complaint">Complaint Registration</a></li>
        </ul>

      </div>

      <!-- Col 3: About -->
      <div class="col">
        <h6 class="fw-semibold mb-3">About kubereshwar</h6>
        <ul class="list-unstyled small">
          <li><a class="footer-link" routerLink="/about">About Us</a></li>
          <li><a class="footer-link" routerLink="/contact">Contact Us</a></li>
          <li><a class="footer-link" routerLink="/blog">Our Blog</a></li>
          <li><a class="footer-link" routerLink="/clients">Our Clients</a></li>
        </ul>
      </div>

      <!-- Col 4: Pan India Presence -->
      <div class="col">
        <h6 class="fw-semibold mb-3">Pan India Presence</h6>
        <p class="small text-secondary mb-0">
          Gurgaon | Ahmedabad | Bangalore |<br>
          Bhopal | Chandigarh …
        </p>
      </div>

      <!-- Col 5: Contact Us + Social icons (with redirect links) -->
      <div class="col">
        <h6 class="fw-semibold mb-3">Contact Us</h6>
        <ul class="list-unstyled small mb-3">
          <li class="mb-1">
            <i class="fa-solid fa-envelope me-2"></i>
            <a class="footer-link" href="mailto:info@kubereshwar.co.in">Nakulpanchal428&#64;gmail.com</a>
          </li>
          <li>
            <i class="fa-solid fa-phone me-2"></i>
            <a class="footer-link" href="tel:+918019039030">+91 9898395983</a>
          </li>
        </ul>

        <!-- Social row -->
        <div class="d-flex align-items-center gap-3">
          <span class="social">
            <i class="fa-brands fa-linkedin-in"></i>
          </span>
          <span class="social">
            <i class="fa-brands fa-instagram"></i>
          </span>
          <span class="social">
            <i class="fa-brands fa-facebook-f"></i>
          </span>
          <span class="social">
            <i class="fa-brands fa-youtube"></i>
          </span>
        </div>
      </div>

    </div>

    <!-- Divider -->
    <hr class="footer-hr my-4">

    <!-- Bottom row: copyright left, legal right -->
    <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 small">
      <div class="text-secondary text-center text-md-start">
        © {{ year }} kubereshwar Solutions. All rights reserved.
      </div>
      <div class="d-flex flex-wrap justify-content-center gap-3">
        <a class="footer-link" routerLink="/terms">Terms & Conditions</a>
        <a class="footer-link" routerLink="/privacy">Privacy Policy</a>
        <a class="footer-link" routerLink="/warranty">Warranty Guidelines</a>
      </div>
    </div>

  </div>
</footer>
  `

})
export class FooterComponent {
  year = new Date().getFullYear();
}
