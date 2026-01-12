# Agent Skills Generator

Агент для создания Agent Skills — модульных пакетов, расширяющих возможности AI-агентов согласно открытому стандарту [agentskills.io](https://agentskills.io).

## Что такое Agent Skills?

Agent Skills — это директории, содержащие:

```
skill-name/
├── SKILL.md          # Обязательный: YAML frontmatter + Markdown инструкции
├── scripts/          # Опционально: Выполняемый код (Python, Bash, etc.)
├── references/       # Опционально: Документация, загружаемая по запросу
└── assets/           # Опционально: Шаблоны, изображения, шрифты, etc.
```

## Как использовать этот агент

### Создание нового навыка

Просто спросите:

> "Создай навык для обработки PDF файлов"
> "Создай skill для генерации React компонентов"
> "Создай agent skill для интеграции с GitHub API"

Агент проведёт вас через процесс:

1. **Понимание задачи** — задаст уточняющие вопросы
2. **Выбор структуры** — workflow-based, task-based, reference/guidelines, или capabilities-based
3. **Генерация SKILL.md** — с правильным frontmatter и контентом
4. **Создание ресурсов** — scripts/, references/, assets/ при необходимости
5. **Валидация** — проверка соответствия спецификации

### Структура навыка

#### Frontmatter (обязательный)

```yaml
---
name: skill-name
description: Что делает навык И когда его использовать (max 1024 символа)
license: Apache-2.0  # Опционально
metadata:
  author: ваше-имя
  version: "1.0"
---
```

**Требования к имени:**
- 1-64 символа
- Только строчные буквы, цифры и дефисы
- Не может начинаться или заканчиваться дефисом
- Не может содержать последовательные дефисы

**Требования к описанию:**
- 1-1024 символа
- Должно описывать ЧТО навык делает И КОГДА его использовать
- Не должно содержать угловые скобки

### Паттерны структуры навыка

#### 1. Workflow-Based (Последовательные процессы)

Лучше для: Многошаговых процедур

```markdown
## Workflow Decision Tree
**Creating new?** → Creation Workflow
**Editing existing?** → Editing Workflow

## Creation Workflow
### Step 1: {Action}
[Instructions]
```

**Примеры:** DOCX редактирование, PDF формы, деплоймент

#### 2. Task-Based (Коллекции инструментов)

Лучше для: Связанных операций

```markdown
## Quick Start
[Basic usage]

## Task Category 1
[Instructions]

## Task Category 2
[Instructions]
```

**Примеры:** PDF манипуляции, обработка изображений

#### 3. Reference/Guidelines (Стандарты)

Лучше для: Стилевых гайдов, спецификаций

```markdown
## Guidelines
### Rule 1: [Name]
[Description + examples]
```

**Примеры:** Brand guidelines, code style

#### 4. Capabilities-Based (Интегрированные системы)

Лучше для: Множества связанных функций

```markdown
## Core Capabilities
### 1. [Feature Name]
[Description + usage]
```

**Примеры:** Product management, CI/CD

## Принципы Progressive Disclosure

1. **Metadata (~100 токенов)** — всегда загружены при старте
   - `name` и `description`

2. **Instructions (<5000 токенов)** — загружаются при активации
   - SKILL.md body, рекомендуется <500 строк

3. **Resources (по запросу)** — загружаются только когда нужны
   - `scripts/` — выполняются без чтения
   - `references/` — читаются при необходимости
   - `assets/` — используются в выводе

## Примеры описаний

### Хорошее описание

```yaml
description: |
  Comprehensive PDF manipulation: extract text/tables, fill forms, merge/split.
  Use when: user mentions PDF, forms, document processing, or PDF operations.
```

### Плохое описание

```yaml
description: Helps with PDFs.
```

## Скрипты

### Python (требует установленный Python)

```bash
# Создание нового навыка
python scripts/init_skill.py my-skill --path ./skills

# Валидация
python scripts/validate.py ./my-skill

# Упаковка в .skill файл
python scripts/package.py ./my-skill
```

### Bash (работает без Python)

```bash
# Создание нового навыка
bash scripts/init_skill.sh my-skill ./skills

# Быстрая проверка
bash scripts/quick_check.sh ./my-skill
```

## Валидация

Перед использованием навык должен пройти валидацию:

- [ ] YAML frontmatter валидный
- [ ] `name` соответствует hyphen-case
- [ ] `description` описывает ЧТО и КОГДА
- [ ] SKILL.md <500 строк
- [ ] Нет дублирования между SKILL.md и references/
- [ ] Нет вспомогательных файлов (README.md, INSTALLATION.md, etc.)

## Ресурсы

- [Спецификация Agent Skills](https://agentskills.io/specification)
- [Примеры навыков](https://github.com/anthropics/skills)
- [Лучшие практики](https://agentskills.io/best-practices)

## Дополнительные материалы

### Шаблоны

См. `references/templates.md` для:
- Шаблонов всех 4 паттернов структуры
- Шаблонов скриптов
- Шаблонов reference документации

### Валидация

См. `references/validation.md` для:
- Полного чеклиста валидации
- Общих ошибок и решений
- Процедур тестирования
