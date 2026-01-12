# План: Добавление требований о тестировании на реальных данных и использовании waitForIdle/waitForIntercept в агент e2e-cypress-test-generator

## Контекст
Требуется обновить файл агента `e2e-cypress-test-generator.md` для включения новых требований:
1. **Тестирование на реальных данных** от dev backend вместо моков
2. **Использование `waitForIdle`** для ожидания завершения операций
3. **Использование `waitForIntercept`** для проверки отправки данных

## Анализ текущего состояния
Файл агента имеет четкую структуру с 6 шагами методологии, примерами и метриками качества. Отсутствуют рекомендации по:
- Стратегиям работы с данными (моки vs реальные данные)
- Методам ожидания (`waitForIdle`)
- Перехвату API запросов (`waitForIntercept`)

## Критические файлы для изменения
- `C:\Users\Anton.Valkovskiy\.claude\agents\e2e-cypress-test-generator.md`

## План изменений

### 1. Добавить раздел "DATA AND NETWORK STRATEGIES" в STEP 6: Best Practices
**Место:** После строки 196 (после раздела "SUPPORT AND SCALABILITY")

**Содержание:**
```markdown
### DATA AND NETWORK STRATEGIES:

#### REAL DATA OVER MOCKS:
- **PRIORITIZE** testing with real data from development backend environments
- Use mocks **ONLY** for testing error cases, edge conditions, or unavailable services
- Create **DATA FIXTURES** for consistent test data from real backend responses
- Use **FACTORY FUNCTIONS** to generate test data based on real API schemas

#### WAITING STRATEGIES:
- Use `waitForIdle()` after user interactions to ensure all operations complete
- Apply `waitForIdle()` before critical assertions for test stability
- Implement proper timeout configurations for `waitForIdle()` based on application behavior
- Combine `waitForIdle()` with other waiting strategies when needed

#### API INTERCEPTION AND VALIDATION:
- Use `waitForIntercept()` to capture and validate network requests to real backend
- Verify request payloads, headers, and parameters match expected real data patterns
- Validate response structures and status codes from actual backend
- Test error handling by intercepting real error responses from backend
- **AVOID** mocking successful responses - use real backend responses instead
```

### 2. Обновить раздел "TEST STRUCTURING" в STEP 5
**Место:** В разделе "TEST STRUCTURING" (строки 144-147), добавить после существующего содержания

**Содержание:**
```markdown
### DATA AND NETWORK HANDLING:
- **PREFER** real data from development backend over mocks for positive test cases
- **USE** `waitForIdle()` to ensure UI stability and completion of all operations before assertions
- **IMPLEMENT** `waitForIntercept()` for API request validation with real backend
- **MOCK** only for specific error cases, unavailable services, or testing failure scenarios
- **VALIDATE** data consistency between frontend actions and backend API calls
```

### 3. Добавить метрики качества для работы с данными
**Место:** В разделе "QUALITY METRICS AND CHECKS" после строки 430

**Содержание:**
```markdown
### FOR DATA AND NETWORK HANDLING:
- [ ] **Real data usage** - tests use real data from development backend when possible
- [ ] **Proper waiting** - `waitForIdle()` used appropriately for test stability
- [ ] **API interception** - `waitForIntercept()` implemented for request validation
- [ ] **Mock justification** - clear reasoning provided when mocks are used
- [ ] **Data consistency** - test data aligns with real backend API schemas
- [ ] **Backend integration** - tests validate integration with actual backend services
```

### 4. Обновить "KEY FOCUSES" в FINAL INSTRUCTIONS
**Место:** В разделе "KEY FOCUSES" (строки 450-457), добавить новые пункты

**Содержание:**
```markdown
- ✅ **Real data testing** - prioritize testing with real data from development backend
- ✅ **Stable waiting strategies** - use `waitForIdle()` for operation completion
- ✅ **API validation** - implement `waitForIntercept()` for backend integration testing
- ✅ **Minimal mocking** - mocks only for error cases and edge conditions
```

### 5. Добавить новый пример использования реальных данных
**Место:** В разделе "IMPLEMENTATION EXAMPLES" после EXAMPLE 5 (строка 395)

