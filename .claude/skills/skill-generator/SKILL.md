---
name: skill-generator
description: Generator for creating Agent Skills compatible with Claude Code CLI and other AI agents. Use when user wants to create a new skill, generate a skill template, or convert existing instructions into the Agent Skills format (YAML frontmatter + Markdown). Supports full skill lifecycle: creation, validation, packaging, and best practices.
license: Apache-2.0
metadata:
  author: claude-code-assistant
  version: "1.0"
  compatibility: claude-code-cli
---

# Agent Skills Generator

## Overview

This skill generates Agent Skills following the open standard from [agentskills.io](https://agentskills.io). Agent Skills are modular packages that extend AI agent capabilities with specialized knowledge, workflows, and tools.

## Agent Skills Format

A skill consists of a directory containing:

```
skill-name/
├── SKILL.md          # Required: YAML frontmatter + Markdown instructions
├── scripts/          # Optional: Executable code (Python, Bash, etc.)
├── references/       # Optional: Documentation loaded on demand
└── assets/           # Optional: Templates, images, fonts, etc.
```

### Frontmatter Format

```yaml
---
name: skill-name
description: What the skill does and when to use it (max 1024 chars)
license: Apache-2.0  # Optional
metadata:
  author: your-name
  version: "1.0"
---
```

**Field Requirements:**
- `name`: 1-64 chars, lowercase letters/numbers/hyphens only, cannot start/end with `-`
- `description`: 1-1024 chars, must describe what skill does AND when to use it
- `license`: Optional, recommended for distribution
- `metadata`: Optional key-value pairs for additional info

## Skill Creation Workflow

### Phase 1: Understand the User's Need

Ask clarifying questions to understand the skill's purpose:

1. **What task should this skill automate?**
   - Example: "Processing PDF forms", "Generating React components", "API integration"

2. **When should this skill be triggered?**
   - What keywords or phrases should activate it?
   - What file types or contexts are relevant?

3. **What does the AI need to know?**
   - Procedural knowledge the model doesn't already have
   - Company-specific information or schemas
   - Tools or APIs to integrate

4. **What resources are needed?**
   - Scripts for deterministic operations?
   - Reference documentation?
   - Templates or assets?

### Phase 2: Choose Skill Structure

Select the appropriate pattern based on the skill's purpose:

#### Pattern 1: Workflow-Based (Sequential Processes)

Best for: Multi-step procedures with clear sequences

```markdown
# Skill Name

## Overview
[1-2 sentence description]

## Workflow Decision Tree
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow"
   **Editing existing content?** → Follow "Editing workflow"

## Creation Workflow
### Step 1: [Action]
[Instructions]

### Step 2: [Action]
[Instructions]
```

**Examples:** DOCX editing, PDF form filling, Deployment processes

#### Pattern 2: Task-Based (Tool Collections)

Best for: Collections of related operations

```markdown
# Skill Name

## Quick Start
[Brief introduction + common usage]

## Task Category 1
[Instructions for task type 1]

## Task Category 2
[Instructions for task type 2]

## Quick Reference
| Task | Best Tool | Command/Code |
```

**Examples:** PDF manipulation, Image processing, File operations

#### Pattern 3: Reference/Guidelines (Standards)

Best for: Style guides, coding standards, specifications

```markdown
# Skill Name

## Guidelines
### Rule 1: [Name]
[Description + examples]

### Rule 2: [Name]
[Description + examples]

## Specifications
[Detailed specifications]
```

**Examples:** Brand guidelines, Code style guides, API standards

#### Pattern 4: Capabilities-Based (Integrated Systems)

Best for: Multiple interrelated features

```markdown
# Skill Name

## Core Capabilities

### 1. [Feature Name]
[Description + usage]

### 2. [Feature Name]
[Description + usage]

## Integration Guide
[How capabilities work together]
```

**Examples:** Product management systems, CI/CD pipelines

### Phase 3: Generate SKILL.md

Create the skill file with proper frontmatter and structure:

```markdown
---
name: {skill-name}
description: {Comprehensive description including WHEN to use this skill}
license: Apache-2.0
metadata:
  author: {author}
  version: "1.0"
---

# {Skill Title}

## Overview
[Brief description]

[Structure based on chosen pattern]
```

### Phase 4: Create Supporting Resources

#### scripts/ Directory

Create when:
- The same code is rewritten repeatedly
- Deterministic reliability is needed
- Complex operations that shouldn't be in context

```python
#!/usr/bin/env python3
"""
Helper script for {skill-name}
"""

def main():
    # Implementation
    pass

if __name__ == "__main__":
    main()
```

#### references/ Directory

Create when:
- Documentation is too long for SKILL.md
- Information is only needed for specific use cases
- Domain-specific knowledge is required

```markdown
# Reference: {Topic}

## When to Read This
[Conditions for loading this reference]

## Content
[Detailed documentation]
```

#### assets/ Directory

Create when:
- Files will be used in output (not in context)
- Templates need to be copied/modified
- Static resources are required

### Phase 5: Progressive Disclosure

Keep SKILL.md lean by following these principles:

1. **Metadata (~100 tokens)**: Always loaded at startup
   - `name` and `description` fields

2. **Instructions (<5000 tokens)**: Loaded when skill activates
   - Keep SKILL.md under 500 lines
   - Include only essential procedural instructions

3. **Resources (as needed)**: Loaded on demand
   - `scripts/` - Executed without reading
   - `references/` - Read when needed
   - `assets/` - Used in output

**Reference Pattern:**
```markdown
## Quick Start
[Basics]

## Advanced Features
- **Advanced topic 1**: See [ADVANCED1.md](references/ADVANCED1.md)
- **Advanced topic 2**: See [ADVANCED2.md](references/ADVANCED2.md)
```

### Phase 6: Validate and Package

#### Validation Checklist

- [ ] YAML frontmatter is valid
- [ ] `name` follows hyphen-case convention
- [ ] `description` describes what AND when to use
- [ ] SKILL.md is under 500 lines
- [ ] No duplicate content between SKILL.md and references
- [ ] File references use relative paths
- [ ] Scripts are tested and working

#### Package as .skill File

The .skill file is a zip archive with proper structure:

```bash
# Create distributable skill file
zip -r skill-name.skill skill-name/
```

## Best Practices

### 1. Concise is Key

The context window is a shared resource. Only include information the AI doesn't already have.

**Bad:**
```markdown
## What is React?
React is a JavaScript library for building user interfaces...
```

**Good:**
```markdown
## React Integration
Use useAppSelector for state access:
```typescript
const data = useAppSelector(selectData);
```
```

### 2. Set Appropriate Degrees of Freedom

**High freedom (text instructions)**: Multiple valid approaches
```markdown
## Error Handling
Handle errors appropriately for the context. Consider retry logic, fallback values, or user notifications.
```

**Low freedom (specific scripts)**: Fragile, error-prone operations
```markdown
## Form Filling
Run `scripts/fill_form.py` with the fields.json file.
```

### 3. Description Quality

The `description` field is the primary trigger mechanism. Include:

```yaml
---
description: |
  Comprehensive PDF manipulation: extract text/tables, fill forms, merge/split.
  Use when user mentions: PDF, forms, document processing, PDF merge, PDF split.
---
```

### 4. Avoid Auxiliary Files

Do NOT include:
- README.md
- INSTALLATION.md
- CHANGELOG.md
- QUICK_START.md

The skill should only contain what the AI needs to execute the task.

## Examples from Reference Skills

### PDF Skill (Task-Based)

```markdown
## Quick Start

Extract text with pdfplumber:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Merge PDFs

```python
from pypdf import PdfWriter
writer = PdfWriter()
for pdf in ["file1.pdf", "file2.pdf"]:
    reader = PdfReader(pdf)
    for page in reader.pages:
        writer.add_page(page)
writer.write("merged.pdf")
```

## Next Steps
- For advanced features, see [reference.md](references/reference.md)
- For form filling, see [forms.md](references/forms.md)
```

### MCP Builder Skill (Workflow-Based)

```markdown
## High-Level Workflow

### Phase 1: Research and Planning
1. Understand modern MCP design
2. Study MCP protocol documentation
3. Plan implementation

### Phase 2: Implementation
1. Set up project structure
2. Implement core infrastructure
3. Implement tools

### Phase 3: Review and Test
1. Code quality review
2. Build and test

## Resources
- [MCP Best Practices](references/mcp_best_practices.md)
- [TypeScript Guide](references/node_mcp_server.md)
- [Python Guide](references/python_mcp_server.md)
```

## Common Templates

See [references/templates.md](references/templates.md) for:
- Workflow-based skill template
- Task-based skill template
- Reference-based skill template
- Script template
- Reference documentation template

## Validation

See [references/validation.md](references/validation.md) for:
- Complete validation checklist
- Common validation errors
- Testing procedures
