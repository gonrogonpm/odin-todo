import { Note } from "./Note.js";
import { nanoid } from "nanoid";

export const DefaultProjectName = "🏠 home";
export const DefaultProjectId   = "home";

export class Project {
    #notes = [];

    static CreateDefaultProject() {
        return new Project(DefaultProjectName, DefaultProjectId);
    }

    constructor(name, id = null) {
        this.id   = id == null ? nanoid() : id;
        this.name = name;
    }

    get isDefaultProject() {
        return this.id === DefaultProjectId;
    }

    get hasNotes() {
        return this.#notes.length > 0;
    }

    get noteCount() {
        return this.#notes.length;
    }

    getNoteById(id) {
        return this.#notes.find(note => note.id === id);
    }

    getNote(index) {
        return this.#notes[index];
    }

    forEachNote(callback) {
        this.#notes.forEach(callback);
    }

    addNote(item) {
        if (Array.isArray(item)) {
            item.forEach(value => {
                this.#addNoteItem(value);
            });
        }
        else {
            this.#addNoteItem(item);
        }
    }

    #addNoteItem(item) {
        if (!(item instanceof Note)) {
            throw Error("item is not a valid ToDo");
        }

        if (item.projectId != null) {
            throw Error("item was already added to other project");
        }

        item.__setProjectId(this.id);
        this.#notes.push(item);
    }

    removeNoteById(id) {
        const index = this.#notes.findIndex(note => note.id === id);
        if (index < 0) {
            return;
        }

        this.remove(index);
    }

    removeNote(index) {
        if (index < 0 || index >= this.#notes.length) {
            throw new RangeError("Index out of bounds");
        }

        this.#notes.splice(index, 1);
    }
}