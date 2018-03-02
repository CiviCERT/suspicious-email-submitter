var SERVER_URL = localStorage.getItem('serverUrl');
var data = new URL(location).searchParams.get('data');
console.log(data);

$('#settings').click(function(event) {
  event.preventDefault();
  window.open('/options.html');
});

$('.data').text(data);

document.forms["form"].addEventListener('submit', function(event) {
  event.preventDefault();
  fetch(SERVER_URL, {
    method : 'POST',
    body   : data,
  }).then(function(response) {
    console.log(response.status);
  }).catch(function(error) {
    console.log(error);
  });
});
