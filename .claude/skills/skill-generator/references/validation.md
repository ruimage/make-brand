# Agent Skills Validation Guide

This file provides complete validation procedures for Agent Skills.

## Validation Checklist

### Frontmatter Validation

- [ ] YAML frontmatter exists and is properly formatted
- [ ] Starts with `---` and ends with `---`
- [ ] `name` field is present and valid
  - 1-64 characters
  - Only lowercase letters, numbers, and hyphens
  - Does not start or end with `-`
  - Does not contain consecutive hyphens (`--`)
  - Matches directory name
- [ ] `description` field is present and valid
  - 1-1024 characters
  - Describes both WHAT the skill does AND WHEN to use it
  - No angle brackets (`<` or `>`)
- [ ] Optional fields are valid (if present)
  - `license`: License name or file reference
  - `compatibility`: Environment requirements
  - `metadata`: Key-value pairs
  - `allowed-tools`: Space-delimited tool list

### Description Quality Check

**Good description examples:**
```yaml
# Comprehensive and actionable
description: |
  PDF manipulation toolkit: extract text/tables, create PDFs, merge/split documents, fill forms.
  Use when: working with PDF files, user mentions PDF processing, form filling, or document manipulation.

# Clear trigger conditions
description: |
  Creates React components with FSD architecture, Material-UI, and TypeScript.
  Use when: user asks to create components, mentions React/TSX, or needs UI elements.
```

**Poor description examples:**
```yaml
# Too vague
description: Helps with PDFs.

# Missing "when to use"
description: Comprehensive PDF toolkit with extraction, creation, and manipulation features.

# Too generic
description: A skill for processing documents.
```

### SKILL.md Content Validation

- [ ] SKILL.md is under 500 lines (recommended)
- [ ] SKILL.md contains essential content only
- [ ] No auxiliary documentation files (README.md, INSTALLATION.md, etc.)
- [ ] File references use relative paths
- [ ] References are one level deep (no nested reference chains)
- [ ] Imperative/infinitive form used for instructions
- [ ] Code examples are tested and accurate

### Directory Structure Validation

- [ ] Required: SKILL.md exists at root
- [ ] Optional directories exist only if needed:
  - `scripts/` - Only if executable code is included
  - `references/` - Only if additional documentation is needed
  - `assets/` - Only if output resources are included
- [ ] No extra documentation files
- [ ] Scripts are executable and tested

### Progressive Disclosure Validation

- [ ] Metadata (~100 tokens): name + description only
- [ ] Instructions (<5000 tokens): SKILL.md body when loaded
- [ ] Resources: Loaded on demand only

**Content placement check:**
- [ ] Core procedural instructions → SKILL.md
- [ ] Detailed reference material → references/
- [ ] Reusable code → scripts/
- [ ] Output templates → assets/
- [ ] No duplication between SKILL.md and references/

## Common Validation Errors

### Error 1: Invalid Name Format

```
❌ name: PDF-Processing  # Uppercase not allowed
❌ name: -pdf           # Cannot start with hyphen
❌ name: pdf--processing # Consecutive hyphens
❌ name: pdf processing  # Spaces not allowed

✅ name: pdf-processing
✅ name: pdf-forms
✅ name: react-component-generator
```

### Error 2: Poor Description

```
❌ description: A helpful tool for documents.
✅ description: |
   PDF manipulation: extract text/tables, fill forms, merge/split.
   Use when: user mentions PDF, forms, or document processing.
```

### Error 3: SKILL.md Too Long

**Problem:** SKILL.md exceeds 500 lines with extensive documentation

**Solution:** Split content into references/

```markdown
## Quick Start
[Basic usage - keep in SKILL.md]

## Advanced Features
- Advanced topic 1: See [ADVANCED1.md](references/advanced1.md)
- Advanced topic 2: See [ADVANCED2.md](references/advanced2.md)
```

### Error 4: Duplicate Content

**Problem:** Same information in both SKILL.md and references/

