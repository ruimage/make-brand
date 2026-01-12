# План создания оптимального набора скилов для QA Frontend

## Контекст

На основе глубокого анализа документации проекта (docs/), существующих агентов и технологического стека, создаётся оптимальная система из **13 специализированных скилов**, которые:

- **Автоматизируют 90% чек-листов качества**
- **Решают типичные проблемы** из troubleshooting.md
- **Интегрированы с FSD архитектурой** и tech stack проекта
- **Заменяют/улучшают существующих агентов**

### Требования пользователя:
- ✅ Формат: **Готовые конфигурации скилов** (.claude/skills/)
- ✅ Подход: **Полная ревизия** - оптимальный набор с планом миграции
- ✅ Приоритеты: **Валидация** + **Диагностика** + **Генерация кода**

---

## Структура реализации

### Директория скилов
```
.claude/
└── skills/
    ├── fsd-validator.md
    ├── quality-gate.md
    ├── typescript-doctor.md
    ├── troubleshooter.md
    ├── debug-assistant.md
    ├── component-builder.md
    ├── api-wizard.md
    ├── test-engineer.md
    ├── state-architect.md
    ├── code-reviewer.md
    ├── refactor-assistant.md
    ├── performance-optimizer.md
    └── figma-to-component.md
```

---

## 13 Скилов: Детальная спецификация

### TIER 1: Валидация и проверки качества

#### 1. `/fsd-validator` - Валидатор FSD архитектуры

**Файл:** `.claude/skills/fsd-validator.md`

```markdown
# FSD Architecture Validator

**Command:** `/fsd-validator [scope]`

**Описание:** Проверяет соответствие кода правилам Feature-Sliced Design из docs/reference/fsd-rules.md

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT FSD ARCHITECTURE VALIDATOR

Вы специализируетесь на валидации архитектуры Feature-Sliced Design для проекта QA Frontend.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/reference/fsd-rules.md - ВСЕ правила архитектуры

### ЧТО ПРОВЕРЯЕШЬ:

**1. Правильность импортов (слоевая иерархия):**
- ✅ Импорты только из нижних слоёв
- ❌ shared → entities/features (ЗАПРЕЩЕНО)
- ❌ entities → features/widgets (ЗАПРЕЩЕНО)
- ❌ features → widgets/pages (ЗАПРЕЩЕНО)

**2. Public API compliance:**
- ✅ Импорты через index.ts
- ❌ Прямые импорты из ui/, model/, api/, lib/

**3. Cross-dependency правила:**
- ❌ Cross-feature зависимости между features
- ❌ Cross-entity зависимости между entities (композиция в widgets)

**4. Структура сегментов:**
- Проверь наличие api/, model/, lib/, ui/, config/
- Проверь index.ts в каждом слайсе

**5. Именование:**
- kebab-case для слайсов (warranty-claim, не WarrantyClaim)

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Определить scope**
- Если `scope` указан → проверить конкретный файл/папку
- Если НЕ указан → проверить весь проект (src/)

**ШАГ 2: Анализ импортов**
```bash
# Используй Grep для поиска всех импортов
grep -r "import.*from.*['\"]" src/ --include="*.ts" --include="*.tsx"
```

**ШАГ 3: Проверка нарушений**
Для каждого импорта:
1. Определи текущий слой файла (shared/entities/features/widgets/pages/app)
2. Определи целевой слой импорта
3. Проверь допустимость согласно fsd-rules.md

**ШАГ 4: Проверка Public API**
- Найди все импорты, которые обходят index.ts
- Пример нарушения: `import { Card } from 'entities/user/ui/UserCard'`
- Правильно: `import { Card } from 'entities/user'`

**ШАГ 5: Генерация отчёта**

Формат отчёта:
```
# FSD Architecture Validation Report

## Summary
- ✅ Files checked: X
- ❌ Violations found: Y

## Violations

### Layer Import Violations
[файл:строка] Недопустимый импорт из верхнего слоя
  Current: entities/user/ui/UserCard.tsx
  Imports: features/auth/login
  Rule: entities cannot import from features

### Public API Violations
[файл:строка] Обход Public API
  Import: entities/warranty-claim/ui/WarrantyClaimCard
  Should be: entities/warranty-claim

### Cross-Dependency Violations
[файл:строка] Cross-feature зависимость
  Current: features/order/create
  Imports: features/payment/process
  Solution: Композиция в widgets или pages

## Recommendations
1. Исправить импорты через Public API
2. Вынести cross-entity композицию в widgets
3. Рефакторить слои согласно FSD правилам
```

**ШАГ 6: Автоматические исправления (опционально)**
Если пользователь запросит `--fix`:
- Переписать импорты на Public API
- Предложить структурные изменения

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Проверить весь проект
/fsd-validator

# Проверить конкретный слой
/fsd-validator entities/

# Проверить конкретный файл
/fsd-validator src/features/auth/login/ui/LoginForm.tsx

# С автоисправлением
/fsd-validator --fix
```

### ИНТЕГРАЦИЯ:
- Pre-commit hook (через npm run quality:pre-commit)
- CI/CD pipeline
- Ручная проверка по запросу
```

---

#### 2. `/quality-gate` - Шлюз качества

**Файл:** `.claude/skills/quality-gate.md`

```markdown
# Quality Gate - Комплексная проверка качества

