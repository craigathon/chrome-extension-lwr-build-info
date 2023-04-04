chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.subject == "loaded") {
        // Page actions are disabled by default and enabled on select tabs
        chrome.action.disable();

        // Clear all rules to ensure only our expected rules are set
        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
            let exampleRule = {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        css: ["webruntime-app"],
                    })
                ],
                actions: [new chrome.declarativeContent.ShowAction()]
            };

            let rules = [exampleRule];
            chrome.declarativeContent.onPageChanged.addRules(rules);
        });
    }
});