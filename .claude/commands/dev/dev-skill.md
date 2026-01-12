---
description: "Интерактивное создание новых команд/skills для Claude Code CLI с XML-структурированным содержимым в режиме ultrathink"
allowed-tools: ["Read", "Write", "Edit"]
argument-hint: "<без аргументов - интерактивный режим>"
ultrathink: true
---

<!-- ═══════════════════════════════════════════════════════════════
     CREATE-SKILL COMMAND - XML STRUCTURED DEFINITION
     Генератор новых команд/skills для Claude Code CLI
     Режим: ULTRATHINK (глубокий анализ каждого элемента)
═══════════════════════════════════════════════════════════════ -->

<command-definition>
  <metadata-section>
    <name>/create-skill</name>
    <description>
      Интерактивный генератор новых команд и skills для Claude Code CLI.
      Создает .md файлы с YAML frontmatter и XML-структурированным содержимым
      в режиме глубокого анализа (ultrathink).
    </description>
    <version>1.0</version>
    <tags>skill-generator, command-creator, ultrathink, xml-structure</tags>
    <requirements-source>commands/plain-to-xml.md</requirements-source>
  </metadata-section>

  <!-- ═══════════════════════════════════════════════════════════
       ОСНОВНАЯ МИССИЯ
       ══════════════════════════════════════════════════════════ -->

  <mission-section mandatory="true">
    <objective>
      Создать полноценную команду/skill для Claude Code CLI через интерактивный диалог.
      Результат: готовый к использованию .md файл с YAML frontmatter + XML контентом.
    </objective>

    <execution-mode>
      <mode>ULTRATHINK</mode>
      <description>
        **КРИТИЧЕСКИ ВАЖНО:** Команда работает в режиме глубокого анализа:
        1. Тщательный анализ каждого элемента перед генерацией
        2. Проверка множественных вариантов структур
        3. Валидация на каждом этапе
        4. Финальная проверка перед сохранением
        5. Автоматическое сохранение без запроса подтверждения
      </description>
    </execution-mode>

    <output-format>
      <extension>.md</extension>
      <structure>YAML frontmatter + XML content</structure>
      <location>~/.claude/commands/ или ~/.claude/skills/</location>
    </output-format>
  </mission-section>

  <!-- ═══════════════════════════════════════════════════════════
       ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ (из Context7)
       ══════════════════════════════════════════════════════════ -->

  <technical-requirements mandatory="true">
    <requirement order="1" priority="critical" source="/anthropics/claude-code">
      <name>YAML Frontmatter Structure</name>
      <specification>
        <![CDATA[
        ---
        description: "краткое описание команды"
        allowed-tools: ["Read", "Write", "Edit"]
        argument-hint: "<param1> [param2]"
        ultrathink: true
        ---
        ]]>
      </specification>
      <field-descriptions>
        <field name="description">Краткое описание функциональности (обязательно)</field>
        <field name="allowed-tools">Список разрешенных инструментов (массив или строка)</field>
        <field name="argument-hint">Подсказка для аргументов команды в формате <required> [optional]</field>
        <field name="model">Опционально: sonnet, haiku, opus</field>
        <field name="ultrathink">Режим глубокого анализа (true/false)</field>
      </field-descriptions>
      <examples>
        <example>
          <![CDATA[
          allowed-tools: Read, Write
          ]]>
        </example>
        <example>
          <![CDATA[
          allowed-tools: ["Read", "Write", "Bash(git:*)"]
          ]]>
        </example>
      </examples>
    </requirement>

    <requirement order="2" priority="critical" source="/dair-ai/prompt-engineering-guide, /microsoft/poml">
      <name>XML Content Structure</name>
      <specification>
        Использовать иерархическую XML структуру согласно plain-to-xml.md:
        - Глубина вложенности: 3-5 уровней
        - Семантические теги (<instructions-section>, <workflow-section>)
        - Атрибуты для метаданных (order, mandatory, priority)
        - CDATA для code blocks
        - Самодокументируемая структура
      </specification>
      <structure-template>
        <level-1><command-definition></level-1>
        <level-2>  <metadata-section></level-2>
        <level-2>  <mission-section></level-2>
        <level-2>  <instructions-section></level-2>
        <level-3>    <instruction-group></level-3>
        <level-4>      <instruction></level-4>
        <level-2>  <workflow-section></level-2>
        <level-3>    <step></level-3>
        <level-2>  <examples-section></level-2>
        <level-2>  <validation-section></level-2>
      </structure-template>
    </requirement>

    <requirement order="3" priority="high">
      <name>Auto-Save Functionality</name>
      <specification>
        - НЕ спрашивать подтверждения "Сохранить?"
        - Автоматически использовать Write tool
        - Подтвердить путь и статус после сохранения
        - Сохранять как .md файл (НЕ .xml!)
      </specification>
    </requirement>
  </technical-requirements>

  <!-- ═══════════════════════════════════════════════════════════
       ИНТЕРАКТИВНЫЙ WORKFLOW
       ══════════════════════════════════════════════════════════ -->

  <workflow-section mandatory="true">
    <title>Процесс создания нового skill</title>

    <phase order="1" name="INITIALIZATION" mandatory="true">
      <description>Запуск команды и приветствие</description>
      <actions>
        <action order="1">Показать приветственное сообщение</action>
        <action order="2">Объяснить процесс создания</action>
        <action order="3">Начать интерактивный сбор требований</action>
      </actions>
    </phase>

    <phase order="2" name="REQUIREMENTS_COLLECTION" mandatory="true">
      <description>Интерактивный сбор требований от пользователя</description>
      <questions>
        <question order="1" required="true">
          <prompt>**Какое имя команды?** (например: analyze-code, deploy-app)</prompt>
          <format>без слеша, lowercase-with-hyphens</format>
          <example>analyze-code</example>
        </question>

        <question order="2" required="true">
          <prompt>**Краткое описание:** (1-2 предложения о функциональности)</prompt>
          <example>Анализирует код на соответствие best practices и генерирует отчет</example>
        </question>

        <question order="3" required="true">
          <prompt>**Какие инструменты нужны?** (выберите или укажите свои)</prompt>
          <options>
            <option value="Read">Read - чтение файлов</option>
            <option value="Write">Write - создание файлов</option>
            <option value="Edit">Edit - редактирование файлов</option>
            <option value="Grep">Grep - поиск по содержимому</option>
            <option value="Glob">Glob - поиск файлов по паттерну</option>
            <option value="Bash">Bash - выполнение команд</option>
            <option value="Task">Task - вызов агентов</option>
          </options>
        </question>

        <question order="4">
          <prompt>**Нужны ли аргументы команды?** Если да, укажите формат:</prompt>
          <format>&lt;required&gt; [optional]</format>
          <example>[file-path] [output-format]</example>
        </question>

        <question order="5" required="true">
          <prompt>**Опишите основной функционал:** (основные шаги выполнения)</prompt>
          <guidance>Перечислите ключевые действия, которые должна выполнять команда</guideline>
          <example>
            1. Прочитать указанный файл
            2. Проанализировать структуру кода
            3. Найти потенциальные проблемы
            4. Сгенерировать отчет с рекомендациями
          </example>
        </question>

        <question order="6">
          <prompt>**Нужны ли примеры использования?** (опционально)</prompt>
          <type>multiple examples</type>
        </question>

        <question order="7">
          <prompt>**Дополнительные требования или ограничения:**</prompt>
          <type>free text</type>
        </question>
      </questions>
    </phase>

    <phase order="3" name="FRONTMATTER_GENERATION" mandatory="true">
      <description>Генерация YAML frontmatter на основе ответов</description>
      <template>
        <![CDATA[
        ---
        description: "{description}"
        allowed-tools: {tools}
        argument-hint: "{arguments}"
        ultrathink: true
        ---
        ]]>
      </template>
      <mapping>
        <field name="description">из вопроса #2</field>
        <field name="allowed-tools">из вопроса #3 (массив)</field>
        <field name="argument-hint">из вопроса #4 (пустая строка если нет)</field>
      </mapping>
    </phase>

    <phase order="4" name="XML_CONTENT_GENERATION" mandatory="true" priority="critical">
      <description>Генерация XML-структурированного контента (ULTRATHINK MODE)</description>
      <analysis-steps>
        <step order="1">Проанализировать функционал из ответа #5</step>
        <step order="2">Определить необходимые XML секции</step>
        <step order="3">Создать иерархическую структуру (3-5 уровней)</step>
        <step order="4">Применить семантические теги</step>
        <step order="5">Добавить атрибуты (order, mandatory, priority)</step>
        <step order="6">Обернуть code blocks в CDATA</step>
        <step order="7">Добавить примеры из ответа #6</step>
        <step order="8">Учесть ограничения из ответа #7</step>
      </analysis-steps>

      <required-sections>
        <section order="1" mandatory="true"><command-definition> - корневой элемент</section>
        <section order="2" mandatory="true"><metadata-section> - метаданные команды</section>
        <section order="3" mandatory="true"><mission-section> - цель и режим работы</section>
        <section order="4" mandatory="true"><instructions-section> - инструкции для Claude</section>
        <section order="5" mandatory="true"><workflow-section> - пошаговый алгоритм</section>
        <section order="6"><examples-section> - примеры использования</section>
        <section order="7" mandatory="true"><validation-section> - критерии успеха</section>
      </required-sections>

      <xml-structure-rules>
        <rule priority="critical">Использовать semantic tag names (<instruction>, а не <p>)</rule>
        <rule priority="critical">CDATA для всех code blocks</rule>
        <rule priority="high">Атрибуты order для последовательности</rule>
        <rule priority="high">Атрибуты mandatory для обязательности</rule>
        <rule priority="medium">Глубина вложенности 3-5 уровней</rule>
        <rule priority="medium">comments для сложных секций</rule>
      </xml-structure-rules>
    </phase>

    <phase order="5" name="VALIDATION" mandatory="true">
      <description>Валидация созданного контента</description>
      <checks>
        <check id="1" priority="critical">
          <name>Frontmatter Validation</name>
          <validate>
            <item>YAML syntax корректен ✓</item>
            <item>description присутствует ✓</item>
            <item>allowed-tools в правильном формате ✓</item>
            <item>argument-hint соответствует формату ✓</item>
          </validate>
        </check>

        <check id="2" priority="critical">
          <name>XML Well-Formedness</name>
          <validate>
            <item>Все теги закрыты ✓</item>
            <item>Правильная вложенность ✓</item>
            <item>CDATA корректно оформлен ✓</item>
            <item>Атрибуты в кавычках ✓</item>
          </validate>
        </check>

        <check id="3" priority="high">
          <name>Content Completeness</name>
          <validate>
            <item>Все требования пользователя учтены ✓</item>
            <item>Функционал полностью описан ✓</item>
            <item>Примеры включены (если указаны) ✓</item>
            <item>Ограничения отражены ✓</item>
          </validate>
        </check>

        <check id="4" priority="high">
          <name>Structure Quality</name>
          <validate>
            <item>Глубина вложенности 3-5 уровней ✓</item>
            <item>Семантические имена тегов ✓</item>
            <item>Атрибуты используются ✓</item>
            <item>Самодокументируемая структура ✓</item>
          </validate>
        </check>

        <check id="5" priority="medium">
          <name>LLM-Friendliness</name>
          <validate>
            <item>Явные инструкции ✓</item>
            <item>Логическая организация ✓</item>
            <item>Метаданные для фильтрации ✓</item>
          </validate>
        </check>
      </checks>

      <error-handling>
        <on-error>Вернуться к фазе генерации и исправить</on-error>
        <max-retries>3</max-retries>
      </error-handling>
    </phase>

    <phase order="6" name="AUTO_SAVE" mandatory="true" priority="critical">
      <description>Автоматическое сохранение в файл</description>
      <steps>
        <step order="1">Сформировать путь: ~/.claude/commands/{command-name}.md</step>
        <step order="2">Использовать Write tool для сохранения</step>
        <step order="3">Подтвердить успешное сохранение</step>
      </steps>

      <file-structure>
        <![CDATA[
        Line 1: --- (frontmatter start)
        Line 2-N: YAML frontmatter content
        Line N+1: --- (frontmatter end)
        Line N+2: (empty)
        Line N+3-end: XML structured content
        ]]>
      </file-structure>

      <mandatory-note>
        **КРИТИЧЕСКИ:** НЕ спрашивать "Сохранить в файл?"
        - Автоматически сохранить результат
        - Подтвердить путь и статус
        - Предложить резервную копию только если нужно
      </mandatory-note>
    </phase>

    <phase order="7" name="CONFIRMATION" mandatory="true">
      <description>Финальное подтверждение</description>
      <message-template>
        <![CDATA[
        ✅ **Skill успешно создан!**

        **Путь:** `~/.claude/commands/{command-name}.md`
        **Формат:** YAML frontmatter + XML content
        **Режим:** Ultrathink

        **Используйте команду:**
        ```
        /{command-name} [arguments]
        ```

        **Статус валидации:**
        - Frontmatter: ✓
        - XML structure: ✓
        - Content completeness: ✓
        - Ready to use: ✓

        Хотите создать дополнительный резервный файл?
        ]]>
      </message-template>
    </phase>
  </workflow-section>

  <!-- ═══════════════════════════════════════════════════════════
       ПРИМЕР СОЗДАВАЕМОЙ СТРУКТУРЫ
       ══════════════════════════════════════════════════════════ -->

  <output-template-section>
    <title>Шаблон создаваемого файла</title>

    <template format="markdown-with-xml">
      <example>
        <![CDATA[
        ---
        description: "Анализ кода на best practices"
        allowed-tools: ["Read", "Grep"]
        argument-hint: "<file-path>"
        ultrathink: true
        ---

        <command-definition>
          <metadata-section>
            <name>/analyze-code</name>
            <description>Анализирует код на соответствие best practices</description>
          </metadata-section>

          <mission-section>
            <objective>Проанализировать код и предоставить рекомендации</objective>
          </mission-section>

          <instructions-section>
            <instruction-group order="1" mandatory="true">
              <instruction>Прочитать файл по пути $1</instruction>
            </instruction-group>

            <workflow-section>
              <step order="1">Read file from $1</step>
              <step order="2">Analyze code patterns</step>
              <step order="3">Generate report</step>
            </workflow-section>
          </instructions-section>

          <validation-section>
            <success-criteria>
              <criterion>File exists</criterion>
              <criterion>Analysis complete</criterion>
            </success-criteria>
          </validation-section>
        </command-definition>
        ]]>
      </example>
    </template>
  </output-template-section>

  <!-- ═══════════════════════════════════════════════════════════
       ВИЗУАЛЬНЫЕ ДИАГРАММЫ (для понимания процесса)
       ══════════════════════════════════════════════════════════ -->

  <visual-diagrams-section>
    <diagram id="1" type="architecture">
      <title>Архитектура команды /create-skill</title>
      <format>ASCII art</format>
      <content>
        <![CDATA[
        ┌─────────────────────────────────────────────────────────────┐
        │                    /create-skill COMMAND                    │
        ├─────────────────────────────────────────────────────────────┤
        │                                                               │
        │  USER INPUT                                                  │
        │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
        │  │   Q&A        │───▶│  RESPONSES   │───▶│ FRONTMATTER  │   │
        │  │   DIALOG     │    │  COLLECTION  │    │  GENERATOR   │   │
        │  └──────────────┘    └──────────────┘    └──────────────┘   │
        │                                                      │        │
        │                                              ULTRATHINK     │
        │                                                      ▼        │
        │                                               ┌──────────────┐│
        │                                               │     XML      ││
        │                                               │  STRUCTURE   ││
        │                                               │  GENERATOR   ││
        │                                               └──────────────┘│
        │                                                      │        │
        │                                                      ▼        │
        │                                               ┌──────────────┐│
        │                                               │  VALIDATION  ││
        │                                               │    ENGINE    ││
        │                                               └──────────────┘│
        │                                                      │        │
        │                                                      ▼        │
        │                                               ┌──────────────┐│
        │                                               │   AUTO-SAVE  ││
        │                                               │   TO .MD     ││
        │                                               └──────────────┘│
        │                                                               │
        └─────────────────────────────────────────────────────────────┘
        ]]>
      </content>
    </diagram>

    <diagram id="2" type="flow">
      <title>Поток данных (Data Flow)</title>
      <format>Mermaid graph TD</format>
      <content>
        <![CDATA[
        graph TD
          A[Start: /create-skill] --> B[Welcome Message]
          B --> C[Question 1: Command Name]
          C --> D[Question 2: Description]
          D --> E[Question 3: Tools]
          E --> F[Question 4: Arguments]
          F --> G[Question 5: Functionality]
          G --> H[Question 6: Examples]
          H --> I[Question 7: Constraints]
          I --> J[Generate Frontmatter]
          J --> K{ULTRATHINK MODE}
          K --> L[Analyze Requirements]
          L --> M[Create XML Structure]
          M --> N[Apply Semantic Tags]
          N --> O[Add Attributes]
          O --> P[Wrap Code in CDATA]
          P --> Q[Validation Check]
          Q -->|Pass| R[AUTO-SAVE to .md]
          Q -->|Fail| L
          R --> S[Confirm Success]
          S --> T[End: Ready to Use]

          style K fill:#f9f,stroke:#333,stroke-width:4px
          style M fill:#bbf,stroke:#333,stroke-width:4px
          style R fill:#bfb,stroke:#333,stroke-width:4px
        ]]>
      </content>
    </diagram>

    <diagram id="3" type="file-structure">
      <title>Структура создаваемого файла</title>
      <format>ASCII tree</format>
      <content>
        <![CDATA[
        ~/.claude/commands/{command-name}.md
        │
        ├── YAML Frontmatter (lines 1-N)
        │   ├── description: "..."
        │   ├── allowed-tools: [...]
        │   ├── argument-hint: "..."
        │   └── ultrathink: true
        │
        └── XML Content (lines N+2-end)
            ├── <command-definition>
            │   │
            │   ├── <metadata-section>
            │   │   ├── <name>
            │   │   ├── <description>
            │   │   └── <version>
            │   │
            │   ├── <mission-section>
            │   │   ├── <objective>
            │   │   └── <execution-mode>
            │   │
            │   ├── <instructions-section>
            │   │   ├── <instruction-group>
            │   │   │   └── <instruction>
            │   │   └── <workflow-section>
            │   │       └── <step>
            │   │
            │   ├── <examples-section>
            │   │   └── <example>
            │   │
            │   └── <validation-section>
            │       └── <success-criteria>
        ]]>
      </content>
    </diagram>
  </visual-diagrams-section>

  <!-- ═══════════════════════════════════════════════════════════
       КРИТЕРИИ УСПЕХА
       ══════════════════════════════════════════════════════════ -->

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">
        Команды генерируются с корректным YAML frontmatter
        согласно спецификации Claude Code CLI
      </criterion>
      <criterion order="2" priority="critical">
        XML контент соответствует требованиям из plain-to-xml.md
        (semantically structured, self-documenting, 3-5 levels)
      </criterion>
      <criterion order="3" priority="high">
        Ultrathink mode обеспечивает глубокий анализ и качество
      </criterion>
      <criterion order="4" priority="high">
        Auto-save работает без запроса подтверждения
      </criterion>
      <criterion order="5" priority="medium">
        Создаваемые команды готовы к немедленному использованию
      </criterion>
    </success-criteria>

    <quality-metrics>
      <metric name="frontmatter-completeness" status="required">100%</metric>
      <metric name="xml-well-formed" status="required">100%</metric>
      <metric name="content-preservation" status="required">100%</metric>
      <metric name="semantic-clarity" status="desired">high</metric>
      <metric name="llm-friendliness" status="desired">high</metric>
    </quality-metrics>
  </validation-section>

  <!-- ═══════════════════════════════════════════════════════════
       ЗАПУСК КОМАНДЫ
       ══════════════════════════════════════════════════════════ -->

  <execution-section>
    <start-instructions>
      <step order="1">Пользователь вызывает: /create-skill</step>
      <step order="2">Показать приветственное сообщение и объяснить процесс</step>
      <step order="3">Начать интерактивный опрос (7 вопросов)</step>
      <step order="4">Генерировать frontmatter + XML контент в режиме ultrathink</step>
      <step order="5">Валидировать результат</step>
      <step order="6">Автосохранить в ~/.claude/commands/{name}.md</step>
      <step order="7">Подтвердить успешное создание</step>
    </start-instructions>
  </execution-section>

</command-definition>
