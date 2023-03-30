chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.subject == "loaded") {
        // Page actions are disabled by default and enabled on select tabs
        chrome.action.disable();
        //new chrome.declarativeContent.ShowAction();

        // Clear all rules to ensure only our expected rules are set
        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
            // Declare a rule to enable the action on example.com pages
            let exampleRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    css: ["webruntime-app"],
                })/*,
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: 'commeditor.jsp' }
                })*/
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
            };

            // Finally, apply our new array of rules
            let rules = [exampleRule];
            chrome.declarativeContent.onPageChanged.addRules(rules);
        });
    }
});
/*
chrome.runtime.onInstalled.addListener(() => {
    // Page actions are disabled by default and enabled on select tabs
    chrome.action.disable();
    //new chrome.declarativeContent.ShowAction();

    // Clear all rules to ensure only our expected rules are set
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // Declare a rule to enable the action on example.com pages
        let exampleRule = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                css: ["webruntime-app"],
            })
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
        };

        // Finally, apply our new array of rules
        let rules = [exampleRule];
        chrome.declarativeContent.onPageChanged.addRules(rules);
    });
});*/