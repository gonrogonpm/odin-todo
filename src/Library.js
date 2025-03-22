import { Project, DefaultProjectId } from "./Project.js";
import { AppKey } from "./AppSerializer.js";

export class Library {
    #projects = [];

    #nextOrder = 0;

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

    getDefaultProject() {
        return this.getProjectById(DefaultProjectId);
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
        // Only order values less than zero are keep as a custom order value.
        if (item.order == null || item.order >= 0) {
            item.__setOrder(this.#nextOrder++);
        }

        this.#projects.push(item);
        return item;
    }

    removeProjectById(id, force = false) {
        const index = this.#projects.findIndex(project => project.id === id);
        if (index < 0) {
            return;
        }

        this.removeProject(index, force);
    }

    removeProject(index, force = false) {
        if (index < 0 || index >= this.#projects.length) {
            throw new RangeError("Index out of bounds");
        }

        if (this.#projects[index].isDefaultProject && !force) {
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

    save() {
        this.forEachProject(project => {
            project.save();
        });
    }

    load() {
        const defaultProject = this.getProjectById(DefaultProjectId);
        this.#projects = [defaultProject];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === AppKey) {
                continue;
            }
            // Default project is always in the project list, replace it with a new version.
            if (key === DefaultProjectId) {
                this.removeProjectById(DefaultProjectId, true);
            }

            const project = Project.load(key);
            if (project != null) {
                this.#projects.push(project);
            }
        }
        // Set the next order value as the biggest order in the array plus one.
        this.#nextOrder = 1 + this.#projects.reduce((accumulator, current) => 
            accumulator >= current.order ? accumulator : current.order, 
        0);
        this.#nextOrder = Math.max(0, this.#nextOrder);
        // Sort the array to keep the original order.
        this.#projects.sort((a, b) => {
            if (a.order < b.order) {
                return -1;
            }

            if (a.order > b.order) {
                return  1;
            }

            return NaN;
        });

        console.dir(this.#projects);
    }
}