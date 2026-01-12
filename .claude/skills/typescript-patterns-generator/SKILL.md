---
name: typescript-patterns-generator
description: "Генерирует TypeScript паттерны: discriminated unions, branded types, utility types, type guards с использованием Zod для валидации"
allowed-tools: ["Write", "Read"]
argument-hint: "<pattern-type> <name>"
ultrathink: true
---

<skill-definition>
  <metadata-section>
    <name>typescript-patterns-generator</name>
    <category>typescript-patterns</category>
    <version>1.0</version>
    <triggers>discriminated union, branded type, type guard, TypeScript паттерн, utility type</triggers>
    <description>
      Генерирует TypeScript паттерны согласно best practices: discriminated unions,
      branded types, utility types, type guards с использованием Zod для валидации.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Создать TypeScript паттерн с правильной типизацией, валидацией и type guards.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="pattern-detection" mandatory="true">
      <title>Определение типа паттерна</title>
      <instructions>
        <instruction order="1">Анализировать запрос для определения типа паттерна</instruction>
      </instructions>
      <keywords>
        <keyword pattern="discriminated-union">state, async state, loading</keyword>
        <keyword pattern="branded-type">branded, nominal type, UserId, Email</keyword>
        <keyword pattern="type-guard">type guard, isUser, isValid</keyword>
        <keyword pattern="utility-type">utility, Partial, Required</keyword>
        <keyword pattern="zod-schema">schema, validation, Zod</keyword>
      </keywords>
    </instruction-group>

    <instruction-group order="2" name="discriminated-union">
      <title>Discriminated Union</title>
      <instructions>
        <instruction order="1">Создать discriminated union для асинхронного состояния</instruction>
        <instruction order="2">Добавить type guards (isSuccess, isError)</instruction>
      </instructions>
      <templates>
        <async-state>
          <![CDATA[
          export type AsyncState<T, E = Error> =
            | { status: 'idle' }
            | { status: 'loading' }
            | { status: 'success'; data: T }
            | { status: 'error'; error: E };

          // Type guards
          export const isSuccess = <T, E>(state: AsyncState<T, E>): state is Extract<AsyncState<T, E>, { status: 'success' }> => {
            return state.status === 'success';
          };

          export const isError = <T, E>(state: AsyncState<T, E>): state is Extract<AsyncState<T, E>, { status: 'error' }> => {
            return state.status === 'error';
          };

          // Usage
          export const UserState = AsyncState<User>;
          ]]>
        </async-state>
        <business-state>
          <![CDATA[
          export type OrderStatus =
            | { status: 'draft' }
            | { status: 'pending_approval'; approvedBy: string | null }
            | { status: 'approved'; approvedBy: string; approvedAt: string }
            | { status: 'rejected'; rejectedBy: string; reason: string };
          ]]>
        </business-state>
      </templates>
    </instruction-group>

    <instruction-group order="3" name="branded-type">
      <title>Branded Type</title>
      <instructions>
        <instruction order="1">Создать Brand базовый тип</instruction>
        <instruction order="2">Добавить constructor с валидацией</instruction>
        <instruction order="3">Создать type guard</instruction>
      </instructions>
      <templates>
        <base-brand>
          <![CDATA[
          export type Brand<T, B extends string> = T & { readonly __brand: B };
          ]]>
        </base-brand>
        <user-id>
          <![CDATA[
          export type UserId = Brand<string, 'UserId'>;

          export const createUserId = (id: string): UserId => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
              throw new Error(`Invalid UUID format: ${id}`);
            }
            return id as UserId;
          };

          export const isUserId = (value: unknown): value is UserId => {
            if (typeof value !== 'string') return false;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(value);
          };

          // Использование
          const userId: UserId = createUserId('123e4567-e89b-12d3-a456-426614174000');
          // userId: UserId = 'regular-string'; // ❌ Error
          ]]>
        </user-id>
        <business-brands>
          <![CDATA[
          export type Email = Brand<string, 'Email'>;
          export type PhoneNumber = Brand<string, 'PhoneNumber'>;
          export type PositiveNumber = Brand<number, 'PositiveNumber'>;
          export type NonEmptyString = Brand<string, 'NonEmptyString'>;
          ]]>
        </business-brands>
      </templates>
    </instruction-group>

    <instruction-group order="4" name="type-guard">
      <title>Type Guard</title>
      <instructions>
        <instruction order="1">Создать type guard для runtime проверки</instruction>
        <instruction order="2">Использовать Zod для сложных объектов</instruction>
      </instructions>
      <templates>
        <primitive-guards>
          <![CDATA[
          export const isString = (value: unknown): value is string => {
            return typeof value === 'string';
          };

          export const isNumber = (value: unknown): value is number => {
            return typeof value === 'number' && !isNaN(value);
          };
          ]]>
        </primitive-guards>
        <zod-guard>
          <![CDATA[
          import { z } from 'zod';

          export const userSchema = z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
          });

          export type User = z.infer<typeof userSchema>;

          export const isUser = (value: unknown): value is User => {
            return userSchema.safeParse(value).success;
          };

          // Array filtering
          const values: unknown[] = [/* ... */];
          const users: User[] = values.filter(isUser);

          // Type assertion function
          export const assertIsUser = (value: unknown): asserts value is User => {
            if (!isUser(value)) {
              throw new Error('Value is not a valid User');
            }
          };
          ]]>
        </zod-guard>
      </templates>
    </instruction-group>

    <instruction-group order="5" name="utility-types">
      <title>Utility Types</title>
      <instructions>
        <instruction order="1">Создать utility types для трансформации</instruction>
      </instructions>
      <templates>
        <![CDATA[
        // Все поля опциональны
        export type MakeOptional<T> = {
          [P in keyof T]?: T[P];
        };

        // Все поля обязательны
        export type MakeRequired<T> = {
          [P in keyof T]-?: T[P];
        };

        // Рекурсивный Partial
        export type DeepPartial<T> = {
          [P in keyof T]?: T[P] extends object
            ? DeepPartial<T[P]>
            : T[P];
        };

        // Pick с переименованием
        export type Rename<T, K extends keyof T, N extends string> = {
          [P in keyof T as P extends K ? N : P]: T[P];
        };

        // Extract promise type
        export type Awaited<T> = T extends Promise<infer U> ? U : T;
        ]]>
      </templates>
    </instruction-group>

    <instruction-group order="6" name="zod-schema">
      <title>Zod Schema</title>
      <instructions>
        <instruction order="1">Создать Zod schema для сущности</instruction>
        <instruction order="2">Вывести типы через z.infer</instruction>
        <instruction order="3">Добавить функции валидации</instruction>
      </instructions>
      <templates>
        <![CDATA[
        import { z } from 'zod';

        export const userSchema = z.object({
          id: z.string().uuid(),
          name: z.string().min(1).max(100),
          email: z.string().email(),
          age: z.number().int().positive().optional(),
          isActive: z.boolean().default(true),
          createdAt: z.string().datetime(),
          role: z.enum(['admin', 'user', 'guest']),
        });

        export type User = z.infer<typeof userSchema>;
        export type CreateUserDto = z.input<typeof userSchema>;
        export type UserOutput = z.output<typeof userSchema>;

        export const validateUser = (data: unknown): User => {
          return userSchema.parse(data);
        };

        export const safeValidateUser = (data: unknown): User | null => {
          const result = userSchema.safeParse(data);
          return result.success ? result.data : null;
        };

        // Discriminated union с Zod
        export const asyncStateSchema = z.discriminatedUnion('status', [
          z.object({ status: z.literal('idle') }),
          z.object({ status: z.literal('loading') }),
          z.object({
            status: z.literal('success'),
            data: z.object({ /* ... */ }),
          }),
          z.object({
            status: z.literal('error'),
            error: z.instanceof(Error),
          }),
        ]);

        export type AsyncState = z.infer<typeof asyncStateSchema>;
        ]]>
      </templates>
    </instruction-group>
  </instructions-section>

  <workflow-section mandatory="true">
    <phase order="1" name="detect">
      <step>Определить тип паттерна из контекста</step>
    </phase>
    <phase order="2" name="generate">
      <step>Сгенерировать код паттерна</step>
    </phase>
    <phase order="3" name="write">
      <step>Write: создать файл с паттерном</step>
    </phase>
  </workflow-section>

  <output-format-section mandatory="true">
    <format>TypeScript код (.ts)</format>
    <requirements>
      <requirement order="1" priority="critical">Использовать type вместо interface</requirement>
      <requirement order="2" priority="critical">Discriminated unions для состояний</requirement>
      <requirement order="3" priority="high">Zod для валидации и вывода типов</requirement>
      <requirement order="4" priority="high">Type guards для runtime проверки</requirement>
      <requirement order="5" priority="medium">Branded types для номинальной типизации</requirement>
    </requirements>
  </output-format-section>

  <examples-section>
    <example id="1">
      <scenario>"Создай discriminated union для асинхронного состояния"</scenario>
      <actions>
        <action order="1">Создать AsyncState&lt;T, E&gt; тип</action>
        <action order="2">Добавить type guards (isSuccess, isError)</action>
        <action order="3">Показать пример использования с компонентом</action>
      </actions>
    </example>
    <example id="2">
      <scenario>"Добавь branded type для UserId"</scenario>
      <actions>
        <action order="1">Создать UserId = Brand&lt;string, 'UserId'&gt;</action>
        <action order="2">Добавить createUserId с валидацией UUID</action>
        <action order="3">Создать type guard isUserId</action>
        <action order="4">Показать пример использования</action>
      </actions>
    </example>
    <example id="3">
      <scenario>"Создай type guard для User с Zod"</scenario>
      <actions>
        <action order="1">Создать Zod schema для User</action>
        <action order="2">Вывести тип через z.infer</action>
        <action order="3">Создать type guard isUser</action>
        <action order="4">Добавить assertion function</action>
        <action order="5">Показать примеры использования</action>
      </actions>
    </example>
    <example id="4">
      <scenario>"Создай utility types для трансформации"</scenario>
      <actions>
        <action order="1">Создать MakeOptional, MakeRequired</action>
        <action order="2">Добавить DeepPartial</action>
        <action order="3">Создать Rename, OmitMultiple</action>
        <action order="4">Показать примеры использования</action>
      </actions>
    </example>
  </examples-section>

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Используется type вместо interface</criterion>
      <criterion order="2" priority="critical">Discriminated unions для состояний</criterion>
      <criterion order="3" priority="high">Zod для валидации и вывода типов</criterion>
      <criterion order="4" priority="high">Type guards для runtime проверки</criterion>
      <criterion order="5" priority="medium">Branded types для номинальной типизации</criterion>
    </success-criteria>
  </validation-section>
</skill-definition>
