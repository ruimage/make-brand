---
name: state-management-advisor
description: "Анализирует компонент и рекомендует оптимальный подход к управлению состоянием с вероятностной оценкой"
allowed-tools: ["Read", "Grep", "Write"]
argument-hint: "<file-path>"
ultrathink: true
version: 2.0
---

<skill-definition>
  <metadata-section>
    <name>state-management-advisor</name>
    <category>architecture-advisor</category>
    <version>2.0</version>
    <triggers>state management, useState, Redux, как хранить, где хранить данные, локальный state</triggers>
    <description>
      Анализирует компонент и рекомендует оптимальный подход к управлению состоянием
      используя вероятностную оценку для каждого варианта размещения.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Проанализировать состояние компонента, найти анти-паттерны и предоставить рекомендации
      по оптимальному управлению состоянием.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="read-component" mandatory="true">
      <title>Чтение компонента</title>
      <instructions>
        <instruction order="1">Read: прочитать файл компонента</instruction>
        <instruction order="2">Извлечь все useState, useEffect, useAppSelector, RTK Query hooks</instruction>
        <instruction order="3">Найти useParams, useSearchParams</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="2" name="extract-states" mandatory="true">
      <title>Извлечение всех состояний</title>
      <instructions>
        <instruction order="1">Grep: useState\([^)]+\)</instruction>
        <instruction order="2">Для каждого useState определить: имя, тип, использование</instruction>
      </instructions>
      <properties>
        <property>Имя переменной</property>
        <property>Тип состояния</property>
        <property>Как используется (UI, данные, фильтры)</property>
        <property>Нужно ли сохранять при перезагрузке</property>
        <property>Используется ли в других компонентах</property>
      </properties>
    </instruction-group>

    <instruction-group order="3" name="classification" mandatory="true">
      <title>Классификация состояний</title>
      <instructions>
        <instruction order="1">Классифицировать каждое состояние по уровням</instruction>
      </instructions>
      <levels>
        <level order="1" name="LOCAL" priority="highest">
          <triggers>UI состояние, модальные окна, toggles, формы ввода, временные данные</triggers>
          <not-needed>Не нужно сохранять при перезагрузке</not-needed>
          <examples>isModalOpen, formData, inputValue</examples>
          <usage>useState</usage>
        </level>
        <level order="2" name="URL" priority="high">
          <triggers>Параметры фильтрации, пагинация, ID сущности</triggers>
          <needed>Нужно для шаринга ссылок</needed>
          <examples>page, filter, sortBy, userId</examples>
          <usage>useParams/useSearchParams</usage>
        </level>
        <level order="3" name="SERVER" priority="medium">
          <triggers>Данные с API, кэширование, синхронизация с сервером</triggers>
          <examples>users, products, orders</examples>
          <usage>RTK Query</usage>
        </level>
        <level order="4" name="GLOBAL" priority="low">
          <triggers>Клиентское глобальное состояние, UI настройки</triggers>
          <examples>theme, sidebarState, notifications</examples>
          <usage>Redux slice</usage>
        </level>
      </levels>
    </instruction-group>

    <instruction-group order="4" name="anti-patterns" mandatory="true">
      <title>Обнаружение анти-паттернов</title>
      <patterns>
        <pattern order="1" severity="critical" name="Server State in useState">
          <bad-template>
            <![CDATA[
            const [users, setUsers] = useState<User[]>([]);
            const [loading, setLoading] = useState(false);

            useEffect(() => {
              setLoading(true);
              fetch('/api/users')
                .then(res => res.json())
                .then(data => {
                  setUsers(data);
                  setLoading(false);
                });
            }, []);
            ]]>
          </bad-template>
          <good-template>
            <![CDATA[
            const { data: users, isLoading } = useGetUsersQuery();
            ]]>
          </good-template>
          <fix>Использовать RTK Query вместо useState + useEffect</fix>
        </pattern>
        <pattern order="2" severity="high" name="URL State in useState">
          <bad-template>
            <![CDATA[
            const [page, setPage] = useState(1);
            const [filter, setFilter] = useState('');
            ]]>
          </bad-template>
          <good-template>
            <![CDATA[
            const [searchParams, setSearchParams] = useSearchParams();
            const page = parseInt(searchParams.get('page') || '1');
            const filter = searchParams.get('filter') || '';
            ]]>
          </good-template>
          <fix>Использовать useSearchParams для URL state</fix>
        </pattern>
        <pattern order="3" severity="medium" name="Prop Drilling">
          <description>Передача пропов через 3+ уровней</description>
          <fix>Использовать Connected Components</fix>
        </pattern>
        <pattern order="4" severity="medium" name="Duplicate State">
          <bad-template>
            <![CDATA[
            const [user, setUser] = useState<User | null>(null);
            const selectedUser = useAppSelector(state => selectUser(state, userId));
            ]]>
          </bad-template>
          <fix>Использовать только один источник состояния</fix>
        </pattern>
      </patterns>
    </instruction-group>

    <instruction-group order="5" name="report-generation" mandatory="true">
      <title>Генерация отчета с вероятностями</title>
      <instructions>
        <instruction order="1">Для каждого состояния сгенерировать 5 вариантов размещения с вероятностями</instruction>
        <instruction order="2">Каждый вариант включает: вероятность, обоснование, сложность миграции, риск</instruction>
        <instruction order="3">Вероятности должны суммироваться в 100%</instruction>
      </instructions>
      <template>
        <![CDATA[
        ## State: `users`

        **Option 1: RTK Query (SERVER)** [Probability: 85%]
        **Confidence:** High | **Migration:** Medium | **Risk:** Low

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

        // After ✅
        const { data: users, isLoading, error } = useGetUsersQuery();
        ```

        **Option 2: URL State** [Probability: 10%]
        **Confidence:** Low | **Migration:** High | **Risk:** Medium

        **Why rejected:**
        - Users data too large for URL
        - Not shareable via URL

        **Option 3: Redux Slice (GLOBAL)** [Probability: 3%]
        **Confidence:** Low | **Migration:** High | **Risk:** High

        **Why rejected:**
        - Duplicates RTK Query capability

        **Option 4: Keep useState (LOCAL)** [Probability: 2%]
        **Confidence:** Very Low | **Migration:** None | **Risk:** High

        **Why rejected:**
        - All issues remain

        **Option 5: Context API** [Probability: 0%]
        **Confidence:** None | **Migration:** High | **Risk:** High

        **Why rejected:**
        - Doesn't solve caching
        - Prop drilling not the issue
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="6" name="probability-scoring">
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

    <instruction-group order="7" name="decision-tree">
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
  </instructions-section>

  <workflow-section mandatory="true">
    <phase order="1" name="read">
      <step>Read: прочитать компонент</step>
    </phase>
    <phase order="2" name="extract">
      <step>Grep: найти все useState</step>
    </phase>
    <phase order="3" name="classify">
      <step>Классифицировать каждое состояние</step>
    </phase>
    <phase order="4" name="detect">
      <step>Найти анти-паттерны</step>
    </phase>
    <phase order="5" name="probability">
      <step>Рассчитать вероятности для 5 вариантов размещения</step>
    </phase>
    <phase order="6" name="recommend">
      <step>Сгенерировать рекомендации с вероятностями</step>
    </phase>
    <phase order="7" name="report">
      <step>Создать отчет с migration plan</step>
    </phase>
  </workflow-section>

  <output-format-section mandatory="true">
    <format>Markdown отчет с вероятностной оценкой</format>
    <structure>
      <section order="1">State Inventory (все найденные состояния)</section>
      <section order="2">Verbalized Sampling Analysis (5 вариантов с вероятностями для каждого)</section>
      <section order="3">Top Recommendation с вероятностью</section>
      <section order="4">Migration Plan (before/after)</section>
      <section order="5">Anti-patterns с confidence scores</section>
      <section order="6">Decision Tree с probability weights</section>
    </structure>
    <template>
      <![CDATA[
      # State Management Analysis Report

      **Component:** `src/pages/users/UserList.tsx`
      **States Found:** 5
      **Issues:** 3 (2 Critical, 1 High)

      ## State: `users`

      | Option | Type | Probability | Confidence | Migration |
      |--------|------|-------------|------------|-----------|
      | RTK Query | SERVER | 85% | High | Medium |
      | URL State | URL | 10% | Low | High |
      | Redux Slice | GLOBAL | 3% | Low | High |
      | Keep useState | LOCAL | 2% | Very Low | None |
      | Context API | HYBRID | 0% | None | High |

      **Recommended:** RTK Query (85%)

      **Why:**
      - Data from API ✓
      - Needs caching ✓
      - Error handling missing ✓

      **Refactor:**
      ❌ Before: `const [users, setUsers] = useState<User[]>([]);`
      ✅ After: `const { data: users, isLoading, error } = useGetUsersQuery();`
      ]]>
    </template>
  </output-format-section>

  <examples-section>
    <example id="1">
      <scenario>"Проверь state management в UserList компоненте"</scenario>
      <actions>
        <action order="1">Прочитать src/pages/users/UserList.tsx</action>
        <action order="2">Найти все useState (users, page, filter, isModalOpen)</action>
        <action order="3">Классифицировать каждое состояние</action>
        <action order="4">Найти анти-паттерны (users в useState, page не в URL)</action>
        <action order="5">Предоставить рекомендации с примерами</action>
      </actions>
    </example>
    <example id="2">
      <scenario>"Где лучше хранить фильтры для списка товаров?"</scenario>
      <actions>
        <action order="1">Анализировать контекст</action>
        <action order="2">Рекомендовать: useSearchParams (URL state)</action>
        <action order="3">Объяснить причину: шаринг ссылок, персистентность</action>
        <action order="4">Показать пример кода</action>
      </actions>
    </example>
  </examples-section>

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
