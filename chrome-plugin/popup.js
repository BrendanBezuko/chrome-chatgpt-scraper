document.addEventListener("DOMContentLoaded", function () {
    
  const extractedTextList = [];
  
  const ol = document.getElementById("textList");
  const extractButton = document.getElementById("extractButton");
  const saveButton = document.getElementById("saveButton");

  extractButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Check if there is an active tab
        if (tabs.length === 0) {
            console.error("No active tab found");
            return;
        }

        var activeTab = tabs[0];

        // Check if the tab is fully loaded
        if (activeTab.status !== "complete") {
            console.warn("Active tab is not fully loaded yet");
            return;
        }

        // Send a message to the active tab
        chrome.tabs.sendMessage(
            activeTab.id,
            { command: "extractText" }
        );
        console.log("popup script: sent action extractText to tab ID:", activeTab.id);
    });
});

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === "listUpdated") {
        updateListGUI(request.data);
    }
  });

  //create a inital data message and response for background.js

  function updateListGUI(newList) {
    newList.forEach(item => {
      if (!extractedTextList.includes(item)) {
          const li = document.createElement("li");
          li.textContent = item;
          ol.appendChild(li);
          extractedTextList.push(item);
      }
    });
  }

  // Add a click event listener to the button
  saveButton.addEventListener("click", function () {
    const zip = new JSZip();

    for (var index = 0; index < extractedTextList.length; index++) {
        var textContent = extractedTextList[index];
        var fileName = 'chat-' + (index + 1) + '.txt';
        zip.file(fileName, textContent);
      }

    // Generate the ZIP file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Create a URL for the Blob
      const url = URL.createObjectURL(content);

      // Create a download link for the ZIP file
      const link = document.createElement("a");
      link.href = url;
      link.download = "cahtgpt-convos.zip";
      link.click();
    }).catch(function (error) {
        // Handle and log errors
        alert(error);
      });
  });
});
