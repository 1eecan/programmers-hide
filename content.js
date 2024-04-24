document.addEventListener("DOMContentLoaded", function () {
  applyVisibilitySettings();
});

function applyVisibilitySettings() {
  chrome.storage.sync.get("visibilitySettings", (data) => {
    const settings = data.visibilitySettings || {};
    Object.keys(settings).forEach((selector) => {
      const isVisible = settings[selector];
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.style.visibility = isVisible ? "visible" : "hidden";
      });
    });
  });
}
