// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Load HTML component into a container
 */
async function loadComponent(containerId, componentPath) {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container #${containerId} not found`);
      return;
    }

    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Failed to load ${componentPath}`);
    }
    const html = await response.text();
    container.innerHTML = html;
    console.log(`✓ Loaded ${containerId}`);
  } catch (error) {
    console.error(`✗ Error loading ${containerId}:`, error);
  }
}

/**
 * Initialize all components
 */
async function initializeComponents() {
  // Determine the base path - handle both pages and root level
  let componentsPath = '../components/';
  
  // Check if we're in the pages directory
  if (window.location.pathname.includes('/pages/')) {
    componentsPath = '../components/';
  } else if (window.location.pathname.includes('/frontend/')) {
    componentsPath = './components/';
  }

  console.log('📦 Loading components from:', componentsPath);

  try {
    await loadComponent('navbar-container', componentsPath + 'navbar.html');
    await loadComponent('footer-container', componentsPath + 'footer.html');
    await loadComponent('modal-container', componentsPath + 'inquiry-modal.html');

    console.log('✓ All components loaded');

    // Initialize after components are loaded
    initializeNavbar();
    initializeModal();
    initializeFormSubmission();
    initializeInquireButtons();
    
  } catch (error) {
    console.error('Error initializing components:', error);
  }
}

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================

function initializeNavbar() {
  setTimeout(() => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const inquireNavBtn = document.getElementById('inquireNavBtn');

    if (!navbar) {
      console.warn('Navbar not found, will retry');
      setTimeout(() => initializeNavbar(), 100);
      return;
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Hamburger menu toggle
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        if (navLinks) {
          navLinks.classList.toggle('active');
        }
      });

      // Close menu when link is clicked
      if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
          });
        });
      }
    }

    // Inquire button in navbar
    if (inquireNavBtn) {
      inquireNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
        if (hamburger) {
          hamburger.classList.remove('active');
        }
        if (navLinks) {
          navLinks.classList.remove('active');
        }
      });
    }

    console.log('✓ Navbar initialized successfully');
  }, 50);
}

// ========================================
// MODAL FUNCTIONALITY
// ========================================

let currentService = null;

function openModal(service = null) {
  currentService = service;
  const modal = document.getElementById('inquiryModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set service field if provided
    if (service) {
      const serviceField = document.getElementById('service');
      if (serviceField) {
        serviceField.value = service;
      }
    }

    // Clear other fields
    const form = document.getElementById('inquiryForm');
    if (form && !service) {
      form.reset();
    }
  }
}

function closeModal() {
  const modal = document.getElementById('inquiryModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function initializeAllButtons() {
  // Attach listeners to all buttons that might open the modal
  setTimeout(() => {
    // Hero buttons
    const heroBtn = document.getElementById('heroInquireBtn');
    if (heroBtn) heroBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });

    // CTA buttons
    document.querySelectorAll('#ctaInquireBtn, #contactInquireBtn').forEach(btn => {
      if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    });

    // Service buttons
    document.querySelectorAll('.service-inquire-btn').forEach(btn => {
      if (btn && !btn.hasAttribute('data-listener-attached')) {
        btn.setAttribute('data-listener-attached', 'true');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const serviceName = e.target.closest('.service-card-full, .service-card')?.querySelector('h3')?.textContent;
          openModal(serviceName || null);
        });
      }
    });

    // Package buttons
    document.querySelectorAll('.package-inquire-btn').forEach(btn => {
      if (btn && !btn.hasAttribute('data-listener-attached')) {
        btn.setAttribute('data-listener-attached', 'true');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const packageName = e.target.closest('.package-card, .package-card-full')?.querySelector('h3')?.textContent;
          openModal(packageName || null);
        });
      }
    });

    // Inquire in navbar
    const inquireNavBtn = document.getElementById('inquireNavBtn');
    if (inquireNavBtn) inquireNavBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });

    // Contact page inquire
    const contactInquireBtn = document.querySelector('.contact-cta .inquire-btn');
    if (contactInquireBtn) contactInquireBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  }, 50);
}

function initializeModal() {
  const modal = document.getElementById('inquiryModal');
  const closeBtn = document.getElementById('closeModal');
  const closeSuccessBtn = document.getElementById('closeSuccess');

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close success button
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeModal);
  }

  // Modal backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Initialize all buttons
  setTimeout(() => {
    initializeAllButtons();
  }, 50);
}

// ========================================
// FORM SUBMISSION
// ========================================

function initializeFormSubmission() {
  const inquiryForm = document.getElementById('inquiryForm');
  const contactForm = document.getElementById('contactForm');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitInquiryForm(inquiryForm);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // For contact form, we could send it as an inquiry too
      await submitContactForm(contactForm);
    });
  }
}

async function submitInquiryForm(form) {
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  
  try {
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      eventType: document.getElementById('eventType').value,
      service: document.getElementById('service').value,
      eventDate: document.getElementById('eventDate').value,
      guestCount: document.getElementById('guestCount').value,
      location: document.getElementById('location').value,
      message: document.getElementById('message').value
    };

    // Send to backend
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    console.log('Response:', { status: response.status, data });

    if (response.ok && data.success) {
      // Show success message
      showSuccessMessage();
      form.reset();
    } else {
      // Show validation errors if available
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || 'Failed to submit inquiry');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Sorry, there was an error submitting your inquiry:\n\n' + error.message + '\n\nPlease try again or contact us directly.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function submitContactForm(form) {
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      phone: document.getElementById('contactPhone').value,
      service: 'General Inquiry',
      eventType: 'General Contact',
      message: document.getElementById('contactMessage').value
    };

    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    console.log('Response:', { status: response.status, data });

    if (response.ok && data.success) {
      alert('Thank you for your message! We will contact you shortly.');
      form.reset();
    } else {
      // Show validation errors if available
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || 'Failed to submit message');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Sorry, there was an error submitting your message:\n\n' + error.message + '\n\nPlease try again.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function showSuccessMessage() {
  const form = document.getElementById('inquiryForm');
  const successMessage = document.getElementById('successMessage');
  
  if (form && successMessage) {
    form.style.display = 'none';
    successMessage.style.display = 'block';
  }
}

// ========================================
// INQUIRE BUTTON HANDLER
// ========================================

function initializeInquireButtons() {
  // Service page buttons
  document.querySelectorAll('.service-inquire-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = e.target.closest('[data-service]')?.getAttribute('data-service') ||
                     e.target.closest('.service-card-full')?.querySelector('h3')?.textContent;
      if (service) {
        openModal(service.trim());
      }
    });
  });
}

// Global function for inline onclick handlers
function openModalWithService(serviceName) {
  openModal(serviceName);
}

// ========================================
// AOS INITIALIZATION
// ========================================

function initializeAOS() {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    offset: 50,
    delay: 0
  });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initializeSmoothScroll() {
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
}

// ========================================
// LAZY LOADING IMAGES
// ========================================

function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ========================================
// FLOATING WHATSAPP BUTTON
// ========================================

function initializeFloatingWhatsApp() {
  // Create floating button element
  const whatsappButton = document.createElement('a');
  whatsappButton.href = 'https://wa.me/254799799345?text=Hi%20Style%20Fair%20Events!%20I%20am%20interested%20in%20your%20event%20styling%20services.';
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.className = 'floating-whatsapp';
  whatsappButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-18a8 8 0 100 16 8 8 0 000-16z" fill="currentColor"/>
    </svg>
    <span class="whatsapp-tooltip">Chat on WhatsApp</span>
  `;
  
  document.body.appendChild(whatsappButton);
  
  console.log('✓ Floating WhatsApp button initialized');
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ========================================
// DOCUMENT READY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Style Fair Events website...');
  
  // Initialize components
  initializeComponents();

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    initializeAOS();
    console.log('✓ AOS animations initialized');
  }

  // Initialize smooth scrolling
  initializeSmoothScroll();
  console.log('✓ Smooth scrolling initialized');

  // Initialize lazy loading
  initializeLazyLoading();
  console.log('✓ Lazy loading initialized');

  // Initialize floating WhatsApp button
  initializeFloatingWhatsApp();
  console.log('✓ Floating WhatsApp button initialized');

  // Verify key elements exist
  setTimeout(() => {
    const navbar = document.getElementById('navbar');
    const footer = document.querySelector('footer');
    const modal = document.getElementById('inquiryModal');
    
    console.log('🔍 Element verification:');
    console.log('  Navbar:', navbar ? '✓' : '✗');
    console.log('  Footer:', footer ? '✓' : '✗');
    console.log('  Modal:', modal ? '✓' : '✗');
    console.log('✅ Style Fair Events website loaded successfully!');
  }, 500);
});

