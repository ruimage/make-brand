---
name: state-management-advisor-vs
description: "Анализирует компонент и рекомендует оптимальный подход к управлению состоянием с Verbalized Sampling"
allowed-tools: ["Read", "Grep", "Write"]
argument-hint: "<file-path>"
ultrathink: true
vs-enabled: true
version: 2.0.0
---

<skill-definition>
  <metadata-section>
    <name>state-management-advisor-vs</name>
    <category>architecture-advisor</category>
    <version>2.0.0</version>
    <triggers>state management, useState, Redux, как хранить, где хранить данные, локальный state</triggers>
    <description>
      Анализирует компонент и рекомендует оптимальный подход к управлению состоянием
      используя Verbalized Sampling для multi-dimensional анализа.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Проанализировать состояние компонента и предоставить рекомендации с оценкой вероятности для каждого варианта.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="vs-sampling" mandatory="true">
      <title>Verbalized Sampling для State Management</title>
      <instructions>
        <instruction order="1">Для каждого состояния генерировать 5 вариантов размещения с вероятностями</instruction>
        <instruction order="2">Каждый вариант включает: вероятность, обоснование, риск, пример миграции</instruction>
      </instructions>
      <template>
        <![CDATA[
        ## State Management Analysis (Verbalized Sampling)

        ### State: `users`

        **Option 1: RTK Query (SERVER)** [Probability: 85%]
        **Confidence:** High | **Migration Effort:** Medium | **Risk:** Low

        **Why this probability:**
        - Data comes from API ✓
        - Needs caching ✓
        - No error handling currently ✓
        - Used in multiple components ✓

        **Current Issues:**
        - No error handling
        - No caching
        - Manual loading state

        **Migration:**
        ```typescript
        // Before ❌
        const [users, setUsers] = useState<User[]>([]);
        const [loading, setLoading] = useState(false);

        // After ✅
        const { data: users, isLoading, error } = useGetUsersQuery();
        ```

        **Option 2: URL State** [Probability: 10%]
        **Confidence:** Low | **Migration Effort:** High | **Risk:** Medium

        **Why rejected:**
        - Users data is too large for URL
        - Not shareable via URL
        - Not a navigation concern

        **Option 3: Redux Slice (GLOBAL)** [Probability: 3%]
        **Confidence:** Low | **Migration Effort:** High | **Risk:** High

        **Why rejected:**
        - Duplicates RTK Query capability
        - Manual synchronization needed

        **Option 4: Keep useState (LOCAL)** [Probability: 2%]
        **Confidence:** Very Low | **Migration Effort:** None | **Risk:** High

        **Why rejected:**
        - All issues remain unfixed

        **Option 5: Context API** [Probability: 0%]
        **Confidence:** None | **Migration Effort:** High | **Risk:** High

        **Why rejected:**
        - Doesn't solve caching
        - Prop drilling not the issue
        - Overkill for single component
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="2" name="probability-calculation" mandatory="true">
      <title>Расчёт вероятностей</title>
      <instructions>
        <instruction order="1">Анализировать каждое состояние по критериям</instruction>
        <instruction order="2">Начислить баллы, нормализовать в проценты</instruction>
      </instructions>
      <scoring>
        <criteria name="Data Source">
          <score source="API" points="+40 SERVER" />
          <score source="User input" points="+30 LOCAL" />
          <score source="URL" points="+30 URL" />
          <score source="Computed" points="+20 LOCAL" />
        </criteria>
        <criteria name="Caching Needed">
          <score value="true" points="+30 SERVER" />
          <score value="false" points="+10 LOCAL" />
        </criteria>
        <criteria name="Shared Across Components">
          <score value="true" points="+20 GLOBAL" points="+15 SERVER" />
          <score value="false" points="+20 LOCAL" />
        </criteria>
        <criteria name="URL Shareable">
          <score value="true" points="+40 URL" />
          <score value="false" points="-10 URL" />
        </criteria>
        <criteria name="Real-time Updates">
          <score value="true" points="+15 SERVER" points="+10 GLOBAL" />
          <score value="false" points="+5 LOCAL" />
        </criteria>
      </scoring>
    </instruction-group>

    <instruction-group order="3" name="decision-tree-vs">
      <title>Decision Tree с Probability Weights</title>
      <instructions>
        <instruction order="1">Использовать decision tree как base calculation</instruction>
        <instruction order="2">Добавить probability scores для каждого path</instruction>
      </instructions>
      <tree>
        <![CDATA[
        Decision Tree for State Management (with Probability Weights):

        1. Это UI состояние компонента?
           YES → useState (LOCAL) [Base: 70%]
           NO → 2

        2. Это должно быть в URL?
           YES → useSearchParams (URL) [Base: 80%]
           NO → 3

        3. Это данные с сервера?
           YES → RTK Query (SERVER) [Base: 75%]
           NO → 4

        4. Это используется глобально?
           YES → Redux slice (GLOBAL) [Base: 60%]
           NO → useState (LOCAL) [Base: 70%]

        Probability Modifiers:
        + Caching needed: SERVER +25%, LOCAL -15%
        + Error handling needed: SERVER +20%, LOCAL -10%
        + Multiple components use: SERVER +15%, GLOBAL +10%
        + Large data: URL -30%, GLOBAL +5%
        + Real-time sync: SERVER +15%, GLOBAL +20%
        ]]>
      </tree>
    </instruction-group>

    <instruction-group order="4" name="anti-patterns-vs" mandatory="true">
      <title>Анти-паттерны с Confidence Scoring</title>
      <instructions>
        <instruction order="1">Для каждого анти-паттерна указать confidence level</instruction>
        <instruction order="2">Higher confidence = stronger recommendation to fix</instruction>
      </instructions>
      <patterns>
        <pattern order="1" severity="critical" name="Server State in useState">
          <confidence>95%</confidence>
          <bad-template>
            <![CDATA[
            const [users, setUsers] = useState<User[]>([]);
            const [loading, setLoading] = useState(false);
            useEffect(() => {
              fetch('/api/users').then(res => setUsers(res.data));
            }, []);
            ]]>
          </bad-template>
          <fix>Использовать RTK Query: useGetUsersQuery()</fix>
        </pattern>
        <pattern order="2" severity="high" name="URL State in useState">
          <confidence>85%</confidence>
          <bad-template>
            <![CDATA[
            const [page, setPage] = useState(1);
            const [filter, setFilter] = useState('');
            ]]>
          </bad-template>
          <fix>Использовать useSearchParams()</fix>
        </pattern>
      </patterns>
    </instruction-group>
  </instructions-section>

  <output-format-section mandatory="true">
    <format>Markdown отчет с Verbalized Sampling</format>
    <structure>
      <section order="1">State Inventory (все найденные состояния)</section>
      <section order="2">Verbalized Sampling Analysis для каждого состояния</section>
      <section order="3">Top Recommendation с вероятностью</section>
      <section order="4">Migration Plan (before/after)</section>
      <section order="5">Anti-patterns с confidence scores</section>
    </structure>
  </output-format-section>

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Все состояния найдены и классифицированы</criterion>
      <criterion order="2" priority="critical">Каждое состояние имеет 5 вариантов с вероятностями</criterion>
      <criterion order="3" priority="high">Вероятности обоснованы критериями</criterion>
      <criterion order="4" priority="high">Anti-patterns имеют confidence scores</criterion>
      <criterion order="5" priority="medium">Migration plan с примерами кода</criterion>
    </success-criteria>
  </validation-section>
</skill-definition>
