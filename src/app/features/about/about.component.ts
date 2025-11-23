import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO SECTION -->
    <section class="about-hero">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-8">
            <div class="hero-content">
              <h1 class="hero-title">About Kubereshwar</h1>
              <p class="hero-subtitle">
                Leading the way in industrial machinery and solutions with over two decades of expertise in manufacturing excellence.
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="hero-image">
              <div class="floating-stats">
                <div class="stat-card">
                  <div class="stat-number">20+</div>
                  <div class="stat-label">Years Experience</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">5000+</div>
                  <div class="stat-label">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPANY OVERVIEW -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="content-block">
              <h2 class="section-title">Our Story</h2>
              <p class="lead">
                Founded with a vision to revolutionize industrial manufacturing, Kubereshwar has been at the forefront of innovation in machinery and automation solutions.
              </p>
              <p>
                Since our inception, we have dedicated ourselves to providing cutting-edge industrial equipment that meets the highest standards of quality and reliability. Our commitment to excellence has made us a trusted partner for businesses across various industries.
              </p>
              <p>
                We believe in the power of technology to transform manufacturing processes, and our solutions are designed to help businesses achieve greater efficiency, productivity, and sustainability.
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="image-container">
              <div class="main-image">
                <div class="image-placeholder">
                  <i class="fas fa-industry"></i>
                  <span>Industrial Excellence</span>
                </div>
              </div>
              <div class="floating-badges">
                <div class="badge-item">
                  <i class="fas fa-award"></i>
                  <span>ISO Certified</span>
                </div>
                <div class="badge-item">
                  <i class="fas fa-shield-alt"></i>
                  <span>Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSION & VISION -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="mission-card">
              <div class="card-icon">
                <i class="fas fa-bullseye"></i>
              </div>
              <h3 class="card-title">Our Mission</h3>
              <p class="card-description">
                To provide innovative, reliable, and efficient industrial machinery solutions that empower businesses to achieve their manufacturing goals while maintaining the highest standards of quality and environmental responsibility.
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="vision-card">
              <div class="card-icon">
                <i class="fas fa-eye"></i>
              </div>
              <h3 class="card-title">Our Vision</h3>
              <p class="card-description">
                To be the leading provider of industrial automation solutions, recognized globally for our innovation, quality, and commitment to customer success in the evolving manufacturing landscape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Our Core Values</h2>
          <p class="section-subtitle">The principles that guide everything we do</p>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="value-card">
              <div class="value-icon">
                <i class="fas fa-gem"></i>
              </div>
              <h4 class="value-title">Quality</h4>
              <p class="value-description">We maintain the highest standards in every product and service we deliver.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="value-card">
              <div class="value-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <h4 class="value-title">Innovation</h4>
              <p class="value-description">We continuously push boundaries to bring cutting-edge solutions to our clients.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="value-card">
              <div class="value-icon">
                <i class="fas fa-handshake"></i>
              </div>
              <h4 class="value-title">Integrity</h4>
              <p class="value-description">We conduct business with honesty, transparency, and ethical practices.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="value-card">
              <div class="value-icon">
                <i class="fas fa-users"></i>
              </div>
              <h4 class="value-title">Customer Focus</h4>
              <p class="value-description">Our customers' success is at the heart of everything we do.</p>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ACHIEVEMENTS -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Our Achievements</h2>
          <p class="section-subtitle">Milestones that define our journey</p>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="achievement-card">
              <div class="achievement-number">500+</div>
              <div class="achievement-label">Products Delivered</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="achievement-card">
              <div class="achievement-number">50+</div>
              <div class="achievement-label">Product Categories</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="achievement-card">
              <div class="achievement-number">5000+</div>
              <div class="achievement-label">Happy Clients</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="achievement-card">
              <div class="achievement-number">20+</div>
              <div class="achievement-label">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  `,
  styles: [`
    /* HERO SECTION */
    .about-hero {
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

    .floating-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1rem;
      color: #666;
      font-weight: 500;
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

    .content-block {
      padding: 2rem 0;
    }

    .content-block .lead {
      font-size: 1.25rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .content-block p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    /* IMAGE CONTAINER */
    .image-container {
      position: relative;
      padding: 2rem 0;
    }

    .main-image {
      background: var(--color-secondary-light);
      border-radius: 15px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .image-placeholder {
      text-align: center;
      color: var(--color-primary);
    }

    .image-placeholder i {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }

    .image-placeholder span {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .floating-badges {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .badge-item {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-primary);
      font-weight: 600;
    }

    .badge-item i {
      font-size: 1.2rem;
    }

    /* MISSION & VISION CARDS */
    .mission-card,
    .vision-card {
      background: white;
      padding: 3rem 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
      height: 100%;
      transition: transform 0.3s ease;
    }

    .mission-card:hover,
    .vision-card:hover {
      transform: translateY(-5px);
    }

    .card-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .card-icon i {
      font-size: 2rem;
      color: white;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .card-description {
      color: #666;
      line-height: 1.6;
    }

    /* VALUES CARDS */
    .value-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      text-align: center;
      height: 100%;
      transition: all 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }

    .value-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .value-icon i {
      font-size: 1.8rem;
      color: white;
    }

    .value-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .value-description {
      color: #666;
      line-height: 1.6;
    }


    /* ACHIEVEMENT CARDS */
    .achievement-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      text-align: center;
      transition: all 0.3s ease;
    }

    .achievement-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }

    .achievement-number {
      font-size: 3rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .achievement-label {
      font-size: 1rem;
      color: #666;
      font-weight: 500;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .floating-stats {
        margin-top: 2rem;
      }
      
      .floating-badges {
        flex-direction: column;
        align-items: center;
      }
    }

    /* UTILITY CLASSES */
    .min-vh-50 {
      min-height: 50vh;
    }
  `]
})
export class AboutComponent {
  // Component logic can be added here if needed
}
