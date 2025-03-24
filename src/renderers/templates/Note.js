import * as Common from "./Common.js";
import * as Form from "./Form.js";
import * as SVG from "./SVG.js";
import { Priority, getPriorityName } from "../../Priority.js";
import { countLines } from "../../Utils.js";
import { format } from "date-fns";

export function NoteBody(note, settings = {}) {
    const frag = document.createDocumentFragment();
    const body = Common.Article({ class:  [].concat("note", settings.class ?? [], note.isDone ? "note-done" : "") });

    const addContentFromFunc = function (func) {
        const result = func(body);
        if (result != null) {
            body.append(result);
        }
    }

    if ("content" in settings) {
        if (Array.isArray(settings.content)) {
            settings.content.forEach(func => {
                addContentFromFunc(func);
            });
        }
        else {
            addContentFromFunc(settings.content);
        }
    }

    frag.append(body);
    return frag;
}

export function NoteHeader(note, settings = {}) {
    const showDetails = settings.details ?? false;

    const frag    = document.createDocumentFragment();
    const header  = Common.Section({ class: "note-header" });
    const buttons = Common.Div({ class: "note-buttons" });
    const title   = NoteTitle(note, settings);
    const done    = NoteDoneButton(note, settings);
    // Compose the title.
    buttons.appendChild(done);
    header.appendChild(buttons);
    header.appendChild(title);

    if (showDetails) {
        const wrapper = Common.Div({ class: "note-delete" });
        const remove  = Common.Button({
            class: ["delete", "link", "note-delete-button"],
            text:  "delete",
            svg:   SVG.Delete,
            data:  { project: note.projectId, id: note.id }
        });
        
        wrapper.appendChild(remove);
        header.appendChild(wrapper);
    }
    

    frag.append(header);

    return frag;
}

/**
 * Creates a button element representing the "done" state of a note.
 *
 * This button displays a checkbox icon (checked or unchecked) to visually represent the `isDone` state of the
 * associated `Note` object.
 *
 * **Important:** While the button visually represents the "done" state, clicking it *does not* directly modify
 * the `Note` object's `isDone` property. Instead, the button is intended to be used in conjunction with a 
 * Controller (in an MVC architecture) that handles the click event and updates the `Note` object's state
 * accordingly.  The Controller can then call `updateDoneIcon` on this button to update its visual state to
 * match the updated model.
 *
 * @param {Note} note The `Note` object this button represents.
 * @param {object} [settings={}] An optional settings object.
 * @returns {DocumentFragment} A document fragment containing the button element.
 */
export function NoteDoneButton(note, settings = {}) {
    const frag = document.createDocumentFragment();
    const done = Common.Button({
        class: ["button-done", "link"],
        svg:   note.isDone ? SVG.CheckboxMarked : SVG.Checkbox,
        data:  { project: note.projectId, id: note.id } 
    });

    done.updateDoneIcon = (function(value) { 
        this.innerHTML = value ? SVG.CheckboxMarked() : SVG.Checkbox();
    }).bind(done);

    frag.append(done);
    return frag;
}

export function NoteTitle(note, settings = {}) {
    const mode = settings.mode ?? "card";
    const showDetails = settings.details ?? false;

    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "note-title-wrapper" });
    const title   = Common.H3({ class: "note-title", text: note.title });
    wrapper.append(title);

    if (mode === "item") {
        if (note.hasChecklists()) {
            const { total, completed } = note.getChecklistsCompletion();
            const spanText = Common.Span({ class: "note-title-progress", text:  `${completed}/${total}` });
            const spanIcon = Common.Span();
            spanIcon.innerHTML = SVG.CheckboxMarked({ w: 14, h: 14 });
            wrapper.append(spanText);
            wrapper.append(spanIcon);
        }
    }
    
    frag.append(wrapper);
    return frag; 
}

export function NoteTitleForm(note, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "note-title-edit-form"});
    const input   = Form.InputText({ id: "note-title", value: note.title, required: true});
    const confirm = Common.ConfirmButton();
    const cancel  = Common.CancelButton();

    wrapper.appendChild(input);
    wrapper.appendChild(confirm);
    wrapper.appendChild(cancel);
    frag.append(wrapper);

    return frag;
}

