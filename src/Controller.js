export class Controller {
    /**
     * Currently opened dialog.
     */
    #currentDialog = null;

    /**
     * Application.
     */
    #app = null;

    /**
     * Constructor.
     * 
     * @param {App} app Application.
     */
    constructor(app) {
        this.#app = app;
    }

    /**
     * Gets the application.
     */
    get app() {
        return this.#app;
    }
    
    /**
     * Handles full object rendering events.
     *
     * @param {Renderer} renderer The renderer that triggered the event.
     * @param {*} target The target object that was rendered.
     * @param {RenderContext} context The rendering context.
     * @param {*} result The result of the rendering operation.
     */
    handleObjectRendered(renderer, target, context, result) {}

    /**
     * Handles partial rendering events.
     *
     * @param {Renderer} renderer The renderer that triggered the event.
     * @param {*} target The target object that was rendered.
     * @param {RenderContext} context The rendering context.
     * @param {string} partial The partial that was rendered.
     * @param {*} result The result of the rendering operation.
     */
    handlePartialRendered(renderer, target, context, partial, result) {}

    /**
     * Shows a dialog.
     * 
     * @param {string} dialogId ID of the dialog HTML element.
     * @param {function} dialogFunc Function to create the dialog DOM elements.
     * @param {function} onConfirm Function to handle the dialog confirmation.
     * @param {function} onCancel Function to handle the dialog cancelation.
     * 
     * @returns True on success; otherwise, false.
     */
    __showDialog(dialogId, dialogFunc, onConfirm, onCancel) {
        if (typeof dialogId !== 'string' || dialogId.trim() === "") {
            console.error("Invalid dialogId: must be a non-empty string");
            return false;
        }
        
        if (typeof dialogFunc !== 'function') {
            console.error("Invalid dialogFunc: must be a function");
            return false;
        }

        if (onConfirm != null && typeof onConfirm !== 'function') {
            console.error("Invalid onConfirm: must be a function or null");
            return false;
        }
        if (onCancel != null && typeof onCancel !== 'function') {
            console.error("Invalid onCancel: must be a function or null");
            return false;
        }

        if (this.#currentDialog != null && this.#currentDialog.open) {
            console.warn("A dialog is already open");
            return false;
        }

        let dialog  = document.getElementById(dialogId);
        let wrapper = null;
        // Find the dialog wrapper to create a new dialog if the dialog does not exists.
        if (dialog == null) {
            wrapper = document.getElementById("dialog");
            if (wrapper == null) {
                console.error("Dialog wrapper element with ID 'dialog' not found in the DOM");
                return false;
            }
        }

        const frag    = dialogFunc();
        const content = frag.firstChild;
        const confirm = frag.querySelector(".button-confirm");
        const cancel  = frag.querySelector(".button-cancel");
        this.#currentDialog = frag.firstChild;

        confirm.addEventListener("click", () => { 
            if (onConfirm != null) {
                if (onConfirm(content)) { 
                    this.__closeDialog();  
                }
            }
            else {
                this.__closeDialog();
            }
        });

        cancel.addEventListener("click", () => { 
            if (onCancel != null) {
                onCancel(content);
            }
            this.__closeDialog();
        });

        // Replace the old dialog with the new one or append it as a new dialog.
        if (dialog != null) {
            dialog.replaceWith(frag);
        }
        else {
            wrapper.appendChild(frag);
        }

        this.#currentDialog.showModal();
        return true;
    }

    /**
     * Closes the opened dialog if any.
     */
    __closeDialog() {
        if (this.#currentDialog == null || !this.#currentDialog.open) {
            return;
        }

        this.#currentDialog.close();
        this.#currentDialog = null;
    }
}