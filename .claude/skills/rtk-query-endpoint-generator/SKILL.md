---
name: rtk-query-endpoint-generator
description: "Генерирует RTK Query API endpoint с Zod schema валидацией, RFC 7807 error handling, cache tags management и TypeScript типизацией"
allowed-tools: ["Glob", "Grep", "Read", "Write"]
argument-hint: "<entity-name> <endpoint-type>"
ultrathink: true
---

<skill-definition>
  <metadata-section>
    <name>rtk-query-endpoint-generator</name>
    <category>api-generation</category>
    <version>1.0</version>
    <triggers>RTK Query, API endpoint, create endpoint, Zod validation, RFC 7807, cache invalidation</triggers>
    <description>
      Генерирует RTK Query API endpoint с полной настройкой: Zod schema валидация,
      RFC 7807 error handling, cache tags management и TypeScript типизация.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Создать или обновить RTK Query endpoint с proper валидацией, обработкой ошибок и кэшированием.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="location-detection" mandatory="true">
      <title>Определение расположения endpoint</title>
      <instructions>
        <instruction order="1">Анализировать запрос для определения layer и entity</instruction>
        <instruction order="2">Glob: **/{entity}/api/*.ts для поиска существующего API файла</instruction>
      </instructions>
      <examples>
        <example>"создать endpoint для user" → entities/user/api/userApi.ts</example>
        <example>"добавить suppliers API" → entities/supplier/api/supplierApi.ts</example>
        <example>"auth endpoint" → features/auth/api/authApi.ts</example>
      </examples>
    </instruction-group>

    <instruction-group order="2" name="endpoint-check" mandatory="true">
      <title>Проверка существующего endpoint</title>
      <instructions>
        <instruction order="1">Grep: useGet{Entity}Query или get{Entity} в найденном API файле</instruction>
        <instruction order="2">Если endpoint уже существует — сообщить, предложить обновить</instruction>
        <instruction order="3">НЕ перезаписывать без подтверждения</instruction>
      </instructions>
    </instruction-group>

    <instruction-group order="3" name="method-detection" mandatory="true">
      <title>Определение HTTP метода</title>
      <instructions>
        <instruction order="1">Определить тип endpoint из контекста</instruction>
      </instructions>
      <keywords>
        <keyword method="GET" type="query">получить, get, список, list</keyword>
        <keyword method="POST" type="mutation">создать, create, add, post</keyword>
        <keyword method="PUT" type="mutation">обновить, update, put</keyword>
        <keyword method="PATCH" type="mutation">изменить, patch</keyword>
        <keyword method="DELETE" type="mutation">удалить, delete, remove</keyword>
      </keywords>
    </instruction-group>

    <instruction-group order="4" name="schema-creation" mandatory="true">
      <title>Создание Zod Schema</title>
      <instructions>
        <instruction order="1">Grep: найти существующие *Schema или *schema</instruction>
        <instruction order="2">Если schema не найдена — проверить model/types.ts</instruction>
        <instruction order="3">Создать базовую schema при необходимости</instruction>
      </instructions>
      <templates>
        <collection-schema>
          <![CDATA[
          export const itemsSchema = z.array(itemSchema);
          ]]>
        </collection-schema>
        <single-schema>
          <![CDATA[
          export const itemSchema = z.object({
            id: z.string().uuid(),
            name: z.string(),
          });
          ]]>
        </single-schema>
        <create-schema>
          <![CDATA[
          export const createItemSchema = z.object({
            // поля для создания
          });
          ]]>
        </create-schema>
      </templates>
    </instruction-group>

    <instruction-group order="5" name="type-generation" mandatory="true">
      <title>Генерация TypeScript типов</title>
      <instructions>
        <instruction order="1">Вывести типы из Zod schemas через z.infer</instruction>
      </instructions>
      <template>
        <![CDATA[
        export type Item = z.infer<typeof itemSchema>;
        export type CreateItemDto = z.infer<typeof createItemSchema>;
        export type UpdateItemDto = z.infer<typeof updateItemSchema>;
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="6" name="endpoint-generation" mandatory="true">
      <title>Генерация Endpoint</title>
      <instructions>
        <instruction order="1">Создать query или mutation definition</instruction>
        <instruction order="2">Добавить transformResponse с валидацией</instruction>
        <instruction order="3">Настроить providesTags или invalidatesTags</instruction>
      </instructions>
      <query-template>
        <![CDATA[
        get{EntityName}s: builder.query<{ResponseType}, {ArgType}>({
          query: (arg) => ({
            url: `/resource/${arg.id}`,
            params: arg.params,
          }),
          transformResponse: (response: unknown) => {
            return responseSchema.parse(response);
          },
          transformErrorResponse: (error: FetchBaseQueryError) => {
            // RFC 7807 handling
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: '{Resource}', id })),
                  { type: '{Resource}', id: 'LIST' },
                ]
              : [{ type: '{Resource}', id: 'LIST' }],
        }),
        ]]>
      </query-template>
      <mutation-template>
        <![CDATA[
        create{EntityName}: builder.mutation<{ResponseType}, {ArgType}>({
          query: (data) => ({
            url: 'resource',
            method: 'POST',
            body: data,
          }),
          transformResponse: (response: unknown) => responseSchema.parse(response),
          transformErrorResponse: handleRfc7807Error,
          invalidatesTags: [{ type: '{Resource}', id: 'LIST' }],
        }),
        ]]>
      </mutation-template>
    </instruction-group>

    <instruction-group order="7" name="error-handling" mandatory="true">
      <title>Обработка ошибок RFC 7807</title>
      <instructions>
        <instruction order="1">Добавить isRfc7807Error check</instruction>
        <instruction order="2">Обработать стандартные ошибки</instruction>
      </instructions>
      <template>
        <![CDATA[
        const isRfc7807Error = (error: FetchBaseQueryError): boolean => {
          return 'data' in error &&
                 typeof error.data === 'object' &&
                 error.data !== null &&
                 'type' in error.data;
        };

        transformErrorResponse: (error: FetchBaseQueryError) => {
          if (isRfc7807Error(error)) {
            const { type, title, detail, status } = error.data as Rfc7807Error;
            return { type, title, detail, status };
          }
          return {
            type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
            title: 'Unknown Error',
            detail: 'An unexpected error occurred',
            status: 500,
          };
        },
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="8" name="exports" mandatory="true">
      <title>Экспорт хуков</title>
      <instructions>
        <instruction order="1">Экспортировать автосгенерированные хуки</instruction>
        <instruction order="2">Обновить index.ts entity/feature</instruction>
      </instructions>
      <template>
        <![CDATA[
        // В API файле:
        export const {
          useGet{EntityName}sQuery,
          useLazyGet{EntityName}sQuery,
        } = {entityName}Api;

        // Для mutations:
        export const {
          useCreate{EntityName}Mutation,
          useUpdate{EntityName}Mutation,
          useDelete{EntityName}Mutation,
        } = {entityName}Api;

        // В index.ts:
        export type { Item, CreateItemDto } from './api/{entityName}Api';
        export { useGetItemQuery, useCreateItemMutation } from './api/{entityName}Api';
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="9" name="tag-types">
      <title>Обновление tagTypes</title>
      <instructions>
        <instruction order="1">Grep: baseApi.injectEndpoints</instruction>
        <instruction order="2">Если tag type не существует — добавить в baseApi</instruction>
      </instructions>
      <template>
        <![CDATA[
        tagTypes: ['User', 'Users', '{Entity}']

        // Или через enhanceEndpoints:
        .enhanceEndpoints({ addTagTypes: ['{Entity}'] })
        ]]>
      </template>
    </instruction-group>
  </instructions-section>

  <workflow-section mandatory="true">
    <phase order="1" name="locate">
      <step>Определить слой и сущность из контекста</step>
    </phase>
    <phase order="2" name="check">
      <step>Grep: проверить существование endpoint</step>
    </phase>
    <phase order="3" name="method">
      <step>Определить HTTP метод из контекста</step>
    </phase>
    <phase order="4" name="schema">
      <step>Найти или создать Zod schema</step>
    </phase>
    <phase order="5" name="types">
      <step>Вывести TypeScript типы из Zod</step>
    </phase>
    <phase order="6" name="endpoint">
      <step>Сгенерировать endpoint definition</step>
    </phase>
    <phase order="7" name="error">
      <step>Добавить RFC 7807 error handling</step>
    </phase>
    <phase order="8" name="export">
      <step>Экспортировать хуки и обновить Public API</step>
    </phase>
  </workflow-section>

  <output-format-section mandatory="true">
    <format>RTK Query API файл (.ts)</format>
    <requirements>
      <requirement order="1" priority="critical">Zod schemas для валидации</requirement>
      <requirement order="2" priority="critical">TypeScript типы (выведены из Zod)</requirement>
      <requirement order="3" priority="critical">RTK Query endpoint с правильной конфигурацией</requirement>
      <requirement order="4" priority="high">RFC 7807 error handling</requirement>
      <requirement order="5" priority="high">Cache tags (providesTags/invalidatesTags)</requirement>
      <requirement order="6" priority="high">Экспорт хуков для использования</requirement>
    </requirements>
  </output-format-section>

  <examples-section>
    <example id="1">
      <scenario>"Создай endpoint для получения списка пользователей"</scenario>
      <actions>
        <action order="1">Найти entities/user/api/userApi.ts</action>
        <action order="2">Создать schema для User</action>
        <action order="3">Добавить getUsers endpoint</action>
        <action order="4">Настроить providesTags</action>
        <action order="5">Экспортировать useGetUsersQuery</action>
      </actions>
    </example>
    <example id="2">
      <scenario>"Добавь endpoint для создания заказа"</scenario>
      <actions>
        <action order="1">Найти entities/order/api/orderApi.ts</action>
        <action order="2">Создать CreateOrderDto schema</action>
        <action order="3">Добавить createOrder mutation</action>
        <action order="4">Настроить invalidatesTags</action>
        <action order="5">Экспортировать useCreateOrderMutation</action>
      </actions>
    </example>
    <example id="3">
      <scenario>"Обнови supplier endpoint с Zod валидацией"</scenario>
      <actions>
        <action order="1">Найти существующий endpoint</action>
        <action order="2">Добавить Zod schema</action>
        <action order="3">Обновить transformResponse</action>
        <action order="4">Добавить RFC 7807 error handling</action>
      </actions>
    </example>
  </examples-section>

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Zod schema создана для response type</criterion>
      <criterion order="2" priority="critical">Transform response с валидацией присутствует</criterion>
      <criterion order="3" priority="high">RFC 7807 error handling реализован</criterion>
      <criterion order="4" priority="high">Cache tags настроены корректно</criterion>
      <criterion order="5" priority="medium">TypeScript хуки экспортированы</criterion>
      <criterion order="6" priority="medium">Public API обновлен</criterion>
    </success-criteria>
  </validation-section>
</skill-definition>
