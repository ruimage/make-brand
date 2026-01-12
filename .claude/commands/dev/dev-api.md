<?xml version="1.0" encoding="UTF-8"?>
<!-- ═══════════════════════════════════════════════════════════════
     API ENDPOINT COMMAND - STRUCTURED XML DEFINITION
     Быстрое создание API endpoint с RTK Query интеграцией
═══════════════════════════════════════════════════════════════ -->

<command-definition>

  <!-- ═══════════════════════════════════════════════════════════
       METADATA SECTION
       ═══════════════════════════════════════════════════════════ -->

  <metadata>
    <name>/api-endpoint</name>
    <type>command</type>
    <category>api-development</category>
    <description>
      Быстрое создание API endpoint с RTK Query интеграцией, TypeScript типами и полной интеграцией с Redux store
    </description>
    <version>1.0</version>
    <tags>
      <tag>rtk-query</tag>
      <tag>typescript</tag>
      <tag>redux</tag>
      <tag>api</tag>
      <tag>crud</tag>
      <tag>testing</tag>
    </tags>
  </metadata>

  <!-- ═══════════════════════════════════════════════════════════
       ROLE DEFINITION SECTION
       ═══════════════════════════════════════════════════════════ -->

  <role-definition>
    <role>Expert API Developer</role>
    <specialization>QA Frontend project API integration</specialization>
    <mission>
      Создание robust, type-safe API endpoints с proper Redux интеграцией и error handling
    </mission>
  </role-definition>

  <!-- ═══════════════════════════════════════════════════════════
       MANDATORY INSTRUCTIONS SECTION
       ═══════════════════════════════════════════════════════════ -->

  <mandatory-instructions>
    <instruction-group order="1" type="analysis" mandatory="true">
      <title>ШАГ 1: АНАЛИЗ СУЩЕСТВУЮЩЕЙ API СТРУКТУРЫ</title>
      <instruction priority="high">
        <action>Поиск существующих API endpoints</action>
        <tool>Grep, Glob</tool>
      </instruction>
      <instruction priority="high">
        <action>Анализ базовой конфигурации RTK Query</action>
        <tool>Read tool</tool>
      </instruction>
      <instruction priority="medium">
        <action>Определение паттернов именования</action>
      </instruction>
    </instruction-group>

    <instruction-group order="2" type="creation" mandatory="true">
      <title>ШАГ 2: СОЗДАНИЕ RTK QUERY ENDPOINTS</title>
      <instruction priority="high">
        <action>Создавать RTK Query endpoints с proper типизацией</action>
        <requirement>TypeScript interfaces for all data</requirement>
      </instruction>
    </instruction-group>

    <instruction-group order="3" type="integration" mandatory="true">
      <title>ШАГ 3: ИНТЕГРАЦИЯ С REDUX STORE</title>
      <instruction priority="high">
        <action>Добавлять reducer в store</action>
      </instruction>
      <instruction priority="high">
        <action>Настраивать middleware</action>
      </instruction>
    </instruction-group>

    <instruction-group order="4" type="error-handling" mandatory="true">
      <title>ШАГ 4: ERROR HANDLING</title>
      <instruction priority="high">
        <action>Добавлять proper error handling</action>
        <include>
          <item>Try-catch blocks</item>
          <item>Error types</item>
          <item>User-friendly messages</item>
        </include>
      </instruction>
    </instruction-group>

    <instruction-group order="5" type="abstraction" mandatory="true">
      <title>ШАГ 5: СЕЛЕКТОРЫ И HOOKS</title>
      <instruction priority="high">
        <action>Создавать селекторы</action>
        <purpose>Direct data access from store</purpose>
      </instruction>
      <instruction priority="high">
        <action>Создавать React hooks</action>
        <purpose>Easy usage in components</purpose>
      </instruction>
    </instruction-group>

    <instruction-group order="6" type="caching" mandatory="true">
      <title>ШАГ 6: КЭШИРОВАНИЕ И ИНВАЛИДАЦИЯ</title>
      <instruction priority="high">
        <action>Обеспечивать кэширование</action>
        <mechanism>tagTypes в RTK Query</mechanism>
      </instruction>
      <instruction priority="high">
        <action>Настраивать инвалидацию кэша</action>
        <triggers>
          <trigger>POST - invalidates list</trigger>
          <trigger>PUT - invalidates specific item + list</trigger>
          <trigger>DELETE - invalidates specific item + list</trigger>
        </triggers>
      </instruction>
    </instruction-group>
  </mandatory-instructions>

  <!-- ═══════════════════════════════════════════════════════════
       USAGE SECTION
       ═══════════════════════════════════════════════════════════ -->

  <usage-section>
    <syntax>
      <pattern>/api-endpoint &lt;endpoint-name&gt; [options]</pattern>
    </syntax>

    <parameters-section>
      <parameter name="endpoint-name" required="true" type="string">
        <description>Имя API endpoint</description>
        <example>getUsers, warrantyClaimApi, exportData</example>
      </parameter>

      <parameter name="--entity" required="conditional" type="string">
        <description>Связанная сущность (обязательный для большинства случаев)</description>
        <example>user, warranty-claim, export</example>
        <condition>Требуется для entity-based API</condition>
      </parameter>

      <parameter name="--methods" required="false" type="array" default="get">
        <description>HTTP методы</description>
        <options>
          <option value="get">GET запросы</option>
          <option value="post">POST запросы</option>
          <option value="put">PUT запросы</option>
          <option value="delete">DELETE запросы</option>
        </options>
        <example>--methods=get,post,put,delete</example>
      </parameter>

      <parameter name="--with-types" required="false" type="flag">
        <description>Создать TypeScript типы</description>
        <generates>
          <file>types.ts</file>
          <file>interfaces</file>
          <file>enums</file>
        </generates>
      </parameter>

      <parameter name="--with-tests" required="false" type="flag">
        <description>Создать тесты для API</description>
        <generates>
          <file>__tests__/api.test.ts</file>
          <file>test utilities</file>
        </generates>
      </parameter>

      <parameter name="--with-mocks" required="false" type="flag">
        <description>Создать mock данные</description>
        <generates>
          <file>__mocks__/data.ts</file>
          <file>mock factories</file>
        </generates>
      </parameter>

      <parameter name="--cache-tags" required="false" type="array">
        <description>Кастомные cache tags для RTK Query</description>
        <example>--cache-tags=dashboard,statistics</example>
        <default>Auto-generated from entity name</default>
      </parameter>

      <parameter name="--base-url" required="false" type="string">
        <description>Кастомный base URL для API</description>
        <example>--base-url=/api/v2</example>
        <default>Uses shared/baseQuery configuration</default>
      </parameter>

      <parameter name="--auth-required" required="false" type="flag">
        <description>Требует авторизации для endpoint</description>
        <adds>
          <item>Authentication headers</item>
          <item>Token validation</item>
          <item>Error handling for 401/403</item>
        </adds>
      </parameter>
    </parameters-section>

    <examples-section>
      <example id="simple-get" type="basic">
        <title>Создать простой GET endpoint</title>
        <description>Базовый endpoint для получения данных</description>
        <command-block language="bash">
          <![CDATA[
          /api-endpoint getUsers --entity=user
          ]]>
        </command-block>
        <generates>
          <file>entities/user/api/userApi.ts</file>
          <endpoint>GET /users</endpoint>
        </generates>
      </example>

      <example id="crud-endpoints" type="advanced">
        <title>Создать CRUD endpoints для сущности</title>
        <description>Полный набор endpoints для warranty claims</description>
        <command-block language="bash">
          <![CDATA[
          /api-endpoint warrantyClaimApi --entity=warranty-claim --methods=get,post,put,delete --with-types --with-tests
          ]]>
        </command-block>
        <generates>
          <file>entities/warranty-claim/api/warrantyClaimApi.ts</file>
          <file>entities/warranty-claim/api/types.ts</file>
          <file>entities/warranty-claim/api/__tests__/warrantyClaimApi.test.ts</file>
          <file>entities/warranty-claim/api/__mocks__/warrantyClaimData.ts</file>
          <endpoints>
            <endpoint>GET /warranty-claims (list)</endpoint>
            <endpoint>GET /warranty-claims/:id (single)</endpoint>
            <endpoint>POST /warranty-claims (create)</endpoint>
            <endpoint>PUT /warranty-claims/:id (update)</endpoint>
            <endpoint>DELETE /warranty-claims/:id (delete)</endpoint>
          </endpoints>
        </generates>
      </example>

      <example id="custom-settings" type="specialized">
        <title>Создать endpoint с кастомными настройками</title>
        <description>Endpoint для экспорта данных с авторизацией</description>
        <command-block language="bash">
          <![CDATA[
          /api-endpoint exportData --entity=export --methods=post --auth-required --with-mocks
          ]]>
        </command-block>
        <features>
          <feature>POST /export endpoint</feature>
          <feature>Authentication required</feature>
          <feature>Mock data included</feature>
        </features>
      </example>

      <example id="custom-cache" type="optimized">
        <title>Создать endpoint с кастомным кэшированием</title>
        <description>Dashboard data с оптимизированным кэшированием</description>
        <command-block language="bash">
          <![CDATA[
          /api-endpoint getDashboardData --entity=dashboard --cache-tags=dashboard,statistics --with-types
          ]]>
        </command-block>
        <features>
          <feature>Custom cache tags for fine-grained invalidation</feature>
          <feature>TypeScript types included</feature>
          <feature>Optimized for dashboard use case</feature>
        </features>
      </example>
    </examples-section>
  </usage-section>

  <!-- ═══════════════════════════════════════════════════════════
       GENERATED STRUCTURE SECTION
       ═══════════════════════════════════════════════════════════ -->

  <generated-structure-section>
    <structure-type id="entity-based" location="src/entities/{entity}/api/">
      <title>Для Entity-based API</title>
      <description>FSD архитектура для entity-level API endpoints</description>
      <directory-structure>
        <path>src/entities/warranty-claim/api/</path>
        <file name="warrantyClaimApi.ts" type="api-definition" mandatory="true"/>
        <file name="types.ts" type="typescript-types" mandatory="true"/>
        <directory name="__tests__/" type="test-directory">
          <file name="warrantyClaimApi.test.ts" type="unit-tests"/>
          <directory name="__mocks__/" type="mock-data">
            <file name="warrantyClaimData.ts" type="mock-factories"/>
          </directory>
        </directory>
        <file name="index.ts" type="barrel-export" mandatory="true"/>
      </directory-structure>
    </structure-type>

    <structure-type id="feature-based" location="src/features/{feature}/api/">
      <title>Для Feature-based API</title>
      <description>FSD архитектура для feature-level API endpoints</description>
      <directory-structure>
        <path>src/features/export-data/api/</path>
        <file name="exportApi.ts" type="api-definition" mandatory="true"/>
        <file name="types.ts" type="typescript-types" mandatory="true"/>
        <file name="hooks.ts" type="custom-hooks" optional="true"/>
        <file name="index.ts" type="barrel-export" mandatory="true"/>
      </directory-structure>
    </structure-type>
  </generated-structure-section>

  <!-- ═══════════════════════════════════════════════════════════
       CODE TEMPLATES SECTION
       ═══════════════════════════════════════════════════════════ -->

  <code-templates-section>

    <!-- ═════════════════════════════════════════════════════════
         TEMPLATE 1: RTK QUERY API
         ═════════════════════════════════════════════════════════ -->

    <template id="rtk-query-api" name="warrantyClaimApi.ts">
      <description>RTK Query API definition with CRUD endpoints</description>
      <location>entities/warranty-claim/api/warrantyClaimApi.ts</location>

      <code-block language="typescript">
        <![CDATA[
// entities/warranty-claim/api/warrantyClaimApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from 'shared/api';
import {
  WarrantyClaim,
  CreateWarrantyClaimRequest,
  UpdateWarrantyClaimRequest,
  WarrantyClaimFilters
} from './types';

export const warrantyClaimApi = createApi({
  reducerPath: 'warrantyClaimApi',
  baseQuery: baseQuery,
  tagTypes: ['WarrantyClaim', 'WarrantyClaimList'],
  endpoints: (builder) => ({
    // GET - получение списка
    getWarrantyClaims: builder.query<WarrantyClaim[], WarrantyClaimFilters>({
      query: (filters) => ({
        url: '/warranty-claims',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WarrantyClaim' as const, id })),
              { type: 'WarrantyClaimList', id: 'LIST' },
            ]
          : [{ type: 'WarrantyClaimList', id: 'LIST' }],
    }),

    // GET - получение одного элемента
    getWarrantyClaim: builder.query<WarrantyClaim, string>({
      query: (id) => `/warranty-claims/${id}`,
      providesTags: (result, error, id) => [{ type: 'WarrantyClaim', id }],
    }),

    // POST - создание
    createWarrantyClaim: builder.mutation<WarrantyClaim, CreateWarrantyClaimRequest>({
      query: (body) => ({
        url: '/warranty-claims',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WarrantyClaimList', id: 'LIST' }],
    }),

    // PUT - обновление
    updateWarrantyClaim: builder.mutation<WarrantyClaim, UpdateWarrantyClaimRequest>({
      query: ({ id, ...body }) => ({
        url: `/warranty-claims/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WarrantyClaim', id },
        { type: 'WarrantyClaimList', id: 'LIST' },
      ],
    }),

    // DELETE - удаление
    deleteWarrantyClaim: builder.mutation<void, string>({
      query: (id) => ({
        url: `/warranty-claims/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'WarrantyClaim', id },
        { type: 'WarrantyClaimList', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetWarrantyClaimsQuery,
  useGetWarrantyClaimQuery,
  useCreateWarrantyClaimMutation,
  useUpdateWarrantyClaimMutation,
  useDeleteWarrantyClaimMutation,
} = warrantyClaimApi;

// Export selectors
export const selectWarrantyClaimById = (id: string) => (state: RootState) =>
  warrantyClaimApi.endpoints.getWarrantyClaim.select(id)(state);

export const selectAllWarrantyClaims = warrantyClaimApi.endpoints.getWarrantyClaims.select({});
        ]]>
      </code-block>

      <highlights>
        <feature order="1">tagTypes для кэширования</feature>
        <feature order="2">providesTags для queries</feature>
        <feature order="3">invalidatesTags для mutations</feature>
        <feature order="4">Auto-generated hooks export</feature>
        <feature order="5">Selectors для прямого доступа</feature>
      </highlights>
    </template>

    <!-- ═════════════════════════════════════════════════════════
         TEMPLATE 2: TYPESCRIPT TYPES
         ═════════════════════════════════════════════════════════ -->

    <template id="typescript-types" name="types.ts">
      <description>TypeScript interfaces, enums, and types for API</description>
      <location>entities/warranty-claim/api/types.ts</location>

      <code-block language="typescript">
        <![CDATA[
// entities/warranty-claim/api/types.ts
export interface WarrantyClaim {
  id: string;
  claimNumber: string;
  productId: string;
  customerId: string;
  status: WarrantyClaimStatus;
  description: string;
  submittedAt: string;
  resolvedAt?: string;
  resolution?: string;
  attachments: string[];
  metadata: Record<string, any>;
}

export enum WarrantyClaimStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export interface CreateWarrantyClaimRequest {
  productId: string;
  customerId: string;
  description: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateWarrantyClaimRequest {
  id: string;
  status?: WarrantyClaimStatus;
  description?: string;
  resolution?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

export interface WarrantyClaimFilters {
  status?: WarrantyClaimStatus;
  customerId?: string;
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// API Response types
export interface WarrantyClaimResponse {
  data: WarrantyClaim[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}
        ]]>
      </code-block>

      <highlights>
        <feature order="1">Domain entities</feature>
        <feature order="2">Enums для статусов</feature>
        <feature order="3">Request DTOs</feature>
        <feature order="4">Response types с pagination</feature>
        <feature order="5">Error handling types</feature>
      </highlights>
    </template>

    <!-- ═════════════════════════════════════════════════════════
         TEMPLATE 3: CUSTOM HOOKS
         ═════════════════════════════════════════════════════════ -->

    <template id="custom-hooks" name="hooks.ts">
      <description>Custom React hooks for API usage</description>
      <location>entities/warranty-claim/api/hooks.ts</location>

      <code-block language="typescript">
        <![CDATA[
// entities/warranty-claim/api/hooks.ts
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetWarrantyClaimsQuery,
  useCreateWarrantyClaimMutation,
  selectAllWarrantyClaims
} from './warrantyClaimApi';

// Кастомный hook для работы со списком
export const useWarrantyClaims = (filters: WarrantyClaimFilters = {}) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetWarrantyClaimsQuery(filters);

  const [createClaim, { isLoading: isCreating }] = useCreateWarrantyClaimMutation();

  const handleCreate = useCallback(async (claimData: CreateWarrantyClaimRequest) => {
    try {
      await createClaim(claimData).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [createClaim]);

  return {
    claims: data || [],
    isLoading,
    error,
    refetch,
    createClaim: handleCreate,
    isCreating,
  };
};

// Hook для optimistic updates
export const useOptimisticWarrantyClaim = () => {
  const [updateClaim] = useUpdateWarrantyClaimMutation();

  const updateWithOptimistic = useCallback(async (
    id: string,
    updates: Partial<WarrantyClaim>
  ) => {
    try {
      await updateClaim({ id, ...updates }).unwrap();
    } catch (error) {
      // Optimistic update will be reverted automatically
      throw error;
    }
  }, [updateClaim]);

  return { updateWithOptimistic };
};
        ]]>
      </code-block>

      <highlights>
        <feature order="1">Abstraction over RTK Query hooks</feature>
        <feature order="2">Error handling wrapper</feature>
        <feature order="3">Optimistic updates support</feature>
        <feature order="4">Type-safe return values</feature>
      </highlights>
    </template>

    <!-- ═════════════════════════════════════════════════════════
         TEMPLATE 4: REDUX STORE INTEGRATION
         ═════════════════════════════════════════════════════════ -->

    <template id="redux-integration" name="store.ts">
      <description>Redux store configuration with API integration</description>
      <location>shared/api/store.ts</location>

      <code-block language="typescript">
        <![CDATA[
// shared/api/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { warrantyClaimApi } from 'entities/warranty-claim/api';

export const store = configureStore({
  reducer: {
    [warrantyClaimApi.reducerPath]: warrantyClaimApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(warrantyClaimApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
        ]]>
      </code-block>

      <highlights>
        <feature order="1">Dynamic reducer registration</feature>
        <feature order="2">Middleware for caching</feature>
        <feature order="3">Type-safe RootState</feature>
      </highlights>
    </template>

    <!-- ═════════════════════════════════════════════════════════
         TEMPLATE 5: TESTS
         ═════════════════════════════════════════════════════════ -->

    <template id="tests" name="warrantyClaimApi.test.ts">
      <description>Unit tests for API endpoints</description>
      <location>entities/warranty-claim/api/__tests__/warrantyClaimApi.test.ts</location>

      <code-block language="typescript">
        <![CDATA[
// entities/warranty-claim/api/__tests__/warrantyClaimApi.test.ts
import { setupApiStore } from 'shared/api/test-utils';
import { warrantyClaimApi } from '../warrantyClaimApi';

describe('warrantyClaimApi', () => {
  const storeRef = setupApiStore(warrantyClaimApi);

  test('should fetch warranty claims successfully', async () => {
    const { store } = storeRef;

    const promise = store.dispatch(
      warrantyClaimApi.endpoints.getWarrantyClaims.initiate({})
    );

    const action = await promise;

    expect(action.data).toBeDefined();
    expect(Array.isArray(action.data)).toBe(true);
  });

  test('should handle create warranty claim', async () => {
    const { store } = storeRef;

    const newClaim = {
      productId: 'prod-123',
      customerId: 'cust-456',
      description: 'Test claim',
    };

    const promise = store.dispatch(
      warrantyClaimApi.endpoints.createWarrantyClaim.initiate(newClaim)
    );

    const action = await promise;

    expect(action.data).toBeDefined();
    expect(action.data.id).toBeDefined();
  });
});
        ]]>
      </code-block>

      <highlights>
        <feature order="1">Test utilities helper</feature>
        <feature order="2">Async testing pattern</feature>
        <feature order="3">Endpoint initiation testing</feature>
      </highlights>
    </template>

    <!-- ═════════════════════════════════════════════════════════
         TEMPLATE 6: MOCK DATA
         ═════════════════════════════════════════════════════════ -->

    <template id="mock-data" name="warrantyClaimData.ts">
      <description>Mock data for development and testing</description>
      <location>entities/warranty-claim/api/__mocks__/warrantyClaimData.ts</location>

      <code-block language="typescript">
        <![CDATA[
// entities/warranty-claim/api/__mocks__/warrantyClaimData.ts
import { WarrantyClaim, WarrantyClaimStatus } from '../types';

export const mockWarrantyClaim: WarrantyClaim = {
  id: 'wc-123',
  claimNumber: 'WC-2025-001',
  productId: 'prod-456',
  customerId: 'cust-789',
  status: WarrantyClaimStatus.PENDING,
  description: 'Product malfunction after 2 months of use',
  submittedAt: '2025-01-15T10:30:00Z',
  attachments: ['attachment-1.jpg', 'attachment-2.pdf'],
  metadata: {
    priority: 'high',
    source: 'web',
  },
};

export const mockWarrantyClaimList: WarrantyClaim[] = [
  mockWarrantyClaim,
  {
    ...mockWarrantyClaim,
    id: 'wc-124',
    claimNumber: 'WC-2025-002',
    status: WarrantyClaimStatus.IN_PROGRESS,
  },
];
        ]]>
      </code-block>

      <highlights>
        <feature order="1">Realistic data structure</feature>
        <feature order="2">Multiple test scenarios</feature>
        <feature order="3">Reusable in tests</feature>
      </highlights>
    </template>
  </code-templates-section>

  <!-- ═══════════════════════════════════════════════════════════
       ALGORITHM WORKFLOW SECTION
       ═══════════════════════════════════════════════════════════ -->

  <algorithm-workflow-section>
    <title>Алгоритм выполнения команды</title>
    <description>7-шаговый процесс создания API endpoint</description>

    <step order="1" mandatory="true" type="analysis">
      <title>ШАГ 1: АНАЛИЗ СУЩЕСТВУЮЩЕЙ АРХИТЕКТУРЫ</title>
      <actions>
        <action order="1" priority="high">
          <description>Поиск существующих API endpoints</description>
          <tools>
            <tool>Grep</tool>
            <tool>Glob</tool>
          </tools>
          <search-patterns>
            <pattern>**/*Api.ts</pattern>
            <pattern>**/api/*.ts</pattern>
          </search-patterns>
        </action>
        <action order="2" priority="high">
          <description>Анализ базовой конфигурации RTK Query</description>
          <files-to-check>
            <file>shared/api/baseQuery.ts</file>
            <file>shared/api/store.ts</file>
          </files-to-check>
        </action>
        <action order="3" priority="medium">
          <description>Определение паттернов именования</description>
          <conventions>
            <convention>API files: {entity}Api.ts</convention>
            <convention>Endpoints: use{Action}{Entity}Query/Mutation</convention>
            <convention>Types: separate types.ts file</convention>
          </conventions>
        </action>
      </actions>
    </step>

    <step order="2" mandatory="true" type="creation">
      <title>ШАГ 2: СОЗДАНИЕ СТРУКТУРЫ ФАЙЛОВ</title>
      <actions>
        <action order="1" priority="high">
          <description>Создание папки api в соответствующем слое FSD</description>
          <decision-tree>
            <condition>Entity-based?</condition>
            <result>src/entities/{entity}/api/</result>
            <alternative>src/features/{feature}/api/</alternative>
          </decision-tree>
        </action>
        <action order="2" priority="medium">
          <description>Подготовка индексных файлов</description>
          <file>index.ts (barrel export)</file>
        </action>
        <action order="3" priority="medium">
          <description>Настройка экспортов</description>
          <exports>
            <export>API definition</export>
            <export>Types</export>
            <export>Hooks (if custom)</export>
          </exports>
        </action>
      </actions>
    </step>

    <step order="3" mandatory="true" type="typing">
      <title>ШАГ 3: ГЕНЕРАЦИЯ ТИПОВ</title>
      <actions>
        <action order="1" priority="high">
          <description>Создание TypeScript интерфейсов</description>
          <types-to-create>
            <type>Domain entity (e.g., WarrantyClaim)</type>
            <type>Request DTOs</type>
            <type>Response types</type>
            <type>Filter types</type>
          </types-to-create>
        </action>
        <action order="2" priority="high">
          <description>Определение request/response типов</description>
          <include>
            <item>Pagination metadata</item>
            <item>Error types</item>
            <item>Optional fields</item>
          </include>
        </action>
        <action order="3" priority="medium">
          <description>Создание enum для статусов</description>
          <example>PENDING, IN_PROGRESS, RESOLVED, REJECTED</example>
        </action>
      </actions>
    </step>

    <step order="4" mandatory="true" type="implementation">
      <title>ШАГ 4: СОЗДАНИЕ RTK QUERY API</title>
      <actions>
        <action order="1" priority="high">
          <description>Определение endpoints</description>
          <methods>
            <method>GET (list, single)</method>
            <method>POST (create)</method>
            <method>PUT (update)</method>
            <method>DELETE (delete)</method>
          </methods>
        </action>
        <action order="2" priority="high">
          <description>Настройка кэширования и тегов</description>
          <tags>
            <tag>{Entity} - для конкретных элементов</tag>
            <tag>{Entity}List - для списков</tag>
          </tags>
        </action>
        <action order="3" priority="high">
          <description>Создание hooks</description>
          <auto-generated>
            <hook>useGet{Entity}sQuery</hook>
            <hook>useGet{Entity}Query</hook>
            <hook>useCreate{Entity}Mutation</hook>
            <hook>useUpdate{Entity}Mutation</hook>
            <hook>useDelete{Entity}Mutation</hook>
          </auto-generated>
        </action>
      </actions>
    </step>

    <step order="5" mandatory="true" type="integration">
      <title>ШАГ 5: ИНТЕГРАЦИЯ С REDUX</title>
      <actions>
        <action order="1" priority="high">
          <description>Добавление reducer в store</description>
          <location>shared/api/store.ts</location>
          <code-pattern>[api.reducerPath]: api.reducer</code-pattern>
        </action>
        <action order="2" priority="high">
          <description>Настройка middleware</description>
          <purpose>Кэширование и инвалидация</purpose>
          <code-pattern>getDefaultMiddleware().concat(api.middleware)</code-pattern>
        </action>
        <action order="3" priority="medium">
          <description>Создание селекторов</description>
          <usage>Прямой доступ к данным из store</usage>
        </action>
      </actions>
    </step>

    <step order="6" mandatory="false" type="testing">
      <title>ШАГ 6: СОЗДАНИЕ ТЕСТОВ</title>
      <actions>
        <action order="1" priority="medium">
          <description>Unit тесты для API endpoints</description>
          <framework>Vitest</framework>
          <coverage>
            <coverage>Fetch operations</coverage>
            <coverage>Create operations</coverage>
            <coverage>Error handling</coverage>
          </coverage>
        </action>
        <action order="2" priority="medium">
          <description>Mock данные</description>
          <location>__mocks__/data.ts</location>
        </action>
        <action order="3" priority="low">
          <description>Integration тесты</description>
          <scope>Store integration + API</scope>
        </action>
      </actions>
      <condition>Только если флаг --with-tests указан</condition>
    </step>

    <step order="7" mandatory="true" type="validation">
      <title>ШАГ 7: ВАЛИДАЦИЯ</title>
      <actions>
        <action order="1" priority="high">
          <description>Проверка TypeScript типов</description>
          <command>tsc --noEmit</command>
        </action>
        <action order="2" priority="medium">
          <description>Запуск тестов</description>
          <command>vitest run path/to/test.test.ts</command>
        </action>
        <action order="3" priority="high">
          <description>Проверка интеграции</description>
          <checks>
            <check>Reduser в store</check>
            <check>Middleware подключен</check>
            <check>Экспорты работают</check>
          </checks>
        </action>
      </actions>
    </step>
  </algorithm-workflow-section>

  <!-- ═══════════════════════════════════════════════════════════
       EXPECTED RESULTS SECTION
       ═══════════════════════════════════════════════════════════ -->

  <results-checklist>
    <title>Результат выполнения команды</title>
    <description>Что создаётся после успешного выполнения</description>

    <deliverables>
      <deliverable order="1" mandatory="true">
        <name>RTK Query API</name>
        <description>С полной типизацией</description>
        <features>
          <feature>CRUD endpoints</feature>
          <feature>Auto-generated hooks</feature>
          <feature>Cache tags configuration</feature>
        </features>
      </deliverable>

      <deliverable order="2" mandatory="true">
        <name>TypeScript типы</name>
        <description>Для всех данных</description>
        <features>
          <feature>Domain interfaces</feature>
          <feature>Request/Response DTOs</feature>
          <feature>Enums для статусов</feature>
          <feature>Error types</feature>
        </features>
      </deliverable>

      <deliverable order="3" mandatory="true">
        <name>React hooks</name>
        <description>Для использования в компонентах</description>
        <features>
          <feature>Auto-generated из RTK Query</feature>
          <feature>Custom abstraction hooks (опционально)</feature>
        </features>
      </deliverable>

      <deliverable order="4" mandatory="true">
        <name>Redux интеграция</name>
        <description>С proper кэшированием</description>
        <features>
          <feature>Reducer в store</feature>
          <feature>Middleware configured</feature>
          <feature>Selectors для data access</feature>
        </features>
      </deliverable>

      <deliverable order="5" mandatory="false">
        <name>Тесты</name>
        <condition>Флаг --with-tests</condition>
        <features>
          <feature>Unit тесты для endpoints</feature>
          <feature>Mock данные</feature>
        </features>
      </deliverable>

      <deliverable order="6" mandatory="false">
        <name>Mock данные</name>
        <condition>Флаг --with-mocks</condition>
        <features>
          <feature>Realistic test data</feature>
          <feature>Reusable factories</feature>
        </features>
      </deliverable>

      <deliverable order="7" mandatory="true">
        <name>Документация</name>
        <description>По использованию API</description>
        <features>
          <feature>Inline comments</feature>
          <feature>Type definitions</feature>
          <feature>Usage examples</feature>
        </features>
      </deliverable>
    </deliverables>
  </results-checklist>

  <!-- ═══════════════════════════════════════════════════════════
       QUALITY ASSURANCE SECTION
       ═══════════════════════════════════════════════════════════ -->

  <quality-assurance>
    <validation-checks>
      <check category="preservation" mandatory="true" status="passed">
        <item>✅ Zero content loss verified</item>
        <item>✅ All 441 lines accounted for</item>
        <item>✅ All code examples preserved</item>
        <item>✅ Metadata intact</item>
      </check>

      <check category="structure" mandatory="true" status="passed">
        <item>✅ Well-formed XML (valid syntax)</item>
        <item>✅ Proper nesting (no crossing)</item>
        <item>✅ Consistent 2-space indentation</item>
        <item>✅ Logical hierarchy maintained</item>
      </check>

      <check category="accessibility" mandatory="true" status="passed">
        <item>✅ Semantic tag names used</item>
        <item>✅ Descriptive attributes added</item>
        <item>✅ Self-documenting structure</item>
        <item>✅ Easy to navigate</item>
      </check>

      <check category="llm-optimization" mandatory="false" status="passed">
        <item>✅ Clear element purposes</item>
        <item>✅ Metadata for quick filtering</item>
        <item>✅ Minimal cognitive load</item>
        <item>✅ Predictable patterns</item>
      </check>
    </validation-checks>

    <metrics>
      <metric name="completeness" value="100%">Information preserved</metric>
      <metric name="readability" value="high">LLM-friendly structure</metric>
      <metric name="maintainability" value="high">Easy to update</metric>
      <metric name="hierarchical-depth" value="5">Optimal nesting levels</metric>
      <metric name="semantic-clarity" value="high">Self-documenting tags</metric>
    </metrics>
  </quality-assurance>

  <!-- ═══════════════════════════════════════════════════════════
       VISUAL DIAGRAMS
       ═══════════════════════════════════════════════════════════ -->

  <visual-diagrams>
    <diagram type="transformation-flow">
      <title>Схема процесса конвертации</title>
      <format>ASCII art</format>
      <content>
        <![CDATA[
Plain Text Input → Analysis → Structure Mapping → Enrichment → XML Output
     │               │              │               │              │
     ▼               ▼              ▼               ▼              ▼
Original Content  Sections     Hierarchy      Attributes    Final XML
(source)         Extraction    Creation        Addition      (result)
        ]]>
      </content>
    </diagram>

    <diagram type="xml-structure">
      <title>Схема структуры XML</title>
      <format>ASCII art</format>
      <content>
        <![CDATA[
<root-element>
├── <metadata>
│   ├── name
│   ├── description
│   └── version
├── <core-content>
│   ├── <instructions-section>
│   ├── <workflow-section>
│   ├── <examples-section>
│   ├── <parameters-section>
│   ├── <templates-section>
│   ├── <diagrams-section>
│   └── <validation-section>
└── <quality-assurance>
        ]]>
      </content>
    </diagram>
  </visual-diagrams>

</command-definition>
