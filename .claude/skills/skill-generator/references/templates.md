# Agent Skills Templates

This file provides ready-to-use templates for different skill patterns.

## Template 1: Workflow-Based Skill

Best for: Sequential processes with clear steps

```markdown
---
name: workflow-skill
description: Guides through [process] step-by-step. Use when user needs to [specific task] or mentions [trigger keywords].
---

# {Skill Title}

## Overview

[2-3 sentences explaining what this skill enables]

## Workflow Decision Tree

First, determine the operation type:

**Creating new [content]?** → Follow [Creation Workflow](#creation-workflow)
**Editing existing [content]?** → Follow [Editing Workflow](#editing-workflow)
**Analyzing [content]?** → Follow [Analysis Workflow](#analysis-workflow)

## Creation Workflow

### Step 1: {Action Name}

[Instructions for step 1]

```python
# Example code if applicable
```

### Step 2: {Action Name}

[Instructions for step 2]

**Note:** [Important consideration or edge case]

### Step 3: {Action Name}

[Instructions for step 3]

## Editing Workflow

[Similar structure for editing]

## Common Tasks

### Task: {Common Task Name}

[Solution to common task]

## Troubleshooting

| Problem | Solution |
|---------|----------|
| [Issue] | [Fix] |
| [Issue] | [Fix] |

## Resources

- [Detailed reference](references/REFERENCE.md)
- [Examples](references/examples.md)
```

## Template 2: Task-Based Skill

Best for: Collections of related operations/tools

```markdown
---
name: task-skill
description: {Operation 1}, {operation 2}, and {operation 3} for {domain}. Use when working with [file type/system] or user mentions [keywords].
---

# {Skill Title}

## Quick Start

[Brief 2-3 sentence introduction]

```python
# Most common usage example
```

## {Operation Category 1}

### Basic {Operation}

```python
# Code example
```

### Advanced {Operation}

For advanced options, see [reference](references/advanced.md).

## {Operation Category 2}

### {Operation Name}

```python
# Code example
```

## Quick Reference

| Task | Tool/Method | Example |
|------|-------------|---------|
| {Task 1} | {Method} | `{code}` |
| {Task 2} | {Method} | `{code}` |
| {Task 3} | {Method} | `{code}` |

## Common Issues

**Problem:** {Common problem}
**Solution:** {Solution}

## Resources

- [Advanced features](references/advanced.md)
- [API reference](references/api.md)
```

## Template 3: Reference/Guidelines Skill

Best for: Standards, style guides, specifications

```markdown
---
name: guidelines-skill
description: {Topic} guidelines and standards for {context}. Use when creating {content type} or user mentions style, standards, or [specific keywords].
---

# {Guideline Title}

## Core Principles

1. **{Principle 1}**: [Explanation]
2. **{Principle 2}**: [Explanation]
3. **{Principle 3}**: [Explanation]

## Guidelines

### {Category 1}

#### Rule: {Rule Name}

**Requirement:** [What must be done]

**Example:**
```typescript
// Good example
```

```typescript
// Bad example - violates rule
```

#### Rule: {Another Rule}

[Similar structure]

### {Category 2}

[Similar structure]

## Specifications

### {Specification 1}

[Detailed technical specification]

### {Specification 2}

[Detailed technical specification]

## Checklist

- [ ] {Check item 1}
- [ ] {Check item 2}
- [ ] {Check item 3}

## Resources

- [Full specification](references/spec.md)
- [Examples](references/examples.md)
```

## Template 4: Capabilities-Based Skill

Best for: Systems with multiple integrated features

```markdown
---
name: capability-skill
description: {Primary capability} with integrated {secondary features}. Use when user needs to [main task] or mentions [trigger keywords].
---

# {Skill Title}

## Core Capabilities

This skill provides the following capabilities:

### 1. {Capability Name}

{Description of what this capability enables}

**When to use:** [Trigger conditions]

**Basic usage:**
```python
# Example
```

### 2. {Capability Name}

{Description}

**When to use:** [Trigger conditions]

**Basic usage:**
```python
# Example
```

### 3. {Capability Name}

{Description}

**When to use:** [Trigger conditions]

**Basic usage:**
```python
# Example
```

## Integration Guide

### Combining Capabilities

[How different capabilities work together]

**Example workflow:**
```python
# Combined usage example
```

## Common Patterns

### Pattern 1: {Pattern Name}

[Description + code]

### Pattern 2: {Pattern Name}

[Description + code]

## Resources

- [Capability 1 details](references/capability1.md)
- [Capability 2 details](references/capability2.md)
- [Integration examples](references/examples.md)
```

## Script Template

For `scripts/helper.py`:

```python
#!/usr/bin/env python3
"""
Helper script for {skill-name}

This script performs [specific operation].
Run with: python scripts/helper.py [args]

Dependencies:
    - library1: pip install library1
    - library2: pip install library2
"""

import sys
from pathlib import Path

def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python helper.py <input>")
        sys.exit(1)

    input_path = Path(sys.argv[1])

    # Implementation here
    print(f"Processing: {input_path}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Reference Documentation Template

For `references/topic.md`:

```markdown
# {Topic} Reference

## Overview

[Detailed explanation of the topic]

## When to Read This

Read this reference when:
- [Condition 1]
- [Condition 2]
- [Condition 3]

## Details

### {Subtopic 1}

[Detailed information]

### {Subtopic 2}

[Detailed information]

## Examples

### Example 1: {Title}

```python
# Code example with explanation
```

### Example 2: {Title}

```python
# Code example with explanation
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| {Issue} | {Cause} | {Solution} |
```

## Assets Directory Template

For organizing assets:

```
assets/
├── templates/
│   ├── document-template.docx
│   └── code-template.tsx
├── images/
│   ├── logo.png
│   └── diagram.svg
└── boilerplate/
    └── starter-project/
        ├── package.json
        └── src/
```

## Description Field Templates

### For Task-Based Skills:

```yaml
description: |
  {Operation 1}, {operation 2}, and {operation 3} for {domain}.
  Use when: user mentions {keywords}, working with {file types}, or needs {specific capability}.
```

### For Workflow-Based Skills:

```yaml
description: |
  Guides through {process} with step-by-step instructions.
  Use when: user needs to {main task}, mentions {process name}, or asks about {related topics}.
```

### For Reference-Based Skills:

```yaml
description: |
  {Topic} guidelines and standards for {context}.
  Use when: creating {content type}, reviewing code, or user mentions style/standards.
```
