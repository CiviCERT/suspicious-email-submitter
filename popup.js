var data = new URL(location).searchParams.get('data');
var status = new URL(location).searchParams.get('status');

$('#settings').click(function(event) {
  event.preventDefault();
  window.open('/options.html');
});

if (data) {
  $('.data').text(data);

  document.forms["form"].addEventListener('submit', function(event) {
    event.preventDefault();
    var serverUrl = localStorage.getItem('serverUrl');
    if (typeof serverUrl !== 'string' || serverUrl.length === 0) {
      // handle invalid server url
    } else {
      fetch(serverUrl, {
        method : 'POST',
        body   : data,
      }).then(function(response) {
        console.log(response.status);
      }).catch(function(error) {
        console.log(error);
      });
    }
  });
} else if (status) {
  $('.data').text(status);
}
