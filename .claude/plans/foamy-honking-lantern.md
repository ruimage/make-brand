# План: Реализация режимов отправки для SearchBox компонента

## Контекст задачи

**Проблема:** На странице warranty-claims используется SearchBox с `debounceMs={3000}` (3 секунды задержки). Пользователям нужна возможность отправлять поиск по нажатию Enter, не дожидаясь debounce.

**Требование:** Добавить гибкую настройку поведения SearchBox через параметр `triggerMode`:
- `'debounce'` - только автоматическая отправка после задержки (текущее поведение)
- `'enter'` - только отправка по Enter (debounce отключен)
- `'both'` - комбинированный режим: debounce работает + Enter отменяет debounce и отправляет немедленно

## Выбранный подход: Расширение SearchBox

**Обоснование:**
- Один универсальный компонент для всего проекта (используется в 20+ местах)
- Полная обратная совместимость через дефолтное значение `triggerMode='debounce'`
- Гибкая настройка под любой use case
- Не создает дублирование кода

## Техническое решение

### Миграция с useDebounceValue на lodash.debounce

**Причина:** `useDebounceValue` из `usehooks-ts` не предоставляет API для отмены таймера. Нужен `lodash.debounce` с методом `.cancel()`.

**Зависимости:** `lodash@4.17.21` уже в проекте (используется в StateSearchBox).

### Новая сигнатура компонента

```typescript
interface SearchBoxProps {
  // ... существующие пропсы
  triggerMode?: 'debounce' | 'enter' | 'both'; // НОВЫЙ
}
```

### Логика работы режимов

#### Режим 'debounce' (default):
- Используется `lodash.debounce` с настраиваемой задержкой `debounceMs`
- Enter НЕ обрабатывается
- Полная обратная совместимость с текущим поведением

#### Режим 'enter':
- Debounce полностью отключен
- Обработчик `onKeyDown` вызывает `props.onFilter()` при Enter
- Только ручная отправка

#### Режим 'both':
- Debounce активен (с `debounceMs`)
- При Enter: `debouncedCallback.cancel()` + немедленный `props.onFilter()`
- Лучшее из двух миров: автоматика + контроль

## Критические файлы

- `src/shared/ui/SearchBox.tsx` - рефакторинг debounce логики + добавление triggerMode
- `src/widgets/warranty-claims/warranty-claims-list/ui/WarrantyClaimsListWidget.tsx` - добавить `triggerMode='both'`
- `src/shared/ui/StateSearchBox.tsx` - референс для идей (lodash.debounce + Enter)

## TODOLIST - Реализация

### 📋 Фаза 1: Рефакторинг SearchBox.tsx

#### ✅ 1.1 Обновить импорты
- [ ] Удалить строку 5: `import { useDebounceValue } from 'usehooks-ts';`
- [ ] Добавить в строку 4 импорт: `debounce` из lodash (после `Clear`)
- [ ] Добавить в строку 1 импорт: `useRef` из React (после `useState`)

**Результат:**
```typescript
import React, { FunctionComponent, ReactNode, useEffect, useState, useRef } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Clear } from '@mui/icons-material';
import { debounce } from 'lodash';
```

#### ✅ 1.2 Обновить интерфейс SearchBoxProps
- [ ] Добавить строку 20: `triggerMode?: 'debounce' | 'enter' | 'both';`

**Результат (строки 7-21):**
```typescript
interface SearchBoxProps {
  caption?: string;
  helperText?: string;
  filter: string;
  width?: number;
  fullwidth?: boolean;
  endAdornment?: ReactNode;
  onFilterChanged: (filter: string) => void;
  onFilter: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  debounceMs?: number;
  autofocus?: boolean;
  triggerMode?: 'debounce' | 'enter' | 'both';
}
```

#### ✅ 1.3 Изменить состояния компонента
- [ ] Удалить строку 33: `const [debouncedFilter, setDebouncedFilter] = useDebounceValue<string>(...)`
- [ ] Добавить после строки 32: `const debouncedCallbackRef = useRef<ReturnType<typeof debounce> | null>(null);`

