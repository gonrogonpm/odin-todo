import { Library } from "./Library.js";
import { RenderContext } from "./RenderContext.js";
import { RenderSystem } from "./RenderSystem.js";
import * as Renderers from "./renderers/index.js";

export class App {
    library = new Library();

    renderSystem = new RenderSystem();

    constructor() {
        this.renderSystem.addProcessor(new Renderers.LibraryRenderer());
        this.renderSystem.addProcessor(new Renderers.ProjectRenderer());
        this.renderSystem.addProcessor(new Renderers.NoteRenderer());
        this.renderSystem.addProcessor(new Renderers.TextBlockRenderer());
        this.renderSystem.addProcessor(new Renderers.ChecklistRenderer());
    }

    render() {
        const elemMain = document.querySelector("#main");
        if (!elemMain) {
            console.error("Main element not found");
            return;
        }

        this.renderSystem.render(this.library, new RenderContext(elemMain, {}));
        
        this.renderSystem.render(this.library, new RenderContext(elemMain, {
            mode: "project",
            index: 0,
            settings: { list: true }
        }));

        this.renderSystem.render(this.library, new RenderContext(elemMain, {
            mode: "note",
            index: [0, 0],
            settings: { details: true }
        }));

        this.renderSystem.render(this.library, new RenderContext(elemMain, {
            mode: "project",
            index: 0
        }));
    }
}