export function Add(settings = { title: "add" }) {
    const [title, w, h] = getBasicSettings(settings);

    return ` 
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
</svg>`;
}

export function Details(settings = { title: "details" }) {
    const [title, w, h] = getBasicSettings(settings);

    return ` 
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M12 4.5C7 4.5 2.7 7.6 1 12C2.7 16.4 7 19.5 12 19.5H13.1C13 19.2 13 18.9 13 18.5C13 18.1 13 17.8 13.1 17.4C12.7 17.4 12.4 17.5 12 17.5C8.2 17.5 4.8 15.4 3.2 12C4.8 8.6 8.2 6.5 12 6.5S19.2 8.6 20.8 12C20.7 12.2 20.5 12.4 20.4 12.7C21.1 12.9 21.7 13.1 22.3 13.5C22.6 13 22.8 12.5 23 12C21.3 7.6 17 4.5 12 4.5M12 9C10.3 9 9 10.3 9 12S10.3 15 12 15 15 13.7 15 12 13.7 9 12 9M19 21V19H15V17H19V15L22 18L19 21" />
</svg>`;
}

export function Confirm(settings = { title: "confirm" }) {
    return Check(settings);
}

export function Cancel(settings = { title: "cancel" }) {
    return Close(settings);
}

export function Check(settings = { title: "check"}) {
    const [title, w, h] = getBasicSettings(settings);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
</svg>`;
}

export function Close(settings = { title: "close"}) {
    const [title, w, h] = getBasicSettings(settings);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
</svg>`;
}

export function Checkbox(settings = { title: "checkbox"}) {
    const [title, w, h] = getBasicSettings(settings);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
</svg>`
}

export function CheckboxMarked(settings = { title: "checkbox marked" }) {
    const [title, w, h] = getBasicSettings(settings);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
</svg>`;
}

export function Information(settings = { title: "information" }) {
    const [title, w, h] = getBasicSettings(settings);
    
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
</svg>`;
}

export function List(settings = { title: "list" }) {
    const [title, w, h] = getBasicSettings(settings);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M 3,3 V 6.0546875 H 21 V 3 Z M 3,7.9824219 V 11.035156 H 21 V 7.9824219 Z m 0,4.9824221 v 3.052734 h 18 v -3.052734 z m 0,4.980468 V 21 h 18 v -3.054688 z" />
</svg>`;
}

export function Grid(settings = { title: "grid" }) {
    const [title, w, h] = getBasicSettings(settings);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3" />
</svg>`;
}

export function Delete(settings = { title: "grid" }) {
    const [title, w, h] = getBasicSettings(settings);
    
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w}" height="${h}">
    <title>${title}</title>
    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
</svg>`;
}

function getBasicSettings(settings) {
    let result = ["title", 24, 24];

    if (settings == null) {
        return result;
    }

    if ("title" in settings) { result[0] = settings.title; }
    if ("w"     in settings) { result[1] = settings.w; }
    if ("h"     in settings) { result[2] = settings.h; }

    return result;
}