import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Project } from "../Project.js";
import { ProjectBoard, ProjectTitle, ProjectMenu, ProjectForm, ProjectGrid, ProjectList, ProjectContentEmpty, ProjectFooter } from "./templates/Project.js";

export class ProjectRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }

    getTargetType() {
        return Project.name;
    }

    render(system, context, project) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const mode = context.getSettingsParam("mode", "card");

        switch (mode) {
            case "list":
            {
                const frag = this.createList(system, context, project);
                this.controller.handleObjectRendered(this, project, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;

            case "grid":
            default:
            {
                const frag = this.createGrid(system, context, project);
                this.controller.handleObjectRendered(this, project, context, frag);
                context.wrapper.appendChild(frag);           
            }
            break;
        }
    }

    /* COMMON PARTS */

    createTitle(project) {
        return ProjectTitle(project);
    }

    createMenu(project) {
        return ProjectMenu(project);
    }

    createFooter(project) {
        return ProjectFooter(project);
    }

    /* LIST MODE */

    createList(system, context, project) {
        const list = ProjectBoard(project, {
            content: [
                () => this.createTitle(project),
                () => this.createMenu(project),
                () => this.createListContent(system, project),
                () => this.createFooter(project),
            ]
        });

        return list;
    }

    createListContent(system, project) {
        if (!project.hasNotes) {
            return ProjectContentEmpty(project);
        }
        
        let generators = [];
        project.forEachNote(note => {
            generators.push(parent => system.renderReturn(note, new RenderContext(parent, { mode: "item" })));
        });

        return ProjectList(project, { content: generators });
    }

    /* GRID MODE */

    createGrid(system, context, project) {
        const board = ProjectBoard(project, {
            content: [
                () => this.createTitle(project),
                () => this.createMenu(project),
                () => this.createGridContent(system, project),
                () => this.createFooter(project),
            ]
        });

        return board;
    }

    createGridContent(system, project) {
        if (!project.hasNotes) {
            return ProjectContentEmpty(project);
        }

        let generators = [];
        project.forEachNote(note => {
            generators.push(parent => system.renderReturn(note, new RenderContext(parent, { mode: "card" })));
        });

        return ProjectGrid(project, { content: generators });
    }
}