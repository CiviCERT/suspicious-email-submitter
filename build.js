const cpy = require('cpy');
const { exec } = require('child_process');
const VERSION = require('./manifest.json').version;

(async () => {
    const unpacked = 'dist';
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

})();
