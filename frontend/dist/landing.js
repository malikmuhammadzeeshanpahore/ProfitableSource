// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.className = 'ri-close-line';
            } else {
                icon.className = 'ri-menu-line';
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'ri-menu-line';
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Load Investment Plans
    loadPlans();
});

async function loadPlans() {
    try {
        const response = await fetch('/api/packages');
        const data = await response.json();

        if (data.packages && data.packages.length > 0) {
            const plansContainer = document.getElementById('plansContainer');
            const plans = data.packages.sort((a, b) => a.price - b.price);

            plansContainer.innerHTML = plans.map((plan, index) => `
        <div class="plan-card">
          <div class="plan-header">
            <div>
              <div class="plan-name">${plan.name}</div>
              <div class="plan-tier">TIER ${index + 1}</div>
            </div>
            <div class="plan-icon">
              <i class="${plan.locked ? 'ri-lock-line' : 'ri-verified-badge-line'}"></i>
            </div>
          </div>
          
          <div class="plan-price">Rs ${plan.price.toLocaleString()}</div>
          <div class="plan-daily">Daily Profit: Rs ${plan.dailyClaim.toLocaleString()}</div>
          
          <div class="plan-features">
            <div class="plan-feature">
              <i class="ri-time-line"></i>
              <span>Duration: ${plan.duration} Days</span>
            </div>
            <div class="plan-feature">
              <i class="ri-shield-star-line"></i>
              <span>Secure Investment</span>
            </div>
          </div>
          
          ${plan.locked
                    ? '<button class="plan-button" disabled style="opacity: 0.5; cursor: not-allowed;"><i class="ri-lock-2-line"></i> Locked</button>'
                    : '<a href="/auth" class="plan-button">Get Started <i class="ri-arrow-right-line"></i></a>'
                }
        </div>
      `).join('');
        }
    } catch (error) {
        console.error('Error loading plans:', error);
        // Show fallback message
        document.getElementById('plansContainer').innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--color-text-secondary);">
          Investment plans will be loaded shortly. Please <a href="/auth" style="color: var(--color-accent);">sign up</a> to view all available plans.
        </p>
      </div>
    `;
    }
}
