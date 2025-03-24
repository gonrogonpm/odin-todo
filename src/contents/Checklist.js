import { Content } from "../Content.js";

class CheckListItem {
    constructor(id, text, checked = false) {
        this.id      = id;
        this.text    = text;
        this.checked = checked;
    }

    setChecked(checked) {
        this.checked = Boolean(checked);
    }
}

export class Checklist extends Content {
    #items = [];

    #nextId = 0;

    constructor(items = null, id = null) {
        super(id);
        
        if (items !== null) {
            this.add(items);
        }
    }

    static getType() { return "Checklist"; }

    get type() { return Checklist.getType(); }

    get count() {
        return this.#items.length;
    }

    get completed() {
        return this.#items.reduce((accum, current) => {
            return accum + (current.checked ? 1 : 0)
        }, 0);
    }

    getById(id) {
        const index = this.#items.findIndex(item => item.id == id);
        if (index < 0) {
            return undefined;
        }

        return this.get(index);
    }

    get(index) {
        if (typeof index !== "number") {
            throw TypeError("index must be a number");
        }
        
        return Object.assign({}, this.#getItem(index));
    }

    setCheckedById(id, checked) {
        const item = this.#getItemById(id);
        if (item == null) {
            return;
        }

        item.checked = checked;
    }

    setTextById(id, value) {
        if (value === null || value === undefined || value instanceof Object || Array.isArray(value)) {
            throw Error("Invalid value");
        }
        
        const item = this.#getItemById(id);
        if (item == null) {
            return;
        }

        item.text = String(value);
    }

    #getItemById(id) {
        const index = this.#items.findIndex(item => item.id == id);
        if (index < 0) {
            return undefined;
        }

        return this.#items[index];
    }

    #getItem(index) {
        if (index < 0 || index >= this.#items.length) {
            throw RangeError("Invalid index");
        }

        return this.#items[index];
    }

    /**
     * Adds one or multiple items and returns the ID of the last added item.
     * 
     * @param {string|Object|Array<string|Object>} item Item(s) to add:
     *   - **String**: Treated as item's text (`checked` defaults to `false`).
     *   - **Object**: Must contain `text` (string), `checked` is optional (default: `false`).
     *   - **Array**: Adds all items recursively.
     * @returns {number} ID of the last added item.
     * @throws {Error} If:
     *   - `item` is an object without `text` property.
     *   - `text` is invalid (null, undefined, object, or array) via `#addItem`.
     * @example
     * // Add a single item via string
     * const id1 = list.add("Buy milk");
     * 
     * // Add an object item
     * const id2 = list.add({ text: "Debug code", checked: true });
     * 
     * // Add multiple items
     * const lastId = list.add(["Task 1", { text: "Task 2" }]);
     */
    add(item) {
        if (Array.isArray(item)) {
            let id = undefined;
            item.forEach(obj => {
                id = this.add(obj);
            });

            return id;
        }
        else if (typeof item === "object") {
            if (!item.text) {
                throw Error("Text property is not defined in object");
            }

            return this.#addItem(item.text, item.checked);
        }
        else if (typeof item === "string") {
            return this.#addItem(item);
        }
    }

    /**
     * Adds a new item and returns its identifier.
     * 
     * @param {string} text Text content for the item.
     * @param {boolean} [checked=false] Indicates whether the item is checked or not.
     * @returns {number} Numeric identifier of the newly added item.
     * @throws {Error} `text` is `null`, `undefined`, an object, or an array.
     */
    #addItem(text, checked = false) {
        if (text === null || text === undefined || text instanceof Object || Array.isArray(text)) {
            throw Error("Invalid value");
        }

               this.#items.push(new CheckListItem(this.#nextId++, String(text), checked));
        return this.#items.at(-1).id;
    }

    removeById(id) {
        const index = this.#items.findIndex(item => item.id == id);
        if (index < 0) {
            return;
        }

        this.#items.splice(index, 1);
    }

    serialize() {
        return {
            ...super.serialize(),
            items:  this.#items,
            nextId: this.#nextId,
        };
    }

    static deserialize(json) {
        let checklist = new Checklist(null, json.id);
        checklist.#nextId = json.nextId;

        if (Array.isArray(json.items)) {
            checklist.#items = json.items.map(item => new CheckListItem(item.id, item.text, item.checked));
        }

        return checklist;
    }
}