# Angular 7 to Angular 22 calendar migration

* Angular 22.2, Node 24.15+, TypeScript 6.0.
* angular-calendar 0.32.2 (requires date-fns 4), standalone calendar components.
* Preserved month/week/day views, add/edit/remove events and drag/resize where supported by calendar components.
* Old external-event drag/drop, drag-to-create, Bootstrap modal and Flatpickr demo were not ported. Review behavior before merge.
* Events are **in memory only**. No server-side persistence, matching the original demo.
* npm install regenerates the lockfile; old Angular 7 package-lock was removed.
* CI builds production bundle only. Browser-level feature tests not yet automated.
