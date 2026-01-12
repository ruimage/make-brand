---
description: Migrate existing Redux thunks to RTK Query with Zod validation for qa-frontend
argument-hint: "Slice name to migrate (e.g., 'reportForms', 'warrantyClaims')"
---

# QA Frontend: Migrate to RTK Query

Migrate existing Redux Toolkit slice with manual thunks to modern RTK Query `createApi` pattern.

## Migration Steps

### Step 1: Analyze Existing Code

Read and analyze:
```typescript
// Current location: src/entities/{feature}/model/slices/{feature}-slice.ts
```

Identify:
- Async thunks with `createAsyncThunk`
- Manual fetch calls with `msalFetch`
- Action types for pending/fulfilled/rejected
- Error handling patterns

### Step 2: Create Zod Schemas

Define response validation:

```typescript
// src/entities/{feature}/api/schema.ts
import { z } from 'zod';

export const ReportFormSchema = z.object({
  pfRfParameterId: z.number(),
  pfRfParameterText: z.string(),
  pfRfParameterTextRus: z.string().optional(),
  pfRfParameterTextChi: z.string().optional(),
});

export const ReportFormsResponseSchema = z.array(ReportFormSchema);

export type ReportForm = z.infer<typeof ReportFormSchema>;
```

### Step 3: Create RTK Query API

Replace thunks with `createApi`:

```typescript
// src/entities/{feature}/api/{feature}.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';
import { ReportFormsResponseSchema } from './schema';

export const reportFormsApi = createApi({
  reducerPath: 'reportFormsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ADDRESS,
    prepareHeaders: async (headers) => {
      // Get MSAL token and add to headers
      const token = await getAccessToken();
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['ReportForm'],
  endpoints: (builder) => ({
    getReportForms: builder.query<ReportForm[], void>({
      query: () => '/api/qcp/reportforms',
      providesTags: ['ReportForm'],
      transformResponse: (response) => ReportFormsResponseSchema.parse(response),
    }),
  }),
});

export const { useGetReportFormsQuery } = reportFormsApi;
```

### Step 4: Update Slice

Remove thunks, keep only synchronous state:

```typescript
// Before: slice with extraReducers for thunks
// After: slice with only local state
const slice = createSlice({
  name: 'reportForms',
  initialState,
  reducers: {
    // Keep only synchronous reducers
    setFilter: (state, action) => { /* ... */ },
  },
});
```

### Step 5: Update Components

Replace thunk dispatches with hooks:

```typescript
// Before
import { useDispatch } from 'react-redux';
import { requestReportForms } from './slice';

const dispatch = useDispatch();
useEffect(() => { dispatch(requestReportFormsAction()); }, []);

// After
import { useGetReportFormsQuery } from '../api/reportForms';

const { data, isLoading, error } = useGetReportFormsQuery();
```

### Step 6: Add to Store

Configure API reducer and middleware:

```typescript
// src/app/store/store.ts
import { reportFormsApi } from '../../entities/report-forms/api/reportForms';

export const store = configureStore({
  reducer: {
    [reportFormsApi.reducerPath]: reportFormsApi.reducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reportFormsApi.middleware),
});

// Setup types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 7: Update Tests

Replace thunk tests with hook tests:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { setupApiTestHandlers } from '@/test-utils/msw';

describe('useGetReportFormsQuery', () => {
  setupApiTestHandlers(
    rest.get('/api/qcp/reportforms', (req, res, ctx) => {
      return res(ctx.json([{ id: 1, name: 'Form 1' }]));
    })
  );

  it('should fetch report forms', async () => {
    const { result } = renderHook(() => useGetReportFormsQuery(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});
```

### Step 8: Quality Checks

```bash
npm run quality:pre-commit
npm run type-check
```

## Migration Checklist

- [ ] Zod schema created with `z.infer` types
- [ ] RTK Query API with `createApi`
- [ ] MSAL token in `prepareHeaders`
- [ ] `transformResponse` with Zod validation
- [ ] Tags for cache invalidation
- [ ] Component hooks updated
- [ ] Slice simplified (sync only)
- [ ] Store configured with API reducer
- [ ] Tests updated to hooks
- [ ] All quality checks pass

## Example Usage

```
/qa-migrate-rtk "reportForms"
```

This will:
1. Read existing reportForms slice
2. Create Zod schema for API response
3. Generate RTK Query API
4. Update components to use hooks
5. Update tests
6. Run quality checks
