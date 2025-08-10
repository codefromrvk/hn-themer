document.getElementById("theme").addEventListener("change", (e) => {
  const theme = e.target.value;
  chrome.storage.sync.set({ theme });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { theme });
  });
});

document.getElementById("font").addEventListener("change", (e) => {
  const font = e.target.value;
  chrome.storage.sync.set({ font });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { font });
  });
});

document.getElementById("size").addEventListener("change", (e) => {
  const size = e.target.value;
  chrome.storage.sync.set({ size });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { size });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    ["theme", "font", "size"],
    ({ theme, font, size }) => {
      if (theme) document.getElementById("theme").value = theme;
      if (font) document.getElementById("font").value = font;
      if (size) document.getElementById("size").value = size;
    }
  );
});
