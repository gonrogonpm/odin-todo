import { Controller } from "../Controller.js";
import { RenderContext } from "../RenderContext.js";
import { AppFirstTimeDialog } from "../renderers/templates/App.js";
import { Project } from "../Project.js";
import { Note } from "../Note.js";
import { Priority } from "../Priority.js";
import * as Contents from "../contents/index.js"
import { addDays, subDays } from "date-fns";

export class AppController extends Controller {
    loadInitialData() {
        this.__showDialog(
            "app-first-time-dialog",
            AppFirstTimeDialog,
            () => { 
                this.#populateApp();
                this.app.save();
                this.app.render();
                return true;
            }
        )
    }

    #populateApp() {
        let project = null;
        let note = null;

        // POPULATE THE DEFAULT PROJECT

        note = this.app.library.getDefaultProject().addNote(new Note({
            title:       "Grocery Shopping & Meal Prep",
            description: "Check pantry inventory, create a shopping list for weekly meals, and budget for essentials",
            dueDate:     new Date(),
            done:        false,
            priority:    Priority.Medium
        }));
        note.addContent(new Contents.TextBlock("We should prioritize fresh produce and healthy snacks and allocate time for meal prepping on Sunday afternoon."));
        note.addContent(new Contents.Checklist([
            { text: "Check pantry and fridge", checked: true },
            { text: "Plan weekly meals", checked: true },
            "Create a shopping list",
            "Set a budget",
            "Go shopping",
            "Organize groceries",
            "Meal prep (Sunday afternoon)",
            "Clean and store"
        ]));

        this.app.library.getDefaultProject().addNote(new Note({
            title: "Schedule HVAC Maintenance",
            description: "Contact a licensed technician to inspect and service the heating/cooling system before winter, replace air filters and test thermostat functionality.",
            done: true,
            priority: Priority.Low
        }));

        project = this.app.library.addProject(new Project("Awesome Tools"));
        note = project.addNote(new Note({  
            title:       "Implement Drag-and-Drop UI Component",
            description: "Develop a reusable drag-and-drop interface for webpage element customization.",
            dueDate:     addDays(new Date(), 1),
            done:        false,
            priority:    Priority.High,
        }));
        note.addContent(new Contents.TextBlock("Include error handling for invalid element placements"));
        note.addContent(new Contents.TextBlock("Test cross-browser compatibility (Chrome, Firefox, Safari)"));
        note.addContent(new Contents.Checklist([
            { text: "Sketch wireframe for UI container boundaries", checked: true },
            "Integrate React-DnD library",
            "Write unit tests for edge cases"
        ]));

        note = project.addNote(new Note({  
            title:       "User Testing: Prototype Feedback Session",
            description: "Organize a usability test for the web design tool's beta version.",
            dueDate:     addDays(new Date(), 42),
            done:        false,
            priority:    Priority.Medium,
        }));
        note.addContent(new Contents.TextBlock("Target audience: 10 freelance web designers"));
        note.addContent(new Contents.TextBlock("Prepare a feedback form (Google Forms/Typeform)"));
        note.addContent(new Contents.TextBlock("Record screen interactions for analysis"));
        note.addContent(new Contents.Checklist([
            { text: "Schedule testing sessions via Calendly", checked: true },
            { text: "Set up test environment with dummy projects", checked: true },
            "Compile results into a report"
        ]));

        note = project.addNote(new Note({  
            title:       "Optimize Preview Mode Rendering Speed",
            description: "Improve performance of real-time webpage preview in the design tool.",
            dueDate:     addDays(new Date(), 42),
            done:        false,
            priority:    Priority.Hight,
        }));
        note.addContent(new Contents.TextBlock("Current avg. render time: 2.8s (target: <1s)"));
        note.addContent(new Contents.Checklist([
            "Profile JavaScript execution bottlenecks",
            "Implement memoization for repeated calculations",
        ]));

        project = this.app.library.addProject(new Project("Mega Idea"));
        note = project.addNote(new Note({  
            title:       "Finalize Core Feature List",
            description: "Define and prioritize the MVP (Minimum Viable Product) features for the Mega Idea project launch.",
            dueDate:     addDays(new Date(), 5),
            done:        false,
            priority:    Priority.Critical,
        }));
        note.addContent(new Contents.TextBlock("Alignment required with 2025 company roadmap"));
        note.addContent(new Contents.Checklist([
            { text: "Draft initial feature proposals", checked: true },
            "Run cost-benefit analysis for AI integration",
            "Schedule voting session with stakeholders",
            "Document final decisions in Confluence"
        ]));

        project = this.app.library.addProject(new Project("Empty Project"));
    }
}