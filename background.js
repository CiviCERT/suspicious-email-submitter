function run(tab) {
  // Listen for message from the content script
  chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log(data);
    createPopup(tab.id, data.result, data.status);
  })

  // execute the content script in our tab id
  chrome.tabs.executeScript(tab.id, {
    file: 'bundle.js'
  });
}

function createPopup(tabId, result, status) {
  // Set the popup with the data
  if (result) {
    chrome.browserAction.setPopup({
      tabId: tabId,
      popup: "popup.html?data=" + encodeURIComponent(result)
    });
  } else {
    chrome.browserAction.setPopup({
      tabId: tabId,
      popup: "popup.html?status=" + encodeURIComponent(status)
    });
  }
}

chrome.browserAction.onClicked.addListener(run);
