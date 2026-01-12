# План: Добавление эндпоинта GET /api/reasons в RTK Query API

## Статус: ✅ Планирование завершено

## Обзор задачи

Добавить новый GET эндпоинт `/api/reasons` для получения справочника причин рекламаций с типизацией через Zod schemas и интеграцией в RTK Query.

## Архитектурные решения (обновлено согласно требованиям)

### ✅ Решение 1: Создать новый файл `src/shared/api/warranty-claims/reasons.ts`
**Обоснование:**
- Использовать `warrantyApi` с baseUrl `/warranty-api` (по требованию)
- Относительный URL `/reasons` → полный путь `/warranty-api/reasons`
- Размещение в директории `warranty-claims/` вместе с другими warranty-related эндпоинтами
- Следует паттерну `results.ts` в той же директории

### ✅ Решение 2: Использовать тег `'WarrantyReasons'`
**Обоснование:**
- По явному требованию пользователя
- Согласуется с другими warranty-специфичными тегами: `'WarrantyClaims'`, `'WarrantyCosts'`, `'WarrantyFiles'`, `'WarrantyResults'`
- Четко показывает принадлежность к warranty domain

### ✅ Решение 3: Zod validation в transformResponse
**Обоснование:**
- Следует паттерну `results.ts` который использует `ResultArraySchema.parse(response)`
- Строгая runtime валидация для warranty-critical данных
- Schema-first подход с полной type-safety

## Пошаговый план реализации

### Шаг 1: Создать Zod схемы
**Файл:** `src/api/contracts/reason.ts`

**Действие:** Добавить после существующей секции `RESPONSE SCHEMAS` (после строки 24):

```typescript
// ============= GET REASONS RESPONSE SCHEMAS =============

export const ReasonTypeResponseSchema = strictInDev(
  z.object({
    id: z.number(),
    nameRus: z.string(),
  }),
);

export const ReasonSubtypeResponseSchema = strictInDev(
  z.object({
    id: z.number(),
    nameRus: z.string(),
    type: ReasonTypeResponseSchema,
  }),
);
```

**Действие:** Добавить в секцию `EXPORTED TYPES` (после строки 30):

```typescript
export type ReasonTypeResponse = z.infer<typeof ReasonTypeResponseSchema>;
export type ReasonSubtypeResponse = z.infer<typeof ReasonSubtypeResponseSchema>;
```

### Шаг 2: Обновить warrantyApi
**Файл:** `src/shared/api/warranty-claims/base.ts`

**Действие:** Добавить `'WarrantyReasons'` в массив `tagTypes` в алфавитном порядке (после `'WarrantyFiles'`, перед `'WarrantyResults'`):

```typescript
tagTypes: [
  'WarrantyClaims',
  'Implementation',
  'Deal',
  'ShipmentDocument',
  'ImplementationDate',
  'UnifiedTransferDocument',
  'Order',
  'SolutionExecution',
  'WarrantyCosts',
  'WarrantyFiles',
  'WarrantyReasons', // <-- НОВЫЙ ТЕГ
  'WarrantyResults',
],
```

### Шаг 3: Создать API файл
**Файл:** `src/shared/api/warranty-claims/reasons.ts` (НОВЫЙ ФАЙЛ)

**Полный код:**

```typescript
import { warrantyApi } from './base';
import { z } from 'zod';
import { ReasonSubtypeResponse, ReasonSubtypeResponseSchema } from 'api/contracts/reason';

export const reasonsApi = warrantyApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarrantyReasons: builder.query<ReasonSubtypeResponse[], void>({
      query: () => ({
        url: '/reasons',
        method: 'GET',
      }),
      transformResponse: (response: unknown) => {
        const ReasonArraySchema = z.array(ReasonSubtypeResponseSchema);
        return ReasonArraySchema.parse(response);
      },
      providesTags: ['WarrantyReasons'],
      transformErrorResponse: (response) => {
        console.warn('WarrantyReasons API Error:', response);
        return 'Ошибка при загрузке причин рекламаций';
      },
    }),
  }),
});

export const { useGetWarrantyReasonsQuery } = reasonsApi;
```