**Результат (строки 32-34):**
```typescript
const [currentFilter, setCurrentFilter] = useState<string>(props.filter);
const debouncedCallbackRef = useRef<ReturnType<typeof debounce> | null>(null);
```

#### ✅ 1.4 Удалить старый useEffect для debouncedFilter
- [ ] Удалить строки 35-39 (весь useEffect с проверкой `currentFilter === debouncedFilter`)

#### ✅ 1.5 Создать debounced функцию
- [ ] Добавить после строки 34 новый useEffect для создания debounced функции:

```typescript
useEffect(() => {
  const mode = props.triggerMode ?? 'debounce';

  if (mode === 'debounce' || mode === 'both') {
    debouncedCallbackRef.current = debounce(() => {
      props.onFilter();
    }, props.debounceMs ?? 1000);
  }

  return () => {
    debouncedCallbackRef.current?.cancel();
  };
}, [props.triggerMode, props.debounceMs, props.onFilter]);
```

#### ✅ 1.6 Добавить useEffect для вызова debounced функции
- [ ] Добавить после предыдущего useEffect:

```typescript
useEffect(() => {
  const mode = props.triggerMode ?? 'debounce';

  if (mode === 'debounce' || mode === 'both') {
    debouncedCallbackRef.current?.();
  }
}, [currentFilter, props.triggerMode]);
```

#### ✅ 1.7 Обновить useEffect для синхронизации с props.filter
- [ ] Оставить без изменений useEffect на строке 41-43 (синхронизация currentFilter с props.filter)

**Текущий код (без изменений):**
```typescript
useEffect(() => {
  props.onFilterChanged(currentFilter);
}, [currentFilter]);
```

#### ✅ 1.8 Создать обработчик Enter
- [ ] Добавить перед `handleSearchTextChange` новую функцию:

```typescript
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (disabled) return;

  const mode = props.triggerMode ?? 'debounce';

  if (event.key === 'Enter' && (mode === 'enter' || mode === 'both')) {
    event.preventDefault();

    if (mode === 'both') {
      debouncedCallbackRef.current?.cancel();
    }

    props.onFilter();
  }
};
```

#### ✅ 1.9 Упростить handleSearchTextChange
- [ ] Изменить строки 45-49 на:

```typescript
const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = event.target.value;
  setCurrentFilter(newValue);
};
```

**Удалить:** вызов `setDebouncedFilter(newValue)` (больше не нужен)

#### ✅ 1.10 Упростить handleClear
- [ ] Изменить строки 59-62 на:

```typescript
const handleClear = () => {
  setCurrentFilter('');
};
```

**Удалить:** вызов `setDebouncedFilter('')` (больше не нужен)

#### ✅ 1.11 Обновить TextField
- [ ] В строке 66-92 (компонент TextField) добавить проп `onKeyDown={handleKeyDown}` после строки 77 (`onChange={handleSearchTextChange}`)

**Результат (фрагмент):**
```typescript
<TextField
  disabled={disabled}
  variant="outlined"
  placeholder={props.caption ?? ''}
  helperText={props.helperText ?? ''}
  sx={{
    transition: (theme) => theme.transitions.create('width'),
    width: '100%',
  }}
  value={currentFilter}
  fullWidth={props.fullwidth}
  onChange={handleSearchTextChange}
  onKeyDown={handleKeyDown}
  InputProps={{
    // ... остальное без изменений
  }}
  autoFocus={props.autofocus}
  onFocus={handleFocus}
  onBlur={handleBlur}
/>
```

### 📋 Фаза 2: Обновление WarrantyClaimsListWidget.tsx

#### ✅ 2.1 Добавить triggerMode в SearchBox
- [ ] В строках 139-148 добавить проп `triggerMode='both'` после `debounceMs={3000}`

