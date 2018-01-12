document.forms["form"].addEventListener('submit', function(event) {
  event.preventDefault();
  fetch('http://localhost:8000', {
    method : 'POST',
    body   : 'email',
  }).then(function(response) {
    console.log(response.status);
  }).catch(function(error) {
    console.log(error);
  });
});
