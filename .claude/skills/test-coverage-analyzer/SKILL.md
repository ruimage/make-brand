---
name: test-coverage-analyzer
description: "Анализирует покрытие тестами в проекте, проверяет соответствие testing pyramid (50% unit, 30% integration, 15% component, 5% e2e) и предоставляет рекомендации"
allowed-tools: ["Glob", "Grep", "Bash", "Read"]
argument-hint: "[<directory>]"
ultrathink: true
---

<skill-definition>
  <metadata-section>
    <name>test-coverage-analyzer</name>
    <category>testing-coverage</category>
    <version>1.0</version>
    <triggers>test coverage, покрытие тестами, testing pyramid, Vitest, Cypress, analyze tests</triggers>
    <description>
      Анализирует покрытие тестами в проекте, проверяет соответствие testing pyramid
      (50% unit, 30% integration, 15% component, 5% e2e) и предоставляет рекомендации по улучшению.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Проанализировать покрытие тестами, проверить баланс testing pyramid,
      найти файлы без тестов и предоставить приоритизированные рекомендации.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="discover-tests" mandatory="true">
      <title>Обнаружение всех тестов</title>
      <instructions>
        <instruction order="1">Glob: **/*.test.ts, **/*.test.tsx (Unit Tests)</instruction>
        <instruction order="2">Glob: **/*.integration.test.ts (Integration Tests)</instruction>
        <instruction order="3">Glob: **/*.cy.tsx, **/*.cy.ts (Component Tests)</instruction>
        <instruction order="4">Glob: cypress/e2e/**/*.cy.ts (E2E Tests)</instruction>
        <instruction order="5">Подсчитать количество тестов каждой категории</instruction>
      </instructions>
      <exclusions>
        <exclusion>node_modules/**</exclusion>
        <exclusion>dist/**</exclusion>
        <exclusion>**/*.integration.test.ts из unit тестов</exclusion>
      </exclusions>
    </instruction-group>

    <instruction-group order="2" name="find-source-files" mandatory="true">
      <title>Поиск исходных файлов</title>
      <instructions>
        <instruction order="1">Glob: src/**/*.ts, src/**/*.tsx</instruction>
        <instruction order="2">Исключить тестовые файлы</instruction>
        <instruction order="3">Исключить **/types.ts (если только типы)</instruction>
        <instruction order="4">Исключить **/index.ts (если только реэкспорты)</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="3" name="find-uncovered" mandatory="true">
      <title>Поиск файлов без тестов</title>
      <instructions>
        <instruction order="1">Для каждого исходного файла проверить наличие test файла</instruction>
        <instruction order="2">Проверить: {file}.test.ts, {file}.test.tsx, {file}.cy.tsx</instruction>
        <instruction order="3">Если тест не найден — добавить в список</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="4" name="classify-files" mandatory="true">
      <title>Классификация исходных файлов</title>
      <instructions>
        <instruction order="1">Классифицировать файлы по типам для рекомендаций</instruction>
      </instructions>
      <classifications>
        <classification type="UI компоненты (*.tsx в ui/, components/)">Component tests (Cypress)</classification>
        <classification type="Утилиты, чистые функции (lib/, utils/)">Unit tests (Vitest)</classification>
        <classification type="Хуки (hooks/, use*.ts)">Unit tests (Vitest)</classification>
        <classification type="Redux slices (model/slice.ts)">Integration tests (Vitest)</classification>
        <classification type="API endpoints (api/*.ts)">Integration tests (Vitest)</classification>
        <classification type="Селекторы (model/selectors.ts)">Unit tests (Vitest)</classification>
        <classification type="Pages, widgets">E2E tests (Cypress)</classification>
      </classifications>
    </instruction-group>

    <instruction-group order="5" name="run-coverage">
      <title>Запуск coverage анализа</title>
      <instructions>
        <instruction order="1">Bash: vitest run --coverage</instruction>
        <instruction order="2">Парсить вывод для получения метрик</instruction>
        <instruction order="3">Если не работает — попробовать npm run test:coverage</instruction>
      </instructions>
      <metrics>
        <metric>Lines Coverage %</metric>
        <metric>Functions Coverage %</metric>
        <metric>Branches Coverage %</metric>
        <metric>Statements Coverage %</metric>
      </metrics>
    </instruction-group>

    <instruction-group order="6" name="find-low-coverage">
      <title>Поиск файлов с низким покрытием</title>
      <instructions>
        <instruction order="1">Найти покрытие < 80% (warning)</instruction>
        <instruction order="2">Найти покрытие < 50% (critical)</instruction>
        <instruction order="3">Найти покрытие 0% (no tests)</instruction>
        <instruction order="4">Сортировать по критичности</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="7" name="analyze-pyramid" mandatory="true">
      <title>Анализ Testing Pyramid</title>
      <instructions>
        <instruction order="1">Подсчитать процент тестов по категориям</instruction>
        <instruction order="2">Сравнить с идеальной пирамидой</instruction>
        <instruction order="3">Найти дисбаланс</instruction>
      </instructions>
      <ideal-pyramid>
        <level type="Unit" percentage="50" tolerance="10"/>
        <level type="Integration" percentage="30" tolerance="10"/>
        <level type="Component" percentage="15" tolerance="10"/>
        <level type="E2E" percentage="5" tolerance="5"/>
      </ideal-pyramid>
      <imbalances>
        <imbalance condition="E2E > 10%">
          <issue>Слишком много E2E тестов</issue>
          <recommendation>Переместить сценарии в component/integration тесты</recommendation>
        </imbalance>
        <imbalance condition="Unit < 30%">
          <issue>Слишком мало unit тестов</issue>
          <recommendation>Добавить unit тесты для утилит, хуков, селекторов</recommendation>
        </imbalance>
        <imbalance condition="Integration > 50%">
          <issue>Слишком много integration тестов</issue>
          <recommendation>Выделить чистые функции для unit тестирования</recommendation>
        </imbalance>
        <imbalance condition="Component = 0%">
          <issue>Нет component тестов</issue>
          <recommendation>Добавить Cypress component тесты для UI</recommendation>
        </imbalance>
      </imbalances>
    </instruction-group>

    <instruction-group order="8" name="generate-report" mandatory="true">
      <title>Генерация отчета</title>
      <instructions>
        <instruction order="1">Создать markdown отчет с executive summary</instruction>
        <instruction order="2">Добавить таблицу testing pyramid balance</instruction>
        <instruction order="3">Перечислить файлы без тестов по приоритету</instruction>
        <instruction order="4">Предоставить приоритизированные рекомендации</instruction>
      </instructions>
    </instruction-group>
  </instructions-section>

  <workflow-section mandatory="true">
    <phase order="1" name="discover">
      <step>Glob: найти все тесты (unit, integration, component, E2E)</step>
    </phase>
    <phase order="2" name="source">
      <step>Glob: найти все исходные файлы</step>
    </phase>
    <phase order="3" name="uncovered">
      <step>Найти файлы без тестов</step>
    </phase>
    <phase order="4" name="classify">
      <step>Классифицировать файлы по типам</step>
    </phase>
    <phase order="5" name="coverage">
      <step>Bash: запустить coverage анализ</step>
    </phase>
    <phase order="6" name="pyramid">
      <step>Подсчитать проценты по категориям</step>
    </phase>
    <phase order="7" name="report">
      <step>Сгенерировать полный отчет</step>
    </phase>
  </workflow-section>

  <output-format-section mandatory="true">
    <format>Markdown отчет</format>
    <structure>
      <section order="1">Executive Summary с таблицей метрик</section>
      <section order="2">Testing Pyramid Balance</section>
      <section order="3">Files Without Tests (Critical)</section>
      <section order="4">Recommendations by Priority</section>
      <section order="5">Metrics Summary</section>
    </structure>
    <template>
      <![CDATA[
      # Test Coverage Analysis Report

      **Target Directory:** `src/`
      **Generated:** {date}

      ## Executive Summary

      | Metric | Value | Target | Status |
      |--------|-------|--------|--------|
      | Lines Coverage | 72.4% | ≥80% | ⚠️ Fair |
      | Functions Coverage | 68.1% | ≥80% | ⚠️ Fair |
      | Branches Coverage | 61.3% | ≥80% | ❌ Poor |
      | Statements Coverage | 73.8% | ≥80% | ⚠️ Fair |

      ## Testing Pyramid Balance

      | Type | Count | Percentage | Target | Status |
      |------|-------|------------|--------|--------|
      | Unit | 45 | 30% | 50% | ⚠️ Low |
      | Integration | 42 | 28% | 30% | ✅ Good |
      | Component | 18 | 12% | 15% | ⚠️ Low |
      | E2E | 45 | 30% | 5% | ❌ High |

      ## Files Without Tests (Critical)

      ### 🚨 Critical Business Logic (0% coverage)
      1. **src/entities/order/lib/calculateOrderTotal.ts**
         - Contains complex order calculation logic
         - **Recommendation:** Add unit tests immediately
      ]]>
    </template>
  </output-format-section>

  <examples-section>
    <example id="1">
      <scenario>"Проанализируй покрытие тестами в проекте"</scenario>
      <actions>
        <action order="1">Найти все тесты (unit, integration, component, E2E)</action>
        <action order="2">Подсчитать проценты по категориям</action>
        <action order="3">Сравнить с testing pyramid</action>
        <action order="4">Найти файлы без тестов</action>
        <action order="5">Запустить coverage анализ</action>
        <action order="6">Создать полный отчет</action>
      </actions>
    </example>
    <example id="2">
      <scenario>"Найди файлы без тестов в entities"</scenario>
      <actions>
        <action order="1">Найти все файлы в entities/</action>
        <action order="2">Проверить наличие соответствующих test файлов</action>
        <action order="3">Классифицировать по типам</action>
        <action order="4">Рекомендовать тип тестов</action>
      </actions>
    </example>
    <example id="3">
      <scenario>"Проверь баланс testing pyramid"</scenario>
      <actions>
        <action order="1">Подсчитать количество тестов по категориям</action>
        <action order="2">Вычислить проценты</action>
        <action order="3">Сравнить с идеальной пирамидой</action>
        <action order="4">Найти дисбаланс</action>
        <action order="5">Предоставить рекомендации</action>
      </actions>
    </example>
  </examples-section>

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Все тесты найдены и классифицированы</criterion>
      <criterion order="2" priority="critical">Покрытие проанализировано</criterion>
      <criterion order="3" priority="high">Testing pyramid проанализирован</criterion>
      <criterion order="4" priority="high">Файлы без тестов найдены</criterion>
      <criterion order="5" priority="medium">Приоритизированные рекомендации предоставлены</criterion>
    </success-criteria>
  </validation-section>
</skill-definition>
