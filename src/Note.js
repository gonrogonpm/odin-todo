import { Content } from "./Content.js"
import { Priority } from "./Priority.js";
import { nanoid } from "nanoid";

export class Note {
    constructor({title = "", description = "", dueDate = null, priority = Priority.Medium, contents = []} = {}) {
        this.id          = nanoid();
        this.title       = title;
        this.description = description;
        this.dueDate     = dueDate;
        this.priority    = priority;
        this.contents    = contents;
    }

    add(item) {
        if (Array.isArray(item)) {
            item.forEach(value => {
                this.#addItem(value);
            });
        }
        else {
            this.#addItem(item);
        }
    }

    #addItem(item) {
        if (!(item instanceof Content)) {
            throw Error("item is not a valid content");
        }

        this.contents.push(item);
    }
}