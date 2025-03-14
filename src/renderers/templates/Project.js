import * as Common from "./Common.js";
import * as Form from "./Form.js";
import * as SVG from "./SVG.js";

export function ProjectBoard(project, settings = {}) {
    const frag = document.createDocumentFragment();
    const body = Common.Div({ class: "project" });

    if ("content" in settings) {
        Common.addContent(body, settings.content);
    }

    frag.append(body);
    return frag;
}

export function ProjectTitle(project, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "project-title" });
    const header  = Common.H2({ text: project.name });

    wrapper.appendChild(header);
    frag.appendChild(wrapper);
    return frag;
}

export function ProjectMenu(project, settings = {}) {
    const frag  = document.createDocumentFragment();
    const menu  = Common.Nav({ class: "project-menu" });;
    const left  = Common.Div({ class: "project-menu-left" });
    const right = Common.Div({ class: "project-menu-right" });
    const add   = Common.AddButton({ text: "add note", class: "project-button-add", data: { id: project.id } })
    const list  = Common.ListButton({ class: ["project-button-list", "link"] });
    const grid  = Common.GridButton({ class: ["project-button-grid", "link"] });

    left.append(add);
    right.append(list);
    right.append(grid);
    menu.appendChild(left);
    menu.appendChild(right);
    frag.appendChild(menu);
    return frag;
}

export function ProjectList(project, settings = {}) {
    settings.class = [].concat("project-list", settings.class ?? "");
    return ProjectContent(project, settings);
}

export function ProjectGrid(project, settings = {}) {
    settings.class = [].concat("project-grid", settings.class ?? "");
    return ProjectContent(project, settings);
}

function ProjectContent(project, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: settings.class ?? "" });

    if ("content" in settings) {
        Common.addContent(wrapper, settings.content);
    }

    frag.appendChild(wrapper);
    return frag;
}

export function ProjectContentEmpty(project, settings = {}) {
    const frag = document.createDocumentFragment();
    const div  = Common.Div({ class: "project-empty" });
    div.innerHTML = `This project is empty &#128577;, click <span>Add Note</span> to create a new note.`;

    frag.append(div);
    return frag;
}

export function ProjectFooter(project, settings = {}) {
    const frag   = document.createDocumentFragment();
    const div    = Common.Div({ class: "project-footer" });

    if (!project.isDefaultProject) {
        const remove = Common.Button({ 
            class: ["delete", "link", "project-delete-button"],
            text:  "delete project",
            svg:   SVG.Delete,
            data:  { id: project.id }
        })

        div.append(remove);
    }

    
    frag.append(div);
    return frag;
}

export function ProjectAddNoteForm(project, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "notes-add-form"});
    const input   = Form.InputText({ id: "new-note-name", placeholder: "project name", required: true});
    const confirm = Common.ConfirmButton();
    const cancel  = Common.CancelButton();

    wrapper.appendChild(input);
    wrapper.appendChild(confirm);
    wrapper.appendChild(cancel);
    frag.append(wrapper);

    return frag;
}

export function ProjectDeleteDialog(project, settings = {}) {
    const frag   = document.createDocumentFragment();
    const dialog = document.createElement("dialog");
    dialog.id = "project-delete-dialog";
    dialog.classList.add("delete-dialog");
    const form   = ProjectDeleteForm(project, settings);
    const title  = Common.H2({ text: "confirm project deletion" })
    const text   = Common.P();
    text.append(
        "Are you sure you want to delete the project ",
        Common.Span({ text: project.name }),
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

export function ProjectDeleteForm(project, settings = {}) {
    const frag     = document.createDocumentFragment();
    const controls = Common.Div({ class: "controls" });
    const confirm  = Common.ConfirmButton();
    const cancel   = Common.CancelButton();

    controls.appendChild(confirm);
    controls.appendChild(cancel);
    frag.append(controls);
    return frag;
}