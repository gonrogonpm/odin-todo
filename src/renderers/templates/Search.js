import * as Common from "./Common.js";
import * as SVG from "./SVG.js";

export function SearchBoard(search, settings = {}) {
    const frag = document.createDocumentFragment();
    const body = Common.Div({ class: "search" });

    if ("content" in settings) {
        Common.addContent(body, settings.content);
    }

    frag.append(body);
    return frag;
}

export function SearchTitle(search, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "search-title" });
    const header  = Common.H2();
    header.innerHTML = SVG.Search({ w: 40, h: 40 });
    header.append(`${search.title}`);

    wrapper.appendChild(header);
    frag.appendChild(wrapper);
    return frag;
}

export function SearchContent(search, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "search-list" });

    if ("content" in settings) {
        Common.addContent(wrapper, settings.content);
    }

    frag.appendChild(wrapper);
    return frag;
}

export function SearchContentEmpty(search, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "search-list-empty" });
    const div     = Common.Div({ class: "search-empty" });
    div.innerHTML = `No results &#128577`;

    wrapper.append(div);
    frag.append(wrapper);
    return frag;
}