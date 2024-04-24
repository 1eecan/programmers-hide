const visibilityToggles = {
  togglePartTitleBreadcrumb: ".part-title, .breadcrumb",
  toggleLevel: "td.level",
  toggleFinishedCount: "td.finished-count",
  toggleAcceptanceRate: "td.acceptance-rate",
};

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("visibilitySettings", function (data) {
    if (data.visibilitySettings) {
      document.getElementById("togglePartTitleBreadcrumb").checked =
        data.visibilitySettings[".part-title, .breadcrumb"];
      document.getElementById("toggleLevel").checked =
        data.visibilitySettings["td.level"];
      document.getElementById("toggleFinishedCount").checked =
        data.visibilitySettings["td.finished-count"];
      document.getElementById("toggleAcceptanceRate").checked =
        data.visibilitySettings["td.acceptance-rate"];
    }
  });
});

Object.entries(visibilityToggles).forEach(([buttonId, selector]) => {
  document.getElementById(buttonId).addEventListener("change", (event) => {
    const isHidden = event.target.checked;
    updateVisibilitySettings(selector, isHidden);
  });
});

function updateVisibilitySettings(selector, isHidden) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleElementsVisibility,
      args: [selector, isHidden],
    });
  });
}

function toggleElementsVisibility(selector, isHidden) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style.visibility = isHidden ? "hidden" : "visible";
  });
  chrome.storage.local.get("visibilitySettings", (data) => {
    const settings = data.visibilitySettings || {};
    settings[selector] = isHidden;
    chrome.storage.local.set({ visibilitySettings: settings });
  });
}
