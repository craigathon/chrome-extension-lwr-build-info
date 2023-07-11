<div align="center">
    <img src="https://github.com/craigathon/chrome-extension-lwr-build-info/raw/31784e19ee72ba70ce04c64530668d9bd922a573/logo/logo-128.png"/>
    <h1>Lightning Web Runtime Build Info</h1>
    <h3>Learn, Demo & Build Great LWR Sites.</h3> 
    <h3>Get information about components on the page of any live Salesforce Experience Cloud LWR site.</h3>
</div>

Easily understand what components make up a Salesforce Lightning Web Runtime live site!

When an LWR site is loaded, the extension popup can be opened. This UI will allow you to add and remove a clickable badge for each component placed by builder on the live site page. After navigating to a new page just click 'Show Build Information' within the extension popup again to add badges to new components on the page.

Clicking on a badge reveals additional information about the component. Theme and Section components display additional styling property information.

Give a try on a live LWR demo site: https://capricornhealth.sfdxp.com

## Installation
- **Fork** this repo, then **clone your forked repo locally**. If you don't have a github account, you can simply download a zip of the repo and unzip it on your computer.
- **Open [the extensions page](chrome://extensions)** in your browser: `chrome://extensions`. This link works on any chromium-based browser.
- If you did not do it already, **toggle the "developer mode"**. This is usually a toggle button at the top right of the extensions page.
- Click the button **_load unpacked extension_**.
- In the window that pops up, **select the folder that contains this extension**, then **click _ok_**.
- **Done!** A new extension called _Lightning Web Runtime Build Info_ should have appeared in the list.

## Q&A
> Do I have to publish my site to use this?

No, you can use this extension on the unpublished version of your site by using **Experience Builder Preview**.<br>
In Experience Builder, click the 'Preview' button and then use the 'Preview As' drop down within Experience Builder to use this extension on either the 'Authenticated User' or 'Guest User' view of your unpublished site.

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