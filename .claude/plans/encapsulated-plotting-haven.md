# План: Реализация трех режимов работы SearchBox

## Цель
Добавить три режима работы строки поиска с типизированными настройками через discriminated union.

## Требования
1. **Debounce режим**: `{ type: 'Debounce', debounceMs: 300 }` - поиск через N мс после остановки ввода
2. **Enter режим**: `{ type: 'Enter' }` - поиск только по нажатию Enter
3. **DebounceAndEnter режим**: `{ type: 'DebounceAndEnter', debounceMs: 300 }` - поиск при первом из условий (ИЛИ логика)

**Поведение callbacks**: оба `onFilterChanged` и `onFilter` срабатывают ТОЛЬКО по событию (debounce/Enter), промежуточные изменения НЕ отслеживаются.

**Breaking change**: удалить `debounceMs?: number` prop, заменить на обязательный `searchMode: SearchMode`.

---

## Шаг 1: Создать типы SearchMode

**Файл**: `src/shared/types/search-mode.ts` (новый)

### Что создать:
```typescript
// Discriminated union типы
export type DebounceSearchMode = {
  readonly type: 'Debounce';
  readonly debounceMs: number;
};

export type EnterSearchMode = {
  readonly type: 'Enter';
};

export type DebounceAndEnterSearchMode = {
  readonly type: 'DebounceAndEnter';
  readonly debounceMs: number;
};

export type SearchMode =
  | DebounceSearchMode
  | EnterSearchMode
  | DebounceAndEnterSearchMode;

// Helper функции для удобства создания
export const createDebounceMode = (debounceMs: number = 1000): DebounceSearchMode => ({
  type: 'Debounce',
  debounceMs,
});

export const createEnterMode = (): EnterSearchMode => ({
  type: 'Enter',
});

export const createDebounceAndEnterMode = (debounceMs: number = 1000): DebounceAndEnterSearchMode => ({
  type: 'DebounceAndEnter',
  debounceMs,
});
```

**Обоснование решений**:
- `readonly` для immutability
- PascalCase для discriminator ('Debounce', 'Enter') - соответствует TypeScript conventions
- Helper функции следуют паттерну `money.ts` в проекте

---

## Шаг 2: Рефакторинг SearchBox

**Файл**: `src/shared/ui/SearchBox.tsx`

### Изменения в SearchBoxProps:

**Удалить**: `debounceMs?: number`

**Добавить**: `searchMode: SearchMode` (обязательный)

### Архитектурные решения:

#### A. Debounce режим
- Использовать существующий `useDebounceValue` из `usehooks-ts`
- Вызывать оба callback только после debounce
- Логика в useEffect при совпадении `currentFilter === debouncedFilter`

#### B. Enter режим
- Обработчик `onKeyDown` (НЕ onKeyPress - deprecated!)
- При `event.key === 'Enter'` вызывать оба callback немедленно
- Enter на пустой строке - ЗАПУСКАТЬ поиск (use case: сброс фильтра)

#### C. DebounceAndEnter режим
- **Проблема**: избежать двойного вызова при Enter до истечения debounce
- **Решение**: использовать `useRef` флаг `wasTriggeredByEnterRef`
- При Enter: установить флаг, вызвать callback
- В useEffect debounce: проверить флаг, пропустить если Enter уже сработал
- **Альтернатива**: lodash debounce с `.cancel()` (по примеру DebouncedTextField)

#### D. Clear кнопка
- Немедленный поиск во ВСЕХ режимах (включая Enter)
- Обоснование: явное действие пользователя, аналогично Enter
- Вызывать оба callback с пустой строкой

#### E. Синхронизация с props.filter
- useEffect для обновления локального состояния при изменении prop
- Защита от infinite loop: `if (props.filter !== currentFilter)`

### Ключевые изменения логики:

**БЫЛО** (текущий SearchBox):
- `onFilterChanged` вызывается при каждом изменении (строка 42)
- `onFilter` вызывается после debounce (строка 37)