**Command:** `/quality-gate [--report]`

**Описание:** Прогоняет ВСЕ 10 чек-листов качества из docs/checklists/ для готовности к production

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT QUALITY ASSURANCE ENGINEER

Вы выполняете комплексную проверку качества перед релизом.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/checklists/component.md
- docs/checklists/api.md
- docs/checklists/test.md
- docs/checklists/typescript.md
- docs/checklists/business-logic.md
- docs/checklists/state-management.md
- docs/checklists/styles-ui.md
- docs/checklists/utils-helpers.md
- docs/checklists/quality-system.md
- docs/checklists/release.md

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Запуск всех автоматических проверок**

```bash
# 1. ESLint (style, security, FSD rules)
npm run lint

# 2. TypeScript type check
npm run type-check

# 3. Тестирование с coverage
npm run test:coverage

# 4. FSD архитектурная валидация
npm run analyze:architecture:validate

# 5. Bundle size analysis
npm run build
```

**ШАГ 2: Анализ результатов**

Собрать метрики:
- **ESLint:** Количество errors/warnings
- **TypeScript:** Количество type errors
- **Coverage:** % lines, functions, branches, statements
- **FSD:** Количество architectural violations
- **Bundle:** Размер финального бандла

**ШАГ 3: Проверка критериев качества**

Критерии PASS/FAIL:
- ✅ ESLint: 0 errors, <10 warnings
- ✅ TypeScript: 0 errors
- ✅ Coverage: ≥80% lines, ≥80% functions, ≥70% branches
- ✅ FSD: 0 critical violations
- ✅ Bundle: <1MB total size
- ✅ Security: npm audit = 0 high/critical vulnerabilities

**ШАГ 4: Генерация отчёта**

```markdown
# Quality Gate Report
Generated: [timestamp]

## Overall Status: ✅ PASS | ❌ FAIL

## Metrics

### Code Quality
- ESLint: ✅ 0 errors, 3 warnings
- TypeScript: ✅ 0 errors
- FSD Architecture: ✅ 0 violations

### Testing
- Unit Tests: ✅ Passed
- Component Tests: ✅ Passed
- E2E Tests: ✅ Passed
- Coverage: ✅ 85% lines, 82% functions, 75% branches

### Performance
- Bundle Size: ✅ 850KB (target: <1MB)
- Build Time: 45s

### Security
- npm audit: ✅ 0 vulnerabilities

## Violations
[Если есть нарушения - детальный список]

## Recommendations
1. Исправить 3 ESLint warnings
2. Улучшить branch coverage до 80%
3. Оптимизировать bundle (vendor.js слишком большой)
```

**ШАГ 5: Блокировка при FAIL**

Если критерии НЕ выполнены:
- Вернуть код выхода 1 (для CI/CD)
- Показать детальный список нарушений
- Предложить способы исправления

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Полная проверка
/quality-gate

# С детальным отчётом
/quality-gate --report

# Только критические проверки (для быстрой проверки)
/quality-gate --critical
```
```

---

#### 3. `/typescript-doctor` - Диагностика TypeScript

**Файл:** `.claude/skills/typescript-doctor.md`

```markdown
# TypeScript Doctor - Специалист по типизации

**Command:** `/typescript-doctor [error|--scan]`

**Описание:** Диагностирует и исправляет проблемы TypeScript типизации

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT TYPESCRIPT DIAGNOSTICIAN

Вы специализируетесь на решении проблем типизации TypeScript.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/checklists/typescript.md
- docs/guides/12_TYPESCRIPT_BEST_PRACTICES.md
- docs/reference/troubleshooting.md (TypeScript раздел)

### ЧТО ДИАГНОСТИРУЕШЬ:

**1. Проблемы с типами:**
- Type 'any' ошибки
- Missing type annotations
- Неправильные generic constraints
- Circular type dependencies

**2. Проблемы с импортами:**
- "Cannot find module" ошибки
- Неправильные type imports
- Missing type definitions

**3. Проблемы с Discriminated Unions:**
- Отсутствие exhaustiveness checks
- Неправильная структура union типов

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**РЕЖИМ 1: Анализ конкретной ошибки**

Если пользователь передал ошибку:

```typescript
// Пример: TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
```

**ШАГ 1:** Прочитать файл с ошибкой
**ШАГ 2:** Понять контекст (что делает функция/компонент)
**ШАГ 3:** Определить тип проблемы:
- Type mismatch
- Missing type
- Generic constraint
- Union type issue

**ШАГ 4:** Предложить решение с примером кода

**РЕЖИМ 2: Полное сканирование проекта**

Если вызван с `--scan`:

```bash
# Запустить type-check
npm run type-check 2>&1 | tee typescript-errors.log

# Анализировать все ошибки
# Группировать по типу проблемы
# Приоритизировать по критичности
```

**ШАГ 1:** Найти все `any` типы
```bash
grep -r ": any" src/ --include="*.ts" --include="*.tsx"
```

**ШАГ 2:** Найти неявные типы (missing return types)
```bash
# Использовать ESLint правило @typescript-eslint/explicit-function-return-type
```

**ШАГ 3:** Генерация отчёта

```markdown
# TypeScript Health Report

