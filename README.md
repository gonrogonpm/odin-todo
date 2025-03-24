# ToDo

A JavaScript practice project: ToDo list

A modern and functional web application for taking notes, managing ToDo lists, and organizing your thoughts, built from scratch using Vanilla JavaScript, HTML, and CSS, following the Model-View-Controller (MVC) architectural pattern.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Live Demo](#live-demo)
- [Usage](#usage)
- [Architecture](#architecture)
  - [Model](#model)
  - [View](#view)
  - [Controller](#controller)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)
- [License](#license)

## Features

*   **Note-taking:** Create, edit, and delete notes with titles, descriptions, priorities, and due dates.
*   **Content Types:** Supports two content types within notes:
    *   **Text Blocks:** For plain text notes.
    *   **Checklists:** For interactive ToDo lists with checkable items.
*   **Project Organization:** Organize notes into projects for better task management and categorization.
*   **Search Functionality:** Basic search menu to quickly find notes due "Today," "This Week," or "All Notes."
*   **User-Friendly Interface:**  Clean and intuitive user interface built with HTML, CSS, and SVG icons.
    *   **In-line Editing:** Edit note details and content directly within the note view.
    *   **Dialog Confirmations:** Confirmation dialogs for important actions like deleting notes or projects.
*   **Data Persistence:**  Uses `localStorage` to save and load application state, ensuring notes are preserved across browser sessions.
*   **MVC Architecture:** Implemented using the Model-View-Controller architectural pattern for a well-organized and maintainable codebase.

## Technologies Used

*   **Frontend:**
    *   Vanilla JavaScript (ES Modules)
    *   HTML
    *   CSS
*   **Bundler:** [webpack](https://webpack.js.org/)
*   **Date Manipulation:** [date-fns](https://date-fns.org/)
*   **Unique ID Generation:** [nanoid](https://github.com/ai/nanoid)
*   **Icons:** Custom SVG icons and [Material Design Icons](https://pictogrammers.com/library/mdi/) (implicitly through design)

## Live Demo
[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Live-blueviolet)](https://gonrogonpm.github.io/odin-todo/)

<!-- Añade la imagen de vista previa aquí -->
![Live Preview of ToDos App](./assets/live-preview-screenshot.png)

[**[Live Demo - View Live Application](https://gonrogonpm.github.io/odin-todo/)**](https://gonrogonpm.github.io/odin-todo/)

## Usage

*   **Sidebar:**
    *   **Projects List:**  View and navigate your projects in the sidebar.
    *   **Add Project Button:** Click the "+ Add Project" button in the sidebar to create a new project.
    *   **Search Menu:** Use the search menu at the top of the sidebar to filter notes by date (Today, This Week, All Notes).
*   **Main Content Area:**
    *   **Project View:**  When a project is selected, its notes are displayed in the main area (initially in a grid view).
    *   **Note Creation:** Click the "+ Add Note" button within a project to create a new note in that project.
    *   **Note Editing:** Click on a note's title, description, priority, or due date to edit them in-place.
    *   **Content Editing:** Click on a Text Block or Checklist content within a note to edit its content in-place.
    *   **Note Actions:** Use the buttons within each note (e.g., "Done", "Details," "Delete") to interact with notes.
    *   **View Modes:** Switch between "Grid" and "List" views for projects using the buttons in the project menu.
*   **Dialogs:**
    *   Confirmation dialogs will appear for actions like deleting projects or notes to prevent accidental data loss.

## Architecture

The application follows the **Model-View-Controller (MVC)** architectural pattern:

*   **<a id="model"></a>Model:**  (`src` folder, files like `Library.js`, `Project.js`, `Note.js`, `Content.js`, etc.)
    *   Manages the application's data and business logic.
    *   Includes classes for `Library`, `Project`, `Note`, `Content` (abstract base class), `TextBlock`, `Checklist`, `SearchMenu`, and `Search`.
    *   Encapsulates data and provides methods for data manipulation and access.
*   **<a id="view"></a>View:** (`src/renderers` and `src/renderers/templates` folders)
    *   Responsible for rendering the user interface and displaying data to the user.
    *   `RenderSystem`: Central class that orchestrates the rendering process.
    *   `Renderer` classes (`NoteRenderer.js`, `ProjectRenderer.js`, `LibraryRenderer.js`, etc.): Classes that handle the rendering of specific model types, using templates.
    *   `renderers/templates` folder: Contains JavaScript files with functions that act as templates for generating HTML elements and UI components.
*   **<a id="controller"></a>Controller:** (`src/controllers` folder)
    *   Manages user interactions and updates the Model and View.
    *   `Controller` base class (`Controller.js`): Provides base functionality for controllers, including dialog management.
    *   Concrete Controller classes (`NoteController.js`, `ProjectController.js`, `LibraryController.js`, etc.): Handle specific user interactions for notes, projects, library, search, and content editing.

## Future Enhancements

*   **Checklist Item Reordering:** Implement drag-and-drop or up/down button functionality to reorder items within checklists.
*   **Advanced Search Functionality:** Expand search capabilities to include searching by note title, description, content, priority, and tags.
*   **Tags/Categories for Notes:**  Add a tagging or categorization system to notes for more flexible organization.
*   **Improved User Interface and Styling:** Further refine the CSS styles and UI design for a more polished and visually appealing application.
*   **Testing:** Implement unit and integration tests to ensure code robustness and prevent regressions.
*   **Backend Persistence (Optional):**  Replace `localStorage` with a backend database for more robust data persistence and user accounts.

## Credits

*   Developed by [**gonrogon**](https://github.com/gonrogonpm)
*   This project was created as part of The Odin Project curriculum.
*   Uses icons from [Material Design Icons](https://pictogrammers.com/library/mdi/) (implicitly through design).
*   Utilizes the [date-fns](https://date-fns.org/) library for date manipulation.
*   Utilizes the [nanoid](https://github.com/ai/nanoid) library for unique ID generation.
*   Built and bundled with [webpack](https://webpack.js.org/).

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).