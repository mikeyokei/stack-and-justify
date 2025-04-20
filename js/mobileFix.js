// Mobile optimizations for Stack & Justify
// This consolidated file replaces the previous mobileFix.js and mobileOptimizations.js

(function() {
  // Run after a slight delay to ensure the Mithril app has rendered
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMobileOptimizations, 500);

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
    createCollapsibleSections();
  }

  // Fix the language menu - this is high priority
  function fixLanguageMenu() {
    // Try to find the language menu or dropdown
    const languageMenus = [
      document.querySelector('.language-menu'),
      document.querySelector('[data-menu="languages"]'),
      document.querySelector('.menu-container .submenu'),
      document.querySelector('.options button')
    ];
    
    // Find the first valid menu element
    const languageMenu = languageMenus.find(menu => menu !== null);
    
    if (languageMenu) {
      // Make language container visible if it exists
      const languageContainer = document.querySelector('.languages-container') || 
                               document.querySelector('.submenu-content') ||
                               document.querySelector('.menu');
                               
      if (languageContainer) {
        // Make it visible and accessible
        languageContainer.style.display = 'block';
        languageContainer.style.position = 'relative';
        languageContainer.style.maxHeight = 'none';
        languageContainer.style.overflow = 'visible';
        languageContainer.style.zIndex = '100';
        languageContainer.style.background = 'var(--bg-color)';
        languageContainer.style.padding = '10px';
        languageContainer.style.border = '1px solid var(--fg-color)';
        languageContainer.style.width = '100%';
        languageContainer.style.boxSizing = 'border-box';
        
        // Make language checkboxes easier to tap
        const checkboxes = languageContainer.querySelectorAll('input[type="checkbox"]');
        const labels = languageContainer.querySelectorAll('label');
        
        checkboxes.forEach(checkbox => {
          checkbox.style.width = '24px';
          checkbox.style.height = '24px';
          checkbox.style.marginRight = '10px';
          checkbox.style.display = 'inline-block';
          checkbox.style.verticalAlign = 'middle';
          checkbox.style.appearance = 'checkbox'; // Override the reset.css
          checkbox.style.opacity = '1';
        });
        
        labels.forEach(label => {
          label.style.display = 'block';
          label.style.padding = '10px 5px';
          label.style.margin = '5px 0';
        });
      }
      
      // Add click event to language menu toggle if needed
      languageMenu.addEventListener('click', function(e) {
        // Toggle visibility if we find a submenu that's initially hidden
        const submenu = document.querySelector('.submenu-content');
        if (submenu && getComputedStyle(submenu).display === 'none') {
          submenu.style.display = 'block';
          submenu.style.maxHeight = 'none';
        }
      });
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
          const removeBtn = currentLine.querySelector('.remove');
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
        feedback.style.position = 'absolute';
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
    const dropZone = document.querySelector('.drop-zone');
    const dropMsg = document.querySelector('.drop-message');
    
    if (dropZone && dropMsg) {
      // Create a file input button for mobile users
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.accept = '.ttf,.otf,.woff,.woff2';
      fileInput.style.display = 'none';
      fileInput.id = 'mobile-font-input';
      
      const selectBtn = document.createElement('button');
      selectBtn.textContent = 'Select Font Files';
      selectBtn.style.display = 'block';
      selectBtn.style.margin = '10px auto';
      selectBtn.style.padding = '12px 20px';
      selectBtn.className = 'drop-btn';
      
      selectBtn.addEventListener('click', () => {
        fileInput.click();
      });
      
      // Append to drop message area
      dropMsg.appendChild(fileInput);
      dropMsg.appendChild(selectBtn);
      
      // Connect to the app's font loading system
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          // Trigger the same event that the app uses for drag and drop
          const dropEvent = new CustomEvent('files-selected', {
            detail: { files: e.target.files }
          });
          window.dispatchEvent(dropEvent);
          
          // Or try to directly trigger the app's font handling
          if (window.handleFontFiles) {
            window.handleFontFiles(e.target.files);
          }
        }
      });
    }
  }

  // Create collapsible sections to save space
  function createCollapsibleSections() {
    // Add collapsible behavior to the header
    const header = document.querySelector('.header');
    
    if (header) {
      // Create header sections that can be collapsed
      const sections = [
        { selector: '.logo', title: 'Stack & Justify' },
        { selector: '.drop-message', title: 'Add Fonts' },
        { selector: '.options', title: 'Options' },
        { selector: '.features', title: 'Features' },
        { selector: '.header-btns', title: 'Actions' }
      ];
      
      sections.forEach(section => {
        const element = header.querySelector(section.selector);
        if (!element || element.querySelector('.mobile-section-header')) return;
        
        // Save the original content
        const content = element.innerHTML;
        
        // Create a collapsible section
        element.innerHTML = '';
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'mobile-section-header';
        sectionHeader.innerHTML = `
          <span>${section.title}</span>
          <span class="toggle-icon">▼</span>
        `;
        
        const sectionContent = document.createElement('div');
        sectionContent.className = 'mobile-section-content';
        sectionContent.innerHTML = content;
        sectionContent.style.display = 'none';
        
        element.appendChild(sectionHeader);
        element.appendChild(sectionContent);
        
        // Skip collapsible behavior for logo section
        if (section.selector === '.logo') {
          sectionContent.style.display = 'block';
          return;
        }
        
        // Add toggle functionality
        sectionHeader.addEventListener('click', () => {
          const isVisible = sectionContent.style.display !== 'none';
          sectionContent.style.display = isVisible ? 'none' : 'block';
          sectionHeader.querySelector('.toggle-icon').textContent = isVisible ? '▼' : '▲';
        });
      });
    }
  }
})();
