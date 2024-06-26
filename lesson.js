const style = document.createElement("style");

style.textContent = `
  .breadcrumb {
    visibility: hidden;
  }
`;
document.documentElement.appendChild(style);

const elementVisibility = {
  ".part-title, .breadcrumb": false,
  "td.level": false,
  "td.finished-count": false,
  "td.acceptance-rate": false,
};

function loadSettings() {
  chrome.storage.local.get("visibilitySettings", (data) => {
    const initialVisibility = data.visibilitySettings
      ? data.visibilitySettings
      : elementVisibility;

    if (data.visibilitySettings) {
      console.log("Loaded from storage");
    } else {
      console.log("Cant loaded from storage");
    }

    Object.keys(initialVisibility).forEach((selector) => {
      updateVisibility(selector, initialVisibility[selector]);
    });
  });
}

function updateVisibility(selector, isHidden) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style.visibility = isHidden ? "hidden" : "visible";
  });
}

let timeout = null;

const observer = new MutationObserver((mutations) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    loadSettings();
    observer.disconnect();
  }, 100);
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
