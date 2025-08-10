// Visual feedback helper
function showFeedback(elementId, message, type = 'success') {
  const feedback = document.getElementById(elementId);
  if (feedback) {
    feedback.textContent = message;
    feedback.className = `feedback show ${type}`;
    
    // Hide after 2 seconds
    setTimeout(() => {
      feedback.className = 'feedback';
    }, 2000);
  }
}

// Loading state helper
function setLoadingState(settingElement, loading) {
  if (loading) {
    settingElement.classList.add('loading');
  } else {
    settingElement.classList.remove('loading');
  }
}

document.getElementById("theme").addEventListener("change", (e) => {
  const theme = e.target.value;
  const setting = e.target.closest('.setting');
  
  setLoadingState(setting, true);
  
  chrome.storage.sync.set({ theme }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('news.ycombinator.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { theme }, (response) => {
          setLoadingState(setting, false);
          if (chrome.runtime.lastError) {
            showFeedback('theme-feedback', 'Error applying theme', 'error');
          } else {
            showFeedback('theme-feedback', 'Applied!', 'success');
          }
        });
      } else {
        setLoadingState(setting, false);
        showFeedback('theme-feedback', 'Visit HN first', 'error');
      }
    });
  });
});

document.getElementById("font").addEventListener("change", (e) => {
  const font = e.target.value;
  const setting = e.target.closest('.setting');
  
  setLoadingState(setting, true);
  
  chrome.storage.sync.set({ font }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('news.ycombinator.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { font }, (response) => {
          setLoadingState(setting, false);
          if (chrome.runtime.lastError) {
            showFeedback('font-feedback', 'Error applying font', 'error');
          } else {
            showFeedback('font-feedback', 'Applied!', 'success');
          }
        });
      } else {
        setLoadingState(setting, false);
        showFeedback('font-feedback', 'Visit HN first', 'error');
      }
    });
  });
});

document.getElementById("size").addEventListener("change", (e) => {
  const size = e.target.value;
  const setting = e.target.closest('.setting');
  
  setLoadingState(setting, true);
  
  chrome.storage.sync.set({ size }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('news.ycombinator.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { size }, (response) => {
          setLoadingState(setting, false);
          if (chrome.runtime.lastError) {
            showFeedback('size-feedback', 'Error applying size', 'error');
          } else {
            showFeedback('size-feedback', 'Applied!', 'success');
          }
        });
      } else {
        setLoadingState(setting, false);
        showFeedback('size-feedback', 'Visit HN first', 'error');
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    ["theme", "font", "size"],
    ({ theme, font, size }) => {
      if (theme) {
        document.getElementById("theme").value = theme;
        // Highlight the active theme
        const themeSelect = document.getElementById("theme");
        if (theme !== 'default') {
          themeSelect.style.borderColor = '#ff6600';
          themeSelect.style.boxShadow = '0 0 0 1px rgba(255, 102, 0, 0.3)';
        }
      }
      if (font) {
        document.getElementById("font").value = font;
        // Highlight the active font
        const fontSelect = document.getElementById("font");
        if (font !== 'default') {
          fontSelect.style.borderColor = '#ff6600';
          fontSelect.style.boxShadow = '0 0 0 1px rgba(255, 102, 0, 0.3)';
        }
      }
      if (size) {
        document.getElementById("size").value = size;
        // Highlight the active size
        const sizeSelect = document.getElementById("size");
        if (size !== 'default') {
          sizeSelect.style.borderColor = '#ff6600';
          sizeSelect.style.boxShadow = '0 0 0 1px rgba(255, 102, 0, 0.3)';
        }
      }
    }
  );
});
