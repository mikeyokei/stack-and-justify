// Mobile optimizations for Stack & Justify
// This consolidated file fixes mobile-specific issues

(function() {
  // Make handleFontFiles available to the mobileFix script
  window.handleFontFiles = window.handleFontFiles || function() {
    console.error("Font handling function not loaded yet");
  };

  // Run after a slight delay to ensure the Mithril app has rendered
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMobileOptimizations, 1000); // Increased delay for app to initialize

    // Also refresh on resize
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
    improveDropZone();
    improveFileSelection(); // New function to ensure file selection works
  }

  // Fix the language menu
  function fixLanguageMenu() {
    // Force language menu to be visible on mobile
    const optionsMenu = document.querySelector('.options');
    if (optionsMenu) {
      const optionsButton = optionsMenu.querySelector('.menu-button');
      const menu = optionsMenu.querySelector('.menu');

      if (menu) {
        // Create a more accessible language menu for mobile
        menu.style.position = 'static';
        menu.style.visibility = 'visible';
        menu.style.maxHeight = 'none';
        menu.style.overflow = 'visible';
        menu.style.border = '1px solid var(--fg-color)';
        menu.style.marginTop = '10px';
        menu.style.marginBottom = '10px';
        menu.style.padding = '10px';
        menu.style.boxSizing = 'border-box';
        
        // Fix checkbox display
        const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.style.display = 'inline-block';
          checkbox.style.width = '20px';
          checkbox.style.height = '20px';
          checkbox.style.marginRight = '8px';
          checkbox.style.appearance = 'checkbox';
          checkbox.style.webkitAppearance = 'checkbox';
          checkbox.style.opacity = '1';
          checkbox.style.pointerEvents = 'auto';
        });
      }
    }
  }

  // Make touch targets larger for better mobile usability
  function makeTouchTargetsLarger() {
    // Increase size of buttons and interactive elements
    const touchElements = document.querySelectorAll('button, .font-item, .line-left-col, .line-right-col');
    
    touchElements.forEach(el => {
      el.style.minHeight = '44px'; // Apple's recommended minimum
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
      // Find if we're touching a line
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
          // Swipe left - delete line
          const removeBtn = currentLine.querySelector('.update-button');
          if (removeBtn) {
            removeBtn.click();
          }
        } else {
          // Swipe right - copy text
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

  // Improve the font drop zone for mobile
  function improveDropZone() {
    const dropMsg = document.querySelector('.drop-message');
    
    if (dropMsg) {
      // Create a more visible file input button for mobile users
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.accept = '.ttf,.otf,.woff,.woff2';
      fileInput.style.display = 'none';
      fileInput.id = 'mobile-font-input';
      
      const selectBtn = document.createElement('button');
      selectBtn.textContent = 'Select Font Files';
      selectBtn.style.display = 'block';
      selectBtn.style.width = '100%';
      selectBtn.style.margin = '10px 0';
      selectBtn.style.padding = '12px 20px';
      selectBtn.style.backgroundColor = 'var(--green)';
      selectBtn.style.color = 'white';
      selectBtn.style.border = 'none';
      selectBtn.style.borderRadius = '4px';
      selectBtn.className = 'drop-btn';
      
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
          // First try to access the handleFontFiles function
          if (typeof window.handleFontFiles === 'function') {
            window.handleFontFiles(e.target.files);
          } else {
            // If function isn't available directly, try to import it
            import('./Fonts.js').then(module => {
              if (typeof module.handleFontFiles === 'function') {
                module.handleFontFiles(e.target.files);
              } else {
                console.error("handleFontFiles function not found");
              }
            }).catch(err => {
              console.error("Error importing Fonts.js:", err);
            });
          }
        }
      });
    }
  }

  // Ensure file selection works properly
  function improveFileSelection() {
    // Add an additional direct file input for the form
    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
      fileUpload.addEventListener('change', (e) => {
        console.log("Regular file input change:", e.target.files);
        if (e.target.files && e.target.files.length > 0 && typeof window.handleFontFiles === 'function') {
          window.handleFontFiles(e.target.files);
        }
      });
    }

    // Expose handleFontFiles to window for mobile support
    if (window.Fonts && typeof window.Fonts.handleFontFiles === 'function') {
      window.handleFontFiles = window.Fonts.handleFontFiles;
    }
  }
})();
