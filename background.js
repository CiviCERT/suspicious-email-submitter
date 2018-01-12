if (chrome.declarativeContent) { // chrome only, not supported in ff
  // When the extension is installed or upgraded ...
  chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {
          // If any of the conditions is fulfilled, all actions are executed.
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostContains: 'mail.google.com' },
            }),
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostContains: 'mail.yahoo.com' },
            })
          ],
          // And shows the extension's page action.
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });
} else {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.match(/mail\.google\.com|mail\.yahoo\.com/)) {
        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
  });
}
