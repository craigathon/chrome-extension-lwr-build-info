<div align="center">
    <img src="https://github.com/craigathon/chrome-extension-lwr-build-info/raw/31784e19ee72ba70ce04c64530668d9bd922a573/logo/logo-128.png"/>
    <h1>Lightning Web Runtime Build Info</h1>
    <h3>Learn, Demo & Build Great LWR Sites.</h3> 
    <h3>Get information about components on the page of any live Salesforce Experience Cloud LWR site.</h3>
</div>

Easily understand how a Salesforce Lightning Web Runtime live site was built!

After the LWR site's page loads, open the extension to get started. The extension popup UI will allow you to add and remove a clickable badge for each Experience Builder component on the live site page.

Clicking on a badge displays the following information about the component:
- Display Name in Experience Builder
- Description of usage
- Component Type
- Tag Name
- Unique Selector for CSS
- Display Spacing (Margin and Padding) dxp styling hooks when set on the Experience Builder component.
- Display All Custom Properties as they are declared and their current value in context.
- Beyond everything above, Clicking on the Theme and Section component badges will display the dxp Styling Hook values with mapping to the standard Theme Panel Property names.

Try it on a live LWR demo site: https://capricornhealth.sfdxp.com

--Permissions Information--
When you add this extension, you will be prompted that it can “Read and change all your data on all websites”. This permission is needed because a Salesforce Experience Cloud site can exist on any Custom Domain. All data required to run this extension is self contained and there is no server communication or logging of any kind. This app will check if the web page contains the HTML tag webruntime-app for the purpose of detecting if it is an LWR site. If true, the page will only be read and changed once extension popup buttons have been clicked. This scope is to process and provide information about components on the page. All code is open source for review.

## Installation
Add directly from the Chrome Web Store: https://chrome.google.com/webstore/detail/lightning-web-runtime-lwr/hofogbdlpfgoknbfhjngegecnadnjikc

-OR-

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