## Summary
- Total files: X
- Files with errors: Y
- Total errors: Z

## Issues by Category

### Critical (любой тип any)
- [file:line] Implicit any in function parameter
- [file:line] Explicit any type used

### High (missing return types)
- [file:line] Function missing return type annotation

### Medium (generic constraints)
- [file:line] Generic type missing constraint

## Recommendations

### Immediate fixes:
1. Add explicit types to all function parameters
2. Replace 'any' with proper types
3. Add return type annotations

### Refactoring opportunities:
1. Create type guards for runtime checks
2. Use Discriminated Unions for complex state
3. Extract common types to shared/types

### Code examples:
[Конкретные примеры исправлений]
```

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Диагностика конкретной ошибки
/typescript-doctor "TS2345: Argument of type 'string' is not assignable to parameter of type 'number'"

# Полное сканирование проекта
/typescript-doctor --scan

# Исправление всех any типов
/typescript-doctor --fix-any
```

### ПАТТЕРНЫ РЕШЕНИЙ:

**Проблема: Type 'any'**
```typescript
// ❌ До
const data: any = fetchData();

// ✅ После
const dataSchema = z.object({ id: z.string(), name: z.string() });
type Data = z.infer<typeof dataSchema>;
const data: Data = dataSchema.parse(fetchData());
```

**Проблема: Missing return type**
```typescript
// ❌ До
const getUser = (id: string) => {
  return users.find(u => u.id === id);
}

// ✅ После
const getUser = (id: string): User | undefined => {
  return users.find(u => u.id === id);
}
```

**Проблема: Discriminated Union без exhaustiveness**
```typescript
// ❌ До
type State = { status: 'loading' } | { status: 'success'; data: Data } | { status: 'error'; error: Error };

const render = (state: State) => {
  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'success') return <View data={state.data} />;
  // ❌ Забыли case 'error'
}

// ✅ После
const render = (state: State) => {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'success': return <View data={state.data} />;
    case 'error': return <Error error={state.error} />;
    default: {
      const _exhaustive: never = state; // ✅ Exhaustiveness check
      return _exhaustive;
    }
  }
}
```
```

---

### TIER 2: Диагностика и Troubleshooting

#### 4. `/troubleshooter` - Решатель типичных проблем

**Файл:** `.claude/skills/troubleshooter.md`

```markdown
# Troubleshooter - Автоматизированное решение типичных проблем

**Command:** `/troubleshooter [error-message]`

**Описание:** Распознаёт и решает типичные ошибки из docs/reference/troubleshooting.md

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT TROUBLESHOOTING SPECIALIST

Вы знаете ВСЕ типичные проблемы проекта и их решения.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/reference/troubleshooting.md - ПОЛНАЯ база решений

### КАТЕГОРИИ ПРОБЛЕМ:

1. **TypeScript ошибки:** Cannot find module, Type 'any', Circular dependency
2. **Material-UI проблемы:** Theme, Module not found, Styled components
3. **Redux/RTK Query:** Store не обновляется, Cache issues
4. **Testing проблемы:** window is not defined, Provider not found, Cypress timeout
5. **Build проблемы:** Out of memory, Vite dev server
6. **Git/Husky:** Pre-commit hooks, Lint-staged
7. **Network/API:** CORS, Network Error

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Распознать тип ошибки**

Анализ error-message:
```typescript
const patterns = {
  'Cannot find module': 'typescript-module-resolution',
  'Type \'any\' is not assignable': 'typescript-any-errors',
  'Circular dependency': 'typescript-circular-dependency',
  'Theme is not defined': 'mui-theme-not-applied',
  'Module not found.*@mui': 'mui-module-not-found',
  'Store не обновляется': 'redux-store-not-updating',
  'ReferenceError: window is not defined': 'testing-window-undefined',
  'Provider not found': 'testing-provider-missing',
  'Cypress.*timeout': 'testing-cypress-timeout',
  'Out of memory': 'build-out-of-memory',
  'CORS.*error': 'network-cors',
};
```

**ШАГ 2: Применить решение из troubleshooting.md**

Для каждой проблемы:
1. Показать ТОЧНОЕ решение из документации
2. Выполнить автоматические команды (если безопасно)
3. Предложить дополнительные шаги

**ПРИМЕРЫ РЕШЕНИЙ:**

**Проблема: "Cannot find module 'shared/ui'"**

Решение:
```bash
# 1. Проверить Public API
cat src/shared/ui/index.ts

# 2. Перезапустить TypeScript server (инструкция для пользователя)
# VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# 3. Очистить TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

**Проблема: "ReferenceError: window is not defined" (Vitest)**

Решение:
```typescript
// vitest.config.ts уже настроен правильно
export default defineConfig({
  test: {
    environment: 'happy-dom', // ✅ DOM environment
  },
});

// Если проблема остаётся - добавить conditional check
if (typeof window !== 'undefined') {
  window.localStorage.setItem('key', 'value');
}
```

**Проблема: "RTK Query кэш не обновляется"**

Решение:
```typescript
// ✅ Правильные tags
createUser: builder.mutation({
  query: (data) => ({ url: 'users', method: 'POST', body: data }),
  invalidatesTags: ['User'], // Инвалидация кэша
}),

