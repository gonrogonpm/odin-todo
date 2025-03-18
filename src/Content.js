import { nanoid } from "nanoid";

export class Content {
    #id = null;

    #note = null;

    constructor({id = null} = {}) {
        this.#id = id == null ? nanoid() : String(id);
    }

    get id() {
        return this.#id;
    }

    get note() {
        return this.#note;
    }

    /**
     * Sets the note for this content.
     *
     * **IMPORTANT: This method is for internal use only within the `Content` class and should be called
     * exclusively by the `Note` class when adding a content to a note.**
     * Calling this method directly from anywhere else can lead to inconsistent data and unexpected behavior.
     *
     * @internal
     * @param {Note} note The note to which this note belongs.
     */
    __setNote(note) {
        this.#note = note;
    }
}