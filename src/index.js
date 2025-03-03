import { App } from "./App.js";
import { Priority } from "./Priority.js";
import { Project } from "./Project.js";
import { Note } from "./Note.js";
import * as Contents from "./contents/index.js";

const app = new App();

app.library.add(new Project("Test Project"));
app.library.add(new Project("Mega Project"));

app.library.get(0).add(new Note({
    title:       "Test ToDo",
    description: "A generic description",
    dueDate:     Date.now(),
    priority:    Priority.Medium
}));

const note = app.library.get(0).get(0);
note.add(new Contents.TextBlock("A text block for the ToDo"));
note.add(new Contents.TextBlock("Another text block"));
note.add(new Contents.Checklist([
    "Do thing one",
    "Do thing two",
    "Do something more"
]));

app.library.get(0).add(new Note({
    title: "Project Foo",
    description: "A great foo project for the web",
    dueDate: null,
    priority: Priority.Low
}));

app.render();