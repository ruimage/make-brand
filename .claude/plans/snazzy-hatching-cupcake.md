# План реализации MUI Cypress Helpers

## 📊 Текущий статус работ

**Дата последнего обновления:** 2025-12-20

**Текущий этап:** ✅ **Phase 1 ЗАВЕРШЕНА! (6/6 helpers)** | 🔄 **Phase 2 ожидает начала**

### Прогресс выполнения:

| Этап | Статус | Прогресс | Helpers | Дни |
|------|--------|----------|---------|-----|
| **Подготовка (Infrastructure)** | ✅ Завершён | 3/3 (100%) | 0 | 2/2 |
| **Phase 1 (Input Components)** | ✅ ЗАВЕРШЁН | 6/6 (100%) | 6 | 12/10 |
| **Phase 2 (Interaction Components)** | ⏳ Не начат | 0/5 (0%) | 0 | 0/10 |
| **Phase 3 (Feedback Components)** | ⏳ Не начат | 0/4 (0%) | 0 | 0/8 |
| **ИТОГО** | 🔄 В процессе | **9/18 задач (50%)** | **6/15 helpers** | **14/30 дней** |

### Выполненные задачи Phase 0 (Infrastructure):
- ✅ **mui-helpers.types.ts** - 18 TypeScript типов для всех компонентов
- ✅ **index.ts** - централизованный экспорт с JSDoc документацией
- ✅ **README.md** - полная документация (457 строк) с примерами

### Выполненные задачи Phase 1 (Input Components):
- ✅ **mui-textfield.helper.ts** - TextField helper (29 методов, 464 строки)
- ✅ **mui-checkbox.helper.ts** - Checkbox helper (24 метода, 404 строки)
- ✅ **mui-radio.helper.ts** - Radio helper (19 методов, 353 строки)
- ✅ **mui-switch.helper.ts** - Switch helper (18 методов, 329 строк)
- ✅ **mui-slider.helper.ts** - Slider helper (22 метода, 384 строки)
- ✅ **mui-datepicker.helper.ts** - DatePicker helper (22 метода, 370 строк)

### Следующие задачи (Phase 2):
- 🎯 **Button Helper** - HIGH priority (65+ использований)
- 🎯 **Tabs Helper** - MEDIUM priority (навигация)
- 🎯 **Menu Helper** - MEDIUM priority (dropdown actions)

---

## 📋 Общая информация

**Цель:** Создать полнофункциональный набор Cypress-хелперов для тестирования базовых компонентов Material-UI (MUI), расширив существующую архитектуру в `cypress/support/helpers`.

**Scope:** 15 базовых MUI компонентов (без кастомных wrapper компонентов проекта)

**Timeline:** 30 дней (3 спринта по 10 дней)

**Технологии:**
- Cypress 15.7.0
- TypeScript (strict mode)
- @testing-library/cypress
- MUI v5.15.14

---

## 🎯 Архитектурные принципы

### Обязательные паттерны (из существующих helpers):

1. **Класс-based подход** с приватным методом `getSelector(selector: string)`
2. **Поддержка индексации**: `data-testid=name:index` (например, `data-testid=field:0`, `data-testid=field:1`)
3. **Frozen singleton экспорт**: `export const muiXxxHelper = Object.freeze(new MuiXxxHelper());`
4. **ScrollIntoView с опциями**:
   ```typescript
   type ScrollIntoViewOptions = {
     timeout?: number;
     offset?: { top: number; left: number };
     easing?: 'linear' | 'swing';
     duration?: number;
   };
   ```
5. **Timeout параметры**: Default 10000ms, всегда опциональные
6. **JSDoc комментарии** для каждого публичного метода
7. **Chainable API**: Методы возвращают `Cypress.Chainable<T>`

### Обязательные методы для каждого helper:

- `getSelector(selector: string)` - **приватный** метод парсинга селектора
- `get{Component}Root(selector, timeout, scrollOptions)` - получение корневого элемента
- `getByTestId(testId, timeout)` - алиас для data-testid с поддержкой индексов
- `getByTestIdWithIndex(testId, index, timeout)` - явное указание индекса
- Специфичные методы компонента (click, type, select и т.д.)
- `should*()` методы для проверок (shouldBeVisible, shouldBeDisabled и т.д.)

---

## 📁 Структура файлов

### Новые файлы (будут созданы):

```
cypress/support/helpers/
├── index.ts                          # Централизованный экспорт всех helpers
├── mui-helpers.types.ts              # Общие типы (расширение types.ts)
├── README.md                         # Документация с примерами
│
├── mui-textfield.helper.ts           # Phase 1
├── mui-checkbox.helper.ts            # Phase 1
├── mui-radio.helper.ts               # Phase 1
├── mui-switch.helper.ts              # Phase 1
├── mui-slider.helper.ts              # Phase 1
├── mui-datepicker.helper.ts          # Phase 1
│
├── mui-button.helper.ts              # Phase 2
├── mui-tabs.helper.ts                # Phase 2
├── mui-menu.helper.ts                # Phase 2
├── mui-chip.helper.ts                # Phase 2
├── mui-badge.helper.ts               # Phase 2
│
├── mui-dialog.helper.ts              # Phase 3
├── mui-snackbar.helper.ts            # Phase 3
├── mui-tooltip.helper.ts             # Phase 3
└── mui-progress.helper.ts            # Phase 3
```

### Существующие файлы (reference):
- `mui-select.helper.ts` (26 методов) - reference implementation
- `mui-autocomplete.helper.ts` (31 метод) - reference implementation
- `types.ts` - ViewportsNames, ViewportsValues

---

## 🗂️ Древовидная структура задач

### ⚙️ ПОДГОТОВИТЕЛЬНЫЙ ЭТАП (День 1-2)

- [x] **0. Инфраструктура и общие компоненты**
  - [x] 0.1. Создать `cypress/support/helpers/mui-helpers.types.ts`
    - [x] Экспортировать `ScrollIntoViewOptions` из существующих helpers
    - [x] Добавить типы для validation errors: `ValidationState`, `HelperTextState`
    - [x] Добавить utility типы: `MuiSize = 'small' | 'medium' | 'large'`
    - [x] Добавить типы для color: `MuiColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'`
  - [x] 0.2. Создать `cypress/support/helpers/index.ts`
    - [x] Экспортировать существующие helpers (muiSelectHelper, muiAutocompleteHelper)
    - [x] Подготовить структуру для новых helpers (будет обновляться)
    - [x] Добавить JSDoc комментарий с описанием модуля
  - [x] 0.3. Создать базовую структуру `cypress/support/helpers/README.md`
    - [x] Секция "Overview" с описанием назначения helpers
    - [x] Секция "Installation" с примером импорта
    - [x] Секция "Available Helpers" (таблица, будет заполняться)
    - [x] Секция "Common Patterns" с объяснением data-testid:index
    - [x] Секция "API Reference" (заглушка)