**СТАНЕТ**:
- Локальное состояние `currentFilter` обновляется при каждом изменении
- Оба callback вызываются ТОЛЬКО при срабатывании триггера (debounce/Enter/Clear)
- Центральная функция `triggerSearch(value)` для вызова обоих callbacks

### Структура компонента:
```typescript
const SearchBox: FunctionComponent<SearchBoxProps> = (props) => {
  // State
  const [currentFilter, setCurrentFilter] = useState<string>(props.filter);
  const [disabled, setDisabled] = useState<boolean>(props.disabled || false);

  // Debounce для режимов с debounce
  const debounceMs = /* вычислить из searchMode */;
  const [debouncedFilter, setDebouncedFilter] = useDebounceValue(currentFilter, debounceMs);

  // Ref для предотвращения двойного вызова в DebounceAndEnter
  const wasTriggeredByEnterRef = useRef<boolean>(false);

  // Центральная функция для вызова callbacks
  const triggerSearch = useCallback((value: string) => {
    props.onFilterChanged(value);
    props.onFilter();
  }, [props.onFilterChanged, props.onFilter]);

  // Effect для Debounce режима
  useEffect(() => {
    if (props.searchMode.type === 'Debounce' && currentFilter === debouncedFilter) {
      triggerSearch(currentFilter);
    }
  }, [debouncedFilter, props.searchMode.type]);

  // Effect для DebounceAndEnter режима
  useEffect(() => {
    if (props.searchMode.type === 'DebounceAndEnter'
        && currentFilter === debouncedFilter
        && !wasTriggeredByEnterRef.current) {
      triggerSearch(currentFilter);
    }
    wasTriggeredByEnterRef.current = false;
  }, [debouncedFilter, props.searchMode.type]);

  // Handler для Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const mode = props.searchMode.type;
      if (mode === 'Enter' || mode === 'DebounceAndEnter') {
        event.preventDefault();
        if (mode === 'DebounceAndEnter') {
          wasTriggeredByEnterRef.current = true;
        }
        triggerSearch(currentFilter);
      }
    }
  };

  // Handler для изменения текста
  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCurrentFilter(newValue);
    setDebouncedFilter(newValue);
  };

  // Handler для Clear
  const handleClear = () => {
    setCurrentFilter('');
    setDebouncedFilter('');
    triggerSearch(''); // Немедленный поиск
  };

  // Синхронизация с props.filter
  useEffect(() => {
    if (props.filter !== currentFilter) {
      setCurrentFilter(props.filter);
    }
  }, [props.filter]);

  // JSX с onKeyDown
  return (
    <TextField
      onKeyDown={handleKeyDown}
      // ... остальные props
    />
  );
};
```

---

## Шаг 3: Миграция всех использований SearchBox (20 файлов)

### Паттерны миграции:

**Без явного debounceMs** → `searchMode={createDebounceMode(1000)}`
```typescript
// БЫЛО
<SearchBox filter={value} onFilterChanged={...} onFilter={...} />

// СТАЛО
<SearchBox
  filter={value}
  onFilterChanged={...}
  onFilter={...}
  searchMode={createDebounceMode(1000)}
/>
```

**С кастомным debounceMs** → `searchMode={createDebounceMode(N)}`
```typescript
// БЫЛО
<SearchBox debounceMs={3000} ... />

// СТАЛО
<SearchBox searchMode={createDebounceMode(3000)} ... />
```

### Файлы для обновления (найдено ~20 использований):
- `src/pages/suppliers/list/ui/SuppliersListPage.tsx`
- `src/widgets/warranty-claims/warranty-claims-list/ui/WarrantyClaimsListWidget.tsx` (debounceMs=3000)
- `src/pages/product-keys/list/ui/ProductKeysPage.tsx`
- `src/components/customers/SelectCustomerDialog.tsx`
- `src/widgets/purchase-orders/bom-filter/ui/BomFilter.tsx`
- И другие (TypeScript покажет все ошибки компиляции)

