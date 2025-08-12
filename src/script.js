// Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a');

  // Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Enhanced Mobile Menu Toggle
  if (mobileMenuToggle && navLinks) {
    function openMobileMenu() {
      mobileMenuToggle.classList.add('active');
      navLinks.classList.add('active');
      document.body.classList.add('menu-open');
      
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      
      // Add ARIA attributes for accessibility
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      navLinks.setAttribute('aria-hidden', 'false');
    }
    
    function closeMobileMenu() {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      
      // Update ARIA attributes
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-hidden', 'true');
    }
    
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (this.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu when clicking on nav links
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navbar.contains(event.target);
      if (!isClickInsideNav && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMobileMenu();
        mobileMenuToggle.focus();
      }
    });
    
    // Handle focus trapping in mobile menu
    const focusableElements = navLinks.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navLinks.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  // Active Navigation Link Highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100; // Offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingNavLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        navLinkItems.forEach(link => link.classList.remove('active'));
        // Add active class to current section's nav link
        if (correspondingNavLink) {
          correspondingNavLink.classList.add('active');
        }
      }
    });
  }

  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
  
  // Update active nav link on page load
  updateActiveNavLink();

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced window resize handling
  let resizeTimeout;
  window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (window.innerWidth > 768) {
        // Reset mobile menu state on desktop
        if (mobileMenuToggle && navLinks) {
          mobileMenuToggle.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.classList.remove('menu-open');
          document.body.style.top = '';
          
          // Reset ARIA attributes
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          navLinks.setAttribute('aria-hidden', 'true');
        }
      }
      
      // Update viewport height for mobile browsers
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }, 250);
  });
  
  // Set initial viewport height
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
});
});

// Particle Animation (if canvas exists)
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
      ctx.fillStyle = '#39ff14';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();
      if (particle.size <= 0.2) {
        particles.splice(index, 1);
      }
    });
    if (particles.length < 100) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
    requestAnimationFrame(animateParticles);
  }

  // Handle canvas resize
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  initParticles();
  animateParticles();
}

