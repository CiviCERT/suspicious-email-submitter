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
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }

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
      '_locales/**/*',
      'icon_*.png'
    ], unpacked, { parents: true });
    console.log('Files copied to', unpacked);

    const zipcmd = "pwd && zip -r " + filename + ".zip " + "*";
    console.log('Running', zipcmd);
    await exec(zipcmd, {cwd: unpacked}, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }

      // the *entire* stdout and stderr (buffered)
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }

    });

    console.log('done');
})();
