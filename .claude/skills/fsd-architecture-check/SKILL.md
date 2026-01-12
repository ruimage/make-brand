---
name: fsd-architecture-check
description: "Проверяет структуру проекта на соответствие Feature-Sliced Design архитектуре, обнаруживает нарушения импортов между слоями и генерирует детальный отчет с рекомендациями"
allowed-tools: ["Glob", "Grep", "Read", "Bash"]
argument-hint: "[<directory>]"
ultrathink: true
---

<skill-definition>
  <metadata-section>
    <name>fsd-architecture-check</name>
    <category>architecture-validation</category>
    <version>1.0</version>
    <triggers>FSD, architecture, check structure, validate imports, layer violation, Feature-Sliced Design</triggers>
    <description>
      Проверяет структуру проекта на соответствие Feature-Sliced Design архитектуре,
      обнаруживает нарушения импортов между слоями и генерирует детальный отчет с рекомендациями.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Проанализировать проект на соответствие FSD архитектуре, найти нарушения импортов,
      проверить наличие public API и создать отчет с рекомендациями.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="target-detection" mandatory="true">
      <title>Определение целевой директории</title>
      <instructions>
        <instruction order="1">Если указан путь в запросе — использовать его</instruction>
        <instruction order="2">Если не указан — использовать текущую рабочую директорию (src/ или текущую директорию)</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="2" name="layer-discovery" mandatory="true">
      <title>Обнаружение FSD слоев</title>
      <instructions>
        <instruction order="1">Использовать Glob для поиска слоев: pattern {directory}/**/</instruction>
        <instruction order="2">Искать: app, pages, widgets, features, entities, shared, processes</instruction>
        <instruction order="3">Проверить наличие обязательных слоев (минимум: features, entities, shared)</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="3" name="structural-analysis" mandatory="true">
      <title>Структурный анализ</title>
      <instructions>
        <instruction order="1">Для entities/features проверить структуру: api/, model/, ui/, index.ts</instruction>
        <instruction order="2">Для shared проверить: ui/, lib/, api/, index.ts</instruction>
        <instruction order="3">Проверить наличие index.ts в public API</instruction>
      </instructions>
      <structure-template>
        <entity-structure>
          <![CDATA[
          {entity-name}/
          ├── api/          # RTK Query endpoints
          ├── model/        # Types, slices, selectors
          ├── ui/           # UI components
          └── index.ts      # Public API (обязателен!)
          ]]>
        </entity-structure>
      </structure-template>
    </instruction-group>

    <instruction-group order="4" name="import-violations" mandatory="true">
      <title>Обнаружение нарушений импортов</title>
      <instructions>
        <instruction order="1" priority="critical">Импорты из верхних слоев</instruction>
        <instruction order="2" priority="high">Импорты внутри одного слоя (только внутри одного slice)</instruction>
        <instruction order="3" priority="medium">Относительные импорты (предпочтительнее абсолютные)</instruction>
      </instructions>
      <rules>
        <rule>entities НЕ может импортировать из pages, widgets, features, app</rule>
        <rule>features НЕ может импортировать из pages, widgets, app</rule>
        <rule>widgets НЕ может импортировать из pages, app</rule>
      </rules>
      <grep-patterns>
        <pattern>from ['"](pages|widgets|features|entities|shared)/</pattern>
        <pattern>from ['"]features/[^/]+/.*['"] в файлах features/</pattern>
        <pattern>from ['"]\.\./.*['"]</pattern>
      </grep-patterns>
    </instruction-group>

    <instruction-group order="5" name="public-api-validation">
      <title>Валидация Public API</title>
      <instructions>
        <instruction order="1">Glob: {directory}/features/*/index.ts</instruction>
        <instruction order="2">Glob: {directory}/entities/*/index.ts</instruction>
        <instruction order="3">Read: проверить содержимое index.ts</instruction>
        <instruction order="4">Должен быть реэкспорт (export * from './ui'), не имплементация</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="6" name="report-generation" mandatory="true">
      <title>Генерация отчета</title>
      <instructions>
        <instruction order="1">Сформировать markdown отчет с детальной структурой</instruction>
        <instruction order="2">Классифицировать нарушения (structural, imports, public API)</instruction>
        <instruction order="3">Предоставить рекомендации для каждого нарушения</instruction>
        <instruction order="4">Добавить статистику (файлов сканировано, нарушений, покрытие public API)</instruction>
      </instructions>
    </instruction-group>
  </instructions-section>

  <workflow-section mandatory="true">
    <phase order="1" name="detection">
      <step>Определить целевую директорию</step>
    </phase>
    <phase order="2" name="discovery">
      <step>Glob: найти все FSD слои</step>
    </phase>
    <phase order="3" name="analysis">
      <step>Проверить внутреннюю структуру каждого слоя</step>
    </phase>
    <phase order="4" name="violation-check">
      <step>Grep: найти нарушения импортов</step>
    </phase>
    <phase order="5" name="api-check">
      <step>Glob + Read: проверить наличие и содержимое index.ts</step>
    </phase>
    <phase order="6" name="eslint-optional">
      <step>Bash: npx eslint с архитектурными правилами (опционально)</step>
    </phase>
    <phase order="7" name="report">
      <step>Сгенерировать markdown отчет</step>
    </phase>
  </workflow-section>

  <output-format-section mandatory="true">
    <format>Markdown отчет</format>
    <structure>
      <section order="1">Сводка проверки (overall status)</section>
      <section order="2">Классификация нарушений (structural, imports, public API)</section>
      <section order="3">Детализация каждого нарушения (файл, строка, проблема)</section>
      <section order="4">Рекомендации по исправлению</section>
      <section order="5">Статистика (количество нарушений, покрытие public API)</section>
    </structure>
    <template>
      <![CDATA[
      # FSD Architecture Check Report

      **Target Directory:** `{directory}`
      **Status:** {✅ Compliant | ⚠️ Issues Found | ❌ Critical Issues}

      ## Structural Issues
      ### 1. Missing index.ts
      - **Location:** `src/features/auth`
      - **Fix:** Create `index.ts` with re-exports

      ## Import Violations
      ### 1. Feature importing from Widget
      - **File:** `src/features/auth/ui/LoginForm.tsx:12`
      - **Import:** `import { Header } from 'widgets/header'`
      - **Issue:** Feature cannot import from Widget layer
      - **Fix:** Pass Header as prop or move to shared

      **Statistics:**
      - Files scanned: {count}
      - Layers found: {app, pages, widgets, features, entities, shared}
      - Violations: {count}
      - Public API coverage: {percentage}%
      ]]>
    </template>
  </output-format-section>

  <examples-section>
    <example id="1">
      <scenario>Пользователь: "Проверь архитектуру проекта"</scenario>
      <action>Запустить анализ для src/</action>
      <output>Полный отчет с найденными нарушениями</output>
    </example>
    <example id="2">
      <scenario>Пользователь: "Проверь features слой на соответствие FSD"</scenario>
      <action>Запустить анализ для src/features</action>
      <output>Отчет по features слою</output>
    </example>
    <example id="3">
      <scenario>Пользователь: "Найди нарушения импортов в entities"</scenario>
      <action>Найти импорты из верхних слоев в entities</action>
      <output>Список файлов с нарушениями и рекомендациями</output>
    </example>
  </examples-section>

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Все FSD слои обнаружены и проанализированы</criterion>
      <criterion order="2" priority="critical">Нарушения импортов найдены и классифицированы</criterion>
      <criterion order="3" priority="high">Public API проверен на наличие index.ts</criterion>
      <criterion order="4" priority="high">Отчет сгенерирован в формате markdown</criterion>
      <criterion order="5" priority="medium">Рекомендации по исправлению предоставлены</criterion>
    </success-criteria>
  </validation-section>

  <error-handling-section>
    <error condition="Директория не существует">
      <action>Сообщить об ошибке, прекратить выполнение</action>
    </error>
    <error condition="FSD структура не найдена">
      <action>Сообщить, предложить создать базовую структуру</action>
    </error>
    <error condition="Нет прав на чтение">
      <action>Сообщить о проблеме с правами доступа</action>
    </error>
  </error-handling-section>
</skill-definition>
