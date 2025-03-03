import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Project } from "../Project.js";

export class ProjectRenderer extends Renderer {
    getTargetType() {
        return Project.name;
    }

    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        let project = null;
        if (context.hasSettings && context.settings.list) {
            project = this.createList(system, context, obj);
        }
        else {
            project = this.createBoard(system, context, obj);
        }

        context.wrapper.appendChild(project);
    }

    createList(system, context, obj) {
        const list = this.createListBody();

        for (let i = 0; i < obj.count; i++) {
            list.appendChild(this.createListItem(obj.get(i)));
        }

        return list;
    }

    createBoard(system, context, obj) {
        const body  = this.createBoardBody();
        const title = this.createBoardTitle(obj);

        body.append(title);

        const childContext = new RenderContext(body);
        for (let i = 0; i < obj.count; i++) {
            system.render(obj.get(i), childContext);
        }
        
        return body;
    }

    createListBody() {
        const elemList = document.createElement("ul");
        elemList.classList.add("notes-list");
        
        return elemList;
    }

    createListItem(note) {
        const elemItem = document.createElement("li");
        elemItem.textContent = note.title;

        return elemItem;
    }

    createBoardTitle(project) {
        const title = document.createElement("div");
        title.classList.add("notes-board-title");
        const header = document.createElement("h2");
        header.textContent = project.name;

        title.appendChild(header);
        return title;
    }

    createBoardBody() {
        const elemBody = document.createElement("div");
        elemBody.classList.add("notes-board");

        return elemBody;
    }
}