import { Renderer } from "../Renderer.js"
import { Checklist } from "../contents/Checklist.js"

export class ChecklistRenderer extends Renderer {
    static #checkListCounter = 0;

    getTargetType() {
        return Checklist.name;
    }

    render(renderer, context, obj) {
        if (context?.wrapper == null) {
            return;
        }

        context.wrapper.appendChild(this.createList(context, obj));

        ChecklistRenderer.#checkListCounter++;
    }

    createList(context, obj) {
        const list = this.createListBody();        

        for (let i = 0; i < obj.count; i++) {
            list.appendChild(this.createListItem(context, obj.get(i), i, obj.isChecked(i)));
        }

        return list;
    }

    createListBody() {
        const body = document.createElement("ul");
        body.classList.add("checklist");

        return body;
    }

    createListItem(context, item, index, checked) {
        const name     = this.#getChecklistItemName(context.setting, index);
        const listItem = document.createElement("li");
        
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = name;
        input.name = name;

        if (checked) {
            input.checked = true;
        }

        const label = document.createElement("label");
        label.htmlFor = name;
        label.textContent = item;

        listItem.appendChild(input);
        listItem.appendChild(label);

        return listItem;
    }

    #getChecklistItemName(settings, index) {
        let name = null;
        if (settings?.name == null) {
            name = null;
        }
        else {
            name = String(settings.name);
        }

        if (name === null || name.length <= 0) {
            name = `cl-${ChecklistRenderer.#checkListCounter}-${index}`;
        }
        else {
            name = `cl-${name}-${index}`
        }

        return name;
    }
}