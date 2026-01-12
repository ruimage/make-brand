# План: Исправление теста warranty-sales-channel-autocomplete.cy.ts

## Контекст и анализ

### Текущее состояние теста
Тест `cypress/e2e/warranty-claim/warranty-sales-channel-autocomplete.cy.ts` проверяет функциональность компонента выбора канала продаж в warranty claims. Тест использует:
- Page Object Model (POM) архитектуру
- Material-UI Autocomplete компонент
- Перехват сетевых запросов для проверки отправки данных

### Проблемы, обнаруженные при анализе:
1. **Тест использует фиксированный warrantyId (95)** - это может быть проблемой, если тестовые данные изменятся
2. **Отсутствует проверка начального состояния** - тест не проверяет, какое значение было изначально
3. **Использование cy.clock() для управления временем** - может быть хрупким подходом (единственный тест в проекте, использующий этот метод)
4. **Нет обработки возможных ошибок** при очистке поля
5. **Тест проверяет только 2 сценария**, но есть дополнительные проверки, которые можно улучшить
6. **Несоответствие паттернам проекта** - другие тесты используют `cy.wait()` для обработки дебаунсинга
7. **Отсутствие тестов для edge cases** - не проверяются несуществующие значения, медленная загрузка и т.д.

### Структура проекта
- **Тест**: `cypress/e2e/warranty-claim/warranty-sales-channel-autocomplete.cy.ts`
- **Page Model**: `cypress/support/page-model/warranty-claims/warranty-claim-page.ts`
- **Action Model**: `cypress/support/page-model/warranty-claims/action-model/sales-channel-autocomplete.ts`
- **Helper**: `cypress/support/helpers/mui-autocomplete.helper.ts`
- **Zod схема**: `src/shared/api/warranty-claims/schemas/sales-channel.ts`

## Детальный план исправлений

### 1. Подготовка контекста для e2e-cypress-test-generator
- Получение документации через Context7 для:
  - Cypress: `/cypress-io/cypress-documentation`
  - Material-UI: `/mui/material-ui`
  - TypeScript: `/microsoft/TypeScript`
  - Zod: `/colinhacks/zod`
- Ключевые темы: `cy.wait()` vs `cy.clock()`, Material-UI Autocomplete тестирование, Page Object Model, `cy.section()`

### 2. Анализ существующей инфраструктуры с учетом новых требований
**Новые требования пользователя**:
1. Использовать `waitForIdle` и `waitintercep` (вероятно `waitForNetworkIdle` и перехват запросов)
2. Не использовать моки - работать с реальными данными с dev backend сервера
3. Проверять стабилизацию компонента после действий

**Задачи для e2e-cypress-test-generator**:
1. Анализ текущего теста и выявление антипаттернов (особенно `cy.clock()`)
2. Изучение использования `waitForNetworkIdle` в других тестах проекта
3. Анализ Zod схемы `sales-channel.ts` для понимания валидации
4. Изучение Page Object Model структуры и методов ожидания
5. Анализ существующих подходов к работе с реальными данными (без моков)

### 3. Использование существующих методов (без добавления новых)
**Существующие методы в `sales-channel-autocomplete.ts`**:
- `waitForSalesChannelNetworkIdle(idleMs = 600, timeoutMs = 20000)` - уже существует!
- `selectChannelAndVerify(channelName: string)` - уже существует
- `clearAndVerify()` - уже существует
- `verifyEmpty()` - уже существует
- `verifySelectedChannel(expectedChannel: string)` - уже существует

**Подход**: Использовать существующий метод `waitForSalesChannelNetworkIdle()` вместо создания новых методов.

**Изменения в тесте**:
- Заменить `cy.clock()` + `cy.tick(500)` на `salesChannel.waitForSalesChannelNetworkIdle()`
- Использовать существующие методы проверки без изменений в POM

