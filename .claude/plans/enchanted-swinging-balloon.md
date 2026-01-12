# План исправления проблем производительности при переключении Warranty

## Описание проблемы

При переключении между warranty (когда в store уже есть данные от предыдущей warranty) происходит:
1. **Долгий pending** - занимает несколько секунд (2-5 сек) вместо мгновенного ответа
2. **Множественные ререндеры** компонента `WarrantySalesChannel` - видно по множественным вызовам лога `SalesChannelData`
3. **Запрос к API завершается быстро** (до 500ms), но `fulfilled` не вызывается сразу после завершения запроса
4. **При первичной загрузке** (когда store пустой) всё работает быстро

## Диагностика (подтверждённая пользователем)

- ✅ Pending вызывается ОДИН раз (не множественные запросы)
- ✅ Запрос к API завершается быстро (до 500ms)
- ✅ Трансформация данных выполняется мгновенно
- ✅ Задержка происходит между завершением запроса и вызовом `matchFulfilled`

## Корневая причина проблемы

### 🔴 КОНФЛИКТ RTK QUERY ПАРАМЕТРОВ

Два разных места в коде используют `useGetWarrantyClaimQuery` с **РАЗНЫМИ** параметрами:

**1. WarrantyClaimPage.tsx (строка 32):**
```typescript
useGetWarrantyClaimQuery(Number(params.warrantyClaimId), {
  skip: !params.warrantyClaimId
  // НЕТ refetchOnMountOrArgChange - использует кэш
});
```

**2. useWarrantyDecisionData.ts (строки 16-19):**
```typescript
useGetWarrantyClaimQuery(warrantyId!, {
  skip: !warrantyId || typeof warrantyId !== 'number',
  refetchOnMountOrArgChange: true,  // <-- КОНФЛИКТ!
});
```

**Что происходит:**
1. При переключении warranty оба хука активны одновременно
2. WarrantyClaimPage хочет использовать кэшированные данные
3. useWarrantyDecisionData форсирует новый запрос (`refetchOnMountOrArgChange: true`)
4. RTK Query видит конфликт и пытается синхронизировать два хука
5. **Устанавливается pending, запрос делается быстро, НО fulfilled задерживается из-за синхронизации кэша**

Это объясняет почему при первичной загрузке (когда нет кэша) всё быстро - нет конфликта!

### 2. Компонент использует слишком много селекторов
- `src/features/warranty-claim/sales-channel/ui/WarrantySalesChannel.tsx` использует 7 отдельных `useAppSelector`:
  - `selectWarrantyClaimState` (строка 21)
  - `selectSalesChannels` (строка 22)
  - `selectImplementationLoading` (строка 23)
  - `selectCustomerInfo` (строка 25)
  - `selectDefectActDate` (строка 26)
  - `selectDefectiveTransferDate` (строка 27)
  - `selectWarrantyIssueDate` (строка 28)
- Каждое изменение любого из этих полей вызывает ререндер всего компонента

### 3. Проблемы в implementation-slice
- `src/entities/warranty-claim/model/slices/implementation-slice.ts:472-490` слушает RTK Query lifecycle events
- При `matchPending` устанавливает `loading: true`
- При `matchFulfilled` выполняет тяжелую трансформацию данных `transformImplementationResponseToLocal`

### 4. Preprocessing и валидация могут быть медленными
- В `claims.ts:38-145` функция `preprocessWarrantyData` делает много проверок
- В `claims.ts:266` выполняется Zod валидация через `WarrantyObjectResponseSchema.parse`
- Для больших объектов это может занимать время

## Решение

### ✅ Этап 1: КРИТИЧЕСКИЙ - Устранить конфликт RTK Query параметров

**Проблема:** Два хука используют разные параметры для одного endpoint. При переключении warranty RTK Query делает запрос быстро, но fulfilled задерживается на 2-5 секунд из-за конфликта синхронизации между двумя подписками с разными параметрами.

**Решение (выбрать один из вариантов):**

#### Вариант A (РЕКОМЕНДУЕТСЯ): Унифицировать параметры в ОБОИХ хуках

**Суть:** Оба хука должны использовать одинаковую стратегию refetch, чтобы RTK Query не тормозил на синхронизации fulfilled.

**Файл 1:** `src/pages/warranty-claims/WarrantyClaimPage.tsx`