---

### 📦 PHASE 1: INPUT КОМПОНЕНТЫ (День 3-12)

#### ✅ 1. TextField Helper (День 3-4) - ВЫСОКИЙ ПРИОРИТЕТ

**Обоснование:** 184 использования в проекте, критически важен для form тестирования

- [x] **1.1. Реализация класса `MuiTextFieldHelper`** (cypress/support/helpers/mui-textfield.helper.ts)
  - [x] 1.1.1. Создать класс с приватным методом `getSelector(selector: string)`
    - [x] Поддержка `data-testid=name:index` формата
    - [x] Парсинг индекса и выбор элемента через `.eq(index)` или `.first()`
  - [x] 1.1.2. Core методы получения элементов:
    - [x] `getTextFieldRoot(selector, timeout, scrollIntoView)` - корневой элемент TextField
    - [x] `getInput(selector, timeout)` - получение `<input>` элемента
    - [x] `getByTestId(testId, timeout)` - алиас с поддержкой индексов
    - [x] `getByTestIdWithIndex(testId, index, timeout)` - явный индекс
    - [x] `getLabel(selector, timeout)` - получение label элемента
    - [x] `getHelperText(selector, timeout)` - получение helper text
  - [x] 1.1.3. Interaction методы:
    - [x] `typeValue(selector, text, timeout)` - ввод текста
    - [x] `clearValue(selector, timeout)` - очистка поля
    - [x] `setValue(selector, value, timeout)` - установка значения через .invoke('val')
    - [x] `focusField(selector, timeout)` - фокус на поле
    - [x] `blurField(selector, timeout)` - снятие фокуса
  - [x] 1.1.4. Getter методы:
    - [x] `getValue(selector, timeout)` - получение текущего значения
    - [x] `getPlaceholder(selector, timeout)` - получение placeholder
    - [x] `getLabelText(selector, timeout)` - получение текста label
  - [x] 1.1.5. Verification методы:
    - [x] `shouldHaveValue(selector, expectedValue, timeout)` - проверка значения
    - [x] `shouldBeEmpty(selector, timeout)` - проверка пустоты
    - [x] `shouldHaveError(selector, timeout)` - проверка наличия ошибки
    - [x] `shouldHaveHelperText(selector, expectedText, timeout)` - проверка helper text
    - [x] `shouldBeDisabled(selector, timeout)` - проверка disabled
    - [x] `shouldBeEnabled(selector, timeout)` - проверка enabled
    - [x] `shouldBeRequired(selector, timeout)` - проверка required
    - [x] `shouldBeVisible(selector, timeout)` - проверка видимости
  - [x] 1.1.6. Variants support:
    - [x] `shouldHaveVariant(selector, variant, timeout)` - outlined/filled/standard
    - [x] `shouldHaveSize(selector, size, timeout)` - small/medium
  - [x] 1.1.7. Multiline support:
    - [x] `shouldBeMultiline(selector, timeout)` - проверка textarea
    - [x] `getRowsCount(selector, timeout)` - количество строк
  - [x] 1.1.8. Экспорт singleton:
    - [x] `export const muiTextFieldHelper = Object.freeze(new MuiTextFieldHelper());`

- [x] **1.2. Документация и типизация**
  - [x] 1.2.1. JSDoc комментарии для всех публичных методов
    - [x] Описание параметров с примерами
    - [x] Примеры использования в комментариях
  - [x] 1.2.2. Обновить `index.ts`
    - [x] Добавить экспорт `muiTextFieldHelper`
    - [x] Добавить в JSDoc список доступных helpers
  - [x] 1.2.3. Обновить `README.md`
    - [x] Добавить TextField в таблицу "Available Helpers"
    - [x] Добавить секцию "TextField Helper" с примерами:
      - [x] Базовый пример ввода текста
      - [x] Пример с индексацией (data-testid=field:0)
      - [x] Пример проверки validation
      - [x] Пример multiline TextField

- [ ] **1.3. Тестирование (опционально)**
  - [ ] 1.3.1. Создать example test: `cypress/e2e/examples/mui-textfield-helper.cy.ts`
    - [ ] Тест базового ввода текста
    - [ ] Тест с индексацией
    - [ ] Тест validation errors
    - [ ] Тест multiline

---

#### ☑️ 2. Checkbox Helper (День 5-6)

**Обоснование:** Используется в таблицах и формах выбора

- [ ] **2.1. Реализация класса `MuiCheckboxHelper`** (cypress/support/helpers/mui-checkbox.helper.ts)
  - [ ] 2.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 2.1.2. Core методы:
    - [ ] `getCheckboxRoot(selector, timeout, scrollIntoView)` - корневой элемент
    - [ ] `getCheckboxInput(selector, timeout)` - получение input[type="checkbox"]
    - [ ] `getByTestId(testId, timeout)` - с индексацией
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
    - [ ] `getLabel(selector, timeout)` - FormControlLabel text
  - [ ] 2.1.3. Interaction методы:
    - [ ] `check(selector, timeout)` - установить checked
    - [ ] `uncheck(selector, timeout)` - снять checked
    - [ ] `toggle(selector, timeout)` - переключить состояние
    - [ ] `clickCheckbox(selector, timeout)` - клик по checkbox
  - [ ] 2.1.4. Verification методы:
    - [ ] `shouldBeChecked(selector, timeout)` - проверка checked
    - [ ] `shouldBeUnchecked(selector, timeout)` - проверка unchecked
    - [ ] `shouldBeDisabled(selector, timeout)`
    - [ ] `shouldBeEnabled(selector, timeout)`
    - [ ] `shouldBeVisible(selector, timeout)`
    - [ ] `shouldBeIndeterminate(selector, timeout)` - indeterminate состояние
  - [ ] 2.1.5. Group operations (для CheckboxGroup):
    - [ ] `checkMultiple(selectors: string[], timeout)` - выбрать несколько
    - [ ] `uncheckAll(parentSelector, timeout)` - снять все в группе
    - [ ] `getCheckedCount(parentSelector, timeout)` - количество выбранных
  - [ ] 2.1.6. Экспорт singleton

