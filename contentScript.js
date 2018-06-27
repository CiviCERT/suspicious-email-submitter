(function() {
  console.log('SES contentScript');

  // construct download urls
  var url = new URL(location);
  var rawDownloadUrl;

  if (url.host === "mail.google.com") {

    /* GMAIL */
    var selection = $('*[data-message-id]:visible');
    if (selection.length > 0) {
      var messageId = selection[0].dataset['legacyMessageId'] || selection[0].dataset['messageId'];
      // https://mail.google.com/mail/u/0?view=att&th=MESSAGEID&attid=0&disp=comp&safe=1&zw
      rawDownloadUrl = url.origin + url.pathname + "?view=att&th=" + messageId + "&attid=0&disp=comp&safe=1&zw";
    }

  } else if (url.host === "mail.yahoo.com") {

    /* YAHOO */
    // Find the mailbox, message, and wssid parameters in the DOM
    var mailboxId, messageId, wssid;

    var mailboxIdMatchData = document.body.innerHTML.match(/@.id==([^\/]*)\\/);
    if (mailboxIdMatchData) {
      mailboxId = mailboxIdMatchData[1];
    }

    var selection = $('*[data-mid]:visible');
    if (selection.length > 1) {
      selection = selection.filter(function(i, el) {
        return $(el).closest('.offscreen').length == 0;
      });
    }
    messageId = selection[0].dataset['mid'];

    var wssidMatchData = document.body.innerHTML.match(/wssid:\"([^,"]*)\",/);
    if (wssidMatchData) {
      wssid = wssidMatchData[1];
    }

    if (mailboxId && messageId && wssid) {
      // Construct the url that will serve the raw message
      // https://apis.mail.yahoo.com//ws/v3/mailboxes/@.id==MAILBOXID/messages/@.id==MESSAGEID/content/rawplaintext?wssid=WSSID
      rawDownloadUrl = 'https://apis.mail.yahoo.com//ws/v3/mailboxes' +
        '/@.id==' + mailboxId + '/messages/@.id==' + messageId +
        '/content/rawplaintext?wssid=' + wssid;
    }

  }

  if (rawDownloadUrl) {
    // fetch emails
    var deferred = $.get(rawDownloadUrl);
    deferred.then(function(result) {
      // send message to popup
      chrome.runtime.sendMessage(null, { status: deferred.status, result: result });
    }).catch(function(deferred) {
      chrome.runtime.sendMessage(null, { status: deferred.status });
    });
  } else {
      chrome.runtime.sendMessage(null, { status: -1 });
  }
})();
