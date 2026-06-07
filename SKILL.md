---
name: backend-mvc-skill
description: 'Generate or update backend code using Express, MongoDB/Mongoose, JWT auth, and MVC structure.'
argument-hint: What backend task do you want to implement?
disable-model-invocation: true
---

This skill guides creation and maintenance of the backend for this application.

## Outcome
- Express.js backend with MVC architecture
- MongoDB data layer using Mongoose
- JWT authentication
- Controllers in `controllers/`
- Models in `models/`
- Routes in `routes/`
- JSON-only API responses
- Async/await for asynchronous operations

## Workflow
1. Identify the endpoint or feature requested.
2. Define the Mongoose model in `models/` with schema, validation, and timestamps.
3. Implement controller methods in `controllers/` that use async/await and return JSON payloads.
4. Wire routes in `routes/` using Express Router and map them to controller functions.
5. Use middleware for authentication, error handling, and request validation.
6. Keep backend logic separated: controllers handle business rules, models handle schema/data access, routes handle HTTP mapping.

## Quality checks
- All route handlers should return `res.json(...)` or appropriate JSON error responses.
- Use `try/catch` in async controller functions and forward errors to middleware.
- Keep JWT usage in auth middleware and token generation in controller or utility helpers.
- Maintain consistent folder and naming convention.
- Avoid inline database logic in route files.

## Example prompt usage
- "Create a protected user profile route using JWT auth and Express MVC."
- "Add a Mongoose model and controller for travel requests."
- "Implement login and register endpoints returning JSON tokens."