**Стратегия**: обновить все за один PR (Big Bang approach) - только 20 мест, TypeScript гарантирует полноту миграции.

---

## Шаг 4: Тестирование

### Unit тесты (Vitest)
**Файл**: `src/shared/ui/SearchBox.test.tsx` (новый)

**Сценарии** (~15-20 тестов):
- Debounce режим: срабатывает после debounce, не срабатывает на Enter
- Enter режим: срабатывает только на Enter, не срабатывает по таймеру
- DebounceAndEnter: срабатывает на debounce, срабатывает на Enter, НЕ вызывается дважды
- Clear кнопка: немедленный поиск во всех режимах
- Синхронизация props.filter с локальным состоянием
- Enter на пустой строке: запускает поиск
- Disabled состояние: блокирует все взаимодействия

### Cypress Component тесты
**Файл**: `src/shared/ui/SearchBox.cy.tsx` (новый)

**Сценарии** (~20-25 тестов):
- Реальные UI взаимодействия (realType, realClick, realPress)
- Debounce timing: продолжение ввода сбрасывает таймер
- Keyboard events: Enter работает корректно
- Clear button: видимость, клик, очистка
- Accessibility: focus, disabled, placeholder
- DebounceAndEnter: Enter отменяет pending debounce

---

## Критические файлы для изменения

### Создать:
- `src/shared/types/search-mode.ts` - типы и helper функции
- `src/shared/ui/SearchBox.test.tsx` - unit тесты
- `src/shared/ui/SearchBox.cy.tsx` - Cypress тесты

### Изменить:
- `src/shared/ui/SearchBox.tsx` - основной рефакторинг
- ~20 файлов с использованиями SearchBox (см. Шаг 3)

---

## Ключевые решения и обоснования

### 1. Breaking change vs обратная совместимость
**Решение**: Breaking change - обязательный `searchMode` prop.
**Обоснование**: явный контракт API, type safety, форсирование миграции, нет технического долга.

### 2. Библиотека для debounce
**Решение**: `useDebounceValue` (usehooks-ts) для Debounce режима.
**Обоснование**: уже используется в проекте, простой API, автоматический cleanup.

### 3. DebounceAndEnter без двойного вызова
**Решение**: `useRef` флаг `wasTriggeredByEnterRef`.
**Обоснование**: простота, не требует переписывания на lodash debounce.

### 4. Clear кнопка
**Решение**: немедленный поиск во всех режимах.
**Обоснование**: intuitive UX, явное действие пользователя (как Enter).

### 5. Enter на пустой строке
**Решение**: запускать поиск.
**Обоснование**: use case сброса фильтра, показать все результаты.

### 6. onKeyDown vs onKeyPress
**Решение**: `onKeyDown`.
**Обоснование**: `onKeyPress` deprecated в React, StateSearchBox использует его по legacy причинам.

---

## Риски и митигации

**Риск**: пропущенные использования SearchBox
**Митигация**: TypeScript покажет ошибки компиляции, grep по кодовой базе для проверки

**Риск**: регрессия в существующем поведении
**Митигация**: comprehensive тестирование (35+ тестов), manual QA

**Риск**: breaking change для параллельных веток
**Митигация**: координация с командой, четкие release notes

---

## Оценка трудозатрат

- Создание типов: 1 час
- Рефакторинг SearchBox: 4 часа
- Миграция использований: 3 часа
- Unit тесты: 3 часа
- Cypress тесты: 4 часа
- Документация: 1 час

**Итого**: ~16 часов (2 рабочих дня)

---

## Reference файлы (для справки при реализации)

- `src/shared/ui/StateSearchBox.tsx` - паттерн Enter режима (onKeyPress на строке 78), НО использует deprecated onKeyPress
- `src/shared/ui/DebouncedTextField/DebouncedTextField.tsx` - паттерн flush и .cancel() для lodash debounce
- `src/shared/types/money.ts` - паттерн helper функций для типов