### 4. Рефакторинг тестового файла с использованием существующих методов
**Упрощенная структура теста (только warrantyId = 95, без новых методов)**:
```typescript
describe('Компонент выбора канала продаж (WarrantySalesChannelComponent)', () => {
  beforeEach(() => {
    cy.loginToAAD(Cypress.env('AAD_USERNAME'), Cypress.env('AAD_PASSWORD'));
  });

  describe('Сценарий 1: Установка значения из списка, затем очистка', () => {
    it('устанавливает значение из списка, затем очищает и проверяет отправку null на сервер', () => {
      // Используем фиксированный warrantyId = 95 как указано
      const warrantyId = 95;
      page.visitWarrantyClaimPage(warrantyId);
      page.waitForPageLoad();

      // Перехватываем реальные запросы (без мокинга)
      cy.intercept('PUT', `**/warranty/${warrantyId}/implementation`).as('updateImplementationField');

      // 1. Выбираем значение из выпадающего списка Autocomplete
      const selectedChannel = PREDEFINED_SALES_CHANNELS[0];

      cy.section('Выбор канала продаж');
      salesChannel.selectChannelAndVerify(selectedChannel);

      // Используем существующий метод waitForSalesChannelNetworkIdle вместо cy.tick()
      cy.section('Ожидание сетевой активности');
      salesChannel.waitForSalesChannelNetworkIdle();

      // Проверяем реальный запрос на сервер
      cy.section('Проверка реального запроса');
      cy.wait('@updateImplementationField', { timeout: 10000 }).then((interception) => {
        // Проверяем реальные данные запроса
        expect(interception.request.method).to.equal('PUT');
        expect(interception.request.body).to.have.property('salesChannel', selectedChannel);
        expect(interception.request.body).to.have.property('warrantyId', warrantyId);
        // Проверяем реальный статус ответа
        expect(interception.response.statusCode).to.be.oneOf([200, 201, 204]);
      });

      // 2. Затем очищаем значение (устанавливаем пустую строку)
      cy.section('Очистка значения');
      salesChannel.clearAndVerify();

      // Снова используем waitForSalesChannelNetworkIdle
      cy.section('Ожидание сетевой активности после очистки');
      salesChannel.waitForSalesChannelNetworkIdle();

      // Проверяем реальный запрос с null
      cy.section('Проверка запроса с null');
      cy.wait('@updateImplementationField', { timeout: 10000 }).then((interception) => {
        const requestBody = interception.request.body;
        expect(requestBody).to.have.property('salesChannel', null);
        expect(requestBody).to.have.property('warrantyId', warrantyId);
        expect(interception.response.statusCode).to.be.oneOf([200, 201, 204]);
      });
    });
  });

  describe('Сценарий 2: Установка пустого значения, затем установка другого значения', () => {
    it('устанавливает пустое значение, затем выбирает другое значение и проверяет отправку на сервер', () => {
      const warrantyId = 95; // Фиксированный ID
      page.visitWarrantyClaimPage(warrantyId);
      page.waitForPageLoad();

      // Перехватываем реальные запросы
      cy.intercept('PUT', `**/warranty/${warrantyId}/implementation`).as('updateImplementationField');

      // 1. Устанавливаем пустое значение
      cy.section('Очистка начального значения');
      salesChannel.clearAndVerify();

      // Ожидаем сетевую активность
      salesChannel.waitForSalesChannelNetworkIdle();

      // 2. Затем выбираем другое значение из списка
      const anotherChannel = PREDEFINED_SALES_CHANNELS[1];
      cy.section('Выбор другого канала');
      salesChannel.selectChannelAndVerify(anotherChannel);

      // Ожидаем сетевую активность
      salesChannel.waitForSalesChannelNetworkIdle();

      // Проверяем реальный запрос
      cy.section('Проверка запроса с новым значением');
      cy.wait('@updateImplementationField', { timeout: 10000 }).then((interception) => {
        const requestBody = interception.request.body;
        expect(requestBody).to.have.property('salesChannel', anotherChannel);
        expect(requestBody).to.have.property('warrantyId', warrantyId);
        expect(interception.response.statusCode).to.be.oneOf([200, 201, 204]);
      });
    });
  });

  describe('Дополнительные проверки с реальными данными', () => {
    it('отображает список предопределенных каналов продаж с реального сервера', () => {
      page.visitWarrantyClaimPage(95);
      page.waitForPageLoad();

      // Проверяем наличие каналов (реальные данные с сервера)
      const sampleChannels = PREDEFINED_SALES_CHANNELS.slice(0, 3);
      salesChannel.verifyAvailableOptions(sampleChannels);
    });

    it('поддерживает фильтрацию по вводу текста с реальными данными', () => {
      page.visitWarrantyClaimPage(95);
      page.waitForPageLoad();

      // Проверяем фильтрацию с реальными данными
      const searchText = 'Russia';
      salesChannel.verifyFiltering(searchText);
    });
  });
});
```

