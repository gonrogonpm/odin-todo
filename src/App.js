import { Library } from "./Library.js";
import { Project } from "./Project.js";
import { SearchMenu } from "./SearchMenu.js";
import { RenderContext } from "./RenderContext.js";
import { RenderSystem } from "./RenderSystem.js";
import * as Renderers from "./renderers/index.js";
import * as Controllers from "./controllers/index.js";

export class App {
    library = new Library();

    controllers = [];

    renderSystem = new RenderSystem();

    searchMenu = new SearchMenu();

    projectMode = "list";

    constructor() {
        this.library = new Library();
        this.library.addProject(Project.CreateDefaultProject());

        this.controllers.push(new Controllers.LibraryController(this));
        this.controllers.push(new Controllers.ProjectController(this));
        this.controllers.push(new Controllers.NoteController(this));
        this.controllers.push(new Controllers.SearchController(this));
        this.controllers.push(new Controllers.TextBlockController(this));
        this.controllers.push(new Controllers.ChecklistController(this));

        this.renderSystem.addProcessor(new Renderers.LibraryRenderer(this.controllers[0]));
        this.renderSystem.addProcessor(new Renderers.ProjectRenderer(this.controllers[1]));
        this.renderSystem.addProcessor(new Renderers.NoteRenderer(this.controllers[2]));
        this.renderSystem.addProcessor(new Renderers.TextBlockRenderer(this.controllers[4]));
        this.renderSystem.addProcessor(new Renderers.ChecklistRenderer(this.controllers[5]));
        this.renderSystem.addProcessor(new Renderers.SearchRenderer(this.controllers[3]));
        this.renderSystem.addProcessor(new Renderers.SearchMenuRenderer(this.controllers[3]));
    }

    render() {
        this.renderSidebar();
        this.renderDefaultMain();
    }

    renderSidebar() {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) {
            console.error("Sidebar element not found");
            return;
        }

        const search = sidebar.querySelector(".search");
        if (!search) {
            this.renderSystem.renderAppend(this.searchMenu, new RenderContext(sidebar));
        } 
        else {
            this.renderSystem.renderReplace(this.searchMenu, new RenderContext(search));
        }

        const projects = document.getElementById("library-projects");
        if (!projects) {
            this.renderSystem.renderAppend (this.library, new RenderContext(sidebar,  { id: "library-projects", mode: "list" }));    
        }
        else {
            this.renderSystem.renderReplace(this.library, new RenderContext(projects, { id: "library-projects", mode: "list" }));
        }
    }

    renderDefaultMain() {
        if (this.library.hasProjects) {
            this.renderProject(this.library.getProject(0).id, true);
        }
    }

    renderProject(id, replace, settings = {}) {
        const main = document.querySelector("#main");
        if (!main) {
            console.error("Main element not found");
            return;
        }

        const context = new RenderContext(main, {
            mode:     "project",
            id:       id,
            settings: settings
        });

        if (replace) {
            this.renderSystem.renderReplaceChildren(this.library, context);
        } 
        else {
            this.renderSystem.renderAppend(this.library, context);
        }
    }

    renderNote(projectId, noteId, replace) {
        const main = document.querySelector("#main");
        if (!main) {
            console.error("Main element not found");
            return;
        }

        const context = new RenderContext(main, {
            mode: "note",
            id: [projectId, noteId],
            settings: { mode: "details" }
        });

        if (replace) {
            this.renderSystem.renderReplaceChildren(this.library, context);
        } 
        else {
            this.renderSystem.renderAppend(this.library, context);
        }
    }

    renderSearch(search, result) {
        const main = document.querySelector("#main");
        if (!main) {
            console.error("Main element not found");
            return;
        }

        this.renderSystem.renderReplaceChildren(search, new RenderContext(main, { result: result }));
    }
}