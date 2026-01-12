# QA Frontend Commands (`qa-*`)

Specialized workflows for **qa-frontend** project.

## Commands

| Command | File | Description |
|---------|------|-------------|
| `/qa-feature` | `qa-feature.md` | Complete feature development |
| `/qa-migrate` | `qa-migrate.md` | Migrate to RTK Query |
| `/qa-fix` | `qa-fix.md` | Bug fixing with TDD |
| `/qa-perf` | `qa-perf.md` | Performance optimization |
| `/qa-all` | `qa-all.md` | Workflow launcher hub |
| `/qa-docs` | `qa-docs.md` | Documentation reference |

## Examples

```bash
/qa-feature "Create ReportFormsList with filtering"
/qa-migrate "reportForms slice"
/qa-fix "Filter not updating data"
/qa-perf "DataGrid slow with 1000 rows"
/qa-all
/qa-docs "Material-UI DataGrid"
```

## Shortcut

Use `/cmd-api`, `/cmd-fix`, `/cmd-migrate` for quick access from root.
