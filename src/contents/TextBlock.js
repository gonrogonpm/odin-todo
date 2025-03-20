import { Content } from "../Content.js";
import { countLines } from "../Utils.js";

export class TextBlock extends Content {
    constructor(text = "") {
        super();
        this.text = text;
    }

    get lineCount() {
        countLines(this.text);
    }
}