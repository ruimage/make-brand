#!/usr/bin/env python3
"""
Agent Skills Validator

Validates an Agent Skill against the specification from agentskills.io.

Usage:
    python validate.py <skill-directory>

Examples:
    python validate.py ./my-skill
    python validate.py ~/.claude/skills/pdf-editor
"""

import sys
import re
import yaml
from pathlib import Path
from typing import Tuple, List


# Allowed frontmatter properties per Agent Skills spec
ALLOWED_PROPERTIES = {
    'name',
    'description',
    'license',
    'compatibility',
    'metadata',
    'allowed-tools'
}

# Forbidden auxiliary files
FORBIDDEN_FILES = {
    'README.md',
    'INSTALLATION.md',
    'INSTALLATION_GUIDE.md',
    'QUICK_START.md',
    'QUICKSTART.md',
    'QUICK_REFERENCE.md',
    'CHANGELOG.md',
    'CHANGES.md',
    'HISTORY.md',
    'CONTRIBUTING.md',
    'CONTRIBUTE.md',
    'AUTHORS.md',
    'LICENSE.txt'  # Only if not referenced in frontmatter
}

# Required optional directories
OPTIONAL_DIRS = {'scripts', 'references', 'assets'}


class ValidationResult:
    """Collects validation results."""

    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.info: List[str] = []

    def add_error(self, message: str):
        self.errors.append(message)

    def add_warning(self, message: str):
        self.warnings.append(message)

    def add_info(self, message: str):
        self.info.append(message)

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def print_report(self):
        """Print validation report."""
        if self.info:
            for msg in self.info:
                print(f"ℹ️  {msg}")

        if self.warnings:
            for msg in self.warnings:
                print(f"⚠️  {msg}")

        if self.errors:
            for msg in self.errors:
                print(f"❌ {msg}")

        if self.is_valid:
            print()
            print("✅ Skill is valid!")
            if self.warnings:
                print(f"   ({len(self.warnings)} warning(s))")
        else:
            print()
            print(f"❌ Validation failed with {len(self.errors)} error(s)")


def validate_frontmatter(content: str, result: ValidationResult) -> dict | None:
    """Validate YAML frontmatter."""
    if not content.startswith('---'):
        result.add_error("SKILL.md must start with YAML frontmatter (---)")
        return None

    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        result.add_error("Invalid YAML frontmatter format (must start and end with ---)")
        return None

    frontmatter_text = match.group(1)

    # Parse YAML
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        if not isinstance(frontmatter, dict):
            result.add_error("Frontmatter must be a YAML dictionary/object")
            return None
    except yaml.YAMLError as e:
        result.add_error(f"Invalid YAML in frontmatter: {e}")
        return None

    return frontmatter


def validate_name(name: str, result: ValidationResult, skill_dir_name: str):
    """Validate name field."""
    if not isinstance(name, str):
        result.add_error(f"'name' must be a string, got {type(name).__name__}")
        return

    name = name.strip()

    if not name:
        result.add_error("'name' cannot be empty")
        return

    if len(name) > 64:
        result.add_error(f"'name' is too long ({len(name)} chars). Maximum is 64 characters.")

    if not re.match(r'^[a-z0-9-]+$', name):
        result.add_error(
            f"'name' must contain only lowercase letters, numbers, and hyphens. Got: {name}"
        )

    if name.startswith('-'):
        result.add_error(f"'name' cannot start with a hyphen. Got: {name}")

    if name.endswith('-'):
        result.add_error(f"'name' cannot end with a hyphen. Got: {name}")

    if '--' in name:
        result.add_error(f"'name' cannot contain consecutive hyphens. Got: {name}")

    if name != skill_dir_name:
        result.add_warning(
            f"'name' ({name}) should match directory name ({skill_dir_name})"
        )