- [ ] **2.2. Документация**
  - [ ] 2.2.1. JSDoc для всех методов
  - [ ] 2.2.2. Обновить `index.ts` и `README.md`
  - [ ] 2.2.3. Примеры: single checkbox, group, indeterminate

---

#### 🔘 3. Radio Helper (День 6-7)

**Обоснование:** RadioGroup используется для exclusive choices

- [ ] **3.1. Реализация класса `MuiRadioHelper`** (cypress/support/helpers/mui-radio.helper.ts)
  - [ ] 3.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 3.1.2. Core методы:
    - [ ] `getRadioGroupRoot(selector, timeout, scrollIntoView)` - RadioGroup element
    - [ ] `getRadioInput(selector, timeout)` - input[type="radio"]
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 3.1.3. Interaction методы:
    - [ ] `selectByValue(selector, value, timeout)` - выбор по value
    - [ ] `selectByLabel(selector, labelText, timeout)` - выбор по тексту label
    - [ ] `selectByIndex(groupSelector, index, timeout)` - выбор по индексу в группе
  - [ ] 3.1.4. Getter методы:
    - [ ] `getSelectedValue(groupSelector, timeout)` - получение выбранного value
    - [ ] `getSelectedLabel(groupSelector, timeout)` - текст выбранной опции
    - [ ] `getAllOptions(groupSelector, timeout)` - все радио в группе
  - [ ] 3.1.5. Verification методы:
    - [ ] `shouldHaveValue(groupSelector, expectedValue, timeout)`
    - [ ] `shouldBeSelected(selector, timeout)` - конкретная radio selected
    - [ ] `shouldBeDisabled(selector, timeout)`
    - [ ] `shouldBeEnabled(selector, timeout)`
    - [ ] `shouldHaveOptionsCount(groupSelector, count, timeout)`
  - [ ] 3.1.6. Экспорт singleton

- [ ] **3.2. Документация**
  - [ ] 3.2.1. JSDoc для всех методов
  - [ ] 3.2.2. Обновить `index.ts` и `README.md`
  - [ ] 3.2.3. Примеры: RadioGroup selection, disabled options

---

#### 🔀 4. Switch Helper (День 7-8)

**Обоснование:** Используется для toggle состояний (on/off)

- [ ] **4.1. Реализация класса `MuiSwitchHelper`** (cypress/support/helpers/mui-switch.helper.ts)
  - [ ] 4.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 4.1.2. Core методы:
    - [ ] `getSwitchRoot(selector, timeout, scrollIntoView)`
    - [ ] `getSwitchInput(selector, timeout)` - input[type="checkbox"] для Switch
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
    - [ ] `getLabel(selector, timeout)`
  - [ ] 4.1.3. Interaction методы:
    - [ ] `turnOn(selector, timeout)` - включить
    - [ ] `turnOff(selector, timeout)` - выключить
    - [ ] `toggle(selector, timeout)` - переключить
    - [ ] `clickSwitch(selector, timeout)` - клик
  - [ ] 4.1.4. Verification методы:
    - [ ] `shouldBeOn(selector, timeout)` - проверка checked
    - [ ] `shouldBeOff(selector, timeout)` - проверка unchecked
    - [ ] `shouldBeDisabled(selector, timeout)`
    - [ ] `shouldBeEnabled(selector, timeout)`
    - [ ] `shouldBeVisible(selector, timeout)`
  - [ ] 4.1.5. Color/Size support:
    - [ ] `shouldHaveColor(selector, color, timeout)` - primary/secondary
  - [ ] 4.1.6. Экспорт singleton

- [ ] **4.2. Документация**
  - [ ] 4.2.1. JSDoc для всех методов
  - [ ] 4.2.2. Обновить `index.ts` и `README.md`
  - [ ] 4.2.3. Примеры: toggle, disabled state

---

#### 🎚️ 5. Slider Helper (День 8-9)

**Обоснование:** Используется для range inputs

- [ ] **5.1. Реализация класса `MuiSliderHelper`** (cypress/support/helpers/mui-slider.helper.ts)
  - [ ] 5.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 5.1.2. Core методы:
    - [ ] `getSliderRoot(selector, timeout, scrollIntoView)`
    - [ ] `getSliderInput(selector, timeout)` - input[type="range"]
    - [ ] `getSliderThumb(selector, timeout)` - thumb element
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 5.1.3. Interaction методы:
    - [ ] `setValue(selector, value, timeout)` - установка значения
    - [ ] `setValueByDrag(selector, value, timeout)` - drag thumb
    - [ ] `setRangeValues(selector, minValue, maxValue, timeout)` - для range slider
  - [ ] 5.1.4. Getter методы:
    - [ ] `getValue(selector, timeout)` - текущее значение
    - [ ] `getRangeValues(selector, timeout)` - [min, max] для range
    - [ ] `getMin(selector, timeout)` - минимум
    - [ ] `getMax(selector, timeout)` - максимум
    - [ ] `getStep(selector, timeout)` - шаг
  - [ ] 5.1.5. Verification методы:
    - [ ] `shouldHaveValue(selector, expectedValue, timeout)`
    - [ ] `shouldBeInRange(selector, min, max, timeout)`
    - [ ] `shouldBeDisabled(selector, timeout)`
    - [ ] `shouldBeEnabled(selector, timeout)`
  - [ ] 5.1.6. Экспорт singleton

- [ ] **5.2. Документация**
  - [ ] 5.2.1. JSDoc для всех методов
  - [ ] 5.2.2. Обновить `index.ts` и `README.md`
  - [ ] 5.2.3. Примеры: single slider, range slider, step

---

#### 📅 6. DatePicker Helper (День 10-12)

**Обоснование:** Из @mui/x-date-pickers, сложный компонент с календарем

- [ ] **6.1. Реализация класса `MuiDatePickerHelper`** (cypress/support/helpers/mui-datepicker.helper.ts)
  - [ ] 6.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 6.1.2. Core методы:
    - [ ] `getDatePickerRoot(selector, timeout, scrollIntoView)`
    - [ ] `getInput(selector, timeout)` - текстовое поле ввода
    - [ ] `getCalendarButton(selector, timeout)` - кнопка открытия календаря
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 6.1.3. Calendar interaction:
    - [ ] `openCalendar(selector, timeout)` - открыть календарь
    - [ ] `closeCalendar()` - закрыть календарь
    - [ ] `selectDate(selector, date: string | Date, timeout)` - выбор даты
    - [ ] `selectToday(selector, timeout)` - выбор сегодня
    - [ ] `selectDateByClick(selector, day, month, year, timeout)` - клик по дню
  - [ ] 6.1.4. Input interaction:
    - [ ] `typeDate(selector, dateString, timeout)` - ввод текстом
    - [ ] `clearDate(selector, timeout)` - очистка
  - [ ] 6.1.5. Getter методы:
    - [ ] `getSelectedDate(selector, timeout)` - получение значения
    - [ ] `getFormattedDate(selector, timeout)` - форматированная дата
  - [ ] 6.1.6. Verification методы:
    - [ ] `shouldHaveDate(selector, expectedDate, timeout)`
    - [ ] `shouldBeEmpty(selector, timeout)`
    - [ ] `shouldHaveError(selector, timeout)` - validation error
    - [ ] `shouldBeDisabled(selector, timeout)`
    - [ ] `shouldBeEnabled(selector, timeout)`
  - [ ] 6.1.7. Экспорт singleton

