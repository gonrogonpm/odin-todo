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

    setup() {
        const buttons = document.querySelectorAll("#sidebar .project-list button");
        buttons.forEach(button => {
            button.addEventListener("click", event => this.#handleProjectButtonClick(event));
        });

        const buttonsDetails = document.querySelectorAll(".note-buttons button");
        buttonsDetails.forEach(button => {
            console.log("button");
        });
    }

    #handleProjectButtonClick(event) {
        const main = document.querySelector("#main");
        if (!main) {
            console.error("Main element not found");
            return;
        }

        const button = event.target.closest("button");
        if (!button) {
            console.error("Button not found");
            return;
        }
        /*
        const index = Number(button.dataset.index);
        if (isNaN(index) || index < 0) {
            console.error("Invalid project index");
            return;
        }
        */
        const id = button.dataset?.id;
        if (id == null) {
            console.error("Invalid project id");
            return;
        }

        this.renderSystem.renderReplaceChildren(this.library, new RenderContext(main, {
            mode: "project",
            id: id
        }));
    }

    #handleProjectDetailsButtonClick(event) {

    }

    render() {
        const elemSidebar = document.querySelector("#sidebar");
        if (!elemSidebar) {
            console.error("Sidebar element not found");
            return;
        }

        const elemMain = document.querySelector("#main");
        if (!elemMain) {
            console.error("Main element not found");
            return;
        }

        this.renderSystem.renderAppend(this.library, new RenderContext(elemSidebar, {
            title: "projects"
        }));
        
        this.renderSystem.renderAppend(this.library, new RenderContext(elemMain, {
            mode: "project",
            id: this.library.getProject(0).id
        }));
    }
}