**Результат:**
```typescript
<SearchBox
  filter={searchValue}
  onFilterChanged={handleSearchChanged}
  onFilter={handleSearch}
  caption={'Search WI, article, supplier, order, documents'}
  helperText={''}
  fullwidth={isMobileOrTablet}
  width={580}
  debounceMs={3000}
  triggerMode='both'
/>
```

### 📋 Фаза 3: Тестирование

#### ✅ 3.1 TypeScript проверка
- [ ] Запустить: `npm run type-check`
- [ ] Убедиться что нет ошибок компиляции
- [ ] Проверить что новый проп `triggerMode` корректно типизирован

#### ✅ 3.2 Ручное тестирование warranty-claims
- [ ] Открыть страницу warranty-claims в браузере
- [ ] **Тест 1:** Ввести текст в поле поиска → НЕ нажимать Enter → подождать 3 секунды
  - ✅ Проверить: API запрос выполнился (через DevTools Network)
  - ✅ Проверить: Результаты обновились в таблице
- [ ] **Тест 2:** Ввести новый текст → нажать Enter до истечения 3 секунд
  - ✅ Проверить: API запрос выполнился немедленно
  - ✅ Проверить: Только ОДИН запрос (debounce отменен)
  - ✅ Проверить: Результаты обновились в таблице
- [ ] **Тест 3:** Нажать кнопку Clear (крестик)
  - ✅ Проверить: Поле очистилось
  - ✅ Проверить: API запрос выполнился (сброс фильтра)
- [ ] **Тест 4:** Быстро нажать Enter 2 раза подряд
  - ✅ Проверить: Нет дублирования запросов (RTK Query кеш)

#### ✅ 3.3 Регрессионное тестирование
- [ ] Найти 2-3 другие страницы с SearchBox (без triggerMode)
- [ ] **Например:** SuppliersListPage, ArticlesPage, etc.
- [ ] **Для каждой страницы:**
  - ✅ Ввести текст
  - ✅ Подождать debounce (обычно 1 секунда)
  - ✅ Проверить что запрос выполнился
  - ✅ Нажать Enter
  - ✅ Проверить что Enter НЕ вызывает дополнительный запрос (режим по умолчанию 'debounce')

#### ✅ 3.4 Проверка edge cases
- [ ] **Edge case 1:** Disabled состояние SearchBox
  - ✅ Установить `disabled={true}` временно
  - ✅ Проверить что Enter не работает
  - ✅ Откатить изменение
- [ ] **Edge case 2:** Пустое поле + Enter
  - ✅ Очистить поле
  - ✅ Нажать Enter
  - ✅ Проверить поведение (должно обрабатываться на уровне handleSearch)
- [ ] **Edge case 3:** Размонтирование компонента
  - ✅ Ввести текст (запустить debounce)
  - ✅ Быстро уйти со страницы (размонтирование)
  - ✅ Проверить консоль: нет ошибок о setState на размонтированном компоненте

## Edge cases и обработка ошибок

### 1. Быстрое двойное нажатие Enter
**Решение:** RTK Query кеширует запросы - дублирование автоматически предотвращено.

### 2. Изменение triggerMode динамически
**Решение:** useEffect с зависимостью от triggerMode пересоздает debounced функцию.

### 3. Unmount компонента с активным debounce
**Решение:** Cleanup функция в useEffect вызывает `.cancel()`.

### 4. Disabled состояние
**Решение:** Проверка `if (disabled) return;` в handleKeyDown.

### 5. Пустое значение поиска
**Решение:** Обработка на уровне `handleSearch` в WarrantyClaimsListWidget.

## Оценка времени

- Фаза 1 (рефакторинг SearchBox): 1-1.5 часа
- Фаза 2 (обновление Widget): 10 минут
- Фаза 3 (тестирование): 1 час
- **Итого:** ~2.5-3 часа

## Риски

**Низкий риск:**
- Обратная совместимость через дефолтное значение `triggerMode='debounce'`
- Изменения локализованы в одном компоненте
- Логика debounce изолирована

**Митигация:**
- Тщательное тестирование режима по умолчанию
- Проверка критичных страниц вручную
- TypeScript type-check
