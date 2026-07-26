# Enterprise ERP Development Instructions

## Technology

- Laravel backend API
- React frontend with TypeScript
- PostgreSQL database
- Ant Design user interface
- React Native mobile application later

## Architecture

- Use a modular monolith.
- Keep the Laravel backend and React frontend separate.
- The Laravel application must provide REST JSON APIs.
- Do not use Laravel Blade for the ERP frontend.
- React and React Native must use the same backend API.

## Backend Rules

- Use strict typing where practical.
- Use Form Request classes for validation.
- Use API Resource classes for responses.
- Keep controllers thin.
- Put business logic in service or action classes.
- Use policies and permissions for authorization.
- Use database transactions for critical operations.
- Never expose stack traces or internal errors to users.
- Add audit logging for create, update, delete, approve and reject actions.
- Add automated tests for important business rules.

## Frontend Rules

- Use React with TypeScript.
- Use Ant Design for the professional user interface.
- Use TanStack Query for server data.
- Use React Hook Form for forms where suitable.
- Use Zod for frontend validation.
- Use reusable components.
- Use responsive layouts.
- Avoid oversized text and excessive visual effects.
- Keep forms professional and easy to scan.
- Support desktop, tablet and mobile screens.
- Include loading, empty, success and error states.

## Database Rules

- Use PostgreSQL.
- Use foreign keys.
- Use database indexes for frequently searched columns.
- Use NUMERIC instead of floating-point types for money.
- Include created_at and updated_at fields.
- Include created_by and updated_by when appropriate.
- Avoid destructive schema changes without migrations and backups.

## Security Rules

- Never commit passwords, tokens or environment files.
- Validate all data on the backend.
- Enforce authorization on the backend.
- Do not trust permissions sent by the frontend.
- Use secure authentication tokens.
- Rate-limit authentication endpoints.
- Log important security activity.

## Code Changes

Before changing code:

1. Read the existing related files.
2. Explain the intended change.
3. Modify only necessary files.
4. Run formatting.
5. Run tests.
6. Report any failures clearly.