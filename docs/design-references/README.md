# Design review references

- [Library implementation handoff](../library-design-handoff.md): the selected Raised rows design, with dimensions, behavior, and acceptance criteria.
- [Library screenshot](library-raised-rows.png): the user's selected visual reference.
- [Library preview source](library-raised-rows-preview.html): Raised rows and Quiet list alternatives; Raised rows is the selected direction.
- [Group preview source](group-header-options-preview.html): Ivory header and Slim green bar alternatives. These remain design proposals, not instructions to change the group page.

The HTML files are inline preview fragments, not production pages or standalone applications. They use the Codex visualization runtime for variant switching, Lucide icons, and optional design controls. They include their existing artwork as embedded data and load Rubik from Google Fonts. An implementing AI can read their CSS, markup, and local interactions; the library handoff is authoritative for production behavior and responsive requirements.

The preview's fixed mobile frames, dotted surroundings, and variant controls must not be copied into the application. Group preview choices are local demonstrations and do not save data.

Publishing these documents does not implement the proposed UI. No application code is changed by this design handoff.
