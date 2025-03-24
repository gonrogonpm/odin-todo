/**
 * Represents the search menu component, providing static menu items for different search filters (e.g., "Today",
 * "This Week", "All Notes").
 *
 * This class primarily serves as a data source for the search menu UI, providing a static list of menu items that
 * can be rendered by a SearchMenuRenderer. It does not contain any dynamic state or logic beyond providing access
 * to the static menu item data.
 */
export class SearchMenu {
    /**
     * @private
     * @static
     * @readonly
     * @type {object[]}
     *
     * Static array defining the menu items for the search menu. Each item is an object with `id` and `label`
     * properties.
     */
    static #items = [
        { id: "search-all", label: "all" },
        { id: "search-today", label: "today" },
        { id: "search-week", label: "this week" }
    ]

    /**
     * Constructor for the SearchMenu class.
     *
     * @param {object} [config={}] - Configuration object.
     * @param {string} [config.title="search"] - Title of the search menu.
     */
    constructor({ title = "search" } = {}) {
        this.title = title;
    }

    static getType() { return "SearchMenu"; }

    get type() { return SearchMenu.getType(); }

    /**
     * Executes a callback function for each item in the search menu.
     *
     * @param {function} callback - The callback function to execute for each menu item. This function is called
     * with a single argument:
     *  - `item`: An object representing a menu item, with `id` and `label` properties.
     */
    forEachItem(callback) {
        SearchMenu.#items.forEach(item => {
            callback(item);
        });
    }
}