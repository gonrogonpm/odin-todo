import { Controller } from "../Controller.js";
import { RenderContext } from "../RenderContext.js";
import { TextBlock } from "../contents/TextBlock.js";
import { TextBlockDeleteDialog, TextBlockForm } from "../renderers/templates/TextBlock.js";
import { hasSelection } from "../Utils.js";

export class TextBlockController extends Controller {
    #deleteForm;

    handleObjectRendered(renderer, target, context, result) {
        const mode = context.getSettingsParam("mode", "default");
        const note = context.getSettingsParam("note", null);

        switch (mode) {
            case "new":
            {
                this.#setupTextBlockForm(result.firstChild, null, target, note, true);
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

    /* EDIT TEXT BLOCK */

    #handleTextBlockClick(event, textBlock) {
        if (hasSelection()) {
            return;
        }

        const block = event.target.closest(".text-block");
        if (block == null) {
            console.error("No text block found");
            return;
        }

        const frag = this.app.renderSystem.renderReturn(textBlock, new RenderContext(null, { partial: "form" }));
        const form = frag.firstChild;
        block.replaceWith(frag);
        this.#setupTextBlockForm(form, block, textBlock, textBlock.note, false);
    }

    /* FORM MANAGEMENT */

    #setupTextBlockForm(form, previousContent, textBlock, note, isNew) {
        const input   = form.querySelector("textarea");
        const confirm = form.querySelector(".button-confirm");
        const cancel  = form.querySelector(".button-cancel");
        const remove  = form.querySelector(".button-delete");

        confirm.addEventListener("click", event => this.#handleConfirm(event, textBlock));
        cancel .addEventListener("click", event => this.#handleCancel (event, textBlock));
        remove .addEventListener("click", event => this.#handleDelete (event, textBlock));

        form.text_ctrl_content = previousContent;
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
            note.save();

            const frag = this.app.renderSystem.renderReturn(textBlock, new RenderContext(null));
            form.replaceWith(frag);
        }
    }

    #handleCancel(event, textBlock) {
        const form    = event.target.closest(".text-block-edit-form");
        const content = form.text_ctrl_content;
        const isNew   = form.text_ctrl_isnew;

        if (isNew) {
            this.#deleteForm = form;
            this.#deleteNote(null);
        }
        else {
            form.replaceWith(content);
        }
    }

    #handleDelete(event, textBlock) {
        this.#deleteForm = event.target.closest(".text-block-edit-form");

        this.__showDialog(
            "text-block-delete-dialog",
            TextBlockDeleteDialog,
            () => { 
                this.#deleteNote(this.#deleteForm.text_ctrl_isnew ? null : textBlock);
                return true;
            }
        )
    }

    #deleteNote(textBlock) {
        if (textBlock != null) {
            const note = textBlock.note;
            note.removeContentById(textBlock.id);
            note.save();
        }

        if (this.#deleteForm != null) {
            this.#deleteForm.parentNode.removeChild(this.#deleteForm);
        }
    }
}