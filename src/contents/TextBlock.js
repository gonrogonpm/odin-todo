import { Content } from "../Content.js";

export class TextBlock extends Content {
    constructor(value) {
        super();
        this.text = value;
    }
}