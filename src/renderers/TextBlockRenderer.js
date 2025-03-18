import { Renderer } from "../Renderer.js";
import { TextBlock } from "../contents/TextBlock.js";
import { TextBlockBody, TextBlockForm } from "./templates/TextBlock.js";

export class TextBlockRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }

    getTargetType() {
        return TextBlock.name;
    }

    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const mode = context.getSettingsParam("mode", "default");
        switch (mode) {
            case "new":
            {
                const frag = TextBlockForm(obj);
                this.controller.handleObjectRendered(this, obj, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;

            case "default":
            default:
            {
                const frag = TextBlockBody(obj);
                this.controller.handleObjectRendered(this, obj, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;
        }
    }
}