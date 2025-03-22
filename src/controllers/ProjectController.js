import { Controller } from "../Controller.js";
import { RenderContext } from "../RenderContext.js";
import { Note } from "../Note.js";
import { ProjectDeleteDialog } from "../renderers/templates/Project.js";

export class ProjectController extends Controller {
    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
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

    /* VISUALIZATION MODE */

    handleButtonListClicked(project) {
        this.app.projectMode = "list";
        this.app.renderProject(project.id, true);
    }

    handleButtonGridClicked(project) {
        this.app.projectMode = "grid";
        this.app.renderProject(project.id, true);
    }

    /* DELETE PROJECT */

    #handleDeleteProjectClick(project) {
        this.__showDialog(
            "project-delete-dialog",
            () => ProjectDeleteDialog(project),
            () => {
                project.removeSave();
                this.app.library.removeProjectById(project.id);
                this.app.render();
                return true;
            }
        )
    }

    /* ADD NOTE */

    handleButtonAddClicked(event, project) {
        const previousContent = event.target.closest("button"); 
        const frag    = this.app.renderSystem.renderReturn(project, new RenderContext(null, { partial: "add-note" }));
        const form    = frag.firstChild;
        const input   = frag.getElementById("new-note-name");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");
        previousContent.replaceWith(frag);

        confirm.addEventListener("click", () => this.#handleAddNoteConfirm(project, form, input, previousContent));
        cancel .addEventListener("click", () => this.#handleAddNoteCancel (project, form, input, previousContent));
        input  .addEventListener("keydown", event => {
            if (event.repeat || event.key !== "Enter") {
                return;
            }
    
            this.#handleAddNoteConfirm(project, form, input, previousContent);
        });

        input.focus();
    }

    #handleAddNoteConfirm(project, form, input, previousContent) {
        const value = input.value;
        if (typeof value !== "string" || value.trim() === "") {
            form.replaceWith(previousContent);
            return;
        }

        project.addNote(new Note({ title: value.trim() }));
        project.save();
        
        this.app.renderProject(project.id, true);
    }

    #handleAddNoteCancel(project, form, input, previousContent) {
        form.replaceWith(previousContent);
    }
}