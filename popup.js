var data = null;

// Parse the current page
chrome.tabs.executeScript(tabId, {
  code: 'document.querySelector(' + JSON.stringify('body') + ')'
}, function(results) {
  if (results[0]) {
      data = results[0]
  } else {
      chrome.pageAction.hide(tabId);
  }
});

document.forms["form"].addEventListener('submit', function(event) {
  event.preventDefault();
  fetch('http://localhost:8000', {
    method : 'POST',
    body   : data,
  }).then(function(response) {
    console.log(response.status);
  }).catch(function(error) {
    console.log(error);
  });
});
