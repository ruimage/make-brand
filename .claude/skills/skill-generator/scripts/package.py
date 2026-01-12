#!/usr/bin/env python3
"""
Agent Skills Packager

Packages an Agent Skill into a distributable .skill file (ZIP format).
Validates the skill before packaging.

Usage:
    python package.py <skill-directory> [output-directory]

Examples:
    python package.py ./my-skill
    python package.py ./my-skill ./dist
    python package.py ~/.claude/skills/pdf-editor ~/Desktop
"""

import sys
import zipfile
from pathlib import Path


def import_validator():
    """Import the validate module."""
    # Import from the same directory
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "validate",
        Path(__file__).parent / "validate.py"
    )
    validate_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(validate_module)
    return validate_module


def package_skill(skill_path: str, output_dir: str = None) -> Path | None:
    """
    Package a skill folder into a .skill file.

    Args:
        skill_path: Path to the skill folder
        output_dir: Optional output directory (defaults to current directory)

    Returns:
        Path to the created .skill file, or None if error
    """
    skill_path = Path(skill_path).resolve()

    # Validate skill folder exists
    if not skill_path.exists():
        print(f"❌ Error: Skill folder not found: {skill_path}")
        return None

    if not skill_path.is_dir():
        print(f"❌ Error: Path is not a directory: {skill_path}")
        return None

    # Validate SKILL.md exists
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        print(f"❌ Error: SKILL.md not found in {skill_path}")
        return None

    # Run validation before packaging
    print("🔍 Validating skill...")
    validate_module = import_validator()
    result = validate_module.validate_skill(str(skill_path))

    if not result.is_valid:
        print(f"❌ Validation failed with {len(result.errors)} error(s):")
        for error in result.errors:
            print(f"   {error}")
        print()
        print("Please fix validation errors before packaging.")
        return None

    print(f"✅ {result.info[0] if result.info else 'Validation passed'}")
    if result.warnings:
        print(f"⚠️  {len(result.warnings)} warning(s):")
        for warning in result.warnings[:3]:  # Show first 3 warnings
            print(f"   {warning}")
        if len(result.warnings) > 3:
            print(f"   ... and {len(result.warnings) - 3} more")
    print()

    # Determine output location
    skill_name = skill_path.name
    if output_dir:
        output_path = Path(output_dir).resolve()
        output_path.mkdir(parents=True, exist_ok=True)
    else:
        output_path = Path.cwd()

    skill_filename = output_path / f"{skill_name}.skill"

    # Check if file already exists
    if skill_filename.exists():
        response = input(f"⚠️  {skill_filename.name} already exists. Overwrite? (y/N): ")
        if response.lower() != 'y':
            print("Packaging cancelled.")
            return None

    # Create the .skill file (zip format)
    try:
        with zipfile.ZipFile(skill_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            files_added = 0
            for file_path in skill_path.rglob('*'):
                if file_path.is_file():
                    # Skip __pycache__ and .git
                    if '__pycache__' in str(file_path) or '.git' in str(file_path):
                        continue

                    # Calculate the relative path within the zip
                    # Skill files should be at root, not in parent directory
                    arcname = file_path.relative_to(skill_path)
                    zipf.write(file_path, arcname)
                    files_added += 1

        print(f"📦 Packaged {files_added} files into: {skill_filename}")
        print(f"   Size: {skill_filename.stat().st_size:,} bytes")

        return skill_filename

    except Exception as e:
        print(f"❌ Error creating .skill file: {e}")
        return None


def main():
    if len(sys.argv) < 2:
        print("Agent Skills Packager")
        print()
        print("Usage: python package.py <skill-directory> [output-directory]")
        print()
        print("Examples:")
        print("  python package.py ./my-skill")
        print("  python package.py ./my-skill ./dist")
        print("  python package.py ~/.claude/skills/pdf-editor ~/Desktop")
        print()
        print("The .skill file is a ZIP archive containing the skill directory.")
        print("Validation is performed before packaging.")
        sys.exit(1)

    skill_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    print(f"📦 Packaging skill: {skill_path}")
    if output_dir:
        print(f"   Output directory: {output_dir}")
    print()

    result = package_skill(skill_path, output_dir)

    if result:
        print()
        print("✅ Skill packaged successfully!")
        print()
        print("To use this skill:")
        print("1. Copy the .skill file to your skills directory")
        print("2. Extract the archive: unzip skill-name.skill -d ~/.claude/skills/")
        print("   Or on Windows: Expand-Archive skill-name.skill -DestinationPath ~/.claude/skills/")
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
