import { RenderContext } from "./RenderContext.js";
import { Renderer } from "./Renderer.js";

export class RenderSystem {
    #renderers = [];

    /**
     * Add a renderer processor.
     * 
     * @param {Renderer} processor Processor to add.
     */
    addProcessor(processor) {
        this.#renderers.push(processor);
    }

    renderReplaceChildren(obj, context) {
        const fragContext = new RenderContext(
            document.createDocumentFragment(),
            context.settings
        );
        /* Render the obj inside a document fragment. */
        this.renderAppend(obj, fragContext);
        /* Render the fragment replacing the children in the wrapper. */
        context.wrapper.replaceChildren(fragContext.wrapper);
    }

    renderAppend(obj, context) {
        if (obj === undefined || obj === null || typeof obj !== "object") {
            return;
        }

        const type = obj.constructor.name;

        this.#renderers.forEach(renderer => {
            if (renderer.getTargetType() === type) {
                return renderer.render(this, context, obj);
            }
        });
    }

    
}