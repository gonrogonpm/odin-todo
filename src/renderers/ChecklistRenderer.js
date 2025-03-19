import { Renderer } from "../Renderer.js"
import { Checklist } from "../contents/Checklist.js"
import { ChecklistBody, ChecklistItem, ChecklistItemForm, ChecklistItemText } from "./templates/Checklist.js";

export class ChecklistRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }

    getTargetType() {
        return Checklist.name;
    }

    render(renderer, context, checklist) {
        if (context?.wrapper == null) {
            return;
        }

        const mode    = context.getSettingsParam("mode", "default");
        const partial = context.getSettingsParam("partial");
        const id = context.getSettingsParam("id");

        if (partial != null)
        {
            // Some partials required a valid item identifier.
            if (partial !== "new" && id === null) {
                console.error("Invalid item id");
                return;
            }

            let frag = null;
            switch (partial) {
                case "new":       frag = this.createNewItem(context, checklist); break;
                case "item":      frag = this.createItem(context, checklist, id); break;
                case "item-text": frag = ChecklistItemText(checklist.getById(id)); break;
                case "item-form": frag = ChecklistItemForm(checklist.getById(id)); break;
            }

            if (frag != null) {
                this.controller.handlePartialRendered(this, checklist, context, partial, frag);
                context.wrapper.append(frag);
                return;
            }

            console.error(`Invalid partial "${partial}"`);
            return;
        }

        switch (mode) {
            case "default":
            default:
            {
                const frag = this.createList(checklist);
                this.controller.handleObjectRendered(this, checklist, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;
        }
    }

    createList(checklist) {
        return ChecklistBody(checklist, { name: checklist.id })
    }

    createNewItem(context, checklist) {
        context.settings.editform = true;
        context.settings.listitem = true;
        context.settings.noremove = true;

        return this.createItem(context, checklist, null);
    }

    createItem(context, checklist, id) {
        let settings = { name: checklist.id };

        if (context.getSettingsParam("editform", false)) { settings.editform = true; }
        if (context.getSettingsParam("listitem", false)) { settings.listitem = true; }
        if (context.getSettingsParam("noremove", false)) { settings.noremove = true; }

        let item;
        if (id == null) {
            item = { id: -1, text: "", checked: false };
        }
        else {
            item = checklist.getById(id);
        }

        return ChecklistItem(item, settings);
    }
}