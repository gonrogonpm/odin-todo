/**
 * Defines a class to handle all the paremeters about the rendering context of an object.
 */
export class RenderContext {
    /**
     * Wrapper.
     */
    #wrapper = null;

    /**
     * Object with the settings.
     */
    #settings = null;

    /**
     * Constructor.
     * 
     * @param {object} wrapper Wrapper.
     * @param {object} settings Settings.
     */
    constructor(wrapper = null, settings = null) {
        this.setWrapper(wrapper);
        this.setSetting(settings);
    }

    /**
     * Flag indicating whether the context has a wrapper or not.
     */
    get hasWrapper() { return this.wrapper != null; }

    /**
     * Gets the wrapper object.
     */
    get wrapper() { return this.#wrapper; }

    /**
     * Flag indicating whether the context has a settings object or not.
     */
    get hasSettings() { return this.settings != null && typeof this.settings === "object"; }

    /**
     * Gets the settings object.
     */
    get settings() { return this.#settings; }

    /**
     * Sets the wrapper.
     * 
     * @param {object} wrapper Wrapper object to set.
     */
    setWrapper(wrapper) {
        if (typeof wrapper !== "object") {
            throw TypeError("Wrapper must be an object or null");
        }

        this.#wrapper = wrapper;
    }

    /**
     * Sets the settings.
     * 
     * @param {object} settings Settings object to set.
     */
    setSetting(settings) {
        if (typeof settings !== "object") {
            throw TypeError("Settings must be an object or null");
        }

        this.#settings = settings;
    }

    /**
     * Gets a parameter from the settings object.
     * 
     * @param {string} param Parameter to get.
     * @param {*} def Default value to return if the parameter is not found.
     * @returns Value of the parameter.
     */
    getSettingParam(param, def = null) {
        if (!this.hasSettings() || !(def in this.settings)) {
            return def;
        }
        
        return this.#settings[param];
    }

    /**
     * Clones the context with new settings.
     * 
     * Creates a shallow copy of the context appliying a new settings object.
     * 
     * @param {object} settings Settings to set.
     * @returns Clone of the context with the new settings.
     */
    cloneWithNewSettings(settings) {
        return new RenderContext(this.#wrapper, settings);
    }
}