// ========================================
// UTILITY: Open modal from onclick
// ========================================

window.openModal = function(service = null) {
  const modal = document.getElementById('inquiryModal');
  if (!modal) return;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (service) {
    const serviceField = document.getElementById('service');
    if (serviceField) {
      serviceField.value = service;
    }
  }

  // Reset form if no service specified
  const form = document.getElementById('inquiryForm');
  if (form && !service) {
    // Only reset non-populated fields
    document.getElementById('eventType').value = '';
    document.getElementById('service').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('guestCount').value = '';
    document.getElementById('location').value = '';
    document.getElementById('message').value = '';
  }
};

// ========================================
// PERFORMANCE MONITORING
// ========================================

if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page loaded in ${pageLoadTime}ms`);
  });
}

// ========================================
// ANALYTICS TRACKING (Optional)
// ========================================

function trackEvent(eventName, eventData = {}) {
  // Use this for analytics integration
  console.log(`Event: ${eventName}`, eventData);
}

// Track inquire button clicks
document.addEventListener('click', (e) => {
  const inquireBtn = e.target.closest('[class*="inquire"], [class*="cta"]');
  if (inquireBtn) {
    trackEvent('inquire_button_clicked', {
      buttonText: inquireBtn.textContent,
      buttonClass: inquireBtn.className
    });
  }
});
