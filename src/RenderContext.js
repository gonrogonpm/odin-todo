export class RenderContext {
    constructor(wrapper, settings = null) {
        this.wrapper  = wrapper;
        this.settings = settings;
    }

    get hasWrapper() {
        return this.wrapper !== undefined && this.wrapper !== null;
    }

    get hasSettings() {
        return this.settings !== undefined && this.settings !== null;
    }

    cloneWithNewSettings(settings) {
        let context = new RenderContext(this.wrapper, settings ?? null);
        return context;
    }
}