**Ключевые изменения**:
- Удаление `cy.clock()` и `cy.tick(500)`
- Использование существующего метода `waitForSalesChannelNetworkIdle()` вместо создания новых
- Сохранение фиксированного `warrantyId = 95`
- Использование `cy.section()` для структурирования теста
- Проверка реальных статус-кодов ответов (200, 201, 204) вместо моков
- Использование только существующих методов POM без изменений

### 5. Работа с фиксированными тестовыми данными
**Упрощенный подход (только warrantyId = 95)**:
- Использовать фиксированный `warrantyId = 95` как в исходном тесте
- Не добавлять методы для динамического получения ID
- Использовать предопределенные каналы продаж `PREDEFINED_SALES_CHANNELS`
- Работать с реальными данными с dev сервера без моков

**Ключевые принципы**:
1. **Без моков**: `cy.intercept()` только для наблюдения за реальными запросами
2. **Без новых методов**: Использовать только существующие методы POM
3. **Фиксированные данные**: `warrantyId = 95` и `PREDEFINED_SALES_CHANNELS`
4. **Реальные проверки**: Проверять реальные статус-коды ответов (200, 201, 204)

### 6. План использования e2e-cypress-test-generator с упрощенными требованиями
**Фаза 1: Анализ существующих методов и антипаттернов**:
- Анализ текущего теста: выявление `cy.clock()` и `cy.tick()` как антипаттернов
- Изучение существующего метода `waitForSalesChannelNetworkIdle()` в POM
- Анализ использования `cy.intercept()` для наблюдения (не мокинга)
- Проверка наличия `cy.section()` в других тестах проекта

**Фаза 2: Генерация упрощенного теста**:
1. Создание структуры теста с `cy.section()` (если используется в проекте)
2. Замена `cy.clock()` + `cy.tick()` на `waitForSalesChannelNetworkIdle()`
3. Сохранение фиксированного `warrantyId = 95`
4. Использование только существующих методов POM без изменений
5. Добавление проверки реальных статус-кодов ответов

**Фаза 3: Интеграция и проверка**:
- Проверка что тест работает с реальными данными dev сервера
- Убедиться что не добавлены новые методы в POM
- Проверить что используется только `warrantyId = 95`
- Верификация что `cy.intercept()` используется только для наблюдения

## Критические файлы для изменения

1. **Основной тестовый файл (единственное изменение)**:
   - `cypress/e2e/warranty-claim/warranty-sales-channel-autocomplete.cy.ts` - замена `cy.clock()` на `waitForSalesChannelNetworkIdle()`

2. **Файлы без изменений**:
   - `cypress/support/page-model/warranty-claims/action-model/sales-channel-autocomplete.ts` - использовать существующие методы
   - `cypress/support/page-model/warranty-claims/warranty-claim-page.ts` - без изменений
   - `cypress/support/helpers/mui-autocomplete.helper.ts` - без изменений

3. **Новые файлы не создаются**:
   - Не создавать фабрики тестовых данных
   - Не создавать новые методы в POM
   - Не изменять конфигурационные файлы

