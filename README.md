<div align="center">
    <img src="https://github.com/craigathon/chrome-extension-lwr-build-info/raw/31784e19ee72ba70ce04c64530668d9bd922a573/logo/logo-128.png"/>
    <h1>Lighting Web Runtime Build Info</h1>
    <h3>Providing information about components on the page of your LWR site</h3>
</div>

This repository contains a prototype solution for rapidly understanding the build structure of a Salesforce LWR site.

When an LWR site is loaded, the extension popup can be opened. This UI will allow you to add and remove a clickable badge for each component placed by builder on the live site page.

Clicking on a badge reveals additional information about the component.

## Installation
- **Fork** this repo, then **clone your forked repo locally**. If you don't have a github account, you can simply download a zip of the repo and unzip it on your computer.
- **Open [the extensions page](chrome://extensions)** in your browser: `chrome://extensions`. This link works on any chromium-based browser.
- If you did not do it already, **toggle the "developer mode"**. This is usually a toggle button at the top right of the extensions page.
- Click the button **_load unpacked extension_**.
- In the window that pops up, **select the folder that contains this minimal extension**, then **click _ok_**.
- **Done!** A new extension called _Chrome Addon v3 Starter_ should have appeared in the list.

## Q&A
> Does this work only on Chrome or on **other web browsers** as well?

At the moment, this should work on every chromium-based web browser that supports v3 extensions.
Therefore, you should be able to install this extension on any of the following browsers (as long as they are up-to-date):
- _Free and open-source browsers_:
    - Chromium
    - Brave
- _Proprietary browsers_:
    - Chrome
    - Edge
    - Vivaldi
    - Opera