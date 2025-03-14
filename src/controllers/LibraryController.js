import { Controller } from "../Controller.js";
import { Library } from "../Library.js";
import { Project } from "../Project.js";
import { LibraryAddProjectDialog } from "../renderers/templates/Library.js";

export class LibraryController extends Controller {
    #addProjectDialog;
    #addProjectInput;
    #addProjectConfirm;
    #addProjectCancel;

    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
        result.querySelector(".libray-add-project-button")?.addEventListener("click", event => {
            this.#handleAddProjectClick(target);
        });
    }

    #handleAddProjectClick(library) {
        if (!this.#createDialog(library)) {
            return;
        }

        this.#addProjectDialog.showModal();
    }

    #handleAddProjectSubmit(event, library) {
        let value = this.#addProjectInput.value;
        if (typeof value !== "string") {
            console.error("Project name must be a valid string");
            return;
        }

        value = value.trim();
        if (value === "") {
            return;
        }

        library.addProject(new Project(value));
        this.#addProjectInput.value = "";
        this.app.renderSidebar();
    }

    #handleAddProjectCancelClick() {
        this.#addProjectDialog.close();
    }

    #createDialog(library) {
        if (document.getElementById("new-project-dialog") != null) {
            return true;
        }

        const wrapper = document.getElementById("dialog");
        if (wrapper == null) {
            console.error("Dialog wrapper not found");
            return false;
        }

        const frag = LibraryAddProjectDialog(library);
        const form    = frag.firstChild;
        const input   = frag.getElementById("new-project-name");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        form  .addEventListener("submit", event => { this.#handleAddProjectSubmit(event, library); });
        cancel.addEventListener("click",  event => { this.#handleAddProjectCancelClick(); })
        
        this.#addProjectDialog = form;
        this.#addProjectInput  = input;
        wrapper.appendChild(frag);

        return true;
    }
}