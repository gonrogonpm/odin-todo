import { Project } from "./Project.js";

export class Library {
    #projects = [];

    constructor() {}

    get hasProjects() {
        return this.#projects.length > 0;
    }

    get projectCount() {
        return this.#projects.length;
    }

    getProject(index) {
        return this.#projects[index];
    }

    getProjectById(id) {
        return this.#projects.find(project => project.id === id);
    }

    forEachProject(callback) {
        this.#projects.forEach(callback);
    }

    /**
     * Adds project to the note, accepting single items or arrays.
     * 
     * @param {Project|Project[]} item - Project to add.
     * @returns {?Project} Last added project or null if an empty array is provided.
     * @throws {Error} If project is invalid.
     */
    addProject(item) {
        if (Array.isArray(item)) {
            let last = null;
            item.forEach(value => {
                last = this.#addProjectItem(value);
            });

            return last;
        }
        else {
            return this.#addProjectItem(item);
        }
    }

    #addProjectItem(item) {
        if (!(item instanceof Project)) {
            throw Error("item is not a valid project");
        }

        this.#projects.push(item);
        return item;
    }

    removeProjectById(id) {
        const index = this.#projects.findIndex(project => project.id === id);
        if (index < 0) {
            return;
        }

        this.removeProject(index);
    }

    removeProject(index) {
        if (index < 0 || index >= this.#projects.length) {
            throw new RangeError("Index out of bounds");
        }

        if (this.#projects[index].isDefaultProject) {
            console.error("Default project can not be removed");
            return;
        }

        this.#projects.splice(index, 1);
    }

    getProjectNoteById(projectId, noteId) {
        return this.getProjectById(projectId)?.getNoteById(noteId);
    }

    forEachProjectNote(callback) {
        this.forEachProject(project => {
            project.forEachNote(note => {
                callback(project, note);
            })
        });
    }

    removeProjectNoteById(projectId, noteId) {
        this.getProjectById(projectId)?.removeNoteById(noteId);
    }
}