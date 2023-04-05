window.addEventListener('DOMContentLoaded', () => {
    let themeProperties = JSON.parse(document.getElementById('theme-properties').textContent);
    let colorPaletteProperties = JSON.parse(document.getElementById('color-palette-properties').textContent);
    let componentStyleProperties = JSON.parse(document.getElementById('component-style-properties').textContent);
    let componentTypesData = JSON.parse(document.getElementById('component-types-data').textContent);
    let componentsData = JSON.parse(document.getElementById('components-data').textContent);
    let message = document.querySelector('.message');
    let show = document.querySelector('#showBuildInfo');
    show.addEventListener('click', function() {
        message.innerHTML = '';
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
        
            chrome.tabs.sendMessage(activeTab.id, {
                from: 'popup',
                subject: 'showBuildInfo',
                themeProperties: themeProperties,
                colorPaletteProperties: colorPaletteProperties,
                componentStyleProperties: componentStyleProperties,
                componentTypesData: componentTypesData,
                componentsData: componentsData
            }).catch(error => message.innerHTML = 'Please reload the page');
        });
    });

    let hide = document.querySelector('#hideBuildInfo');
    hide.addEventListener('click', function() {
        message.innerHTML = '';
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                from: 'popup',
                subject: 'hideBuildInfo',
            }).catch(error => message.innerHTML = 'Please reload the page');
        });
    });
});