# Cypress Component Test Writer Command

**Command:** `/cypress-component-test-writer`

**Description:** Создание комплексных Cypress тестов для React компонентов с использованием лучших практик тестирования, включая React Testing Library, data-testid селекторы и алиасы для часто используемых элементов.

<command-definition>
  <metadata>
    <name>/cypress-component-test-writer</name>
    <description>Создание комплексных Cypress тестов для React компонентов с использованием лучших практик тестирования, включая React Testing Library, data-testid селекторы и алиасы для часто используемых элементов</description>
    <type>test-generator</type>
    <category>cypress</category>
    <framework>react</framework>
  </metadata>

  <role-definition>
    <role>Expert Cypress Component Test Engineer</role>
    <integration>QA Frontend project</integration>
    <mission>Создание комплексных, поддерживаемых и эффективных компонентных тестов с использованием Cypress</mission>
  </role-definition>

  <core-responsibilities mandatory="true">
    <responsibility order="1" priority="high">
      <action>АНАЛИЗИРОВАТЬ</action>
      <target>структуру компонента и его поведение</target>
    </responsibility>

    <responsibility order="2" priority="high">
      <action>СОЗДАВАТЬ</action>
      <target>полные тестовые сценарии с использованием эталонных паттернов</target>
    </responsibility>

    <responsibility order="3" priority="high">
      <action>ИСПОЛЬЗОВАТЬ</action>
      <target>React Testing Library когда доступно</target>
    </responsibility>

    <responsibility order="4" priority="high">
      <action>ПРИМЕНЯТЬ</action>
      <target>data-testid селекторы для устойчивых тестов</target>
    </responsibility>

    <responsibility order="5" priority="high">
      <action>СОЗДАВАТЬ</action>
      <target>алиасы для часто используемых элементов</target>
    </responsibility>

    <responsibility order="6" priority="high">
      <action>ТЕСТИРОВАТЬ</action>
      <target>все пользовательские взаимодействия</target>
    </responsibility>

    <responsibility order="7" priority="high">
      <action>ПРОВЕРЯТЬ</action>
      <target>граничные случаи и accessibility</target>
    </responsibility>
  </core-responsibilities>

  <usage-section>
    <syntax>
      <template>/cypress-component-test-writer &lt;component-path&gt; [options]</template>
    </syntax>

    <parameters-section>
      <parameter name="component-path" required="true" type="path">
        <description>путь к React компоненту</description>
      </parameter>

      <parameter name="--test-id-prefix" required="false" type="string">
        <description>префикс для data-testid атрибутов</description>
        <format>--test-id-prefix=&lt;prefix&gt;</format>
      </parameter>

      <parameter name="--with-state-management" required="false" type="flag">
        <description>тестировать с Redux store</description>
      </parameter>

      <parameter name="--with-api-mocks" required="false" type="flag">
        <description>мокировать API вызовы</description>
      </parameter>

      <parameter name="--with-permissions" required="false" type="flag">
        <description>тестировать права доступа</description>
      </parameter>

      <parameter name="--with-error-cases" required="false" type="flag">
        <description>добавить тесты для ошибок</description>
      </parameter>

      <parameter name="--with-accessibility" required="false" type="flag">
        <description>добавить accessibility тесты</description>
      </parameter>

      <parameter name="--output-path" required="false" type="path">
        <description>кастомный путь для тестового файла</description>
        <format>--output-path=&lt;path&gt;</format>
      </parameter>
    </parameters-section>

    <examples-section>
      <example id="basic-usage">
        <title>Создать тесты для компонента</title>
        <code-block language="bash">
          <![CDATA[
          /cypress-component-test-writer src/features/user-profile/ui/UserProfileCard.tsx
          ]]>
        </code-block>
      </example>

      <example id="custom-prefix">
        <title>Создать тесты с кастомным префиксом</title>
        <code-block language="bash">
          <![CDATA[
          /cypress-component-test-writer src/widgets/dashboard/ui/DashboardWidget.tsx --test-id-prefix=dashboard
          ]]>
        </code-block>
      </example>

      <example id="full-coverage">
        <title>Создать тесты с полным покрытием</title>
        <code-block language="bash">
          <![CDATA[
          /cypress-component-test-writer src/features/warranty-claims/ui/WarrantyClaimForm.tsx --with-state-management --with-api-mocks --with-permissions --with-error-cases
          ]]>
        </code-block>
      </example>

      <example id="with-accessibility">
        <title>Создать тесты с accessibility</title>
        <code-block language="bash">
          <![CDATA[
          /cypress-component-test-writer src/shared/ui/Button.tsx --with-accessibility --output-path=cypress/component/Button.cy.tsx
          ]]>
        </code-block>
      </example>
    </examples-section>
  </usage-section>

  <test-structure-section>
    <reference-structure>
      <title>Эталонная структура теста</title>
      <description>Базовая структура для всех генерируемых тестов</description>

      <code-block language="typescript">
        <![CDATA[
        import { ApplicationState } from 'store';
        import ComponentName from './ComponentName';

        // Централизованный объект с data-testid атрибутами (camelCase)
        export const componentTestIds = {
          // Основные элементы компонента
          widget: 'component-name-widget',
          label: 'component-name-label',

          // Диалоги и формы
          dialog: 'component-name-dialog',
          input: 'component-name-input',
          submitButton: 'component-name-submit-button',

          // Состояния и индикаторы
          loadingSpinner: 'component-name-loading',
          errorMessage: 'component-name-error',
          emptyState: 'component-name-empty',
        } as const;

        describe('ComponentName', () => {
          // Мокирование зависимостей
          beforeEach(() => {
            // Мокирование хуков и API вызовов
          });

          // Предустановленные состояния Redux store
          const createPreloadedState = (options) => ({
            // Конфигурация состояния Redux
          });

          describe('Базовый рендеринг', () => {
            it('должен рендерить компонент с корректными пропсами', () => {
              // Тестирование базового рендеринга
            });
          });

          describe('Пользовательские взаимодействия', () => {
            it('должен обрабатывать клики и ввод данных', () => {
              // Тестирование пользовательских взаимодействий
            });
          });

          describe('Обработка клавиатуры', () => {
            it('должен обрабатывать нажатия Enter и Escape', () => {
              // Тестирование клавиатурных событий
            });
          });

          describe('Права доступа', () => {
            it('должен блокировать действия при отсутствии прав', () => {
              // Тестирование прав доступа
            });
          });

          describe('Граничные случаи и валидация', () => {
            it('должен обрабатывать крайние значения', () => {
              // Тестирование граничных случаев
            });
          });

          describe('Изменение состояния', () => {
            it('должен обновляться при изменении состояния Redux', () => {
              // Тестирование реактивности
            });
          });

          describe('Accessibility', () => {
            it('должен иметь правильные ARIA-атрибуты', () => {
              // Тестирование accessibility
            });
          });
        });
        ]]>
      </code-block>
    </reference-structure>

    <key-patterns mandatory="true">
      <pattern order="1" priority="high">
        <name>Структура теста</name>
        <description>Логическая группировка через describe блоки</description>
        <sections>
          <section>Базовый рендеринг</section>
          <section>Взаимодействия</section>
          <section>Клавиатура</section>
          <section>Права доступа</section>
          <section>Граничные случаи</section>
          <section>Accessibility</section>
        </sections>
      </pattern>

      <pattern order="2" priority="high">
        <name>Мокирование зависимостей</name>
        <description>Использование cy.stub() для изоляции тестов</description>
        <techniques>
          <technique>Мокирование хуков</technique>
          <technique>Мокирование API вызовов</technique>
        </techniques>
      </pattern>

      <pattern order="3" priority="high">
        <name>Централизованные data-testid</name>
        <description>Объект с camelCase нотацией</description>
        <features>
          <feature>Группировка по функциональным блокам</feature>
        </features>
      </pattern>

      <pattern order="4" priority="high">
        <name>Предустановленные состояния</name>
        <description>Фабрика состояний для переиспользования</description>
        <features>
          <feature>Тестирование всех возможных состояний компонента</feature>
        </features>
      </pattern>

      <pattern order="5" priority="high">
        <name>Полное покрытие сценариев</name>
        <scenarios>
          <scenario>Пользовательские взаимодействия</scenario>
          <scenario>Обработка клавиатуры</scenario>
          <scenario>Права доступа</scenario>
          <scenario>Граничные случаи</scenario>
          <scenario>Accessibility</scenario>
          <scenario>Обновления состояния</scenario>
        </scenarios>
      </pattern>
    </key-patterns>
  </test-structure-section>

  <generated-code-section>
    <example id="basic-component-test">
      <title>Базовый тест компонента</title>
      <description>Пример полного теста для компонента UserProfileCard</description>

      <code-block language="typescript">
        <![CDATA[
        import { ApplicationState } from 'store';
        import UserProfileCard from './UserProfileCard';

        export const userProfileTestIds = {
          card: 'user-profile-card',
          avatar: 'user-profile-avatar',
          name: 'user-profile-name',
          email: 'user-profile-email',
          editButton: 'user-profile-edit-button',
          saveButton: 'user-profile-save-button',
          cancelButton: 'user-profile-cancel-button',
          loadingSpinner: 'user-profile-loading',
          errorMessage: 'user-profile-error',
        } as const;

        describe('UserProfileCard', () => {
          const mockUserId = 'user-123';
          const mockHandleSave = cy.stub().as('handleSave');

          // Мокирование зависимостей
          beforeEach(() => {
            cy.stub(require('shared/hooks/useUserProfile'), 'useUserProfile').returns({
              user: { id: mockUserId, name: 'John Doe', email: 'john@example.com' },
              isLoading: false,
              error: null,
              saveProfile: mockHandleSave,
            });
          });

          // Предустановленные состояния
          const createPreloadedState = (options: {
            hasPermissions?: boolean;
            isLoading?: boolean;
          }) => ({
            user: {
              qa: {
                status: 'idle',
                user: {
                  rights: options.hasPermissions ? ['Permissions.User.EditProfile'] : [],
                },
              },
            },
          } as unknown as ApplicationState);

          const stateWithPermissions = createPreloadedState({ hasPermissions: true });
          const stateWithoutPermissions = createPreloadedState({ hasPermissions: false });

          describe('Базовый рендеринг', () => {
            it('должен рендерить профиль пользователя', () => {
              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );

              cy.findByTestId(userProfileTestIds.card).should('exist');
              cy.findByTestId(userProfileTestIds.name).should('contain.text', 'John Doe');
              cy.findByTestId(userProfileTestIds.email).should('contain.text', 'john@example.com');
              cy.findByTestId(userProfileTestIds.editButton).should('be.visible');
            });

            it('должен блокировать редактирование при отсутствии прав', () => {
              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithoutPermissions
              );

              cy.findByTestId(userProfileTestIds.editButton).should('not.exist');
            });
          });

          describe('Пользовательские взаимодействия', () => {
            beforeEach(() => {
              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );
            });

            it('должен переходить в режим редактирования при клике', () => {
              cy.findByTestId(userProfileTestIds.editButton).click();

              cy.findByTestId(userProfileTestIds.saveButton).should('be.visible');
              cy.findByTestId(userProfileTestIds.cancelButton).should('be.visible');
            });

            it('должен сохранять изменения при клике на кнопку сохранения', () => {
              const newName = 'Jane Smith';

              cy.findByTestId(userProfileTestIds.editButton).click();
              cy.findByTestId(userProfileTestIds.name)
                .clear()
                .type(newName);
              cy.findByTestId(userProfileTestIds.saveButton).click();

              cy.get('@handleSave').should('have.been.calledWith', { name: newName });
            });
          });

          describe('Обработка клавиатуры', () => {
            beforeEach(() => {
              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );
              cy.findByTestId(userProfileTestIds.editButton).click();
            });

            it('должен сохранять по нажатию Enter', () => {
              cy.findByTestId(userProfileTestIds.name)
                .clear()
                .type('New Name{enter}');

              cy.get('@handleSave').should('have.been.called');
            });

            it('должен отменять по нажатию Escape', () => {
              cy.findByTestId(userProfileTestIds.name).type('{esc}');

              cy.findByTestId(userProfileTestIds.saveButton).should('not.exist');
              cy.findByTestId(userProfileTestIds.cancelButton).should('not.exist');
            });
          });

          describe('Граничные случаи', () => {
            it('должен обрабатывать очень длинные имена', () => {
              const longName = 'A'.repeat(500);

              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );

              cy.findByTestId(userProfileTestIds.editButton).click();
              cy.findByTestId(userProfileTestIds.name)
                .clear()
                .type(longName);
              cy.findByTestId(userProfileTestIds.saveButton).click();

              cy.get('@handleSave').should('have.been.calledWith', { name: longName });
            });

            it('должен обрабатывать специальные символы', () => {
              const specialName = 'Test & Name <script>alert("xss")</script>';

              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );

              cy.findByTestId(userProfileTestIds.editButton).click();
              cy.findByTestId(userProfileTestIds.name)
                .clear()
                .type(specialName);
              cy.findByTestId(userProfileTestIds.saveButton).click();

              cy.get('@handleSave').should('have.been.calledWith', { name: specialName });
            });
          });

          describe('Accessibility', () => {
            it('должен иметь правильные ARIA-атрибуты', () => {
              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );

              cy.findByTestId(userProfileTestIds.card)
                .should('have.attr', 'role', 'region')
                .and('have.attr', 'aria-label', 'User Profile');
            });

            it('должен быть доступен с клавиатуры', () => {
              cy.mountWithProviders(
                <UserProfileCard userId={mockUserId} />,
                stateWithPermissions
              );

              cy.findByTestId(userProfileTestIds.editButton)
                .focus()
                .should('have.focus')
                .type('{enter}');

              cy.findByTestId(userProfileTestIds.saveButton).should('be.visible');
            });
          });
        });
        ]]>
      </code-block>
    </example>

    <example id="api-mocks-test">
      <title>Тест с API моками</title>
      <description>Пример теста с мокированием API вызовов</description>

      <code-block language="typescript">
        <![CDATA[
        import { ApplicationState } from 'store';
        import WarrantyClaimForm from './WarrantyClaimForm';

        export const warrantyClaimTestIds = {
          form: 'warranty-claim-form',
          productSelect: 'warranty-claim-product-select',
          descriptionInput: 'warranty-claim-description-input',
          submitButton: 'warranty-claim-submit-button',
          loadingSpinner: 'warranty-claim-loading',
          successMessage: 'warranty-claim-success',
          errorMessage: 'warranty-claim-error',
        } as const;

        describe('WarrantyClaimForm', () => {
          // Мокирование API
          beforeEach(() => {
            cy.intercept('GET', '/api/products', {
              statusCode: 200,
              body: [
                { id: 'prod-1', name: 'Product 1' },
                { id: 'prod-2', name: 'Product 2' },
              ],
            }).as('getProducts');

            cy.intercept('POST', '/api/warranty-claims', {
              statusCode: 201,
              body: { id: 'wc-123', claimNumber: 'WC-2025-001' },
            }).as('createClaim');
          });

          describe('Создание гарантийной заявки', () => {
            it('должен успешно создавать заявку', () => {
              cy.mountWithProviders(<WarrantyClaimForm />);

              cy.wait('@getProducts');

              cy.findByTestId(warrantyClaimTestIds.productSelect).select('prod-1');
              cy.findByTestId(warrantyClaimTestIds.descriptionInput)
                .type('Product malfunction after 2 months of use');
              cy.findByTestId(warrantyClaimTestIds.submitButton).click();

              cy.wait('@createClaim').its('request.body').should('deep.equal', {
                productId: 'prod-1',
                description: 'Product malfunction after 2 months of use',
              });

              cy.findByTestId(warrantyClaimTestIds.successMessage)
                .should('contain.text', 'WC-2025-001');
            });
          });
        });
        ]]>
      </code-block>
    </example>
  </generated-code-section>

  <execution-workflow mandatory="true">
    <phase order="1" name="АНАЛИЗ КОМПОНЕНТА">
      <step order="1">
        <action>Чтение и анализ компонента</action>
      </step>
      <step order="2">
        <action>Определение пропсов, состояний и поведения</action>
      </step>
      <step order="3">
        <action>Идентификация пользовательских взаимодействий</action>
      </step>
    </phase>

    <phase order="2" name="ПЛАНИРОВАНИЕ ТЕСТОВЫХ СЦЕНАРИЕВ">
      <step order="1">
        <action>Определение критических тестовых случаев</action>
      </step>
      <step order="2">
        <action>Планирование пользовательских взаимодействий</action>
      </step>
      <step order="3">
        <action>Идентификация граничных случаев</action>
      </step>
    </phase>

    <phase order="3" name="СОЗДАНИЕ ЦЕНТРАЛИЗОВАННЫХ TEST ID">
      <step order="1">
        <action>Создание объекта с data-testid атрибутами</action>
      </step>
      <step order="2">
        <action>Группировка по функциональным блокам</action>
      </step>
      <step order="3">
        <action>Использование camelCase нотации</action>
      </step>
    </phase>

    <phase order="4" name="НАСТРОЙКА МОКОВ И ЗАВИСИМОСТЕЙ">
      <step order="1">
        <action>Мокирование хуков и API вызовов</action>
      </step>
      <step order="2">
        <action>Создание предустановленных состояний Redux</action>
      </step>
      <step order="3">
        <action>Настройка тестовых утилит</action>
      </step>
    </phase>

    <phase order="5" name="СОЗДАНИЕ ТЕСТОВЫХ СЦЕНАРИЕВ">
      <step order="1">
        <action>Базовый рендеринг компонента</action>
      </step>
      <step order="2">
        <action>Пользовательские взаимодействия</action>
      </step>
      <step order="3">
        <action>Обработка клавиатуры</action>
      </step>
      <step order="4">
        <action>Права доступа</action>
      </step>
      <step order="5">
        <action>Граничные случаи</action>
      </step>
      <step order="6">
        <action>Accessibility</action>
      </step>
    </phase>

    <phase order="6" name="ВАЛИДАЦИЯ И ОПТИМИЗАЦИЯ">
      <step order="1">
        <action>Проверка покрытия всех сценариев</action>
      </step>
      <step order="2">
        <action>Оптимизация производительности тестов</action>
      </step>
      <step order="3">
        <action>Проверка читаемости и поддерживаемости</action>
      </step>
    </phase>
  </execution-workflow>

  <deliverables-section mandatory="true">
    <deliverable order="1" priority="high">
      <name>Полные Cypress тесты</name>
      <description>с эталонной структурой</description>
    </deliverable>

    <deliverable order="2" priority="high">
      <name>Централизованные data-testid</name>
      <description>для устойчивых селекторов</description>
    </deliverable>

    <deliverable order="3" priority="high">
      <name>Алиасы</name>
      <description>для часто используемых элементов</description>
    </deliverable>

    <deliverable order="4" priority="high">
      <name>Мокирование зависимостей</name>
      <description>для изоляции тестов</description>
    </deliverable>

    <deliverable order="5" priority="high">
      <name>Тестирование всех сценариев</name>
      <description>включая граничные случаи</description>
    </deliverable>

    <deliverable order="6" priority="high">
      <name>Accessibility тесты</name>
      <description>для обеспечения доступности</description>
    </deliverable>

    <deliverable order="7" priority="medium">
      <name>Интеграция с Redux</name>
      <description>для тестирования состояния</description>
    </deliverable>

    <deliverable order="8" priority="medium">
      <name>API моки</name>
      <description>для тестирования сетевых взаимодействий</description>
    </deliverable>
  </deliverables-section>
</command-definition>
