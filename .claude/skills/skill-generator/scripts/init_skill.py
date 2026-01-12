#!/usr/bin/env python3
"""
Agent Skills Initializer

Creates a new Agent Skill directory with template SKILL.md
following the Agent Skills specification from agentskills.io.

Usage:
    python init_skill.py <skill-name> [--path <output-directory>]

Examples:
    python init_skill.py pdf-editor
    python init_skill.py react-builder --path ./skills
    python init_skill.py api-helper --path ~/.claude/skills
"""

import sys
import re
from pathlib import Path


SKILL_TEMPLATE = """---
name: {skill_name}
description: [TODO: Replace with comprehensive description - what the skill does AND when to use it. Include trigger keywords and specific use cases. Max 1024 characters.]
license: Apache-2.0
metadata:
  author: [TODO: Optional - your name or organization]
  version: "1.0"
---

# {skill_title}

## Overview

[TODO: 2-3 sentences explaining what this skill enables and what problems it solves]

## Usage

[TODO: Add instructions for using this skill. Choose the structure that best fits:

**1. Workflow-Based** (for sequential processes)
## Workflow Decision Tree
- **Creating new?** → Follow Creation Workflow
- **Editing existing?** → Follow Editing Workflow

**2. Task-Based** (for tool collections)
## Quick Start
[Basic usage examples]
## {Operation Category 1}
[Instructions]

**3. Reference/Guidelines** (for standards)
## Guidelines
### Rule 1: [Name]
[Description + examples]

**4. Capabilities-Based** (for integrated systems)
## Core Capabilities
### 1. [Feature Name]
[Description + usage]

See templates.md for complete examples.]

## Quick Start

```python
# TODO: Add basic usage example
# This should be the most common use case
```

## Resources

### scripts/
Executable code (Python/Bash/etc.) for automation and data processing.

**When to include:**
- Code that's rewritten repeatedly
- Deterministic operations that must work correctly
- Complex data processing

**Examples from other skills:**
- `pdf/scripts/fill_fillable_fields.py` - PDF form automation
- `docx/scripts/convert.py` - Document conversion

### references/
Documentation loaded on demand for detailed information.

**When to include:**
- Content too lengthy for SKILL.md
- Domain-specific knowledge
- API documentation and schemas
- Detailed workflow guides

**Examples from other skills:**
- `product-management/references/communication.md` - Status update guide
- `bigquery/references/schema.md` - Database schema

### assets/
Files used in output (not loaded into context).

**When to include:**
- Templates (document, code, config)
- Images (diagrams, logos)
- Fonts and static resources
- Boilerplate projects

**Examples from other skills:**
- `brand-guidelines/assets/template.pptx` - PowerPoint template
- `frontend-builder/assets/hello-world/` - React boilerplate

---

**Delete any unused directories (scripts/, references/, assets/) after customizing.**
"""


EXAMPLE_SCRIPT = """#!/usr/bin/env python3
\"\"\"
Example helper script for {skill_name}

This is a placeholder. Replace with actual implementation or delete if not needed.

Usage:
    python example.py <input>

Examples from real skills:
- pdf/scripts/fill_fillable_fields.py - Fills PDF form fields from JSON
- docx/scripts/convert.py - Converts document formats
\"\"\"

import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("Usage: python example.py <input>")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    print(f"Processing: {{input_path}}")

    # TODO: Add actual implementation
    # This could be:
    # - File processing/conversion
    # - API calls and data fetching
    # - Data analysis and transformation
    # - Report generation

    return 0


if __name__ == "__main__":
    sys.exit(main())
"""


EXAMPLE_REFERENCE = """# Reference Documentation: {skill_title}

This is a placeholder for detailed reference documentation.
Replace with actual content or delete if not needed.

## When to Read This

Read this reference when:
- [Specific condition 1]
- [Specific condition 2]
- [Specific condition 3]

## Overview

[Detailed explanation of the topic]

## Details

### Topic 1

[Detailed information with examples]

### Topic 2

[Detailed information with examples]

## Examples

### Example 1: Use Case Title

```python
# Example code with explanation
```

### Example 2: Use Case Title

```python
# Example code with explanation
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| [Issue] | [Root cause] | [Fix] |
| [Issue] | [Root cause] | [Fix] |
"""


EXAMPLE_ASSET = """# Example Asset Placeholder

This directory is for files that will be used in OUTPUT, not loaded into context.

Replace this placeholder with actual asset files or delete the entire assets/ directory.

## Common Asset Types

### Templates
- Document templates (.docx, .pptx, .pdf)
- Code templates (.tsx, .py, .js)
- Configuration templates (.json, .yaml, .env)

### Images
- Diagrams (.png, .svg)
- Logos (.png, .svg)
- Icons (.ico, .svg)

### Fonts
- TrueType fonts (.ttf)
- OpenType fonts (.otf)
- Web fonts (.woff, .woff2)

### Boilerplate
- Starter project directories
- Sample data files (.csv, .json)
- Configuration files

## Examples from Real Skills

- `brand-guidelines/assets/slides-template.pptx` - PowerPoint template
- `frontend-design/assets/hello-world/` - React starter project
- `theme-factory/assets/themes/` - Theme configuration files
- `canvas-design/assets/canvas-fonts/` - Font files for canvas

Note: Actual asset files can be any type. This is just a text placeholder.
"""