**Содержание:**
```typescript
### EXAMPLE 6: REAL DATA TESTING WITH WAIT STRATEGIES
```typescript
it('должен создавать пользователя с реальными данными и проверять интеграцию с бэкендом', () => {
  cy.section('ШАГ 1: Подготовка реальных тестовых данных');
  // Использование реальных данных из фикстур, основанных на реальных API схемах
  cy.fixture('user-data.json').then((userData) => {
    const testUser = userData.validUser;

    cy.section('ШАГ 2: Заполнение формы реальными данными');
    registrationPage
      .enterEmail(testUser.email)
      .enterPassword(testUser.password)
      .enterFullName(testUser.fullName);

    cy.section('ШАГ 3: Ожидание завершения всех операций');
    // Использование waitForIdle для обеспечения стабильности теста
    cy.waitForIdle();

    cy.section('ШАГ 4: Перехват и валидация API запроса к реальному бэкенду');
    // Использование waitForIntercept для проверки реального API вызова
    cy.waitForIntercept({
      method: 'POST',
      url: '/api/users'
    }).then((interception) => {
      // Валидация что отправленные данные соответствуют реальным данным
      expect(interception.request.body).to.deep.equal({
        email: testUser.email,
        password: testUser.password,
        fullName: testUser.fullName
      });

      // Валидация что ответ соответствует реальной схеме API
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.response.body).to.have.property('id');
      expect(interception.response.body).to.have.property('createdAt');
    });

    cy.section('ШАГ 5: Проверка UI после успешного создания');
    registrationPage
      .shouldShowSuccessMessage('User created successfully')
      .shouldRedirectTo('/dashboard');
  });
});

// Пример ОПРАВДАННОГО использования моков (только для тестирования ошибок)
it('должен обрабатывать ошибку дублирования email (мок используется для ошибки)', () => {
  cy.section('ШАГ 1: Подготовка реальных данных для теста ошибки');
  cy.fixture('user-data.json').then((userData) => {
    const existingUser = userData.existingUser;

    cy.section('ШАГ 2: Мокирование ошибки дублирования от реального бэкенда');
    // Мок используется ТОЛЬКО для тестирования обработки ошибки
    cy.intercept('POST', '/api/users', {
      statusCode: 409,
      body: {
        error: 'User already exists',
        message: 'Email already registered'
      }
    }).as('duplicateError');

    registrationPage
      .enterEmail(existingUser.email)
      .enterPassword('Password123!')
      .enterFullName('Test User')
      .submit();

    cy.wait('@duplicateError');

    cy.section('ШАГ 3: Проверка обработки реальной ошибки');
    registrationPage
      .shouldShowErrorMessage('Email already registered')
      .emailField.shouldHaveErrorState();
  });
});
```
```

### 6. Обновить "WHAT TO AVOID" в FINAL INSTRUCTIONS
**Место:** В разделе "WHAT TO AVOID" (строки 443-447), добавить новые пункты

**Содержание:**
```markdown
- ❌ Excessive mocking of successful API responses
- ❌ Hardcoded test data that doesn't match real backend schemas
- ❌ Unstable tests without proper `waitForIdle()` usage
- ❌ Missing API validation with `waitForIntercept()`
```

## Последовательность выполнения
1. **Обновить STEP 6** - добавить раздел "DATA AND NETWORK STRATEGIES"
2. **Обновить STEP 5** - дополнить "TEST STRUCTURING" рекомендациями по данным
3. **Дополнить QUALITY METRICS** - добавить метрики для работы с данными
4. **Обновить FINAL INSTRUCTIONS** - добавить фокусы и предупреждения
5. **Добавить EXAMPLE 6** - практический пример с реальными данными

## Ожидаемый результат
После внесения изменений агент будет:
1. **Рекомендовать тестирование на реальных данных** как основной подход
2. **Предписывать использование `waitForIdle`** для стабильности тестов
3. **Требовать использование `waitForIntercept`** для валидации API
4. **Ограничивать использование моков** только для тестирования ошибок
5. **Обеспечивать проверку качества** через новые метрики
6. **Предоставлять практические примеры** нового подхода

## Проверки после реализации
- [ ] Все новые разделы добавлены в правильные места
- [ ] Примеры кода корректно отформатированы
- [ ] Требования о реальных данных четко сформулированы
- [ ] Рекомендации по `waitForIdle` и `waitForIntercept` ясны
- [ ] Метрики качества покрывают новые требования
- [ ] Финальные инструкции отражают новые приоритеты