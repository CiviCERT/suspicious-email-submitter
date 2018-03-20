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

updateNameAndImage();
//TODO: update when config changes

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.runtime.openOptionsPage();
  }
});