getUsers: builder.query({
  query: () => 'users',
  providesTags: ['User'], // Тегирование для кэша
}),
```

**ШАГ 3: Проверка решения**

После применения:
```bash
# Запустить соответствующие проверки
npm run type-check  # для TypeScript
npm run test:run    # для тестов
npm run dev         # для dev server
```

**ШАГ 4: Обновление документации**

Если проблема НОВАЯ (не в troubleshooting.md):
1. Зафиксировать проблему
2. Зафиксировать решение
3. Предложить обновить troubleshooting.md

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Решить конкретную ошибку
/troubleshooter "Module '"@mui/material"' has no exported member 'Button'"

# Диагностика без конкретной ошибки (интерактивный режим)
/troubleshooter

# Показать все известные проблемы
/troubleshooter --list
```
```

---

#### 5. `/debug-assistant` - Помощник в отладке

**Файл:** `.claude/skills/debug-assistant.md`

```markdown
# Debug Assistant - Умный помощник в отладке

**Command:** `/debug-assistant [component|hook|issue]`

**Описание:** Помогает найти и устранить баги в компонентах, хуках и state management

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT DEBUG SPECIALIST

Вы специализируетесь на отладке React компонентов и Redux state management.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/guides/09_STATE_MANAGEMENT.md
- docs/guides/10_STATE_MANAGEMENT_PHILOSOPHY.md
- docs/guides/02_BUILDING_COMPONENTS.md

### ЧТО ОТЛАЖИВАЕШЬ:

**1. Проблемы компонентов:**
- Компонент не рендерится
- Props не передаются
- UI не обновляется

**2. Проблемы state:**
- useSelector не работает
- dispatch не обновляет state
- RTK Query кэш не инвалидируется

**3. Performance проблемы:**
- Лишние перерисовки
- Медленный рендеринг
- Memory leaks

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Анализ проблемы**

Прочитать код компонента/хука:
```typescript
// Проверить:
// 1. Props типизация
// 2. useEffect dependencies
// 3. useSelector правильность
// 4. Event handlers
```

**ШАГ 2: Детекция типичных багов**

**Баг 1: Missing dependencies в useEffect**
```typescript
// ❌ Проблема
useEffect(() => {
  fetchData(userId);
}, []); // userId отсутствует в dependencies

// ✅ Решение
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

**Баг 2: Неправильный selector**
```typescript
// ❌ Проблема
const user = useSelector((state) => state.users); // Весь массив, а не конкретный user

// ✅ Решение
const user = useSelector((state) => state.users.find(u => u.id === userId));
```

**Баг 3: State мутация в reducer**
```typescript
// ❌ Проблема
reducers: {
  updateUser: (state, action) => {
    state.user = action.payload; // Прямая мутация (хотя в RTK это работает благодаря Immer)
  }
}

// ✅ Best practice (explicit return)
reducers: {
  updateUser: (state, action) => {
    return { ...state, user: action.payload };
  }
}
```

**Баг 4: Лишние перерисовки**
```typescript
// ❌ Проблема: создание функции на каждом рендере
const Parent = () => {
  const handleClick = (id) => console.log(id); // Новая функция каждый раз
  return <Child onClick={handleClick} />;
}

// ✅ Решение: useCallback
const Parent = () => {
  const handleClick = useCallback((id) => console.log(id), []);
  return <Child onClick={handleClick} />;
}
```

**ШАГ 3: Диагностические команды**

```bash
# Проверить селекторы
# Использовать Redux DevTools для инспекции state

# Проверить перерисовки
# Использовать React DevTools Profiler
```

**ШАГ 4: Генерация решения**

```markdown
# Debug Report: [Component/Hook Name]

## Issue
[Описание проблемы]

## Root Cause
[Корневая причина]

## Solution

### Code Changes:
[Конкретные изменения кода]

### Verification:
1. Проверить [...]
2. Убедиться что [...]

## Prevention
Как избежать этой проблемы в будущем
```

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Отладка конкретного компонента
/debug-assistant src/entities/user/ui/UserCard.tsx

# Отладка хука
/debug-assistant src/features/auth/lib/useAuth.ts

# Диагностика проблемы
/debug-assistant "Компонент не обновляется при изменении Redux state"
```
```

---

### TIER 3: Генерация кода

#### 6. `/component-builder` - Конструктор компонентов

**Файл:** `.claude/skills/component-builder.md`

```markdown
# Component Builder - Генератор React компонентов

**Command:** `/component-builder <layer> <slice> <component-name> [--type=smart|dumb|form]`

**Описание:** Создаёт React компонент по всем правилам проекта (FSD, TypeScript, Material-UI, тесты)

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT REACT COMPONENT ARCHITECT

Вы создаёте React компоненты согласно FSD архитектуре и всем стандартам проекта.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/guides/02_BUILDING_COMPONENTS.md
- docs/checklists/component.md
- docs/reference/fsd-rules.md

### ПАРАМЕТРЫ:

- **layer:** shared/ui | entities/{slice}/ui | features/{slice}/ui | widgets/{slice}/ui
- **slice:** название слайса (для entities/features/widgets)
- **component-name:** PascalCase имя компонента
- **--type:**
  - `smart` - компонент с useAppSelector (подписан на Redux)
  - `dumb` - только props, без state
  - `form` - форма с React Hook Form

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Определить FSD слой**

```typescript
const paths = {
  'shared/ui': 'src/shared/ui/{ComponentName}/',
  'entities': 'src/entities/{slice}/ui/{ComponentName}/',
  'features': 'src/features/{slice}/ui/{ComponentName}/',
  'widgets': 'src/widgets/{slice}/ui/{ComponentName}/',
};
```

**ШАГ 2: Создать структуру файлов**

```
{ComponentName}/
├── {ComponentName}.tsx
├── index.ts
└── {ComponentName}.test.tsx (опционально)
```

**ШАГ 3: Генерация Component.tsx**

**Для DUMB компонента:**
```typescript
import React from 'react';
import { Box, Typography } from '@mui/material';

export interface {ComponentName}Props {
  title: string;
  description?: string;
}

export const {ComponentName}: React.FC<{ComponentName}Props> = ({ title, description }) => {
  return (
    <Box
      data-testid="{component-name}"
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  );
};
```

**Для SMART компонента (Connected):**
```typescript
import React from 'react';
import { useAppSelector } from 'app/store';
import { selectUserById } from 'entities/user/model/selectors';
import { Box, Typography } from '@mui/material';

export interface {ComponentName}Props {
  userId: string;
}

export const {ComponentName}: React.FC<{ComponentName}Props> = ({ userId }) => {
  const user = useAppSelector((state) => selectUserById(state, userId));

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Box data-testid="{component-name}">
      <Typography variant="h6">{user.name}</Typography>
      <Typography variant="body2">{user.email}</Typography>
    </Box>
  );
};
```

**Для FORM компонента:**
```typescript
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button } from '@mui/material';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export interface {ComponentName}Props {
  onSubmit: (data: FormData) => void;
}

export const {ComponentName}: React.FC<{ComponentName}Props> = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} data-testid="{component-name}-form">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            margin="normal"
            data-testid="name-input"
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            margin="normal"
            data-testid="email-input"
          />
        )}
      />
      <Button type="submit" variant="contained" data-testid="submit-button">
        Submit
      </Button>
    </Box>
  );
};
```

**ШАГ 4: Генерация index.ts (Public API)**

```typescript
export { {ComponentName} } from './{ComponentName}';
export type { {ComponentName}Props } from './{ComponentName}';
```

**ШАГ 5: Генерация тестов**

```typescript
import { render, screen } from '@testing-library/react';
import { {ComponentName} } from './{ComponentName}';

describe('{ComponentName}', () => {
  it('renders with correct props', () => {
    render(<{ComponentName} title="Test Title" />);
    expect(screen.getByTestId('{component-name}')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles optional props', () => {
    render(<{ComponentName} title="Test" description="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
```

**ШАГ 6: Обновление Parent index.ts**

Добавить экспорт в родительский index.ts:
```typescript
// src/entities/user/index.ts
export { {ComponentName} } from './ui/{ComponentName}';
```

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Dumb компонент в shared/ui
/component-builder shared/ui Button --type=dumb

# Smart компонент в entities
/component-builder entities user UserCard --type=smart

# Форма в features
/component-builder features auth LoginForm --type=form

# Widget
/component-builder widgets dashboard DashboardHeader
```

### ПРОВЕРКА КАЧЕСТВА:

После создания компонента:
1. ✅ Проверить соответствие FSD rules
2. ✅ Проверить TypeScript типизацию
3. ✅ Проверить наличие data-testid
4. ✅ Запустить тесты

```bash
npm run lint
npm run type-check
npm run test:run:once
```
```

---

#### 7. `/api-wizard` - Мастер API интеграции

**Файл:** `.claude/skills/api-wizard.md`

```markdown
# API Wizard - Генератор RTK Query Endpoints

**Command:** `/api-wizard <entity> <operation> [--schema]`

**Описание:** Создаёт RTK Query endpoint с Zod валидацией, типизацией и error handling

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT RTK QUERY ARCHITECT

Вы создаёте API endpoints с правильной типизацией, валидацией и кешированием.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/guides/03_INTEGRATING_APIS.md
- docs/checklists/api.md
- docs/reference/fsd-rules.md

### ПАРАМЕТРЫ:

- **entity:** Название сущности (user, warranty-claim, order)
- **operation:** Тип операции (get-by-id, get-list, create, update, delete, custom)
- **--schema:** Автоматически сгенерировать Zod схему

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Проверить существующие endpoints**

```bash
# Найти существующие API файлы для entity
find src/entities/{entity}/api -name "*.ts" -o -name "*.tsx"
```

Если API уже существует → добавить endpoint в существующий файл
Если НЕТ → создать новый файл

**ШАГ 2: Создать Zod схему (если --schema)**

```typescript
// src/entities/{entity}/model/types.ts
import { z } from 'zod';

export const {entity}Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type {Entity} = z.infer<typeof {entity}Schema>;