- [ ] **6.2. Документация**
  - [ ] 6.2.1. JSDoc для всех методов
  - [ ] 6.2.2. Обновить `index.ts` и `README.md`
  - [ ] 6.2.3. Примеры: select date, type date, validation

---

#### 📝 Phase 1 Completion Tasks (День 12)

- [ ] **7. Phase 1 Review & Documentation**
  - [ ] 7.1. Code Review
    - [ ] Проверить консистентность API между всеми Input helpers
    - [ ] Проверить TypeScript типизацию (no any, strict mode)
    - [ ] Проверить JSDoc покрытие всех публичных методов
    - [ ] Убедиться что все helpers экспортируются через `index.ts`
  - [ ] 7.2. Обновить README.md
    - [ ] Заполнить таблицу "Available Helpers" для Phase 1
    - [ ] Добавить раздел "Quick Start" с примерами всех Input компонентов
    - [ ] Добавить раздел "Common Patterns" для Input helpers
  - [ ] 7.3. Integration Testing (опционально)
    - [ ] Создать `cypress/e2e/examples/mui-input-helpers.cy.ts`
    - [ ] Тесты для всех 6 Input helpers в одном файле
    - [ ] Демонстрация совместного использования helpers

---

### 🎛️ PHASE 2: INTERACTION КОМПОНЕНТЫ (День 13-22)

#### 🔘 8. Button Helper (День 13-14) - ВЫСОКИЙ ПРИОРИТЕТ

**Обоснование:** 65+ использований, критичен для action тестирования

- [ ] **8.1. Реализация класса `MuiButtonHelper`** (cypress/support/helpers/mui-button.helper.ts)
  - [ ] 8.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 8.1.2. Core методы:
    - [ ] `getButtonRoot(selector, timeout, scrollIntoView)`
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
    - [ ] `getButtonText(selector, timeout)` - текст кнопки
    - [ ] `getIcon(selector, timeout)` - иконка внутри кнопки
  - [ ] 8.1.3. Interaction методы:
    - [ ] `click(selector, timeout)` - клик по кнопке
    - [ ] `clickByText(text, timeout)` - клик по тексту
    - [ ] `doubleClick(selector, timeout)`
    - [ ] `rightClick(selector, timeout)`
  - [ ] 8.1.4. Verification методы:
    - [ ] `shouldBeVisible(selector, timeout)`
    - [ ] `shouldBeDisabled(selector, timeout)`
    - [ ] `shouldBeEnabled(selector, timeout)`
    - [ ] `shouldHaveText(selector, expectedText, timeout)`
    - [ ] `shouldContainText(selector, text, timeout)`
  - [ ] 8.1.5. Variants/Color support:
    - [ ] `shouldHaveVariant(selector, variant, timeout)` - contained/outlined/text
    - [ ] `shouldHaveColor(selector, color, timeout)` - primary/secondary/error
    - [ ] `shouldHaveSize(selector, size, timeout)` - small/medium/large
  - [ ] 8.1.6. Loading state:
    - [ ] `shouldBeLoading(selector, timeout)` - проверка loading spinner
    - [ ] `waitForNotLoading(selector, timeout)` - ожидание завершения loading
  - [ ] 8.1.7. IconButton support:
    - [ ] `clickIconButton(selector, timeout)` - клик по IconButton
    - [ ] `getIconButtonAriaLabel(selector, timeout)` - aria-label
  - [ ] 8.1.8. ButtonGroup support:
    - [ ] `clickInGroup(groupSelector, buttonIndex, timeout)` - клик в группе
    - [ ] `getButtonsCount(groupSelector, timeout)` - количество кнопок в группе
  - [ ] 8.1.9. Экспорт singleton

- [ ] **8.2. Документация**
  - [ ] 8.2.1. JSDoc для всех методов
  - [ ] 8.2.2. Обновить `index.ts` и `README.md`
  - [ ] 8.2.3. Примеры: button click, loading state, IconButton, ButtonGroup

---

#### 📑 9. Tabs Helper (День 15-16)

**Обоснование:** Используется для навигации и организации контента

- [ ] **9.1. Реализация класса `MuiTabsHelper`** (cypress/support/helpers/mui-tabs.helper.ts)
  - [ ] 9.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 9.1.2. Core методы:
    - [ ] `getTabsRoot(selector, timeout, scrollIntoView)` - Tabs container
    - [ ] `getTab(selector, timeout)` - одиночный Tab
    - [ ] `getAllTabs(tabsSelector, timeout)` - все табы
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 9.1.3. Interaction методы:
    - [ ] `selectTab(tabsSelector, index, timeout)` - выбор по индексу
    - [ ] `selectTabByLabel(tabsSelector, label, timeout)` - выбор по тексту
    - [ ] `selectTabByValue(tabsSelector, value, timeout)` - выбор по value
  - [ ] 9.1.4. Getter методы:
    - [ ] `getSelectedTab(tabsSelector, timeout)` - получение активного tab
    - [ ] `getSelectedTabIndex(tabsSelector, timeout)` - индекс активного
    - [ ] `getTabsCount(tabsSelector, timeout)` - количество табов
    - [ ] `getTabLabel(tabSelector, timeout)` - текст таба
  - [ ] 9.1.5. Verification методы:
    - [ ] `shouldHaveActiveTab(tabsSelector, index, timeout)`
    - [ ] `shouldHaveTabWithLabel(tabsSelector, label, timeout)`
    - [ ] `shouldHaveTabsCount(tabsSelector, count, timeout)`
    - [ ] `shouldTabBeDisabled(tabSelector, timeout)`
  - [ ] 9.1.6. TabPanel support:
    - [ ] `getTabPanel(tabsSelector, index, timeout)` - панель контента
    - [ ] `shouldShowPanel(tabsSelector, index, timeout)` - видимость панели
  - [ ] 9.1.7. Экспорт singleton

