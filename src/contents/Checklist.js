import { Content } from "../Content.js";

class CheckListItem {
    constructor(text, checked = false) {
        this.text    = text;
        this.checked = checked;
    }

    setChecked(checked) {
        this.checked = Boolean(checked);
    }
}

export class Checklist extends Content {
    #items = [];

    constructor(items = null) {
        super();
        
        if (items !== null) {
            this.add(items);
        }
    }

    get count() {
        return this.#items.length;
    }

    isChecked(index) {
        return this.#getItem(index).checked;
    }

    setChecked(index, checked) {
        return this.#getItem(index).setChecked(checked);
    }

    get(index) {
        return this.#getItem(index).text;
    }

    add(item) {
        if (Array.isArray(item)) {
            item.forEach(value => {
                this.#addItem(value);
            })
        }
        else {
            this.#addItem(item);
        }
    }

    #getItem(index) {
        if (index < 0 || index >= this.#items.length) {
            throw RangeError("Invalid index");
        }

        return this.#items[index];
    }

    #addItem(value) {
        if (value === null || value === undefined || value instanceof Object || Array.isArray(value)) {
            throw Error("Invalid value");
        }

        this.#items.push(new CheckListItem(String(value)));
    }
}