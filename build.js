const cpy = require('cpy');
const { exec } = require('child_process');
const VERSION = require('./manifest.json').version;

(async () => {
    const catcmd = 'cat jquery-3.3.1.min.js contentScript.js > bundle.js';
    console.log("Concatenating content scripts");
    await new Promise(function(resolve, reject) {
      exec(catcmd, (err, stdout, stderr) => {

        // the *entire* stdout and stderr (buffered)
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.log(stderr);
        }

        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("Concatenating done");
          resolve();
        }
      });
    });
    const filename = 'ses-' + VERSION;
    const unpacked = filename + '-unpacked'
    console.log("Copying files to", unpacked);
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
      '_locales/**/*',
      'icon_*.png'
    ], unpacked, { parents: true });
    console.log('Files copied to', unpacked);

    const zipcmd = "pwd && zip -r " + filename + ".zip " + "*";
    console.log('Running', zipcmd);
    await new Promise(function(resolve, reject) {
      exec(zipcmd, {cwd: unpacked}, (err, stdout, stderr) => {
        // the *entire* stdout and stderr (buffered)
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.log(stderr);
        }

        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log('Zip file created:', unpacked + '/' + filename + '.zip');
          resolve();
        }
      });
    });

})();
