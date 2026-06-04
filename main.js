/* =========================================================================
   AI Builder Academy Landing Page JS Logic
   Handles: FAQ Accordions, Navbar Scroll styling, and Booking Success Modal
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Utility: Show error message for contact form
  const showError = (message) => {
    // Remove any existing error banners
    const existingBanner = contactForm?.querySelector('.form-error');
    if (existingBanner) existingBanner.remove();
    
    // Create new error banner
    const errorBanner = document.createElement('div');
    errorBanner.className = 'form-error';
    errorBanner.textContent = message;
    errorBanner.style.background = '#ffe6e6';
    errorBanner.style.color = '#b00020';
    errorBanner.style.padding = '12px';
    errorBanner.style.marginTop = '12px';
    errorBanner.style.borderRadius = '4px';
    errorBanner.style.fontWeight = 'bold';
    
    // Insert before contact form
    if (contactForm && contactForm.parentNode) {
      contactForm.parentNode.insertBefore(errorBanner, contactForm);
      // Auto-remove after 5 seconds
      setTimeout(() => errorBanner.remove(), 5000);
    }
  };

  // 1. Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.9rem 1.5rem';
      navbar.style.backgroundColor = 'rgba(8, 12, 20, 0.95)';
    } else {
      navbar.style.padding = '1.25rem 1.5rem';
      navbar.style.backgroundColor = 'rgba(8, 12, 20, 0.8)';
    }
  });

  // 2. FAQ Accordion Toggles
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
  // Initialize ARIA attributes
  question.setAttribute('role', 'button');
  question.setAttribute('aria-expanded', question.parentElement.classList.contains('active'));
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close other active accordion items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });
      
      // Toggle current item
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // 3. Success Modal DOM Elements
  const bookingForm = document.getElementById('booking-form');
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalOkBtn = document.getElementById('btn-modal-ok');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  // Open Modal function
  const openModal = (title, description) => {
    if (modalTitle && modalDesc) {
      modalTitle.textContent = title;
      modalDesc.textContent = description;
    }
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  };

  // Close Modal function
  const closeModal = () => {
    successModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // restore scrolling
  };

  // 4. Form Submission Interceptor (Booking)
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // stop browser reload
      
      const clientName = document.getElementById('form-name').value;
      const clientEmail = document.getElementById('form-email').value;
      
      // Submit to Formspree
      try {
        const res = await fetch(bookingForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(bookingForm)
        });
        if (!res.ok) throw new Error(`Formspree returned ${res.status}`);
      } catch (err) {
        console.error('Booking form submission failed:', err);
        alert('Sorry, something went wrong. Please email us at hello@1on1aibuilder.com');
        return;
      }
      
      // Reset the form input fields
      bookingForm.reset();
      
      // Launch success feedback for booking
      openModal(
        'Booking Request Received!',
        'Thank you for claiming your slot. We will email you within 24 hours to schedule a quick 10-minute discovery call and set up your class dates.'
      );
    });
  }

  // 5. Form Submission Interceptor (Contact)
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // stop browser reload
      
      // Validate that at least 2 days of the week are selected
      const checkedDays = Array.from(document.querySelectorAll('input[name="contact-days"]:checked')).map(cb => cb.value);
      if (checkedDays.length < 2) {
        showError("Please select at least 2 days of the week when you are available to attend classes.");
        return;
      }
      
      const contactName = document.getElementById('contact-name').value;
      const contactEmail = document.getElementById('contact-email').value;
      const contactPhone = document.getElementById('contact-phone').value;
      const contactPreferred = document.getElementById('contact-preferred').value;
      const contactCompExp = document.getElementById('contact-computer-exp').value;
      const contactAiExp = document.getElementById('contact-ai-exp').value;
      const contactMessage = document.getElementById('contact-message').value;
      
      // Submit to Formspree
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        });
        if (!res.ok) throw new Error(`Formspree returned ${res.status}`);
      } catch (err) {
        console.error('Contact form submission failed:', err);
        alert('Sorry, something went wrong. Please email us at hello@1on1aibuilder.com');
        return;
      }
      
      // Reset the form input fields
      contactForm.reset();
      
      // Launch success feedback for message sent
      openModal(
        'Message Sent Successfully!',
        'Thank you for getting in touch. We have received your inquiry and will email you back within 24 hours to coordinate scheduling.'
      );
    });
  }

  // 6. Hero Video Player Interaction
  const videoWrapper = document.querySelector('.hero-video-wrapper');
  const heroVideo = document.getElementById('hero-video');
  const playBtn = document.getElementById('video-play-btn');
  
  if (videoWrapper && heroVideo && playBtn) {
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');

    const togglePlay = () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoWrapper.classList.add('playing');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        heroVideo.pause();
        videoWrapper.classList.remove('playing');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    };

    // Toggle play on video wrapper click
    videoWrapper.addEventListener('click', () => {
      togglePlay();
    });

    // Prevent double play toggles when clicking the play button overlay directly
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    // Reset UI state when video ends
    heroVideo.addEventListener('ended', () => {
      videoWrapper.classList.remove('playing');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    });
  }

  // 7. Close Modal Event Listeners
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOkBtn) {
    modalOkBtn.addEventListener('click', closeModal);
  }
  
  // Close modal if user clicks outside of the card content
  window.addEventListener('click', (event) => {
    if (event.target === successModal) {
      closeModal();
    }
  });

});