- [ ] **9.2. Документация**
  - [ ] 9.2.1. JSDoc для всех методов
  - [ ] 9.2.2. Обновить `index.ts` и `README.md`
  - [ ] 9.2.3. Примеры: tab selection, TabPanel, disabled tabs

---

#### 📋 10. Menu Helper (День 17-18)

**Обоснование:** Menu + MenuItem используется для dropdown actions

- [ ] **10.1. Реализация класса `MuiMenuHelper`** (cypress/support/helpers/mui-menu.helper.ts)
  - [ ] 10.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 10.1.2. Core методы:
    - [ ] `getMenuRoot(selector, timeout, scrollIntoView)` - Menu container
    - [ ] `getMenuTrigger(selector, timeout)` - кнопка открытия меню
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 10.1.3. Menu interaction:
    - [ ] `openMenu(triggerSelector, timeout)` - открыть меню
    - [ ] `closeMenu()` - закрыть меню (ESC или клик вне)
    - [ ] `isMenuOpen(timeout)` - проверка открыто ли
  - [ ] 10.1.4. MenuItem interaction:
    - [ ] `clickMenuItem(menuSelector, itemIndex, timeout)` - клик по индексу
    - [ ] `clickMenuItemByText(menuSelector, text, timeout)` - клик по тексту
    - [ ] `clickMenuItemByValue(menuSelector, value, timeout)` - клик по value
  - [ ] 10.1.5. Getter методы:
    - [ ] `getMenuItems(menuSelector, timeout)` - все MenuItem
    - [ ] `getMenuItemsCount(menuSelector, timeout)` - количество
    - [ ] `getMenuItemText(itemSelector, timeout)` - текст элемента
  - [ ] 10.1.6. Verification методы:
    - [ ] `shouldBeOpen(timeout)` - меню открыто
    - [ ] `shouldBeClosed(timeout)` - меню закрыто
    - [ ] `shouldHaveItemsCount(menuSelector, count, timeout)`
    - [ ] `shouldHaveItemWithText(menuSelector, text, timeout)`
    - [ ] `shouldMenuItemBeDisabled(itemSelector, timeout)`
  - [ ] 10.1.7. Nested menu support:
    - [ ] `hoverMenuItem(itemSelector, timeout)` - hover для submenu
    - [ ] `openSubmenu(itemSelector, timeout)` - открыть вложенное меню
  - [ ] 10.1.8. Экспорт singleton

- [ ] **10.2. Документация**
  - [ ] 10.2.1. JSDoc для всех методов
  - [ ] 10.2.2. Обновить `index.ts` и `README.md`
  - [ ] 10.2.3. Примеры: open menu, select item, nested menu

---

#### 🏷️ 11. Chip Helper (День 19-20)

**Обоснование:** Используется для tags, filters

- [ ] **11.1. Реализация класса `MuiChipHelper`** (cypress/support/helpers/mui-chip.helper.ts)
  - [ ] 11.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 11.1.2. Core методы:
    - [ ] `getChipRoot(selector, timeout, scrollIntoView)`
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
    - [ ] `getChipLabel(selector, timeout)` - текст chip
    - [ ] `getDeleteIcon(selector, timeout)` - иконка удаления
  - [ ] 11.1.3. Interaction методы:
    - [ ] `click(selector, timeout)` - клик по chip (clickable)
    - [ ] `clickDelete(selector, timeout)` - клик по delete icon
    - [ ] `clickChipByLabel(label, timeout)` - клик по тексту
  - [ ] 11.1.4. Verification методы:
    - [ ] `shouldBeVisible(selector, timeout)`
    - [ ] `shouldHaveLabel(selector, expectedLabel, timeout)`
    - [ ] `shouldBeClickable(selector, timeout)`
    - [ ] `shouldBeDeletable(selector, timeout)` - есть delete icon
    - [ ] `shouldBeDisabled(selector, timeout)`
  - [ ] 11.1.5. Color/Variant support:
    - [ ] `shouldHaveColor(selector, color, timeout)` - primary/secondary
    - [ ] `shouldHaveVariant(selector, variant, timeout)` - filled/outlined
  - [ ] 11.1.6. Array operations (для Chip arrays):
    - [ ] `getChipsCount(containerSelector, timeout)` - количество chips
    - [ ] `deleteAllChips(containerSelector, timeout)` - удалить все
    - [ ] `getChipLabels(containerSelector, timeout)` - массив всех текстов
  - [ ] 11.1.7. Экспорт singleton

- [ ] **11.2. Документация**
  - [ ] 11.2.1. JSDoc для всех методов
  - [ ] 11.2.2. Обновить `index.ts` и `README.md`
  - [ ] 11.2.3. Примеры: click chip, delete chip, chip array

---

#### 🔔 12. Badge Helper (День 20-21)

**Обоснование:** Используется для notifications, counters

- [ ] **12.1. Реализация класса `MuiBadgeHelper`** (cypress/support/helpers/mui-badge.helper.ts)
  - [ ] 12.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 12.1.2. Core методы:
    - [ ] `getBadgeRoot(selector, timeout, scrollIntoView)`
    - [ ] `getBadgeContent(selector, timeout)` - .MuiBadge-badge элемент
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 12.1.3. Getter методы:
    - [ ] `getBadgeValue(selector, timeout)` - текст/число в badge
    - [ ] `getBadgeNumber(selector, timeout)` - парсинг числа
  - [ ] 12.1.4. Verification методы:
    - [ ] `shouldBeVisible(selector, timeout)`
    - [ ] `shouldHaveValue(selector, expectedValue, timeout)`
    - [ ] `shouldHaveNumber(selector, expectedNumber, timeout)`
    - [ ] `shouldBeHidden(selector, timeout)` - invisible badge
  - [ ] 12.1.5. Color/Variant support:
    - [ ] `shouldHaveColor(selector, color, timeout)` - primary/secondary/error
    - [ ] `shouldHaveVariant(selector, variant, timeout)` - standard/dot
  - [ ] 12.1.6. Position support:
    - [ ] `shouldHavePosition(selector, position, timeout)` - top-right/bottom-left etc
  - [ ] 12.1.7. Экспорт singleton

- [ ] **12.2. Документация**
  - [ ] 12.2.1. JSDoc для всех методов
  - [ ] 12.2.2. Обновить `index.ts` и `README.md`
  - [ ] 12.2.3. Примеры: badge value, dot variant, color

