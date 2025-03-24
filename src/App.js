import { AppKey } from "./AppSerializer.js"
import { Library } from "./Library.js";
import { Project } from "./Project.js";
import { SearchMenu } from "./SearchMenu.js";
import { RenderContext } from "./RenderContext.js";
import { RenderSystem } from "./RenderSystem.js";
import * as Renderers from "./renderers/index.js";
import * as Controllers from "./controllers/index.js";
import logoSVG from "./todo-logo.svg";

export class App {
    library = new Library();

    controllers = [];

    renderSystem = new RenderSystem();

    searchMenu = new SearchMenu();

    projectMode = "grid";

    constructor() {
        this.library = new Library();
        this.library.addProject(Project.CreateDefaultProject());

        this.controllers.push(new Controllers.LibraryController(this));
        this.controllers.push(new Controllers.ProjectController(this));
        this.controllers.push(new Controllers.NoteController(this));
        this.controllers.push(new Controllers.SearchController(this));
        this.controllers.push(new Controllers.TextBlockController(this));
        this.controllers.push(new Controllers.ChecklistController(this));
        this.controllers.push(new Controllers.AppController(this));

        this.renderSystem.addProcessor(new Renderers.LibraryRenderer(this.controllers[0]));
        this.renderSystem.addProcessor(new Renderers.ProjectRenderer(this.controllers[1]));
        this.renderSystem.addProcessor(new Renderers.NoteRenderer(this.controllers[2]));
        this.renderSystem.addProcessor(new Renderers.TextBlockRenderer(this.controllers[4]));
        this.renderSystem.addProcessor(new Renderers.ChecklistRenderer(this.controllers[5]));
        this.renderSystem.addProcessor(new Renderers.SearchRenderer(this.controllers[3]));
        this.renderSystem.addProcessor(new Renderers.SearchMenuRenderer(this.controllers[3]));
    }

    static getType() { return "App"; }

    get type() { return App.getType(); }

    static get appKey() {
        return "__app__";
    }

    render(projectId = null) {
        this.renderSidebar();

        if (projectId == null) {
            this.renderDefaultMain();
        }
        else {
            this.renderProject(projectId, true);
        }
    }

    renderSidebar() {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) {
            console.error("Sidebar element not found");
            return;
        }

        let logo = document.getElementById("logo");
        if (logo.firstChild == null) {
            let img  = document.createElement("img");
            img.src  = logoSVG;
            img.width =180;
            logo.append(img);
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

    save() {
        this.library.save();
        // Save application state.
        localStorage.setItem(AppKey, JSON.stringify({ projectMode: this.projectMode }));
    }

    load() {
        this.library.load();
        // Load application state.
        const str = localStorage.getItem(AppKey);
        if (str != null) {
            const obj = JSON.parse(str);
            this.projectMode = obj.projectMode;
        }
        // First time the application is loaded.
        else {
            this.controllers.at(-1).loadInitialData();
        }
    }
}