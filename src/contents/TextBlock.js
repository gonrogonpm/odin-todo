import { Content } from "../Content.js";
import { countLines } from "../Utils.js";

export class TextBlock extends Content {
    constructor(text = "", id = null) {
        super(id);
        this.text = text;
    }

    static getType() { return "TextBlock"; }

    get type() { return TextBlock.getType(); }

    get lineCount() {
        countLines(this.text);
    }

    serialize() {
        return {
            ...super.serialize(),
            text: this.text
        };
    }

    static deserialize(json) {
        return new TextBlock(json.text, json.id);
    }
}