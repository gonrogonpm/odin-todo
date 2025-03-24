import { Renderer } from "../Renderer.js";
import { AppFirstTimeDialog } from "./templates/App.js";
import { App } from "../App.js";

export class AppRenderer extends Renderer {
    constructor(controller = null) {
        super(controller);
    }

    getTargetType() {
        return App.getType();
    }

    render(system, context, app) {
        if (!context || !context.hasWrapper) {
            return;
        }

        const mode = context.getSettingsParam("mode", null);

        switch (mode) {
            case "new":
            {
                const frag = AppFirstTimeDialog();
                this.controller.handleObjectRendered(this, app, context, frag);
                context.wrapper.appendChild(frag);
            }
            break;
        }
    }
}