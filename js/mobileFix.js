// Mobile optimizations for Stack & Justify

(function() {
  // Make handleFontFiles available to the mobileFix script
  if (typeof window.handleFontFiles === 'undefined') {
    window.handleFontFiles = function(files) {
      // This will be replaced by the actual function when available
      console.log("Trying to handle files before function is loaded");
      
      // Try to import the function from Fonts.js
      import('./Fonts.js').then(module => {
        if (typeof module.handleFontFiles === 'function') {
          module.handleFontFiles(files);
        }
      }).catch(err => {
        console.error("Error importing font handler:", err);
      });
    };
  }
  
  // Run after a delay to ensure the Mithril app has rendered
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMobileOptimizations, 1000);
    
    // Update when window resizes
    window.addEventListener('resize', function() {
      setTimeout(initMobileOptimizations, 300);
    });
  });

  function initMobileOptimizations() {
    // Check if on mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // Add mobile class to body for CSS targeting
    document.body.classList.add('mobile-device');
    
    // Fix main issues
    fixLanguageMenu();
    makeTouchTargetsLarger();
    addSwipeGestures();
    
    // Fix the duplicate buttons issue by removing any existing buttons first
    fixMobileFileSelection();
  }

  // Fix the language menu
  function fixLanguageMenu() {
    // Look for the options menu
    const optionsBtn = document.querySelector('.options button');
    if (optionsBtn) {
      // Force the menu open
      const menuContainer = optionsBtn.closest('.menu-container');
      if (menuContainer) {
        const menu = menuContainer.querySelector('.menu');
        if (menu) {
          menu.style.visibility = 'visible';
          menu.style.position = 'static';
          menu.style.margin = '10px 0';
          menu.style.maxHeight = 'none';
          menu.style.overflow = 'visible';
          
          // Fix checkboxes
          const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            checkbox.style.display = 'inline-block';
            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
            checkbox.style.opacity = '1';
            checkbox.style.appearance = 'checkbox';
            checkbox.style.webkitAppearance = 'checkbox';
          });
        }
      }
    }
  }

  // Make touch targets larger
  function makeTouchTargetsLarger() {
    const touchElements = document.querySelectorAll('button, .font-item, .line-left-col, .line-right-col');
    
    touchElements.forEach(el => {
      el.style.minHeight = '44px';
      el.style.minWidth = '44px';
      el.style.padding = el.style.padding || '10px';
    });
  }

  // Add swipe gestures for line manipulation
  function addSwipeGestures() {
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    
    let xDown = null;
    let yDown = null;
    let currentLine = null;
    
    function handleTouchStart(evt) {
      const lineEl = evt.target.closest('.specimen-line');
      if (!lineEl) return;
      
      currentLine = lineEl;
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    }
    
    function handleTouchMove(evt) {
      if (!xDown || !yDown || !currentLine) return;
      
      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;
      
      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;
      
      // Horizontal swipe detection (only if not scrolling vertically)
      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
        if (xDiff > 0) {
          // Swipe left - delete
          const deleteBtn = currentLine.querySelector('.update-button');
          if (deleteBtn) {
            deleteBtn.click();
          }
        } else {
          // Swipe right - copy
          const copyBtn = currentLine.querySelector('.copy-button');
          if (copyBtn) {
            copyBtn.click();
          }
        }
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.background = 'rgba(0,0,0,0.7)';
        feedback.style.color = 'white';
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '1000';
        feedback.textContent = xDiff > 0 ? 'Line Deleted' : 'Text Copied';
        
        document.body.appendChild(feedback);
        setTimeout(() => {
          document.body.removeChild(feedback);
        }, 1000);
      }
      
      // Reset values
      xDown = null;
      yDown = null;
      currentLine = null;
    }
  }
  
  // Fix the duplicate Select Font Files buttons
  function fixMobileFileSelection() {
    const dropMsg = document.querySelector('.drop-message');
    if (!dropMsg) return;
    
    // Remove any existing mobile selection buttons
    const existingButtons = dropMsg.querySelectorAll('button.drop-btn');
    existingButtons.forEach(btn => {
      if (btn.textContent.includes('Select Font Files')) {
        btn.remove();
      }
    });
    
    // Remove any existing mobile file inputs
    const existingFileInputs = dropMsg.querySelectorAll('input[type="file"]#mobile-font-input');
    existingFileInputs.forEach(input => {
      input.remove();
    });
    
    // Create a new file input button
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.ttf,.otf,.woff,.woff2';
    fileInput.style.display = 'none';
    fileInput.id = 'mobile-font-input';
    
    const selectBtn = document.createElement('button');
    selectBtn.textContent = 'Select Font Files';
    selectBtn.classList.add('drop-btn');
    selectBtn.style.display = 'block';
    selectBtn.style.width = '100%';
    selectBtn.style.margin = '10px 0';
    selectBtn.style.padding = '12px 20px';
    selectBtn.style.textAlign = 'center';
    selectBtn.style.backgroundColor = 'var(--green)';
    selectBtn.style.color = 'white';
    selectBtn.style.border = 'none';
    selectBtn.style.borderRadius = '4px';
    
    selectBtn.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Append to drop message area
    dropMsg.appendChild(fileInput);
    dropMsg.appendChild(selectBtn);
    
    // Connect file input to the app
    fileInput.addEventListener('change', (e) => {
      console.log("File selected:", e.target.files);
      if (e.target.files && e.target.files.length > 0) {
        // Try to access the font handling function
        if (typeof window.handleFontFiles === 'function') {
          window.handleFontFiles(e.target.files);
        } else if (window.Fonts && typeof window.Fonts.handleFontFiles === 'function') {
          window.Fonts.handleFontFiles(e.target.files);
        } else {
          // Last resort - try to import it directly
          import('./Fonts.js').then(module => {
            if (typeof module.handleFontFiles === 'function') {
              module.handleFontFiles(e.target.files);
            } else {
              console.error("Font handler function not found");
            }
          }).catch(err => {
            console.error("Cannot import Fonts.js:", err);
          });
        }
      }
    });
    
    // Make sure the original form input also works
    const originalFileInput = document.getElementById('file-upload');
    if (originalFileInput) {
      originalFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          if (typeof window.handleFontFiles === 'function') {
            window.handleFontFiles(e.target.files);
          }
        }
      });
    }
    
    // At load, try to expose functions between modules
    if (window.Fonts && typeof window.Fonts.handleFontFiles === 'function') {
      window.handleFontFiles = window.Fonts.handleFontFiles;
    }
  }
})();
