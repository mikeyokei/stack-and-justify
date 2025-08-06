// Add this code to your app.js or create a new file called mobileFix.js

// This is a simple fix to make the language menu accessible on mobile
// It directly manipulates the DOM after the app renders

(function() {
  // Function to fix language menu
  function fixLanguageMenuOnMobile() {
    // Check if on mobile
    if (window.innerWidth <= 768) {
      // Find the language menu
      let languageMenu = document.querySelector('.language-menu');
      if (!languageMenu) {
        // Try to find it by different selectors if needed
        languageMenu = document.querySelector('[data-menu="languages"]') || 
                       document.querySelector('.menu-item:contains("Languages")');
      }
      
      if (languageMenu) {
        // Force it to display as a modal dialog on mobile
        languageMenu.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Create a mobile-friendly language selection dialog
          const mobileDialog = document.createElement('div');
          mobileDialog.className = 'mobile-language-dialog';
          mobileDialog.style.position = 'fixed';
          mobileDialog.style.top = '0';
          mobileDialog.style.left = '0';
          mobileDialog.style.width = '100%';
          mobileDialog.style.height = '100%';
          mobileDialog.style.backgroundColor = 'rgba(255,255,255,0.95)';
          mobileDialog.style.zIndex = '9999';
          mobileDialog.style.padding = '20px';
          mobileDialog.style.boxSizing = 'border-box';
          mobileDialog.style.overflow = 'auto';
          
          // Add header
          const header = document.createElement('div');
          header.innerHTML = '<h2 style="margin-bottom:15px">Select Languages</h2>';
          mobileDialog.appendChild(header);
          
          // Add languages
          const languagesList = document.createElement('div');
          
          // Get all languages from Words.data.languages
          // Since we can't directly access the Words object, we'll create our own checkboxes
          const languages = [
            {name: 'catalan', label: 'Catalan', code: 'ca'},
            {name: 'czech', label: 'Czech', code: 'cs'},
            {name: 'danish', label: 'Danish', code: 'da'},
            {name: 'dutch', label: 'Dutch', code: 'nl'},
            {name: 'english', label: 'English', code: 'en'},
            {name: 'finnish', label: 'Finnish', code: 'fi'},
            {name: 'french', label: 'French', code: 'fr'},
            {name: 'german', label: 'German', code: 'de'},
            {name: 'hungarian', label: 'Hungarian', code: 'hu'},
            {name: 'icelandic', label: 'Icelandic', code: 'is'},
            {name: 'italian', label: 'Italian', code: 'it'},
            {name: 'latin', label: 'Latin', code: 'la'},
            {name: 'norwegian', label: 'Norwegian', code: 'no'},
            {name: 'polish', label: 'Polish', code: 'pl'},
            {name: 'slovak', label: 'Slovak', code: 'sk'},
            {name: 'spanish', label: 'Spanish', code: 'es'},
            {name: 'vietnamese', label: 'Vietnamese', code: 'vi'}
          ];
          
          languages.forEach(lang => {
            const langItem = document.createElement('label');
            langItem.style.display = 'block';
            langItem.style.padding = '10px';
            langItem.style.margin = '5px 0';
            langItem.style.border = '1px solid #ddd';
            langItem.style.borderRadius = '4px';
            
            // Find existing checkbox to see if it's selected
            const existingCheckbox = document.querySelector(`input[name="${lang.name}"]`) || 
                                    document.querySelector(`input[data-lang="${lang.name}"]`);
            const isChecked = existingCheckbox ? existingCheckbox.checked : (lang.name === 'english');
            
            langItem.innerHTML = `
              <input type="checkbox" name="mobile-${lang.name}" 
                     style="width:24px;height:24px;margin-right:10px;vertical-align:middle" 
                     ${isChecked ? 'checked' : ''}>
              <span style="vertical-align:middle">${lang.label}</span>
            `;
            
            languagesList.appendChild(langItem);
          });
          
          mobileDialog.appendChild(languagesList);
          
          // Add save button
          const saveButton = document.createElement('button');
          saveButton.textContent = 'Save & Apply';
          saveButton.style.display = 'block';
          saveButton.style.width = '100%';
          saveButton.style.padding = '15px';
          saveButton.style.margin = '20px 0';
          saveButton.style.backgroundColor = '#4a90e2';
          saveButton.style.color = 'white';
          saveButton.style.border = 'none';
          saveButton.style.borderRadius = '4px';
          saveButton.style.fontSize = '16px';
          
          saveButton.addEventListener('click', function() {
            // Find all checkboxes in our dialog
            const checkboxes = mobileDialog.querySelectorAll('input[type="checkbox"]');
            
            // Find all original language checkboxes
            checkboxes.forEach(checkbox => {
              const langName = checkbox.name.replace('mobile-', '');
              const originalCheckbox = document.querySelector(`input[name="${langName}"]`) || 
                                      document.querySelector(`input[data-lang="${langName}"]`);
              
              if (originalCheckbox && originalCheckbox.checked !== checkbox.checked) {
                // Trigger a click on the original checkbox to toggle it
                originalCheckbox.checked = checkbox.checked;
                
                // Dispatch change event
                const event = new Event('change', { bubbles: true });
                originalCheckbox.dispatchEvent(event);
              }
            });
            
            // Remove the dialog
            document.body.removeChild(mobileDialog);
          });
          
          mobileDialog.appendChild(saveButton);
          
          // Add cancel button
          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.style.display = 'block';
          cancelButton.style.width = '100%';
          cancelButton.style.padding = '15px';
          cancelButton.style.margin = '10px 0';
          cancelButton.style.backgroundColor = '#f5f5f5';
          cancelButton.style.border = '1px solid #ddd';
          cancelButton.style.borderRadius = '4px';
          cancelButton.style.fontSize = '16px';
          
          cancelButton.addEventListener('click', function() {
            document.body.removeChild(mobileDialog);
          });
          
          mobileDialog.appendChild(cancelButton);
          
          // Add to body
          document.body.appendChild(mobileDialog);
        });
      }
    }
  }
  
  // Run the fix after a delay to ensure the app has rendered
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixLanguageMenuOnMobile, 1500);
  });
  
  // Re-run on resize
  window.addEventListener('resize', function() {
    setTimeout(fixLanguageMenuOnMobile, 300);
  });
})();