def validate_description(description: str, result: ValidationResult):
    """Validate description field."""
    if not isinstance(description, str):
        result.add_error(f"'description' must be a string, got {type(description).__name__}")
        return

    description = description.strip()

    if not description:
        result.add_error("'description' cannot be empty")
        return

    if len(description) > 1024:
        result.add_error(
            f"'description' is too long ({len(description)} chars). Maximum is 1024 characters."
        )

    if '<' in description or '>' in description:
        result.add_error("'description' cannot contain angle brackets (< or >)")

    # Check for quality indicators
    desc_lower = description.lower()

    if 'use when' not in desc_lower and 'when to use' not in desc_lower:
        result.add_warning(
            "'description' should include 'Use when:' or 'when to use' to indicate trigger conditions"
        )

    # Check if description describes both WHAT and WHEN
    if len(description) < 50:
        result.add_warning(
            "'description' seems too short. Should describe both WHAT the skill does AND WHEN to use it"
        )


def validate_optional_fields(frontmatter: dict, result: ValidationResult):
    """Validate optional frontmatter fields."""
    for key in frontmatter.keys():
        if key not in ALLOWED_PROPERTIES:
            result.add_warning(
                f"Unexpected key '{key}' in frontmatter. "
                f"Allowed properties: {', '.join(sorted(ALLOWED_PROPERTIES))}"
            )

    # Validate license if present
    if 'license' in frontmatter:
        license_val = frontmatter['license']
        if not isinstance(license_val, str):
            result.add_error(f"'license' must be a string, got {type(license_val).__name__}")

    # Validate compatibility if present
    if 'compatibility' in frontmatter:
        compat = frontmatter['compatibility']
        if not isinstance(compat, str):
            result.add_error(f"'compatibility' must be a string, got {type(compat).__name__}")
        elif len(compat) > 500:
            result.add_error(
                f"'compatibility' is too long ({len(compat)} chars). Maximum is 500 characters."
            )

    # Validate metadata if present
    if 'metadata' in frontmatter:
        metadata = frontmatter['metadata']
        if not isinstance(metadata, dict):
            result.add_error(f"'metadata' must be a dictionary, got {type(metadata).__name__}")

    # Validate allowed-tools if present
    if 'allowed-tools' in frontmatter:
        tools = frontmatter['allowed-tools']
        if not isinstance(tools, str):
            result.add_error(f"'allowed-tools' must be a string, got {type(tools).__name__}")


def validate_skill_md_body(skill_md: Path, result: ValidationResult):
    """Validate SKILL.md body content."""
    content = skill_md.read_text(encoding='utf-8')

    # Extract body (after frontmatter)
    match = re.search(r'^---\n.*?\n---\n(.*)', content, re.DOTALL)
    if not match:
        return

    body = match.group(1)
    lines = body.split('\n')

    # Check for TODO items
    todo_count = len(re.findall(r'\[TODO\]|\[TODO:|\bTODO:', body))
    if todo_count > 0:
        result.add_warning(f"SKILL.md contains {todo_count} TODO item(s). Complete these before use.")

    # Check length
    non_empty_lines = [l for l in lines if l.strip()]
    if len(non_empty_lines) > 500:
        result.add_warning(
            f"SKILL.md has {len(non_empty_lines)} lines. Recommended: <500 lines. "
            "Consider moving content to references/ directory."
        )


