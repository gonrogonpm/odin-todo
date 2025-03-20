import { Controller } from "../Controller.js";
import { RenderContext } from "../RenderContext.js";
import { CheckList } from "../contents/Checklist.js";
import { ChecklistItemDeleteDialog, ChecklistDeleteDialog } from "../renderers/templates/Checklist.js";

export class ChecklistController extends Controller {
    #itemContent = null;
    #itemForm    = null;
    #itemIsNew   = false;

    handleObjectRendered(renderer, target, context, result) {
        const mode = context.getSettingsParam("mode", "default");
        const note = context.getSettingsParam("note", null);

        switch (mode) {
            case "default":
            default:
            {
                result.querySelector(".button-add").addEventListener("click", event => {
                    this.#handleAddClick(event, target);
                });

                result.querySelector(".button-delete").addEventListener("click", event => {
                    this.#handleDeleteClick(event, target);
                })

                result.querySelector("ul").addEventListener("click", event => {
                    this.#handleItemClick(event, target);
                });
            }
            break;
        }
    }

    /* ADD A NEW ITEM */

    #handleAddClick(event, checklist) {
        // Close any open form.
        this.#closeItemForm();
        
        const listWrapper = event.target.closest(".checklist")
        if (listWrapper == null) {
            console.error("checklist not found");
            return;
        }

        const list = listWrapper.querySelector("ul");
        if (list == null) {
            console.error("list not found");
            return;
        }

        const frag = this.app.renderSystem.renderReturn(checklist, new RenderContext(null, { partial: "new" }));
        const form = frag.firstChild;
        list.append(frag);
        this.#setupItemForm(form, null, checklist, null);
    }

    /* DELETE CHECKLIST */

    #handleDeleteClick(event, checklist) {
        this.__showDialog(
            "checklist-delete-dialog",
            ChecklistDeleteDialog, 
            () => { this.#deleteChecklist(event, checklist); return true; }
        );
    }

    #deleteChecklist(event, checklist) {
        if (checklist != null) {
            checklist.note.removeContentById(checklist.id);
        }

        const content = event.target.closest(".checklist");
        if (content == null) {
            console.error("Unable to delete, content element not found in DOM");
            return;
        }

        content.remove();
    }

    /* CHECK OR EDIT AN ITEM */

    #handleItemClick(event, checklist) {
        // If the user clicked checkbox, toggle the checked state of the item.
        const inputWrapper = event.target.closest(".checklist-input");
        if (inputWrapper != null) {
            this.#handleItemInputClick(event, checklist, inputWrapper);
            return;
        }
        // If the user clicked the text, open the edit form.
        const textWrapper = event.target.closest(".checklist-text");
        if (textWrapper != null) {
            this.#handleItemTextClick(event, checklist, textWrapper);
            return;
        }
    }

    /* TOOGLE CHECK STATE OF AN ITEM */

    #handleItemInputClick(event, checklist, wrapper) {
        const item = wrapper.closest(".checklist-item");
        if (item == null) {
            console.error("No checklist item found");
            return;
        }

        const id = parseInt(item.dataset.id);
        if (isNaN(id)) {
            console.error("Invalid index");
            return;
        }

        const input = wrapper.querySelector("input");
        if (input == null) {
            console.error("No input element");
            return;
        }

        checklist.setCheckedById(id, input.checked);
    }

    /* EDIT AN ITEM */

    #handleItemTextClick(event, checklist, wrapper) {
        // Close any open form.
        this.#closeItemForm();

        const item = wrapper.closest(".checklist-item");
        if (item == null) {
            console.error("No checklist item found");
            return;
        }

        const id = parseInt(item.dataset.id);
        if (isNaN(id)) {
            console.error("Invalid index");
            return;
        }

        const frag = this.app.renderSystem.renderReturn(checklist, new RenderContext(null, { partial: "item-form", id: id }));
        const form = frag.firstChild;
        wrapper.replaceWith(frag);
        this.#setupItemForm(form, wrapper, checklist, id);
    }

    /* ITEM FORM MANAGEMENT */

    #setupItemForm(form, previousContent, checklist, id) {
        // Closes any open form before setting up a new one.
        this.#closeItemForm();

        const input   = form.querySelector("input");
        const confirm = form.querySelector(".button-confirm");
        const cancel  = form.querySelector(".button-cancel");
        const remove  = form.querySelector(".button-delete");

        this.#itemForm    = form;
        this.#itemContent = previousContent;
        this.#itemIsNew   = id == null;

        confirm.addEventListener("click", event => this.#handleItemFormConfirm(checklist, id, input));
        cancel .addEventListener("click", event => this.#handlItemFormCancel());
        remove?.addEventListener("click", event => this.#handleItemFormDelete(checklist, id));

        input.focus();
    }

    #handleItemFormConfirm(checklist, id, input) {
        const text = input.value.trim();
        // If the input text is empty, close the form without modifying the item.
        if (text === "") {
            this.#closeItemForm();
            return;
        }

        if (this.#itemIsNew) {
            id = checklist.add(text);
            const frag = this.app.renderSystem.renderReturn(checklist, new RenderContext(null, { partial: "item", id: id, listitem: true }));
            this.#itemContent = frag;
        }
        else {
            checklist.setTextById(id, text);
            // Renders the new item text and replace the old content.
            const frag = this.app.renderSystem.renderReturn(checklist, new RenderContext(null, { partial: "item-text", id: id }));
            this.#itemContent = frag;
        }

        this.#closeItemForm();
    }

    #handlItemFormCancel() {
        this.#closeItemForm();
    }

    #handleItemFormDelete(checklist, id) {
        this.__showDialog(
            "checklist-item-delete-dialog",
            ChecklistItemDeleteDialog, 
            () => { this.#deleteItem(checklist, id); return true; }
        );
    }

    /**
     * Closes the item form if it is open.
     * 
     * Note that this method alse reset the item properties `#itemContent`, `#itemForm` and `#itemIsNew`.
     */
    #closeItemForm() {
        if (this.#itemForm == null) {
            return;
        }

        if (this.#itemContent == null) {
            this.#itemForm.remove();
        }
        else {
            this.#itemForm.replaceWith(this.#itemContent);
        }

        this.#itemContent = null;
        this.#itemForm    = null;
        this.#itemIsNew   = false;
    }

    /**
     * Deletes a item from the checklist and closes the edit form if it is open.
     * 
     * @param {CheckList} checklist Checklist from where to remove the item.
     * @param {string} id Identifier of the item to remove.
     */
    #deleteItem(checklist, id) {
        if (checklist != null) {
            checklist.removeById(id);
        }

        if (this.#itemForm != null) {
            const item = this.#itemForm.closest("li");
            if (item == null) {
                console.error("No checklist item found");
                return;
            }

            item.remove();
        }
    }
}