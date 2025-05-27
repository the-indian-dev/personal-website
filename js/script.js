// Optimized typing animation with performance improvements
function initializeTypingAnimation() {
  if (typeof Typed !== 'undefined') {
    var typed = new Typed("#typed", {
      stringsElement: "#typed-strings",
      loop: true,
      typeSpeed: 50,
      backSpeed: 20,
      backDelay: 1000,
    });
  }
}

// Show page-2 content after initial load with smooth transition
function initializeLazyLoading() {
  const page2 = document.querySelector('.page-2');
  if (!page2) return;

  // Show page-2 after a short delay to ensure main content loads first
  setTimeout(() => {
    page2.style.display = 'flex';
    page2.style.justifyContent = 'center';
    
    // Trigger animation after display is set
    requestAnimationFrame(() => {
      page2.classList.add('visible');
    });
  }, 1000); // Show after 1 second
}

// Preload non-critical images after initial load
function preloadImages() {
  const imagesToPreload = [
    '/assets/emoji.webp',
    '/assets/game.webp',
    '/assets/om.webp',
    '/assets/flag.webp',
    '/assets/heart.webp'
  ];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeTypingAnimation();
  initializeLazyLoading();
});

// Preload images after page is fully loaded
window.addEventListener('load', preloadImages);
