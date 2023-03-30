window.addEventListener('DOMContentLoaded', () => {
    let componentTypesData = JSON.parse(document.getElementById('component-types-data').textContent);
    let componentsData = JSON.parse(document.getElementById('components-data').textContent);
    
    let show = document.querySelector('#showBuildInfo');
    show.addEventListener('click', function() {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                from: 'popup',
                subject: 'showBuildInfo',
                componentTypesData: componentTypesData,
                componentsData: componentsData
            });
        });
    });

    let hide = document.querySelector('#hideBuildInfo');
    hide.addEventListener('click', function() {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                from: 'popup',
                subject: 'hideBuildInfo',
            });
        });
    });
});