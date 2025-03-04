import { Project } from "./Project.js";

export class Library {
    #projects = [];

    constructor() {
    }

    get count() {
        return this.#projects.length;
    }

    getProject(index) {
        return this.#projects[index];
    }

    getProjectById(id) {
        return this.#projects.find(project => project.id === id);
    }

    getProjectNoteById(projectId, noteId) {
        return this.getById(projectId)?.getById(noteId);
    }

    addProject(item) {
        if (Array.isArray(item)) {
            item.forEach(value => {
                this.#addProjectItem(value);
            });
        }
        else {
            this.#addProjectItem(item);
        }
    }

    #addProjectItem(item) {
        if (!(item instanceof Project)) {
            throw Error("item is not a valid project");
        }

        this.#projects.push(item);
    }

    removeProject(index) {
        this.#projects.splice(index, 1);
    }
}