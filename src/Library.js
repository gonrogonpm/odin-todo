import { Project } from "./Project.js";

export class Library {
    #projects = [];

    constructor() {
    }

    get count() {
        return this.#projects.length;
    }

    get(index) {
        return this.#projects[index];
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
        if (!(item instanceof Project)) {
            throw Error("item is not a valid project");
        }

        this.#projects.push(item);
    }

    remove(index) {
        this.#projects.splice(index, 1);
    }
}