var SERVER_URL = 'http://localhost:8000';
var data = new URL(location).searchParams.get('data');
console.log(data);

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
