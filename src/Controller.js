export class Controller {
    constructor(app) {
        this.app = app;
    }
    
    /**
     * Handles full object rendering events.
     *
     * @param {Renderer} renderer The renderer that triggered the event.
     * @param {*} target The target object that was rendered.
     * @param {RenderContext} context The rendering context.
     * @param {*} result The result of the rendering operation.
     */
    handleObjectRendered(renderer, target, context, result) {}

    /**
     * Handles partial rendering events.
     *
     * @param {Renderer} renderer The renderer that triggered the event.
     * @param {*} target The target object that was rendered.
     * @param {RenderContext} context The rendering context.
     * @param {string} partial The partial that was rendered.
     * @param {*} result The result of the rendering operation.
     */
    handlePartialRendered(renderer, target, context, partial, result) {}
}