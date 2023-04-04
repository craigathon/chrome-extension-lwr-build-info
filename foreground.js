chrome.runtime.sendMessage({subject: "loaded"}, function(response) {});

let componentTypesData = null;
let componentsData = null;

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
            divBadgeUnder.className = 'lwrbi-component-badge';
            divBadgeUnder.style = 'visibility:hidden;';
            component.prepend(divBadgeUnder);

            let divBadge = document.createElement("div");
            divBadge.dataset.componenttype = componentType;
            divBadge.dataset.tagname = tagName;
            divBadge.dataset.id = componentId;
            divBadge.addEventListener("click", (e) => openComponentDetail(e), false);
            let badge = '<a>' + componentName;
            if (componentData != null) {
                if (componentData.hasOwnProperty('description')) {
                    divBadge.innerHTML = badge + '</a>';
                } else {
                    divBadge.innerHTML = badge + '.</a>';
                }
            } else {
                divBadge.innerHTML = badge + '</a>';
            }

            divBadge.className = 'lwrbi-component-badge';
            divBadge.style = 'position:absolute; z-index:100002;';
            component.prepend(divBadge);
            //this is used in the query to determine if a badge already exists for the component
            let divComponentId = document.createElement("div");
            divComponentId.innerHTML = componentId;
            divComponentId.className = 'lwrbi-component-badge-id';
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
    let builderNotations = document.querySelectorAll('.lwrbi-component-badge');
    builderNotations.forEach(function(builderNotation) {
        builderNotation.remove();
    });
    let detail = document.querySelector(".lwrbi-component-detail");
    detail.remove();
}

chrome.runtime.onMessage.addListener((msg, sender) => {
    if ((msg.from === 'popup') && (msg.subject === 'showBuildInfo')) {
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

    let detail = document.querySelector(".lwrbi-component-detail");
    if (detail != null) {
        detail.remove();
    }
    detail = document.createElement("div");
    detail.className = "lwrbi-component-detail"
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