import { style } from "./style.css";
import { App } from "./App.js";
import { Priority } from "./Priority.js";
import { Project } from "./Project.js";
import { Note } from "./Note.js";
import * as Contents from "./contents/index.js";

const app = new App();

app.load();
app.render();
app.save();