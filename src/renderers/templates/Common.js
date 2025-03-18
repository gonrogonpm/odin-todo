import * as SVG from "./SVG.js";

export function H1(settings = {}) { settings.level = 1; return Header(settings); }
export function H2(settings = {}) { settings.level = 2; return Header(settings); }
export function H3(settings = {}) { settings.level = 3; return Header(settings); }
export function H4(settings = {}) { settings.level = 4; return Header(settings); }
export function H5(settings = {}) { settings.level = 5; return Header(settings); }
export function H6(settings = {}) { settings.level = 6; return Header(settings); }

export function Header(settings = {}) {
    settings.level = settings.level ?? 3;
    const header = document.createElement(`h${settings.level}`);
    SetCommonSettings(header, settings);

    if ("text" in settings) {
        header.textContent = settings.text;
    }

    return header;
}

export function P(settings = {}) {
    const p = document.createElement("p");
    SetCommonSettings(p, settings);

    if ("text" in settings) {
        p.textContent = settings.text;
    }

    return p;
}

export function Span(settings = {}) {
    const span = document.createElement("span");
    SetCommonSettings(span, settings);

    if ("text" in settings) {
        span.textContent = settings.text;
    }

    return span;
}

export function Em(settings = {}) {
    const span = document.createElement("em");
    SetCommonSettings(span, settings);

    if ("text" in settings) {
        span.textContent = settings.text;
    }

    return span;
}

export function Nav(settings = {}) {
    const nav = document.createElement("nav");
    SetCommonSettings(nav, settings);

    return nav;
}

export function Article(settings = {}) {
    const article = document.createElement("article");
    SetCommonSettings(article, settings);

    return article;
}

export function Section(settings = {}) {
    const section = document.createElement("section");
    SetCommonSettings(section, settings);

    return section;
}

export function Div(settings = {}) {
    const div = document.createElement("div");
    SetCommonSettings(div, settings);

    if ("text" in settings) {
        div.textContent = settings.text;
    }

    return div;
}

/**
 * Creates an unordered list (ul) element.
 *
 * @param {object} [settings={}] - The settings object.
 * @param {function|function[]} [settings.content] - A function or an array of functions that, when called, *return*
 *   the content to be added to each list item.
 *   Each function receives the `li` element as an argument.
 * @returns {HTMLUListElement} The created unordered list element.
 */
export function UnorderedList(settings = {}) {
    const list = document.createElement("ul");
    SetCommonSettings(list, settings);

    if ("content" in settings) {
        addContent(list, settings.content, () => document.createElement("li"));
    }

    return list;
}

export function AddButton(settings = {}) {
    settings.text  = settings.text ?? "add";
    settings.class = [].concat(settings.class ?? [], "button-add");
    SetButtonMode(settings, SVG.Add);

    return Button(settings);
}

export function ConfirmButton(settings = {}) {
    settings.text  = settings.text ?? "confirm";
    settings.class = [].concat(settings.class ?? [], "button-confirm");
    SetButtonMode(settings, SVG.Confirm);

    return Button(settings);
}

export function CancelButton(settings = {}) {
    settings.text  = settings.text ?? "cancel";
    settings.class = [].concat(settings.class ?? [], "button-cancel");
    SetButtonMode(settings, SVG.Cancel);
    
    return Button(settings);
}

export function DeleteButton(settings = {}) {
    settings.text  = settings.text ?? "delete";
    settings.class = [].concat(settings.class ?? [], "delete", "link", "button-delete");
    SetButtonMode(settings, SVG.Delete);
    
    return Button(settings);
}

export function ListButton(settings = {}) {
    settings.class = [].concat(settings.class ?? [], "button-list");
    SetButtonMode(settings, SVG.List);

    return Button(settings);
}

export function GridButton(settings = {}) {
    settings.class = [].concat(settings.class ?? [], "button-grid");
    SetButtonMode(settings, SVG.Grid);

    return Button(settings);
}

function SetButtonMode(settings, iconFunc) {
    settings.mode = settings.mode ?? "full";

    if (settings?.mode === "text") {
        delete settings.svg;
    }

    if (settings?.mode === "icon") {
        delete settings.text;
        settings.svg = iconFunc();
    }

    if (settings?.mode === "full") {
        settings.svg = iconFunc();
    }
}

