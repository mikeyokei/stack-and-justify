// Mobile optimizations for Stack & Justify

// Initialize mobile optimizations
const MobileOptimizations = (function() {
  // Device detection
  const isMobile = window.innerWidth <= 768;
  const isSmallPhone = window.innerWidth <= 480;
  
  // Store original layout elements
  let originalLayout = {
    fontControls: null,
    sizeControls: null,
    filterControls: null
  };
  
  // Create collapsible sections
  function createCollapsibleSections() {
    if (!isMobile) return;
    
    // Sections to make collapsible
    const sections = [
      { id: 'font-section', title: 'Font Settings' },
      { id: 'size-section', title: 'Size Settings' },
      { id: 'filter-section', title: 'Filter Settings' },
      { id: 'features-section', title: 'OpenType Features' }
    ];
    
    sections.forEach(section => {
      const sectionEl = document.getElementById(section.id);
      if (!sectionEl) return;
      
      // Save original content
      if (section.id === 'font-section') originalLayout.fontControls = sectionEl.innerHTML;
      if (section.id === 'size-section') originalLayout.sizeControls = sectionEl.innerHTML;
      if (section.id === 'filter-section') originalLayout.filterControls = sectionEl.innerHTML;
      
      // Create collapsible structure
      const content = sectionEl.innerHTML;
      sectionEl.innerHTML = '';
      sectionEl.classList.add('collapsible-section');
      
      const header = document.createElement('div');
      header.className = 'collapsible-header';
      header.innerHTML = `
        <span>${section.title}</span>
        <span class="toggle-icon">▼</span>
      `;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'collapsible-content';
      contentDiv.innerHTML = content;
      
      sectionEl.appendChild(header);
      sectionEl.appendChild(contentDiv);
      
      // Add toggle functionality
      header.addEventListener('click', () => {
        contentDiv.classList.toggle('open');
        header.querySelector('.toggle-icon').textContent = 
          contentDiv.classList.contains('open') ? '▲' : '▼';
      });
    });
  }
  
  // Optimize menu display for mobile
  function optimizeMenus() {
    if (!isMobile) return;
    
    // Compact the main menu
    const mainMenu = document.querySelector('.main-menu');
    if (mainMenu) {
      mainMenu.classList.add('compact-menu');
      
      // Create a mobile menu toggle
      const menuToggle = document.createElement('button');
      menuToggle.className = 'menu-toggle';
      menuToggle.setAttribute('aria-label', 'Toggle menu');
      menuToggle.innerHTML = '☰';
      
      mainMenu.parentNode.insertBefore(menuToggle, mainMenu);
      
      menuToggle.addEventListener('click', () => {
        mainMenu.classList.toggle('menu-open');
      });
    }
  }
  
  // Improve font dropzone for mobile
  function improveFontDropzone() {
    const dropzone = document.querySelector('.dropzone');
    if (!dropzone) return;
    
    if (isMobile) {
      // Add a file select button for mobile
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.accept = '.ttf,.otf,.woff,.woff2';
      fileInput.style.display = 'none';
      fileInput.id = 'mobile-font-input';
      
      const selectButton = document.createElement('button');
      selectButton.textContent = 'Select Font Files';
      selectButton.className = 'action-button';
      selectButton.addEventListener('click', () => {
        fileInput.click();
      });
      
      dropzone.appendChild(fileInput);
      dropzone.appendChild(selectButton);
      
      // Handle file selection
      fileInput.addEventListener('change', (e) => {
        // Trigger the same event handlers that the dropzone uses
        const event = new CustomEvent('files-selected', {
          detail: { files: e.target.files }
        });
        window.dispatchEvent(event);
      });
    }
  }
  
  // Add swipe functionality for line actions
  function enableSwipeActions() {
    if (!isMobile) return;
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    
    let xDown = null;
    let yDown = null;
    let currentLine = null;
    
    function handleTouchStart(evt) {
      const lineEl = evt.target.closest('.line-container');
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
      
      // Horizontal swipe detection
      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
        if (xDiff > 0) {
          // Swipe left - delete line
          const deleteBtn = currentLine.querySelector('.delete-line-button');
          if (deleteBtn) deleteBtn.click();
        } else {
          // Swipe right - copy text
          const copyBtn = currentLine.querySelector('.copy-text-button');
          if (copyBtn) copyBtn.click();
        }
      }
      
      // Reset values
      xDown = null;
      yDown = null;
      currentLine = null;
    }
  }
  
  // Add responsive layout for control panels
  function makeControlsResponsive() {
    if (!isMobile) return;
    
    const controlPanels = document.querySelectorAll('.control-panel');
    controlPanels.forEach(panel => {
      panel.classList.add('compact-controls');
    });
    
    // Make button groups stack on small phones
    if (isSmallPhone) {
      const buttonGroups = document.querySelectorAll('.button-group');
      buttonGroups.forEach(group => {
        group.classList.add('vertical-buttons');
      });
    }
  }
  
  // Initialize all mobile optimizations
  function init() {
    // Apply optimizations only if we detect a mobile device
    if (isMobile) {
      createCollapsibleSections();
      optimizeMenus();
      improveFontDropzone();
      enableSwipeActions();
      makeControlsResponsive();
      
      // Add mobile class to body for CSS targeting
      document.body.classList.add('mobile-device');
      if (isSmallPhone) document.body.classList.add('small-phone');
      
      // Listen for orientation changes
      window.addEventListener('orientationchange', () => {
        // Small delay to let the browser adjust
        setTimeout(() => {
          // Update UI based on new orientation
          document.body.classList.toggle('landscape', 
            window.orientation === 90 || window.orientation === -90);
        }, 100);
      });
    }
  }
  
  // Return public methods
  return {
    init,
    isMobileDevice: () => isMobile,
    isSmallPhone: () => isSmallPhone
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', MobileOptimizations.init);

// Also expose to global scope for Mithril integration
window.MobileOptimizations = MobileOptimizations;
