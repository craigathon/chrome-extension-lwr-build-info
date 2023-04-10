chrome.runtime.sendMessage({subject: "loaded"}, function(response) {});

let themeProperties = null;
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
            
            //this badge is positioned relative and hidden
            //it allocates the space the absolute positioned badge will need in front of it
            let divBadgeUnder = document.createElement("div");
            divBadgeUnder.innerHTML = 'spacer';
            divBadgeUnder.className = 'lwrbi-component-badge';
            divBadgeUnder.style = 'visibility:hidden;';
            component.prepend(divBadgeUnder);

            //this is the actual badge that is visible and the user will click on
            let divBadge = document.createElement("div");
            divBadge.className = 'lwrbi-component-badge';
            divBadge.style = 'position:absolute; z-index:100002;';
            divBadge.dataset.componenttype = componentType;
            divBadge.dataset.tagname = tagName;
            divBadge.dataset.id = componentId;
            divBadge.dataset.specialtype = specialType;
            divBadge.addEventListener("click", (e) => openComponentDetail(e), false);
            divBadge.innerHTML = '<a>' + componentName + '</a>';
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
        themeProperties = msg.themeProperties;
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

    let closeAnchor = document.createElement('a');
    closeAnchor.className = "lwrbi-field";
    closeAnchor.style = "float:right;";
    closeAnchor.addEventListener("click", (e) => detail.remove(), false);
    closeAnchor.innerHTML = 'close';
    detail.append(closeAnchor);

    appendOutputField(detail, 'Name', componentData.name);
    appendOutputField(detail, 'Description', componentData.description);
    appendOutputField(detail, 'Type', componentData.componenttype);
    appendOutputField(detail, 'TagName', componentData.tagname);
    appendOutputField(detail, 'Selector', '[data-component-id="' + componentData.id + '"]');
    
    let hasTable = false;
    let computedStyles = getComputedStyle(component);
    if (componentData.specialtype === 'template') {
        appendOutputField(detail, 'Theme', '');
        appendPropertyTable(detail, computedStyles, themeProperties);
        hasTable = true;
    }

    let colorPaletteClassName = 'Default';
    for (let classIndex in component.classList) {
        let className = component.classList[classIndex];
        if (typeof (className) != 'string') {
            break;
        }
        if (className.startsWith('dxpStyle_')) {
            appendOutputField(detail, 'Spacing', className);
            appendPropertyTable(detail, computedStyles, componentStyleProperties, component);
            hasTable = true;
        } else if (className.startsWith('dxpBrand_')) {
            colorPaletteClassName = className;
        }
    }
    if (componentData.tagname === 'community_layout-section') {
        appendOutputField(detail, 'Color Palette', colorPaletteClassName);
        appendPropertyTable(detail, computedStyles, colorPaletteProperties);
        hasTable = true;
    }
    if (hasTable) {
        detail.style = 'max-width: 800px;';
    }
    let displayCustomPropertiesAnchor = document.createElement('div');
    displayCustomPropertiesAnchor.className = "lwrbi-field";
    displayCustomPropertiesAnchor.addEventListener("click", (e) => displayAllCustomProperties(e, component), false);
    displayCustomPropertiesAnchor.innerHTML = '<a>Display All Custom Properties</a>';
    detail.append(displayCustomPropertiesAnchor);

    document.body.append(detail);
}

function appendOutputField(detail, title, value) {
    if (value === undefined) {
        return;
    }
    let field = document.createElement("div");
    field.className = "lwrbi-field";
    field.innerHTML = "<b>" + title + ": </b>" + value;
    detail.append(field);
}

function addColorChip(value) {
    if (value.startsWith('#') || value.startsWith('rgb(')) {
        let tempValue = value;
        value = tempValue + '<div class="lwrbi-color-chip" style="background-color:' + tempValue + ';"></div>';
    }
    return value;
}

