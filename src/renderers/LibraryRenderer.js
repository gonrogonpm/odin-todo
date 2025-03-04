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
                    const id = this.#getSettingsId(context);
                    if (id == null) {
                        console.error("No project id");
                        return;
                    }

                    system.renderAppend(obj.getProjectById(id), context.cloneWithNewSettings(context.settings.settings));
                }
                break;
                
                case "note": {
                    const ids = this.#getSettingsIdPair(context);
                    if (ids == null) {
                        console.error("No project or note id");
                        return;
                    }

                    system.renderAppend(obj.getProjectNoteById(ids[0], ids[1]), context.cloneWithNewSettings(context.settings.settings));
                }
                break;
            }
        }
        else {
            context.wrapper.appendChild(this.createList(system, context, obj));
        }
    }

    createList(system, context, obj) {
        const frag = document.createDocumentFragment();

        const header = this.createListHeader(context);
        if (header != null) {
            frag.appendChild(header);
        }

        const body = this.createListBody();
        for (let i = 0; i < obj.count; i++) {
            body.appendChild(this.createListItem(obj.getProject(i), i));
        }
        frag.append(body);

        return frag;
    }

    createListHeader(context) {
        if (context.settings?.title == null) {
            return null;
        }

        const header = document.createElement("h2");
        header.textContent = context.settings.title;

        return header;
    }

    createListBody() {
        const elemList = document.createElement("ul");
        elemList.classList.add("project-list");
        
        return elemList;
    }

    createListItem(project, index) {
        const elemItem = document.createElement("li");
        elemItem.appendChild(this.createButton(project, index));

        return elemItem;
    }

    createButton(project, index) {
        const button = document.createElement("button");
        button.textContent = project.name;
        button.dataset.index = index;
        button.dataset.id = project.id;

        return button;
    }

    #getSettingsId(context) {
        const id = context.getSettingsParam("id");
        if (id == null) {
            return null;
        }

        if (Array.isArray(id)) {
            return String(id[0]);
        }
        
        return String(id);
    }

    #getSettingsIdPair(context) {
        const id = context.getSettingsParam("index");
        if (id == null) {
            return null;
        }

        if (!Array.isArray(id) || id.length < 2) {
            return null;
        }

        return [String(id[0]), String(id[1])];
    }
}