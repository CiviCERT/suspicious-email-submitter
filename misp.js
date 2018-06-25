(function() {
  // https://www.circl.lu/doc/misp/automation/
  window.mailToMisp = function(serverUrl, authToken, rawEmail, options) {
    options = options || {};
    var objects = [
      {
        //TODO: Pull the following magic numbers from email template?
        'name': 'email',
        'meta-category': 'network',
        'description': 'Email object describing an email with meta-information',
        'template_uuid': 'a0c666e0-fc65-4be8-b48f-3423d788b552',
        'template_version': 10,
        'Attribute': [
          {
            'category': 'Payload delivery',
            'type': 'attachment',
            'object_relation': 'eml',
            'value': 'Raw Email',
            'data': btoa(rawEmail)
          }
        ],
      }
    ];

    if (options.annotations instanceof Array) {
      options.annotations.forEach(function(a) {
        if (typeof a === 'string') {
          objects.push(
            {
              'name': 'annotaion',
              'meta-categiry': 'misc',
              'Attribute': [
                {
                  'type': 'text',
                  'object_relation': 'text',
                  'value': a
                }
              ]
            }
          );
        }
      });
    }

    return fetch(serverUrl + '/events', {
      method : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body   : JSON.stringify({
        'Event': {
          'info': 'Suspicious Email Submitter',
          'distribution': 0,
          'threat_level_id': 3,
          'analysis': 1,
          'Object': objects
        }
      })
    });
  };
})();
