#!/bin/bash
# Agent Skills Quick Validator (Bash version)
# Basic validation of Agent Skills structure
#
# Usage:
#   bash quick_check.sh <skill-directory>

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Validation errors
ERRORS=0
WARNINGS=0

error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

validate_name() {
    local name="$1"

    # Check format
    if [[ ! "$name" =~ ^[a-z0-9-]+$ ]]; then
        error "Name contains invalid characters: $name"
        return 1
    fi

    if [[ "$name" == -* ]] || [[ "$name" == -* ]]; then
        error "Name starts or ends with hyphen: $name"
        return 1
    fi

    if [[ "$name" == *--* ]]; then
        error "Name contains consecutive hyphens: $name"
        return 1
    fi

    if [[ ${#name} -gt 64 ]]; then
        error "Name too long (${#name} chars): $name"
        return 1
    fi

    return 0
}

main() {
    if [[ $# -lt 1 ]]; then
        echo "Agent Skills Quick Validator (Bash version)"
        echo ""
        echo "Usage: bash quick_check.sh <skill-directory>"
        echo ""
        echo "Performs basic validation of Agent Skills structure."
        exit 1
    fi

    local skill_dir="$1"

    if [[ ! -d "$skill_dir" ]]; then
        error "Skill directory not found: $skill_dir"
        exit 1
    fi

    echo "🔍 Validating skill: $(basename "$skill_dir")"
    echo ""

    # Check for SKILL.md
    if [[ ! -f "$skill_dir/SKILL.md" ]]; then
        error "SKILL.md not found (required)"
        exit 1
    fi
    success "SKILL.md exists"

    # Read SKILL.md content (handle CRLF)
    local content
    content=$(tr -d '\r' < "$skill_dir/SKILL.md")

    # Check for frontmatter
    local first_line
    first_line=$(head -1 "$skill_dir/SKILL.md" | tr -d '\r')
    if [[ "$first_line" != "---" ]]; then
        error "SKILL.md must start with YAML frontmatter (---)"
    else
        success "YAML frontmatter found"
    fi

    # Extract name from frontmatter
    local name
    name=$(echo "$content" | grep -E '^name:' | head -1 | sed 's/^name: *//' | tr -d '"[:space:]')

    if [[ -z "$name" ]]; then
        error "Missing 'name' field in frontmatter"
    else
        if validate_name "$name"; then
            success "Name is valid: $name"
        fi

        # Check if name matches directory
        local dir_name
        dir_name=$(basename "$skill_dir")
        if [[ "$name" != "$dir_name" ]]; then
            warning "Name ($name) doesn't match directory name ($dir_name)"
        fi
    fi

    # Extract description from frontmatter
    local description
    description=$(echo "$content" | grep -E '^description:' | head -1 | sed 's/^description: *//' | tr -d '"')

    if [[ -z "$description" ]]; then
        error "Missing 'description' field in frontmatter"
    else
        local desc_length=${#description}
        if [[ $desc_length -gt 1024 ]]; then
            error "Description too long ($desc_length chars). Maximum is 1024"
        else
            success "Description is valid ($desc_length chars)"
        fi

        # Check for trigger indicators
        local desc_lower
        desc_lower=$(echo "$description" | tr '[:upper:]' '[:lower:]')
        if [[ ! "$desc_lower" =~ "use when" ]] && [[ ! "$desc_lower" =~ "when to use" ]]; then
            warning "Description should include 'Use when:' or 'when to use'"
        fi
    fi

    # Check for TODO items
    local todo_count
    todo_count=$(grep -i '\[TODO\]' "$skill_dir/SKILL.md" 2>/dev/null | wc -l || echo 0)
    if [[ $todo_count -gt 0 ]]; then
        warning "SKILL.md contains $todo_count TODO item(s)"
    fi

    # Check line count
    local line_count
    line_count=$(wc -l < "$skill_dir/SKILL.md" 2>/dev/null || echo 0)
    if [[ $line_count -gt 500 ]]; then
        warning "SKILL.md has $line_count lines. Recommended: <500"
    fi

    # Check for auxiliary files
    for forbidden in "README.md" "INSTALLATION.md" "CHANGELOG.md" "QUICK_START.md"; do
        if [[ -f "$skill_dir/$forbidden" ]]; then
            warning "Found auxiliary file: $forbidden (not recommended)"
        fi
    done

    # Check optional directories
    for dir in "scripts" "references" "assets"; do
        if [[ -d "$skill_dir/$dir" ]]; then
            if [[ -z "$(ls -A "$skill_dir/$dir")" ]]; then
                warning "Empty directory: $dir/ (consider removing)"
            fi
        fi
    done

    # Summary
    echo ""
    if [[ $ERRORS -eq 0 ]]; then
        success "Skill is valid!"
        if [[ $WARNINGS -gt 0 ]]; then
            echo "   ($WARNINGS warning(s))"
        fi
        exit 0
    else
        echo -e "${RED}❌ Validation failed with $ERRORS error(s)${NC}"
        exit 1
    fi
}

main "$@"