## Критерии успешного завершения

### Основные критерии (должны быть выполнены)
1. ✅ Удален `cy.clock()` и `cy.tick(500)` из теста
2. ✅ Используется существующий метод `waitForSalesChannelNetworkIdle()`
3. ✅ Сохранен фиксированный `warrantyId = 95`
4. ✅ `cy.intercept()` используется только для наблюдения (без моков)
5. ✅ Проверяются реальные статус-коды ответов (200, 201, 204)

### Ограничения (чего не должно быть)
1. ❌ Не добавлены новые методы в POM
2. ❌ Не созданы новые файлы (фабрики, утилиты)
3. ❌ Не изменены существующие методы POM
4. ❌ Не используются динамические ID
5. ❌ Не используются моки данных

### Дополнительные улучшения (по возможности)
1. ⚡ Использование `cy.section()` для структурирования (если есть в проекте)
2. ⚡ Улучшенные сообщения об ошибках
3. ⚡ Проверка реальных данных с dev сервера

## Временная шкала реализации

**День 1**: Подготовка и анализ
- Получение документации через Context7
- Запуск `e2e-cypress-test-generator` для анализа
- Изучение существующих паттернов

**День 2**: Рефакторинг POM
- Обновление `sales-channel-autocomplete.ts`
- Добавление фабрики тестовых данных
- Обновление `warranty-claim-page.ts`

**День 3**: Рефакторинг теста
- Переработка основного тестового файла
- Добавление edge cases
- Интеграция с обновленной POM

**День 4**: Тестирование и валидация
- Запуск тестов в разных окружениях
- Проверка соответствия критериям
- Документирование изменений

## Потенциальные проблемы и решения при работе с реальными данными

**Проблема 1**: Дебаунсинг в UI и реальные сетевые запросы
**Решение**: Использовать `waitForNetworkIdleAfterAction()` вместо `cy.tick()`, проверять реальные запросы через `cy.intercept()` (без мокинга)

**Проблема 2**: Нестабильность реальных данных на dev сервере
**Решение**:
- Добавить `ensureRealDataAvailable()` для проверки перед тестами
- Использовать retry логику для неустойчивых API
- Иметь fallback на конфигурационные данные

**Проблема 3**: Разная скорость ответа сервера в разных окружениях
**Решение**:
- Использовать адаптивные таймауты
- `waitForComponentStabilization()` для UI
- `waitForNetworkIdleAfterAction()` для сетевой активности

**Проблема 4**: Side effects от тестовых операций на реальных данных
**Решение**:
- Использовать тестовые данные, предназначенные для тестирования
- Очищать состояние после тестов если необходимо
- Использовать изолированные тестовые аккаунты/данные

**Проблема 5**: Отсутствие предопределенных каналов продаж на сервере
**Решение**:
- Проверять наличие данных перед тестом
- Использовать API для создания тестовых данных если разрешено
- Пропускать тесты если данные недоступны с понятным сообщением

## Подход к реализации

### Фаза 1: Подготовка
1. Получить документацию по Cypress через Context7
2. Проанализировать существующие тестовые паттерны в проекте
3. Определить оптимальный подход для работы с тестовыми данными

### Фаза 2: Использование e2e-cypress-test-generator
1. Запустить агента с контекстом текущего теста и связанных файлов
2. Сформировать список сценариев для утверждения
3. Реализовать улучшенную версию теста

### Фаза 3: Верификация
1. Проверить, что тесты проходят успешно
2. Убедиться, что не сломаны существующие тесты
3. Проверить соответствие стандартам проекта

## Ожидаемые улучшения

1. **Надежность**: Тест будет менее зависим от конкретных тестовых данных
2. **Читаемость**: Улучшенная структура и комментарии
3. **Поддержка**: Легче добавлять новые тестовые случаи
4. **Соответствие стандартам**: Следование FSD архитектуре и паттернам проекта