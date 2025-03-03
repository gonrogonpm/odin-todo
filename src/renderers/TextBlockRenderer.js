import { Renderer } from "../Renderer.js";
import { TextBlock } from "../contents/TextBlock.js";

export class TextBlockRenderer extends Renderer {
    getTargetType() {
        return TextBlock.name;
    }

    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const elemText = this.createTextElement(obj);
        context.wrapper.appendChild(elemText);
    }

    createTextElement(obj) {
        const elemText = document.createElement("div");
        elemText.classList.add("text-block");
        elemText.textContent = obj.text;

        return elemText;
    }
}