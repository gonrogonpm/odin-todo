import * as Common from "./Common.js";
import * as Dialog from "./Dialog.js";

export function AppFirstTimeDialog(settings = {}) {
    if (!("id" in settings)) {
        settings.id = "app-first-time-dialog";
    }

    if (!("title" in settings)) {
        settings.title = "load test data";
    }

    settings.text = "This is the first time you open the application. Do you want to load the test data?";

    return Dialog.QuestionDialog(settings);
}