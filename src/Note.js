import { Content } from "./Content.js"
import { Priority } from "./Priority.js";
import { nanoid } from "nanoid";
import { parse } from "date-fns";

export class Note {
    #id = null;

    #projectId = null;

    #done = false;

    #dueDate = null;

    #contents = [];

    constructor({id = null, title = "", description = "", done = false, dueDate = null, priority = Priority.Medium, contents = []} = {}) {
        this.title       = title;
        this.description = description;
        this.priority    = priority;
        this.#id         = id == null ? nanoid() : String(id);
        this.#done       = Boolean(done);
        this.#contents   = contents;

        this.setDueDate(dueDate);
    }

    get id() {
        return this.#id;
    }

    get projectId() {
        return this.#projectId;
    }

    /**
     * Sets the project ID for this note.
     *
     * **IMPORTANT: This method is for internal use only within the `Note` class and should be called
     * exclusively by the `Project` class when adding a note to a project.**
     * Calling this method directly from anywhere else can lead to inconsistent data and unexpected behavior.
     *
     * @internal
     * @param {string} projectId The ID of the project to which this note belongs.
     */
    __setProjectId(projectId) {
        this.#projectId = projectId;
    }

    get isDone() {
        return this.#done === true;
    }

    toggleDone() {
        this.#done = !this.#done;
    }

    get dueDate() {
        return this.#dueDate;
    }

    setDueDate(dueDate) {
        if (typeof dueDate === "object" && dueDate instanceof Date) {
            dueDate.setMilliseconds(0);
            dueDate.setSeconds(0);
            this.#dueDate = dueDate.toISOString();
            return;
        }

        if (typeof dueDate === "string") {
            this.#setDueDateFromString(dueDate);
            return;
        }

        if (dueDate === null) {
            this.#dueDate = null;
            return;
        }

        throw TypeError("Due date must be Date, string or null");
    }

    #setDueDateFromString(dueDate) {
        if (typeof dueDate !== "string") {
            throw TypeError("Due date must be a string");
        }
        // Try to parse the accepted string formats.
        let result = parse(dueDate, "yyyy-MM-dd'T'HH:mm", new Date()); 
        if (isNaN(result)) { 
            result = parse(dueDate, "yyyy-MM-dd' 'HH:mm", new Date());  
        }
        if (isNaN(result)) { 
            result = parse(dueDate, "yyyy-MM-dd", new Date());
            result.setHours(23);
            result.setMinutes(59);
            result.setSeconds(0);
        }
        // A valid format was not found.
        if (isNaN(result)) {
            console.log("Invalid date format");
            return;
        }
        
        result.setSeconds(0);
        result.setMilliseconds(0);
        this.#dueDate = result.toISOString();
    }

    get hasContent() {
        return this.#contents.length > 0;
    }

    get contentCount() {
        return this.#contents.length;
    }

    getContent(index) {
        if (index < 0 || index >= this.#contents.length) {
            throw RangeError("Index out of bounds");
        }

        return this.#contents[index];
    }

    forEachContent(callback) {
        this.#contents.forEach(callback);
    }

    addContent(item) {
        if (Array.isArray(item)) {
            item.forEach(value => {
                this.#addContentItem(value);
            });
        }
        else {
            this.#addContentItem(item);
        }
    }

    #addContentItem(item) {
        if (!(item instanceof Content)) {
            throw Error("item is not a valid content");
        }

        this.#contents.push(item);
    }
}