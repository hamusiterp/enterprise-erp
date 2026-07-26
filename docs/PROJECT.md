# Enterprise ERP

## Technology Stack

- Backend: Laravel
- Frontend: React with TypeScript
- Database: PostgreSQL
- Mobile: React Native
- UI framework: Ant Design
- API format: REST with JSON
- Architecture: Modular monolith

## Initial Modules

1. Authentication
2. Users
3. Roles and permissions
4. Companies
5. Branches
6. Departments
7. Menus
8. Approval workflows
9. Notifications
10. Audit logs
11. Dashboard

## Development Principles

- Use clear module boundaries.
- Keep business logic outside controllers.
- Validate every API request.
- Protect every private API endpoint.
- Record important actions in audit logs.
- Use PostgreSQL transactions for critical operations.
- Use numeric database fields for financial amounts.
- Build APIs that can be reused by web and mobile applications.
- Test important business rules.
- Never store passwords or secrets in source code.