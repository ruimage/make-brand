#!/bin/bash
# Agent Skills Initializer (Bash version)
# Creates a new Agent Skill directory with template SKILL.md
#
# Usage:
#   bash init_skill.sh <skill-name> [output-directory]
#
# Examples:
#   bash init_skill.sh pdf-editor
#   bash init_skill.sh react-builder ./skills

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validate skill name
validate_name() {
    local name="$1"

    # Check for empty name
    if [[ -z "$name" ]]; then
        echo -e "${RED}❌ Error: Skill name cannot be empty${NC}"
        return 1
    fi

    # Check for valid characters (lowercase letters, numbers, hyphens)
    if [[ ! "$name" =~ ^[a-z0-9-]+$ ]]; then
        echo -e "${RED}❌ Error: Name must contain only lowercase letters, numbers, and hyphens${NC}"
        return 1
    fi

    # Check for starting/ending hyphen
    if [[ "$name" == -* ]] || [[ "$name" == -* ]]; then
        echo -e "${RED}❌ Error: Name cannot start or end with a hyphen${NC}"
        return 1
    fi

    # Check for consecutive hyphens
    if [[ "$name" == *--* ]]; then
        echo -e "${RED}❌ Error: Name cannot contain consecutive hyphens${NC}"
        return 1
    fi

    # Check length
    if [[ ${#name} -gt 64 ]]; then
        echo -e "${RED}❌ Error: Name too long (${#name} chars). Maximum is 64${NC}"
        return 1
    fi

    return 0
}

# Title case conversion
title_case() {
    local name="$1"
    echo "$name" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g'
}

# Main script
main() {
    if [[ $# -lt 1 ]]; then
        echo "Agent Skills Initializer (Bash version)"
        echo ""
        echo "Usage: bash init_skill.sh <skill-name> [output-directory]"
        echo ""
        echo "Skill name requirements:"
        echo "  - Hyphen-case (lowercase letters, numbers, hyphens)"
        echo "  - Cannot start/end with hyphen"
        echo "  - No consecutive hyphens"
        echo "  - Max 64 characters"
        echo ""
        echo "Examples:"
        echo "  bash init_skill.sh pdf-editor"
        echo "  bash init_skill.sh react-builder ./skills"
        exit 1
    fi

    local skill_name="$1"
    local output_dir="${2:-.}"

    # Validate skill name
    if ! validate_name "$skill_name"; then
        exit 1
    fi

    # Create skill directory path
    local skill_dir="$output_dir/$skill_name"

    # Check if directory already exists
    if [[ -d "$skill_dir" ]]; then
        echo -e "${RED}❌ Error: Directory already exists: $skill_dir${NC}"
        exit 1
    fi

    # Convert name to title case
    local skill_title=$(title_case "$skill_name")

    echo "🚀 Initializing Agent Skill: $skill_name"
    echo "   Location: $output_dir"
    echo ""

    # Create skill directory
    mkdir -p "$skill_dir"
    echo -e "${GREEN}✅ Created skill directory: $skill_dir${NC}"

    # Create SKILL.md
    cat > "$skill_dir/SKILL.md" << EOF
---
name: $skill_name
description: [TODO: Replace with comprehensive description - what the skill does AND when to use it. Include trigger keywords and specific use cases. Max 1024 characters.]
license: Apache-2.0
metadata:
  author: [TODO: Optional - your name or organization]
  version: "1.0"
---

# $skill_title

## Overview

[TODO: 2-3 sentences explaining what this skill enables]

## Quick Start

\`\`\`python
# TODO: Add basic usage example
\`\`\`

## Resources

### scripts/
Executable code for automation and data processing.

### references/
Documentation loaded on demand for detailed information.

### assets/
Files used in output (not loaded into context).

---
**Delete unused directories after customizing.**
EOF
    echo -e "${GREEN}✅ Created SKILL.md${NC}"

    # Create scripts directory
    mkdir -p "$skill_dir/scripts"
    cat > "$skill_dir/scripts/example.sh" << 'EOF'
#!/bin/bash
# Example helper script
# Replace with actual implementation or delete

echo "This is an example script for $SKILL_NAME"
# TODO: Add actual implementation
EOF
    chmod +x "$skill_dir/scripts/example.sh"
    echo -e "${GREEN}✅ Created scripts/example.sh${NC}"

    # Create references directory
    mkdir -p "$skill_dir/references"
    cat > "$skill_dir/references/reference.md" << EOF
# Reference Documentation: $skill_title

This is a placeholder for detailed reference documentation.

## When to Read This

- [Specific condition 1]
- [Specific condition 2]

## Details

[Add detailed information here]
EOF
    echo -e "${GREEN}✅ Created references/reference.md${NC}"

    # Create assets directory
    mkdir -p "$skill_dir/assets"
    cat > "$skill_dir/assets/README.txt" << 'EOF'
This directory is for files used in OUTPUT, not loaded into context.

Common asset types:
- Templates (document, code, config)
- Images (diagrams, logos)
- Fonts (.ttf, .otf, .woff)
- Boilerplate projects

Replace this placeholder with actual assets or delete the entire assets/ directory.
EOF
    echo -e "${GREEN}✅ Created assets/README.txt${NC}"

    echo ""
    echo -e "${GREEN}✅ Skill initialized successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Edit SKILL.md to complete the description"
    echo "2. Add skill-specific instructions"
    echo "3. Customize or delete example files"
    echo "4. Validate skill structure"
}

main "$@"
