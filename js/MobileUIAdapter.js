// MobileUIAdapter.js - Adapts UI components for mobile devices
// This file should be placed in js/components/

import { Layout } from '../Layout.js';
import { Fonts } from '../Fonts.js';
import { Words } from '../Words.js';

export const MobileUIAdapter = {
  // Keep track of state for mobile UI elements
  isMobile: window.innerWidth <= 768,
  isSmallPhone: window.innerWidth <= 480,
  menuOpen: false,
  currentOpenSection: null,
  
  // Update mobile state when window is resized
  updateMobileState() {
    this.isMobile = window.innerWidth <= 768;
    this.isSmallPhone = window.innerWidth <= 480;
  },
  
  // Initialize mobile detection
  oninit() {
    window.addEventListener('resize', () => {
      this.updateMobileState();
      m.redraw();
    });
  },
  
  // Toggle mobile menu visibility
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  },
  
  // Toggle collapsible section
  toggleSection(section) {
    this.currentOpenSection = this.currentOpenSection === section ? null : section;
  },
  
  // Create mobile-friendly menu
  mobileMenu(vnode) {
    if (!this.isMobile) return null;
    
    return m('.mobile-menu', [
      m('button.menu-toggle', {
        onclick: () => this.toggleMenu(),
        'aria-label': 'Toggle menu'
      }, this.menuOpen ? '×' : '☰'),
      m('.menu-container', {
        class: this.menuOpen ? 'open' : ''
      }, [
        // Insert original menu content here through vnode.children
        vnode.children
      ])
    ]);
  },
  
  // Create a collapsible section component
  collapsibleSection(title, content, sectionId) {
    return m('.collapsible-section', [
      m('.collapsible-header', {
        onclick: () => this.toggleSection(sectionId)
      }, [
        m('span', title),
        m('span.toggle-icon', this.currentOpenSection === sectionId ? '▲' : '▼')
      ]),
      m('.collapsible-content', {
        class: this.currentOpenSection === sectionId ? 'open' : ''
      }, content)
    ]);
  },
  
  // Mobile-optimized font selector
  mobileFontSelector(selectedFont, onchange) {
    if (!this.isMobile) return null;
    
    const familyGroups = Fonts.list.map(family => {
      return m('optgroup', { label: family.name }, 
        family.list.map(font => 
          m('option', {
            value: font.id,
            selected: selectedFont && selectedFont.id === font.id
          }, font.name)
        )
      );
    });
    
    return m('select.mobile-font-select', {
      onchange: e => {
        const fontId = e.target.value;
        const font = Fonts.find(fontId);
        onchange(font);
      }
    }, familyGroups);
  },
  
  // Enhanced file dropzone for mobile
  mobileDropzone(originalDropzone) {
    if (!this.isMobile) return originalDropzone;
    
    return m('.mobile-dropzone', [
      m('p', 'Add font files'),
      m('input[type=file][multiple]', {
        accept: '.ttf,.otf,.woff,.woff2',
        onchange: e => {
          if (e.target.files.length) {
            // Call the same function that the original dropzone uses
            handleFontFiles(e.target.files);
          }
        }
      }),
      m('button.mobile-file-button', {
        onclick: () => {
          // Trigger native file selector
          document.querySelector('.mobile-dropzone input[type=file]').click();
        }
      }, 'Select Fonts')
    ]);
  },
  
  // Mobile-friendly line component with swipe actions
  mobileLine(line) {
    if (!this.isMobile) return null;
    
    // Track touch events for swipe detection
    let touchStart = null;
    
    return m('.mobile-line', {
      ontouchstart: e => {
        touchStart = e.touches[0].clientX;
      },
      ontouchmove: e => {
        if (!touchStart) return;
        
        const touchEnd = e.touches[0].clientX;
        const diff = touchStart - touchEnd;
        
        // Swipe detection
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            // Swipe left - delete
            line.remove();
          } else {
            // Swipe right - copy
            line.copyText();
          }
          touchStart = null;
          m.redraw();
        }
      },
      ontouchend: () => {
        touchStart = null;
      }
    }, [
      // Line content
      m('.line-text', { style: {
        fontFamily: line.outputFont.val.fontFaceName,
        fontSize: `${line.outputSize.val}px`
      }}, line.text.val),
      
      // Mobile action hints
      m('.swipe-hints', [
        m('span.swipe-left', 'Swipe left to delete'),
        m('span.swipe-right', 'Swipe right to copy')
      ])
    ]);
  },
  
  // Compact control panel for mobile
  mobileControls() {
    if (!this.isMobile) return null;
    
    return m('.mobile-controls', [
      this.collapsibleSection('Font Settings', [
        this.mobileFontSelector(Layout.font.val, font => {
          Layout.font.val = font;
          Layout.update();
        }),
        
        // Font lock toggle
        m('label.mobile-toggle', [
          m('input[type=checkbox]', {
            checked: Layout.fontLocked.val,
            onchange: e => {
              Layout.fontLocked.val = e.target.checked;
              Layout.update();
            }
          }),
          'Lock Font'
        ])
      ], 'font-settings'),
      
      this.collapsibleSection('Size Settings', [
        m('input.size-input', {
          type: 'text',
          value: Layout.size.get(),
          oninput: e => {
            Layout.size.set(e.target.value);
            Layout.update();
          }
        }),
        
        // Size lock toggle
        m('label.mobile-toggle', [
          m('input[type=checkbox]', {
            checked: Layout.sizeLocked.val,
            onchange: e => {
              Layout.sizeLocked.val = e.target.checked;
              Layout.update();
            }
          }),
          'Lock Size'
        ])
      ], 'size-settings'),
      
      this.collapsibleSection('Actions', [
        m('button.action-button', {
          onclick: () => Layout.addLine()
        }, 'Add Line'),
        
        m('button.action-button', {
          onclick: () => Layout.copyText()
        }, 'Copy All'),
        
        m('button.action-button', {
          onclick: () => Layout.clear()
        }, 'Clear')
      ], 'actions'),
      
      this.collapsibleSection('Language', [
        m('.language-grid', 
          Words.data.languages.map(lang => 
            m('label.language-option', [
              m('input[type=checkbox]', {
                checked: lang.selected,
                onchange: e => {
                  lang.selected = e.target.checked;
                  // Update all fonts after language change
                  Fonts.updateAll();
                }
              }),
              lang.label
            ])
          )
        )
      ], 'languages')
    ]);
  },
  
  // View function to return the appropriate component based on device
  view(vnode) {
    // Return mobile components or original content based on device
    return this.isMobile 
      ? m('.mobile-ui-wrapper', [
          this.mobileMenu(vnode),
          this.mobileControls(),
          vnode.children
        ])
      : vnode.children;
  }
};

// Register as a Mithril component
export default MobileUIAdapter;
