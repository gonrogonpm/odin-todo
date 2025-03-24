import { Renderer } from "../Renderer.js";
import { SearchMenu } from "../SearchMenu.js";
import * as Common from "./templates/Common.js";

export class SearchMenuRenderer extends Renderer {
    getTargetType() {
        return SearchMenu.getType();
    }

    render(system, context, obj) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const frag = this.createMenu(obj);
        this.controller.handleObjectRendered(this, obj, context, frag);
        context.wrapper.appendChild(frag);
    }

    createMenu(searchMenu) {
        const frag    = document.createDocumentFragment();
        const wrapper = Common.Div({ class: "search"});
        const list    = Common.Div({ class: "list-wrapper" });

        wrapper.append(Common.H2({ text: searchMenu.title }));

        let generators = [];
        searchMenu.forEachItem(item => {
            generators.push(() => Common.Button({ class: ["link"], text: item.label, id: item.id }));
        });

        list.append(Common.UnorderedList({ content: generators }))
        wrapper.append(list);
        frag.append(wrapper);
        return frag;
    }
}