var data = new URL(location).searchParams.get('data');
var status = new URL(location).searchParams.get('status');

$('#settings').click(function(event) {
  event.preventDefault();
  window.open('/options.html');
});


if (data) {
  $('#submit').removeAttr('disabled');
  $('#data').text(data);

  document.forms["form"].addEventListener('submit', function(event) {
    event.preventDefault();
    var serverUrl = localStorage.getItem('serverUrl');
    var authToken = localStorage.getItem('authToken');
    if (typeof serverUrl !== 'string' || serverUrl.length === 0) {
      // handle invalid server url
    } else {
      // curl -i -H "Accept: application/json"
      //      -H "content-type: application/json"
      //      -H "Authorization: a4PLf8QICdDdOmFjwdtSYqkCqn9CvN0VQt7mpUUf"
      //      --data "@event.json" -X POST http://server/events
      //
      fetch(serverUrl + '/events', {
        method : 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body   : JSON.stringify({
          "Event": {
              "info": "test",
              "Attribute": [
                {
                  'Category': 'Payload delivery',
                  'type': 'email-body',
                  'value': data
                }
              ]
}
        })
      }).then(function(response) {
        var eventId = response.Event.id;
        console.log("Created event", eventId);
      }).catch(function(error) {
        console.log(error);
      });
    }
  });
} else if (status) {
  $('#submit').attr('disabled', 'disabled');
  $('.data').text(status);
}
