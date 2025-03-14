import { Controller } from "../Controller.js";
import { Note } from "../Note.js";
import { RenderContext } from "../RenderContext.js";
import { NoteTitleForm, NoteDescriptionForm, NotePriorityForm, NoteDateForm, NoteDeleteDialog } from "../renderers/templates/Note.js";
import { parse } from "date-fns";

export class NoteController extends Controller {
    #deleteNoteDialog;
    #titleContent;
    #titleForm;
    #titleInput;
    #descParent;
    #descContent;
    #descInput;
    #priorityContent;
    #priorityForm;
    #priorityInput;
    #dueDateContent;
    #dueDateForm;
    #dueDateInput;

    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
        result.querySelector(".button-done").addEventListener("click", event => {
            this.handleNoteDoneClick(event, target);
        });

        result.querySelector(".note-delete-button")?.addEventListener("click", event => {
            this.#handleDeleteNoteClick(target); 
        });

        this.handlePartialRendered(renderer, target, context, null, result);
    }

    handlePartialRendered(renderer, target, context, partial, result) {
        const showDetails = context.getSettingsParam("mode", "card") === "details";
        // The title is a link to the details/edit mode if the note is part of a list.
        if (partial == null || partial === "title") {
            if (showDetails) {
                result.querySelector(".note-title").addEventListener("click", event => {
                    this.handleNoteTitleClick(event, renderer, target);
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
                this.handleNotePriorityClick(event, target);
            });
        }

        if (partial == null || partial === "dueDate") {
            result.querySelector(".note-due-date").addEventListener("click", event => {
                this.handleNoteDueDateClick(event, target);
            });
        }
    }

    handleNoteDoneClick(event, note) {
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

    #handleDeleteNoteClick(note) {
        if (!this.#createDeleteNoteDialog(note)) {
            return;
        }

        this.#deleteNoteDialog.showModal();
    }

    #handleDeleteNoteConfirmClick(note) {
        const projectId = note.projectId;
        const noteId    = note.id;

        this.app.library.removeProjectNoteById(projectId, noteId);
        this.#deleteNoteDialog.close();
        this.app.renderProject(projectId, true);
    }

    #handleDeleteNoteCancelClick() {
        this.#deleteNoteDialog.close();
    }

    #createDeleteNoteDialog(note) {
        let dialog  = document.getElementById("note-delete-dialog");
        let wrapper = null;

        if (dialog == null) {
            wrapper = document.getElementById("dialog");
            if (wrapper == null) {
                console.error("Dialog wrapper not found");
                return false;
            }
        }

        const frag    = NoteDeleteDialog(note);
        const form    = frag.firstChild;
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        confirm.addEventListener("click", event => { this.#handleDeleteNoteConfirmClick(note); });
        cancel .addEventListener("click", event => { this.#handleDeleteNoteCancelClick(); })
        
        this.#deleteNoteDialog = form;

        if (dialog != null) {
            dialog.replaceWith(frag);
        }
        else {
            wrapper.appendChild(frag);
        }

        return true;
    }

    /* TITLE */

    handleNoteTitleClick(event, renderer, note) {
        if (note.done) {
            return;
        }

        this.#titleContent = event.target.closest("h3");

        const frag    = NoteTitleForm(note, { value: note.title });
        const input   = frag.getElementById("note-title");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        input.addEventListener("keydown", ev => this.#handleKeyboardConfirm(ev, note, this.#handleNoteTitleConfirm));
        confirm.addEventListener("click", () => this.#handleNoteTitleConfirm(note));
        cancel .addEventListener("click", () => this.#handleNoteTitleCancel());

        this.#titleForm  = frag.firstChild;
        this.#titleInput = input;
        this.#titleContent.replaceWith(frag);
        input.focus();
    }

    #handleNoteTitleConfirm(note) {
        if (typeof this.#titleInput.value !== "string" || this.#titleInput.value.trim() === "") {
            this.#closeTitleForm(this.#titleContent);
            return;
        }

        note.title = this.#titleInput.value;

        const frag = this.app.renderSystem.renderReturn(note, { partial: "title", mode: "details" });
        this.#closeTitleForm(frag);
    }

    #handleNoteTitleCancel() {
        this.#closeTitleForm(this.#titleContent);
    }

    #closeTitleForm(content) {
        this.#titleForm.replaceWith(content);
        this.#titleContent = null;
        this.#titleForm    = null;
        this.#titleInput   = null;
    }

    /* DESCRIPTION */

    handleNoteDescClick(event, renderer, note) {
        if (note.done) {
            return;
        }

        this.#descParent  = event.target.closest("section");
        this.#descContent = this.#descParent.firstChild;
        
        const lines   = this.#countTextLines(note.description);
        const rows    = Math.min(8, Math.max(4, lines));
        const frag    = NoteDescriptionForm(note, { rows: rows, value: note.description });
        const input   = frag.getElementById("note-desc");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        input.addEventListener("keydown", ev => this.#handleKeyboardConfirm(ev, note, this.#handleNoteDescConfirm));
        confirm.addEventListener("click", () => this.#handleNoteDescConfirm(note));
        cancel .addEventListener("click", () => this.#handleNoteDescCancel());

        this.#descInput = input;
        this.#descContent.replaceWith(frag);
        input.focus();
    }

    #countTextLines(text) {
        let count =  0;
        let pos   = -1;

        do {
            pos = text.indexOf("\n", pos + 1);
            if (pos >= 0) {
                count++;
            }
        }
        while (pos >= 0);

        return count + 1;
    }

    #handleNoteDescConfirm(note) {
        note.description = this.#descInput.value;

        const frag = this.app.renderSystem.renderReturn(note, { partial: "description", mode: "details" });
        this.#closeDescForm(frag, true);
    }

    #handleNoteDescCancel() {
        this.#closeDescForm(this.#descContent, false);
    }

    #closeDescForm(content, replaceParent) {
        if (replaceParent) {
            this.#descParent.replaceWith(content);
        }
        else {
            this.#descParent.replaceChildren(content);
        }
        
        this.#descParent  = null;
        this.#descContent = null;
        this.#descInput   = null;
    }

    /* PRIORITY */

    handleNotePriorityClick(event, note) {
        if (note.done) {
            return;
        }

        this.#priorityContent = event.target.closest("div");

        const frag    = NotePriorityForm(note);
        const input   = frag.getElementById("note-priority");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        input.addEventListener("keydown", ev => this.#handleKeyboardConfirm(ev, note, this.#handleNotePriorityConfirm));
        confirm.addEventListener("click", () => this.#handleNotePriorityConfirm(note));
        cancel .addEventListener("click", () => this.#handleNotePriorityCancel());

        this.#priorityForm  = frag.firstChild;
        this.#priorityInput = input;
        this.#priorityContent.replaceWith(frag);
        input.focus();
    }

    #handleNotePriorityConfirm(note) {
        note.priority = Number(this.#priorityInput.value);

        const frag = this.app.renderSystem.renderReturn(note, { partial: "priority", mode: "details" });
        this.#closePriorityForm(frag);
    }

    #handleNotePriorityCancel() {
        this.#closePriorityForm(this.#priorityContent);
    }

    #closePriorityForm(content) {
        this.#priorityForm.replaceWith(content);
        this.#priorityForm    = null;
        this.#priorityInput   = null;
        this.#priorityContent = null;
    }

    /* DUE DATE */

    handleNoteDueDateClick(event, note) {
        if (note.done) {
            return;
        }
        
        this.#dueDateContent = event.target.closest("div");

        const frag    = NoteDateForm(note);
        const input   = frag.getElementById("note-date");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        input.addEventListener("keydown", ev => this.#handleKeyboardConfirm(ev, note, this.#handleNoteDueDateConfirm));
        confirm.addEventListener("click", () => this.#handleNoteDueDateConfirm(note));
        cancel .addEventListener("click", () => this.#handleNoteDueDateCancel());

        this.#dueDateForm  = frag.firstChild;
        this.#dueDateInput = input;
        this.#dueDateContent.replaceWith(frag);
        input.focus();
    }

    #handleNoteDueDateConfirm(note) {
        const value = this.#dueDateInput.value;
        const local = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
        if (isNaN(local)) {
            console.error(`Due date format ${value} is not valid`);
            this.#closeDueDateForm(this.#dueDateContent);
            return;
        }
        
        note.setDueDate(local);

        const frag = this.app.renderSystem.renderReturn(note, { partial: "dueDate", mode: "details" });
        this.#closeDueDateForm(frag);
    }

    #handleNoteDueDateCancel() {
        this.#closeDueDateForm(this.#dueDateContent);
    }

    #closeDueDateForm(content) {
        this.#dueDateForm.replaceWith(content);
        this.#dueDateForm    = null;
        this.#dueDateInput   = null;
        this.#dueDateContent = null;
    }

    /* UTILITIES */

    #handleKeyboardConfirm(event, note, handler) {
        if (event.repeat || event.key !== "Enter") {
            return;
        }

        handler.call(this, note);
    }
}