import * as Common from "./Common.js";
import * as Form from "./Form.js";
import * as Dialog from "./Dialog.js";

export function ChecklistBody(checklist, settings = {}) {
    const frag = document.createDocumentFragment();
    const body = Common.Div({ 
        id:    `checklist-${checklist.id}`,
        class: [].concat("checklist", settings.class ?? []) 
    });

    const generators = [];
    for (let i = 0; i < checklist.count; i++) {
        generators.push(() => ChecklistItem(checklist.get(i), settings));
    }

    const list = Common.UnorderedList({ content: generators });

    const controls = Common.Div({ class: "checklist-controls" });
    const confirm  = Common.AddButton({ text: "Add item", class: "link" });
    const remove   = Common.DeleteButton({ mode: "full" });

    controls.append(confirm);
    controls.append(remove);
    body.append(list);
    body.append(controls);
    frag.append(body);
    return frag;
}

export function ChecklistItem(item, settings = {}) {
    const frag = document.createDocumentFragment();
    const wrapperItem  = Common.Div({ class: "checklist-item", data: { id: item.id } });
    const wrapperInput = Common.Div({ class: "checklist-input" });
    // Add the checkbox if the item is not editable.
    if (!(settings?.editform ?? false)) {
        const input = Form.InputCheckbox({ checked: item.checked, label: "after", text: item.text});
        wrapperInput.append(input);
    }
    wrapperItem.append(wrapperInput);
    // Add the item text is the item is not editable; otherwise, add the edit form.
    if (!(settings?.editform ?? false)) { 
        const wrapperText  = ChecklistItemText(item, settings);
        wrapperItem.append(wrapperText);        
    }
    else {
        const form = ChecklistItemForm(item, settings);
        wrapperItem.append(form);
    }
    // Add the item to a list item if the item is marked as a list item; otherwise, return directly the
    // input and the item.
    if (settings?.listitem ?? false) {
        const li = Common.ListItem();
        li.append(wrapperItem);
        frag.append(li);
    }
    else {
        frag.append(wrapperItem);
    }
    
    return frag;
}

export function ChecklistItemText(item, settings = {}) {
    const wrapperText = Common.Div({ class: "checklist-text" });
    wrapperText .append(...Common.parseTextContentToParagraphs(item.text));
    return wrapperText;
}

export function ChecklistItemForm(item, settings = {}) {
    const frag     = document.createDocumentFragment();
    const wrapper  = Common.Div({ class: "checklist-item-edit-form" });
    const area     = Form.Input({ type: "text", name: "checklist-item-text", value: item.text, required: true});
    const controls = Common.Div({ class: "checklist-item-controls" });
    const confirm  = Common.ConfirmButton({ mode: "full" });
    const cancel   = Common.CancelButton({ mode: "full" });
    
    wrapper.appendChild(area);
    controls.appendChild(confirm);
    controls.appendChild(cancel);

    if (!(settings.noremove ?? false)) {
        controls.appendChild(Common.DeleteButton({ mode: "full" }));    
    }

    wrapper.appendChild(controls);
    frag.append(wrapper);

    return frag;
}

export function ChecklistItemDeleteDialog(settings = {}) {
    if (!("id" in settings)) {
        settings.id = "checklist-item-delete-dialog";
    }

    if (!("title" in settings)) {
        settings.title = "confirm check list item deletion";
    }

    settings.text = "check list item";

    return Dialog.DeleteDialog(settings);
}

export function ChecklistDeleteDialog(settings = {}) {
    if (!("id" in settings)) {
        settings.id = "checklist-delete-dialog";
    }

    if (!("title" in settings)) {
        settings.title = "confirm check list deletion";
    }

    settings.text = "check list";

    return Dialog.DeleteDialog(settings);
}