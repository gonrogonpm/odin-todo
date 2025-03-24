import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Note } from "../Note.js";
import { 
    NoteBody, NoteHeader, NoteTitle, NoteDescription, NoteMetadata, NoteContent, NotePriority, NoteDueDate,
    NoteFooter,
    NoteTitleForm,
    NoteDescriptionForm,
    NotePriorityForm, 
    NoteDueDateForm
} from "./templates/Note.js"

export class NoteRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }
    
    getTargetType() {
        return Note.getType();
    }

    render(system, context, note) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const mode        = context.getSettingsParam("mode", "card");
        const partial     = context.getSettingsParam("partial");
        const showDetails = this.#isDetailsMode(context);

        if (partial != null)
        {
            let frag = null;

            switch (partial) {
                case "title":            frag = NoteTitle(note, { details: showDetails }); break;
                case "title-form":       frag = NoteTitleForm(note); break;
                case "description":      frag = this.createDescription(system, context, note); break;
                case "description-form": frag = NoteDescriptionForm(note); break;
                case "content":          frag = this.createContent(system, context, note); break;
                case "metadata":         frag = this.createMetadata(system, context, note); break;
                case "priority":         frag = NotePriority(note, { details: showDetails }); break;
                case "priority-form":    frag = NotePriorityForm(note); break;
                case "dueDate":          frag = NoteDueDate(note, { details: showDetails }); break;
                case "dueDate-form":     frag = NoteDueDateForm(note); break;
            }

            if (frag != null) {
                this.controller.handlePartialRendered(this, note, context, partial, frag);
                context.wrapper.appendChild(frag);
                return;
            }

            console.error(`Invalid partial "${partial}"`);
            return;
        }

        switch (mode) {
            case "item":
            {
                const frag = this.createItem(system, context, note);
                this.controller.handleObjectRendered(this, note, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;

            case "card":
            case "details":
            default:
            {
                const frag = this.createCard(system, context, note);
                this.controller.handleObjectRendered(this, note, context, frag);
                context.wrapper.appendChild(frag);           
            }
            break;
        }

    }

    createItem(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteBody(note, {
            class: "note-item",
            content: [
                () => this.createTitle(system, context, note),
                () => this.createMetadata(system, context, note)
            ]
        });

        return frag;
    }

    createCard(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteBody(note, {
            class: "note-card",
            content: [
                () => this.createTitle(system, context, note),
                () => this.createDescription(system, context, note),
                () => this.createContent(system, context, note),
                () => this.createMetadata(system, context, note)
            ]
        });

        if (showDetails) {
            frag.appendChild(NoteFooter(note));
        }

        return frag;
    }

    createTitle(system, context, note) {
        const mode        = context.getSettingsParam("mode", "card");
        const showDetails = this.#isDetailsMode(context);

        const frag = NoteHeader(note, { mode: mode, details: showDetails });

        return frag;
    }

    createDescription(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteDescription(note, { details: showDetails });

        return frag;
    }

    createContent(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        if (!showDetails) {
            return null;
        }

        let generators = [];
        note.forEachContent(content => {
            generators.push(parent => system.renderReturn(content, new RenderContext(parent, null)));
        });

        return NoteContent(note, { content: generators, details: showDetails });
    }

    createMetadata(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteMetadata(note, { details: showDetails });

        return frag;
    }

    #isDetailsMode(context) {
        return context.getSettingsParam("mode", "card") === "details";
    }
}