**Ключевые элементы:**
- `warrantyApi.injectEndpoints` - расширение warranty API (baseUrl `/warranty-api`)
- `url: '/reasons'` - относительный путь → полный путь `/warranty-api/reasons`
- `ReasonSubtypeResponse[]` - типизация из Zod схемы
- `ReasonArraySchema.parse(response)` - строгая Zod валидация (паттерн `results.ts`)
- `providesTags: ['WarrantyReasons']` - тег для кэш-инвалидации
- `transformErrorResponse` - обработка ошибок с предупреждением (паттерн `results.ts`)
- **БЕЗ** `keepUnusedDataFor` - справочник критичный, не кэшируется агрессивно

### Шаг 4: Обновить экспорты
**Файл:** `src/shared/api/warranty-claims/index.ts`

**Действие:** Добавить импорт и экспорт нового модуля:

```typescript
import './reasons'; // Добавить в секцию импортов

export * from './reasons'; // Добавить в секцию экспортов
```

**Полный обновленный файл:**
```typescript
import './warranty-types';
import './claims';
import './solution';
import './implementation';
import './reports';
import './results';
import './reasons'; // <-- НОВЫЙ ИМПОРТ

export * from './warranty-types';
export * from './claims';
export * from './solution';
export * from './implementation';
export * from './reports';
export * from './results';
export * from './reasons'; // <-- НОВЫЙ ЭКСПОРТ
export * from './schemas/sales-channel';

export { warrantyApi } from './base';
```

## Критические файлы для изменения

1. **`src/api/contracts/reason.ts`**
   - Добавить Zod схемы: `ReasonTypeResponseSchema`, `ReasonSubtypeResponseSchema`
   - Экспортировать типы: `ReasonTypeResponse`, `ReasonSubtypeResponse`

2. **`src/shared/api/warranty-claims/base.ts`**
   - Добавить тег `'WarrantyReasons'` в массив `tagTypes`

3. **`src/shared/api/warranty-claims/reasons.ts`** (СОЗДАТЬ НОВЫЙ)
   - Создать эндпоинт `getWarrantyReasons` с использованием `warrantyApi.injectEndpoints`
   - Использовать Zod валидацию в `transformResponse`
   - Экспортировать хук `useGetWarrantyReasonsQuery`

4. **`src/shared/api/warranty-claims/index.ts`**
   - Добавить импорт и экспорт модуля `reasons`

## Референсные файлы (паттерны)

- `src/shared/api/warranty-claims/results.ts` - **ОСНОВНОЙ ПАТТЕРН** (Zod валидация, warrantyApi, transformErrorResponse)
- `src/shared/api/warranty-claims/base.ts` - определение warrantyApi с tagTypes
- `src/api/contracts/reason.ts` - существующие Zod схемы для reason domain

## Использование в компонентах

```typescript
import { useGetWarrantyReasonsQuery } from 'shared/api/warranty-claims';

function ReasonSelectComponent() {
  const { data: reasons, isLoading, isError, error } = useGetWarrantyReasonsQuery();

  if (isLoading) return <div>Загрузка причин...</div>;
  if (isError) return <div>Ошибка: {error}</div>;

  return (
    <select>
      <option value="">Выберите причину</option>
      {reasons?.map(reason => (
        <optgroup key={reason.type.id} label={reason.type.nameRus}>
          <option key={reason.id} value={reason.id}>
            {reason.nameRus}
          </option>
        </optgroup>
      ))}
    </select>
  );
}
```

## Преимущества решения

✅ Использует `warrantyApi` - правильный API для warranty domain (по требованию)
✅ Следует паттерну `results.ts` - строгая Zod валидация в `transformResponse`
✅ Тег `'WarrantyReasons'` - согласованность с другими warranty тегами
✅ Schema-first подход с полной type-safety (runtime + compile-time)
✅ Размещение в `warranty-claims/` - логическая группировка warranty эндпоинтов
✅ `transformErrorResponse` - понятные сообщения об ошибках для пользователей
✅ Готовность к расширению - легко добавить POST/PUT/DELETE мутации в будущем
