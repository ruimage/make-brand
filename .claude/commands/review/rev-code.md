---

description: Глубокий анализ проекта и изменений на соответсвие требованиям и рекомендациям разработки в проектте
---



<skill-definition>
  <metadata>
    <name>/code-review</name>
    <description>Глубокий анализ проекта и изменений на соответсвие требованиям и рекомендациям разработки в проекте</description>
    <language>ru</language>
  </metadata>

  <role-definition>
    <role>Code Review Specialist</role>
    <specialization>FSD Architecture, React Components, TypeScript, API Integration, State Management</specialization>
    <focus>Style guide compliance and best practices analysis</focus>
  </role-definition>

  <core-expertise>
    <area order="1">
      <name>React Components</name>
      <topics>
        <topic>FSD structure</topic>
        <topic>TypeScript props</topic>
        <topic>Material-UI usage</topic>
        <topic>Performance optimization</topic>
      </topics>
    </area>
    <area order="2">
      <name>TypeScript</name>
      <topics>
        <topic>Type design</topic>
        <topic>Generics</topic>
        <topic>Utility types</topic>
        <topic>Conditional types</topic>
        <topic>Type safety</topic>
      </topics>
    </area>
    <area order="3">
      <name>API Integration</name>
      <topics>
        <topic>RTK Query endpoints</topic>
        <topic>Error handling</topic>
        <topic>Caching</topic>
        <topic>Security</topic>
      </topics>
    </area>
    <area order="4">
      <name>State Management</name>
      <topics>
        <topic>Proper state selection</topic>
        <topic>Redux patterns</topic>
        <topic>URL state management</topic>
      </topics>
    </area>
    <area order="5">
      <name>FSD Architecture</name>
      <topics>
        <topic>Layer boundaries</topic>
        <topic>Import rules</topic>
        <topic>Public API exports</topic>
      </topics>
    </area>
  </core-expertise>

  <code-review-process mandatory="true">
    <phase order="1" name="Component Analysis">
      <check order="1">Verify FSD layer placement and folder structure</check>
      <check order="2">Check TypeScript props interface with proper suffix</check>
      <check order="3">Validate Material-UI component usage and sx props</check>
      <check order="4">Review performance optimization (memo, useMemo, useCallback)</check>
      <check order="5">Ensure proper error handling and loading states</check>
    </phase>

    <phase order="2" name="TypeScript Analysis">
      <check order="1">Validate type vs interface usage consistency</check>
      <check order="2">Check generic constraints and utility types</check>
      <check order="3">Review union and intersection type patterns</check>
      <check order="4">Verify type guards and predicate functions</check>
      <check order="5">Ensure comprehensive type coverage</check>
    </phase>

    <phase order="3" name="API Integration Review">
      <check order="1">Validate RTK Query endpoint structure</check>
      <check order="2">Check error handling with RFC 7807 format</check>
      <check order="3">Review cache management with tags</check>
      <check order="4">Verify security practices (headers, validation)</check>
      <check order="5">Ensure proper loading state handling</check>
    </phase>

    <phase order="4" name="State Management Review">
      <check order="1">Verify correct state type selection (local/URL/global/server)</check>
      <check order="2">Check Redux Toolkit slice structure</check>
      <check order="3">Validate selector memoization</check>
      <check order="4">Review URL state serialization</check>
      <check order="5">Ensure RTK Query integration</check>
    </phase>
  </code-review-process>

  <output-format mandatory="true">
    <language>ru</language>
    <structure>
      <section name="Сводка Code Review" mandatory="true"/>
      <section name="Найденные проблемы" type="list">
        <item format="#### [Категория] - [Название правила]">
          <field>Нарушение</field>
          <field>Правило</field>
          <field>Местоположение</field>
          <field>Рекомендация</field>
        </item>
      </section>
      <section name="Оценка соответствия" type="metrics">
        <metric>Компоненты: X/Y правил соблюдено</metric>
        <metric>TypeScript: X/Y правил соблюдено</metric>
        <metric>API: X/Y правил соблюдено</metric>
        <metric>Управление состоянием: X/Y правил соблюдено</metric>
      </section>
    </structure>
  </output-format>

  <style-guide-rules>
    <category name="Component Rules" order="1">

      <subcategory name="FSD Structure & Architecture" order="1">
        <rule id="fsd-layer-placement" mandatory="true">
          <name>FSD layer placement</name>
          <description>Component placed in correct FSD layer (shared, entities, features, widgets, pages, app)</description>
        </rule>

        <rule id="folder-structure" mandatory="true">
          <name>Folder structure</name>
          <description>ComponentName/index.ts + ComponentName.tsx pattern</description>
        </rule>

        <rule id="public-api-exports" mandatory="true">
          <name>Public API exports</name>
          <description>Export through index.ts with export { ComponentName } from './ComponentName'</description>
        </rule>

        <rule id="props-interface-export" mandatory="true">
          <name>Props interface export</name>
          <description>Props interface exported from types file</description>
        </rule>

        <rule id="no-upper-layer-imports" mandatory="true">
          <name>No upper layer imports</name>
          <description>No direct imports from upper FSD layers</description>
        </rule>
      </subcategory>

      <subcategory name="TypeScript Props & Typing" order="2">
        <rule id="props-interface-suffix" mandatory="true">
          <name>Props interface suffix</name>
          <description>Props interface uses Props suffix (e.g., UserCardProps)</description>
          <examples>
            <bad>interface UserCard { id: string }</bad>
            <good>interface UserCardProps { id: string }</good>
          </examples>
        </rule>

        <rule id="explicit-prop-types" mandatory="true">
          <name>Explicit prop types</name>
          <description>All props explicitly typed (no any)</description>
          <examples>
            <bad>const Component = ({ data }: any) => ...</bad>
            <good>const Component = ({ data }: { data: string }) => ...</good>
          </examples>
        </rule>

        <rule id="optional-props-marked" mandatory="true">
          <name>Optional props marked</name>
          <description>Optional props marked with ?</description>
          <examples>
            <bad>interface Props { title: string; subtitle: string }</bad>
            <good>interface Props { title: string; subtitle?: string }</good>
          </examples>
        </rule>

        <rule id="default-values" mandatory="true">
          <name>Default values</name>
          <description>Default values in destructuring</description>
          <examples>
            <bad>const Component = ({ count }) => ...</bad>
            <good>const Component = ({ count = 0 }) => ...</good>
          </examples>
        </rule>

        <rule id="explicit-return-type" mandatory="true">
          <name>Explicit return type</name>
          <description>Component has explicit return type (JSX.Element)</description>
          <examples>
            <bad>const Component = () => <div>...</div></bad>
            <good>const Component = (): JSX.Element => <div>...</div></good>
          </examples>
        </rule>

        <rule id="generic-constraints" mandatory="false">
          <name>Generic constraints</name>
          <description>Generic parameters have proper constraints</description>
          <examples>
            <bad>type Component<T> = { value: T }</bad>
            <good>type Component<T extends string | number> = { value: T }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Material-UI & Styling" order="3">
        <rule id="mui-components" mandatory="true">
          <name>MUI components</name>
          <description>Uses Material-UI components as foundation</description>
          <examples>
            <bad><div className="custom-button">Click</div></bad>
            <good><Button variant="contained">Click</Button></good>
          </examples>
        </rule>

        <rule id="sx-prop" mandatory="true">
          <name>sx prop</name>
          <description>Uses sx prop for local styles and responsiveness</description>
          <examples>
            <bad><Box style={{ padding: 16, backgroundColor: 'white' }} /></bad>
            <good><Box sx={{ p: 2, bgcolor: 'background.paper' }} /></good>
          </examples>
        </rule>

        <rule id="theme-values" mandatory="true">
          <name>Theme values</name>
          <description>Uses theme values for colors and sizes</description>
          <examples>
            <bad><Box sx={{ color: '#1976d2', fontSize: '16px' }} /></bad>
            <good><Box sx={{ color: 'primary.main', fontSize: 'body1.fontSize' }} /></good>
          </examples>
        </rule>

        <rule id="no-local-styled-components" mandatory="true">
          <name>No local styled-components</name>
          <description>No local styled-components created</description>
          <examples>
            <bad>const StyledButton = styled(Button)`color: red;`</bad>
            <good><Button sx={{ color: 'red' }} /></good>
          </examples>
        </rule>

        <rule id="responsive-breakpoints" mandatory="true">
          <name>Responsive breakpoints</name>
          <description>Correct responsive breakpoint usage</description>
          <examples>
            <bad><Box sx={{ width: 600 }} /></bad>
            <good><Box sx={{ width: { xs: '100%', md: 600 } }} /></good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Performance Optimization" order="4">
        <rule id="justified-optimization" mandatory="true">
          <name>Justified optimization</name>
          <description>Optimization (memo, useMemo, useCallback) applied only with proven performance issues</description>
          <examples>
            <bad>const Component = memo(({ data }) => <div>{data}</div>) (без доказанных проблем)</bad>
            <good>const Component = ({ data }) => <div>{data}</div> (просто и понятно)</good>
          </examples>
        </rule>

        <rule id="clean-code" mandatory="true">
          <name>Clean code</name>
          <description>Component written simply without premature optimization</description>
          <examples>
            <bad>const Component = memo(({ data }) => useMemo(() => <div>{data}</div>, [data]))</bad>
            <good>const Component = ({ data }) => <div>{data}</div></good>
          </examples>
        </rule>

        <rule id="react-memo" mandatory="false">
          <name>React.memo</name>
          <description>Used consciously for frequently re-rendering components with same props</description>
          <examples>
            <bad>const Button = memo(({ onClick, children }) => <button onClick={onClick}>{children}</button>)</bad>
            <good>const HeavyChart = memo(({ data }) => <Chart data={heavyTransform(data)} />)</good>
          </examples>
        </rule>

        <rule id="use-memo" mandatory="false">
          <name>useMemo</name>
          <description>Applied only for expensive computations (complex array filtering/sorting)</description>
          <examples>
            <bad>const value = useMemo(() => count + 1, [count])</bad>
            <good>const sortedData = useMemo(() => heavySortAlgorithm(data), [data])</good>
          </examples>
        </rule>

        <rule id="use-callback" mandatory="false">
          <name>useCallback</name>
          <description>Used for stable callback references passed to memoized child components</description>
          <examples>
            <bad>const onClick = useCallback(() => setCount(c => c + 1), []) (без memo child)</bad>
            <good>const onClick = useCallback(() => setCount(c => c + 1), []) (с memo child)</good>
          </examples>
        </rule>

        <rule id="lazy-loading" mandatory="false">
          <name>Lazy loading</name>
          <description>Heavy components/libraries loaded asynchronously with React.lazy</description>
          <examples>
            <bad>import HeavyChart from './HeavyChart'</bad>
            <good>const HeavyChart = lazy(() => import('./HeavyChart'))</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Logic & Hooks" order="5">
        <rule id="simple-logic" mandatory="true">
          <name>Simple logic</name>
          <description>Simple and local logic kept in component</description>
          <examples>
            <bad>const useToggle = (initial = false) => { const [value, setValue] = useState(initial); return [value, () => setValue(v => !v)]; }</bad>
            <good>const [open, setOpen] = useState(false); const toggle = () => setOpen(v => !v);</good>
          </examples>
        </rule>

        <rule id="hook-extraction" mandatory="false">
          <name>Hook extraction</name>
          <description>Logic extracted to hook (lib/useXxx.ts) only when needed: reuse, complex side effects, testable isolation, high complexity</description>
          <examples>
            <bad>const useCounter = () => { const [count, setCount] = useState(0); return { count, increment: () => setCount(c => c + 1) }; }</bad>
            <good>const useDebouncedSearch = (query: string, delay = 300) => { /* сложная логика с useEffect и setTimeout */ }</good>
          </examples>
        </rule>

        <rule id="api-selector-encapsulation" mandatory="false">
          <name>API/selector encapsulation</name>
          <description>Reusable API/selector parts encapsulated in hooks when needed</description>
          <examples>
            <bad>const { data, isLoading } = useGetUsersQuery(); const activeUsers = data?.filter(u => u.isActive) || [];</bad>
            <good>const useActiveUsers = () => { const { data, isLoading } = useGetUsersQuery(); const activeUsers = useMemo(() => data?.filter(u => u.isActive) || [], [data]); return { activeUsers, isLoading }; }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Error Handling" order="6">
        <rule id="error-boundaries" mandatory="true">
          <name>Error boundaries</name>
          <description>Error boundaries for critical components</description>
          <examples>
            <bad>const CriticalComponent = () => { throw new Error('Critical error'); }</bad>
            <good><ErrorBoundary><CriticalComponent /></ErrorBoundary></good>
          </examples>
        </rule>

        <rule id="graceful-fallbacks" mandatory="true">
          <name>Graceful fallbacks</name>
          <description>Graceful fallbacks for error states</description>
          <examples>
            <bad>const Component = () => { if (error) throw error; return <div>Success</div>; }</bad>
            <good>const Component = () => { if (error) return <ErrorFallback error={error} />; return <div>Success</div>; }</good>
          </examples>
        </rule>

        <rule id="user-friendly-messages" mandatory="true">
          <name>User-friendly messages</name>
          <description>User-friendly error messages</description>
          <examples>
            <bad>const ErrorMessage = () => <div>Error: NetworkError: Failed to fetch</div></bad>
            <good>const ErrorMessage = () => <div>Не удалось загрузить данные. Попробуйте позже.</div></good>
          </examples>
        </rule>

        <rule id="loading-states" mandatory="true">
          <name>Loading states</name>
          <description>Loading states properly handled</description>
          <examples>
            <bad>const Component = () => { const { data } = useQuery(); return <div>{data}</div>; }</bad>
            <good>const Component = () => { const { data, isLoading } = useQuery(); if (isLoading) return <Spinner />; return <div>{data}</div>; }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Responsive Design" order="7">
        <rule id="desktop-first" mandatory="true">
          <name>Desktop-first</name>
          <description>Desktop-first approach</description>
          <examples>
            <bad><Box sx={{ width: { xs: 300, md: 600 } }} /></bad>
            <good><Box sx={{ width: 600, xs: { width: 300 } }} /></good>
          </examples>
        </rule>

        <rule id="breakpoint-consistency" mandatory="true">
          <name>Breakpoint consistency</name>
          <description>Consistent breakpoint usage</description>
          <examples>
            <bad><Box sx={{ width: { mobile: 300, tablet: 600 } }} /></bad>
            <good><Box sx={{ width: { xs: 300, md: 600 } }} /></good>
          </examples>
        </rule>

        <rule id="fluid-typography" mandatory="true">
          <name>Fluid typography</name>
          <description>Fluid typography implementation</description>
          <examples>
            <bad><Typography fontSize="16px">Text</Typography></bad>
            <good><Typography variant="body1">Text</Typography></good>
          </examples>
        </rule>

        <rule id="touch-friendly" mandatory="true">
          <name>Touch-friendly</name>
          <description>Touch-friendly on mobile devices</description>
          <examples>
            <bad><Button sx={{ padding: 4 }}>Click</Button></bad>
            <good><Button sx={{ padding: 2, minHeight: 44 }}>Click</Button></good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Code Quality" order="8">
        <rule id="single-responsibility" mandatory="true">
          <name>Single responsibility</name>
          <description>Component follows single responsibility principle</description>
        </rule>
        <rule id="intuitive-props" mandatory="true">
          <name>Intuitive props</name>
          <description>Props interface is intuitive</description>
        </rule>
        <rule id="reusable" mandatory="true">
          <name>Reusable</name>
          <description>Component is easily reusable</description>
        </rule>
        <rule id="no-comments" mandatory="true">
          <name>No comments</name>
          <description>No comments in code (self-documenting code)</description>
        </rule>
        <rule id="consistent-naming" mandatory="true">
          <name>Consistent naming</name>
          <description>Consistent naming conventions</description>
        </rule>
      </subcategory>
    </category>

    <category name="TypeScript Rules" order="2">

      <subcategory name="Type Definitions" order="1">
        <rule id="naming-conventions" mandatory="true">
          <name>Naming conventions</name>
          <description>Consistent naming for type aliases</description>
          <examples>
            <bad>type user = { name: string }</bad>
            <good>type User = { name: string }</good>
          </examples>
        </rule>

        <rule id="single-responsibility-types" mandatory="true">
          <name>Single responsibility</name>
          <description>Each type represents single concept</description>
          <examples>
            <bad>type UserAndProduct = { userName: string; productName: string }</bad>
            <good>type User = { name: string }; type Product = { name: string }</good>
          </examples>
        </rule>

        <rule id="property-ordering" mandatory="true">
          <name>Property ordering</name>
          <description>Properties logically ordered</description>
          <examples>
            <bad>type User = { email: string; createdAt: Date; id: string; name: string }</bad>
            <good>type User = { id: string; name: string; email: string; createdAt: Date }</good>
          </examples>
        </rule>

        <rule id="optional-properties" mandatory="true">
          <name>Optional properties</name>
          <description>Optional properties placed after required</description>
          <examples>
            <bad>type User = { avatar?: string; id: string; name: string }</bad>
            <good>type User = { id: string; name: string; avatar?: string }</good>
          </examples>
        </rule>

        <rule id="readonly-modifiers" mandatory="true">
          <name>Readonly modifiers</name>
          <description>Readonly for immutable properties</description>
          <examples>
            <bad>type Config = { apiUrl: string; version: string }</bad>
            <good>type Config = { readonly apiUrl: string; readonly version: string }</good>
          </examples>
        </rule>

        <rule id="documentation" mandatory="false">
          <name>Documentation</name>
          <description>JSDoc comments for complex types</description>
          <examples>
            <bad>type ApiResponse = { data: any; status: number }</bad>
            <good>/** API response wrapper with status and data */ type ApiResponse = { data: any; status: number }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Type vs Interface Choice" order="2">
        <rule id="type-preference" mandatory="true">
          <name>Type preference</name>
          <description>Uses type aliases for all type definitions</description>
          <examples>
            <bad>interface User { name: string }</bad>
            <good>type User = { name: string }</good>
          </examples>
        </rule>

        <rule id="type-for-unions" mandatory="true">
          <name>Type for unions</name>
          <description>Type aliases for union and primitive types</description>
          <examples>
            <bad>interface Status { value: 'loading' | 'success' | 'error' }</bad>
            <good>type Status = 'loading' | 'success' | 'error'</good>
          </examples>
        </rule>

        <rule id="type-for-objects" mandatory="true">
          <name>Type for objects</name>
          <description>Type aliases for object types</description>
          <examples>
            <bad>interface Config { apiUrl: string; timeout: number }</bad>
            <good>type Config = { apiUrl: string; timeout: number }</good>
          </examples>
        </rule>

        <rule id="intersection-for-extensions" mandatory="true">
          <name>Intersection for extensions</name>
          <description>Intersection types for type extensions</description>
          <examples>
            <bad>interface AdminUser extends User { permissions: string[] }</bad>
            <good>type AdminUser = User & { permissions: string[] }</good>
          </examples>
        </rule>

        <rule id="consistent-approach" mandatory="true">
          <name>Consistent approach</name>
          <description>Consistent type usage throughout project</description>
          <examples>
            <bad>interface User { name: string }; type Product = { title: string }</bad>
            <good>type User = { name: string }; type Product = { title: string }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Property Definitions" order="3">
        <rule id="explicit-types" mandatory="true">
          <name>Explicit types</name>
          <description>Explicit typing of all properties</description>
          <examples>
            <bad>type User = { name; age; email }</bad>
            <good>type User = { name: string; age: number; email: string }</good>
          </examples>
        </rule>

        <rule id="nullable-handling" mandatory="true">
          <name>Nullable handling</name>
          <description>Clear null/undefined separation</description>
          <examples>
            <bad>type User = { name: string | null | undefined }</bad>
            <good>type User = { name: string; avatar?: string; lastLoginAt: Date | null }</good>
          </examples>
        </rule>

        <rule id="nested-object-typing" mandatory="true">
          <name>Nested object typing</name>
          <description>Typing of nested objects</description>
          <examples>
            <bad>type User = { profile: any }</bad>
            <good>type User = { profile: { name: string; address: { street: string; city: string } } }</good>
          </examples>
        </rule>

        <rule id="array-typing" mandatory="true">
          <name>Array typing</name>
          <description>Proper array typing</description>
          <examples>
            <bad>type User = { tags: any[] }</bad>
            <good>type User = { tags: string[]; scores: number[]; metadata: Array<{ key: string; value: unknown }> }</good>
          </examples>
        </rule>

        <rule id="function-typing" mandatory="true">
          <name>Function typing</name>
          <description>Typing of function properties</description>
          <examples>
            <bad>type Handler = { onClick: any }</bad>
            <good>type Handler = { onClick: () => void; onSubmit: (data: FormData) => Promise<void> }</good>
          </examples>
        </rule>

        <rule id="index-signatures" mandatory="false">
          <name>Index signatures</name>
          <description>Index signatures only where necessary</description>
          <examples>
            <bad>type Config = { [key: string]: any }</bad>
            <good>type Config = { apiUrl: string; timeout: number; [key: `feature_${string}`]: boolean }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Generic Types & Constraints" order="4">
        <rule id="meaningful-names" mandatory="true">
          <name>Meaningful names</name>
          <description>Descriptive names for generic parameters</description>
          <examples>
            <bad>type Container<T, U> = { value: T; metadata: U }</bad>
            <good>type Container<TEntity, TMetadata> = { value: TEntity; metadata: TMetadata }</good>
          </examples>
        </rule>

        <rule id="default-type-parameters" mandatory="false">
          <name>Default type parameters</name>
          <description>Default values for generic parameters</description>
          <examples>
            <bad>type ApiResponse<TData, TError> = { data?: TData; error?: TError }</bad>
            <good>type ApiResponse<TData = unknown, TError = Error> = { data?: TData; error?: TError }</good>
          </examples>
        </rule>

        <rule id="constraint-usage" mandatory="true">
          <name>Constraint usage</name>
          <description>Constraints for type restrictions</description>
          <examples>
            <bad>type GetProperty<T, K> = T[K]</bad>
            <good>type GetProperty<T, K extends keyof T> = T[K]</good>
          </examples>
        </rule>

        <rule id="variance-annotations" mandatory="false">
          <name>Variance annotations</name>
          <description>Covariance/contravariance where applicable</description>
          <examples>
            <bad>type Producer<T> = () => T (без явного указания ковариантности)</bad>
            <good>type Producer<out T> = () => T (с ковариантностью)</good>
          </examples>
        </rule>

        <rule id="generic-inference" mandatory="false">
          <name>Generic inference</name>
          <description>Optimization for type inference</description>
          <examples>
            <bad>function createStore<T>(initialState: T): Store<T> (избыточная аннотация)</bad>
            <good>function createStore<T>(initialState: T) { return { state: initialState } } (автоматический вывод)</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Union & Intersection Types" order="5">
        <rule id="discriminated-unions" mandatory="true">
          <name>Discriminated unions</name>
          <description>Discriminated unions for state management</description>
          <examples>
            <bad>type State = { status: string; data?: any; error?: string }</bad>
            <good>type State = { status: 'loading' } | { status: 'success'; data: any } | { status: 'error'; error: string }</good>
          </examples>
        </rule>

        <rule id="literal-types" mandatory="true">
          <name>Literal types</name>
          <description>String/number literal types in unions</description>
          <examples>
            <bad>type Size = string</bad>
            <good>type Size = 'small' | 'medium' | 'large'</good>
          </examples>
        </rule>

        <rule id="exhaustive-checking" mandatory="true">
          <name>Exhaustive checking</name>
          <description>Exhaustive checking with never</description>
          <examples>
            <bad>switch (status) { case 'loading': return; case 'success': return; }</bad>
            <good>switch (status) { case 'loading': return; case 'success': return; default: const exhaustive: never = status; return exhaustive; }</good>
          </examples>
        </rule>

        <rule id="union-narrowing" mandatory="true">
          <name>Union narrowing</name>
          <description>Type guards for union narrowing</description>
          <examples>
            <bad>if (typeof value === 'object') { value.unknownProperty }</bad>
            <good>if (isUser(value)) { value.name }</good>
          </examples>
        </rule>

        <rule id="common-properties" mandatory="false">
          <name>Common properties</name>
          <description>Use of common union properties</description>
          <examples>
            <bad>type Event = { type: 'click'; x: number } | { type: 'key'; key: string }</bad>
            <good>type Event = { type: 'click'; timestamp: Date; x: number } | { type: 'key'; timestamp: Date; key: string }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Type Guards & Predicates" order="6">
        <rule id="user-defined-guards" mandatory="true">
          <name>User-defined guards</name>
          <description>Custom type guard functions</description>
          <examples>
            <bad>function checkUser(obj: any) { return obj && obj.name }</bad>
            <good>function isUser(obj: unknown): obj is User { return typeof obj === 'object' && obj !== null && 'name' in obj }</good>
          </examples>
        </rule>

        <rule id="runtime-validation" mandatory="true">
          <name>Runtime validation</name>
          <description>Runtime checks in type guards</description>
          <examples>
            <bad>function isUser(obj: any): obj is User { return obj.name }</bad>
            <good>function isUser(obj: unknown): obj is User { return typeof obj === 'object' && obj !== null && 'name' in obj && typeof (obj as any).name === 'string' }</good>
          </examples>
        </rule>

        <rule id="comprehensive-checks" mandatory="true">
          <name>Comprehensive checks</name>
          <description>Full object structure checking</description>
          <examples>
            <bad>function isUser(obj: any): obj is User { return obj.name }</bad>
            <good>function isUser(obj: unknown): obj is User { return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj && 'email' in obj && typeof (obj as any).id === 'string' && typeof (obj as any).name === 'string' && typeof (obj as any).email === 'string' }</good>
          </examples>
        </rule>

        <rule id="performance-optimization" mandatory="false">
          <name>Performance optimization</name>
          <description>Performance optimization of guards</description>
          <examples>
            <bad>function isUser(obj: unknown): obj is User { /* complex validation every time */ }</bad>
            <good>const userCache = new WeakMap(); function isUser(obj: unknown): obj is User { if (userCache.has(obj)) return userCache.get(obj)!; const result = validateUser(obj); userCache.set(obj, result); return result; }</good>
          </examples>
        </rule>

        <rule id="error-handling" mandatory="true">
          <name>Error handling</name>
          <description>Error handling in type guards</description>
          <examples>
            <bad>function isUser(obj: unknown): obj is User { return obj.name.length > 0 }</bad>
            <good>function isUser(obj: unknown): obj is User { try { return validateUser(obj); } catch { return false; } }</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Utility Types" order="7">
        <rule id="built-in-utilities" mandatory="true">
          <name>Built-in utilities</name>
          <description>Proper use of Partial, Required, Pick, Omit, Record</description>
          <examples>
            <bad>type UpdateUser = { id: string; name?: string; email?: string }</bad>
            <good>type UpdateUser = Partial<Pick<User, 'name' | 'email'>> & { id: string }</good>
          </examples>
        </rule>

        <rule id="advanced-utilities" mandatory="true">
          <name>Advanced utilities</name>
          <description>Proper use of ReturnType, Parameters, ConstructorParameters, InstanceType, NonNullable</description>
          <examples>
            <bad>type Handler = (data: any) => Promise<any></bad>
            <good>type Handler = (data: User) => Promise<ApiResponse>; type HandlerReturn = ReturnType<Handler>; type HandlerParams = Parameters<Handler></good>
          </examples>
        </rule>

        <rule id="custom-utilities" mandatory="false">
          <name>Custom utilities</name>
          <description>Domain-specific custom utility types</description>
          <examples>
            <bad>type UserForm = { name: string; email: string }</bad>
            <good>type FormField<T> = { value: T; error?: string }; type UserForm = { [K in keyof User]: FormField<User[K]> }</good>
          </examples>
        </rule>
      </subcategory>
    </category>

    <category name="API Integration Rules" order="3">

      <subcategory name="FSD Structure" order="1">
        <rule id="api-placement" mandatory="true">
          <name>API placement</name>
          <description>API placed in entities/*/api or features/*/api</description>
        </rule>
        <rule id="file-structure" mandatory="true">
          <name>File structure</name>
          <description>entityApi.ts, types.ts, index.ts pattern</description>
        </rule>
        <rule id="public-api-exports-api" mandatory="true">
          <name>Public API exports</name>
          <description>Export through index.ts</description>
        </rule>
        <rule id="baseapi-injection" mandatory="true">
          <name>baseApi injection</name>
          <description>Uses baseApi.injectEndpoints()</description>
        </rule>
      </subcategory>

      <subcategory name="Naming Conventions" order="2">
        <rule id="query-naming" mandatory="true">
          <name>Query naming</name>
          <description>getEntityById, getEntityList, searchEntities</description>
          <examples>
            <bad>useFetchUser, loadData, getData</bad>
            <good>useGetUserByIdQuery, useGetUsersQuery, useSearchUsersQuery</good>
          </examples>
        </rule>

        <rule id="mutation-naming" mandatory="true">
          <name>Mutation naming</name>
          <description>createEntity, updateEntity, deleteEntity</description>
          <examples>
            <bad>saveUser, modifyUser, removeUser</bad>
            <good>useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation</good>
          </examples>
        </rule>

        <rule id="hook-exports" mandatory="true">
          <name>Hook exports</name>
          <description>Exported hooks: useGetEntityByIdQuery</description>
          <examples>
            <bad>export const getUserById = useGetUserByIdQuery</bad>
            <good>export { useGetUserByIdQuery, useUpdateUserMutation }</good>
          </examples>
        </rule>

        <rule id="consistent-naming-api" mandatory="true">
          <name>Consistent naming</name>
          <description>Consistent naming throughout project</description>
          <examples>
            <bad>useGetUserQuery (users) vs useFetchProduct (products)</bad>
            <good>useGetUserQuery (users) vs useGetProductQuery (products)</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="TypeScript Typing" order="3">
        <rule id="request-response-types" mandatory="true">
          <name>Request/Response types</name>
          <description>Request/Response types defined</description>
          <examples>
            <bad>query: (id: any) => ({ url: `/users/${id}` })</bad>
            <good>query: (id: string) => ({ url: `/users/${id}` })</good>
          </examples>
        </rule>

        <rule id="query-parameters" mandatory="true">
          <name>Query parameters</name>
          <description>Query parameters typed</description>
          <examples>
            <bad>query: (params) => ({ url: '/users', params })</bad>
            <good>query: (params: { page: number; limit: number }) => ({ url: '/users', params })</good>
          </examples>
        </rule>

        <rule id="error-responses" mandatory="true">
          <name>Error responses</name>
          <description>Error responses typed</description>
          <examples>
            <bad>transformErrorResponse: (error: any) => error</bad>
            <good>transformErrorResponse: (error: SerializedError) => ApiError</good>
          </examples>
        </rule>

        <rule id="generic-types-api" mandatory="false">
          <name>Generic types</name>
          <description>Generic types where appropriate</description>
          <examples>
            <bad>query: (id: string) => ({ url: `/users/${id}` })</bad>
            <good>query: <T>(id: string) => ({ url: `/users/${id}` })</good>
          </examples>
        </rule>

        <rule id="zod-schemas" mandatory="true">
          <name>Zod schemas</name>
          <description>Zod schemas for validation</description>
          <examples>
            <bad>transformResponse: (response: any) => response.data</bad>
            <good>transformResponse: (response: unknown) => userSchema.parse(response.data)</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Query Definitions" order="4">
        <rule id="safe-url-building" mandatory="true">
          <name>Safe URL building</name>
          <description>URLs built safely (no injection)</description>
          <examples>
            <bad>query: (id: string) => ({ url: `/users/${id}` }) (без валидации)</bad>
            <good>query: (id: string) => ({ url: `/users/${encodeURIComponent(id)}` })</good>
          </examples>
        </rule>

        <rule id="http-methods" mandatory="true">
          <name>HTTP methods</name>
          <description>HTTP methods use constants</description>
          <examples>
            <bad>method: 'post'</bad>
            <good>method: 'POST' или method: HttpMethod.POST</good>
          </examples>
        </rule>

        <rule id="headers" mandatory="true">
          <name>Headers</name>
          <description>Headers correctly added</description>
          <examples>
            <bad>headers: { 'Content-Type': 'application/json' } (без авторизации)</bad>
            <good>headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }</good>
          </examples>
        </rule>

        <rule id="query-params-api" mandatory="true">
          <name>Query params</name>
          <description>Query params typed</description>
          <examples>
            <bad>params: { page, limit }</bad>
            <good>params: { page: number, limit: number }</good>
          </examples>
        </rule>

        <rule id="transformresponse" mandatory="true">
          <name>transformResponse</name>
          <description>transformResponse with Zod validation</description>
          <examples>
            <bad>transformResponse: (response) => response.data</bad>
            <good>transformResponse: (response: unknown) => userSchema.parse(response.data)</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Error Handling" order="5">
        <rule id="transformerrorresponse" mandatory="true">
          <name>transformErrorResponse</name>
          <description>transformErrorResponse implemented</description>
          <examples>
            <bad>transformErrorResponse: (error) => error</bad>
            <good>transformErrorResponse: (error: SerializedError) => ({ type: 'API_ERROR', message: error.message })</good>
          </examples>
        </rule>

        <rule id="rfc-7807-format" mandatory="true">
          <name>RFC 7807 format</name>
          <description>RFC 7807 Problem Details format</description>
          <examples>
            <bad>{ error: 'Not found', status: 404 }</bad>
            <good>{ type: 'https://example.com/errors/not-found', title: 'Resource not found', status: 404, detail: 'The requested user was not found' }</good>
          </examples>
        </rule>

        <rule id="user-friendly-messages-api" mandatory="true">
          <name>User-friendly messages</name>
          <description>User-friendly error messages</description>
          <examples>
            <bad>Error: NetworkError: Failed to fetch</bad>
            <good>Не удалось подключиться к серверу. Проверьте интернет-соединение.</good>
          </examples>
        </rule>

        <rule id="validation-errors" mandatory="true">
          <name>Validation errors</name>
          <description>Validation errors handled</description>
          <examples>
            <bad>{ error: 'Validation failed' }</bad>
            <good>{ errors: { email: 'Invalid email format', password: 'Password too short' } }</good>
          </examples>
        </rule>

        <rule id="network-errors" mandatory="true">
          <name>Network errors</name>
          <description>Network errors handled</description>
          <examples>
            <bad>if (error) throw error</bad>
            <good>if (error) return <NetworkError onRetry={refetch} /></good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Cache Management" order="6">
        <rule id="providestags" mandatory="true">
          <name>providesTags</name>
          <description>providesTags correctly configured</description>
          <examples>
            <bad>providesTags: ['Users'] (слишком широко)</bad>
            <good>providesTags: (result) => result ? [{ type: 'User', id: result.id }] : ['User']</good>
          </examples>
        </rule>

        <rule id="invalidatestags" mandatory="true">
          <name>invalidatesTags</name>
          <description>invalidatesTags for mutations</description>
          <examples>
            <bad>invalidatesTags: ['Users'] (инвалидирует все)</bad>
            <good>invalidatesTags: [{ type: 'User', id: 'LIST' }] (селективная инвалидация)</good>
          </examples>
        </rule>

        <rule id="selective-invalidation" mandatory="true">
          <name>Selective invalidation</name>
          <description>Selective invalidation for specific updates</description>
          <examples>
            <bad>invalidatesTags: ['Users'] после создания пользователя</bad>
            <good>invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]</good>
          </examples>
        </rule>

        <rule id="cache-strategy" mandatory="true">
          <name>Cache strategy</name>
          <description>Cache invalidation strategy well thought out</description>
          <examples>
            <bad>Инвалидация всех данных при любом изменении</bad>
            <good>Точная инвалидация только затронутых данных</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Security" order="7">
        <rule id="no-sensitive-logging" mandatory="true">
          <name>No sensitive logging</name>
          <description>Sensitive data not logged</description>
          <examples>
            <bad>console.log('User data:', { password: 'secret', token: 'jwt-token' })</bad>
            <good>console.log('User data:', { id: user.id, name: user.name })</good>
          </examples>
        </rule>

        <rule id="auth-headers" mandatory="true">
          <name>Auth headers</name>
          <description>Authentication headers added</description>
          <examples>
            <bad>headers: { 'Content-Type': 'application/json' } (без авторизации)</bad>
            <good>headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }</good>
          </examples>
        </rule>

        <rule id="input-validation" mandatory="true">
          <name>Input validation</name>
          <description>Input validation before sending</description>
          <examples>
            <bad>query: (id: string) => ({ url: `/users/${id}` }) (без валидации)</bad>
            <good>query: (id: string) => { if (!isValidId(id)) throw new Error('Invalid ID'); return { url: `/users/${id}` }; }</good>
          </examples>
        </rule>

        <rule id="xss-protection" mandatory="true">
          <name>XSS protection</name>
          <description>XSS protection in transformations</description>
          <examples>
            <bad>transformResponse: (response) => response.data (без очистки)</bad>
            <good>transformResponse: (response) => sanitizeHtml(response.data)</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="RTK Query Store Integration" order="8">
        <rule id="reducer-placement" mandatory="true">
          <name>Reducer placement</name>
          <description>baseApi.reducer added to store under [baseApi.reducerPath]</description>
        </rule>
        <rule id="middleware" mandatory="true">
          <name>Middleware</name>
          <description>baseApi.middleware connected via getDefaultMiddleware().concat(baseApi.middleware)</description>
        </rule>
        <rule id="store-types" mandatory="true">
          <name>Store types</name>
          <description>Store types exported: RootState, AppDispatch</description>
        </rule>
        <rule id="no-duplicate-apis" mandatory="true">
          <name>No duplicate APIs</name>
          <description>No additional createApi without necessity</description>
        </rule>
        <rule id="endpoint-extension" mandatory="true">
          <name>Endpoint extension</name>
          <description>All endpoints extend baseApi via injectEndpoints</description>
        </rule>
      </subcategory>
    </category>

    <category name="State Management Rules" order="4">

      <subcategory name="State Type Selection Tree" order="1">
        <rule id="data-nature-analysis" mandatory="true">
          <name>Data nature analysis</name>
          <description>Analysis of data nature (server data, UI state, session state)</description>
          <examples>
            <bad>Store UI toggle state in Redux when only used in one component</bad>
            <good>Use useState for UI toggles, Redux for global app state</good>
          </examples>
        </rule>

        <rule id="lifecycle-analysis" mandatory="true">
          <name>Lifecycle analysis</name>
          <description>Analysis of state lifecycle (one render, user session, permanent)</description>
          <examples>
            <bad>Store temporary form data in localStorage</bad>
            <good>Use session state for temporary data, localStorage for persistent data</good>
          </examples>
        </rule>

        <rule id="scope-analysis" mandatory="true">
          <name>Scope analysis</name>
          <description>Analysis of data usage scope (one component, multiple related, entire app)</description>
          <examples>
            <bad>Use Redux for state only needed in parent-child components</bad>
            <good>Use props drilling for parent-child state, Redux for app-wide state</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Decision Tree" order="2">
        <rule id="server-data" mandatory="true">
          <name>Server data</name>
          <description>Server data → RTK Query</description>
          <examples>
            <bad>Store API data in Redux manually instead of using RTK Query</bad>
            <good>Use RTK Query for all server data with automatic caching</good>
          </examples>
        </rule>

        <rule id="url-state" mandatory="true">
          <name>URL state</name>
          <description>Shareable/persistent state → URL state (useParams, useSearchParams)</description>
          <examples>
            <bad>Store filter state in Redux when it should be shareable via URL</bad>
            <good>Use URL params for shareable state like filters, pagination</good>
          </examples>
        </rule>

        <rule id="global-state" mandatory="true">
          <name>Global state</name>
          <description>Multiple unrelated components → Global state (Redux Toolkit)</description>
          <examples>
            <bad>Use Context for frequently changing global state</bad>
            <good>Use Redux Toolkit for global app state with performance optimization</good>
          </examples>
        </rule>

        <rule id="local-state" mandatory="true">
          <name>Local state</name>
          <description>Single component/direct children → Local state (useState, useReducer)</description>
          <examples>
            <bad>Create custom hook for simple toggle state</bad>
            <good>Use useState directly for simple component state</good>
          </examples>
        </rule>
      </subcategory>

      <subcategory name="Local State Implementation" order="3">
        <rule id="component-scope" mandatory="true">
          <name>Component scope</name>
          <description>State truly not needed outside component</description>
        </rule>
        <rule id="usestate-for-simple" mandatory="true">
          <name>useState for simple</name>
          <description>useState for simple logic (toggles, value storage)</description>
        </rule>
        <rule id="usereducer-for-complex" mandatory="true">
          <name>useReducer for complex</name>
          <description>useReducer for complex logic with multiple transitions</description>
        </rule>
        <rule id="lazy-initialization" mandatory="false">
          <name>Lazy initialization</name>
          <description>Initial state computed lazily if expensive: useState(() => computeInitialState())</description>
        </rule>
        <rule id="logic-location" mandatory="true">
          <name>Logic location</name>
          <description>Local logic kept in component; separate hook only for reuse/testability/complexity reduction</description>
        </rule>
      </subcategory>

      <subcategory name="URL State Implementation" order="4">
        <rule id="serialization" mandatory="true">
          <name>Serialization</name>
          <description>URL-stored data properly serialized/deserialized</description>
        </rule>
        <rule id="default-values-url" mandatory="true">
          <name>Default values</name>
          <description>Default values provided when URL params missing</description>
        </rule>
        <rule id="useparams" mandatory="true">
          <name>useParams</name>
          <description>useParams for path parameters (/items/:id)</description>
        </rule>
        <rule id="usesearchparams" mandatory="true">
          <name>useSearchParams</name>
          <description>useSearchParams for query parameters (?page=2)</description>
        </rule>
        <rule id="no-sensitive-data-url" mandatory="true">
          <name>No sensitive data</name>
          <description>No sensitive information in URL</description>
        </rule>
      </subcategory>

      <subcategory name="Global State Implementation" order="5">
        <rule id="true-global-need" mandatory="true">
          <name>True global need</name>
          <description>Data truly global and cannot be efficiently passed via props</description>
        </rule>
        <rule id="no-rtk-query-duplication" mandatory="true">
          <name>No RTK Query duplication</name>
          <description>State does not duplicate RTK Query cached data</description>
        </rule>
        <rule id="fsd-slice" mandatory="true">
          <name>FSD slice</name>
          <description>Separate FSD slice (slice.ts) created for state management</description>
        </rule>
        <rule id="memoized-selectors" mandatory="true">
          <name>Memoized selectors</name>
          <description>State accessed via memoized selectors (createSelector)</description>
        </rule>
        <rule id="pure-reducers" mandatory="true">
          <name>Pure reducers</name>
          <description>All state changes via actions and pure reducer functions</description>
        </rule>
      </subcategory>

      <subcategory name="Server State Implementation" order="6">
        <rule id="endpoint-definition" mandatory="true">
          <name>Endpoint definition</name>
          <description>endpoint defined in appropriate API slice (entities or features)</description>
        </rule>
        <rule id="tag-configuration" mandatory="true">
          <name>Tag configuration</name>
          <description>Tags configured (providesTags, invalidatesTags) for cache management</description>
        </rule>
        <rule id="request-states" mandatory="true">
          <name>Request states</name>
          <description>All request states handled in component: isLoading, isFetching, isSuccess, isError</description>
        </rule>
        <rule id="error-handling-server" mandatory="true">
          <name>Error handling</name>
          <description>Errors handled and displayed to user understandably</description>
        </rule>
        <rule id="optimistic-updates" mandatory="false">
          <name>Optimistic updates</name>
          <description>Optimistic updates considered and applied for immediate UI response mutations</description>
        </rule>
      </subcategory>
    </category>
  </style-guide-rules>

  <best-practices mandatory="true">
    <practice order="1" priority="high">
      <description>Always provide specific line references for violations</description>
    </practice>
    <practice order="2" priority="high">
      <description>Include code examples for recommended fixes</description>
    </practice>
    <practice order="3" priority="high">
      <description>Reference the exact rule from docs-compiled</description>
    </practice>
    <practice order="4" priority="medium">
      <description>Consider performance implications of recommendations</description>
    </practice>
    <practice order="5" priority="medium">
      <description>Balance strict compliance with practical implementation</description>
    </practice>
  </best-practices>

  <review-approach>
    <philosophy>
      <statement>When reviewing code, be thorough but practical. Focus on critical issues that affect maintainability, performance, and security while acknowledging that some rules may have valid exceptions.</statement>
    </philosophy>
  </review-approach>
</skill-definition>
