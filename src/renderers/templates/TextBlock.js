import * as Common from "./Common.js";
import * as Form from "./Form.js";
import * as Dialog from "./Dialog.js";

export function TextBlockBody(textBlock, settings = {}) {
    const frag = document.createDocumentFragment();
    const body = Common.Div({ class:  [].concat("text-block", settings.class ?? []) });
    const paragraphs = Common.parseTextContentToParagraphs(textBlock.text);

    body.append(...paragraphs);
    frag.append(body);
    return frag;
}

export function TextBlockForm(textBlock, settings = {}) {
    const frag     = document.createDocumentFragment();
    const wrapper  = Common.Div({ class: "text-block-edit-form" });
    const area     = Form.TextArea({ name: "text-block-text", value: textBlock.text, rows: settings?.rows ?? 4, required: true});
    const controls = Common.Div({ class: "text-block-controls" });
    const confirm  = Common.ConfirmButton({ mode: "full" });
    const cancel   = Common.CancelButton({ mode: "full" });
    const remove   = Common.DeleteButton({ mode: "full" });

    wrapper.appendChild(area);
    controls.appendChild(confirm);
    controls.appendChild(cancel);
    controls.appendChild(remove);
    wrapper.appendChild(controls);
    frag.append(wrapper);

    return frag;
}

export function TextBlockDeleteDialog(settings = {}) {
    if (!("id" in settings)) {
        settings.id = "text-block-delete-dialog";
    }

    if (!("title" in settings)) {
        settings.title = "confirm text block deletion";
    }

    settings.text = "text block";

    return Dialog.DeleteDialog(settings);
}