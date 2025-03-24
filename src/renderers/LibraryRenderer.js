import { Renderer } from "../Renderer.js";
import { Library } from "../Library.js";
import * as Common from "./templates/Common.js"
import { LibraryProjectList, LibraryAddProjectDialog } from "./templates/Library.js"

export class LibraryRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }

    getTargetType() {
        return Library.getType();
    }

    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const mode = context.getSettingsParam("mode", "list");

        switch (mode) {
            case "project": {
                const id = this.#getSettingsId(context);
                if (id == null) {
                    console.error("No project id");
                    return;
                }

                if (context.settings.settings == null) {
                    context.settings.settings = { mode: "list" };
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

            case "list":
            default:
            {
                const frag = this.createList(system, context, obj);
                this.controller.handleObjectRendered(this, obj, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;
        }
    }

    createList(system, context, obj) {
        let settings = { title: "projects" };

        const id = context.getSettingsParam("id");
        if (id != null) {
            settings.id = id;
        }

        return LibraryProjectList(obj, settings);
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
        const id = context.getSettingsParam("id");
        if (id == null) {
            return null;
        }

        if (!Array.isArray(id) || id.length < 2) {
            return null;
        }

        return [String(id[0]), String(id[1])];
    }
}