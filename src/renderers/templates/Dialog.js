import * as Common from "./Common.js";

export function QuestionDialog(settings = {}) {
    const frag   = document.createDocumentFragment();
    const dialog = document.createElement("dialog");
    const form   = DialogControls(settings);

    settings.class = [].concat(settings.class ?? [], "question-dialog");
    Common.SetCommonSettings(dialog, settings);

    if ("title" in settings) {
        const title = Common.H2({ text: settings.title });
        dialog.append(title);
    }

    if ("text" in settings) {
        const text = Common.P({ text: settings.text });
        dialog.append(text);
    }

    if ("open" in settings && settings.open) {
        dialog.open = true;
    }

    dialog.append(form);
    frag.append(dialog);
    return frag;
}

export function DeleteDialog(settings = {}) {
    const frag   = document.createDocumentFragment();
    const dialog = document.createElement("dialog");
    const form   = DialogControls(settings);

    settings.class = [].concat(settings.class ?? [], "delete-dialog");
    Common.SetCommonSettings(dialog, settings);

    if ("title" in settings) {
        const title = Common.H2({ text: settings.title });
        dialog.append(title);
    }
    
    if ("text" in settings) {
        const text = Common.P();
        text.append(
            "Are you sure you want to delete ",
            Common.Span({ text: settings.text }),
            "? ",
            Common.Em({ text: "This action cannot be undone." }),
        );
        dialog.append(text);
    }
    
    if ("open" in settings && settings.open) {
        dialog.open = true;
    }

    dialog.append(form);
    frag.append(dialog);
    return frag;
}

export function DialogControls(settings = {}) {
    const frag     = document.createDocumentFragment();
    const controls = Common.Div({ class: "controls" });
    const confirm  = Common.ConfirmButton();
    const cancel   = Common.CancelButton();

    controls.appendChild(confirm);
    controls.appendChild(cancel);
    frag.append(controls);
    return frag;
}