**БЫЛО (строка 32):**
```typescript
} = useGetWarrantyClaimQuery(Number(params.warrantyClaimId), {
  skip: !params.warrantyClaimId
  // БЕЗ refetchOnMountOrArgChange
});
```

**СТАЛО:**
```typescript
} = useGetWarrantyClaimQuery(Number(params.warrantyClaimId), {
  skip: !params.warrantyClaimId,
  refetchOnMountOrArgChange: 1,  // ДОБАВИТЬ - refetch если прошла 1+ секунда
});
```

**Файл 2:** `src/entities/warranty-claim-decision/lib/hooks/useWarrantyDecisionData.ts`

**БЫЛО (строки 16-19):**
```typescript
} = useGetWarrantyClaimQuery(warrantyId!, {
  skip: !warrantyId || typeof warrantyId !== 'number',
  refetchOnMountOrArgChange: true,  // <-- АГРЕССИВНО, вызывает конфликт
});
```

**СТАЛО:**
```typescript
} = useGetWarrantyClaimQuery(warrantyId!, {
  skip: !warrantyId || typeof warrantyId !== 'number',
  refetchOnMountOrArgChange: 0.5,  // ИЗМЕНИТЬ - refetch если прошло 500ms
});
```

**Обоснование:**
- **Было:** Хук 1 без refetch (использует кэш) vs Хук 2 с refetch=true (всегда запрос) → КОНФЛИКТ синхронизации
- **Стало:** Оба хука с числовым refetch (1 сек и 0.5 сек) → одинаковая стратегия → БЕЗ конфликта
- RTK Query видит консистентное поведение подписок
- fulfilled приходит мгновенно после завершения API запроса
- Разные значения (1 и 0.5 сек) дают небольшую разницу для минимизации одновременных запросов

#### Вариант B: Использовать разные значения для разных хуков (баланс)

**Файл 1:** `src/entities/warranty-claim-decision/lib/hooks/useWarrantyDecisionData.ts`
```typescript
refetchOnMountOrArgChange: 0.5,  // 500ms для decision хука
```

**Файл 2:** `src/pages/warranty-claims/WarrantyClaimPage.tsx`
```typescript
refetchOnMountOrArgChange: 1,  // 1 секунда для основного хука
```

**Обоснование:**
- Разные значения минимизируют конфликт
- Основной хук (WarrantyClaimPage) делает запрос реже
- Decision хук обновляется чаще (нужны свежие decision данные)

#### Вариант C: Manual refetch через useEffect

**Файл:** `src/entities/warranty-claim-decision/lib/hooks/useWarrantyDecisionData.ts`

**Добавить useEffect для refetch при изменении warrantyId:**
```typescript
const {
  data: warrantyData,
  isLoading,
  error,
  refetch,
} = useGetWarrantyClaimQuery(warrantyId!, {
  skip: !warrantyId || typeof warrantyId !== 'number',
  // БЕЗ refetchOnMountOrArgChange
});

// ДОБАВИТЬ useEffect:
const prevWarrantyIdRef = useRef<number | null>(null);

useEffect(() => {
  // Делать refetch только если warrantyId действительно изменился
  if (warrantyId && warrantyId !== prevWarrantyIdRef.current) {
    prevWarrantyIdRef.current = warrantyId;
    refetch();
  }
}, [warrantyId, refetch]);
```

**Обоснование:**
- Полный контроль над refetch логикой
- Refetch только при реальном изменении `warrantyId`
- Нет конфликта с другими хуками
- Самое надёжное решение, но требует больше кода

### Этап 2: Оптимизация селекторов в компоненте

**Файл:** `src/features/warranty-claim/sales-channel/ui/WarrantySalesChannel.tsx`

Объединить множественные селекторы в один для минимизации ререндеров:

**Option A (рекомендуется):** Создать один составной селектор

**Новый файл:** `src/entities/warranty-claim/model/selectors/implementation-selectors.ts`

```typescript
// Добавить новый селектор который возвращает все нужные данные разом
export const selectSalesChannelData = createSelector(
  [
    selectSalesChannels,
    selectImplementationLoading,
    selectCustomerInfo,
    selectDefectActDate,
    selectDefectiveTransferDate,
    selectWarrantyIssueDate,
  ],
  (salesChannels, loading, customer, defectActDate, defectiveTransferDate, warrantyIssueDate) => ({
    salesChannels,
    loading,
    customer,
    defectActDate,
    defectiveTransferDate,
    warrantyIssueDate,
  })
);
```

