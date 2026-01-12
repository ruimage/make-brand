---
description: QA Frontend workflow launcher - access all qa-frontend development workflows from one command
argument-hint: "Workflow number (1-4) or 'list' to see all available workflows"
---

# QA Frontend Workflows

Central hub for all qa-frontend development workflows.

## Available Workflows

| Command | Description | Use Case |
|---------|-------------|----------|
| `/qa-feature-dev` | **Complete feature development** | Building new features with RTK Query + Material-UI |
| `/qa-migrate-rtk` | **Migrate to RTK Query** | Converting thunks to modern RTK Query |
| `/qa-bug-fix` | **Bug fixing with TDD** | Fixing bugs with test-driven approach |
| `/qa-performance` | **Performance optimization** | Optimizing component rendering |
| `/qa-setup` | **Context7 documentation** | Library documentation quick reference |

## Quick Start

```
# Start a new feature
/qa-feature-dev "Create warranty claims dashboard with filters and charts"

# Migrate existing code
/qa-migrate-rtk "reportForms"

# Fix a bug
/qa-bug-fix "Filter dropdown not updating the list"

# Optimize performance
/qa-performance "ReportFormsList renders slowly with 1000 rows"

# Get documentation help
/qa-setup "Material-UI DataGrid filtering"
```

## Workflow Decision Tree

```
What do you need to do?

├── Create NEW functionality
│   └── /qa-feature-dev "description"
│       → RTK Query endpoint
│       → Material-UI component
│       → TDD tests
│       → Code review
│
├── Improve EXISTING code
│   ├── Convert thunks to RTK Query
│   │   └── /qa-migrate-rtk "slice-name"
│   │
│   ├── Fix a bug
│   │   └── /qa-bug-fix "bug description"
│   │       → Diagnose
│   │       → Write failing test
│   │       → Fix
│   │       → Validate
│   │
│   └── Improve performance
│       └── /qa-performance "component name"
│           → Analyze
│           → Apply optimizations
│           → Measure
│
└── Get documentation
    └── /qa-setup "library name"
```

## Skills Auto-Activation

The **qa-frontend** skill automatically activates when:
- Working in `qa-frontend/` directory
- Editing Redux slices or store
- Creating Material-UI components
- Writing Vitest/Cypress tests
- Using Rambda functions

This gives Claude context about:
- Project structure (FSD architecture)
- Technology stack versions
- Code patterns and conventions
- Testing approaches
- Quality standards

## Installed MCP Servers (Always Available)

```
✓ redux-toolkit    → Redux Toolkit docs
✓ rambda           → Rambda functional programming
✓ cypress          → Cypress testing
✓ effect-docs      → Effect.ts documentation
✓ context7         → Any library documentation
✓ filesystem       → File operations
✓ memory           → Context memory
✓ mermaid          → Diagrams
✓ web-search       → Web search
```

## Quality Commands Reference

```bash
# Quick quality check
npm run quality:quick

# Pre-commit (full check)
npm run quality:pre-commit

# Type check only
npm run type-check:fast

# Tests only
npm run test:run:once

# Lint with fix
npm run lint:fix

# Format code
npm run format

# Analyze dependencies
npm run analyze:deps:circular

# Analyze architecture
npm run analyze:architecture:validate
```

## Conventional Commit Format

```
type(scope): description

# Types:
feat     - New feature
fix      - Bug fix
perf     - Performance improvement
refactor - Code refactoring
test     - Adding tests
docs     - Documentation
style    - Code style (formatting)
chore    - Maintenance tasks

# Examples:
feat(report-forms): add data grid with filtering
bugfix(warranty-claims): fix status not updating
perf(forms-list): optimize rendering with useMemo
refactor(auth): migrate to RTK Query pattern
```

## File Structure Reference

```
qa-frontend/
├── src/
│   ├── app/                    # App config, providers, routing
│   ├── pages/                  # Route pages
│   ├── widgets/                # Composite components (page sections)
│   ├── features/               # Business features
│   ├── entities/               # Business entities (core domain)
│   ├── shared/                 # Reusable code
│   │   ├── api/                # API utilities
│   │   ├── lib/                # Utilities (Rambda functions)
│   │   ├── hooks/              # Custom React hooks
│   │   └── ui/                 # Base UI components
│   └── processes/              # Cross-feature processes
├── cypress/                    # E2E tests
├── scripts/                    # Build and analysis scripts
└── package.json                # Dependencies and scripts
```

## Tips for Best Results

1. **Be specific** - Provide detailed descriptions for features
2. **Context matters** - Mention related components or patterns
3. **Test first** - Use TDD approach for bug fixes
4. **Measure twice** - Always validate after optimizations
5. **Ask questions** - Claude will ask for clarification when needed

## Example Session

```
You: /qa-feature-dev "Create a ReportFormsList with status filter and search"

Claude: I'll help you create a complete feature. Let me break this down:

1. Creating RTK Query endpoint with Zod schema...
2. Generating Material-UI DataGrid component...
3. Writing Vitest tests...
4. Running quality checks...

[Proceeds with implementation]
```

---

**Get started now:** Pick a workflow command above and describe what you need to build!
