var serverUrl = localStorage.getItem('serverUrl');
$('#serverUrl').val(serverUrl);
var authToken = localStorage.getItem('authToken');
$('#authToken').val(authToken);

$('#form').submit(function(event) {
  event.preventDefault();
  var serverUrl = $('#serverUrl').val();
  if (typeof serverUrl === 'string' && serverUrl.length > 0) {
    localStorage.setItem('serverUrl', serverUrl);
  }
  var authToken = $('#authToken').val();
  if (typeof authToken === 'string' && authToken.length > 0) {
    localStorage.setItem('authToken', authToken);
  }
});
