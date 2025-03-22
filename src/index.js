import { style } from "./style.css";
import { App } from "./App.js";
import { Priority } from "./Priority.js";
import { Project } from "./Project.js";
import { Note } from "./Note.js";
import * as Contents from "./contents/index.js";

const app = new App();
/*
app.library.addProject(new Project("Test Project"));
app.library.addProject(new Project("Mega Project"));

app.library.getProject(0).addNote(new Note({
    title:       "Test ToDo",
    description: "A generic description",
    dueDate:     new Date(),
    priority:    Priority.Medium
}));

const note = app.library.getProject(0).getNote(0);
note.addContent(new Contents.TextBlock("A text block for the ToDo"));
note.addContent(new Contents.TextBlock("Another text block"));
note.addContent(new Contents.Checklist([
    "Do thing one",
    "Do thing two",
    "Do something more"
]));

app.library.getProject(0).addNote(new Note({
    title: "Project Foo",
    description: "A great foo project for the web",
    dueDate: "2025-08-21",
    done: true,
    priority: Priority.Low
}));

app.library.getProject(1).addNote(new Note({
    title: "Awesome Note",
    description: "This note is amazing",
    dueDate: null,
    priority: Priority.Critical
}));

app.load();
*/
app.load();
app.render();
app.save();