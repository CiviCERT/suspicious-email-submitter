(function() {
  // https://www.circl.lu/doc/misp/automation/
  window.mailToMisp = function(serverUrl, authToken, rawEmail) {
    return fetch(serverUrl + '/events', {
      method : 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": authToken
      },
      body   : JSON.stringify({
        "Event": {
          "info": "test", // TODO: insert email subject here?
          "distribution": 0,
          "threat_level_id": 3,
          "analysis": 1,
          "Object": [
            {
              //TODO: Pull the following magic numbers from email template?
              'name': 'email',
              'meta-category': 'network',
              'description': 'Email object describing an email with meta-information',
              'template_uuid': 'a0c666e0-fc65-4be8-b48f-3423d788b552',
              'template_version': 8,
              'Attribute': [
                {
                  'Category': 'Payload delivery',
                  'type': 'email-body',
                  'value': rawEmail
                }
              ],
            }
          ]
        }
      })
    });
  };
})();