---

#### 📝 Phase 2 Completion Tasks (День 22)

- [ ] **13. Phase 2 Review & Documentation**
  - [ ] 13.1. Code Review
    - [ ] Консистентность API между Interaction helpers
    - [ ] TypeScript типизация
    - [ ] JSDoc покрытие
    - [ ] Экспорт через `index.ts`
  - [ ] 13.2. Обновить README.md
    - [ ] Таблица "Available Helpers" для Phase 2
    - [ ] Раздел "Common Patterns" для Interaction helpers
  - [ ] 13.3. Integration Testing (опционально)
    - [ ] `cypress/e2e/examples/mui-interaction-helpers.cy.ts`

---

### 💬 PHASE 3: FEEDBACK КОМПОНЕНТЫ (День 23-30)

#### 🪟 14. Dialog Helper (День 23-24)

**Обоснование:** Dialog используется часто для модальных окон

- [ ] **14.1. Реализация класса `MuiDialogHelper`** (cypress/support/helpers/mui-dialog.helper.ts)
  - [ ] 14.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 14.1.2. Core методы:
    - [ ] `getDialog(selector, timeout)` - Dialog container
    - [ ] `getDialogTitle(selector, timeout)` - DialogTitle
    - [ ] `getDialogContent(selector, timeout)` - DialogContent
    - [ ] `getDialogActions(selector, timeout)` - DialogActions
    - [ ] `getByTestId(testId, timeout)`
  - [ ] 14.1.3. Interaction методы:
    - [ ] `waitForDialogOpen(selector, timeout)` - ожидание открытия
    - [ ] `closeDialog(selector, timeout)` - закрыть (ESC или backdrop)
    - [ ] `clickDialogButton(selector, buttonText, timeout)` - клик кнопки в Actions
    - [ ] `clickBackdrop(timeout)` - клик вне диалога
  - [ ] 14.1.4. Getter методы:
    - [ ] `getDialogTitleText(selector, timeout)` - текст заголовка
    - [ ] `getDialogContentText(selector, timeout)` - текст контента
    - [ ] `getDialogButtons(selector, timeout)` - все кнопки в Actions
  - [ ] 14.1.5. Verification методы:
    - [ ] `shouldBeOpen(selector, timeout)` - диалог открыт
    - [ ] `shouldBeClosed(selector, timeout)` - диалог закрыт
    - [ ] `shouldHaveTitle(selector, expectedTitle, timeout)`
    - [ ] `shouldContainText(selector, text, timeout)`
    - [ ] `shouldHaveButton(selector, buttonText, timeout)`
  - [ ] 14.1.6. Modal variant support:
    - [ ] `shouldBeModal(selector, timeout)` - не закрывается по backdrop
    - [ ] `shouldHaveBackdrop(selector, timeout)` - есть backdrop
  - [ ] 14.1.7. Экспорт singleton

- [ ] **14.2. Документация**
  - [ ] 14.2.1. JSDoc для всех методов
  - [ ] 14.2.2. Обновить `index.ts` и `README.md`
  - [ ] 14.2.3. Примеры: open dialog, click button, close

---

#### 📢 15. Snackbar Helper (День 25-26)

**Обоснование:** Snackbar/Alert для notifications

- [ ] **15.1. Реализация класса `MuiSnackbarHelper`** (cypress/support/helpers/mui-snackbar.helper.ts)
  - [ ] 15.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 15.1.2. Core методы:
    - [ ] `getSnackbar(selector, timeout)` - Snackbar container
    - [ ] `getAlert(selector, timeout)` - Alert внутри Snackbar
    - [ ] `getCloseButton(selector, timeout)` - кнопка закрытия
    - [ ] `getByTestId(testId, timeout)`
  - [ ] 15.1.3. Interaction методы:
    - [ ] `waitForSnackbar(selector, timeout)` - ожидание появления
    - [ ] `closeSnackbar(selector, timeout)` - закрыть
    - [ ] `clickAction(selector, actionText, timeout)` - клик по action кнопке
  - [ ] 15.1.4. Getter методы:
    - [ ] `getSnackbarMessage(selector, timeout)` - текст сообщения
    - [ ] `getAlertSeverity(selector, timeout)` - severity (success/error/warning/info)
  - [ ] 15.1.5. Verification методы:
    - [ ] `shouldBeVisible(selector, timeout)`
    - [ ] `shouldHaveMessage(selector, expectedMessage, timeout)`
    - [ ] `shouldHaveSeverity(selector, severity, timeout)` - success/error/warning/info
    - [ ] `shouldAutoClose(selector, timeout)` - автозакрытие через время
  - [ ] 15.1.6. Position support:
    - [ ] `shouldHavePosition(selector, position, timeout)` - top-right/bottom-left etc
  - [ ] 15.1.7. Экспорт singleton

- [ ] **15.2. Документация**
  - [ ] 15.2.1. JSDoc для всех методов
  - [ ] 15.2.2. Обновить `index.ts` и `README.md`
  - [ ] 15.2.3. Примеры: wait for snackbar, check message, severity

---

#### 💡 16. Tooltip Helper (День 26-27)

**Обоснование:** Tooltip для подсказок

- [ ] **16.1. Реализация класса `MuiTooltipHelper`** (cypress/support/helpers/mui-tooltip.helper.ts)
  - [ ] 16.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 16.1.2. Core методы:
    - [ ] `getTriggerElement(selector, timeout)` - элемент с tooltip
    - [ ] `getTooltip(timeout)` - сам tooltip (глобально в body)
    - [ ] `getByTestId(testId, timeout)`
  - [ ] 16.1.3. Interaction методы:
    - [ ] `hoverToShow(selector, timeout)` - hover для показа tooltip
    - [ ] `clickToShow(selector, timeout)` - клик для показа (если trigger=click)
    - [ ] `moveAwayToHide(timeout)` - убрать мышь для скрытия
  - [ ] 16.1.4. Getter методы:
    - [ ] `getTooltipText(timeout)` - текст tooltip
  - [ ] 16.1.5. Verification методы:
    - [ ] `shouldShowTooltip(selector, timeout)` - tooltip видим после hover
    - [ ] `shouldHaveTooltipText(selector, expectedText, timeout)`
    - [ ] `shouldHideTooltip(timeout)` - tooltip скрыт
  - [ ] 16.1.6. Placement support:
    - [ ] `shouldHavePlacement(selector, placement, timeout)` - top/bottom/left/right
  - [ ] 16.1.7. Экспорт singleton

