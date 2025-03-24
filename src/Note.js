import { Priority } from "./Priority.js";
import { Content } from "./Content.js"
import { Checklist } from "./contents/Checklist.js";
import { deserializeContent } from "./ContentSerializer.js";
import { nanoid } from "nanoid";
import { parse } from "date-fns";

export class Note {
    #id = null;

    #project = null;

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

    get project() {
        return this.#project;
    }

    get projectId() {
        return this.#project.id;
    }

    /**
     * Sets the project for this note.
     *
     * **IMPORTANT: This method is for internal use only within the `Note` class and should be called
     * exclusively by the `Project` class when adding a note to a project.**
     * Calling this method directly from anywhere else can lead to inconsistent data and unexpected behavior.
     *
     * @internal
     * @param {Project} project The project to which this note belongs.
     */
    __setProject(project) {
        this.#project = project;
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

    /**
     * Adds content to the note, accepting single items or arrays.
     * 
     * @param {Content|Content[]} item - Content to add.
     * @returns {?Content} Last added content or null if an empty array is provided.
     * @throws {Error} If content is invalid or already belongs to another note.
     * @example
     * // Add single content
     * note.addContent(new TextBlock("Hello"));
     * 
     * // Add multiple contents
     * note.addContent([new TextBlock("Hello"), new TextBlock("World!")]);
     */
    addContent(item) {
        if (Array.isArray(item)) {
            let last = null;
            item.forEach(value => {
                last = this.addContent(value);
            });

            return last;
        }
        else {
            return this.#addContentItem(item);
        }
    }

    /**
     * Internal method to add a single content item (includes validation).
     * 
     * @private
     * @param {Content} item - Content item to add.
     * @returns {Content} Added content.
     * @throws {Error} If item is not a Content instance.
     * @throws {Error} If item is already part of another note.
     */
    #addContentItem(item) {
        if (!(item instanceof Content)) {
            throw Error("item is not a valid content");
        }

        if (item.note != null) {
            throw Error("item is already part of another note");
        }

        item.__setNote(this);
        this.#contents.push(item);

        return item;
    }

    removeContentById(id) {
        const index = this.#contents.findIndex(content => content.id === id);
        if (index < 0) {
            return;
        }

        this.removeContent(index);
    }

    removeContent(index) {
        if (index < 0 || index >= this.#contents.length) {
            throw new RangeError("Index out of bounds");
        }

        this.#contents[index].__setNote(null);
        this.#contents.splice(index, 1);
    }

    hasChecklists() {
        for (let i = 0; i < this.#contents.length; i++) {
            if (this.#contents[i] instanceof Checklist) {
                return true;
            }
        }

        return false;
    }

    getChecklistsCompletion() {
        let total     = 0;
        let completed = 0;

        this.#contents.forEach(content => {
            if (!(content instanceof Checklist)) {
                return;
            }

            total     += content.count;
            completed += content.completed;
        });

        return { total: total, completed: completed };
    }

    serialize() {
        return {
            id:          this.#id,
            title:       this.title,
            description: this.description,
            priority:    this.priority,
            dueDate:     this.#dueDate,
            done:        this.#done,
            contents:    this.#contents.map(content => content.serialize()),
        }
    }

    static deserialize(json) {
        let note = new Note({
            title:       json.title,
            description: json.description,
            priority:    json.priority,
        })

        note.#id      = json.id;
        note.#done    = json.done;
        note.#dueDate = json.dueDate;

        if (Array.isArray(json.contents)) {
            note.#contents = json.contents.map(item => deserializeContent(item)).filter(content => content !== null);
            note.#contents.forEach(content => content.__setNote(note));
        }

        return note;
    }

    save() {
        if (this.#project == null) {
            return;
        }
        
        this.#project.save();
    }
}