// Enhanced Smooth Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Smooth scroll behavior for navigation links (enhanced)
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const navbar = document.getElementById('navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = targetSection.offsetTop - navbarHeight - 20; // Extra padding
          
          // Enhanced smooth scroll with easing
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = Math.min(Math.abs(distance) / 2, 1000); // Dynamic duration
          let start = null;
          
          function smoothScrollStep(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressPercentage = Math.min(progress / duration, 1);
            
            // Easing function (ease-in-out-cubic)
            const easeInOutCubic = progressPercentage < 0.5 
              ? 4 * progressPercentage * progressPercentage * progressPercentage 
              : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (progress < duration) {
              requestAnimationFrame(smoothScrollStep);
            }
          }
          
          requestAnimationFrame(smoothScrollStep);
        }
      });
    });
  }

  // Fade-in animations for sections
  function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
      section.classList.add('animate-on-scroll');
      section.style.animationDelay = `${index * 0.1}s`;
    });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Add staggered animation to child elements
          const childElements = entry.target.querySelectorAll('.achievement-card, .project-card, .tech-icon, .contact-item');
          childElements.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Enhanced hover animations for cards and buttons
  function initHoverAnimations() {
    const interactiveElements = document.querySelectorAll('.achievement-card, .project-card, .cta-button, .btn, .tech-icon');
    
    interactiveElements.forEach(element => {
      // Add enhanced hover classes
      element.classList.add('hover-lift');
      
      // Add loading state simulation for buttons
      if (element.classList.contains('btn') || element.classList.contains('cta-button')) {
        element.addEventListener('click', function(e) {
          if (this.getAttribute('href') && this.getAttribute('href').startsWith('http')) {
            // External link - show loading state
            this.classList.add('loading');
            setTimeout(() => {
              this.classList.remove('loading');
            }, 1000);
          }
        });
      }
      
      // Enhanced card interactions
      if (element.classList.contains('achievement-card') || element.classList.contains('project-card')) {
        element.classList.add('card-interactive');
        
        // Add ripple effect on click
        element.addEventListener('click', function(e) {
          const ripple = document.createElement('div');
          ripple.classList.add('ripple');
          
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          this.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      }
    });
  }

  // Loading states and transitions
  function initLoadingStates() {
    // Simulate loading for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.classList.add('loading');
        img.addEventListener('load', function() {
          this.classList.remove('loading');
          this.classList.add('animate-fade-in');
        });
      }
    });

    // Add loading states to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
      link.addEventListener('click', function() {
        this.classList.add('loading');
        // Remove loading state after a delay (simulated)
        setTimeout(() => {
          this.classList.remove('loading');
        }, 1500);
      });
    });
  }

  // Initialize all animation systems
  initSmoothScroll();
  initSectionAnimations();
  initHoverAnimations();
  initLoadingStates();
  
  // Add performance optimizations for animations
  function optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.style.setProperty('--transition-normal', '150ms ease-in-out');
      document.documentElement.style.setProperty('--transition-slow', '300ms ease-in-out');
    }
    
    // Disable animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-normal', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }
  
  optimizeAnimations();
  
  // Add intersection observer for performance optimization
  function initPerformanceOptimizations() {
    const expensiveElements = document.querySelectorAll('.achievement-card, .project-card');
    
    const performanceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.willChange = 'transform';
        } else {
          entry.target.style.willChange = 'auto';
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0
    });
    
    expensiveElements.forEach(element => {
      performanceObserver.observe(element);
    });
  }
  
  initPerformanceOptimizations();

  // Achievements Section Enhancements
  const achievementCards = document.querySelectorAll('.achievement-card');

  const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all achievement cards
  achievementCards.forEach(card => {
    achievementObserver.observe(card);
    
    // Add keyboard navigation support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    
    // Add click handler for better accessibility
    card.addEventListener('click', function() {
      this.focus();
    });
    
    // Add keyboard event handlers
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add hover sound effect (optional - can be enabled if audio files are available)
  achievementCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Optional: Add subtle hover sound effect
      // const hoverSound = new Audio('assets/sounds/hover.mp3');
      // hoverSound.volume = 0.1;
      // hoverSound.play().catch(() => {}); // Ignore errors if audio fails
    });
  });

  // Achievement counter animation
  function animateCounters() {
    const counters = document.querySelectorAll('.achievement-rank');
    
    counters.forEach(counter => {
      const target = counter.textContent;
      const isNumeric = /^\d+/.test(target);
      
      if (isNumeric) {
        const finalNumber = parseInt(target.match(/\d+/)[0]);
        let current = 0;
        const increment = finalNumber / 30; // Animation duration control
        
        const updateCounter = () => {
          if (current < finalNumber) {
            current += increment;
            counter.textContent = Math.floor(current) + target.replace(/^\d+/, '');
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target; // Ensure final value is exact
          }
        };
        
        // Start animation when card becomes visible
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(updateCounter, 200); // Slight delay for better effect
              counterObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter.closest('.achievement-card'));
      }
    });
  }

  // Initialize counter animations
  animateCounters();
});

