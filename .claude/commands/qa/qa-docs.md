---
description: Setup Context7 MCP server queries for Material-UI, Vitest, Cypress, and other qa-frontend libraries
argument-hint: "Library name to setup (optional, or leave empty for all qa-frontend libraries)"
---

# QA Frontend: Context7 Setup

Configure Context7 MCP server for quick access to qa-frontend library documentation.

## Pre-configured Library Queries

Use these Context7 queries for instant documentation access:

### Material-UI (MUI)

```bash
# Query: Material-UI DataGrid documentation
Context7 query: "/mui/material-ui" "DataGrid pagination filtering sorting"
```

**Common queries:**
- DataGrid customization and styling
- Form validation with TextField
- Dialog and Modal usage
- DatePicker integration
- Theme customization with sx prop

### Redux Toolkit

```bash
# Query: RTK Query documentation
Context7 query: "/reduxjs/redux-toolkit" "createApi baseQuery transformResponse"
```

**Common queries:**
- createApi for RTK Query
- createSelector for memoized selectors
- createAsyncThunk patterns
- configureStore setup

### Rambda

```bash
# Query: Rambda functional programming
Context7 query: "/selfrefactor/rambda" "pipe filter map sort groupBy"
```

**Common queries:**
- pipe for function composition
- filter, map, reduce for arrays
- path/paths for nested access
- equals for deep comparison

### Vitest

```bash
# Query: Vitest testing framework
Context7 query: "vitest" "describe it expect beforeAfter vi.mock"
```

**Common queries:**
- renderHook for hook testing
- vi.mock for mocking
- test coverage setup
- UI integration testing

### Cypress

```bash
# Query: Cypress E2E testing
Context7 query: "/cypress-io/cypress" "cy.intercept cy.wait cy.visit testing-library"
```

**Common queries:**
- API mocking with cy.intercept
- Custom commands (cy.login)
- Component testing
- Page Object Pattern

### Zod

```bash
# Query: Zod schema validation
Context7 query: "zod" "z.object z.array z.discriminatedUnion refine"
```

**Common queries:**
- Schema composition
- Infer types from schema
- Error handling with ZodError
- Integration with React Hook Form

### TypeScript

```bash
# Query: TypeScript patterns
Context7 query: "typescript" "generics utility types infer"
```

**Common queries:**
- Generic type parameters
- Utility types (Pick, Omit, Partial)
- Type guards and discriminators
- Module resolution

## Quick Reference Commands

### 1. Material-UI Component Documentation

```
Get MUI docs for: DataGrid, Autocomplete, DatePicker, Dialog, Snackbar, Box, Stack
```

### 2. Redux Toolkit Patterns

```
Get RTK docs for: createApi, createSlice, createSelector, fetchBaseQuery
```

### 3. Testing Utilities

```
Get Vitest docs for: describe, it, expect, vi.mock, renderHook
Get Cypress docs for: cy.intercept, cy.wait, custom commands
```

### 4. Functional Programming

```
Get Rambda docs for: pipe, filter, map, reduce, groupBy, sortBy
```

## Integration with QA Frontend Commands

These Context7 queries are automatically used by:
- `/qa-feature-dev` - When creating components
- `/qa-migrate-rtk` - When migrating to RTK Query
- `/qa-bug-fix` - When diagnosing issues
- `/qa-performance` - When optimizing code

## Example: Complete Query Flow

```
User: "How do I add filtering to Material-UI DataGrid?"

1. Claude uses Context7:
   → Query: "/mui/material-ui" "DataGrid filtering server-side"

2. Context7 returns:
   → FilterModel type
   → onFilterModelChange prop
   → Server-side filtering example

3. Claude combines with:
   → Project's existing DataGrid patterns
   → Zod schema for filter types
   → RTK Query endpoint for filtered data

4. Result: Complete implementation with:
   - Type-safe filter model
   - API endpoint integration
   - Error handling
   - Loading states
```

## MCP Tool Usage

The Context7 MCP server provides these tools:

```typescript
// 1. Resolve library ID
mcp__plugin_context7_context7__resolve-library-id({
  libraryName: "@mui/material",
  query: "DataGrid filtering"
})

// 2. Query documentation
mcp__plugin_context7_context7__query-docs({
  libraryId: "/mui/material-ui",
  query: "DataGrid filtering sorting pagination"
})
```

## Available Libraries (Pre-configured)

| Library | Context7 ID | Purpose |
|---------|-------------|---------|
| Material-UI | /mui/material-ui | UI components |
| Redux Toolkit | /reduxjs/redux-toolkit | State management |
| Rambda | /selfrefactor/rambda | Functional programming |
| Vitest | vitest | Unit testing |
| Cypress | /cypress-io/cypress | E2E testing |
| Zod | zod | Schema validation |
| React Router | remix-run/react-router | Routing |
| MSAL React | azuread/microsoft-authentication-libraries-for-react | Azure AD |

## Usage Example

When you ask about any of these libraries, Claude will:
1. Automatically query Context7 for latest docs
2. Combine with your project's existing patterns
3. Provide code examples following qa-frontend conventions
4. Include type-safe implementations with TypeScript
