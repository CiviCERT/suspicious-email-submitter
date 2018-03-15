(function() {
  function configStorageKey(name) {
    if (typeof name === 'string' && name.length > 0) {
      return 'config-' + name;
    } else {
      throw new Error('Invalid configuration name');
    }
  }

  function validateValue(value) {
    if (typeof value === 'string' && value.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function validateConfig(configuration) {
    ['serverUrl', 'authToken', 'name'].forEach(function(key) {
      var value = configuration[key];

      if (!validateValue(value)) {
        // invalid
        throw new Error('Invalid configuration: ' + key + " can't be " + value);
      }
    });
  }

  function selectConfiguration(name) {
    validate(getConfiguration(name));
    localStorage.setItem('selectedConfig', name);
  }

  function getSelectedConfiguration() {
    var name = localStorage.getItem('selectedConfig');
    return getConfiguration(name);
  }

  function getConfiguration(name) {
    var string = localStorage.getItem(configStorageKey(name));
    var config;
    try {
      config = JSON.parse(string);
    } catch (e) {
      console.log(e);
    }

    validateConfig(config);
    return config;
  }

  function getConfigurationNames() {
    var list;
    try {
      list = JSON.parse(localStorage.getItem('savedConfigs'));
    } catch(e) {
    }
    if (list instanceof Array) {
      return list;
    } else {
      return [];
    }
  }

  function addConfigurationName(name) {
  }

  function saveConfiguration(configuration) {
    validateConfig(configuration);
    var string = JSON.stringify(configuration);


    // save the configuration
    localStorage.setItem(configStorageKey(configuration.name), string);

    // update the name list
    var configNames = getConfigurationNames();
    if (configNames.indexOf(configuration.name) < 0) {
      configNames.push(configuration.name);
      localStorage.setItem('savedConfigs', JSON.stringify(configNames));
    }

    // select this configuration
    localStorage.setItem('selectedConfig', configuration.name);
  }

  function removeConfiguration(name) {
    localStorage.removeItem(name);
  }

  window.SESConfig = {
    getSelectedConfiguration: getSelectedConfiguration,
    getConfigurationNames: getConfigurationNames,
    getConfiguration: getConfiguration,
    saveConfiguration: saveConfiguration,
    removeConfiguration: removeConfiguration,
  };
})();
