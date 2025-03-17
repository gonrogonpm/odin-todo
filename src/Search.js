import { Library } from "./Library.js";
import { compareAsc } from "date-fns";

/**
 * Represents a search filter for notes based on a date range.
 */
export class Search {
    #begDate = null;
    #endDate = null;

    /**
     * Constructor for the Search class.
     *
     * @param {object} [config={}] - Configuration object.
     * @param {string} [config.title=""] - Title of the search filter.
     * @param {Date|null} [config.begDate=null] - Start date of the search range.
     * @param {Date|null} [config.endDate=null] - End date of the search range.
     *
     * @throws {TypeError} If `begDate` or `endDate` are not valid Date objects or null.
     */
    constructor({title = "", begDate = null, endDate = null} = {})
    {
        if (begDate !== null && !(begDate instanceof Date)) {
            throw new TypeError("begDate must be a Date object or null");
        }

        if (endDate !== null && !(endDate instanceof Date)) {
            throw new TypeError("endDate must be a Date object or null");
        }

        this.title    = title;
        // Clone the input dates to avoid an external mutation of the dates.
        this.#begDate = begDate ? new Date(begDate) : null;
        this.#endDate = endDate ? new Date(endDate) : null;
        // Normalize the hours.
        this.#begDate?.setHours( 0,  0,  0, 0);
        this.#endDate?.setHours(23, 59, 59, 0);
    }

    /**
     * Get all the notes from the library that pass the search filter
     * 
     * @param {Library} library The library to search within.
     * @returns {Note[]} An array of Note objects that match the search criteria.
     */
    getAll(library) {
        const result = [];

        library.forEachProjectNote((project, note) => {
            if (this.#testNote(note)) {
                result.push(note);
            }
        });

        return result;
    }

    /**
     * Tests if a given note passes the search filter (falls within the date range).
     *
     * @private
     * @param {Note} note The note to test.
     * @returns {boolean} True if the note passes the filter, false otherwise.
     */
    #testNote(note) {
        if (note == null) {
            return false;
        }

        const dueDate  = new Date(note.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (this.#begDate != null) {
            if (compareAsc(dueDate, this.#begDate) < 0) { 
                return false;
            }
        }

        if (this.#endDate != null) {
            if (compareAsc(dueDate, this.#endDate) > 0) {
                return false;
            }
        }

        return true;
    }
}