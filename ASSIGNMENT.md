# Task API Assignment

## Overview

This project is a Task Manager REST API built with Node.js and Express.

The assignment was mainly about understanding an existing backend project, testing its behavior, finding bugs, fixing one bug, and adding a small feature.

The API uses an in-memory task store, so the data is reset whenever the server is restarted.

## What I Worked On

### 1. Tested the Existing API

I tested the existing endpoints and added tests for the main API flows.

The tests cover:

- Getting all tasks
- Creating a task
- Updating a task
- Deleting a task
- Completing a task
- Getting task statistics
- Getting tasks by status
- Pagination
- Invalid task IDs
- Invalid request data

I used Jest for unit tests and Supertest for API tests.

### 2. Found and Fixed a Bug

I found a pagination issue in `taskService.js`.

The first page was skipping the first tasks because the offset was calculated as:

```js
const offset = page * limit;
```
