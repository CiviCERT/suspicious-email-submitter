(function() {
  var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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


      function updateTextField(e) {
        if ($('#followupEnable').is(':checked')) {
          $('#followupEmail').removeAttr('disabled').focus();
        } else {
          $('#followupEmail').attr('disabled', 'disabled');
        }
      }
      $('#followupEnable').change(updateTextField);
      updateTextField();

      document.forms["form"].addEventListener('submit', function(event) {
        event.preventDefault();

        var followupRequested = $('#followupEnable').is(':checked');

        var config = SESConfig.getSelectedConfiguration();
        var serverUrl = config.serverUrl;
        var authToken = config.authToken;
        if (typeof serverUrl !== 'string' || serverUrl.length === 0) {
          //TODO: handle invalid server url
        } else {

          if (serverUrl.match(EMAIL_REGEX)) {
            // Email endpoint: construct and click a mailto link
            let href = [
              "mailto:",
              serverUrl,
              "?subject=Suspicious%20Email%20Submission&body=",
              encodeURIComponent(result)
            ].join('');
            chrome.tabs.update({ url: href });

          } else {
            $('#submit').attr('disabled', 'disabled');
            var options = {};

            if (followupRequested) {
              var followupEmail = $('#followupEmail').val().trim();
              if (followupEmail) {
                options.annotations = ["Follow up with " + followupEmail];
              }
            }

            window.mailToMisp(serverUrl, authToken, result, options).then(function(response) {
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
    if (typeof message === 'object' && sender.tab) {
      console.log(message);
      handleResult(message.result, message.status);
    }
  });

  if (window.browser && browser.mailTabs) {
    // thunderbird
    console.log("thunderbird");

    var query = {
      active: true,
      windowId: browser.windows.WINDOW_ID_CURRENT
    };
    browser.tabs.query(query).then(function(result) {
      return result[0];
    }).then(function(tab){
      if (tab.mailTab) {
        return browser.mailTabs.getSelectedMessages(tab.id).then(function(list) {
          return list.messages[0];
        });
      } else {
        return browser.messageDisplay.getDisplayedMessage(tab.id);
      }
    }).then(function(message){
      return browser.messages.getRaw(message.id)
    }).then(handleResult);

  } else {

    // gmail chrome/ff
    executeContentScript().catch(function(error) {
      console.log(error);
      handleResult(null, -1);
    })

  }
})();
