const cpy = require('cpy');
const { exec } = require('child_process');
const VERSION = require('./manifest.json').version;

(async () => {
    const catcmd = 'cat jquery-3.3.1.min.js contentScript.js > bundle.js';
    await exec(catcmd, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

    });
    const filename = 'ses-' + VERSION;
    const unpacked = filename + '-unpacked'
    await cpy([
      'LICENSE',
      'background.html',
      'background.js',
      'bundle.js',
      'config.js',
      'i18n.js',
      'jquery-3.3.1.min.js',
      'manifest.json',
      'misp.js',
      'options.html',
      'options.js',
      'popup.html',
      'popup.js',
      'style.css',
      '_locales/**/*'
    ], unpacked, { parents: true });
    console.log('Files copied to', unpacked);

    const zipcmd = "zip -r " + filename + ".zip " + unpacked + "/*";
    console.log('Running', zipcmd);
    await exec(zipcmd, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

    });
})();