export function NoteDescription(note, settings = {}) {
    const showDetails     = settings.details ?? false;
    const showDescription = note.description != "";

    const frag = document.createDocumentFragment();
    const desc = Common.Section({ class: "note-description" });

    if (showDescription) {
        const text = Common.Div({ class: "note-description-text" });
        text.append(...Common.parseTextContentToParagraphs(note.description));
        desc.appendChild(text);
    } 
    // If there is no description but the note is in details mode, a box is added. When clicked, this box is
    // replaced with a form to add a description.
    else if (showDetails) {
        const text = Common.Div({ class: ["note-description-text", "note-empty-desc"],
            text: "Add a detailed description…"
        });
        desc.appendChild(text);
    }
    // If the note is not in details mode, show buttons to see the details/edit the note.
    if (!showDetails) {
        if (note.hasChecklists()) {
            const progress = NoteProgressBar(note.getChecklistsCompletion());
            desc.append(progress);
        }

        const more = Common.Div({ class: "see-more" });
        const button = Common.Button({
            class: ["button-details", "link"],
            text:  "details/edit",
            svg:   SVG.Details,
            data:  { project: note.projectId, id: note.id } 
        });
        more.appendChild(button);
        desc.appendChild(more);
    }
    
    frag.appendChild(desc);
    return frag;
}

export function NoteDescriptionForm(note, settings = {}) {
    const rows     = Math.min(8, Math.max(4, countLines(note.description)));
    const frag     = document.createDocumentFragment();
    const wrapper  = Common.Div({ class: "note-desc-edit-form" });
    const area     = Form.TextArea({ id: "note-desc", value: note.description, rows: settings?.rows ?? rows, required: true});
    const controls = Common.Div({ class: "note-desc-controls" });
    const confirm  = Common.ConfirmButton({ mode: "full" });
    const cancel   = Common.CancelButton({ mode: "full" });

    wrapper.appendChild(area);
    controls.appendChild(confirm);
    controls.appendChild(cancel);
    wrapper.appendChild(controls);
    frag.append(wrapper);

    return frag;
}

export function NoteContent(note, settings = {}) {
    const showDetails = settings.details ?? false;

    const frag    = document.createDocumentFragment();
    const content = Common.Section({ class: ["note-content"] });

    Common.addContent(content, settings.content);
    frag.append(content);

    if (showDetails) {
        const controls = Common.Div({ class: "note-controls" });
        const confirm  = Common.AddButton({ class: "button-add-text", text: "Add text" });
        const cancel   = Common.AddButton({ class: "button-add-checklist", text: "Add checklist" });
    
        controls.appendChild(confirm);
        controls.appendChild(cancel);
        frag.append(controls);
        return frag;
    }

    return frag;
}

export function NoteMetadata(note, settings = {}) {
    const showDetails = settings.details ?? false;
    const showDueDate = note.dueDate != null;

    const frag  = document.createDocumentFragment();
    const meta  = Common.Section({ class: "note-meta" });

    const priority = NotePriority(note, settings);
    const dueDate  = NoteDueDate(note, settings);

    if (priority != null) { meta.append(priority); }
    if (dueDate  != null) { meta.append(dueDate); }
    frag.append(meta);

    return frag;
}

export function NotePriority(note, settings = {}) {
    const frag     = document.createDocumentFragment();
    const priority = Common.Div({ class: "note-priority" });
    const span     = Common.Span({ 
        class: ["priority", `priority-${getPriorityName(note.priority)}`], 
        text:  getPriorityName(note.priority) 
    });

    priority.appendChild(span);
    frag.appendChild(priority);
    return frag;
}

export function NoteDueDate(note, settings = {}) {
    const showDetails = settings.details ?? false;
    const showDueDate = note.dueDate != null;

    const frag    = document.createDocumentFragment();
    const compact = settings.format ?? "" === "compact"

    if (showDueDate) {
        const dueDate = Common.Div({ 
            class: "note-due-date", 
            text:  (note.dueDate === null ? "none" :  format(note.dueDate, compact ? "🕑 P - p" : "🕑 PP - p")) 
        });
        frag.appendChild(dueDate);
    }
    // If there is no due date but the note is in details mode, a box is added. When clicked, this box is
    // replaced with a form to set a due date.
    else if (showDetails) {
        const dueDate = Common.Div({
            class: ["note-due-date", "note-empty-field"],
            text:  "Set a due date…"
        });
        frag.appendChild(dueDate);
    }

    if (!frag.hasChildNodes()) {
        return null;
    }

    return frag;
}

