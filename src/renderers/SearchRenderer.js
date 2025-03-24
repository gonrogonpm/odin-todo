import { Renderer } from "../Renderer.js";
import { RenderContext } from "../RenderContext.js";
import { Search } from "../Search.js";
import { SearchBoard, SearchContent, SearchContentEmpty, SearchTitle } from "./templates/Search.js";

export class SearchRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }

    getTargetType() {
        return Search.getType();
    }

    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const frag = this.createList(system, context, obj);
        this.controller.handleObjectRendered(this, obj, context, frag);
        context.wrapper.appendChild(frag);
    }

    createList(system, context, search) {
        const list = SearchBoard(search, {
            content: [
                () => this.createTitle(search),
                () => this.createContent(system, context, search),
            ]
        });

        return list;
    }

    createTitle(search) {
        return SearchTitle(search);
    }

    createContent(system, context, search) {
        const result = context.getSettingsParam("result");
        if (result == null) {
            return SearchContentEmpty(search);
        }
        
        let generators = [];
        result.forEach(note => {
            generators.push(() => system.renderReturn(note, new RenderContext(null, { mode: "item" })));
        });

        return SearchContent(search, { content: generators });
    }
}