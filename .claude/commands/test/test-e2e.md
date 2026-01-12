---
description: "Создание комплексных E2E тестов Cypress с Page Object Pattern, MUI хелперами и реальными данными"
allowed-tools: ["read", "write", "edit", "glob", "grep"]
argument-hint: "<feature>"
---

<command-definition>
  <metadata>
    <name>/cy-e2e-test</name>
    <description>Создание комплексных E2E тестов Cypress с обязательным Page Object Pattern, MUI хелперами, структурными логами и консолидированными тестами на реальных данных.</description>
    <type>e2e-test-generator</type>
    <category>cypress-testing</category>
  </metadata>

  <role-definition>
    <role>EXPERT E2E TEST ENGINEER</role>
    <specialization>QA Frontend project integration with custom commands and MUI helpers</specialization>
    <mission>Создание надежных, поддерживаемых E2E тестов с правильной архитектурой и интеграцией с кастомными командами проекта и MUI хелперами.</mission>
  </role-definition>

  <mandatory-instructions>
    <instruction-group order="1" priority="critical" type="analysis">
      <title>Анализ существующей архитектуры</title>
      <instruction mandatory="true">
        <action>АНАЛИЗИРОВАТЬ существующую структуру E2E тестов и page models</action>
        <target>cypress/support/page-model/</target>
      </instruction>
    </instruction-group>

    <instruction-group order="2" priority="critical" type="architecture">
      <title>Page Object Pattern</title>
      <instruction mandatory="true">
        <action>ВСЕГДА СТРОИТЬ PAGE MODELS - создавать новые или использовать существующие</action>
        <condition>при необходимости расширять</condition>
      </instruction>
    </instruction-group>

    <instruction-group order="3" priority="critical" type="mui-integration">
      <title>MUI Helpers Integration</title>
      <instruction mandatory="true">
        <action>ВСЕГДА ИСПОЛЬЗОВАТЬ MUI ХЕЛПЕРЫ для работы с элементами страницы</action>
        <import-location>cypress/support/mui-helpers</import-location>
      </instruction>
      <instruction mandatory="true">
        <action>ВСЕГДА СОЗДАВАТЬ НЕДОСТАЮЩИЕ ХЕЛПЕРЫ в процессе тестирования</action>
        <target-directory>соответствующая директория</target-directory>
      </instruction>
      <instruction mandatory="true">
        <action>ВСЕГДА РАСШИРЯТЬ ХЕЛПЕРЫ при необходимости для новых сценариев тестирования</action>
      </instruction>
    </instruction-group>

    <instruction-group order="4" priority="critical" type="test-consolidation">
      <title>Консолидация тестов</title>
      <instruction mandatory="true">
        <action>ВСЕГДА СОЗДАВАТЬ КОНСОЛИДИРОВАННЫЕ ТЕСТЫ - объединять связанную функциональность в единые тесты</action>
      </instruction>
    </instruction-group>

    <instruction-group order="5" priority="critical" type="data-strategy">
      <title>Стратегия реальных данных</title>
      <instruction mandatory="true">
        <action>ВСЕГДА ИСПОЛЬЗОВАТЬ РЕАЛЬНЫЕ ДАННЫЕ СЕРВЕРА</action>
        <exception>мокировать запросы только в исключительных случаях</exception>
      </instruction>
      <instruction mandatory="true">
        <action>ВСЕГДА ВАЛИДИРОВАТЬ ОТПРАВЛЯЕМЫЕ ДАННЫЕ</action>
        <method>для всех запросов через cy.intercept() проверять отправляемое содержимое и сравнивать с ожидаемым</method>
        <constraint>не изменять ответы</constraint>
      </instruction>
    </instruction-group>

    <instruction-group order="6" priority="high" type="test-structure">
      <title>Структура тестов</title>
      <instruction mandatory="true">
        <action>СОЗДАВАТЬ тесты с использованием кастомных команд</action>
        <commands>
          <command>loginToAAD</command>
          <command>smartNavigate</command>
          <command>waitForNetworkIdle</command>
        </commands>
      </instruction>
      <instruction mandatory="true">
        <action>ИСПОЛЬЗОВАТЬ Page Object Pattern с многоуровневой архитектурой</action>
        <components>
          <component>page models</component>
          <component>action models</component>
        </components>
      </instruction>
      <instruction mandatory="true">
        <action>СТРУКТУРИРОВАТЬ тесты с помощью cy.section() и cy.step()</action>
        <purpose>для читаемых логов</purpose>
      </instruction>
      <instruction mandatory="true">
        <action>ИСКЛЮЧАТЬ комментарии в коде</action>
        <reason>код должен быть самодокументируемым</reason>
      </instruction>
      <instruction mandatory="true">
        <action>ДОБАВЛЯТЬ тегирование через @cypress/grep</action>
        <tags>
          <tag>@smoke</tag>
          <tag>@critical</tag>
          <tag>@regression</tag>
        </tags>
      </instruction>
      <instruction mandatory="true">
        <action>ОБЕСПЕЧИВАТЬ правильное именование файлов и структуру директорий</action>
      </instruction>
    </instruction-group>
  </mandatory-instructions>

  <usage-section>
    <syntax>
      <template>/cy-e2e-test &lt;feature&gt;</template>
    </syntax>

    <parameters-section>
      <parameter name="feature" required="true" type="string">
        <description>Название фичи/страницы для тестирования (обязательный)</description>
        <examples>
          <example>warranty-claims</example>
          <example>orders</example>
          <example>trace-page</example>
        </examples>
      </parameter>
    </parameters-section>

    <examples-section>
      <example id="warranty-claims">
        <title>Создать консолидированные тесты для warranty claims с реальными данными</title>
        <code-block language="bash">
          <![CDATA[
          /cy-e2e-test warranty-claims
          ]]>
        </code-block>
      </example>

      <example id="orders">
        <title>Создать тесты для модуля заказов</title>
        <code-block language="bash">
          <![CDATA[
          /cy-e2e-test orders
          ]]>
        </code-block>
      </example>

      <example id="trace-page">
        <title>Создать тесты для страницы трассировки</title>
        <code-block language="bash">
          <![CDATA[
          /cy-e2e-test trace-page
          ]]>
        </code-block>
      </example>
    </examples-section>
  </usage-section>

  <structure-section>
    <directory-structure type="mandatory">
      <title>Всегда создается следующая структура</title>
      <diagram type="tree">
        <![CDATA[
        cypress/
        ├── e2e/
        │   └── {feature}-consolidated.cy.ts
        └── support/
            ├── page-model/
            │   └── {feature}/
            │       ├── {feature}-page.ts
            │       └── action-model/
            │           ├── {action1}-model.ts
            │           └── {action2}-model.ts
            └── mui-helpers/
                ├── form-helpers.ts
                ├── table-helpers.ts
                ├── dialog-helpers.ts
                └── [дополнительные хелперы при необходимости]
        ]]>
      </diagram>
    </directory-structure>
  </structure-section>

  <templates-section>
    <template-group type="e2e-tests">
      <template name="e2e-test-file" mandatory="true">
        <title>E2E Test File (Всегда консолидированный с MUI хелперами)</title>
        <description>Основной файл E2E тестов с консолидированными сценариями</description>
        <code-block language="typescript">
          <![CDATA[
          // cypress/e2e/warranty-claims-consolidated.cy.ts
          import { warrantyClaimsPageModel } from '../support/page-model/warranty-claims/warranty-claims-page';
          import { fillMuiTextField, selectMuiAutocomplete, clickMuiButton } from '../support/mui-helpers/form-helpers';
          import { validateMuiTableRow } from '../support/mui-helpers/table-helpers';

          describe('Warranty Claims - Комплексная проверка @regression @smoke @critical', () => {
            beforeEach(() => {
              cy.loginToAAD(Cypress.env('AAD_USERNAME'), Cypress.env('AAD_PASSWORD'));
            });

            const page = warrantyClaimsPageModel;

            it('Полный цикл работы с рекламаций: создание, поиск, фильтрация', () => {
              cy.section('Подготовка: переход на страницу рекламаций');
              page.visitWarrantyClaimsPage();

              cy.section('Создание новой рекламации с реальными данными');
              page.getCreateButton().should('be.visible');

              cy.step('Открытие формы создания');
              page.getCreateButton().click();

              cy.step('Заполнение обязательных полей через MUI хелперы');
              fillMuiTextField('product-id-field', 'TEST-123');
              fillMuiTextField('description-field', 'Тестовая рекламация');
              selectMuiAutocomplete('customer-autocomplete', 'CUST-456');

              cy.step('Валидация отправляемых данных без мокирования ответа');
              cy.intercept('POST', '**/api/warranty-claims', (req) => {
                expect(req.body).to.deep.include({
                  productId: 'TEST-123',
                  description: 'Тестовая рекламация',
                  customerId: 'CUST-456'
                });
                // Не изменяем ответ - позволяем запросу пройти к реальному серверу
              }).as('createClaimRequest');

              cy.step('Отправка формы');
              clickMuiButton('submit-claim-button');

              cy.wait('@createClaimRequest').its('response.statusCode').should('eq', 201);
              cy.findByTestId('success-message').should('contain.text', 'Рекламация успешно создана');
              cy.url().should('include', '/warranty/');

              cy.section('Поиск созданной рекламации');
              page.visitWarrantyClaimsPage();

              const claimNumber = 'WC-2025-001';
              page.search.getSearchBox().type(claimNumber);
              page.search.clickSearchButton();

              cy.findByTestId('claim-row').should('have.length.at.least', 1);
              validateMuiTableRow(0, { claimNumber, status: 'pending' });

              cy.section('Фильтрация рекламаций по статусу');
              page.filters.openStatusFilter();
              page.filters.selectStatus('pending');
              page.filters.applyFilters();

              cy.findByTestId('claim-status').each(($el) => {
                expect($el.text()).to.include('pending');
              });
            });

            it('Быстрые операции: массовые действия и экспорт с реальными данными', () => {
              cy.section('Массовый выбор рекламаций');
              page.visitWarrantyClaimsPage();
              page.bulkActions.selectAllClaims();
              page.bulkActions.shouldShowSelectedCount(10);

              cy.section('Валидация экспортного запроса');
              cy.intercept('POST', '**/api/export/warranty-claims', (req) => {
                expect(req.body).to.have.property('format', 'excel');
                expect(req.body).to.have.property('selectedIds').that.is.an('array');
                // Позволяем запросу пройти к реальному серверу
              }).as('exportRequest');

              cy.step('Экспорт выбранных рекламаций');
              page.bulkActions.exportSelectedClaims('excel');
              cy.wait('@exportRequest').its('response.statusCode').should('eq', 200);
              cy.findByTestId('export-success').should('be.visible');
            });
          });
          ]]>
        </code-block>
      </template>

      <template name="page-model" mandatory="true">
        <title>Page Model (Всегда создается с использованием MUI хелперов)</title>
        <description>Основной page model для страницы</description>
        <code-block language="typescript">
          <![CDATA[
          // cypress/support/page-model/warranty-claims/warranty-claims-page.ts
          import { ClaimFormModel } from './action-model/claim-form';
          import { SearchModel } from './action-model/search';
          import { FiltersModel } from './action-model/filters';
          import { BulkActionsModel } from './action-model/bulk-actions';
          import { fillMuiTextField, selectMuiAutocomplete } from '../../mui-helpers/form-helpers';
          import { getMuiTableRow } from '../../mui-helpers/table-helpers';

          class WarrantyClaimsPageModel {
            name: string;
            claimForm: ClaimFormModel;
            search: SearchModel;
            filters: FiltersModel;
            bulkActions: BulkActionsModel;

            constructor() {
              this.name = 'warranty-claims-page';
              this.claimForm = Object.freeze(new ClaimFormModel());
              this.search = Object.freeze(new SearchModel());
              this.filters = Object.freeze(new FiltersModel());
              this.bulkActions = Object.freeze(new BulkActionsModel());
            }

            visitWarrantyClaimsPage() {
              cy.smartNavigate('warranty-claims');
            }

            getCreateButton() {
              return cy.findByTestId('create-claim-button');
            }

            // Пример метода с использованием MUI хелперов
            fillProductField(value: string) {
              fillMuiTextField('product-field', value);
            }
          }

          export const warrantyClaimsPageModel = Object.freeze(new WarrantyClaimsPageModel());
          ]]>
        </code-block>
      </template>

      <template name="action-model" mandatory="true">
        <title>Action Model с MUI хелперами (Всегда создается)</title>
        <description>Action model для отдельных компонентов/действий</description>
        <code-block language="typescript">
          <![CDATA[
          // cypress/support/page-model/warranty-claims/action-model/claim-form.ts
          import { fillMuiTextField, selectMuiAutocomplete, clickMuiButton } from '../../../mui-helpers/form-helpers';

          export class ClaimFormModel {
            name: string;

            constructor() {
              this.name = 'claim-form';
            }

            fillClaimForm(data: {
              productId: string;
              description: string;
              customerId: string;
            }) {
              fillMuiTextField('product-id-input', data.productId);
              fillMuiTextField('description-input', data.description);
              selectMuiAutocomplete('customer-id-input', data.customerId);
            }

            submitForm() {
              clickMuiButton('submit-claim-button');
              cy.waitForNetworkIdle(['**/api/warranty-claims'], 500, 10000);
            }
          }
          ]]>
        </code-block>
      </template>

      <template name="mui-helper" conditional="true">
        <title>MUI Helper (Всегда создается при необходимости)</title>
        <description>Хелперы для работы с MUI компонентами</description>
        <code-block language="typescript">
          <![CDATA[
          // cypress/support/mui-helpers/form-helpers.ts
          /**
           * Заполняет MUI TextField по data-testid
           */
          export const fillMuiTextField = (testId: string, value: string) => {
            cy.findByTestId(testId).find('input').type(value);
          };

          /**
           * Выбирает значение в MUI Autocomplete
           */
          export const selectMuiAutocomplete = (testId: string, value: string) => {
            cy.findByTestId(testId).click();
            cy.findByRole('option', { name: value }).click();
          };

          /**
           * Кликает по MUI Button по data-testid
           */
          export const clickMuiButton = (testId: string) => {
            cy.findByTestId(testId).click();
          };

          // При необходимости добавлять новые хелперы в процессе тестирования
          ]]>
        </code-block>
      </template>

      <template name="api-validation" mandatory="true">
        <title>API Validation (Всегда без мокирования!)</title>
        <description>Валидация запросов без изменения ответов</description>
        <code-block language="typescript">
          <![CDATA[
          // Валидация запросов без изменения ответов
          beforeEach(() => {
            // Валидация GET запроса - проверяем query параметры
            cy.intercept('GET', '**/api/warranty-claims*', (req) => {
              if (req.query.status) {
                expect(req.query.status).to.be.oneOf(['pending', 'resolved', 'rejected']);
              }
              // Позволяем запросу пройти к реальному серверу
            }).as('getWarrantyClaims');

            // Валидация POST запроса - проверяем тело
            cy.intercept('POST', '**/api/warranty-claims', (req) => {
              expect(req.body).to.have.property('productId');
              expect(req.body).to.have.property('description');
              expect(req.body.description).to.be.a('string').with.length.at.least(5);
              // Позволяем запросу пройти к реальному серверу
            }).as('createWarrantyClaim');
          });
          ]]>
        </code-block>
      </template>
    </template-group>
  </templates-section>

  <execution-workflow>
    <step order="1" mandatory="true" priority="critical">
      <title>АНАЛИЗ СУЩЕСТВУЮЩЕЙ АРХИТЕКТУРЫ</title>
      <actions>
        <action order="1">Поиск существующих page models в cypress/support/page-model/</action>
        <action order="2">Анализ структуры существующих E2E тестов</action>
        <action order="3">Проверка доступных MUI хелперов в cypress/support/mui-helpers/</action>
        <action order="4">Определение паттернов именования и организации кода</action>
        <action order="5">Проверка кастомных команд в commands-e2e.ts</action>
        <action order="6">Проверка поддержки cy.section() и cy.step() в проекте</action>
      </actions>
    </step>

    <step order="2" mandatory="true" priority="critical">
      <title>СОЗДАНИЕ/РАСШИРЕНИЕ MUI ХЕЛПЕРОВ</title>
      <actions>
        <action order="1">Проверить существующие хелперы в cypress/support/mui-helpers/</action>
        <action order="2" mandatory="true">ВСЕГДА создавать недостающие хелперы для работы с MUI компонентами</action>
        <action order="3" mandatory="true">ВСЕГДА расширять существующие хелперы при необходимости</action>
        <action order="4">Обеспечить типизацию и документацию хелперов</action>
      </actions>
    </step>

    <step order="3" mandatory="true" priority="critical">
      <title>СОЗДАНИЕ СТРУКТУРЫ ФАЙЛОВ</title>
      <actions>
        <action order="1" mandatory="true">ВСЕГДА создавать директории для page models если не существуют</action>
        <action order="2" mandatory="true">ВСЕГДА готовить файл тестов с именем {feature}-consolidated.cy.ts</action>
        <action order="3" mandatory="true">ВСЕГДА создавать или использовать существующие page models</action>
      </actions>
    </step>

    <step order="4" mandatory="true" priority="critical">
      <title>ГЕНЕРАЦИЯ PAGE MODELS С MUI ХЕЛПЕРАМИ</title>
      <actions>
        <action order="1" mandatory="true">ВСЕГДА создавать главный page model с использованием Object.freeze()</action>
        <action order="2" mandatory="true">ВСЕГДА создавать action models в action-model/ директории</action>
        <action order="3" mandatory="true">ВСЕГДА использовать MUI хелперы для работы с элементами</action>
        <action order="4">Реализация методов с использованием кастомных команд</action>
        <action order="5" mandatory="true">ВСЕГДА использовать cy.findByTestId() для селекторов</action>
        <action order="6">Если в компоненте отсутствуют data-testid - ДОБАВИТЬ все необходимые data-testid</action>
        <action order="7">Использовать необходимые хелперы из support/helpers и support/mui-helpers</action>
      </actions>
    </step>

    <step order="5" mandatory="true" priority="critical">
      <title>СОЗДАНИЕ E2E ТЕСТОВ С РЕАЛЬНЫМИ ДАННЫМИ</title>
      <actions>
        <action order="1">Импорт необходимых page models и MUI хелперов</action>
        <action order="2">Настройка beforeEach с авторизацией через cy.loginToAAD()</action>
        <action order="3">Создание describe блоков с тегированием @regression @smoke @critical</action>
        <action order="4" mandatory="true">ВСЕГДА создавать консолидированные it блоки с объединенной функциональностью</action>
        <action order="5" mandatory="true">ВСЕГДА использовать cy.section() для логических разделов теста</action>
        <action order="6" mandatory="true">ВСЕГДА использовать cy.step() для отдельных шагов внутри разделов</action>
        <action order="7" mandatory="true">ВСЕГДА исключать комментарии - код должен быть самодокументируемым</action>
        <action order="8" mandatory="true">ВСЕГДА использовать реальные данные сервера</action>
        <action order="9" mandatory="true">ВСЕГДА валидировать запросы через cy.intercept() без изменения ответов</action>
        <action order="10">Использовать кастомных команд и page model методов</action>
      </actions>
    </step>

    <step order="6" mandatory="true">
      <title>ВАЛИДАЦИЯ</title>
      <validation-checks>
        <check order="1">Проверка TypeScript типов</check>
        <check order="2">Проверка соответствия существующим паттернам</check>
        <check order="3">Проверка использования кастомных команд</check>
        <check order="4">Проверка тегирования @regression @smoke @critical</check>
        <check order="5">Проверка отсутствия комментариев в коде</check>
        <check order="6">Проверка использования cy.section() и cy.step()</check>
        <check order="7">Проверка использования MUI хелперов</check>
        <check order="8">Проверка стратегии тестирования (реальные данные без моков)</check>
      </validation-checks>
    </step>
  </execution-workflow>

  <rules-section>
    <rule-group type="mui-helpers">
      <title>Правила работы с MUI хелперами</title>
      <rules>
        <rule order="1" mandatory="true">
          <description>ВСЕГДА использовать существующие хелперы из cypress/support/mui-helpers/</description>
        </rule>
        <rule order="2" mandatory="true">
          <description>ВСЕГДА создавать недостающие хелперы при первом использовании компонента</description>
        </rule>
        <rule order="3" mandatory="true">
          <description>ВСЕГДА расширять хелперы для поддержки новых сценариев</description>
        </rule>
        <rule order="4" mandatory="true">
          <description>ВСЕГДА типизировать хелперы для TypeScript безопасности</description>
        </rule>
        <rule order="5" mandatory="true">
          <description>ВСЕГДА документировать хелперы JSDoc комментариями</description>
        </rule>
        <rule order="6" mandatory="true">
          <description>ВСЕГДА реиспользовать хелперы во всех page models и тестах</description>
        </rule>
      </rules>
    </rule-group>

    <rule-group type="real-data-strategy">
      <title>Правила тестирования с реальными данными</title>
      <rules>
        <rule order="1" mandatory="true">
          <description>ВСЕГДА использовать реальные API endpoints</description>
        </rule>
        <rule order="2" mandatory="true">
          <description>ВСЕГДА валидировать без изменений: Использовать cy.intercept() только для проверки отправляемых данных</description>
        </rule>
        <rule order="3" mandatory="true">
          <description>НИКОГДА не мокировать ответы API за исключением:</description>
          <exceptions>
            <exception>Тестирование невозможно без моков (ошибки сервера, таймауты)</exception>
            <exception>Тестирование деструктивных операций (удаление, блокировка)</exception>
            <exception>Тестирование edge cases которые сложно воспроизвести</exception>
          </exceptions>
        </rule>
        <rule order="4">
          <description>СОХРАНЕНИЕ СОСТОЯНИЯ: Не изменять состояние реальной базы данных без необходимости</description>
        </rule>
        <rule order="5">
          <description>ОЧИСТКА ДАННЫХ: При создании тестовых данных - обеспечить их очистку после тестов</description>
        </rule>
      </rules>
    </rule-group>

    <rule-group type="test-consolidation">
      <title>Правила консолидации тестов</title>
      <rules>
        <rule order="1" mandatory="true">
          <description>ВСЕГДА объединять связанную функциональность в один тест</description>
          <examples>
            <example>создание + поиск + редактирование сущности</example>
            <example>фильтрация + сортировка + пагинация</example>
            <example>массовые действия + экспорт</example>
          </examples>
        </rule>
        <rule order="2" mandatory="true">
          <description>ТОЛЬКО разделять независимые сценарии в отдельные тесты</description>
          <examples>
            <example>авторизация vs работа с данными</example>
            <example>разные модули приложения</example>
          </examples>
        </rule>
        <rule order="3" mandatory="true">
          <description>ВСЕГДА использовать cy.section() для логического структурирования</description>
          <details>
            <detail>Каждый раздел должен представлять логический этап</detail>
            <detail>Разделы улучшают читаемость логов Cypress</detail>
          </details>
        </rule>
        <rule order="4" mandatory="true">
          <description>ВСЕГДА использовать cy.step() для детализации шагов</description>
          <details>
            <detail>Шаги внутри разделов для конкретных действий</detail>
            <detail>Помогает в отладке и анализе падений</detail>
          </details>
        </rule>
        <rule order="5" mandatory="true">
          <description>НИКОГДА не дробить на мелкие тесты</description>
          <details>
            <detail>Минимизировать количество it блоков</detail>
            <detail>Увеличивать покрытие в рамках одного теста</detail>
          </details>
        </rule>
      </rules>
    </rule-group>

    <rule-group type="naming-conventions">
      <title>Правила именования</title>
      <rules>
        <rule order="1" type="test-files">
          <pattern>{feature}-consolidated.cy.ts</pattern>
          <example>warranty-claims-consolidated.cy.ts</example>
        </rule>
        <rule order="2" type="page-models">
          <pattern>{feature}-page.ts</pattern>
          <example>warranty-claims-page.ts</example>
        </rule>
        <rule order="3" type="action-models">
          <pattern>{action}-model.ts</pattern>
          <example>claim-form-model.ts</example>
        </rule>
        <rule order="4" type="mui-helpers">
          <pattern>{component}-helpers.ts</pattern>
          <examples>
            <example>form-helpers.ts</example>
            <example>table-helpers.ts</example>
          </examples>
        </rule>
        <rule order="5" type="directories">
          <pattern>cypress/support/page-model/{feature}/</pattern>
          <example>cypress/support/page-model/warranty-claims/</example>
        </rule>
        <rule order="6" mandatory="true" type="tags">
          <pattern>ВСЕГДА использовать @smoke, @critical, @regression</pattern>
          <example>describe('Test Suite @smoke @critical @regression', ...)</example>
        </rule>
        <rule order="7" type="sections-steps">
          <description>Использовать понятные описательные названия</description>
          <examples>
            <example>cy.section('Создание новой рекламации')</example>
            <example>cy.step('Заполнение обязательных полей')</example>
          </examples>
        </rule>
      </rules>
    </rule-group>

    <rule-group type="custom-commands">
      <title>Использование кастомных команд и MUI хелперов</title>
      <always-use>
        <command>
          <name>cy.loginToAAD()</name>
          <purpose>для авторизации</purpose>
        </command>
        <command>
          <name>cy.smartNavigate()</name>
          <purpose>для навигации</purpose>
        </command>
        <command>
          <name>cy.waitForNetworkIdle()</name>
          <purpose>для ожидания сетевых запросов</purpose>
        </command>
        <command>
          <name>cy.findByTestId()</name>
          <purpose>для поиска элементов</purpose>
        </command>
        <command>
          <name>MUI хелперы</name>
          <source>cypress/support/mui-helpers/</source>
        </command>
        <command>
          <name>cy.section()</name>
          <purpose>для структурирования тестов</purpose>
        </command>
        <command>
          <name>cy.step()</name>
          <purpose>для детализации шагов</purpose>
        </command>
        <command>
          <name>cy.intercept()</name>
          <purpose>только для валидации отправляемых данных</purpose>
        </command>
      </always-use>

      <never-use>
        <exception>за исключением особых случаев</exception>
        <item>cy.visit() напрямую (использовать cy.smartNavigate())</item>
        <item>cy.get() для поиска элементов (использовать cy.findByTestId() или MUI хелперы)</item>
        <item>Прямые селекторы по классам или ID</item>
        <item>Комментарии в коде</item>
        <item>Мокирование ответов API (только в исключительных случаях)</item>
      </never-use>
    </rule-group>
  </rules-section>

  <deliverables-section>
    <title>Результат выполнения</title>
    <deliverables>
      <deliverable order="1" mandatory="true">
        <name>Консолидированные E2E тесты Cypress</name>
        <features>полная типизация</features>
      </deliverable>
      <deliverable order="2" mandatory="true">
        <name>Page models</name>
        <features>архитектура Page Object Pattern и MUI хелперы</features>
      </deliverable>
      <deliverable order="3" mandatory="true">
        <name>Action models</name>
        <features>для отдельных компонентов/действий</features>
      </deliverable>
      <deliverable order="4" mandatory="true">
        <name>MUI хелперы</name>
        <condition>существующие или созданные/расширенные</condition>
      </deliverable>
      <deliverable order="5" mandatory="true">
        <name>Структурированные логи</name>
        <method>через cy.section() и cy.step()</method>
      </deliverable>
      <deliverable order="6" mandatory="true">
        <name>Тестирование с реальными данными</name>
        <source>сервера</source>
      </deliverable>
      <deliverable order="7" mandatory="true">
        <name>Валидация API запросов</name>
        <constraint>без мокирования ответов</constraint>
      </deliverable>
      <deliverable order="8" mandatory="true">
        <name>Тегирование</name>
        <tool>@cypress/grep (@regression @smoke @critical)</tool>
      </deliverable>
      <deliverable order="9" mandatory="true">
        <name>Интеграция</name>
        <with>кастомными командами проекта</with>
      </deliverable>
      <deliverable order="10" mandatory="true">
        <name>Самодокументируемый код</name>
        <feature>без комментариев</feature>
      </deliverable>
    </deliverables>
  </deliverables-section>

  <summary-section>
    <description>Команда /cy-e2e-test - создание качественных консолидированных E2E тестов с современной структурой и реальными данными! Всегда создает page models, всегда использует реальные данные, всегда делает консолидированные тесты.</description>
  </summary-section>
</command-definition>
