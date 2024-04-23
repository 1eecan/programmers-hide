document
  .getElementById("toggleVisibility")
  .addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleElementsVisibility,
      });
    }
  });

function toggleElementsVisibility() {
  const elementsToHide = document.querySelectorAll(
    ".part-title, .breadcrumb, .level, .finished-count, .acceptance-rate"
  );
  elementsToHide.forEach((element) => {
    element.style.visibility =
      element.style.visibility === "hidden" ? "visible" : "hidden";
  });
}
