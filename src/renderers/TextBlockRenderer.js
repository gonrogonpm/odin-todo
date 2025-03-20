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

    render(system, context, textBlock) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const mode    = context.getSettingsParam("mode", "default");
        const partial = context.getSettingsParam("partial");

        if (partial != null) {
            let frag = null;
            switch (partial) {
                case "form": 
                {
                    frag = TextBlockForm(textBlock, { rows:  Math.min(8, Math.max(4, textBlock.lineCount)) });
                }
                break;
            }

            if (frag != null) {
                this.controller.handlePartialRendered(this, textBlock, context, partial, frag);
                context.wrapper.append(frag);
                return;
            }

            console.error(`Invalid partial "${partial}"`);
            return;
        }

        switch (mode) {
            case "new":
            {
                const frag = TextBlockForm(textBlock);
                this.controller.handleObjectRendered(this, textBlock, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;

            case "default":
            default:
            {
                const frag = TextBlockBody(textBlock);
                this.controller.handleObjectRendered(this, textBlock, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;
        }
    }
}