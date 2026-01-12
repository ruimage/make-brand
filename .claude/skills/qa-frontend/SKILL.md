---
name: QA Frontend Development
description: Specialized development for qa-frontend React/Redux/TypeScript project with Material-UI, Azure AD, Rambda, and Cypress testing. Automatically activates when working with qa-frontend codebase, Redux slices, Material-UI components, or testing. Triggers on: qa-frontend, ReportForms, warranty claim, rtk query, material-ui, vitest, cypress.
allowed-tools:
  - mcp__redux-toolkit__*
  - mcp__rambda__*
  - mcp__cypress__*
  - mcp__effect-docs__*
  - mcp__plugin_context7_context7__*
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# QA Frontend Development Specialist

Specialized assistant for **qa-frontend** project - React 18.2.0 + TypeScript 5.4.3 + Redux Toolkit + Material-UI + Cypress application.

## Project Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.4.3 | Type safety |
| Redux Toolkit | 1.9.3 | State management |
| Material-UI | 5.15.14 | Component library |
| Rambda | 9.3.0 | Functional programming |
| Vitest | 3.2.4 | Unit testing |
| Cypress | 15.7.0 | E2E testing |
| Zod | 3.25.74 | Schema validation |
| Azure AD (MSAL) | 3.14.0 | Authentication |
| Sentry | 8.42.0 | Error monitoring |
| Vite | 5.4.12 | Build tool |

## Project Structure (FSD Architecture)

```
qa-frontend/src/
├── app/           # Application configuration, providers
├── pages/         # Route pages
├── widgets/       # Composite components
├── features/      # Business features
├── entities/      # Business entities
├── shared/        # Reusable code
│   ├── api/       # API utilities
│   ├── lib/       # Utility functions
│   ├── hooks/     # Custom hooks
│   └── ui/        # UI components
└── processes/     # Cross-feature processes
```

## Key Patterns

### Redux Slice Pattern
```typescript
// src/entities/{feature}/model/slices/{name}-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface State {
  data: Item[];
  isLoading: boolean;
  error: SerializedError | null;
}

const slice = createSlice({
  name: 'featureName',
  initialState,
  reducers: { /* actions */ },
  extraReducers: (builder) => {
    // Add async action handlers
  },
});
```

### Rambda Usage
```typescript
import { pipe, map, filter } from 'rambda';

// Use pipe for data transformations
const result = pipe(
  items,
 (filter)(isActive),
  (map)(transformData)
);
```

### Component Pattern with Material-UI
```typescript
import { Box, Typography, Button } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation'; // For theme types

export const Component: React FC<Props> = ({ data }) => {
  return (
    <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
      <Typography variant="h6">{data.title}</Typography>
      <Button variant="contained">Action</Button>
    </Box>
  );
};
```

## When Activating

This skill automatically activates when:
- Working in `qa-frontend/` directory
- Modifying Redux slices or store
- Creating Material-UI components
- Writing Vitest or Cypress tests
- Using Rambda functions
- Working with Azure AD authentication

## Key Commands Available

Use these MCP tools for development:
- **Redux Toolkit docs**: `mcp__redux-toolkit__search_redux_toolkit_docs`
- **Rambda docs**: `mcp__rambda__search_rambda_documentation`
- **Cypress docs**: `mcp__cypress__search_cypress_documentation`
- **Effect docs**: `mcp__effect-docs__get_effect_doc`
- **Context7**: `mcp__plugin_context7_context7__query-docs`

## Quality Standards

Follow qa-frontend conventions:
1. Use functional programming with Rambda for data transformations
2. Keep Rambda separate from React hooks
3. Use Material-UI sx prop for styling
4. Write Vitest tests for utilities and hooks
5. Write Cypress tests for user flows
6. Use Zod for API response validation
7. Follow FSD layer hierarchy strictly

## Testing Guidelines

### Vitest Pattern
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.state).toBe('initial');
  });
});
```

### Cypress Pattern
```typescript
describe('Feature', () => {
  beforeEach(() => {
    cy.loginWithAzureAD(); // Custom command
    cy.visit('/feature-page');
  });

  it('should display data', () => {
    cy.get('[data-testid="feature-list"]').should('be.visible');
  });
});
```

## Common Tasks

1. **Create new Redux slice** with types and async thunks
2. **Create Material-UI component** following design system
3. **Write tests** using Vitest for unit, Cypress for E2E
4. **Use Rambda** for data processing utilities
5. **Integrate with Azure AD** for authenticated features
6. **Add error tracking** with Sentry for error boundaries
