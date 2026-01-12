---
description: "интерактивная оптимизация промптов"
allowed-tools: ["webfetch", "todowrite", "task", "read", "write", "edit", "mcp__mcp_docker_toolkit__resolve-library-id", "mcp__mcp_docker_toolkit__get-library-docs", "mcp__mcp_docker_toolkit__search_code", "mcp__mcp_docker_toolkit__search_repositories", "mcp__mcp_docker_toolkit__get_file_contents", "mcp__mcp_docker_toolkit__fetch", "mcp__mcp_docker_toolkit__brave_web_search", "mcp__mcp_docker_toolkit__tavily-search", "mcp__mcp_docker_toolkit__tavily-extract", "mcp__mcp_docker_toolkit__tavily-crawl"]
argument-hint: "<prompt-text>"
---

<!-- ═══════════════════════════════════════════════════════════════
     OPTIMIZE COMMAND - XML STRUCTURED DEFINITION
     Интерактивная интеллектуальная оптимизация промптов
     с использованием передовых методов prompt engineering
═══════════════════════════════════════════════════════════════ -->

<command-definition>
  <metadata-section>
    <name>/optimize</name>
    <description>
      Интерактивная интеллектуальная оптимизация промптов с использованием
      передовых методов prompt engineering, режимом ultrathink по умолчанию
      и интерактивным выбором целевой области. ОБЯЗАТЕЛЬНО использует Context7
      для всех технологий и автоматически применяет mcp_docker_toolkit инструменты
      для получения актуальной документации и примеров кода.
    </description>
    <version>2.0</version>
    <tags>prompt-engineering, optimization, context7, ultrathink, interactive</tags>
  </metadata-section>

  <key-features mandatory="true">
    <feature order="1">4 режима работы (optimize, analysis, test, compare)</feature>
    <feature order="2">интерактивный выбор целевой области</feature>
    <feature order="3">автоматическая интеграция Context7</feature>
    <feature order="4">углубленный анализ с диаграммами</feature>
    <feature order="5">полный вывод оптимизированного промпта</feature>
    <feature order="6">mcp_docker_toolkit автоматизация</feature>
  </key-features>

  <!-- ═══════════════════════════════════════════════════════════════
       ОБЯЗАТЕЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ CLAUDE
       ════════════════════════════════════════════════════════════════ -->

  <claude-instructions-section>
    <role-definition>
      <title>EXPERT PROMPT ENGINEER</title>
      <mission mandatory="true">
        Анализировать, оптимизировать и улучшать промпты, используя
        передовые методы prompt engineering с интерактивным руководством пользователя
      </mission>
      <execution-mode>
        <mode>ULTRATHINK</mode>
        <description>Глубокий анализ каждого элемента промпта</description>
      </execution-mode>
    </role-definition>

    <mandatory-workflow>
      <step order="1" action="ACCEPT_PROMPT" mandatory="true">
        <description>ПРИНЯТЬ исходный промпт и параметры</description>
      </step>

      <step order="2" action="DETERMINE_MODE" mandatory="true">
        <description>ОПРЕДЕЛИТЬ РЕЖИМ (optimize, analysis, test, compare)</description>
        <modes>
          <mode value="optimize" default="true">полная оптимизация промпта</mode>
          <mode value="analysis">детальный анализ качества промпта</mode>
          <mode value="test">тестирование различных вариантов промпта</mode>
          <mode value="compare">сравнение нескольких версий промпта</mode>
        </modes>
      </step>

      <step order="3" action="REQUEST_TARGET" mandatory="true">
        <description>СПРОСИТЬ TARGET интерактивно (если не указан)</description>
        <interactive-prompt type="user-input">
          <![CDATA[
          Выберите целевую область для оптимизации:
          1. 💻 coding  2. 📋 planning  3. 🔍 analysis  4. 🎯 general
          Введите номер (1-4) или название:
          ]]>
        </interactive-prompt>
      </step>

      <step order="4" action="USE_CONTEXT7" mandatory="true" priority="critical">
        <description>ОБЯЗАТЕЛЬНО ИСПОЛЬЗОВАТЬ Context7 для всех упомянутых технологий</description>
        <tools>
          <tool order="1">mcp__plugin_context7_context7__resolve-library-id</tool>
          <tool order="2">mcp__plugin_context7_context7__query-docs</tool>
          <tool order="3">mcp__mcp_docker_toolkit__resolve-library-id</tool>
          <tool order="4">mcp__mcp_docker_toolkit__get-library-docs</tool>
        </tools>
      </step>

      <step order="5" action="ANALYZE" mandatory="true">
        <description>АНАЛИЗИРОВАТЬ промпт с углубленным анализом</description>
        <analysis-type>ultrathink</analysis-type>
        <quality-metrics>
          <metric name="clarity" weight="25">Ясность инструкций</metric>
          <metric name="specificity" weight="20">Конкретность требований</metric>
          <metric name="context-adequacy" weight="20">Достаточность контекста</metric>
          <metric name="structure" weight="20">Логическая организация</metric>
          <metric name="completeness" weight="15">Полнота покрытия</metric>
        </quality-metrics>
      </step>

      <step order="6" action="EXECUTE" mandatory="true">
        <description>ВЫПОЛНИТЬ ЗАДАЧУ согласно режиму с использованием mcp_docker_toolkit</description>
        <required-tools>
          <tool>mcp__mcp_docker_toolkit__search_code</tool>
          <tool>mcp__mcp_docker_toolkit__search_repositories</tool>
          <tool>mcp__mcp_docker_toolkit__fetch</tool>
          <tool>mcp__mcp_docker_toolkit__brave_web_search</tool>
          <tool>mcp__mcp_docker_toolkit__tavily-search</tool>
        </required-tools>
      </step>

      <step order="7" action="INCLUDE_DIAGRAMS" mandatory="true">
        <description>ВКЛЮЧИТЬ ДИАГРАММЫ в оптимизированные промпты</description>
        <diagram-types>
          <type order="1">architectural schemes</type>
          <type order="2">data flow diagrams</type>
          <type order="3">API integration diagrams</type>
          <type order="4">state management diagrams</type>
        </diagram-types>
      </step>

      <step order="8" action="PRESENT" mandatory="true">
        <description>ПРЕДОСТАВИТЬ РЕЗУЛЬТАТ с полным выводом промпта</description>
        <output-format>структурированный отчет с полным текстом</output-format>
      </step>

      <step order="9" action="REQUEST_FEEDBACK">
        <description>ЗАПРОСИТЬ ОБРАТНУЮ СВЯЗЬ</description>
      </step>
    </mandatory-workflow>
  </claude-instructions-section>

  <!-- ═══════════════════════════════════════════════════════════════
       ИНТЕРАКТИВНЫЙ АЛГОРИТМ
       ════════════════════════════════════════════════════════════════ -->

  <interactive-algorithm-section>
    <phase order="1" name="PROMPT_RECEPTION" mandatory="true">
      <description>Прием промпта от пользователя</description>
      <example>
        <![CDATA[
        Пользователь: /optimize "Create a React component for user authentication"
        ]]>
      </example>
    </phase>

    <phase order="2" name="TARGET_SELECTION" mandatory="true">
      <description>Интерактивный выбор целевой области</description>
      <interactive-prompt>
        <![CDATA[
        Выберите целевую область для оптимизации:
        1. 💻 coding  2. 📋 planning  3. 🔍 analysis  4. 🎯 general
        Введите номер (1-4) или название:
        ]]>
      </interactive-prompt>
      <response-mapping>
        <mapping input="1" output="coding" />
        <mapping input="coding" output="coding" />
        <mapping input="2" output="planning" />
        <mapping input="planning" output="planning" />
        <mapping input="3" output="analysis" />
        <mapping input="analysis" output="analysis" />
        <mapping input="4" output="general" />
        <mapping input="general" output="general" />
      </response-mapping>
    </phase>

    <phase order="3" name="OPTIMIZATION" mandatory="true">
      <description>Применить соответствующую оптимизацию с углубленным анализом</description>
      <substeps>
        <substep order="1">Context7 анализ технологий</substep>
        <substep order="2">Семантический анализ по 5 измерениям</substep>
        <substep order="3">Целевая оптимизация</substep>
        <substep order="4">Генерация диаграмм</substep>
        <substep order="5">Формирование финального промпта</substep>
      </substeps>
    </phase>
  </interactive-algorithm-section>

  <!-- ═══════════════════════════════════════════════════════════════
       ИСПОЛЬЗОВАНИЕ И ПАРАМЕТРЫ
       ════════════════════════════════════════════════════════════════ -->

  <usage-patterns-section>
    <syntax>
      /optimize &lt;prompt-text&gt; [--mode=&lt;mode&gt;] [--target=&lt;target&gt;] [--save-results] [--iterations=&lt;N&gt;]
    </syntax>

    <parameters-section>
      <parameter name="prompt-text" required="true" type="string">
        <description>Исходный текст промпта для оптимизации</description>
      </parameter>

      <parameter name="mode" required="false" type="enum" default="optimize">
        <description>Режим работы команды</description>
        <options>
          <option value="optimize" default="true">полная оптимизация промпта</option>
          <option value="analysis">детальный анализ качества промпта</option>
          <option value="test">тестирование различных вариантов промпта</option>
          <option value="compare">сравнение нескольких версий промпта</option>
        </options>
      </parameter>

      <parameter name="target" required="false" type="enum">
        <description>Целевая область оптимизации</description>
        <options>
          <option value="coding">разработка кода, компоненты, API, техническая документация</option>
          <option value="planning">планирование проектов, архитектура, стратегия</option>
          <option value="analysis">анализ кода, производительность, качество, исследования</option>
          <option value="general">универсальная оптимизация для любых задач</option>
        </options>
      </parameter>

      <parameter name="iterations" required="false" type="number" default="4">
        <description>Количество итераций улучшения</description>
        <range>1-10</range>
      </parameter>

      <parameter name="save-results" required="false" type="flag">
        <description>Сохранить результаты анализа в каталог /prompts</description>
      </parameter>
    </parameters-section>

    <examples-section>
      <example id="basic-usage">
        <title>Базовая оптимизация</title>
        <description>Оптимизация промпта с интерактивным выбором target</description>
        <command-block language="bash">
          <![CDATA[
          /optimize "Create a React component for user authentication"
          ]]>
        </command-block>
        <expected-output>
          <result>Оптимизированный промпт для создания React компонента</result>
          <includes>Context7 данные по React, TypeScript, Material-UI</includes>
          <includes>Архитектурные диаграммы</includes>
          <includes>API интеграционные схемы</includes>
        </expected-output>
      </example>

      <example id="with-parameters">
        <title>С указанием параметров</title>
        <description>Оптимизация с явным указанием режима и области</description>
        <command-block language="bash">
          <![CDATA[
          /optimize "Plan dark theme" --mode=analysis --target=planning
          ]]>
        </command-block>
        <expected-output>
          <result>Детальный анализ промпта планирования</result>
          <includes>Оценка по 5 метрикам качества</result>
          <includes>Рекомендации по улучшению</includes>
        </expected-output>
      </example>
    </examples-section>
  </usage-patterns-section>

  <!-- ═══════════════════════════════════════════════════════════════
       АЛГОРИТМЫ ОПТИМИЗАЦИИ
       ════════════════════════════════════════════════════════════════ -->

  <optimization-algorithms-section>
    <algorithm id="semantic-analysis" name="СЕМАНТИЧЕСКИЙ АНАЛИЗ" mandatory="true">
      <aspects>
        <aspect name="clarity" weight="25" priority="high">
          <label>Ясность</label>
          <description>Четкость инструкций и требований</description>
          <scoring-scale>1-10</scoring-scale>
        </aspect>

        <aspect name="specificity" weight="20" priority="high">
          <label>Специфичность</label>
          <description>Конкретность и детализация</description>
          <scoring-scale>1-10</scoring-scale>
        </aspect>

        <aspect name="context-adequacy" weight="20" priority="high">
          <label>Контекстность</label>
          <description>Достаточность контекстной информации</description>
          <scoring-scale>1-10</scoring-scale>
        </aspect>

        <aspect name="structure" weight="20" priority="medium">
          <label>Структурированность</label>
          <description>Логическая организация промпта</description>
          <scoring-scale>1-10</scoring-scale>
        </aspect>

        <aspect name="completeness" weight="15" priority="medium">
          <label>Полнота</label>
          <description>Покрытие всех аспектов задачи</description>
          <scoring-scale>1-10</scoring-scale>
        </aspect>
      </aspects>

      <scoring-methodology>
        <scale>1-10 для каждого аспекта</scale>
        <calculation>взвешенная сумма всех аспектов / 100</calculation>
        <output>Quality Score от 1.0 до 10.0</output>
      </scoring-methodology>
    </algorithm>

    <algorithm id="structural-analysis" name="СТРУКТУРНЫЙ АНАЛИЗ" mandatory="true">
      <elements>
        <element name="xml-tags" priority="high">использование структурирующих тегов</element>
        <element name="instructions-format" priority="high">четкость формулировки инструкций</element>
        <element name="examples-presence" priority="medium">наличие примеров и демонстраций</element>
        <element name="constraints-definition" priority="medium">определение ограничений и рамок</element>
        <element name="output-format" priority="high">спецификация желаемого формата ответа</element>
      </elements>
    </algorithm>

    <algorithm id="target-optimization" name="ЦЕЛЕВАЯ ОПТИМИЗАЦИЯ" mandatory="true">
      <target-specifics>
        <target id="coding">
          <focus>техтребования, архитектура, тестирование</focus>
          <context7-integration>
            <library>/facebook/react</library>
            <library>/microsoft/TypeScript</library>
            <library>/mui/material-ui</library>
          </context7-integration>
        </target>

        <target id="planning">
          <focus>этапы, зависимости, ресурсы</focus>
          <context7-integration>
            <search-query>project planning best practices 2025</search-query>
          </context7-integration>
        </target>

        <target id="analysis">
          <focus>метрики, паттерны, рекомендации</focus>
          <context7-integration>
            <search-query>code analysis metrics performance</search-query>
          </context7-integration>
        </target>

        <target id="general">
          <focus>структура, ясность, контекст</focus>
          <context7-integration>
            <library>/anthropics/prompt-eng-interactive-tutorial</library>
            <library>/dair-ai/prompt-engineering-guide</library>
          </context7-integration>
        </target>
      </target-specifics>
    </algorithm>
  </optimization-algorithms-section>

  <!-- ═══════════════════════════════════════════════════════════════
       МЕТРИКИ КАЧЕСТВА
       ════════════════════════════════════════════════════════════════ -->

  <quality-metrics-section>
    <primary-metrics>
      <metric id="quality-score" name="Quality Score" type="composite" range="1-10">
        <description>Общая оценка качества промпта</description>
        <calculation>взвешенная сумма всех аспектов</calculation>
      </metric>

      <metric id="improvement-rate" name="Improvement Rate" type="percentage" range="0-100%">
        <description>Процент улучшения относительно исходного промпта</description>
      </metric>

      <metric id="structural-clarity" name="Структурная ясность" type="score" range="1-10">
        <description>Оценка логической организации</description>
      </metric>

      <metric id="domain-relevance" name="Релевантность к домену" type="score" range="1-10">
        <description>Соответствие выбранной области</description>
      </metric>
    </primary-metrics>
  </quality-metrics-section>

  <!-- ═══════════════════════════════════════════════════════════════
       АЛГОРИТМ ВЫПОЛНЕНИЯ
       ════════════════════════════════════════════════════════════════ -->

  <execution-workflow-section>
    <step order="1" mandatory="true">
      <action>Извлечение параметров из команды</action>
      <parameters>prompt, mode, target, iterations</parameters>
      <validation>Проверить наличие обязательного параметра prompt-text</validation>
    </step>

    <step order="2" mandatory="true">
      <action>Интерактивный запрос target</action>
      <condition>если не указан в параметрах</condition>
      <interaction>ожидать ввода пользователя</interaction>
    </step>

    <step order="3" mandatory="true" priority="critical">
      <action>ОБЯЗАТЕЛЬНЫЙ Context7 анализ технологий</action>
      <substeps>
        <substep order="1">Сканировать промпт на упоминание технологий (React, TypeScript, Python, etc.)</substep>
        <substep order="2">Использовать resolve-library-id для получения Context7 ID каждой технологии</substep>
        <substep order="3">Загружать актуальную документацию через get-library-docs</substep>
        <substep order="4">Использовать search_code, search_repositories для примеров кода</substep>
        <substep order="5">Применять fetch, brave_web_search, tavily-search для дополнительного контекста</substep>
      </substeps>
    </step>

    <step order="4" mandatory="true">
      <action>Семантический анализ по 5 измерениям</action>
      <include>оценка качества + Context7 данные</include>
      <output>оценки по метрикам (1-10)</output>
    </step>

    <step order="5" mandatory="true">
      <action>Выполнение по режиму</action>
      <modes>optimize/analysis/test/compare</modes>
      <tools>mcp_docker_toolkit</tools>
    </step>

    <step order="6" mandatory="true">
      <action>Презентация результатов</action>
      <include>полный вывод промпта</include>
      <format>структурированный отчет с диаграммами</format>
    </step>
  </execution-workflow-section>

  <!-- ═══════════════════════════════════════════════════════════════
       ОБЯЗАТЕЛЬНАЯ ПРОЦЕДУРА ВЗАИМОДЕЙСТВИЯ
       ════════════════════════════════════════════════════════════════ -->

  <interaction-procedure-section>
    <critical-rule priority="critical" mandatory="true">
      <title>ВАЖНО: ИНТЕРАКТИВНОСТЬ И ПРЕЗЕНТАЦИЯ</title>
      <mandatory-sequence>
        <stage order="1" mandatory="true">
          <actions>
            <action order="1">Принять промпт</action>
            <action order="2">Спросить target (интерактивно)</action>
            <action order="3">Дождаться ответа пользователя</action>
          </actions>
        </stage>

        <stage order="2" mandatory="true">
          <actions>
            <action order="1">Показать анализ</action>
            <action order="2">Представить оптимизацию</action>
            <action order="3">Вывести полный промпт</action>
          </actions>
        </stage>

        <stage order="3" mandatory="true">
          <actions>
            <action order="1">Объяснить изменения</action>
            <action order="2">Запросить обратную связь</action>
          </actions>
        </stage>
      </mandatory-sequence>
    </critical-rule>
  </interaction-procedure-section>

  <!-- ═══════════════════════════════════════════════════════════════
       ФОРМАТЫ ПРЕЗЕНТАЦИИ
       ════════════════════════════════════════════════════════════════ -->

  <presentation-formats-section>
    <format mode="optimize" default="true">
      <structure>
        <section order="1" mandatory="true">
          <header>🎯 РЕЖИМ: OPTIMIZE | ОБЛАСТЬ: {selected_target}</header>
        </section>

        <section order="2" mandatory="true">
          <header>🔍 ИСХОДНЫЙ ПРОМПТ:</header>
          <content>{original_prompt}</content>
        </section>

        <section order="3" mandatory="true">
          <header>✨ ОПТИМИЗИРОВАННЫЙ ПРОМПТ (ULTRATHINK):</header>
          <content>{optimized_prompt}</content>
        </section>

        <section order="4" mandatory="true">
          <header>📋 ПОЛНЫЙ ОПТИМИЗИРОВАННЫЙ ПРОМПТ ДЛЯ КОПИРОВАНИЯ:</header>
          <content>{полный_оптимизированный_промпт_без_сокращений}</content>
        </section>

        <section order="5">
          <header>📊 КЛЮЧЕВЫЕ УЛУЧШЕНИЯ:</header>
          <content>{list_of_improvements}</content>
        </section>

        <section order="6">
          <header>📈 ОЦЕНКА КАЧЕСТВА: {quality_score}/10</header>
          <detail>(улучшение на {improvement_delta})</detail>
        </section>
      </structure>
    </format>

    <format mode="analysis">
      <structure>
        <section order="1" mandatory="true">
          <header>🎯 РЕЖИМ: ANALYSIS | ОБЛАСТЬ: {selected_target}</header>
        </section>

        <section order="2" mandatory="true">
          <header>🔍 АНАЛИЗИРУЕМЫЙ ПРОМПТ:</header>
          <content>{original_prompt}</content>
        </section>

        <section order="3" mandatory="true">
          <header>📊 ДЕТАЛЬНЫЙ АНАЛИЗ (ULTRATHINK):</header>
          <metrics>
            <metric>Ясность (Clarity): {clarity_score}/10</metric>
            <metric>Специфичность (Specificity): {specificity_score}/10</metric>
            <metric>Контекстность (Context): {context_score}/10</metric>
            <metric>Структурированность (Structure): {structure_score}/10</metric>
            <metric>Полнота (Completeness): {completeness_score}/10</metric>
          </metrics>
        </section>

        <section order="4" mandatory="true">
          <header>🎯 РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:</header>
          <content>{improvement_recommendations}</content>
        </section>
      </structure>
    </format>

    <format mode="test">
      <structure>
        <section order="1" mandatory="true">
          <header>🎯 РЕЖИМ: TEST | ОБЛАСТЬ: {selected_target}</header>
        </section>

        <section order="2" mandatory="true">
          <header>🔍 БАЗОВЫЙ ПРОМПТ:</header>
          <content>{original_prompt}</content>
        </section>

        <section order="3" mandatory="true">
          <header>🧪 ВАРИАНТЫ ДЛЯ ТЕСТИРОВАНИЯ:</header>
          <content>{test_variations}</content>
        </section>

        <section order="4" mandatory="true">
          <header>📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:</header>
          <content>{test_results}</content>
        </section>
      </structure>
    </format>

    <format mode="compare">
      <structure>
        <section order="1" mandatory="true">
          <header>🎯 РЕЖИМ: COMPARE | ОБЛАСТЬ: {selected_target}</header>
        </section>

        <section order="2" mandatory="true">
          <header>🔍 ИСХОДНЫЙ ПРОМПТ:</header>
          <content>{original_prompt}</content>
        </section>

        <section order="3" mandatory="true">
          <header>⚖️ АЛЬТЕРНАТИВНЫЕ ВЕРСИИ:</header>
          <content>{alternative_versions}</content>
        </section>

        <section order="4" mandatory="true">
          <header>📊 СРАВНИТЕЛЬНЫЙ АНАЛИЗ:</header>
          <content>{comparison_results}</content>
        </section>
      </structure>
    </format>

    <final-block common="true" mandatory="true">
      <section order="1" mandatory="true">
        <header>📋 ПОЛНЫЙ ОПТИМИЗИРОВАННЫЙ ПРОМПТ:</header>
        <content>{полный_оптимизированный_промпт}</content>
      </section>

      <section order="2">
        <header>💾 СОХРАНЕНИЕ РЕЗУЛЬТАТОВ:</header>
        <content>{saved_status}</content>
      </section>

      <section order="3">
        <header>❓ ОБРАТНАЯ СВЯЗЬ:</header>
        <content>Соответствует ли результат вашим ожиданиям? Нужны ли дополнительные изменения?</content>
      </section>
    </final-block>
  </presentation-formats-section>

  <!-- ═══════════════════════════════════════════════════════════════
       ШАБЛОНЫ ОПТИМИЗАЦИИ ПО TARGET ОБЛАСТЯМ
       ════════════════════════════════════════════════════════════════ -->

  <optimization-templates-section>
    <visualization-rule mandatory="true">
      <description>Все шаблоны включают диаграммы: архитектурные схемы, flow данных, API интеграции</description>
    </visualization-rule>

    <!-- ═══════════════════════════════════════════════════════════
         CODING TEMPLATE
         ══════════════════════════════════════════════════════════ -->

    <template target="coding">
      <structure>
        <tag name="task" mandatory="true">
          <content>{TASK_DESCRIPTION}</content>
        </tag>

        <tag name="context7_analysis" mandatory="true" priority="critical">
          <instructions>
            <instruction order="1">Идентифицировать все упомянутые технологии в промпте</instruction>
            <instruction order="2">Использовать resolve-library-id для получения Context7 ID каждой технологии</instruction>
            <instruction order="3">Загрузить актуальную документацию через get-library-docs</instruction>
            <instruction order="4">Поиск релевантного кода через search_code и search_repositories</instruction>
            <instruction order="5">Получить дополнительный контекст через brave_web_search и tavily-search</instruction>
            <instruction order="6">Интегрировать актуальные best practices и API в решение</instruction>
          </instructions>
        </tag>

        <tag name="technical_requirements">
          <requirement order="1" priority="high">TypeScript with strict typing</requirement>
          <requirement order="2" priority="high">Modern frameworks and best practices (согласно Context7 данным)</requirement>
          <requirement order="3" priority="high">Comprehensive error handling</requirement>
          <requirement order="4" priority="medium">Performance optimization</requirement>
          <requirement order="5" priority="medium">Security considerations</requirement>
          <requirement order="6" priority="high">Актуальные версии библиотек из Context7</requirement>
        </tag>

        <tag name="deliverables" mandatory="true">
          <content>{SPECIFIC_DELIVERABLES}</content>
        </tag>

        <tag name="constraints">
          <constraint>Follow industry standards</constraint>
          <constraint>Maintain backward compatibility</constraint>
          <constraint>Ensure accessibility compliance</constraint>
          <constraint>Support responsive design</constraint>
        </tag>

        <tag name="testing_requirements">
          <requirement>Unit tests with high coverage</requirement>
          <requirement>Integration tests where applicable</requirement>
          <requirement>End-to-end testing for critical paths</requirement>
          <requirement>Performance testing</requirement>
        </tag>

        <tag name="visual_diagrams" mandatory="true" priority="high">
          <diagrams>
            <diagram id="1" type="architecture" mandatory="true">
              <title>Архитектурная схема компонентов</title>
              <format>ASCII art</format>
            </diagram>

            <diagram id="2" type="data-flow" mandatory="true">
              <title>Схема flow данных</title>
              <format>Mermaid graph TD</format>
            </diagram>

            <diagram id="3" type="api-integration" mandatory="true">
              <title>Схема API интеграции</title>
              <format>Mermaid sequenceDiagram</format>
            </diagram>

            <diagram id="4" type="state-management">
              <title>Схема состояния (state management)</title>
              <format>Mermaid stateDiagram-v2</format>
            </diagram>

            <diagram id="5" type="component-integration">
              <title>Схема интеграции компонентов</title>
              <format>ASCII tree structure</format>
            </diagram>
          </diagrams>
        </tag>
      </structure>
    </template>

    <!-- ═══════════════════════════════════════════════════════════
         PLANNING TEMPLATE
         ══════════════════════════════════════════════════════════ -->

    <template target="planning">
      <structure>
        <tag name="objective" mandatory="true">
          <content>{PLANNING_OBJECTIVE}</content>
        </tag>

        <tag name="context7_technology_research" mandatory="true" priority="critical">
          <instructions>
            <instruction order="1">Определить все технологии, упомянутые в планируемом проекте</instruction>
            <instruction order="2">Использовать resolve-library-id для каждой технологии</instruction>
            <instruction order="3">Загрузить документацию через get-library-docs для актуальных требований</instruction>
            <instruction order="4">Исследовать текущие тренды через brave_web_search и tavily-search</instruction>
            <instruction order="5">Учесть совместимость и интеграционные возможности</instruction>
          </instructions>
        </tag>

        <tag name="scope" mandatory="true">
          <content>{PROJECT_SCOPE_DEFINITION}</content>
        </tag>

        <tag name="deliverables" mandatory="true">
          <content>{EXPECTED_OUTCOMES}</content>
        </tag>

        <tag name="constraints">
          <content>{LIMITATIONS_AND_BOUNDARIES}</content>
        </tag>

        <tag name="success_criteria" mandatory="true">
          <content>{MEASURABLE_SUCCESS_METRICS}</content>
        </tag>

        <tag name="timeline">
          <content>{ESTIMATED_TIMELINE_WITH_MILESTONES}</content>
        </tag>

        <tag name="dependencies">
          <content>{EXTERNAL_DEPENDENCIES_AND_PREREQUISITES}</content>
        </tag>

        <tag name="risks">
          <content>{POTENTIAL_RISKS_AND_MITIGATION_STRATEGIES}</content>
        </tag>

        <tag name="visual_diagrams" mandatory="true" priority="high">
          <diagrams>
            <diagram id="1" type="timeline" mandatory="true">
              <title>Временная шкала проекта</title>
              <format>ASCII timeline</format>
            </diagram>

            <diagram id="2" type="dependencies" mandatory="true">
              <title>Схема зависимостей</title>
              <format>Mermaid graph TD</format>
            </diagram>

            <diagram id="3" type="resource-matrix">
              <title>Матрица ресурсов</title>
              <format>ASCII table</format>
            </diagram>
          </diagrams>
        </tag>
      </structure>
    </template>

    <!-- ═══════════════════════════════════════════════════════════
         ANALYSIS TEMPLATE
         ══════════════════════════════════════════════════════════ -->

    <template target="analysis">
      <structure>
        <tag name="analysis_target" mandatory="true">
          <content>{WHAT_TO_ANALYZE}</content>
        </tag>

        <tag name="context7_technical_context" mandatory="true" priority="critical">
          <instructions>
            <instruction order="1">Проанализировать все технологии в области анализа</instruction>
            <instruction order="2">Получить актуальную документацию через resolve-library-id и get-library-docs</instruction>
            <instruction order="3">Изучить примеры кода и паттерны через search_code и search_repositories</instruction>
            <instruction order="4">Найти актуальные метрики и best practices через tavily-search</instruction>
            <instruction order="5">Учесть современные подходы к анализу для каждой технологии</instruction>
          </instructions>
        </tag>

        <tag name="analysis_dimensions" mandatory="true">
          <content>{ASPECTS_TO_EXAMINE}</content>
        </tag>

        <tag name="methodology">
          <content>{ANALYSIS_APPROACH_AND_METHODS}</content>
        </tag>

        <tag name="success_metrics">
          <content>{QUANTITATIVE_AND_QUALITATIVE_METRICS}</content>
        </tag>

        <tag name="output_format">
          <content>{DESIRED_REPORT_STRUCTURE}</content>
        </tag>

        <tag name="context">
          <content>{RELEVANT_BACKGROUND_INFORMATION}</content>
        </tag>

        <tag name="visual_diagrams" mandatory="true" priority="high">
          <diagrams>
            <diagram id="1" type="metrics" mandatory="true">
              <title>Метрики анализа</title>
              <format>ASCII progress bars</format>
            </diagram>

            <diagram id="2" type="analysis-flow" mandatory="true">
              <title>Схема анализа</title>
              <format>Mermaid flowchart TD</format>
            </diagram>

            <diagram id="3" type="issue-matrix">
              <title>Матрица проблем/решений</title>
              <format>ASCII table</format>
            </diagram>
          </diagrams>
        </tag>
      </structure>
    </template>

    <!-- ═══════════════════════════════════════════════════════════
         GENERAL TEMPLATE
         ══════════════════════════════════════════════════════════ -->

    <template target="general">
      <structure>
        <tag name="task" mandatory="true">
          <content>{CLEAR_TASK_DESCRIPTION}</content>
        </tag>

        <tag name="context7_universal_analysis" mandatory="true" priority="critical">
          <instructions>
            <instruction order="1">Определить любые технические аспекты в задаче</instruction>
            <instruction order="2">Использовать resolve-library-id для всех упомянутых технологий</instruction>
            <instruction order="3">Получить релевантную документацию через get-library-docs</instruction>
            <instruction order="4">Найти дополнительный контекст через mcp_docker_toolkit инструменты</instruction>
            <instruction order="5">Обеспечить актуальность и точность технической информации</instruction>
          </instructions>
        </tag>

        <tag name="requirements">
          <content>{SPECIFIC_REQUIREMENTS_AND_CONSTRAINTS}</content>
        </tag>

        <tag name="context">
          <content>{RELEVANT_BACKGROUND_INFORMATION}</content>
        </tag>

        <tag name="expected_output" mandatory="true">
          <content>{DESIRED_FORMAT_AND_STRUCTURE}</content>
        </tag>

        <tag name="quality_criteria">
          <content>{SUCCESS_METRICS_AND_VALIDATION}</content>
        </tag>

        <tag name="visual_diagrams" mandatory="true" priority="high">
          <diagrams>
            <diagram id="1" type="process" mandatory="true">
              <title>Процесс выполнения</title>
              <format>ASCII flow diagram</format>
            </diagram>

            <diagram id="2" type="quality-metrics">
              <title>Схема качества</title>
              <format>Mermaid pie chart</format>
            </diagram>

            <diagram id="3" type="solution-structure">
              <title>Структура решения</title>
              <format>ASCII tree structure</format>
            </diagram>
          </diagrams>
        </tag>
      </structure>
    </template>
  </optimization-templates-section>

  <!-- ═══════════════════════════════════════════════════════════════
       РЕЗЮМЕ
       ════════════════════════════════════════════════════════════════ -->

  <summary-section>
    <capabilities>
      <capability order="1">4 режима работы (optimize, analysis, test, compare)</capability>
      <capability order="2">интерактивный выбор области</capability>
      <capability order="3">включение диаграмм и визуализаций</capability>
      <capability order="4">полный вывод оптимизированного промпта</capability>
      <capability order="5">Context7 интеграция для всех технологий</capability>
      <capability order="6">mcp_docker_toolkit автоматизация</capability>
    </capabilities>

    <context7-mcp-integration mandatory="true">
      <description>Автоматическое использование актуальной документации, примеров кода и best practices для всех технологий</description>
      <tools-required>
        <tool>mcp__plugin_context7_context7__resolve-library-id</tool>
        <tool>mcp__plugin_context7_context7__query-docs</tool>
        <tool>mcp__mcp_docker_toolkit__resolve-library-id</tool>
        <tool>mcp__mcp_docker_toolkit__get-library-docs</tool>
        <tool>mcp__mcp_docker_toolkit__search_code</tool>
        <tool>mcp__mcp_docker_toolkit__search_repositories</tool>
      </tools-required>
    </context7-mcp-integration>

    <usage-flow>
      <step order="1">/optimize "Your prompt text"</step>
      <step order="2">выбор области (интерактивно)</step>
      <step order="3">Context7 анализ технологий</step>
      <step order="4">оптимизированный результат с диаграммами</step>
    </usage-flow>
  </summary-section>

  <!-- ═══════════════════════════════════════════════════════════════
       VALIDATION SECTION
       ════════════════════════════════════════════════════════════════ -->

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Frontmatter preserved EXACTLY as original</criterion>
      <criterion order="2" priority="critical">File extension is .md NOT .xml</criterion>
      <criterion order="3" priority="critical">100% information preserved from source</criterion>
      <criterion order="4" priority="high">Well-formed XML structure</criterion>
      <criterion order="5" priority="high">Proper nesting (3-5 levels)</criterion>
      <criterion order="6" priority="medium">Semantic tag names used</criterion>
      <criterion order="7" priority="medium">Descriptive attributes applied</criterion>
      <criterion order="8" priority="medium">CDATA sections for code blocks</criterion>
    </success-criteria>

    <quality-metrics>
      <metric name="completeness" status="achieved">100% information preserved</metric>
      <metric name="readability" status="achieved">LLM-friendly structure</metric>
      <metric name="maintainability" status="achieved">easy to update</metric>
      <metric name="accessibility" status="achieved">self-documenting</metric>
    </quality-metrics>
  </validation-section>
</command-definition>
