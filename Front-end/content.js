// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "blockSpoilers") {
//     // Implement your machine learning model or any other spoiler detection logic here
//     // For this example, we will simply assume that spoilers are blocked successfully.

//     // You can use DOM manipulation to remove or hide the potential spoiler content.
//     // For instance, you could add the following code to remove all paragraphs containing the word "spoiler":
//     const paragraphs = document.getElementsByTagName("p");
//     for (let i = 0; i < paragraphs.length; i++) {
//       if (paragraphs[i].innerText.toLowerCase().includes("spoiler")) {
//         paragraphs[i].remove();
//       }
//     }

//     // Inform the popup that spoilers have been blocked.
//     sendResponse({ success: true });
//   }
// });
// const tf = require('@tensorflow/tfjs');

async function loadModel() {
  const model = await tf.loadLayersModel('model.json');
  return model;
}

async function initTokenizer() {
  const model = await tf.keras.preprocessing.text.Tokenizer();
  return model;
}

const modelPromise = loadModel();
// Initialize the TensorFlow.js tokenizer
const tokenizerPromise = initTokenizer();
// Function to preprocess the review text
function preprocess(text) {
  // Implement your text preprocessing logic here
  return text.toLowerCase();
}

// Function to check if a review contains blocked keywords
async function containsBlockedKeywords(reviewText) {
  const preprocessedText = preprocess(reviewText); // Preprocess the review text (e.g., tokenization, lowercase)
  const tokenizer = await tokenizerPromise;
  const sequence = tokenizer.texts_to_sequences([preprocessedText]); // Convert to a sequence
  const inputTensor = tf.tensor(sequence); // Convert the sequence to a tensor

  // Make a prediction using the loaded model
  const model = await modelPromise;
  const prediction = model.predict(inputTensor);
  const predictionClass = prediction.argMax().dataSync()[0];

  // Class 0 means no spoiler, Class 1 means spoiler
  return predictionClass === 1;
}

// Function to recursively traverse the DOM and hide parent elements containing spoilers
function hideParentsWithBlockedKeywords(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const containsSpoiler = containsBlockedKeywords(node.textContent);

    if (containsSpoiler) {
      let parentElement = node.parentElement;
      while (parentElement) {
        parentElement.style.display = 'none';
        parentElement = parentElement.parentElement;
      }
    }
  } else {
    for (const childNode of node.childNodes) {
      hideParentsWithBlockedKeywords(childNode);
    }
  }
}

// Wait for the page to load and then run the logic to hide elements with blocked keywords
window.addEventListener('load', () => {
  // Start traversing the DOM from the body element
  hideParentsWithBlockedKeywords(document.body);
});


// For example, you can use the DOM APIs to find and hide reviews containing blocked keywords
// Retrieve blocked keywords from Chrome storage
chrome.storage.sync.get(['blockedKeywords'], async function (result) {
  const blockedKeywords = result.blockedKeywords || [];
  // const tokenizer = new Tokenizer(); // Initialize the tokenizer here if needed
  const tokenizer = await tokenizerPromise;
  // Configure tokenizer with your vocabulary
  tokenizer.fitOnTexts(blockedKeywords); // Replace with actual list of texts for training

  // Wait for the page to load and then run the logic to hide elements with blocked keywords
  window.addEventListener('load', () => {
    // Start traversing the DOM from the body element
    hideParentsWithBlockedKeywords(document.body);
  });
});