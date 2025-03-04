import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Note } from "../Note.js";
import { getPriorityName } from "../Priority.js";
import { format } from "date-fns"

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
            system.render(content, childContext);
        });

        return body;
    }

    createBody(obj) {
        const elemBody = document.createElement("article");
        elemBody.classList.add("note");

        return elemBody;
    }

    createTitle(obj) {
        const elemTitle = document.createElement("h3");
        elemTitle.classList.add("note-title");
        elemTitle.textContent = obj.title;

        return elemTitle;
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