---
description: Bug fixing workflow for qa-frontend with diagnosis, TDD reproduction, and validation
argument-hint: "Bug description (e.g., 'ReportForms list not updating after filter change')"
---

# QA Frontend: Bug Fix Workflow

Systematic bug fixing workflow following Test-Driven Development principles.

## Workflow Steps

### Step 1: Bug Diagnosis

Analyze the bug and identify root cause:

```bash
# Check recent changes
git log --oneline -10

# Check git status for uncommitted changes
git status

# Run type check to find TypeScript errors
npm run type-check:errors-only
```

Read relevant files:
- Component with the bug
- Related Redux slice
- API endpoints
- Similar working features for comparison

### Step 2: Create Reproduction Test (TDD Red)

Write a failing test that reproduces the bug:

```typescript
// Example: src/widgets/report-forms/__tests__/bug-reproduction.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ReportFormsList } from '../ui/ReportFormsList';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe('Bug: Filter not updating report forms', () => {
  it('should update filtered forms when filter changes', async () => {
    // Setup mock API
    const server = setupServer(
      rest.get('/api/qcp/reportforms', (req, res, ctx) => {
        const status = req.url.searchParams.get('status');
        if (status === 'active') {
          return res(ctx.json([{ id: 1, status: 'active' }]));
        }
        return res(ctx.json([{ id: 1, status: 'draft' }]));
      })
    );
    server.listen();

    // Render component
    render(<ReportFormsList />);

    // Initial state - should show draft
    expect(await screen.findByText('draft')).toBeInTheDocument();

    // Change filter to active
    const filterSelect = screen.getByLabelText('Status');
    fireEvent.change(filterSelect, { target: { value: 'active' } });

    // BUG: This should show active but shows draft instead
    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    server.close();
  });
});
```

Run the test to confirm it fails (RED phase):

```bash
npm run test:run -- src/widgets/report-forms/__tests__/bug-reproduction.test.ts
```

### Step 3: Implement Fix

Analyze and fix the root cause:

**Common bug patterns in qa-frontend:**

1. **Stale closure in useEffect**
   ```typescript
   // Wrong
   useEffect(() => {
     const filtered = data.filter(/* uses stale state */);
   }, []); // Missing dependencies

   // Correct
   useEffect(() => {
     const filtered = data.filter(/* uses current state */);
   }, [data, filterCriteria]);
   ```

2. **Incorrect Redux selector memoization**
   ```typescript
   // Wrong
   const selectFiltered = (state: RootState) => state.forms.filter(/*...*/);

   // Correct - use createSelector
   const selectFiltered = createSelector(
     [(state: RootState) => state.forms, (state, filter) => filter],
     (forms, filter) => forms.filter(/*...*/)
   );
   ```

3. **Rambda misuse with React lifecycle**
   ```typescript
   // Wrong - inside useEffect callback
   useEffect(() => {
     const result = pipe(data, filter(active), map(transform));
     // Rambda pipe may not re-run when dependencies change
   }, [data]);

   // Correct - wrap in useCallback
   const processData = useCallback(() => {
     return pipe(data, filter(active), map(transform));
   }, [data]);
   ```

### Step 4: Verify Fix (TDD Green)

Run the test again to confirm it passes:

```bash
npm run test:run -- src/widgets/report-forms/__tests__/bug-reproduction.test.ts
```

### Step 5: Add Regression Test

Move the reproduction test to permanent test suite:

```bash
# Rename from bug-reproduction.test.ts to filter-behavior.test.ts
```

### Step 6: Quality Validation

```bash
# Full quality check
npm run quality:pre-commit

# Type check
npm run type-check

# Lint
npm run lint:fix

# All tests
npm run test:run:once
```

### Step 7: Test in Browser

```bash
# Start dev server
npm run dev

# Run Cypress in dev mode
npm run cy:dev:e2e
```

Manually test:
1. Reproduce the original bug scenario
2. Verify the fix works
3. Test edge cases

### Step 8: Commit Fix

Use conventional commit with bug fix prefix:

```
bugfix(report-forms): fix filter not updating data

Root cause: Stale closure in useEffect missing dependency
- Add filterCriteria to useEffect dependency array
- Add regression test for filter behavior
- Fixes #123

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Bug Diagnosis Checklist

- [ ] Recent changes reviewed
- [ ] Root cause identified
- [ ] Failing test written (RED)
- [ ] Fix implemented
- [ ] Test passes (GREEN)
- [ ] Regression test added
- [ ] Quality checks pass
- [ ] Manual testing completed

## Common Bug Categories

### State Management Bugs
- Redux slice not updating correctly
- Selector returning stale data
- Thunk not dispatching actions

### Component Lifecycle Bugs
- useEffect dependencies missing
- Event handlers with stale closures
- Memory leaks from unsubscribed effects

### API Integration Bugs
- MSAL token not included in headers
- Response type mismatch
- Error state not handled

### Material-UI Bugs
- DataGrid not re-rendering on data change
- Dialog not closing
- Form validation not triggering

## Example Usage

```
/qa-bug-fix "ReportFormsList filter dropdown not updating the displayed items"
```

This will:
1. Analyze the bug and identify root cause
2. Create a failing reproduction test
3. Implement the fix
4. Verify the test passes
5. Run quality checks
6. Guide manual testing