export function Button(settings = {}) {
    const button = document.createElement("button");
    SetCommonSettings(button, settings);

    if ("type" in settings) {
        button.type = settings.type;
    }

    if ("svg" in settings) {
        if (typeof settings.svg === "function") {
            button.innerHTML = settings.svg();
        }
        else {
            button.innerHTML = settings.svg;
        }
    }

    if ("text" in settings) {
        button.append(settings.text);
    }

    return button;
}

export function SetCommonSettings(element, settings) {
    if ("id" in settings) {
        element.id = settings.id;
    }

    if ("class" in settings) {
        if (Array.isArray(settings.class)) {
            settings.class.forEach(name => {
                addClassToList(element, name);
            });
        } 
        else {
            addClassToList(element, settings.class);
        }
    }

    if ("data" in settings) {
        Object.keys(settings.data).forEach(key => {
            element.dataset[key] = settings.data[key];
        });
    }
}

export function parseTextContentToParagraphs(text) {
    let elems = [];

    text.split("\n").forEach(part => {
        const p = document.createElement("p");
        p.textContent = part;
        elems.push(p);
    });

    return elems;
}

/**
 * Adds content to a given element. The content can be generated by a single function or an array of functions.
 * Optionally, a wrapper function can be provided to wrap the result of each content function.
 *
 * @param {HTMLElement} element The element to which content will be added.
 * @param {Function|Function[]} content A function or an array of functions that generate the content to be added.
 *   Each function receives the target element (or a wrapper, if `funcWrapper` is provided) as an argument and should
 *   return a DOM node or a DocumentFragment.
 * @param {Function} [funcWrapper=null] An optional function that creates a wrapper element.
 *   If provided, this function will be called *without* arguments, and it should return a DOM element that will be
 *   used as a wrapper for the content generated by the content function(s).
 *
 * @example
 * // Add a single paragraph to a div:
 * const myDiv = Common.Div();
 * addContent(myDiv, () => Common.P({ text: "Hello!" }));
 *
 * @example
 * // Add multiple paragraphs to a div:
 * const myDiv = Common.Div();
 * addContent(myDiv, [
 *   () => Common.P({ text: "Paragraph 1" }),
 *   () => Common.P({ text: "Paragraph 2" }),
 * ]);
 *
 * @example
 * // Add content wrapped in a span with a class:
 * const myDiv = Common.Div();
 * addContent(myDiv, () => Common.Span({ text: "Important!" }), () => Common.Span({ class: "highlight" }));
 * // Result: <div><span class="highlight"><span>Important!</span></span></div>
 *
 * @example
 * // Used within UnorderedList (creates list items):
 * const myList = Common.UnorderedList({
 *   content: [
 *      () => Common.Span({ text: "Item 1" }),
 *      () => Common.Span({ text: "Item 2" }),
 *    ]
 * });
 */
export function addContent(element, content, funcWrapper = null) {
    if (Array.isArray(content)) {
        content.forEach(func => {
            addContentFromFunc(element, func, funcWrapper);
        });
    }
    else {
        addContentFromFunc(element, content, funcWrapper);
    }
}

/**
 * Adds content to a given element, generated by a single function. Optionally, a wrapper function can be
 * provided to wrap the result of the content function.
 *
 * @param {HTMLElement} element The element to which content will be added.
 * @param {Function} func A function that generates the content to be added.
 *   This function receives `element` (or the wrapper element if `funcWrapper` is used) as argument, and it *should*
 *   return a DOM Node.
 * @param {Function} [funcWrapper=null] An optional function that creates a wrapper element.
 *   If provided, this function will be called *without* arguments, and it should return a DOM element that will be
 *   used as a wrapper for the content generated by the content function (`func`).
 *
 * @private
 */
function addContentFromFunc(element, func, funcWrapper = null) {
    if (funcWrapper != null) {
        const wrapper = funcWrapper();
        const result  = func(wrapper);
        wrapper.append(result);
        element.append(wrapper);
    }
    else {
        const result  = func(element);
        element.append(result);
    }
}

function addClassToList(element, name) {
    if (typeof name !== "string" || name.trim() === "") {
        return;
    }

    element.classList.add(name);
}

