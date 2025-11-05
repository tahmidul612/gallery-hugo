// Homepage Carousel Functionality
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  function initCarousel() {
    const carousel = document.querySelector('.featured-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const timerProgress = carousel.querySelector('.timer-progress');

    // Configuration
    const INTERVAL = 5000; // 5 seconds
    const TIMER_CIRCUMFERENCE = 113.097; // 2 * PI * 18

    let currentIndex = 0;
    let autoplayTimer = null;
    let timerAnimation = null;
    let isPaused = false;
    let timerStart = null;
    let remainingTime = INTERVAL;

    // Initialize
    function init() {
      if (slides.length <= 1) {
        // Hide navigation if only one slide
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        if (timerProgress) timerProgress.parentElement.style.display = 'none';
        return;
      }

      // Event listeners
      if (prevButton) prevButton.addEventListener('click', handlePrev);
      if (nextButton) nextButton.addEventListener('click', handleNext);

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });

      // Keyboard navigation
      document.addEventListener('keydown', handleKeyboard);

      // Pause on hover
      carousel.addEventListener('mouseenter', pause);
      carousel.addEventListener('mouseleave', resume);

      // Start autoplay
      startAutoplay();
    }

    // Navigate to specific slide
    function goToSlide(index) {
      if (index === currentIndex) return;

      const prevIndex = currentIndex;
      currentIndex = index;

      // Update slides
      slides[prevIndex].classList.remove('active');
      slides[prevIndex].classList.add('prev');

      slides[currentIndex].classList.remove('prev');
      slides[currentIndex].classList.add('active');

      // Clean up prev class after transition
      setTimeout(() => {
        slides[prevIndex].classList.remove('prev');
      }, 600);

      // Update dots
      updateDots();

      // Reset timer
      resetAutoplay();
    }

    // Navigate to next slide
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    // Navigate to previous slide
    function prevSlide() {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    }

    // Update active dot
    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // Handle prev button
    function handlePrev(e) {
      e.preventDefault();
      e.stopPropagation();
      prevSlide();
    }

    // Handle next button
    function handleNext(e) {
      e.preventDefault();
      e.stopPropagation();
      nextSlide();
    }

    // Keyboard navigation
    function handleKeyboard(e) {
      // Only handle if carousel is in viewport
      const rect = carousel.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (!inViewport) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    }

    // Start autoplay
    function startAutoplay() {
      if (isPaused) return;

      timerStart = Date.now();
      remainingTime = INTERVAL;

      // Start timer animation
      animateTimer();

      // Set autoplay interval
      autoplayTimer = setTimeout(() => {
        nextSlide();
      }, INTERVAL);
    }

    // Stop autoplay
    function stopAutoplay() {
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }
      if (timerAnimation) {
        cancelAnimationFrame(timerAnimation);
        timerAnimation = null;
      }
    }

    // Reset autoplay
    function resetAutoplay() {
      stopAutoplay();
      if (!isPaused) {
        startAutoplay();
      }
    }

    // Pause autoplay
    function pause() {
      if (isPaused) return;

      isPaused = true;
      carousel.classList.add('paused');

      // Calculate remaining time
      const elapsed = Date.now() - timerStart;
      remainingTime = INTERVAL - elapsed;

      stopAutoplay();
    }

    // Resume autoplay
    function resume() {
      if (!isPaused) return;

      isPaused = false;
      carousel.classList.remove('paused');

      timerStart = Date.now();

      // Resume with remaining time
      animateTimer();
      autoplayTimer = setTimeout(() => {
        nextSlide();
      }, remainingTime);

      remainingTime = INTERVAL;
    }

    // Animate circular timer
    function animateTimer() {
      if (!timerProgress) return;

      const animate = () => {
        if (isPaused) return;

        const elapsed = Date.now() - timerStart;
        const progress = Math.min(elapsed / INTERVAL, 1);
        const offset = TIMER_CIRCUMFERENCE * (1 - progress);

        timerProgress.style.strokeDashoffset = offset;

        if (progress < 1) {
          timerAnimation = requestAnimationFrame(animate);
        }
      };

      timerAnimation = requestAnimationFrame(animate);
    }

    // Initialize carousel
    init();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      stopAutoplay();
      document.removeEventListener('keydown', handleKeyboard);
    });
  }
})();