Затем в компоненте заменить 6 отдельных селекторов на 1:

```typescript
// БЫЛО:
const salesChannelsArray = useAppSelector(selectSalesChannels);
const isLoading = useAppSelector(selectImplementationLoading);
const implementationCustomer = useAppSelector(selectCustomerInfo);
const defectActDate = useAppSelector(selectDefectActDate);
const defectiveTransferDate = useAppSelector(selectDefectiveTransferDate);
const warrantyIssueDate = useAppSelector(selectWarrantyIssueDate);

// СТАЛО:
const {
  salesChannels: salesChannelsArray,
  loading: isLoading,
  customer: implementationCustomer,
  defectActDate,
  defectiveTransferDate,
  warrantyIssueDate,
} = useAppSelector(selectSalesChannelData);
```

**Option B:** Обернуть компонент в `React.memo` с правильным `areEqual` компаратором

### Этап 3: Удалить debug console.log

**Файлы для очистки:**
- `src/features/warranty-claim/sales-channel/ui/WarrantySalesChannel.tsx:34`
- `src/entities/warranty-claim/model/slices/implementation-slice.ts:474,482,487`

Удалить или обернуть в development режим:

```typescript
// УДАЛИТЬ ИЛИ ЗАМЕНИТЬ НА:
if (process.env.NODE_ENV === 'development') {
  console.log('SalesChannelData', { ... });
}
```

## Критические файлы для изменения

### 🔴 ПРИОРИТЕТ 1 - Главная проблема (обязательно):

**Выбрать ОДИН из вариантов:**

#### ✅ Вариант A (РЕКОМЕНДУЕТСЯ - унифицировать параметры в обоих хуках):
1. **src/pages/warranty-claims/WarrantyClaimPage.tsx** - ДОБАВИТЬ `refetchOnMountOrArgChange: 1`
2. **src/entities/warranty-claim-decision/lib/hooks/useWarrantyDecisionData.ts** - ИЗМЕНИТЬ `refetchOnMountOrArgChange: true` → `refetchOnMountOrArgChange: 0.5`

**Результат:** Оба хука используют одинаковую стратегию → нет конфликта синхронизации → fulfilled приходит мгновенно

#### Вариант B (альтернатива - только один файл):
1. **src/entities/warranty-claim-decision/lib/hooks/useWarrantyDecisionData.ts** - изменить `refetchOnMountOrArgChange: true` → `refetchOnMountOrArgChange: 0.5`

**Результат:** Может помочь, но не гарантирует полное решение конфликта

#### Вариант C (самый надёжный, но больше кода):
1. **src/entities/warranty-claim-decision/lib/hooks/useWarrantyDecisionData.ts** - убрать `refetchOnMountOrArgChange: true` и добавить useEffect с manual refetch

**Результат:** Полный контроль над refetch, гарантированно без конфликтов

### ✅ ПРИОРИТЕТ 2 - Оптимизация (желательно):
2. **src/entities/warranty-claim/model/selectors/implementation-selectors.ts** - добавить `selectSalesChannelData`
3. **src/features/warranty-claim/sales-channel/ui/WarrantySalesChannel.tsx** - использовать объединённый селектор
4. **src/entities/warranty-claim/model/slices/implementation-slice.ts** - удалить console.log
5. **src/features/warranty-claim/sales-channel/ui/WarrantySalesChannel.tsx** - удалить console.log

## Ожидаемый результат

### После исправления ПРИОРИТЕТА 1 (главная проблема):
1. ✅ **МГНОВЕННЫЙ fulfilled после завершения API запроса** - нет задержки синхронизации
2. ✅ **Быстрое переключение** между warranty (до 500ms вместо 2-5 секунд)
3. ✅ **Консистентное поведение** RTK Query кэша
4. ✅ **При первичной и повторной загрузке одинаковая скорость**

### После исправления ПРИОРИТЕТА 2 (оптимизация):
1. ✅ **Минимум ререндеров** компонента благодаря объединённому селектору
2. ✅ **Чистый console** без debug логов

## Альтернативные подходы (если основное решение не сработает)

1. **Создать отдельный endpoint** для decision данных, чтобы избежать конфликта с основным warranty endpoint
2. **Использовать `skipToken`** в одном из хуков для временного отключения
3. **Добавить middleware** для принудительной синхронизации RTK Query хуков
