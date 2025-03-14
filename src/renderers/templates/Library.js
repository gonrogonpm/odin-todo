import * as Common from "./Common.js";
import * as Form from "./Form.js";

export function LibraryProjectList(library, settings = {}) {
    const frag    = document.createDocumentFragment();
    const wrapper = Common.Div({ class: "library-projects"});

    if ("id" in settings) {
        wrapper.id = settings.id;
    }

    if ("title" in settings) {
        wrapper.append(Common.H2({ text: settings.title }));
    }
    
    const body = LibraryProjectListContent(library, settings);
    const add  = Common.AddButton({ class: "libray-add-project-button", text: "add project" });

    wrapper.append(body);
    wrapper.append(add);
    frag.append(wrapper);
    return frag;
}

export function LibraryProjectListContent(library, settings = {}) {
    const frag = document.createDocumentFragment();
    const body = Common.Div({ class: "library-project-list" });

    if (!("content" in settings)) {
        let generators = [];
        for (let i = 0; i < library.projectCount; i++) {
            generators.push(() => LibraryProjectButton(library, { index: i }));
        }

        settings.content = generators;
    }

    const list = Common.UnorderedList(settings);
    body.append(list);
    frag.append(body);

    return frag;
}

export function LibraryProjectButton(library, settings = {}) {
    let project = null;
    if ("index" in settings) {
        project = library.getProject(settings.index);
    }

    if (project == null) {
        return null;
    }

    const button = Common.Button({
        class: ["library-project-button", "link"],
        text:  project.name,
        data:  { id: project.id } 
    });
    
    return button;
}

export function LibraryAddProjectDialog(library, settings = {}) {
    const frag   = document.createDocumentFragment();
    const dialog = document.createElement("dialog");
    dialog.id = "new-project-dialog";
    const title  = Common.H2({ text: "add project" })
    const form   = LibraryAddProjectForm(library, settings);
    
    if ("open" in settings && settings.open) {
        dialog.open = true;
    }

    dialog.append(title);
    dialog.append(form);
    frag.append(dialog);
    return frag;
}

export function LibraryAddProjectForm(library, settings = {}) {
    const frag     = document.createDocumentFragment();
    const form     = Form.Form({ method: "dialog", id: "new-project-form", class: "add-project-form" });
    const input    = Form.InputText({ id: "new-project-name", placeholder: "project name", required: true });
    const controls = Common.Div({ class: "controls" });
    const confirm  = Common.ConfirmButton({ type: "submit" });
    const cancel   = Common.CancelButton({ type: "reset" });

    controls.appendChild(confirm);
    controls.appendChild(cancel);
    form.appendChild(input);
    form.appendChild(controls);
    frag.append(form);
    return frag;
}