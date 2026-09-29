# Assignment Notes

## What I would test next

- Test assigning a task with a whitespace-only assignee.
- Test assigning a task that already has an assignee.
- Test requests with missing or invalid request bodies.
- Test pagination with different page and limit values.
- Test the API with a larger number of tasks.

## What surprised me

The pagination logic had an off-by-one issue. Page 1 was starting from the second page of results because the offset was calculated as `page * limit` instead of `(page - 1) * limit`.

I also noticed that the application uses an in-memory task store, so all data is lost when the server restarts.

## Questions before production

- Should tasks and assignments be stored in a database?
- Should a task be allowed to be reassigned?
- Should assignees be validated against registered users?
- What authentication and authorization rules should be added?
- What should happen when multiple requests update the same task at the same time?
- What logging and monitoring should be added?
