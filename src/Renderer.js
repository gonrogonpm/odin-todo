export class Renderer {
    /**
     * Get the type of the objects compatible with this renderer processor.
     * 
     * @returns string Type
     */
    getTargetType() {
        throw Error("Not implemented");
    }

    /**
     * Renders an object.
     * 
     * @param {RenderSystem} renderer Renderer.
     * @param {RenderContext} context Renderer context.
     * @param {*} obj Object to render.
     */
    render(renderer, context, obj) {}
}