export function NotePriorityForm(note, settings = {}) {
    let options = [];
    Object.values(Priority).forEach(value => {
        let option = {
            value: value,
            text:  getPriorityName(value)
        };

        if (note.priority === value) {
            option.selected = true;
        }

        options.push(option);
    });

    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "note-priority-edit-form" });
    const select  = Form.Select({ id: "note-priority", options: options, autoclass: true, required: true });
    const confirm = Common.ConfirmButton({ mode: "icon" });
    const cancel  = Common.CancelButton({ mode: "icon" });

    wrapper.appendChild(select);
    wrapper.appendChild(confirm);
    wrapper.appendChild(cancel);
    frag.append(wrapper);

    return frag;
}

export function NoteDueDateForm(note, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "note-date-edit-form" });
    const date    = Form.Input({ type: "datetime-local", id: "note-date", required: true });
    const confirm = Common.ConfirmButton({ mode: "icon" });
    const cancel  = Common.CancelButton({ mode: "icon" });

    if (note.dueDate != null) {
        date.getElementById("note-date").value = format(new Date(note.dueDate), "yyyy-MM-dd'T'HH:mm");
    }
    else {
        let today = new Date();
        today.setHours(23, 59);
        date.getElementById("note-date").value = format(today, "yyyy-MM-dd'T'HH:mm");
    }

    wrapper.appendChild(date);
    wrapper.appendChild(confirm);
    wrapper.appendChild(cancel);
    frag.append(wrapper);

    return frag;
}

export function NoteProgressBar(settings = {}) {
    const completed = settings.completed ?? 0;
    const total     = settings.total ?? 1;
    const fill      = Math.round((completed / total) * 100);

    const frag      = document.createDocumentFragment();
    const wrapper    = Common.Div({ class: "note-progress" });
    const text       = Common.Div({ class: "progress-label", text: "Progress" });
    const completion = Common.Div({ class: "progress-completion", text: `${completed}/${total}` });
    const border     = Common.Div({ class: "progress-border" });
    const bar        = Common.Div({ class: "progress-bar" });
    bar.style.width  = fill.toString() + "%";

    border.append(bar);
    wrapper.append(text);
    wrapper.append(border);
    wrapper.append(completion);
    frag.append(wrapper);
    return frag;
}

export function NoteShortProgressBar(settings = {}) {
    const completed = settings.completed ?? 0;
    const total     = settings.total ?? 1;

    const completion = Common.Span({ class: "progress-completion", text: `${completed}/${total}` });

    frag.append(completion);
    return frag;
}

export function NoteFooter(note, settings = {}) {
    const frag = document.createDocumentFragment();
    const footer = Common.Div({ class: "note-footer" });

    footer.innerHTML = SVG.Information();
    footer.append("Click any field to edit it directly.");

    frag.append(footer);
    return frag;
}

export function NoteDeleteDialog(note, settings = {}) {
    const frag   = document.createDocumentFragment();
    const dialog = document.createElement("dialog");
    dialog.id = "note-delete-dialog";
    dialog.classList.add("delete-dialog");
    const form   = NoteDeleteForm(note, settings);
    const title  = Common.H2({ text: "confirm note deletion" })
    const text   = Common.P();
    text.append(
        "Are you sure you want to delete the note ",
        Common.Span({ text: note.title }),
        "? ",
        Common.Em({ text: "This action cannot be undone." }),
    );
    
    if ("open" in settings && settings.open) {
        dialog.open = true;
    }

    dialog.append(title);
    dialog.append(text);
    dialog.append(form);
    frag.append(dialog);
    return frag;
}

export function NoteDeleteForm(note, settings = {}) {
    const frag     = document.createDocumentFragment();
    const controls = Common.Div({ class: "controls" });
    const confirm  = Common.ConfirmButton({ type: "submit" });
    const cancel   = Common.CancelButton();

    controls.appendChild(confirm);
    controls.appendChild(cancel);
    frag.append(controls);
    return frag;
}