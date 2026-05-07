# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the CRA dev server at http://localhost:3000.
- `npm run build` — production bundle into `build/`.
- `npm test` — Jest in CRA watch mode. There are no test files in `src/` yet, so the runner will report no tests until specs (`*.test.js`) are added.

There is no lint script; CRA's `react-scripts` runs the `react-app` ESLint config inline during `start`/`build`.

## Architecture

### Frontend (React 16, Create React App)

- Entry [src/index.js](src/index.js) renders a single `<Layout/>` — there is no router.
- [src/components/Layout/Layout.js](src/components/Layout/Layout.js) is the application's state container. It owns `year`, `month`, the `albums` list, and the two `Modal`s (add/edit and error). The data-loading effect re-runs whenever `loading` flips true, and a separate effect flips `loading` true when `year` or `month` change — that's the refresh mechanism after edits.
- Children are coordinated through callback props passed down from `Layout`:
  - `Header` opens the date-picker modal and calls `changeDate(year, month)`.
  - `Content` switches between `Loading`/`Albums`/`NoAlbums`. Album cards are double-click → `openEditModal(item)`.
  - `AddAlbumBlock` handles both add and edit (`mode` prop); on success it calls `okCallback`, which closes the modal and triggers a reload.
- Styling is **glamorous** (CSS-in-JS). Shared styled primitives live in [src/components/glamorous/](src/components/glamorous/); responsive breakpoints come from `MediaQueries.js`. There is no global stylesheet.

### Backend API call paths

There are **two** server endpoints, used for different request shapes:

- `serverUrl = '/api/albums'` — used by [src/request.js](src/request.js), which is a `fetch`-based wrapper that posts `application/x-www-form-urlencoded`. Used for `list` and `delete` actions.
- `serverUrlNew = '/api/albums-new'` — used directly by `AddAlbumBlock` via **superagent** for `multipart/form-data` so the cover image file can be attached. Used for `add` and `edit` actions.

Both endpoints accept an `action` field switching between `list | add | edit | delete`. Image URLs are constructed from `imgUrl` in [src/config.js](src/config.js) (`https://chi247.me/albums-covers/` + `cover` filename).

### PHP server (reference only)

[server/albums.php](server/albums.php) is the dispatcher; [server/db.func.php](server/db.func.php) implements the four actions. Notes if you edit it:

- Uses the legacy `mysql_*` extension (removed in PHP 7+) — this code only runs on PHP 5.x.
- `albums_add` / `albums_edit` write uploaded covers to `../img/<year>_<month>_<timestamp>` and store the basename in the `cover` column.
- Auth is a single shared `$edit_pass` in [server/config.php](server/config.php), checked in PHP for `add`/`edit`/`delete`. The password is sent in plain form fields from the client.
- The `server/` directory is a deployment artifact, not wired into the dev server. `npm start` will not proxy `/api/*` anywhere — there is no `proxy` field in `package.json` and no `setupProxy.js`.

## Conventions and gotchas

- **Default year is last year**, not current: `Layout.js` initializes `year` to `d.getFullYear() - 1`. Don't "fix" this without checking — it's intentional for browsing the previous year's catalog by default.
- **`month` is a 2-char string** (`"01"`–`"12"`, plus `"00"` meaning "all months" in list mode). Components consistently re-zero-pad with `` `0${parseInt(month)}`.slice(-2) ``. Preserve the string type when threading state.
- `ChooseDate` has two `mode`s: `"list"` includes "All years"/"All months" sentinels (year `0`, month `00`); `"add"` does not.
- [src/components/Albums/Album.js](src/components/Albums/Album.js) imports `mobx-react` (`observer`), but **mobx-react is not in package.json**. The import is unused at runtime (no `@observer` decorator is applied), so the app still builds — but adding any actual mobx use will require installing the dep. Same file references `item.copyrightString`, while the API returns `copyright`; the field renders empty today.
