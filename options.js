var serverUrl = localStorage.getItem('serverUrl');
$('#serverUrl').val(serverUrl);

$('#form').submit(function(event) {
  event.preventDefault();
  var serverUrl = $('#serverUrl').val();
  if (typeof serverUrl === 'string' && serverUrl.length > 0) {
    localStorage.setItem('serverUrl', serverUrl);
  }
});