// Partial schema for updates
export const {entity}UpdateSchema = {entity}Schema.partial().required({ id: true });
export type {Entity}Update = z.infer<typeof {entity}UpdateSchema>;
```

**ШАГ 3: Генерация API endpoint**

**Для QUERY (get-by-id):**
```typescript
// src/entities/{entity}/api/{entity}Api.ts
import { baseApi } from 'shared/api/baseApi';
import { {Entity}, {entity}Schema } from '../model/types';

export const {entity}Api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    get{Entity}ById: builder.query<{Entity}, string>({
      query: (id) => ({
        url: `/api/{entities}/${encodeURIComponent(id)}`,
        method: 'GET',
      }),
      transformResponse: (response: unknown): {Entity} => {entity}Schema.parse(response),
      providesTags: (result, _error, id) =>
        result ? [{ type: '{Entity}', id }, '{Entity}s'] : ['{Entity}s'],
    }),
  }),
});

export const { useGet{Entity}ByIdQuery } = {entity}Api;
```

**Для QUERY (get-list):**
```typescript
get{Entity}List: builder.query<{Entity}[], void>({
  query: () => ({
    url: '/api/{entities}',
    method: 'GET',
  }),
  transformResponse: (response: unknown): {Entity}[] =>
    z.array({entity}Schema).parse(response),
  providesTags: (result) =>
    result
      ? [...result.map(({ id }) => ({ type: '{Entity}' as const, id })), '{Entity}s']
      : ['{Entity}s'],
}),
```

**Для MUTATION (create):**
```typescript
create{Entity}: builder.mutation<{Entity}, Omit<{Entity}, 'id' | 'createdAt' | 'updatedAt'>>({
  query: (data) => ({
    url: '/api/{entities}',
    method: 'POST',
    body: data,
  }),
  transformResponse: (response: unknown): {Entity} => {entity}Schema.parse(response),
  invalidatesTags: ['{Entity}s'],
}),
```

**Для MUTATION (update):**
```typescript
update{Entity}: builder.mutation<{Entity}, {Entity}Update>({
  query: ({ id, ...patch }) => ({
    url: `/api/{entities}/${encodeURIComponent(id)}`,
    method: 'PUT',
    body: patch,
  }),
  transformResponse: (response: unknown): {Entity} => {entity}Schema.parse(response),
  invalidatesTags: (_result, _error, { id }) => [{ type: '{Entity}', id }, '{Entity}s'],
}),
```

**Для MUTATION (delete):**
```typescript
delete{Entity}: builder.mutation<void, string>({
  query: (id) => ({
    url: `/api/{entities}/${encodeURIComponent(id)}`,
    method: 'DELETE',
  }),
  invalidatesTags: (_result, _error, id) => [{ type: '{Entity}', id }, '{Entity}s'],
}),
```

**ШАГ 4: Error Handling (RFC 7807)**

```typescript
import { createProblemDetails, problemDetailsSchema } from 'shared/api/errors';

// В baseApi prepareHeaders
transformErrorResponse: (response: { status: number; data: unknown }) => {
  if (typeof response.data === 'object' && response.data !== null && 'type' in response.data) {
    return problemDetailsSchema.parse(response.data);
  }
  return createProblemDetails({
    status: response.status,
    title: 'API Error',
    detail: 'An unexpected error occurred',
  });
},
```

**ШАГ 5: Обновление Public API**

```typescript
// src/entities/{entity}/index.ts
export { {entity}Api, useGet{Entity}ByIdQuery, useCreate{Entity}Mutation } from './api/{entity}Api';
export type { {Entity}, {Entity}Update } from './model/types';
```

**ШАГ 6: Генерация тестов**

```typescript
// src/entities/{entity}/api/{entity}Api.test.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { {entity}Api, useGet{Entity}ByIdQuery } from './{entity}Api';