def title_case(skill_name: str) -> str:
    """Convert hyphenated skill name to Title Case."""
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


def validate_skill_name(name: str) -> tuple[bool, str]:
    """Validate skill name against Agent Skills specification."""
    if not re.match(r'^[a-z0-9-]+$', name):
        return False, "Name must contain only lowercase letters, numbers, and hyphens"
    if name.startswith('-') or name.endswith('-'):
        return False, "Name cannot start or end with a hyphen"
    if '--' in name:
        return False, "Name cannot contain consecutive hyphens"
    if len(name) > 64:
        return False, f"Name too long ({len(name)} chars). Maximum is 64."
    if len(name) == 0:
        return False, "Name cannot be empty"
    return True, "Valid"


def init_skill(skill_name: str, path: str = ".") -> Path | None:
    """
    Initialize a new Agent Skill directory.

    Args:
        skill_name: Name of the skill (hyphen-case)
        path: Output directory path

    Returns:
        Path to created skill directory, or None if error
    """
    # Validate skill name
    valid, msg = validate_skill_name(skill_name)
    if not valid:
        print(f"❌ Invalid skill name: {msg}")
        return None

    # Determine skill directory path
    output_path = Path(path).resolve()
    skill_dir = output_path / skill_name

    # Check if directory already exists
    if skill_dir.exists():
        print(f"❌ Error: Directory already exists: {skill_dir}")
        return None

    # Create skill directory
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"✅ Created skill directory: {skill_dir}")
    except Exception as e:
        print(f"❌ Error creating directory: {e}")
        return None

    # Create SKILL.md from template
    skill_title = title_case(skill_name)
    skill_content = SKILL_TEMPLATE.format(
        skill_name=skill_name,
        skill_title=skill_title
    )

    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content, encoding='utf-8')
        print("✅ Created SKILL.md")
    except Exception as e:
        print(f"❌ Error creating SKILL.md: {e}")
        return None

    # Create scripts/ directory with example script
    scripts_dir = skill_dir / 'scripts'
    scripts_dir.mkdir(exist_ok=True)
    example_script = scripts_dir / 'example.py'
    example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name), encoding='utf-8')
    print("✅ Created scripts/example.py")

    # Create references/ directory with example reference
    references_dir = skill_dir / 'references'
    references_dir.mkdir(exist_ok=True)
    example_reference = references_dir / 'reference.md'
    example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title), encoding='utf-8')
    print("✅ Created references/reference.md")

    # Create assets/ directory with placeholder
    assets_dir = skill_dir / 'assets'
    assets_dir.mkdir(exist_ok=True)
    example_asset = assets_dir / 'README.txt'
    example_asset.write_text(EXAMPLE_ASSET, encoding='utf-8')
    print("✅ Created assets/README.txt")

    return skill_dir


def main():
    if len(sys.argv) < 2:
        print("Agent Skills Initializer")
        print()
        print("Usage: python init_skill.py <skill-name> [--path <output-directory>]")
        print()
        print("Skill name requirements:")
        print("  - Hyphen-case (lowercase letters, numbers, hyphens)")
        print("  - Cannot start/end with hyphen")
        print("  - No consecutive hyphens")
        print("  - Max 64 characters")
        print()
        print("Examples:")
        print("  python init_skill.py pdf-editor")
        print("  python init_skill.py react-builder --path ./skills")
        print("  python init_skill.py api-helper --path ~/.claude/skills")
        sys.exit(1)

    skill_name = sys.argv[1]
    path = "."

    if len(sys.argv) >= 4 and sys.argv[2] == '--path':
        path = sys.argv[3]

    print(f"🚀 Initializing Agent Skill: {skill_name}")
    print(f"   Location: {path}")
    print()

    result = init_skill(skill_name, path)

    if result:
        print()
        print("✅ Skill initialized successfully!")
        print()
        print("Next steps:")
        print("1. Edit SKILL.md to:")
        print("   - Complete the description field")
        print("   - Add skill-specific instructions")
        print("   - Choose appropriate structure (workflow/task/reference/capabilities)")
        print("2. Customize or delete example files:")
        print("   - scripts/example.py - replace or delete")
        print("   - references/reference.md - replace or delete")
        print("   - assets/README.txt - replace with actual assets or delete directory")
        print("3. Validate: python scripts/validate.py")
        print("4. Test with example requests")
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
