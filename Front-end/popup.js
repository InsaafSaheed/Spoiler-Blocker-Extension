document.getElementById("blockButton").addEventListener("click", blockSpoilers);

function blockSpoilers() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "blockSpoilers" }, function (
      response
    ) {
      if (response && response.success) {
        document.getElementById("statusMessage").innerText =
          "Spoilers blocked successfully!";
      } else {
        document.getElementById("statusMessage").innerText =
          "No spoilers found on this page.";
      }
    });
  });
}
