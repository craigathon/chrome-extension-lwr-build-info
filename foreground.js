// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

chrome.runtime.sendMessage({subject: "loaded"}, function(response) {
    //console.log("Response: ", response);
});

let webruntimeApp = document.querySelector('webruntime-app');
let componentTypesData = null;
let componentsData = null;
let badgeStyle = 'cursor:pointer;border: 1px solid #d9d7d5;padding: 4px 7px;background-color: #ecebea;border-radius: 20px;font-size: 12px;';

function showBuilderNotation(contextSelector) {
    let context = document;
    if (contextSelector) {
        context = document.querySelector(contextSelector);
        if (context == null) {
            context = document;
        }
    }
    let components = context.querySelectorAll('[data-component-id]');
    components.forEach(function(component) {
        let componentId = component.dataset.componentId;
        if (!component.innerText.includes(componentId)) {
            let tagName = component.tagName.toLowerCase();
            let tagNameClean = tagName.replace('-design-substitute', '').replace('-design', '');
            let tagNamePrefix = tagName.substring(0, tagName.indexOf('-'));
            let componentType = componentTypesData[tagNamePrefix];
            if (componentType === undefined) {
                componentType = 'Custom Package';
            }
            let componentData = componentsData[tagNameClean];
            let componentName = tagName;
            if (componentData != null) {
                componentName = componentData.name;
            }
            let depth = getComponentDepth(component);
            componentName = depth + '. ' + componentName;
            
            let divBadgeUnder = document.createElement("div");
            divBadgeUnder.innerHTML = 'spacer';
            divBadgeUnder.className = 'component-badge';
            divBadgeUnder.style = 'visibility:hidden;' + badgeStyle;
            component.prepend(divBadgeUnder);

            let divBadge = document.createElement("div");
            divBadge.dataset.componenttype = componentType;
            divBadge.dataset.tagname = tagName;
            divBadge.dataset.id = componentId;
            divBadge.addEventListener("click", (e) => openComponentDetail(e), false);
            let badge = '<a style="color: #202124">' + componentName;
            if (componentData != null) {
                if (componentData.hasOwnProperty('description')) {
                    divBadge.innerHTML = badge + '</a>';
                } else {
                    divBadge.innerHTML = badge + '.</a>';
                }
            } else {
                divBadge.innerHTML = badge + '</a>';
            }

            divBadge.className = 'component-badge';
            divBadge.style = 'position:absolute; z-index:100002;' + badgeStyle;
            component.prepend(divBadge);
            //this is used in the query to determine if a badge already exists for the component
            let divComponentId = document.createElement("div");
            divComponentId.innerHTML = componentId;
            divComponentId.className = 'component-badge-id';
            divComponentId.style = 'font-size: 0px;';
            divBadge.prepend(divComponentId);
        }
    });
}
function getComponentDepth(component) {
    let currentElement = component;
    let depth = 0;
    while (currentElement.tagName !== 'WEBRUNTIME-APP') {
        currentElement = currentElement.parentElement;
        if (currentElement.dataset.hasOwnProperty('componentId')) {
            depth++;
        }
    }
    return depth;
}
function hideBuilderNotation() {
    let builderNotations = document.querySelectorAll('.component-badge');
    builderNotations.forEach(function(builderNotation) {
        builderNotation.remove();
    });
    let detail = document.querySelector(".component-detail");
    detail.remove();
}

chrome.runtime.onMessage.addListener((msg, sender) => {
    if ((msg.from === 'popup') && (msg.subject === 'showBuildInfo')) {
        console.log('show');
        componentTypesData = msg.componentTypesData;
        componentsData = msg.componentsData;
        showBuilderNotation();
    }

    if ((msg.from === 'popup') && (msg.subject === 'hideBuildInfo')) {
        hideBuilderNotation();
    }
});

function openComponentDetail(e) {
    let obj = e.currentTarget;
    let componentData = componentsData[obj.dataset.tagname];
    if (componentData == undefined) {
        componentData = {};
    }
    componentData['componenttype'] = obj.dataset.componenttype;
    componentData['tagname'] = obj.dataset.tagname;
    componentData['id'] = obj.dataset.id;
    console.log(componentData);

    let detail = document.querySelector(".component-detail");
    if (detail != null) {
        detail.remove();
    }
    detail = document.createElement("div");
    detail.style = "position: fixed;padding: 10px;bottom: 10px;right: 1px;border: 1px solid gray;border-radius: 3px;box-shadow: -4px 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;background-color: white;z-index: 100002;max-width: 400px;color:#414042;";
    detail.className = "component-detail"
    appendOutputField(detail, 'Name', componentData.name);
    appendOutputField(detail, 'Description', componentData.description);
    appendOutputField(detail, 'Type', componentData.componenttype);
    appendOutputField(detail, 'TagName', componentData.tagname);
    appendOutputField(detail, 'Selector', '[data-component-id="' + componentData.id + '"]');
    document.body.append(detail);
}

function appendOutputField(detail, title, value) {
    if (value === undefined) {
        return;
    }
    let field = document.createElement("div");
    field.style = "padding-bottom: 10px;overflow-wrap: normal;";
    field.innerHTML = "<b>" + title + ": </b>" + value;
    detail.append(field);
}