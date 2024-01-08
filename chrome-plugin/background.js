let listData = [];

console.log("background script: init");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("background script: recived request");
    if (request.command === "updateList") {
        console.log("background script: recived request for updatelist dtat:", request.data);
        listData.push(request.data);
        // Notify popup.js about the update
        console.log("background script: sending listUpdated");
        chrome.runtime.sendMessage({ command: "listUpdated", data: listData });
    }
});