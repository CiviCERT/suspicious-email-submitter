function populateCurrent(config) {
  $('#current .name').text(config.name);
  $('#current .logo').attr('src', config.logo);
  $('#current').show();
}
function populateForm(config) {
  for (field in config) {
    $('#'+field).val(config[field]);
  }
}

function importConfig(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    reader.onload = function(event) {
        console.log(event.target.result);
        var config;
        try {
          config = JSON.parse(event.target.result);
        } catch (e) {
          reject(new Error('Invalid configuration file'));
        }

        resolve(config);
    }
    reader.onerror = reject;
    reader.readAsText(file)
  }).then(function(config) {
    populateForm(config);
    $('#form').submit();
  });
}

 // Stop default browser actions
$(window).bind('dragover dragleave', function(event) {
    event.stopPropagation()
    event.preventDefault()
})

// Catch drop event
$(window).bind('drop', function(event) {
    // Stop default browser actions
    event.stopPropagation()
    event.preventDefault()

    // Get all files that are dropped
    files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files

    importConfig(files[0]).catch(function(error) {
      alert(error.message);
    });
    return false;
})

$('#importFile').change(function(event) {
  importConfig(event.target.files[0]).then(function() {
    $('#importFile').val('');
  }).catch(function(error) {
    $('#importFile').val('');
    alert(error.message);
  });
});

function handleSubmit(event) {
  event.preventDefault();
  var config = {
    serverUrl: $('#serverUrl').val(),
    authToken: $('#authToken').val(),
    name: $('#name').val()
  };
  SESConfig.saveConfiguration(config);
  populateCurrent(config);
}
$('#form').submit(handleSubmit);
$('#export').click(function handleExport(event) {
  handleSubmit(event);

  var config = SESConfig.getSelectedConfiguration();
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", config.name + "-suspicious-email-submitter.json");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});
$('#chooseFile').click(function(event) {
  event.preventDefault();
  $('#importFile').click();
});

try {
  var config = SESConfig.getSelectedConfiguration();
  populateForm(config);
  populateCurrent(config);
} catch(e) {
  console.log(e);
  $('#current').hide();
  $('#editor').show();
  // not configured yet.
}
