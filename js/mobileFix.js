// Mobile fixes for Stack & Justify
(function() {
  // Run when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Add critical fixes immediately
    addCriticalFixes();
    
    // Apply all optimizations after a delay
    setTimeout(initMobileOptimizations, 500);
    
    // Fix font loading issues
    fixFontLoadingEvents();
  });
  
  // Add critical fixes directly to the document
  function addCriticalFixes() {
    const style = document.createElement('style');
    style.textContent = `
      @media screen and (max-width: 768px) {
        .specimen-line .text {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        .specimen-line .loading {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Main optimization function
  function initMobileOptimizations() {
    if (window.innerWidth > 768) return;
    
    fixMenus();
    fixSpecimenDisplay();
    fixVisibility();
  }
  
  // Fix font loading events
  function fixFontLoadingEvents() {
    window.addEventListener('font-loaded', function(e) {
      setTimeout(fixVisibility, 200);
    });
    
    window.addEventListener('font-added', function(e) {
      setTimeout(fixVisibility, 200);
    });
    
    // Run visibility fixes periodically
    setInterval(fixVisibility, 500);
  }
  
  // Fix the menu display
  function fixMenus() {
    document.querySelectorAll('.options, .features').forEach(menu => {
      menu.style.display = 'block';
    });
    
    // Fix checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.style.display = 'inline-block';
      checkbox.style.appearance = 'checkbox';
      checkbox.style.webkitAppearance = 'checkbox';
      checkbox.style.opacity = '1';
    });
  }
  
  // Fix specimen display
  function fixSpecimenDisplay() {
    const specimenLines = document.querySelectorAll('.specimen-line');
    specimenLines.forEach(line => {
      // Move text to top
      const middleCol = line.querySelector('.line-middle-col');
      if (middleCol) {
        middleCol.style.order = '-1';
        middleCol.style.gridRow = '1';
      }
    });
  }
  
  // Fix visibility of text elements
  function fixVisibility() {
    if (window.innerWidth <= 768) {
      // Fix text elements
      document.querySelectorAll('.specimen-line .text').forEach(el => {
        el.classList.remove('hidden');
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = 'block';
      });
      
      // Hide loading indicators
      document.querySelectorAll('.specimen-line .loading').forEach(el => {
        el.classList.remove('visible');
        el.classList.add('hidden');
        el.style.display = 'none';
      });
    }
  }
})();
