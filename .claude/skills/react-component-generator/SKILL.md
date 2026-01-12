---
name: react-component-generator
description: "Генерирует React компонент с правильной FSD структурой, Material-UI интеграцией, TypeScript типизацией и data-testid атрибутами для тестирования"
allowed-tools: ["Glob", "Write", "Read"]
argument-hint: "<component-name> [<layer>/<entity>]"
ultrathink: true
---

<skill-definition>
  <metadata-section>
    <name>react-component-generator</name>
    <category>component-generation</category>
    <version>1.0</version>
    <triggers>создать компонент, component, React компонент, UI компонент, button, card, form</triggers>
    <description>
      Генерирует React компонент с правильной FSD структурой, Material-UI интеграцией,
      TypeScript типизацией и data-testid атрибутами для тестирования.
    </description>
  </metadata-section>

  <mission-section mandatory="true">
    <objective>
      Создать React компонент с правильной архитектурой, типизацией и тестированием.
    </objective>
  </mission-section>

  <instructions-section mandatory="true">
    <instruction-group order="1" name="path-parsing" mandatory="true">
      <title>Парсинг пути компонента</title>
      <instructions>
        <instruction order="1">Анализировать запрос для определения расположения</instruction>
        <instruction order="2">Распарсить путь: &lt;layer&gt;/&lt;entity-name&gt;/&lt;component-name&gt;</instruction>
      </instructions>
      <examples>
        <example>"создай UserCard в entities" → entities/user/ui/UserCard.tsx</example>
        <example>"добавь кнопку в shared" → shared/ui/Button/Button.tsx</example>
        <example>"LoginForm для auth" → features/auth/ui/LoginForm.tsx</example>
      </examples>
    </instruction-group>

    <instruction-group order="2" name="structure-check">
      <title>Проверка существующей структуры</title>
      <instructions>
        <instruction order="1">Glob: {layer}/{entity}/**</instruction>
        <instruction order="2">Если структура существует — проверить наличие ui/, lib/, model/</instruction>
        <instruction order="3">Если не существует — создать базовую FSD структуру</instruction>
      </instructions>
      <fsd-structure>
        <entity>api, model, ui, index.ts</entity>
        <feature>ui, model, api, lib, index.ts</feature>
        <shared>ui, lib, api, index.ts</shared>
      </fsd-structure>
    </instruction-group>

    <instruction-group order="3" name="component-type" mandatory="true">
      <title>Определение типа компонента</title>
      <instructions>
        <instruction order="1">Определить: Smart (Connected) или Dumb (Presentational)</instruction>
      </instructions>
      <types>
        <smart-component>
          <triggers>с данными, с API, smart</trigger>
          <location>entities, features, widgets</location>
          <uses>useAppSelector, RTK Query hooks</uses>
          <behavior>Подписывается на стор самостоятельно</behavior>
        </smart-component>
        <dumb-component>
          <triggers>по умолчанию для UI компонентов</triggers>
          <location>shared/ui, entities/ui, features/ui</location>
          <uses>только props</uses>
          <behavior>Не знает о Redux</behavior>
        </dumb-component>
      </types>
    </instruction-group>

    <instruction-group order="4" name="props-generation" mandatory="true">
      <title>Генерация Props Interface</title>
      <instructions>
        <instruction order="1">Использовать type, а не interface</instruction>
        <instruction order="2">Добавить суффикс Props к названию типа</instruction>
        <instruction order="3">Разделить на обязательные и опциональные props</instruction>
      </instructions>
      <template>
        <![CDATA[
        export type {ComponentName}Props = {
          // Обязательные props
          title: string;
          onSubmit: () => void;

          // Опциональные props
          disabled?: boolean;
          variant?: 'contained' | 'outlined';
          className?: string;

          // Children prop (если компонент-обертка)
          children?: React.ReactNode;
        };
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="5" name="component-structure" mandatory="true">
      <title>Генерация структуры компонента</title>
      <instructions>
        <instruction order="1">Использовать FunctionComponent тип</instruction>
        <instruction order="2">Добавить data-testid на корневой элемент</instruction>
        <instruction order="3">Использовать Material-UI компоненты</instruction>
        <instruction order="4">Стилизация через sx prop (не styled components)</instruction>
      </instructions>
      <dumb-template>
        <![CDATA[
        import React, { FunctionComponent } from 'react';
        import { Box, Typography, Button } from '@mui/material';

        export type {ComponentName}Props = { /* ... */ };

        export const {ComponentName}: FunctionComponent<{ComponentName}Props> = ({
          title,
          onSubmit,
          disabled = false,
          variant = 'contained',
        }) => {
          const handleClick = () => {
            onSubmit();
          };

          return (
            <Box data-testid="{component-name}">
              <Typography variant="h6">{title}</Typography>
              <Button
                data-testid="{component-name}-submit"
                variant={variant}
                onClick={handleClick}
                disabled={disabled}
              >
                Submit
              </Button>
            </Box>
          );
        };
        ]]>
      </dumb-template>
      <smart-template>
        <![CDATA[
        import React, { FunctionComponent } from 'react';
        import { Box, CircularProgress, Typography } from '@mui/material';
        import { useAppSelector } from 'store/hooks';
        import { useGetUserQuery } from '../api/userApi';

        export type {ComponentName}Props = {
          userId: string;
        };

        export const {ComponentName}: FunctionComponent<{ComponentName}Props> = ({ userId }) => {
          const { data: user, isLoading, error } = useGetUserQuery(userId);

          if (isLoading) {
            return (
              <Box data-testid="{component-name}-loading" display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            );
          }

          if (error) {
            return (
              <Box data-testid="{component-name}-error">
                <Typography color="error">Failed to load data</Typography>
              </Box>
            );
          }

          return (
            <Box data-testid="{component-name}" p={2}>
              <Typography variant="h5">{user.name}</Typography>
            </Box>
          );
        };
        ]]>
      </smart-template>
    </instruction-group>

    <instruction-group order="6" name="mui-integration" mandatory="true">
      <title>Интеграция Material-UI</title>
      <instructions>
        <instruction order="1">Использовать sx prop вместо styled components</instruction>
        <instruction order="2">Добавить адаптивные стили через breakpoints</instruction>
      </instructions>
      <template>
        <![CDATA[
        <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
          </CardContent>
        </Card>

        // Адаптивные стили
        <Box
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            p: { xs: 2, md: 4 },
          }}
        >
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="7" name="event-handlers">
      <title>Обработчики событий</title>
      <instructions>
        <instruction order="1">Добавить onClick, onSubmit и другие обработчики</instruction>
        <instruction order="2">Для preventDefault использовать useCallback</instruction>
      </instructions>
      <template>
        <![CDATA[
        const handleSubmit = useCallback((e: React.FormEvent) => {
          e.preventDefault();
          onSubmit?.();
        }, [onSubmit]);
        ]]>
      </template>
    </instruction-group>

    <instruction-group order="8" name="exports" mandatory="true">
      <title>Экспорт компонента</title>
      <instructions>
        <instruction order="1">Экспортировать тип и компонент из файла</instruction>
        <instruction order="2">Добавить в index.ts слоя</instruction>
      </instructions>
      <template>
        <![CDATA[
        // В файле компонента:
        export type { {ComponentName}Props };
        export const {ComponentName}: FunctionComponent<{ComponentName}Props> = ...;

        // В index.ts слоя:
        export type { {ComponentName}Props } from './ui/{ComponentName}';
        export { {ComponentName} } from './ui/{ComponentName}';
        ]]>
      </template>
    </instruction-group>
  </instructions-section>

  <workflow-section mandatory="true">
    <phase order="1" name="parse">
      <step>Парсить путь компонента из запроса</step>
    </phase>
    <phase order="2" name="check">
      <step>Glob: проверить существующую структуру</step>
    </phase>
    <phase order="3" name="determine">
      <step>Определить тип компонента (smart/dumb)</step>
    </phase>
    <phase order="4" name="generate">
      <step>Сгенерировать компонент с Props и структурой</step>
    </phase>
    <phase order="5" name="write">
      <step>Write: создать файл компонента</step>
    </phase>
    <phase order="6" name="export">
      <step>Обновить index.ts для экспорта</step>
    </phase>
  </workflow-section>

  <output-format-section mandatory="true">
    <format>React компонент (.tsx)</format>
    <requirements>
      <requirement order="1" priority="critical">Правильная FSD структура</requirement>
      <requirement order="2" priority="critical">TypeScript Props interface (суффикс Props)</requirement>
      <requirement order="3" priority="critical">FunctionComponent тип</requirement>
      <requirement order="4" priority="high">Material-UI компоненты</requirement>
      <requirement order="5" priority="high">sx prop для стилей</requirement>
      <requirement order="6" priority="high">data-testid атрибуты</requirement>
      <requirement order="7" priority="medium">Обработчики событий</requirement>
      <requirement order="8" priority="medium">Экспорты типов и компонента</requirement>
    </requirements>
  </output-format-section>

  <examples-section>
    <example id="1">
      <scenario>"Создай кнопку в shared/ui"</scenario>
      <actions>
        <action order="1">Создать shared/ui/Button/Button.tsx</action>
        <action order="2">Добавить Props с variant, color, disabled</action>
        <action order="3">Использовать MuiButton с sx prop</action>
        <action order="4">Добавить data-testid="button"</action>
        <action order="5">Экспортировать из index.ts</action>
      </actions>
    </example>
    <example id="2">
      <scenario>"Добавь UserCard компонент с данными пользователя"</scenario>
      <actions>
        <action order="1">Создать entities/user/ui/UserCard.tsx</action>
        <action order="2">Добавить useGetUserQuery hook</action>
        <action order="3">Обработать loading/error states</action>
        <action order="4">Добавить data-testid атрибуты</action>
        <action order="5">Экспортировать из entities/user/index.ts</action>
      </actions>
    </example>
    <example id="3">
      <scenario>"Создай форму входа с Material-UI"</scenario>
      <actions>
        <action order="1">Создать features/auth/ui/LoginForm.tsx</action>
        <action order="2">Добавить TextField для email/password</action>
        <action order="3">Добавить Button для submit</action>
        <action order="4">Добавить обработчик onSubmit</action>
        <action order="5">Использовать Stack для layout</action>
      </actions>
    </example>
  </examples-section>

  <validation-section mandatory="true">
    <success-criteria>
      <criterion order="1" priority="critical">Компонент использует FunctionComponent</criterion>
      <criterion order="2" priority="critical">Props имеют суффикс Props и используют type</criterion>
      <criterion order="3" priority="high">data-testid присутствует на корневом элементе</criterion>
      <criterion order="4" priority="high">Используются Material-UI компоненты</criterion>
      <criterion order="5" priority="high">Стилизация через sx prop</criterion>
      <criterion order="6" priority="medium">Правильные экспорты</criterion>
    </success-criteria>
  </validation-section>
</skill-definition>
