import { Controller } from "../Controller.js";
import { Search } from "../Search.js";
import { SearchMenu } from "../SearchMenu.js";
import { format, add } from "date-fns";

export class SearchController extends Controller {
    constructor(app) {
        super(app);
    }

    handleObjectRendered(renderer, target, context, result) {
        if (target instanceof SearchMenu) {
            this.#handleSearchMenuRendered(renderer, target, context, result);
            return;
        }

        if (target instanceof Search) {
            this.#handleSearchRendered(renderer, target, context, result);
            return;
        }
    }

    #handleSearchMenuRendered(renderer, target, context, result) {
        const buttons = result.querySelectorAll("button");
        buttons.forEach(button => {
            button.addEventListener("click", () => this.#handleSearchButtonClick(button));
        });
    }

    #handleSearchRendered(renderer, target, context, result) {}

    #handleSearchButtonClick(button) {
        let search = null;

        switch (button.id) {
            case "search-all":   search = new Search({ title: "all" }); break;
            case "search-today": search = new Search({ title: "today", begDate: new Date(), endDate: new Date()}); break;
            case "search-week":
                const beg = new Date();

                const dayOfWeek = parseInt(format(beg, "i"));
                const daysToAdd = 7 - dayOfWeek;
                const end = add(beg, { days: daysToAdd });

                search = new Search({ title: "this week", begDate: beg, endDate: end });
                break;
        }

        let result = search.getAll(this.app.library);
        if (result.length <= 0) {
            result = null;
        }

        if (search != null) {
            this.app.renderSearch(search, result);
        }
    }
}