def validate_directory_structure(skill_dir: Path, result: ValidationResult):
    """Validate skill directory structure."""
    # Check for required SKILL.md
    skill_md = skill_dir / 'SKILL.md'
    if not skill_md.exists():
        result.add_error("SKILL.md not found (required file)")
        return

    # Check for forbidden files
    for forbidden in FORBIDDEN_FILES:
        if (skill_dir / forbidden).exists():
            if forbidden == 'LICENSE.txt':
                # Only warn if not referenced
                content = skill_md.read_text(encoding='utf-8')
                if 'license' not in content.lower():
                    result.add_warning(f"Found {forbidden} but no 'license' field in frontmatter")
            else:
                result.add_warning(
                    f"Found auxiliary file: {forbidden}. "
                    "Skills should only contain files needed for AI execution."
                )

    # Check optional directories
    for dir_name in OPTIONAL_DIRS:
        dir_path = skill_dir / dir_name
        if dir_path.exists():
            if not dir_path.is_dir():
                result.add_error(f"{dir_name}/ exists but is not a directory")
            else:
                # Check if directory is empty
                contents = list(dir_path.iterdir())
                if not contents:
                    result.add_warning(f"{dir_name}/ directory is empty. Consider removing it.")

    # Check for unexpected items (ignore __pycache__ and .git)
    expected = {'SKILL.md', *OPTIONAL_DIRS, 'scripts', 'references', 'assets'}
    for item in skill_dir.iterdir():
        if item.name.startswith('.') or item.name == '__pycache__':
            continue
        if item.name not in expected and not item.is_dir():
            result.add_info(f"Found additional file: {item.name}")


def validate_references(skill_dir: Path, result: ValidationResult):
    """Validate references directory content."""
    refs_dir = skill_dir / 'references'
    if not refs_dir.exists():
        return

    # Check reference files are markdown
    for ref_file in refs_dir.glob('*.md'):
        content = ref_file.read_text(encoding='utf-8')
        if len(content) > 50000:
            result.add_warning(
                f"{ref_file.name} is large ({len(content)} chars). "
                "Consider splitting for better context management."
            )


def validate_scripts(skill_dir: Path, result: ValidationResult):
    """Validate scripts directory content."""
    scripts_dir = skill_dir / 'scripts'
    if not scripts_dir.exists():
        return

    # Check Python scripts have shebang
    for script in scripts_dir.glob('*.py'):
        content = script.read_text(encoding='utf-8')
        if not content.startswith('#!'):
            result.add_warning(f"{script.name} missing shebang (#!/usr/bin/env python3)")


def validate_skill(skill_path: str) -> ValidationResult:
    """
    Validate an Agent Skill.

    Args:
        skill_path: Path to the skill directory

    Returns:
        ValidationResult with errors, warnings, and info
    """
    result = ValidationResult()
    skill_dir = Path(skill_path).resolve()

    if not skill_dir.exists():
        result.add_error(f"Skill directory not found: {skill_path}")
        return result

    if not skill_dir.is_dir():
        result.add_error(f"Path is not a directory: {skill_path}")
        return result

    result.add_info(f"Validating skill: {skill_dir.name}")

    # Validate directory structure
    validate_directory_structure(skill_dir, result)

    # Read and validate SKILL.md
    skill_md = skill_dir / 'SKILL.md'
    if not skill_md.exists():
        return result

    content = skill_md.read_text(encoding='utf-8')

    # Validate frontmatter
    frontmatter = validate_frontmatter(content, result)
    if frontmatter is None:
        return result

    # Check required fields
    if 'name' not in frontmatter:
        result.add_error("Missing required field: 'name'")
    else:
        validate_name(frontmatter['name'], result, skill_dir.name)

    if 'description' not in frontmatter:
        result.add_error("Missing required field: 'description'")
    else:
        validate_description(frontmatter['description'], result)

    # Validate optional fields
    validate_optional_fields(frontmatter, result)

    # Validate body content
    validate_skill_md_body(skill_md, result)

    # Validate subdirectories
    validate_references(skill_dir, result)
    validate_scripts(skill_dir, result)

    return result


def main():
    if len(sys.argv) != 2:
        print("Agent Skills Validator")
        print()
        print("Usage: python validate.py <skill-directory>")
        print()
        print("Examples:")
        print("  python validate.py ./my-skill")
        print("  python validate.py ~/.claude/skills/pdf-editor")
        sys.exit(1)

    skill_path = sys.argv[1]
    result = validate_skill(skill_path)
    result.print_report()

    sys.exit(0 if result.is_valid else 1)


if __name__ == "__main__":
    main()