function appendPropertyTable(detail, computedStyles, builderProperties) {
    let tableContainer = document.createElement("div");
    tableContainer.className = 'lwrbi-property-table';
    let table = document.createElement("table");
    let heading = document.createElement("tr");
    heading.innerHTML = '<th style="width:33%">Label</th><th style="width:33%">Property</th><th style="width:33%">Value</th>'
    table.append(heading);
    for (var sectionKey in builderProperties) { 
        let section = document.createElement("tr");
        section.innerHTML = '<td><b>' + sectionKey +  '</b></td><td>' + '</td><td>' + '</td>';
        table.append(section);
        for (var propertyKey in builderProperties[sectionKey]) { 
            let property = document.createElement("tr");
            let label = builderProperties[sectionKey][propertyKey];
            let value = computedStyles.getPropertyValue(propertyKey).trim();
            value = addColorChip(value);
            property.innerHTML = '<td>' + label +  '</td><td>' + propertyKey + '</td><td>' + value + '</td>';
            table.append(property);
        }
    }
    tableContainer.append(table);
    detail.append(tableContainer);
}

function appendAllPropertyTable(detail, computedStyles, cssCustomProperties, includeNotInContext) {
    let exiting = document.querySelector('.lwrbi-all-property-table');
    if (exiting != null) {
        exiting.remove();
    }
    
    let tableContainer = document.createElement("div");
    tableContainer.className = 'lwrbi-property-table lwrbi-all-property-table';
    let table = document.createElement("table");
    let heading = document.createElement("tr");
    heading.innerHTML = '<th style="width:10%">Index</th><th style="width:40%">Property</th><th style="width:25%">Declared As</th><th style="width:25%">In This Context</th>'
    table.append(heading);
    let index = 0;
    for (var propertyKey in cssCustomProperties) { 
        let declared = cssCustomProperties[propertyKey];
        let thisContext = computedStyles.getPropertyValue(propertyKey).trim();
        if (!includeNotInContext && thisContext === '') {
            continue;
        }
        let property = document.createElement("tr");
        let label = index++;
        declared = addColorChip(declared);
        thisContext = addColorChip(thisContext);
        property.innerHTML = '<td>' + label +  '</td><td>' + propertyKey + '</td><td>' + declared + '</td><td>' + thisContext + '</td>';
        table.append(property);
    }
    tableContainer.append(table);
    detail.append(tableContainer);
}

function displayAllCustomProperties(e, component) {
    let obj = e.currentTarget;
    let detail = obj.parentElement;
    obj.outerHTML = '<div class="lwrbi-field"><b>All Custom Properties<a/></div>';
    detail.style = 'max-width: 800px;';

    //add checkbox to turn on properties not in this context
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", (e) => {
        let checkbox = e.currentTarget;
        generateAllPropertyTable(detail, component, checkbox.checked);
    }, false);
    checkbox.id = "includeNotInContext";
    detail.append(checkbox);

    let label = document.createElement('label');
    label.for = checkbox.id;
    label.innerText = "Include Properties Not In This Context";
    label.style = "padding-left:5px;"
    detail.append(label);

    generateAllPropertyTable(detail, component, false);
}

function generateAllPropertyTable(detail, component, includeNotInContext) {
    let cssCustomPropArray = getCSSCustomPropIndex();
    cssCustomPropArray = cssCustomPropArray.sort(Comparator);
    //shift to a unique key structure
    let cssCustomProperties = {};
    for (let i=0; i < cssCustomPropArray.length; i++) {
        let propArray = cssCustomPropArray[i];
        if (cssCustomProperties.hasOwnProperty(propArray[0])) {
            continue;//keep first instance and do not overwrite
        }
        cssCustomProperties[propArray[0]] = propArray[1];
    }

    let computedStyles = getComputedStyle(component);
    appendAllPropertyTable(detail, computedStyles, cssCustomProperties, includeNotInContext);
}

function Comparator(a, b) {
    //alpha sort first position of array of arrays
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }


  //https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
const isSameDomain = (styleSheet) => {
    // Internal style blocks won't have an href value
    if (!styleSheet.href) {
        return true;
    }

    return styleSheet.href.indexOf(window.location.origin) === 0;
};
  
const isStyleRule = (rule) => rule.type === 1;
  
const getCSSCustomPropIndex = () =>
// styleSheets is array-like, so we convert it to an array.
// Filter out any stylesheets not on this domain
    [...document.styleSheets].filter(isSameDomain).reduce(
        (finalArr, sheet) =>
        finalArr.concat(
            // cssRules is array-like, so we convert it to an array
            [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
            const props = [...rule.style]
                .map((propName) => [
                propName.trim(),
                rule.style.getPropertyValue(propName).trim()
                ])
                // Discard any props that don't start with "--". Custom props are required to.
                .filter(([propName]) => propName.indexOf("--") === 0);

            return [...propValArr, ...props];
            }, [])
        ),
    []
);