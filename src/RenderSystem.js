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

    render(obj, context) {
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