import { Controller } from "../Controller.js";
import { Library } from "../Library.js";
import { Project } from "../Project.js";
import { LibraryAddProjectDialog } from "../renderers/templates/Library.js";

export class LibraryController extends Controller {
    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
        result.querySelector(".libray-add-project-button")?.addEventListener("click", event => {
            this.#handleAddProjectClick(target);
        });

        const buttonsProjects = result.querySelectorAll(".library-project-button");
        buttonsProjects.forEach(button => {
            button.addEventListener("click", event => this.#handleProjectClick(event, target));
        });
    }

    #handleProjectClick(event, library) {
        const button = event.target.closest("button");
        if (!button) {
            console.error("Button not found");
            return;
        }

        const id = button.dataset?.id;
        if (id == null) {
            console.error("Invalid project id");
            return;
        }

        this.app.renderProject(id, true);
    }

    #handleAddProjectClick(library) {
        this.__showDialog(
            "new-project-dialog",
            () => LibraryAddProjectDialog(library),
            null,
            null,
            (content) => {
                this.#handleSubmit(content, library)
            }
        );
    }

    #handleSubmit(form, library) {
        const input = form.querySelector("#new-project-name");
        if (!input) {
            console.error("Project name input not found in DOM");
            return;
        }

        let value = input.value;
        if (typeof value !== "string") {
            console.error("Project name must be a valid string");
            return;
        }

        value = value.trim();
        if (value === "") {
            return;
        }

        input.value = "";
        library.addProject(new Project(value.trim()));
        this.app.renderSidebar();
    }
}