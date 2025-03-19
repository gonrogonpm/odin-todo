import * as Common from "./Common.js";

export function Form(settings = {}) {
    const form = document.createElement("form");
    Common.SetCommonSettings(form, settings);

    if ("method" in settings) {
        form.method = settings.method;
    }

    if ("action" in settings) {
        form.action = settings.action;
    }

    return form;
}

export function Label(settings = {}) {
    const label = document.createElement("label");

    if ("text" in settings) {
        label.textContent = settings.text;
    }

    if ("for" in settings) {
        label.htmlFor = settings.for;
    }

    return label;
}

function LabelFromSettings(element, settings) {
    if ("label" in settings && (settings.label === "before" || settings.label === "after")) {
        const labelSettings = {
            text: settings.text ?? ""
        }

        if ("id" in settings) {
            labelSettings.for = settings.id;
        }

        switch (settings.label) {
            case "before": element.prepend(Label(labelSettings)); break;
            case "after":  element.append (Label(labelSettings)); break;
            default:
                console.warn("Invalid value for 'label' setting:", settings.label);
        }
    }
}

export function InputText(settings = {}) {
    settings.type = "text";
    return Input(settings);
}

export function InputCheckbox(settings = {}) {
    settings.type = "checkbox";
    return Input(settings);
}

export function Input(settings = {}) {
    const frag  = document.createDocumentFragment();
    const input = document.createElement("input");
    Common.SetCommonSettings(input, settings);
    SetCommonFormSettings(input, settings);

    if ("type" in settings) {
        input.type = settings.type;

        if (settings.type === "checkbox") {
            if (settings?.checked) {
                input.checked = true;
            }
        }
    }

    if ("placeholder" in settings) {
        input.placeholder = settings.placeholder;
    }

    if ("value" in settings) {
        input.value = settings.value;
    }

    frag.append(input);
    LabelFromSettings(frag, settings)
    
    return frag;
}

export function TextArea(settings = {}) {
    const frag = document.createDocumentFragment();
    const area = document.createElement("textarea");
    Common.SetCommonSettings(area, settings);
    SetCommonFormSettings(area, settings);

    if ("placeholder" in settings) {
        area.placeholder = settings.placeholder;
    }

    if ("value" in settings) {
        area.value = settings.value;
    }

    if ("rows" in settings) {
        area.rows = settings.rows;
    }

    if ("cols" in settings) {
        area.cols = settings.cols;
    }

    frag.append(area);
    LabelFromSettings(frag, settings);
    
    return frag;
}

export function Select(settings = {}) {
    const frag   = document.createDocumentFragment();
    const select = document.createElement("select");
    Common.SetCommonSettings(select, settings);
    SetCommonFormSettings(select, settings);

    if ("size" in settings) {
        select.size == settings.size;
    }

    if ("options" in settings) {
        const options = Array.isArray(settings.options) ? settings.options : [settings.options];

        options.forEach(option => {
            const elem = document.createElement("option");

            if (typeof option === "string") {
                elem.value       = option;
                elem.textContent = option;
            }
            else if (typeof option === "object") {
                if ("value" in option) {
                    elem.value       = option.value;
                    elem.textContent = option.value;
                }

                if ("text" in option) {
                    elem.textContent = option.text;
                }

                if ("selected" in option && option.selected) {
                    elem.selected = true;
                }

                if ("autoclass" in settings) {
                    if (settings["autoclass"] === "text") {
                        if ("text" in option) {
                            elem.classList.add(`option-${option.text}`);
                        }
                    }
                    else {
                        if ("value" in option) {
                            elem.classList.add(`option-${option.value}`);
                        }
                    }
                }
            }

            select.appendChild(elem);
        });
    }

    frag.append(select);
    LabelFromSettings(frag, settings);
    
    return frag;
}

export function SetCommonFormSettings(element, settings) {
    if ("name" in settings) {
        element.name = settings.name;
    }
    else {
        if ("id" in settings) {
            element.name = settings.id;
        }
    }

    if ("required" in settings) {
        element.required = Boolean(settings.required);
    }
}