- [ ] **16.2. Документация**
  - [ ] 16.2.1. JSDoc для всех методов
  - [ ] 16.2.2. Обновить `index.ts` и `README.md`
  - [ ] 16.2.3. Примеры: hover tooltip, click tooltip, placement

---

#### ⏳ 17. Progress Helper (День 27-28)

**Обоснование:** LinearProgress, CircularProgress для loading states

- [ ] **17.1. Реализация класса `MuiProgressHelper`** (cypress/support/helpers/mui-progress.helper.ts)
  - [ ] 17.1.1. Создать класс с приватным `getSelector(selector: string)`
  - [ ] 17.1.2. Core методы:
    - [ ] `getProgressRoot(selector, timeout)` - Linear или Circular
    - [ ] `getByTestId(testId, timeout)`
    - [ ] `getByTestIdWithIndex(testId, index, timeout)`
  - [ ] 17.1.3. Getter методы:
    - [ ] `getProgressValue(selector, timeout)` - значение progress (%)
    - [ ] `getProgressVariant(selector, timeout)` - determinate/indeterminate
  - [ ] 17.1.4. Verification методы:
    - [ ] `shouldBeVisible(selector, timeout)`
    - [ ] `shouldBeHidden(selector, timeout)`
    - [ ] `shouldHaveValue(selector, expectedValue, timeout)` - для determinate
    - [ ] `shouldBeIndeterminate(selector, timeout)`
    - [ ] `shouldBeDeterminate(selector, timeout)`
  - [ ] 17.1.5. Wait methods:
    - [ ] `waitForCompletion(selector, timeout)` - ожидание 100%
    - [ ] `waitForHidden(selector, timeout)` - ожидание скрытия
  - [ ] 17.1.6. Color support:
    - [ ] `shouldHaveColor(selector, color, timeout)` - primary/secondary
  - [ ] 17.1.7. Экспорт singleton

- [ ] **17.2. Документация**
  - [ ] 17.2.1. JSDoc для всех методов
  - [ ] 17.2.2. Обновить `index.ts` и `README.md`
  - [ ] 17.2.3. Примеры: linear progress, circular progress, indeterminate

---

#### 📝 Phase 3 Completion & Final Tasks (День 28-30)

- [ ] **18. Phase 3 Review & Final Documentation**
  - [ ] 18.1. Code Review всех Phase 3 helpers
    - [ ] Консистентность API
    - [ ] TypeScript типизация
    - [ ] JSDoc покрытие
    - [ ] Экспорт через `index.ts`
  - [ ] 18.2. Финальное обновление README.md
    - [ ] Заполнить таблицу всех 15 helpers
    - [ ] Секция "Quick Start" с примерами всех категорий
    - [ ] Секция "Advanced Usage" с комплексными примерами
    - [ ] Секция "Troubleshooting" с решением типичных проблем
    - [ ] Секция "API Reference" - ссылки на каждый helper
  - [ ] 18.3. Финализация `index.ts`
    - [ ] Проверить экспорт всех 15 helpers + 2 существующих (17 total)
    - [ ] Добавить namespace exports если нужно
    - [ ] Финальный JSDoc комментарий модуля
  - [ ] 18.4. Обновление `mui-helpers.types.ts`
    - [ ] Убедиться все общие типы экспортированы
    - [ ] Документация типов
  - [ ] 18.5. Integration Testing (опционально)
    - [ ] `cypress/e2e/examples/mui-all-helpers.cy.ts`
    - [ ] Комплексный тест использующий helpers из всех фаз
    - [ ] Демонстрация best practices

---

## 📊 Детализация методов для каждого helper

### Стандартный набор методов (для всех helpers):

```typescript
class MuiComponentHelper {
  // PRIVATE
  private getSelector(selector: string): Cypress.Chainable<JQuery<HTMLElement>>

  // CORE (обязательные для всех)
  get{Component}Root(selector: string, timeout?: number, scrollIntoView?: boolean | ScrollIntoViewOptions): Cypress.Chainable
  getByTestId(testId: string, timeout?: number): Cypress.Chainable
  getByTestIdWithIndex(testId: string, index: number, timeout?: number): Cypress.Chainable

  // INTERACTIONS (специфичные для компонента)
  // например: click(), type(), select(), toggle() и т.д.

  // GETTERS (получение значений)
  // например: getValue(), getText(), getSelectedValue() и т.д.

  // VERIFICATIONS (проверки)
  shouldBeVisible(selector: string, timeout?: number): void
  shouldBeDisabled(selector: string, timeout?: number): void
  shouldBeEnabled(selector: string, timeout?: number): void
  // + специфичные для компонента

  // EXPORT
  export const mui{Component}Helper = Object.freeze(new Mui{Component}Helper());
}
```

---

## 🔍 Критерии завершения каждой задачи

### Для каждого helper считается выполненным когда:

✅ **Код реализован:**
- [ ] Класс создан с приватным `getSelector()`
- [ ] Все Core методы реализованы (get*Root, getByTestId, getByTestIdWithIndex)
- [ ] Все Interaction методы реализованы
- [ ] Все Getter методы реализованы
- [ ] Все Verification методы реализованы
- [ ] Frozen singleton экспортирован

✅ **Типизация:**
- [ ] TypeScript strict mode, no any
- [ ] Все параметры типизированы
- [ ] Все возвращаемые значения типизированы
- [ ] Используются общие типы из `mui-helpers.types.ts`

✅ **Документация:**
- [ ] JSDoc комментарии для всех публичных методов
- [ ] Описание параметров в JSDoc
- [ ] Примеры использования в JSDoc комментариях
- [ ] Helper добавлен в `index.ts`
- [ ] Helper добавлен в README.md с примерами

✅ **Качество:**
- [ ] Следует паттернам MuiSelectHelper и MuiAutocompleteHelper
- [ ] Консистентное именование методов
- [ ] Поддержка data-testid:index индексации
- [ ] ScrollIntoView с опциями где применимо
- [ ] Timeout параметры с defaults

---

## 📈 Timeline и оценки

| Фаза | Компоненты | Helpers | Дни | Начало | Конец |
|------|-----------|---------|-----|--------|-------|
| **Подготовка** | Infrastructure | 0 | 2 | День 1 | День 2 |
| **Phase 1** | Input компоненты | 6 | 10 | День 3 | День 12 |
| **Phase 2** | Interaction компоненты | 5 | 10 | День 13 | День 22 |
| **Phase 3** | Feedback компоненты | 4 | 8 | День 23 | День 30 |
| **ИТОГО** | - | **15** | **30** | - | - |

### Детализация по дням:

