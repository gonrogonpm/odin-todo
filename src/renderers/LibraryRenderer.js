import { Renderer } from "../Renderer.js";
import { Library } from "../Library.js";

export class LibraryRenderer extends Renderer {
    getTargetType() {
        return Library.name;
    }

    render(system, context, obj) {
        if (context?.wrapper == null) {
            return;
        }

        if (context.settings?.mode != null) {
            switch (context.settings.mode) {
                case "project": {
                    const projIndex = this.#getSettingsIndex(context.settings);
                    
                    if (isNaN(projIndex)) {
                        console.error("No project index");
                        return;
                    }

                    system.render(obj.get(projIndex), context.cloneWithNewSettings(context.settings.settings));
                }
                break;
                
                case "note": {
                    const [projIndex, noteIndex] = this.#getSettingsIndexPair(context.settings);

                    if (isNaN(projIndex)) {
                        console.error("No project index");
                        return;
                    }

                    if (isNaN(noteIndex)) {
                        console.error("No note index");
                        return;
                    }

                    system.render(obj.get(projIndex).get(noteIndex), context.cloneWithNewSettings(context.settings.settings));
                }
                break;
            }
        }
        else {
            context.wrapper.appendChild(this.createList(system, context, obj));
        }
    }

    createList(system, context, obj) {
        const list = this.createListBody();

        for (let i = 0; i < obj.count; i++) {
            list.appendChild(this.createListItem(obj.get(i)));
        }

        return list;
    }

    createListBody() {
        const elemList = document.createElement("ul");
        elemList.classList.add("project-list");
        
        return elemList;
    }

    createListItem(project) {
        const elemItem = document.createElement("li");
        elemItem.appendChild(this.createButton(project));

        return elemItem;
    }

    createButton(project) {
        const button = document.createElement("button");
        button.textContent = project.name;

        return button;
    }

    #getSettingsIndex(settings) {
        if (settings?.index == null) {
            return NaN;
        }

        if (Array.isArray(settings.index)) {
            return Number(settings.index[0]);
        } else {
            return Number(settings.index);
        }
    }

    #getSettingsIndexPair(settings) {
        if (settings?.index == null || !Array.isArray(settings.index)) {
            return [NaN, NaN];
        }

        return [
            Number(settings.index[0]),
            Number(settings.index[1])
        ];
    }
}