**Solution:** Keep in one place only

- SKILL.md: Essential procedural instructions + workflow guidance
- references/: Detailed reference material, API docs, examples

### Error 5: Auxiliary Files

**Problem:** Extra documentation files that clutter the skill

```
❌ README.md
❌ INSTALLATION.md
❌ CHANGELOG.md
❌ QUICK_START.md
❌ CONTRIBUTING.md

✅ SKILL.md (only required file)
✅ references/ (only if needed)
✅ scripts/ (only if needed)
✅ assets/ (only if needed)
```

## Testing Procedures

### 1. Frontmatter Parsing Test

Parse the YAML frontmatter and verify:

```python
import yaml
import re

with open('SKILL.md') as f:
    content = f.read()

match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if not match:
    print("❌ No valid frontmatter found")

frontmatter = yaml.safe_load(match.group(1))

# Check required fields
if 'name' not in frontmatter:
    print("❌ Missing 'name' field")
if 'description' not in frontmatter:
    print("❌ Missing 'description' field")

# Validate name format
name = frontmatter['name']
if not re.match(r'^[a-z0-9-]+$', name):
    print(f"❌ Invalid name format: {name}")
if name.startswith('-') or name.endswith('-'):
    print(f"❌ Name cannot start/end with hyphen: {name}")
if '--' in name:
    print(f"❌ Name cannot have consecutive hyphens: {name}")
```

### 2. Description Quality Test

Verify description answers both questions:

```python
description = frontmatter['description']

# Check length
if len(description) > 1024:
    print(f"❌ Description too long: {len(description)} chars")

# Check for trigger keywords
if 'use when' not in description.lower():
    print("⚠️  Description should include 'Use when:' clause")

# Check for specific triggers
if 'when user' not in description.lower() and 'mention' not in description.lower():
    print("⚠️  Description should specify trigger conditions")
```

### 3. File Structure Test

Verify directory structure:

```python
from pathlib import Path

skill_dir = Path('.')

# Required files
if not (skill_dir / 'SKILL.md').exists():
    print("❌ SKILL.md not found")

# Check for forbidden files
forbidden = ['README.md', 'INSTALLATION.md', 'CHANGELOG.md']
for f in forbidden:
    if (skill_dir / f).exists():
        print(f"❌ Forbidden file found: {f}")

# Check optional directories
for d in ['scripts', 'references', 'assets']:
    if (skill_dir / d).exists() and not (skill_dir / d).is_dir():
        print(f"❌ {d}/ should be a directory")
```

### 4. Content Length Test

```python
# Check SKILL.md length
skill_md = (skill_dir / 'SKILL.md').read_text()
lines = skill_md.split('\n')

# Count lines after frontmatter
body_start = 0
for i, line in enumerate(lines):
    if line.strip() == '---' and i > 0:
        body_start = i + 1
        break

body_lines = len(lines) - body_start
if body_lines > 500:
    print(f"⚠️  SKILL.md body has {body_lines} lines (recommended: <500)")
```

## Pre-Packaging Validation

Before packaging as `.skill` file:

```bash
# 1. Run validation script
python scripts/quick_validate.py .

# 2. Test skill content
grep -r "TODO" SKILL.md  # Should be no TODOs
head -20 SKILL.md        # Verify frontmatter

# 3. Check file count
find . -type f | wc -l   # Should be minimal

# 4. Create package
python scripts/package_skill.py .
```

## Automated Validation Script

Use `quick_validate.py` for automated checking:

```bash
python scripts/quick_validate.py /path/to/skill
```

Exit codes:
- `0`: Validation passed
- `1`: Validation failed

## Post-Creation Review

After creating a skill, review:

1. **Triggering**: Will the description activate this skill at the right time?
2. **Completeness**: Does SKILL.md contain all necessary instructions?
3. **Conciseness**: Is the content lean and focused?
4. **Testability**: Can the skill be tested with example requests?
5. **Maintainability**: Will future updates be straightforward?
