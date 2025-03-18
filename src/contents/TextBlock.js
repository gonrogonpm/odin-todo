import { Content } from "../Content.js";

export class TextBlock extends Content {
    constructor(text = "") {
        super();
        this.text = text;
    }
}