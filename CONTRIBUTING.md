# Welcome, contributors!

Please feel free to dive in. Pull Requests are welcome.

## Getting Started

Clone the repo and install the extension in your browser:

In Chrome:
 * Open a new tab and go to `chrome://extensions`
 * Flip on the 'Developer mode' switch (top right)
 * Click 'Load unpacked'
 * Select the repository folder

In FF:
 * Open a new tab and go to `about:addons`
 * Click on 'Extensions'
 * Click the gear icon and choose 'Debug Add-ons'
 * On the next screen click 'Load temporary add-on'
 * Select `manifest.json` from repository folder

## Packaging

You can build/package a production extension for testing using npm:

`npm install and npm run build`

This will copy only the minimum necessary files to a clean `dist/` directory,
and compress them into a `dist/dist.zip` suitable for upload to Chrome Webstore
or FF Add-ons site.

## Adding a new email provider

To add a new email provider, you should modify `contentScript.js`.

Each provider is served by a dedicated function called getRawEmailProviderName.
Each of these functions should return a promise which either resovles to a
string result containing the raw email or rejects with a numeric error status
code. See `getRawEmailGmail()` `getRawEmailYahoo()` functions for examples.

Any changes to `contentScript.js` will not be picked up until they are added to
bundle.js, which is the concatenation of jquery with `contentScript.js`, you can
do this by running `npm run cat` as a one-off event, or `npm run watch` for
continuous updates.


## Translations, Internationalization, & Localization

See [the wiki
page](https://github.com/CiviCERT/suspicious-email-submitter/wiki/Localization).
