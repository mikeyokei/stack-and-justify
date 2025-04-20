// Mobile fixes for Stack & Justify
// Add this to your js/mobileFix.js file

(function() {
  // Run when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Add mobile CSS fix directly to the document
    addMobileCssFix();
    
    // Init optimizations after a slight delay to ensure everything is loaded
    setTimeout(initMobileOptimizations, 500);
    
    // Fix font loading issues
    fixFontLoading();
    
    // Add event listener for window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 768) {
        // Re-apply mobile optimizations on resize
        setTimeout(initMobileOptimizations, 300);
      }
    });
  });
  
  // Add critical CSS fixes directly to the document
  function addMobileCssFix() {
    const style = document.createElement('style');
    style.textContent = `
      @media screen and (max-width: 768px) {
        /* CRITICAL: Fix text visibility */
        .specimen-line .text {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
          min-height: 30px !important;
        }
        .specimen-line .text.hidden {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .specimen-line .loading {
          display: none !important;
        }
        
        /* Fix menu positioning */
        .menu-container .menu {
          position: absolute !important;
          z-index: 9999 !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          background-color: var(--bg-color) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Main optimization function
  function initMobileOptimizations() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    // Fix main issues
    fixMenus();
    fixSpecimenDisplay();
    makeTouchTargetsLarger();
    fixVisibility();
    fixMobileButtons();
  }
  
  // Ensure font loading properly shows text
  function fixFontLoading() {
    // Fix every font-loaded event
    window.addEventListener('font-loaded', function(e) {
      console.log('Font loaded event detected');
      // Give some time for the DOM to update
      setTimeout(fixVisibility, 200);
      
      // Additional periodic checks for visibility
      let checkCount = 0;
      const visibilityInterval = setInterval(function() {
        fixVisibility();
        checkCount++;
        if (checkCount > 5) clearInterval(visibilityInterval);
      }, 300);
    });
    
    // Also check when fonts get added
    window.addEventListener('font-added', function(e) {
      console.log('Font added event detected');
      setTimeout(fixVisibility, 200);
    });
  }
  
  // Fix the menu display on mobile
  function fixMenus() {
    // Show options and features menus
    const menus = document.querySelectorAll('.options, .features');
    menus.forEach(menu => {
      menu.style.display = 'block';
      
      // Fix menu button clicks
      const menuBtn = menu.querySelector('.menu-button');
      if (menuBtn) {
        menuBtn.addEventListener('click', function() {
          const menuContent = menu.querySelector('.menu');
          if (menuContent) {
            // Toggle visibility
            if (menuContent.style.visibility === 'visible') {
              menuContent.style.visibility = 'hidden';
            } else {
              // Position menu properly
              menuContent.style.visibility = 'visible';
              menuContent.style.maxHeight = '300px';
              menuContent.style.overflow = 'auto';
              menuContent.style.zIndex = '9999';
            }
          }
        });
      }
    });
    
    // Fix checkbox display in menus
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.style.display = 'inline-block';
      checkbox.style.appearance = 'checkbox';
      checkbox.style.webkitAppearance = 'checkbox';
      checkbox.style.opacity = '1';
    });
  }
  
  // Fix specimen display for mobile
  function fixSpecimenDisplay() {
    // Modify specimen layout for mobile
    const specimen = document.querySelector('.specimen');
    if (specimen) {
      specimen.style.display = 'flex';
      specimen.style.flexDirection = 'column';
    }
    
    // Fix specimen lines layout
    const specimenLines = document.querySelectorAll('.specimen-line');
    specimenLines.forEach(line => {
      rearrangeLine(line);
    });
    
    // Observer for new lines added to the DOM
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.classList && node.classList.contains('specimen-line')) {
              rearrangeLine(node);
            }
          });
        }
      });
    });
    
    // Start observing the specimen body
    const specimenBody = document.querySelector('.specimen-body');
    if (specimenBody) {
      observer.observe(specimenBody, { childList: true });
    }
  }
  
  // Rearrange elements in a specimen line for mobile
  function rearrangeLine(line) {
    const middleCol = line.querySelector('.line-middle-col');
    if (middleCol) {
      // Move text to the top
      middleCol.style.order = '-1';
      middleCol.style.gridRow = '1';
      
      // Fix text visibility in this line
      const text = middleCol.querySelector('.text');
      if (text) {
        text.classList.remove('hidden');
        text.classList.add('visible');
        text.style.opacity = '1';
        text.style.visibility = 'visible';
        text.style.display = 'block';
        text.style.width = '100%';
      }
      
      // Hide loading indicator
      const loading = middleCol.querySelector('.loading');
      if (loading) {
        loading.classList.remove('visible');
        loading.classList.add('hidden');
        loading.style.display = 'none';
      }
    }
    
    // Adjust left column
    const leftCol = line.querySelector('.line-left-col');
    if (leftCol) {
      leftCol.style.gridRow = '2';
    }
    
    // Adjust right column
    const rightCol = line.querySelector('.line-right-col');
    if (rightCol) {
      rightCol.style.gridRow = '3';
    }
  }
  
  // Make touch targets larger for mobile
  function makeTouchTargetsLarger() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.minHeight = '44px';
      btn.style.minWidth = '44px';
      btn.style.padding = '8px';
    });
  }
  
  // Fix visibility issues with text elements
  function fixVisibility() {
    console.log('Fixing visibility');
    // Fix all text elements
    const textElements = document.querySelectorAll('.specimen-line .text');
    textElements.forEach(el => {
      el.classList.remove('hidden');
      el.classList.add('visible');
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.display = 'block';
    });
    
    // Hide all loading indicators
    const loadingElements = document.querySelectorAll('.specimen-line .loading');
    loadingElements.forEach(el => {
      el.classList.remove('visible');
      el.classList.add('hidden');
      el.style.display = 'none';
    });
  }
  
  // Fix mobile buttons (font selection, etc)
  function fixMobileButtons() {
    // Improve font selection button
    const dropMsg = document.querySelector('.drop-message');
    if (dropMsg) {
      // Look for existing mobile font selection button
      let selectBtn = dropMsg.querySelector('.mobile-font-btn');
      
      // Create new button if it doesn't exist
      if (!selectBtn) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.ttf,.otf,.woff,.woff2';
        fileInput.style.display = 'none';
        fileInput.id = 'mobile-font-input';
        
        selectBtn = document.createElement('button');
        selectBtn.textContent = 'Select Font Files';
        selectBtn.classList.add('drop-btn', 'mobile-font-btn');
        
        selectBtn.addEventListener('click', () => {
          fileInput.click();
        });
        
        // Connect file input to the app
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            // Use the global handler
            if (typeof window.handleFontFiles === 'function') {
              window.handleFontFiles(e.target.files);
            }
          }
        });
        
        // Add to DOM
        dropMsg.appendChild(fileInput);
        dropMsg.appendChild(selectBtn);
      }
    }
  }
})();
