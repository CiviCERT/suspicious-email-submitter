(function() {
  function handleResult(result, status) {
    if (!result) {
      // Something is not right.
      $('#submit').attr('disabled', 'disabled');

      if (!status || status == -1) {
        // this page is probably not an email
        $('#status').text(chrome.i18n.getMessage('popupNoEmailDeteceted'));
      } else {
        // http error?
        if (status === '0') {
          $('#status').text(chrome.i18n.getMessage('popupDownloadFailed'));
        } else if (status >= 500) {
          $('#status').text(chrome.i18n.getMessage('popupEmailServerError'));
        }
      }

    } else { // got a  result
      $('#status').hide();
      $('#form').show();
      $('#submit').removeAttr('disabled');
      $('#data').text(result);

      var config = SESConfig.getSelectedConfiguration();
      $('#destination .name').text(config.name);
      $('#destination .logo').attr('src', config.logo);

      document.forms["form"].addEventListener('submit', function(event) {
        event.preventDefault();
        $('#submit').attr('disabled', 'disabled');
        var config = SESConfig.getSelectedConfiguration();
        var serverUrl = config.serverUrl;
        var authToken = config.authToken;
        if (typeof serverUrl !== 'string' || serverUrl.length === 0) {
          //TODO: handle invalid server url
        } else {
          window.mailToMisp(serverUrl, authToken, result).then(function(response) {
            return response.json();
          }).then(function(object) {
            if (object.Event) {
              var eventId = object.Event.id;
              console.log("Created event", eventId);
              $('#submit').hide();
              $('#thanks').show();
            } else {
              $('#submit').hide();
              $('#error').show();
              console.log("Failed to create event");
              console.log(object);
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
      });
    }
  }

  function executeContentScript() {
    return new Promise(function(resolve, reject) {
      // Listen for message from the content script
      try {
        chrome.tabs.executeScript(null, {
          file: 'bundle.js'
        }, function(results) {
          var error = chrome.runtime.lastError;
          if (!error && results.length && !results[0]) {
            console.log(results[0]);
            resolve(results[0]);
          } else {
            reject(error);
          }
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  $('.openSettings').click(function(event) {
    event.preventDefault();
    window.open('/options.html');
  });

  try {
    var config = SESConfig.getSelectedConfiguration();
  } catch(error) {
    $('#status').text(chrome.i18n.getMessage('popupNotConfigured'));
    $('#notConfigured').show();
    return; // bail!
  }

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (sender.tab) {
      console.log(message);
      handleResult(message.result, message.status);
    }
  });

  executeContentScript().catch(function(error) {
    console.log(error);
    handleResult(null, -1);
  })
})();
