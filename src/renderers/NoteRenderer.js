import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Note } from "../Note.js";
import { getPriorityName } from "../Priority.js";
import { format } from "date-fns"

const svgSeeMore = 
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <title>see more</title>
    <path d="M12 4.5C7 4.5 2.7 7.6 1 12C2.7 16.4 7 19.5 12 19.5H13.1C13 19.2 13 18.9 13 18.5C13 18.1 13 17.8 13.1 17.4C12.7 17.4 12.4 17.5 12 17.5C8.2 17.5 4.8 15.4 3.2 12C4.8 8.6 8.2 6.5 12 6.5S19.2 8.6 20.8 12C20.7 12.2 20.5 12.4 20.4 12.7C21.1 12.9 21.7 13.1 22.3 13.5C22.6 13 22.8 12.5 23 12C21.3 7.6 17 4.5 12 4.5M12 9C10.3 9 9 10.3 9 12S10.3 15 12 15 15 13.7 15 12 13.7 9 12 9M19 21V19H15V17H19V15L22 18L19 21" />
</svg>`;

const svgCheckbox = 
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <title>checkbox-blank-outline</title>
    <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
</svg>`;

const svgCheckboxMarked = 
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <title>checkbox-marked-outline</title>
    <path d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
</svg>`;

export class NoteRenderer extends Renderer {
    getTargetType() {
        return Note.name;
    }

    /**
     * Renders a ToDo object.
     * 
     * @param {RenderSystem} system
     * @param {RenderContext} context
     * @param {Note} obj 
     */
    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        let note = null;
        if (context.hasSettings && context.settings.details) {
            note = this.createNoteWithDetails(system, context, obj);
        }
        else {
            note = this.createNote(system, context, obj);
        }

        context.wrapper.appendChild(note);
    }

    createNote(system, context, obj) {
        const body  = this.createBody(obj);
        const title = this.createTitle(obj);
        const desc  = this.createDescription(obj);
        const meta  = this.createMetadata(obj);

        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(meta);

        return body;
    }

    createNoteWithDetails(system, context, obj) {
        const body    = this.createBody(obj);
        const title   = this.createTitle(obj);
        const desc    = this.createDescription(obj);
        const content = this.createContent(obj);
        const meta    = this.createMetadata(obj);

        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(content);
        body.appendChild(meta);

        const childContext = new RenderContext(content, null);
        obj.contents.forEach(content => {
            system.renderAppend(content, childContext);
        });

        return body;
    }

    createBody(obj) {
        const elemBody = document.createElement("article");
        elemBody.classList.add("note");

        return elemBody;
    }

    createTitle(obj) {
        const header = document.createElement("section");
        header.classList.add("note-header");

        const title = document.createElement("h3");
        title.classList.add("note-title");
        title.textContent = obj.title;
        header.appendChild(title);

        const buttons = document.createElement("div");
        buttons.classList.add("note-buttons");
        const more = document.createElement("button");
        more.innerHTML = svgSeeMore;
        buttons.append(more);
        const done = document.createElement("button");
        done.innerHTML = svgCheckbox;
        buttons.append(done);
        header.appendChild(buttons);

        return header;
    }

    createDescription(obj) {
        const elemDesc = document.createElement("section");
        elemDesc.classList.add("note-description");
        elemDesc.textContent = obj.description;

        return elemDesc;
    }

    createContent(obj) { 
        const elemContent = document.createElement("section");
        elemContent.classList.add("note-content");

        return elemContent;
    }

    createMetadata(obj) {
        const meta = document.createElement("section");
        meta.classList.add("note-meta");

        const priority = document.createElement("div");
        priority.classList.add("note-priority");

        const span = document.createElement("span");
        span.classList.add("priority");
        span.classList.add(`priority-${getPriorityName(obj.priority)}`);
        span.textContent = getPriorityName(obj.priority);

        priority.appendChild(span);
        meta.appendChild(priority);
        
        if (obj.dueDate !== null) {
            const dueDate = document.createElement("div");
            dueDate.classList.add("note-due-date");
            dueDate.textContent = obj.dueDate === null ? "none" : format(obj.dueDate, "PP - p");

            meta.appendChild(dueDate);
        }

        return meta;
    }
}