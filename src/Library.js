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

    removeProjectNoteById(projectId, noteId) {
        this.getProjectById(projectId)?.removeNoteById(noteId);
    }
}