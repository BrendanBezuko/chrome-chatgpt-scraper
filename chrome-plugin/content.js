// content.js

console.log("content.js loaded")

let processing_extraction = false;
let convoQueue = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("content.js: recived a request")
  if (request.command === "extractText" && !processing_extraction) {
    console.log("content script: recived request for extractText");

    processing_extraction = true;

    getConvos();

    //remove first page

    if(convoQueue < 1){
      processing_extraction = false;
      alert("single convo");
      return;
    }

    convoQueue.shift();
    navitagtePage();
    processing_extraction = false;
  }
});

function navitagtePage(){

  let extractedData = extractTextFromPage();
  chrome.runtime.sendMessage({ command: "updateList", data: extractedData })
  console.log("content script: send command for extractedData", extractedData);


  convoDiv = convoQueue.shift();
  //click on next div item
  try {
    convoDiv.click();
  }catch (e){
    alert('error');
  }
  
  console.log("content script: send command for extractedData", extractedData);
  if( convoQueue.length >= 0){
    setTimeout(function () {
      navitagtePage();
    }, 2000)
  }
}
S
// Function to extract text from the page
function extractTextFromPage() {
  //const textElements = document.querySelectorAll('.div-1');
  //const textElements = document.querySelectorAll('.group');
  const textElements = document.querySelectorAll('.transition-width');
  const extractedText = Array.from(textElements, (element) => element.textContent + '\n\n');
  const combinedString = extractedText.join('\n');
  return combinedString;
}

function getConvos() {
  convoQueue = [];
  //ADD FEATURE: scrolls and waits for each list item

  //TODO: check if i can just remove ol
  const xpath = '//*[contains(concat( " ", @class, " " ), concat( " ", "active\:opacity-90", " " ))]//*[contains(concat( " ", @class, " " ), concat( " ", "whitespace-nowrap", " " ))]';
  //const xpath ='//*[contains(concat( " ", @class, " " ), concat( " ", "w-\[200px\]", " " ))]';
  matchingElements = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

  let currentElement = matchingElements.iterateNext();
  while(currentElement){
    //if (currentElement.tagName === "DIV") {
      // Add the current element to the convoQueue
      convoQueue.push(currentElement);
    //}
    currentElement = matchingElements.iterateNext();
  }

  console.log("content.js: extracted convo list ", convoQueue);
  //ADD FEATURE: scrolls to top
}