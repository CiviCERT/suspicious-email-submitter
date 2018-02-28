console.log('SES contentScript');

// construct download urls
var url = new URL(location);
var rawDownloadUrl;

if (url.host === "mail.google.com") {
  var selection = $('*[data-message-id]');
  if (selection.length > 0) {
    var messageId = selection[0].dataset['messageId'];
    // https://mail.google.com/mail/u/0?view=att&th=MESSAGEID&attid=0&disp=comp&safe=1&zw
    rawDownloadUrl = url.origin + url.pathname + "?view=att&th=" + messageId + "&attid=0&disp=comp&safe=1&zw";

  }

} else if (url.host === "mail.yahoo.com") {
  // https://apis.mail.yahoo.com//ws/v3/mailboxes/@.id==VjN-R91iv4Ew7ABG6ZfcF9Y7tBeuWCmcCXV_rGL_DRMea7aKbRuuMjM9T2pzRtznS3DwBmBxuc2UTjmHlmQVvjcwMQ/messages/@.id==AOyS3goAAAMLWnG7EQJCIEz14Ds/content/rawplaintext?appid=YahooMailNeo&wssid=N54i/xPQPc9&ymreqid=a4b713d2-f6e2-6077-0111-1801db010000
  var mailboxId = ''; // fixme
  var messageId = ''; // fixme
  rawDownloadUrl = 'https://apis.mail.yahoo.com//ws/v3/mailboxes/@.id==' +
    mailboxId + '/messages/@.id==' + messageId + '/content/rawplaintext';
}

if (rawDownloadUrl) {
  // fetch emails
  $.get(rawDownloadUrl, function(result) {
    // send message to popup
    chrome.runtime.sendMessage(null, result);
  });
}
