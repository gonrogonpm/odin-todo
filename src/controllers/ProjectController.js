import { Controller } from "../Controller.js";
import { Note } from "../Note.js";
import { ProjectDeleteDialog, ProjectAddNoteForm } from "../renderers/templates/Project.js";

export class ProjectController extends Controller {
    addButton = null;
    addParent = null;
    addInput  = null;

    #mode;
    #addNoteContent;
    #addNoteForm;
    #addNoteInput;
    #deleteProjectDialog;

    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
        this.#mode = context.getSettingsParam("mode", "card");

        result.querySelector(".button-list").addEventListener("click", event => {
            this.handleButtonListClicked(target);
        });

        result.querySelector(".button-grid").addEventListener("click", event => {
            this.handleButtonGridClicked(target);
        });

        result.querySelector(".button-add").addEventListener("click", event => {
            this.handleButtonAddClicked(event, target);
        });

        result.querySelector(".project-delete-button")?.addEventListener("click", event => {
            this.#handleDeleteProjectClick(target);
        });
    }

    handleButtonListClicked(project) {
        this.app.renderProject(project.id, true, { mode: "list" });
    }

    handleButtonGridClicked(project) {
        this.app.renderProject(project.id, true, { mode: "grid" });
    }

    handleButtonAddClicked(event, project) {
        this.#addNoteContent = event.target.closest("button");
        
        const form    = ProjectAddNoteForm(project);
        const input   = form.getElementById("new-note-name");
        const confirm = form.querySelector(".button-confirm");
        const cancel  = form.querySelector(".button-cancel");

        input.addEventListener("keydown", ev => this.#handleKeyboardConfirm(ev, project, this.#handleAddNoteConfirm));
        confirm.addEventListener("click", () => this.#handleAddNoteConfirm(project));
        cancel .addEventListener("click", () => this.#handleAddNoteCancel());

        this.#addNoteForm  = form.firstChild;
        this.#addNoteInput = input;
        this.#addNoteContent.replaceWith(form);
        input.focus();
    }

    #handleAddNoteConfirm(project) {
        const value = this.#addNoteInput.value;
        if (typeof value !== "string" || value.trim() === "") {
            this.#closeAddNoteForm(this.#addNoteContent);
            return;
        }

        project.addNote(new Note({ title: value }));
        this.app.renderProject(project.id, true, { mode: this.#mode });
    }

    #handleAddNoteCancel() {
        this.#closeAddNoteForm(this.#addNoteContent);
    }

    #closeAddNoteForm(content) {
        this.#addNoteForm.replaceWith(content);
        this.#addNoteContent = null;
        this.#addNoteForm    = null;
        this.#addNoteInput   = null;
    }

    #handleDeleteProjectClick(project) {
        if (!this.#createDeleteProjectDialog(project)) {
            return;
        }

        this.#deleteProjectDialog.showModal();
    }

    #handleDeleteProjectConfirmClick(project) {
        this.app.library.removeProjectById(project.id);
        this.#deleteProjectDialog.close();
        this.app.render();
    }

    #handleDeleteProjectCancelClick() {
        this.#deleteProjectDialog.close();
    }

    #createDeleteProjectDialog(project) {
        let dialog  = document.getElementById("project-delete-dialog");
        let wrapper = null;

        if (dialog == null) {
            wrapper = document.getElementById("dialog");
            if (wrapper == null) {
                console.error("Dialog wrapper not found");
                return false;
            }
        }

        const frag    = ProjectDeleteDialog(project);
        const form    = frag.firstChild;
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        confirm.addEventListener("click", event => { this.#handleDeleteProjectConfirmClick(project); });
        cancel .addEventListener("click", event => { this.#handleDeleteProjectCancelClick(); })
        
        this.#deleteProjectDialog = form;

        if (dialog != null) {
            dialog.replaceWith(frag);
        }
        else {
            wrapper.appendChild(frag);
        }

        return true;
    }

    /* UTILITIES */

    #handleKeyboardConfirm(event, project, handler) {
        if (event.repeat || event.key !== "Enter") {
            return;
        }

        handler.call(this, project);
    }
}