- **День 1-2:** Инфраструктура (types, index, README base)
- **День 3-4:** TextField helper (критично важен)
- **День 5-6:** Checkbox helper
- **День 6-7:** Radio helper
- **День 7-8:** Switch helper
- **День 8-9:** Slider helper
- **День 10-12:** DatePicker helper (сложный) + Phase 1 review
- **День 13-14:** Button helper (критично важен)
- **День 15-16:** Tabs helper
- **День 17-18:** Menu helper
- **День 19-20:** Chip helper
- **День 20-21:** Badge helper
- **День 22:** Phase 2 review
- **День 23-24:** Dialog helper
- **День 25-26:** Snackbar helper
- **День 26-27:** Tooltip helper
- **День 27-28:** Progress helper
- **День 28-30:** Phase 3 review + Final documentation

---

## 🎯 Приоритеты выполнения

### Высокий приоритет (должны быть выполнены в первую очередь):
1. **TextField** (184 использования)
2. **Button** (65+ использований)
3. **Dialog** (модальные окна критичны)

### Средний приоритет:
4. Checkbox/Radio (формы)
5. Tabs (навигация)
6. Menu (действия)
7. Snackbar (feedback)

### Низкий приоритет (но необходимы для полноты):
8. Switch, Slider, DatePicker
9. Chip, Badge
10. Tooltip, Progress

---

## 🚀 Порядок выполнения (рекомендуемый)

1. **Подготовка** → Создать инфраструктуру (types, index, README)
2. **TextField** → Самый используемый, задаст тон для остальных
3. **Button** → Критичен для действий
4. **Checkbox/Radio** → Парные компоненты, похожая логика
5. **Switch/Slider** → Закончить Input категорию
6. **DatePicker** → Самый сложный, в конце Phase 1
7. **Dialog** → Начать Phase 2 с важного
8. **Tabs/Menu** → Навигация и действия
9. **Chip/Badge** → Визуальные элементы
10. **Snackbar/Tooltip/Progress** → Feedback компоненты

---

## 📝 Примечания и best practices

### При реализации helpers:

1. **Всегда проверять accessibility:**
   - Использовать `aria-disabled`, `aria-label`, `role` атрибуты
   - Проверять `be.visible` перед взаимодействием

2. **ScrollIntoView best practices:**
   - Default offset: `{ top: -200, left: 0 }` (как в существующих helpers)
   - Всегда опциональный параметр
   - Можно отключить передав `false`

3. **Timeout стратегия:**
   - Default: 10000ms для большинства операций
   - ScrollIntoView timeout: 3000ms
   - Все timeouts опциональные и переопределяемые

4. **Индексация data-testid:**
   - Поддержка `data-testid=name:0`, `data-testid=name:1`
   - Парсинг через `.split(':')` и `.eq(index)`
   - Default на `.first()` если индекс не указан

5. **Консистентность API:**
   - Методы именуются одинаково между helpers
   - `shouldBe*()` для boolean проверок
   - `shouldHave*()` для проверок значений
   - `get*()` для получения элементов

6. **JSDoc стандарты:**
   - Описание метода на первой строке
   - `@param` для каждого параметра с описанием
   - `@returns` для возвращаемого значения (если не void)
   - Пример использования в комментариях

---

## ✅ Критерии успеха проекта

### Функциональная полнота:
- ✅ 15 helpers реализованы для базовых MUI компонентов
- ✅ Каждый helper содержит 8-12 методов
- ✅ Поддержка индексации для всех helpers
- ✅ Все методы покрыты JSDoc документацией

### Качество кода:
- ✅ TypeScript strict typing без any
- ✅ Консистентная архитектура между helpers
- ✅ Следование паттернам MuiSelectHelper/MuiAutocompleteHelper
- ✅ Frozen singleton экспорт для всех

### Usability:
- ✅ Централизованный `index.ts` для импортов
- ✅ Полный README.md с примерами
- ✅ JSDoc комментарии для IntelliSense
- ✅ Примеры использования для каждого helper

### Testing (опционально):
- ✅ Примеры тестов в `cypress/e2e/examples/`
- ✅ Работа в E2E и component тестах
- ✅ Совместимость с существующей инфраструктурой

---

## 🔗 Ссылки на критические файлы

### Существующие (reference):
- `cypress/support/helpers/mui-select.helper.ts` - Reference implementation (26 методов)
- `cypress/support/helpers/mui-autocomplete.helper.ts` - Reference implementation (31 метод)
- `cypress/support/helpers/types.ts` - ViewportsNames, ViewportsValues

### Будут созданы:
- `cypress/support/helpers/index.ts` - Централизованный экспорт
- `cypress/support/helpers/mui-helpers.types.ts` - Общие типы
- `cypress/support/helpers/README.md` - Документация
- `cypress/support/helpers/mui-textfield.helper.ts` - TextField helper
- `cypress/support/helpers/mui-button.helper.ts` - Button helper
- `cypress/support/helpers/mui-checkbox.helper.ts` - Checkbox helper
- `cypress/support/helpers/mui-radio.helper.ts` - Radio helper
- `cypress/support/helpers/mui-switch.helper.ts` - Switch helper
- `cypress/support/helpers/mui-slider.helper.ts` - Slider helper
- `cypress/support/helpers/mui-datepicker.helper.ts` - DatePicker helper
- `cypress/support/helpers/mui-tabs.helper.ts` - Tabs helper
- `cypress/support/helpers/mui-menu.helper.ts` - Menu helper
- `cypress/support/helpers/mui-chip.helper.ts` - Chip helper
- `cypress/support/helpers/mui-badge.helper.ts` - Badge helper
- `cypress/support/helpers/mui-dialog.helper.ts` - Dialog helper
- `cypress/support/helpers/mui-snackbar.helper.ts` - Snackbar helper
- `cypress/support/helpers/mui-tooltip.helper.ts` - Tooltip helper
- `cypress/support/helpers/mui-progress.helper.ts` - Progress helper

---

## 🎓 Обучающие материалы

### Для лучшего понимания существующей архитектуры изучить:
1. `mui-select.helper.ts` - как реализован getSelector, scrollIntoView, индексация
2. `mui-autocomplete.helper.ts` - методы ввода текста, различные способы селекции
3. `types.ts` - как организованы общие типы

### Документация:
- MUI Component API: https://mui.com/material-ui/all-components/
- Cypress Best Practices: https://docs.cypress.io/guides/references/best-practices
- Testing Library: https://testing-library.com/docs/cypress-testing-library/intro/

---

**Конец плана**
