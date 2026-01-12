---
description: Performance optimization workflow for qa-frontend React components with analysis, optimization, and validation
argument-hint: "Component or feature to optimize (e.g., 'ReportFormsList', 'warranty claims table')"
---

# QA Frontend: Performance Optimization

Analyze and optimize React component performance for qa-frontend project.

## Workflow Steps

### Step 1: Performance Analysis

Analyze the component for performance issues:

```bash
# Analyze component size and imports
npx vite-bundle-visualizer

# Check for circular dependencies
npm run analyze:deps:circular

# TypeScript analysis
npm run analyze:typescript
```

**Read the component and identify:**

1. **Unnecessary re-renders**
   - Components re-rendering when props haven't changed
   - Child components re-rendering due to parent state changes

2. **Large component bundles**
   - Heavy dependencies imported
   - Non-code-split routes

3. **Expensive computations**
   - Complex filtering/sorting in render
   - Large data processing without memoization

### Step 2: Identify Optimization Targets

Common performance anti-patterns:

```typescript
// ❌ ANTI-PATTERN: Computation in render
const Component = ({ data }: Props) => {
  // Runs on every render!
  const filtered = data.filter(/* complex filter */);
  const sorted = filtered.sort(/* complex sort */);

  return <DataGrid rows={sorted} />;
};

// ✅ OPTIMIZED: useMemo for expensive computations
const Component = ({ data }: Props) => {
  const filtered = useMemo(
    () => data.filter(/* complex filter */),
    [data] // Only re-compute when data changes
  );
  const sorted = useMemo(
    () => filtered.sort(/* complex sort */),
    [filtered]
  );

  return <DataGrid rows={sorted} />;
};
```

```typescript
// ❌ ANTI-PATTERN: New callback on every render
const Component = () => {
  const handleClick = () => {
    // Handler logic
  };
  return <Button onClick={handleClick}>Click</Button>;
};

// ✅ OPTIMIZED: useCallback for stable reference
const Component = () => {
  const handleClick = useCallback(() => {
    // Handler logic
  }, []); // Empty deps = function never changes

  return <Button onClick={handleClick}>Click</Button>;
};
```

```typescript
// ❌ ANTI-PATTERN: Child re-renders unnecessarily
const Parent = ({ items }: Props) => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild items={items} />
      {/* ExpensiveChild re-renders when count changes! */}
    </>
  );
};

// ✅ OPTIMIZED: React.memo to prevent unnecessary re-renders
const ExpensiveChild = React.memo(({ items }: Props) => {
  return <DataGrid rows={items} />;
});
```

### Step 3: Apply Optimizations

#### 3.1. Component Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';
import type {} from '@mui/material/themeCssVarsAugmentation';

// Memo the entire component if props don't change often
export const ReportFormsList = memo<Props>(({
  reportForms,
  onStatusChange,
  selectedIds,
}) => {
  // Memo expensive computations
  const filteredForms = useMemo(
    () => reportForms.filter(form => form.status !== 'archived'),
    [reportForms]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'name', headerName: 'Name', width: 200 },
      // ... more columns
    ],
    [] // Columns definition is static
  );

  // Memo callback props
  const handleRowClick = useCallback(
    (row: ReportForm) => () => onStatusChange(row.id),
    [onStatusChange]
  );

  return (
    <DataGrid
      rows={filteredForms}
      columns={columns}
      onRowClick={handleRowClick}
      checkboxSelection
      rowSelectionModel={selectedIds}
    />
  );
});

ReportFormsList.displayName = 'ReportFormsList';
```

#### 3.2. Redux Selector Optimization

```typescript
// ❌ BEFORE: Selector runs on every state change
const selectReportForms = (state: RootState) => state.qcp.reportForms;

// ✅ AFTER: Memoized selector with createSelector
import { createSelector } from '@reduxjs/toolkit';

const selectReportForms = (state: RootState) => state.qcp.reportForms;
const selectFilter = (state: RootState) => state.qcp.filter;

export const selectFilteredReportForms = createSelector(
  [selectReportForms, selectFilter],
  (forms, filter) => {
    return forms.filter(form =>
      (!filter.status || form.status === filter.status) &&
      (!filter.search || form.name.includes(filter.search))
    );
  }
);

// In component:
const filteredForms = useAppSelector(selectFilteredReportForms);
```

#### 3.3. Rambda Optimization

```typescript
import { pipe, filter, map, sort } from 'rambda';

