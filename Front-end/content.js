chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "blockSpoilers") {
      // Implement your machine learning model or any other spoiler detection logic here
      // For this example, we will simply assume that spoilers are blocked successfully.
  
      // You can use DOM manipulation to remove or hide the potential spoiler content.
      // For instance, you could add the following code to remove all paragraphs containing the word "spoiler":
      const paragraphs = document.getElementsByTagName("p");
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].innerText.toLowerCase().includes("spoiler")) {
          paragraphs[i].remove();
        }
      }
  
      // Inform the popup that spoilers have been blocked.
      sendResponse({ success: true });
    }
  });
  