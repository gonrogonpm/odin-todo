import { Note } from "./Note.js";
import { nanoid } from "nanoid";

export class Project {
    #notes = [];

    constructor(name) {
        this.id   = nanoid();
        this.name = name;
    }

    get count() {
        return this.#notes.length;
    }

    get(index) {
        return this.#notes[index];
    }

    getById(id) {
        return this.#notes.find(note => note.id === id);
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

    remove(index) {
        this.#notes.splice(index, 1);
    }

    #addItem(item) {
        if (!(item instanceof Note)) {
            throw Error("item is not a valid ToDo");
        }

        this.#notes.push(item);
    }
}