import { Controller } from "../Controller.js";
import { RenderContext } from "../RenderContext.js";
import { TextBlock } from "../contents/TextBlock.js";
import { TextBlockDeleteDialog, TextBlockForm } from "../renderers/templates/TextBlock.js";

export class TextBlockController extends Controller {
    #deleteDialog;
    #deleteForm;

    handleObjectRendered(renderer, target, context, result) {
        const mode = context.getSettingsParam("mode", "default");
        const note = context.getSettingsParam("note", null);

        switch (mode) {
            case "new":
            {
                this.#setupTextBlockForm(target, result, null, true, note);
            }
            break;

            case "default":
            default:
            {
                result.querySelector(".text-block").addEventListener("click", event => {
                    this.#handleTextBlockClick(event, target);
                });
            }
            break;
        }
    }

    #handleTextBlockClick(event, textBlock) {
        const content = event.target.closest(".text-block");

        const lines   = this.#countTextLines(textBlock.text);
        const rows    = Math.min(8, Math.max(4, lines));
        const frag    = TextBlockForm(textBlock, { rows: rows, value: textBlock.text });
        const input   = frag.querySelector("textarea");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");
        const del     = frag.querySelector(".button-delete");

        confirm.addEventListener("click", event => this.#handleConfirm(event, textBlock));
        cancel .addEventListener("click", event => this.#handleCancel(event, textBlock));
        del    .addEventListener("click", event => this.#handleDelete(event, textBlock));

        const form = frag.firstChild;
        form.text_ctrl_content = content;
        form.text_ctrl_input   = input;
        
        content.replaceWith(frag);
    }

    #setupTextBlockForm(textBlock, frag, content, isNew, note) {
        const form    = frag.firstChild;
        const input   = frag.querySelector("textarea");
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");
        const remove  = frag.querySelector(".button-delete");

        confirm.addEventListener("click", event => this.#handleConfirm(event, textBlock));
        cancel .addEventListener("click", event => this.#handleCancel (event, textBlock));
        remove .addEventListener("click", event => this.#handleDelete (event, textBlock));

        form.text_ctrl_content = content;
        form.text_ctrl_input   = input;
        form.text_ctrl_isnew   = isNew;
        form.text_ctrl_note    = note;
    }

    #handleConfirm(event, textBlock) {
        const form  = event.target.closest(".text-block-edit-form");
        const input = form.text_ctrl_input;
        const isNew = form.text_ctrl_isnew;
        const note  = form.text_ctrl_note;

        textBlock.text = input.value;

        if (textBlock.text.trim() == "") {
            this.#deleteForm = form;
            this.#deleteNote(isNew ? null : textBlock);
        }
        else {
            if (isNew) {
                note.addContent(textBlock);
            }

            const frag = this.app.renderSystem.renderReturn(textBlock, new RenderContext(null));
            form.replaceWith(frag);
        }
    }

    #handleCancel(event, textBlock) {
        const form    = event.target.closest(".text-block-edit-form");
        const content = form.text_ctrl_content;
        const isNew   = form.text_ctrl_isnew;

        if (textBlock.text.trim() == "") {
            this.#deleteForm = form;
            this.#deleteNote(isNew ? null : textBlock);
        }
        else {
            form.replaceWith(content);
        }
    }

    #handleDelete(event, textBlock) {
        if (!this.#createDeleteDialog(textBlock)) {
            return;
        }

        this.#deleteForm = event.target.closest(".text-block-edit-form");
        this.#deleteDialog.showModal();
    }

    #handleDeleteConfirmClick(textBlock) {
        const form  = this.#deleteForm;
        const isNew = form.text_ctrl_isnew;

        this.#deleteNote(isNew ? null : textBlock);
    }

    #handleDeleteCancelClick() {
        this.#deleteDialog.close();
    }

    #deleteNote(textBlock) {
        if (textBlock != null) {
            textBlock.note.removeContentById(textBlock.id);
        }

        if (this.#deleteDialog != null) {
            this.#deleteDialog.close();
        }

        if (this.#deleteForm != null) {
            this.#deleteForm.parentNode.removeChild(this.#deleteForm);
        }
    }

    #createDeleteDialog(textBlock) {
        let dialog  = document.getElementById("text-block-delete-dialog");
        let wrapper = null;

        if (dialog == null) {
            wrapper = document.getElementById("dialog");
            if (wrapper == null) {
                console.error("Dialog wrapper not found");
                return false;
            }
        }

        const frag    = TextBlockDeleteDialog(textBlock);
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");

        this.#deleteDialog = frag.firstChild;
        confirm.addEventListener("click", () => { this.#handleDeleteConfirmClick(textBlock); });
        cancel .addEventListener("click", () => { this.#handleDeleteCancelClick(); });

        if (dialog != null) {
            dialog.replaceWith(frag);
        }
        else {
            wrapper.appendChild(frag);
        }

        return true;
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
}