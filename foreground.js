chrome.runtime.sendMessage({subject: "loaded"}, function(response) {});

let colorPaletteProperties = null;
let componentStyleProperties = null;
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
    let firstComponent = true;
    components.forEach(function(component) {
        let componentId = component.dataset.componentId;
        let specialType = '';
        if (firstComponent) {
            firstComponent = false;
            specialType = 'template';
        }
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
            divBadge.dataset.specialtype = specialType;
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
    firstComponent = true;
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
        colorPaletteProperties = msg.colorPaletteProperties;
        componentStyleProperties = msg.componentStyleProperties;
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
    let component = obj.parentElement;
    let componentData = componentsData[obj.dataset.tagname];
    if (componentData == undefined) {
        componentData = {};
    }
    componentData['componenttype'] = obj.dataset.componenttype;
    componentData['tagname'] = obj.dataset.tagname;
    componentData['id'] = obj.dataset.id;
    componentData['specialtype'] = obj.dataset.specialtype;

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
    
    let computedStyles = getComputedStyle(component);
    for (let classIndex in component.classList) {
        let className = component.classList[classIndex];
        if (typeof (className) != 'string') {
            break;
        }
        if (className.startsWith('dxpStyle_')) {
            appendOutputField(detail, 'Spacing', className);
            appendPropertyTable(detail, computedStyles, componentStyleProperties, component);
        } else if (className.startsWith('dxpBrand_')) {
            appendOutputField(detail, 'Color Palette', className);
            appendPropertyTable(detail, computedStyles, colorPaletteProperties);
        }
    }
   
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

function appendPropertyTable(detail, computedStyles, builderProperties) {
    let tableContainer = document.createElement("div");
    tableContainer.className = 'lwrbi-property-table';
    let table = document.createElement("table");
    let heading = document.createElement("tr");
    heading.innerHTML = '<th>Label</th><th>Property</th><th>Value</th>'
    table.append(heading);
    for (var sectionKey in builderProperties) { 
        let section = document.createElement("tr");
        section.innerHTML = '<td><b>' + sectionKey +  '</b></td><td>' + '</td><td>' + '</td>';
        table.append(section);
        for (var propertyKey in builderProperties[sectionKey]) { 
            let property = document.createElement("tr");
            let label = builderProperties[sectionKey][propertyKey];
            let value = computedStyles.getPropertyValue(propertyKey).trim();
            property.innerHTML = '<td>' + label +  '</td><td>' + propertyKey + '</td><td>' + value + '</td>';
            table.append(property);
        }
    }
    tableContainer.append(table);
    detail.append(tableContainer);
}