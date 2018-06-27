(function() {
  console.log('SES contentScript');

  function getRawEmail() {
    // Call the function for the provider based on the page url
    // FIXME: how to make this work on gsuite w/ custom domain?
    var url = new URL(location);

    if (url.host === "mail.google.com") {
      return getRawEmailGmail();
    } else if (url.host === "mail.yahoo.com") {
      return getRawEmailYahoo();
    }
  }

  function getRawEmailGmail() {
    /* GMAIL */
    var url = new URL(location);
    // Find the message id in the DOM
    var selection = $('*[data-message-id]:visible');
    if (selection.length > 0) {
      var messageId = selection[0].dataset['legacyMessageId'] || selection[0].dataset['messageId'];

      // Construct the url that will serve the raw message
      // https://mail.google.com/mail/u/0?view=att&th=MESSAGEID&attid=0&disp=comp&safe=1&zw
      var rawDownloadUrl = url.origin + url.pathname + "?view=att&th=" + messageId + "&attid=0&disp=comp&safe=1&zw";

      // return a promise
      return new Promise(function(resolve, reject) {
        $.get(rawDownloadUrl).then(function(result) {
          resolve(result);
        }).catch(function() {
          reject(deferred.status);
        });
      });
    }
  }

  function getRawEmailYahoo() {
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

      // return a promise
      return new Promise(function(resolve, reject) {
        $.get(rawDownloadUrl).then(function(result) {
          resolve(result);
        }).catch(function() {
          reject(deferred.status);
        });
      });
    }
  }

  // Get the raw email asynchronously and send a message with the result
  var promise = getRawEmail();

  if (promise) {
    promise.then(function(result) {
      // send message to popup
      chrome.runtime.sendMessage(null, { result: result });
    }).catch(function(status) {
      chrome.runtime.sendMessage(null, { status: status });
    });
  } else {
      chrome.runtime.sendMessage(null, { status: -1 });
  }

})();
