const visibilityToggles = {
  togglePartTitleBreadcrumb: ".part-title, .breadcrumb",
  toggleLevel: "td.level",
  toggleFinishedCount: "td.finished-count",
  toggleAcceptanceRate: "td.acceptance-rate",
};

Object.entries(visibilityToggles).forEach(([buttonId, selector]) => {
  document.getElementById(buttonId).addEventListener("click", () => {
    updateVisibilitySettings(selector);
  });
});

function updateVisibilitySettings(selector) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleElementsVisibility,
      args: [selector],
    });

    chrome.storage.local.get("visibilitySettings", (data) => {
      const settings = data.visibilitySettings || {};
      settings[selector] = !settings[selector];
      chrome.storage.local.set({ visibilitySettings: settings });
    });
  });
}

function toggleElementsVisibility(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style.visibility =
      element.style.visibility === "hidden" ? "visible" : "hidden";
  });
}
