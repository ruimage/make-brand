---
description: "Central command index - all available commands with prefix system"
---

# Claude Code Commands Index

Complete reference for all available commands with **prefix system** for easy identification.

## 🎯 Prefix System

| Prefix | Category | Example |
|--------|----------|----------|
| `qa-` | QA Frontend specialized | `/qa-feature` |
| `dev-` | General development | `/dev-api` |
| `test-` | Testing utilities | `/test-e2e` |
| `rev-` | Code review & quality | `/rev-code` |
| `git-` | Git workflows | `/git-mr` |
| `cmd-` | Quick shortcuts (root) | `/cmd-api` |

---

## 🚀 Quick Reference

### Root Shortcuts (`cmd-*`)
Quick aliases for most common tasks.

| Command | Full Command | Description |
|---------|--------------|-------------|
| [`/cmd-api`](./cmd-api.md) | `/dev-api` | Create API endpoint |
| [`/cmd-component`](./cmd-component.md) | `/dev-component` | Create component |
| [`/cmd-review`](./cmd-review.md) | `/rev-code` | Quick code review |
| [`/cmd-test`](./cmd-test.md) | `/test-e2e` | Quick E2E test |
| [`/cmd-fix`](./cmd-fix.md) | `/qa-fix` | Quick bug fix |
| [`/cmd-migrate`](./cmd-migrate.md) | `/qa-migrate` | Quick RTK migration |

---

## 📦 QA Frontend (`qa-*`)

*Specialized workflows for qa-frontend project*

| Command | Description | Usage |
|---------|-------------|-------|
| [`/qa-feature`](./qa/qa-feature.md) | Complete feature development | New functions with RTK Query + MUI |
| [`/qa-migrate`](./qa/qa-migrate.md) | Migrate to RTK Query | Convert thunks to modern API |
| [`/qa-fix`](./qa/qa-fix.md) | Bug fixing with TDD | Diagnose and fix bugs |
| [`/qa-perf`](./qa/qa-perf.md) | Performance optimization | Optimize component rendering |
| [`/qa-all`](./qa/qa-all.md) | Workflow launcher | All QA workflows hub |
| [`/qa-docs`](./qa/qa-docs.md) | Documentation reference | Context7 & library docs |

**Examples:**
```bash
/qa-feature "Create ReportFormsList with filtering"
/qa-migrate "reportForms slice"
/qa-fix "Filter not updating data"
/qa-perf "DataGrid slow with 1000 rows"
```

---

## 🔧 Development (`dev-*`)

*General development tools*

| Command | Description | Usage |
|---------|-------------|-------|
| [`/dev-api`](./dev/dev-api.md) | API endpoint generator | Create RTK Query endpoints |
| [`/dev-skill`](./dev/dev-skill.md) | Skill generator | Create custom skills |

**Examples:**
```bash
/dev-api "GET /api/qcp/report-forms with Zod validation"
/dev-skill "Create TypeScript validation skill"
```

---

## 🧪 Testing (`test-*`)

*Testing utilities*

| Command | Description | Usage |
|---------|-------------|-------|
| [`/test-e2e`](./test/test-e2e.md) | E2E test generator | Cypress E2E with Page Object |
| [`/test-comp`](./test/test-comp.md) | Component test generator | Cypress Component Testing |

**Examples:**
```bash
/test-e2e "User login and dashboard access"
/test-comp "ReportFormList filtering"
```

---

## 🔍 Review (`rev-*`)

*Code quality and review*

| Command | Description | Usage |
|---------|-------------|-------|
| [`/rev-code`](./review/rev-code.md) | Deep code review | Analyze code quality |
| [`/rev-perf`](./review/rev-perf.md) | Performance optimization | Optimize bottlenecks |
| [`/rev-docs`](./review/rev-docs.md) | Documentation check | Validate docs coverage |

**Examples:**
```bash
/rev-code "Check entities/warranty-claims/"
/rev-perf "Analyze ReportFormsList rendering"
/rev-docs "Validate API documentation"
```

---

## 📁 Git (`git-*`)

*Git workflows*

| Command | Description | Usage |
|---------|-------------|-------|
| [`/git-mr`](./git/git-mr.md) | Create GitLab MR | Create merge request |

**Examples:**
```bash
/git-mr "feat: add report forms filtering"
```

---

## 🎯 Command Decision Tree

```
What do you need?

├── Work on QA Frontend
│   ├── New feature → /qa-feature
│   ├── Migrate code → /qa-migrate
│   ├── Fix bug → /qa-fix
│   ├── Optimize → /qa-perf
│   └── List all → /qa-all
│
├── General Development
│   ├── Create API → /dev-api
│   └── Create skill → /dev-skill
│
├── Testing
│   ├── E2E test → /test-e2e
│   └── Component test → /test-comp
│
├── Code Quality
│   ├── Review code → /rev-code
│   ├── Optimize → /rev-perf
│   └── Check docs → /rev-docs
│
└── Git
    └── Create MR → /git-mr
```

---

## 💡 Naming Convention Explained

```
/{prefix}-{action}

Examples:
  qa-feature    → QA category, feature development
  dev-api       → Development category, API action
  test-e2e      → Test category, E2E action
  rev-code      → Review category, code review
```

**Prefix meanings:**
- `qa-` = QA Frontend specialized
- `dev-` = General development
- `test-` = Testing
- `rev-` = Review/Quality
- `git-` = Git/Version control
- `cmd-` = Shortcut (root level)

---

## 📋 Complete Command List

```
ROOT SHORTCUTS:
  /cmd-api       → Create API endpoint
  /cmd-component → Create component
  /cmd-review    → Quick code review
  /cmd-test      → Quick E2E test
  /cmd-fix       → Quick bug fix
  /cmd-migrate   → Quick RTK migration

QA FRONTEND:
  /qa-feature    → Complete feature development
  /qa-migrate    → Migrate to RTK Query
  /qa-fix        → Bug fixing with TDD
  /qa-perf       → Performance optimization
  /qa-all        → Workflow launcher hub
  /qa-docs       → Documentation reference

DEVELOPMENT:
  /dev-api       → API endpoint generator
  /dev-skill     → Skill generator

TESTING:
  /test-e2e      → E2E test generator
  /test-comp     → Component test generator

REVIEW:
  /rev-code      → Deep code review
  /rev-perf      → Performance optimization
  /rev-docs      → Documentation check

GIT:
  /git-mr        → Create GitLab MR
```

---

**Tip:** Use `/qa-all` to see all QA workflows or type `/` followed by tab to see available commands!