// Image Loading Optimization
document.addEventListener('DOMContentLoaded', function() {
  // Lazy loading for images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.classList.add('loaded');
    });
  }
  
  // Optimize images for different screen sizes
  function optimizeImages() {
    const images = document.querySelectorAll('img');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    
    images.forEach(img => {
      // Skip if image doesn't have data attributes for responsive sizing
      if (!img.dataset.sizes) return;
      
      let targetWidth;
      if (screenWidth <= 480) {
        targetWidth = Math.min(480 * devicePixelRatio, img.naturalWidth);
      } else if (screenWidth <= 768) {
        targetWidth = Math.min(768 * devicePixelRatio, img.naturalWidth);
      } else if (screenWidth <= 1024) {
        targetWidth = Math.min(1024 * devicePixelRatio, img.naturalWidth);
      } else {
        targetWidth = img.naturalWidth;
      }
      
      // Update image loading priority based on viewport
      if (img.getBoundingClientRect().top < window.innerHeight) {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
    });
  }
  
  // Run image optimization on load and resize
  optimizeImages();
  window.addEventListener('resize', optimizeImages);
  
  // Preload critical images
  function preloadCriticalImages() {
    const criticalImages = [
      'assets/Adelin.png', // Profile image
      'assets/codenimble.png', // Featured project
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  preloadCriticalImages();
});

  // Enhanced parallax effect for achievement icons and other elements
  let ticking = false;
  
  function updateParallaxElements() {
    const scrolled = window.pageYOffset;
    const achievementsSection = document.getElementById('achievements');
    
    if (achievementsSection) {
      const sectionTop = achievementsSection.offsetTop;
      const sectionHeight = achievementsSection.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Check if achievements section is in viewport
      if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
        const icons = document.querySelectorAll('.achievement-icon i');
        icons.forEach((icon, index) => {
          const speed = 0.5 + (index * 0.1); // Different speeds for each icon
          const yPos = -(scrolled - sectionTop) * speed * 0.1;
          icon.style.transform = `translateY(${yPos}px) scale(1) rotate(0deg)`;
        });
      }
    }
    
    // Add subtle parallax to other elements
    const parallaxElements = document.querySelectorAll('.profile-image, .about-profile-image');
    parallaxElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const speed = 0.3 + (index * 0.1);
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = (window.innerHeight - rect.top) * speed * 0.1;
        element.style.transform = `translateY(${yPos}px)`;
      }
    });
    
    ticking = false;
  }
  
  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallaxElements);
      ticking = true;
    }
  }
  
  // Use passive scroll listeners for better performance
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  
  // Initialize animations on page load
  updateParallaxElements();
});
// Touch 
and Mobile Interaction Enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Add touch-friendly interactions
  const interactiveElements = document.querySelectorAll('.achievement-card, .project-card, .tech-icon, .cta-button');
  
  interactiveElements.forEach(element => {
    // Add touch feedback
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      this.style.transform = '';
    }, { passive: true });
    
    element.addEventListener('touchcancel', function() {
      this.style.transform = '';
    }, { passive: true });
  });
  
  // Improve scroll performance on mobile
  let ticking = false;
  
  function updateScrollElements() {
    // Update navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    // Update active navigation
    updateActiveNavLink();
    
    ticking = false;
  }
  
  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollElements);
      ticking = true;
    }
  }
  
  // Use passive scroll listeners for better performance
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  
  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    // Delay to allow for orientation change to complete
    setTimeout(function() {
      // Update viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      
      // Close mobile menu if open
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      
      if (mobileMenuToggle && navLinks && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
      }
      
      // Trigger resize event for other handlers
      window.dispatchEvent(new Event('resize'));
    }, 500);
  });
  
  // Add swipe gesture support for mobile menu
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
      const navLinks = document.querySelector('.nav-links');
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      
      // Swipe left to close menu (if open)
      if (diffX > 50 && navLinks && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
      }
      
      // Swipe right to open menu (if closed and near left edge)
      if (diffX < -50 && touchStartX < 50 && navLinks && !navLinks.classList.contains('active')) {
        if (window.innerWidth <= 768) {
          mobileMenuToggle.classList.add('active');
          navLinks.classList.add('active');
          document.body.classList.add('menu-open');
          const scrollY = window.scrollY;
          document.body.style.top = `-${scrollY}px`;
        }
      }
    }
    
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: true });
});

// Responsive Breakpoint Management
const BreakpointManager = {
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    large: 1280
  },
  
  current: null,
  
  init() {
    this.updateBreakpoint();
    window.addEventListener('resize', () => this.updateBreakpoint());
  },
  
  updateBreakpoint() {
    const width = window.innerWidth;
    let newBreakpoint;
    
    if (width <= this.breakpoints.mobile) {
      newBreakpoint = 'mobile';
    } else if (width <= this.breakpoints.tablet) {
      newBreakpoint = 'tablet';
    } else if (width <= this.breakpoints.desktop) {
      newBreakpoint = 'desktop';
    } else {
      newBreakpoint = 'large';
    }
    
    if (newBreakpoint !== this.current) {
      const oldBreakpoint = this.current;
      this.current = newBreakpoint;
      
      // Dispatch custom event for breakpoint change
      window.dispatchEvent(new CustomEvent('breakpointChange', {
        detail: { from: oldBreakpoint, to: newBreakpoint }
      }));
      
      // Update body class for CSS targeting
      document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
      document.body.classList.add(`breakpoint-${newBreakpoint}`);
    }
  },
  
  is(breakpoint) {
    return this.current === breakpoint;
  },
  
  isAtLeast(breakpoint) {
    const breakpointOrder = ['mobile', 'tablet', 'desktop', 'large'];
    const currentIndex = breakpointOrder.indexOf(this.current);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }
};

// Initialize breakpoint manager
document.addEventListener('DOMContentLoaded', function() {
  BreakpointManager.init();
  
  // Example usage of breakpoint changes
  window.addEventListener('breakpointChange', function(e) {
    console.log(`Breakpoint changed from ${e.detail.from} to ${e.detail.to}`);
    
    // Adjust layouts or functionality based on breakpoint
    if (e.detail.to === 'mobile') {
      // Mobile-specific adjustments
      document.body.classList.add('mobile-optimized');
    } else {
      document.body.classList.remove('mobile-optimized');
    }
  });
});