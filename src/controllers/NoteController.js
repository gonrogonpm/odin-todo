import { Controller } from "../Controller.js";
import { Note } from "../Note.js";
import { TextBlock } from "../contents/TextBlock.js";
import { Checklist } from "../contents/Checklist.js";
import { RenderContext } from "../RenderContext.js";
import { NoteDeleteDialog } from "../renderers/templates/Note.js";
import { hasSelection } from "../Utils.js";
import { parse } from "date-fns";

export class NoteController extends Controller {
    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
        const showDetails = context.getSettingsParam("mode", "card") === "details";

        result.querySelector(".button-done").addEventListener("click", event => {
            this.handleDoneClick(event, target);
        });

        result.querySelector(".button-details")?.addEventListener("click", event => {
            this.handleDetailsClick(target);
        });

        if (showDetails) {
            result.querySelector(".note-delete-button").addEventListener("click", event => {
                this.#handleDeleteClick(target); 
            });

            result.querySelector(".button-add-text").addEventListener("click", event => {
                this.handleAddTextClick(event, target);
            });

            result.querySelector(".button-add-checklist").addEventListener("click", event => {
                this.#handleAddChecklistClick(event, target);
            });
        }

        this.handlePartialRendered(renderer, target, context, null, result);
    }

    handlePartialRendered(renderer, target, context, partial, result) {
        const showDetails = context.getSettingsParam("mode", "card") === "details";
        // The title is a link to the details/edit mode if the note is part of a list.
        if (partial == null || partial === "title") {
            if (showDetails) {
                result.querySelector(".note-title").addEventListener("click", event => {
                    this.handleTitleClick(event, renderer, target);
                });
            }
            else {
                result.querySelector(".note-title").addEventListener("click", event => {
                    this.app.renderNote(target.projectId, target.id, true);
                });
            }
            
        }
        // Other events are only handled in details/edit mode.
        if (!showDetails) {
            return;
        }

        if (partial == null || partial === "description") {
            result.querySelector(".note-description-text").addEventListener("click", event => {
                this.handleNoteDescClick(event, renderer, target);
            });
        }

        if (partial == null || partial === "priority") {
            result.querySelector(".priority").addEventListener("click", event => {
                this.handlePriorityClick(event, target);
            });
        }

        if (partial == null || partial === "dueDate") {
            result.querySelector(".note-due-date").addEventListener("click", event => {
                this.handleDueDateClick(event, target);
            });
        }
    }

    /* NOTE DONE TOGGLE */

    handleDoneClick(event, note) {
        note.toggleDone();

        const button  = event.target.closest("button");
        const article = event.target.closest("article.note");

        button.updateDoneIcon(note.isDone);

        if (note.isDone) {
            article.classList.add("note-done");
        }
        else {
            article.classList.remove("note-done");
        }
    }

    /* NOTE DELETION */

    #handleDeleteClick(note) {
        this.__showDialog(
            "note-delete-dialog",
            () => NoteDeleteDialog(note),
            () => {
                this.#deleteNote(note);
                return true;
            }
        );
    }

    #deleteNote(note) {
        const pid = note.projectId;

        note.project.removeNoteById(note.id);
        this.app.renderProject(pid, true);
    }

    /* SHOW DETAILS */

    handleDetailsClick(note) {
        this.app.renderNote(note.projectId, note.id, true);
    }

    /* ADD CONTENT */

    handleAddTextClick(event, note) {
        const frag = this.app.renderSystem.renderReturn(new TextBlock(), new RenderContext(null, { mode: "new", note: note }));
        // Find the note content.
        const parent  = event.target.closest(".note");
        const content = parent.querySelector(".note-content");
        // Append the fragment as the last content.
        content.append(frag);
    }

    #handleAddChecklistClick(event, note) {
        const checklist = note.addContent(new Checklist());
        const frag      = this.app.renderSystem.renderReturn(checklist, new RenderContext(null));
        // Find the note content.
        const parent  = event.target.closest(".note");
        const content = parent.querySelector(".note-content");
        // Append the fragment as the last content.
        content.append(frag);
    }

    /* TITLE EDITION */

    handleTitleClick(event, renderer, note) {
        if (note.done || hasSelection()) {
            return;
        }

        const previousContent = event.target.closest("h3");
        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "title-form" }));
        const form = frag.firstChild;
        previousContent.replaceWith(frag);

        this.#setupNoteComponentForm(form, previousContent, "note-title",
            (form, input, prev) => this.#handleTitleConfirm(note, form, input, prev),
            (form, input, prev) => this.#handleTitleCancel (note, form, input, prev)
        );
    }

    #handleTitleConfirm(note, form, input, previousContent) {
        if (typeof input.value !== "string" || input.value.trim() === "") {
            form.replaceWith(previousContent);
            return;
        }

        note.title = input.value.trim();

        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "title", mode: "details" }));
        form.replaceWith(frag);
    }

    #handleTitleCancel(note, form, input, previousContent) {
        form.replaceWith(previousContent);
    }

    /* DESCRIPTION EDITION */

    handleNoteDescClick(event, renderer, note) {
        if (note.done || hasSelection()) {
            return;
        }

        const previousContent = event.target.closest("section");
        const desc = previousContent.firstChild;
        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "description-form" }));
        const form = frag.firstChild;
        previousContent.firstChild.replaceWith(frag);

        this.#setupNoteComponentForm(form, previousContent, "note-desc",
            (form, input, prev) => this.#handleDescConfirm(note, form, input, prev),
            (form, input, prev) => this.#handleDescCancel (note, form, input, prev, desc)
        );
    }

    #handleDescConfirm(note, form, input, previousContent) {
        note.description = input.value;

        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "description", mode: "details" }));
        previousContent.replaceWith(frag);
    }

    #handleDescCancel(note, form, input, previousContent, desc) {
        form.replaceWith(desc);
    }

    /* PRIORITY EDITION */

    handlePriorityClick(event, note) {
        if (note.done || hasSelection()) {
            return;
        }

        const previousContent = event.target.closest("div");
        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "priority-form" }));
        const form = frag.firstChild;
        previousContent.replaceWith(frag);

        this.#setupNoteComponentForm(form, previousContent, "note-priority",
            (form, input, prev) => this.#handlePriorityConfirm(note, form, input, prev),
            (form, input, prev) => this.#handlePriorityCancel (note, form, input, prev)
        );
    }

    #handlePriorityConfirm(note, form, input, previousContent) {
        note.priority = Number(input.value);

        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "priority", mode: "details" }));
        form.replaceWith(frag);
    }

    #handlePriorityCancel(note, form, input, previousContent) {
        form.replaceWith(previousContent);
    }

    /* DUE DATE EDITION */

    handleDueDateClick(event, note) {
        if (note.done || hasSelection()) {
            return;
        }
        
        const previousContent = event.target.closest("div");
        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "dueDate-form" }));
        const form = frag.firstChild;
        previousContent.replaceWith(frag);

        this.#setupNoteComponentForm(form, previousContent, "note-date",
            (form, input, prev) => this.#handleDueDateConfirm(note, form, input, prev),
            (form, input, prev) => this.#handleDueDateCancel (note, form, input, prev)
        );
    }

    #handleDueDateConfirm(note, form, input, previousContent) {
        const value = input.value;
        const local = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
        if (isNaN(local)) {
            console.error(`Due date format ${value} is not valid`);
            form.replaceWith(previousContent);
            return;
        }
        
        note.setDueDate(local);

        const frag = this.app.renderSystem.renderReturn(note, new RenderContext(null, { partial: "dueDate", mode: "details" }));
        form.replaceWith(frag);
    }

    #handleDueDateCancel(note, form, input, previousContent) {
        form.replaceWith(previousContent);
    }

    /* UTILITIES */

    #setupNoteComponentForm(form, previousContent, inputFieldId, onConfirm, onCancel) {
        const input   = form.querySelector("#" + inputFieldId);
        const confirm = form.querySelector(".button-confirm");
        const cancel  = form.querySelector(".button-cancel");

        confirm.addEventListener("click", () => onConfirm(form, input, previousContent));
        cancel .addEventListener("click", () => onCancel (form, input, previousContent));
        input  .addEventListener("keydown", event => {
            if (event.repeat || event.key !== "Enter") {
                return;
            }

            onConfirm(form, input, previousContent);
        });

        input.focus();
    }
}