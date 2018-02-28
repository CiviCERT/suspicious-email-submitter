function run(tab) {
  // Listen for message from the content script
  chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log(data);
    createPopup(tab.id, data);
  })

  // execute the content script in our tab id
  chrome.tabs.executeScript(tab.id, {
    file: 'bundle.js'
  });
}

function createPopup(tabId, data) {
  // Set the popup with the tab id
  chrome.browserAction.setPopup({
    tabId: tabId,
    popup: "popup.html?data=" + encodeURIComponent(data)
  });
}

chrome.browserAction.onClicked.addListener(run);
