---
description: Complete feature development workflow for qa-frontend with RTK Query, Material-UI components, TDD, and code review
argument-hint: "Feature description (e.g., 'ReportForms list with filtering')"
---

# QA Frontend Feature Development

Complete feature development workflow for qa-frontend project following best practices.

## Workflow Steps

Execute these steps in order:

### Step 1: Create RTK Query Endpoint

Generate type-safe API endpoint with Zod validation:

```bash
# Use: rtk-query-endpoint-generator skill
# Generate: API endpoint with Zod schema
# Output: src/shared/api/{feature}/{feature}.ts
```

Example request:
```
Create RTK Query endpoint for GET /api/qcp/report-forms with:
- Response type: ReportForm[] with id, name, description
- Zod validation schema
- Error handling with SerializedError
```

### Step 2: Create Material-UI Component

Generate React component with Material-UI:

```typescript
// Component should:
import { Box, Typography, DataGrid, GridColDef } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';

// Use sx prop for styling
// Use data-testid for testing
// Follow existing patterns in src/widgets/{feature}/ui/
```

### Step 3: Write TDD Tests

Create Vitest tests before implementation:

```bash
npm run test:watch
```

Test pattern:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useReportForms } from './useReportForms';

describe('useReportForms', () => {
  it('should fetch report forms successfully', async () => {
    // Arrange: Mock MSAL fetch
    // Act: Render hook
    // Assert: Check results
  });
});
```

### Step 4: Code Review

Run quality checks:

```bash
npm run quality:pre-commit
```

This runs:
- Prettier formatting
- ESLint with auto-fix
- TypeScript type check (fast mode)
- Vitest tests

### Step 5: Commit

Conventional commit format:
```
feat(feature-name): add component description

Detailed implementation notes:
- RTK Query endpoint with Zod validation
- Material-UI DataGrid component
- Vitest tests with 100% coverage
```

## Quality Checklist

Before completing:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (0 warnings)
- [ ] All tests pass
- [ ] Component has data-testid attributes
- [ ] Error handling with user-friendly messages
- [ ] Loading states for async operations
- [ ] Azure AD authentication considered
- [ ] Sentry error tracking if applicable

## Example Usage

```
/qa-feature-dev "Add ReportFormsList component with filtering by status and date range"
```

This will:
1. Create Zod schema for ReportForm
2. Generate RTK Query endpoint
3. Create Material-UI DataGrid component
4. Write Vitest tests
5. Run quality checks
