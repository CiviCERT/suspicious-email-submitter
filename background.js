function updateNameAndImage() {
  var config = SESConfig.getSelectedConfiguration();
  if (typeof config.logo === 'string') {
    var myCanvas = document.createElement('canvas');
    var ctx = myCanvas.getContext('2d');
    var img = new Image;
    img.onload = function(){
        ctx.drawImage(img,0,0, 100,100); // Or at whatever offset you like
        var imageData = ctx.getImageData(0, 0, 100, 100);
        chrome.browserAction.setIcon({imageData: imageData});
    };
    img.src = config.logo;
  }
}

chrome.runtime.onInstalled.addListener(function(details) {
  console.log("onInstalled");
  if (details.reason === 'install') {
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("onMessage", message, sender);
  if (typeof message === 'string'  && message === 'updateNameAndImage') {
    updateNameAndImage();
  }
});

try {
  updateNameAndImage();
  //TODO: update when config changes
} catch(e) {
  // The extension was reloaded (ie., browser restart)
  // but it is not configured yet.
}
