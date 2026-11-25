## Application Structure

**Pages and components**
The app has two pages: `HomePage`, which shows the title and a short introduction, and `EntriesPage`, which loads and lists the entries from the backend. `EntriesPage` uses two reusable components: `LearningEntryForm`, which holds the form and saves a new entry with POST, and `LearningEntry`, which displays a single entry. `App.tsx` now only contains the navigation links and the routes.

**What React, Express and MariaDB do**
React is the frontend. It shows the user interface, handles form input and sends requests to the backend. Express is the backend. It receives HTTP requests at `/api/entries`, runs the SQL queries and returns JSON. MariaDB stores the entries permanently, so they are still there after the page is refreshed or the servers are restarted.

**`/entries` vs `GET /api/entries`**
`/entries` is a frontend route. It only tells React Router which page to show in the browser, here the Entries page. `GET /api/entries` is a backend API route on the Express server. It does not show a page but returns the saved entries as JSON data.

**Why REST is a reasonable choice**
The app has one clear resource, learning entries, and only simple operations on it: `GET /api/entries` retrieves the list and `POST /api/entries` adds a new one.

## State Management

Form field values such as the topic and comment are local React state because only the form component uses them. Learning entries are shared Zustand state because multiple React components need the same current list. MariaDB remains necessary because Zustand stores stuff in memory only. Refreshing the browser resets the Zustand store, while saved records remain in MariaDB and can be loaded again with `GET /api/entries`.

## Testing & Reliability

### Automated tests

Run the two validation unit tests from the `backend` folder:

npm test

- Confidence: rejects values outside `1-5` and accepts a valid integer.
- Non-blank text: rejects empty and whitespace-only values and accepts text.
- Actual result: 2 tests passed, 0 failed.

The tests use the same exported functions that `POST /api/entries` uses.

### Manual checks

| Input or action | Expected | Actual | Pass/Fail |
|---|---|---|---|
| Empty topic | HTTP 400 and no database write | HTTP 400 JSON validation error; route returned before SQL | Pass |
| Confidence = 100 | HTTP 400 and no database write | HTTP 400 JSON validation error; route returned before SQL | Pass |
| Missing comment (required additional property) | HTTP 400 and no database write | HTTP 400 JSON validation error; route returned before SQL | Pass |
| Stop Express and submit a valid form | Useful connection error and unchanged entry list | React catch block shows a connection/save confirmation message and does not call `loadEntries()` or update Zustand | Pass |