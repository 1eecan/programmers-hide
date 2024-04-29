const style = document.createElement("style");

style.textContent = `
  .part-title, .breadcrumb, td.level, td.finished-count, td.acceptance-rate {
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

async function loadSettings() {
  try {
    const data = await new Promise((resolve, reject) => {
      chrome.storage.local.get("visibilitySettings", (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve(result);
      });
    });

    const initialVisibility = data.visibilitySettings || elementVisibility;

    if (data.visibilitySettings) {
      console.log("Loaded from storage");
    } else {
      console.log("Cant loaded from storage");
    }

    Object.keys(initialVisibility).forEach((selector) => {
      updateVisibility(selector, initialVisibility[selector]);
    });
  } catch (error) {
    console.error("Error loading settings:", error);
  }
}

function updateVisibility(selector, isHidden) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style.visibility = isHidden ? "hidden" : "visible";
  });
}

let timeout = null;

const observer = new MutationObserver(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    loadSettings();
  }, 100);
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