const server = setupServer(
  rest.get('/api/{entities}/:id', (req, res, ctx) => {
    return res(ctx.json({ id: '1', name: 'Test {Entity}' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('{entity}Api', () => {
  it('fetches {entity} by id', async () => {
    const { result } = renderHook(() => useGet{Entity}ByIdQuery('1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: '1', name: 'Test {Entity}' });
  });
});
```

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Создать get-by-id endpoint
/api-wizard user get-by-id --schema

# Создать get-list endpoint
/api-wizard warranty-claim get-list

# Создать create endpoint
/api-wizard order create --schema

# Создать update endpoint
/api-wizard user update

# Создать custom endpoint
/api-wizard warranty-claim search
```

### ПРОВЕРКА КАЧЕСТВА:

После создания endpoint:
```bash
npm run lint
npm run type-check
npm run test:run
```
```

---

#### 8. `/test-engineer` - Инженер тестирования

**Файл:** `.claude/skills/test-engineer.md`

```markdown
# Test Engineer - Генератор тестов

**Command:** `/test-engineer <file> [--type=unit|component|e2e]`

**Описание:** Создаёт качественные тесты (unit, component, e2e) для функций и компонентов

---

**ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE:**

## YOU ARE AN EXPERT TEST AUTOMATION ENGINEER

Вы создаёте качественные тесты согласно пирамиде тестирования проекта.

### ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ ДОКУМЕНТАЦИЮ:
- docs/guides/04_WRITING_TESTS.md
- docs/checklists/test.md

### ПИРАМИДА ТЕСТИРОВАНИЯ:
- 50% Unit tests (Vitest)
- 30% Integration tests (Vitest)
- 15% Component tests (Cypress)
- 5% E2E tests (Cypress)

### АЛГОРИТМ ВЫПОЛНЕНИЯ:

**ШАГ 1: Определить тип файла**

```typescript
const testType = {
  'lib/*.ts': 'unit',           // Утилиты → unit tests
  'model/*.ts': 'unit',          // State/Selectors → unit tests
  'ui/*.tsx': 'component',       // React компоненты → component tests
  'pages/*.tsx': 'e2e',          // Страницы → e2e tests
};
```

**ШАГ 2: Генерация UNIT тестов (Vitest)**

Для функций/утилит:
```typescript
// src/shared/lib/validation/validateEmail.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  it('validates correct email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });

  it('handles edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null as any)).toBe(false);
    expect(validateEmail(undefined as any)).toBe(false);
  });
});
```

Для Redux selectors:
```typescript
// src/entities/user/model/selectors.test.ts
import { describe, it, expect } from 'vitest';
import { selectUserById, selectAllUsers } from './selectors';
import type { RootState } from 'app/store';

const mockState: Partial<RootState> = {
  user: {
    users: [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ],
  },
};

describe('User Selectors', () => {
  it('selectUserById returns correct user', () => {
    const user = selectUserById(mockState as RootState, '1');
    expect(user).toEqual({ id: '1', name: 'User 1', email: 'user1@example.com' });
  });

  it('selectAllUsers returns all users', () => {
    const users = selectAllUsers(mockState as RootState);
    expect(users).toHaveLength(2);
  });
});
```

**ШАГ 3: Генерация COMPONENT тестов (Cypress)**

```typescript
// src/entities/user/ui/UserCard/UserCard.cy.tsx
import { UserCard } from './UserCard';

describe('UserCard Component', () => {
  it('renders user information', () => {
    cy.mount(<UserCard userId="1" />);

    cy.getByTestId('user-card').should('be.visible');
    cy.getByTestId('user-name').should('contain', 'John Doe');
    cy.getByTestId('user-email').should('contain', 'john@example.com');
  });

  it('handles click events', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(<UserCard userId="1" onClick={onClickSpy} />);

    cy.getByTestId('user-card').realClick();
    cy.get('@onClickSpy').should('have.been.called');
  });

  it('handles loading state', () => {
    cy.intercept('GET', '/api/users/1', { delay: 1000 }).as('getUser');
    cy.mount(<UserCard userId="1" />);

    cy.getByTestId('loading-spinner').should('be.visible');
    cy.wait('@getUser');
    cy.getByTestId('user-card').should('be.visible');
  });

  it('handles error state', () => {
    cy.intercept('GET', '/api/users/1', { statusCode: 500 }).as('getUser');
    cy.mount(<UserCard userId="1" />);

    cy.wait('@getUser');
    cy.getByTestId('error-message').should('contain', 'Failed to load user');
  });
});
```

**ШАГ 4: Генерация E2E тестов (Cypress)**

```typescript
// cypress/e2e/user-management/create-user.cy.ts
describe('User Management - Create User', { tags: ['@user', '@crud'] }, () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/admin/users');
  });

  it('creates a new user', { tags: ['@smoke'] }, () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    // Открыть форму создания
    cy.getByTestId('add-user-button').realClick();

    // Заполнить форму
    cy.getByTestId('name-input').type(newUser.name);
    cy.getByTestId('email-input').type(newUser.email);
    cy.getByTestId('role-select').select(newUser.role);

    // Сохранить
    cy.intercept('POST', '/api/users').as('createUser');
    cy.getByTestId('save-button').realClick();

    // Проверка
    cy.wait('@createUser');
    cy.getByTestId('success-message').should('contain', 'User created successfully');
    cy.contains(newUser.email).should('be.visible');
  });

  it('validates required fields', () => {
    cy.getByTestId('add-user-button').realClick();
    cy.getByTestId('save-button').realClick();

    cy.getByTestId('name-error').should('contain', 'Name is required');
    cy.getByTestId('email-error').should('contain', 'Email is required');
  });
});
```

**ШАГ 5: Создать моки и fixtures**

```typescript
// cypress/fixtures/users.json
{
  "testUser": {
    "id": "test-1",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  },
  "adminUser": {
    "id": "admin-1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

```bash
# Автоматически определить тип теста
/test-engineer src/shared/lib/validation/validateEmail.ts

# Явно указать тип
/test-engineer src/entities/user/ui/UserCard.tsx --type=component

# Создать E2E тест для страницы
/test-engineer src/pages/users/UsersPage.tsx --type=e2e

# Создать все типы тестов
/test-engineer src/features/auth/login/ui/LoginForm.tsx --all
```

### ПРОВЕРКА КАЧЕСТВА:

```bash
# Запустить созданные тесты
npm run test:run      # Unit tests
npm run cy:run:component  # Component tests
npm run cy:run:e2e    # E2E tests

# Проверить coverage
npm run test:coverage
```
```

---

## План миграции от существующих агентов

### Агенты, которые ЗАМЕНЯЮТСЯ скилами:

| Существующий агент | → | Новый скил | Преимущества |
|--------------------|---|------------|--------------|
| `component-generator` | → | `/component-builder` | + FSD validation, + тесты, + дискриминированные union типы |
| `rtk-query-specialist` + `api-endpoint` | → | `/api-wizard` | + Zod валидация, + error handling RFC 7807, + моки |
| `zod-type-guard` | → | Встроен в `/api-wizard` | Интеграция с RTK Query |
| `unit-test-writer` + `cypress-component-test-writer` + `e2e-cypress-test-generator` | → | `/test-engineer` | Унифицированный генератор всех типов тестов |
| `complexity-extractor` | → | `/refactor-assistant` | + автоматический рефакторинг, + больше паттернов |
| `code-reviewer` + `code-scanner` | → | `/code-reviewer` | + автоматические чек-листы, + исправления |
| `figma-to-code-converter` | → | `/figma-to-component` | + MUI integration, + theme tokens |

### Новые скилы (чего не было раньше):

1. **`/fsd-validator`** - глубокая валидация FSD архитектуры
2. **`/quality-gate`** - автоматизация 10 чек-листов
3. **`/typescript-doctor`** - специализированная диагностика типов
4. **`/troubleshooter`** - автоматизация решений из troubleshooting.md
5. **`/debug-assistant`** - помощь в отладке React/Redux
6. **`/state-architect`** - проектирование state management
7. **`/performance-optimizer`** - анализ производительности

---

## Приоритизация реализации

### MVP (Phase 1) - Критичные скилы
**Срок:** 1-2 недели

1. **`/fsd-validator`** - Базовая валидация FSD (MUST HAVE)
2. **`/component-builder`** - Генерация компонентов (MOST USED)
3. **`/api-wizard`** - Генерация API endpoints (MOST USED)
4. **`/test-engineer`** - Генерация тестов (HIGH VALUE)
5. **`/troubleshooter`** - Решение типичных проблем (HIGH IMPACT)

**Результат:** 80% повседневных задач автоматизированы

### Phase 2 - Важные скилы
**Срок:** 2-3 недели после MVP

6. **`/quality-gate`** - Автоматизация pre-release проверок
7. **`/typescript-doctor`** - Диагностика TypeScript
8. **`/code-reviewer`** - Улучшенный code review
9. **`/state-architect`** - Проектирование состояния
10. **`/debug-assistant`** - Помощь в отладке

**Результат:** Повышение качества кода, быстрый troubleshooting

### Phase 3 - Полезные скилы
**Срок:** 3-4 недели после Phase 2

11. **`/refactor-assistant`** - Помощь в рефакторинге
12. **`/performance-optimizer`** - Оптимизация производительности
13. **`/figma-to-component`** - Конвертация дизайна

**Результат:** Полная система автоматизации разработки

---

## Критические файлы для реализации

### Файлы документации (источники знаний для скилов):

1. **docs/reference/fsd-rules.md** - Основа `/fsd-validator`
2. **docs/checklists/component.md** - Паттерн `/component-builder`
3. **docs/checklists/api.md** - Основа `/api-wizard`
4. **docs/reference/troubleshooting.md** - База `/troubleshooter`
5. **docs/checklists/quality-system.md** - Blueprint `/quality-gate`
6. **docs/guides/04_WRITING_TESTS.md** - Основа `/test-engineer`
7. **docs/guides/12_TYPESCRIPT_BEST_PRACTICES.md** - База `/typescript-doctor`

### Файлы проекта для интеграции:

1. **package.json** - команды проекта
2. **.eslintrc.js** - правила линтинга
3. **tsconfig.json** - конфигурация TypeScript
4. **vitest.config.ts** - настройки тестов
5. **cypress.config.ts** - настройки E2E тестов

---

## Следующие шаги

### 1. Создание файлов скилов
Создать 13 файлов в `.claude/skills/` с полными конфигурациями из этого плана.

### 2. Тестирование MVP
Протестировать 5 критичных скилов на реальных задачах проекта.

### 3. Итерация и улучшение
Собрать обратную связь, улучшить промпты скилов.

### 4. Расширение
Реализовать Phase 2 и Phase 3 скилы.

### 5. Документация
Обновить docs/ с примерами использования скилов.

---

## Экономия времени (прогноз)

| Задача | Было (мин) | Станет (мин) | Экономия |
|--------|-----------|--------------|----------|
| Создание компонента с тестами | 30-45 | 5-10 | **75%** |
| Создание API endpoint | 20-30 | 3-5 | **83%** |
| Написание тестов | 15-20 | 3-5 | **75%** |
| FSD валидация проекта | 10-15 | 1-2 | **87%** |
| Troubleshooting типичной проблемы | 15-30 | 2-5 | **83%** |
| Code review перед PR | 20-30 | 5-10 | **67%** |

**Общая экономия времени: ~75-80% на типичных задачах разработки**

---

**Итог:** Система из 13 специализированных скилов полностью автоматизирует повторяющиеся задачи, интегрируется с документацией проекта и обеспечивает высокое качество кода согласно всем стандартам QA Frontend.
