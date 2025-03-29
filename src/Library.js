import { Project, DefaultProjectId } from "./Project.js";
import { AppPrefix, AppKey } from "./AppSerializer.js";

export class Library {
    #projects = [];

    #nextOrder = 0;

    constructor() {}

    static getType() { return "Library"; }

    get type() { return Library.getType(); }

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
            if (key === `${AppPrefix}-${AppKey}`) {
                continue;
            }
            // Default project is always in the project list, replace it with a new version.
            if (key === `${AppPrefix}-${DefaultProjectId}`) {
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
    }

    /**
     * Migrates legacy localStorage entries to the new namespaced format
     * 
     * Background:
     * - Our app previously stored data without namespace prefixes, causing collisions with other apps on the
     *   same domain.
     * - New storage system uses 'AppPrefix' for all keys.
     * 
     * Migration Process:
     * 1. Scans entire localStorage for legacy entries (non-prefixed keys).
     * 2. Validates each entry matches our expected project format:
     *    - Minimum JSON length requirement.
     *    - Specific JSON structure (starts with '{"id":"', ends with ']}').
     *    - Contains required fields (id, order, name, notes).
     * 3. Migrates valid entries to new format: 'AppPrefix-{id}'.
     * 
     * Safety Features:
     * - Skips already migrated entries (keys starting with AppPrefix).
     * - Preserves original data format during migration.
     * - Comprehensive validation prevents corrupt data migration.
     * - Detailed warning logs for skipped entries.
     * 
     * Note: This should be called ONCE during app load.
     * 
     * @example
     * // Before: '123' => '{"id":"123",...}'
     * // After: 'thortodo-123' => '{"id":"123",...}'
     */
    static migrate() {
        const MinJsonLen = 60;
        const projectsToMigrate = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(AppPrefix) || key.startsWith(AppKey)) {
                continue;
            }

            let str = localStorage.getItem(key);
            if (str.length < MinJsonLen) {
                continue;
            }

            if (str.slice(0, 7) !== '{"id":"') {
                continue;
            }
    
            if (str.slice(-2, str.length) !== ']}') {
                continue;
            }
    
            let json;
            try {
                json = JSON.parse(str);
            }
            catch (error) {
                console.warn(`Failed to migrate localStorage entry for key ${key}, invalid data`);
                continue;
            }
    
            if (!("id" in json) || !("order" in json) || !("name" in json) || !("notes" in json)) {
                console.warn(`Failed to migrate localStorage entry for key ${key}, invalid object`);
                continue;
            }

            projectsToMigrate.push({ key: key, id: json.id, str: str });
        }

        projectsToMigrate.forEach(item => {
            localStorage.removeItem(item.key);
            localStorage.setItem(`${AppPrefix}-${item.id}`, item.str);
        })
    }
}