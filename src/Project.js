import { Note } from "./Note.js";
import { nanoid } from "nanoid";

export const DefaultProjectName = "🏠 home";
export const DefaultProjectId   = "home";

export class Project {
    #id = null;

    #order = 0;

    #notes = [];

    static CreateDefaultProject() {
        let project = new Project(DefaultProjectName, DefaultProjectId);
        project.__setOrder(-1);
        return project;
    }

    constructor(name, id = null) {
        this.#id  = id == null ? nanoid() : String(id);
        this.name = name;
    }

    get id() {
        return this.#id;
    }

    get order() {
        return this.#order;
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

    /**
     * Sets the order value of this project.
     *
     * **IMPORTANT: This method is for internal use only within the `Project` class and should be called
     * exclusively by the `Library` class when adding a project to a library.**
     * Calling this method directly from anywhere else can lead to inconsistent data and unexpected behavior.
     *
     * @internal
     * @param {order} order Order value.
     */
    __setOrder(order) {
        this.#order = order;
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
            let last = null;
            item.forEach(value => {
                last = this.#addNoteItem(value);
            });

            return last;
        }
        else {
            return this.#addNoteItem(item);
        }
    }

    #addNoteItem(item) {
        if (!(item instanceof Note)) {
            throw Error("item is not a valid ToDo");
        }

        if (item.project != null) {
            throw Error("item was already added to other project");
        }

        item.__setProject(this);
        this.#notes.push(item);

        return item;
    }

    removeNoteById(id) {
        const index = this.#notes.findIndex(note => note.id === id);
        if (index < 0) {
            return;
        }

        this.removeNote(index);
    }

    removeNote(index) {
        if (index < 0 || index >= this.#notes.length) {
            throw new RangeError("Index out of bounds");
        }

        this.#notes[index].__setProject(null);
        this.#notes.splice(index, 1);
    }

    serialize() {
        return {
            id:    this.#id,
            order: this.#order,
            name:  this.name,
            notes: this.#notes.map(note => note.serialize())
        }
    }

    static deserialize(json) {
        let project = new Project(json.name, json.id);
        project.#order = json.order;

        if (Array.isArray(json.notes)) {
            project.#notes = json.notes.map(item => Note.deserialize(item));
            project.#notes.forEach(note => note.__setProject(project));
        }

        return project;
    }

    save() {
        localStorage.setItem(this.id, JSON.stringify(this.serialize()));
    }

    removeSave() {
        localStorage.removeItem(this.id);
    }

    static load(id) {
        if (!localStorage.key(id)) {
            return null;
        }

        return this.deserialize(JSON.parse(localStorage.getItem(id)));
    }
}