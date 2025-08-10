/* ====== THEME STYLES ====== */
const themeStyles = `
  body[data-hn-theme], body[data-hn-theme] table {
    border: none !important;
    font-family: var(--hn-font, Verdana, Geneva, sans-serif) !important;
  }
  body[data-hn-theme] td { border: none !important; }
  body[data-hn-theme] .hnname a { font-weight: bold !important; }

  /* Dark */
  body[data-hn-theme="dark"], body[data-hn-theme="dark"] table {
    background-color: #121212 !important;
    color: #e0e0e0 !important;
  }
  body[data-hn-theme="dark"] .titleline a { color: #ff9800 !important; }
  body[data-hn-theme="dark"] .hnname a { color: #ffcc00 !important; }
  body[data-hn-theme="dark"] .pagetop a { color: #ffcc00 !important; }
  body[data-hn-theme="dark"] center table tbody { background-color: #1f1f1f !important; }
  body[data-hn-theme="dark"] .commtext, body[data-hn-theme="dark"] .subtext span, body[data-hn-theme="dark"] .subtext a { color: #ecbc73 !important; }
  body[data-hn-theme="dark"] .comhead a { color: #ecbc73 !important; }
  body[data-hn-theme="dark"] .pagetop { color: #ecbc73 !important; }
  body[data-hn-theme="dark"] .subtext a { color: #ecbc73 !important; }

  /* Solarized */
  body[data-hn-theme="solarized"], body[data-hn-theme="solarized"] table {
    background-color: #fdf6e3 !important;
    color: #657b83 !important;
  }
  body[data-hn-theme="solarized"] .titleline a { color: #268bd2 !important; }
  body[data-hn-theme="solarized"] .hnname a { color: #b58900 !important; }
  body[data-hn-theme="solarized"] .pagetop a { color: #b58900 !important; }
  body[data-hn-theme="solarized"] center table[bgcolor="#ff6600"] { background-color: #eee8d5 !important; }
  body[data-hn-theme="solarized"] .subtext span, body[data-hn-theme="solarized"] .subtext a { color: #6CAFD8 !important; }

  /* Pastel */
  body[data-hn-theme="pastel"], body[data-hn-theme="pastel"] table {
    background-color: #faf0e6 !important;
    color: #444 !important;
  }
  body[data-hn-theme="pastel"] a { color: #ff6f61 !important; }
  body[data-hn-theme="pastel"] .hnname a { color: #ffb347 !important; }
  body[data-hn-theme="pastel"] center table[bgcolor="#ff6600"] { background-color: #ffe4e1 !important; }
  body[data-hn-theme="pastel"] .score { color: #ff6f61 !important; }

  /* High contrast */
  body[data-hn-theme="highcontrast"], body[data-hn-theme="highcontrast"] table {
    background-color: #000 !important;
    color: #fff !important;
  }
  body[data-hn-theme="highcontrast"] a { color: #00ffff !important; }
  body[data-hn-theme="highcontrast"] .hnname a { color: #ffff00 !important; }
  body[data-hn-theme="highcontrast"] center table[bgcolor="#ff6600"] { background-color: #111 !important; }
  body[data-hn-theme="highcontrast"] .score { color: #00ffff !important; }
`;

/* ====== FONT LOADING ====== */
const availableFonts = {
  Inter: "fonts/inter.woff2",
  "Fira Code": "fonts/fira-code.woff2",
  "Merriweather": "fonts/merriweather.woff2",
  "Poppins": "fonts/poppins.woff2",
};

function injectFontFace(fontName, fontPath) {
  const fontUrl = chrome.runtime.getURL(fontPath);
  const style = document.createElement("style");
  style.id = "hn-font-style";
  style.textContent = `
    @font-face {
      font-family: '${fontName}';
      src: url('${fontUrl}') format('woff2');
      font-weight: 400;
      font-style: normal;
    }
    body, td, .admin td, .subtext td, .default, .admin, .title, .subtext, 
    .yclinks, .pagetop, .comhead, .comment {
      font-family: '${fontName}', Verdana, Geneva, sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}

function removeFontFace() {
  const existing = document.getElementById("hn-font-style");
  if (existing) existing.remove();
}

/* ====== APPLY SETTINGS FROM STORAGE ====== */
chrome.storage.sync.get(["theme", "font", "size"], ({ theme, font, size }) => {
  applyTheme(theme);
  applyFont(font);
  if (size) {
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      applySize(size);
    } else {
      document.addEventListener("DOMContentLoaded", () => applySize(size));
    }
  }
});

/* ====== LISTEN FOR POPUP CHANGES ====== */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  try {
    if (msg.theme !== undefined) applyTheme(msg.theme);
    if (msg.font !== undefined) applyFont(msg.font);
    if (msg.size !== undefined) applySize(msg.size);
    
    // Send success response
    sendResponse({ success: true });
  } catch (error) {
    // Send error response
    sendResponse({ success: false, error: error.message });
  }
  
  // Return true to indicate we will respond asynchronously
  return true;
});

/* ====== THEME HANDLERS ====== */
function applyTheme(theme) {
  // Remove old style if exists
  const existingThemeStyle = document.getElementById("hn-themes-styles");
  if (existingThemeStyle) existingThemeStyle.remove();

  if (theme && theme !== "default") {
    const s = document.createElement("style");
    s.id = "hn-themes-styles";
    s.textContent = themeStyles;
    document.head.appendChild(s);
    document.body.setAttribute("data-hn-theme", theme);
  } else {
    document.body.removeAttribute("data-hn-theme");
  }
}

/* ====== FONT HANDLERS ====== */
function applyFont(font) {
  removeFontFace();
  if (font && font !== "default" && availableFonts[font]) {
    injectFontFace(font, availableFonts[font]);
  }
}

/* ====== SIZE HANDLERS ====== */
function applySize(size) {
  const existing = document.getElementById("hn-size-style");
  if (existing) existing.remove();

  if (size && size !== "default") {
    let extra = size === "plus2" ? 2 : size === "plus4" ? 4 : 0;

    // Set fixed baselines
    const s = document.createElement("style");
    s.id = "hn-size-style";
    s.textContent = `
      .titleline { font-size: ${14 + extra}px !important; }
      .subtext   { font-size: ${10 + extra}px !important; }
      .pagetop   { font-size: ${14 + extra}px !important; }
    `;
    document.head.appendChild(s);
  }
}
