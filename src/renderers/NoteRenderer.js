import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Note } from "../Note.js";
import { 
    NoteBody, NoteHeader, NoteTitle, NoteDescription, NoteMetadata, NoteContent, NotePriority, NoteDueDate,
    NoteFooter, 
    NoteDoneButton
} from "./templates/Note.js"

export class NoteRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }
    
    getTargetType() {
        return Note.name;
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
                case "title":       frag = NoteTitle(note, { details: showDetails }); break;
                case "description": frag = this.createDescription(system, context, note); break;
                case "content":     frag = this.createContent(system, context, note); break;
                case "metadata":    frag = this.createMetadata(system, context, note); break;
                case "priority":    frag = NotePriority(note, { details: showDetails }); break;
                case "dueDate":     frag = NoteDueDate(note, { details: showDetails }); break;
                default:            console.error("Invalid render mode"); break;
            }

            if (frag != null) {
                this.controller.handlePartialRendered(this, note, context, partial, frag);
                context.wrapper.appendChild(frag);
            }

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
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteHeader(note, { details: showDetails });

        return frag;
    }

    createDescription(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteDescription(note, { details: showDetails });

        return frag;
    }

    createContent(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        if (!showDetails || !note.hasContent) {
            return null;
        }

        let generators = [];
        note.forEachContent(content => {
            generators.push(parent => system.renderReturn(content, new RenderContext(parent, null)));
        });

        return NoteContent(note, { content: generators });
    }

    createMetadata(system, context, note) {
        const showDetails = this.#isDetailsMode(context);
        const frag = NoteMetadata(note, { details: showDetails });

        return frag;
    }

    #isDetailsMode(context) {
        return context.getSettingsParam("mode", "card") === "details";
    }

    #isItemMode(context) {
        return context.getSettingsParam("mode", "card") === "item";
    }
}