// ❌ BEFORE: Chain runs on every render
const Component = ({ data }) => {
  const result = pipe(
    data,
    filter(isActive),
    map(transform),
    sort(byDate)
  );
  return <List items={result} />;
};

// ✅ AFTER: Memoize the entire pipeline
const Component = ({ data }) => {
  const result = useMemo(
    () => pipe(data, filter(isActive), map(transform), sort(byDate)),
    [data]
  );
  return <List items={result} />;
};
```

#### 3.4. Code Splitting for Routes

```typescript
// src/app/router.tsx
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy load route components
const ReportFormsPage = lazy(() =>
  import('~/pages/qcp/report-forms').then(m => ({ default: m.ReportFormsPage }))
);

const WarrantyClaimsPage = lazy(() =>
  import('~/pages/warranty-claims').then(m => ({ default: m.WarrantyClaimsPage }))
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    }>
      <Routes>
        <Route path="/report-forms" element={<ReportFormsPage />} />
        <Route path="/warranty-claims" element={<WarrantyClaimsPage />} />
      </Routes>
    </Suspense>
  );
};
```

### Step 4: Material-UI Specific Optimizations

```typescript
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Optimize DataGrid columns with memoization
const columns: GridColDef[] = [
  { field: 'id', width: 100 },
  { field: 'name', width: 200 },
  { field: 'status', width: 150 },
  // Use valueGetter for computed values
  {
    field: 'fullName',
    valueGetter: (value, row) => `${row.firstName} ${row.lastName}`,
    width: 250,
  },
  // Use renderCell for custom cells (memoize!)
  {
    field: 'actions',
    renderCell: memo((params) => (
      <ActionButton id={params.row.id} />
    )),
    width: 100,
  },
];

// Disable expensive features
<DataGrid
  rows={rows}
  columns={columns}
  pagination={false} // If showing all data
  disableColumnFilter // If not needed
  disableColumnSelector
  disableDensitySelector
  disableColumnMenu
/>
```

### Step 5: Bundle Size Optimization

```bash
# Analyze bundle
npm run build

# Check build output for:
# - Large chunks
# - Duplicate dependencies
# - Unused code
```

Add package hints to Vite config:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // MUI chunk
          'mui': ['@mui/material', '@mui/x-data-grid', '@emotion/react', '@emotion/styled'],
          // Redux chunk
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          // Azure AD chunk
          'azure': ['@azure/msal-browser', '@azure/msal-react'],
          // Other vendors
          'vendor': ['rambda', 'date-fns', 'lodash'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Step 6: Testing Optimizations

Verify optimizations don't break functionality:

```bash
# Run all tests
npm run test:run:once

# Type check
npm run type-check

# Lint
npm run lint
```

### Step 7: Performance Validation

Before/after comparison:

```typescript
// Add performance marks
import { useEffect, useState } from 'react';

export const Component = () => {
  useEffect(() => {
    performance.mark('component-mount');
    return () => {
      performance.mark('component-unmount');
      performance.measure('component-lifetime', 'component-mount', 'component-unmount');
      const measure = performance.getEntriesByName('component-lifetime')[0];
      console.log(`Component lived for ${measure.duration}ms`);
    };
  }, []);

  // ... rest of component
};
```

### Step 8: Document Changes

```
perf(report-forms): optimize ReportFormsList rendering performance

Optimizations applied:
- useMemo for filtered/sorted data
- useCallback for event handlers
- React.memo for component
- Optimized Redux selectors with createSelector
- Code splitting for lazy-loaded routes

Before: 500ms render time, 80ms script, 2MB bundle
After: 50ms render time, 30ms script, 1.5MB bundle

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Performance Checklist

- [ ] Component analyzed for re-renders
- [ ] Expensive computations memoized with useMemo
- [ ] Event handlers stabilized with useCallback
- [ ] Child components wrapped with React.memo
- [ ] Redux selectors optimized with createSelector
- [ ] Code splitting applied for routes
- [ ] Material-UI components optimized
- [ ] Bundle size reduced
- [ ] All tests still pass
- [ ] Manual testing confirms functionality

## Example Usage

```
/qa-performance "ReportFormsList with 1000 rows rendering slowly"
```

This will:
1. Analyze the component for performance issues
2. Identify optimization targets
3. Apply React.memo, useMemo, useCallback
4. Optimize Redux selectors
5. Validate with tests
6. Measure improvement
