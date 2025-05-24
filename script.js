document.addEventListener('DOMContentLoaded', function() {
    // Header Scroll Effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  
    // Mobile Menu Toggle
    const menuToggle = document.createElement('i');
    menuToggle.className = 'fas fa-bars menu-toggle';
    document.querySelector('header').appendChild(menuToggle);
  
    menuToggle.addEventListener('click', () => {
      document.querySelector('.navbar').classList.toggle('active');
    });
  
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Product Card Hover Effect
    document.querySelectorAll('.produit-card').forEach(card => {
      card.addEventListener('mouseover', () => {
        card.querySelector('img').style.transform = 'scale(1.05)';
      });
      
      card.addEventListener('mouseout', () => {
        card.querySelector('img').style.transform = 'scale(1)';
      });
    });
  
    // Testimonial Slider
    const testimonials = document.querySelector('.avis-clients-grid');
    if (testimonials) {
      let isDown = false;
      let startX;
      let scrollLeft;
  
      testimonials.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - testimonials.offsetLeft;
        scrollLeft = testimonials.scrollLeft;
      });
  
      testimonials.addEventListener('mouseleave', () => {
        isDown = false;
      });
  
      testimonials.addEventListener('mouseup', () => {
        isDown = false;
      });
  
      testimonials.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonials.offsetLeft;
        const walk = (x - startX) * 2;
        testimonials.scrollLeft = scrollLeft - walk;
      });
    }
  });






  document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Animation au Scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .commitment-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if(elementTop < windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Gestion Favoris
    document.querySelectorAll('.favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('fas');
            this.classList.toggle('active');
        });
    });
});




// Validation Formulaire
const signupForm = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const strengthBar = document.querySelector('.password-strength');

if(signupForm) {
    // Force mot de passe
    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        strengthBar.style.width = `${strength}%`;
        strengthBar.style.backgroundColor = strength < 50 ? '#ff4444' : 
                                          strength < 75 ? '#ffbb33' : '#00C851';
    });

    // Soumission Formulaire
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = Array.from(this.elements).filter(el => el.tagName === 'INPUT');
        let isValid = true;

        inputs.forEach(input => {
            if(input.type !== 'checkbox' && !input.value.trim()) {
                showError(input, 'Ce champ est requis');
                isValid = false;
            }
        });

        if(isValid) {
            Swal.fire({
                icon: 'success',
                title: 'Bienvenue !',
                text: 'Votre compte a été créé avec succès',
                confirmButtonColor: 'var(--gold)'
            }).then(() => {
                window.location.href = 'mon-compte.html';
            });
        }
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if(password.length >= 8) strength += 30;
    if(/[A-Z]/.test(password)) strength += 20;
    if(/[0-9]/.test(password)) strength += 20;
    if(/[^A-Za-z0-9]/.test(password)) strength += 30;
    return Math.min(strength, 100);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    if(!formGroup.querySelector('.error-message')) {
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('error');
}











document.addEventListener('DOMContentLoaded', () => {
  // Menu Mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
  });

  // Slider Avis
  const testimonials = document.querySelectorAll('.testimonial-card');
  let currentTestimonial = 0;

  function showTestimonial(index) {
      testimonials.forEach(testimonial => testimonial.classList.remove('active'));
      testimonials[index].classList.add('active');
  }

  function nextTestimonial() {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
  }

  // Auto-rotation des avis
  setInterval(nextTestimonial, 5000);

  // Favoris
  document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          this.classList.toggle('fas');
          this.classList.toggle('active');
          
          if(this.classList.contains('active')) {
              this.animate([
                  { transform: 'scale(1)' },
                  { transform: 'scale(1.2)' },
                  { transform: 'scale(1)' }
              ], { duration: 300 });
          }
      });
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          });
      });
  });
});