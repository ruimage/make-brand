---
name: auto-skills-trigger
version: "2.0"
description: Automatic trigger that dynamically discovers and invokes available skills. Scans ~/.claude/skills/*/SKILL.md on each trigger.
user-invocable: false
allowed-tools: Read, Glob
hooks:
  SessionStart:
    - matcher: "*"
      hooks:
        - type: prompt
          prompt: |
            ════════════════════════════════════════════════════════════════════════════════
            AUTO-SKILLS: Dynamic Skill Discovery
            ════════════════════════════════════════════════════════════════════════════════

            STEP 1: SCAN AVAILABLE SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Use Glob tool to find all skills:
            Pattern: ~/.claude/skills/*/SKILL.md

            Then READ each SKILL.md file and extract:
            • name (from frontmatter)
            • description (from frontmatter)
            • triggers (keywords that indicate when to use)

            STEP 2: ANALYZE USER REQUEST
            ─────────────────────────────────────────────────────────────────────────────────

            Current user request: {user_input}

            Compare user request against each skill's description and triggers.

            STEP 3: SUGGEST MATCHING SKILL
            ─────────────────────────────────────────────────────────────────────────────────

            If a skill matches (description covers the task OR triggers match keywords):
            → Say: "I can use /{skill-name} for this task. Should I proceed?"
            → Briefly explain what the skill does based on its description

            If no clear match:
            → Proceed normally, keep skills in mind for later

            DO NOT make up skills — only use skills found in ~/.claude/skills/
            ════════════════════════════════════════════════════════════════════════════════

  PreToolUse:
    - matcher: "Task"
      hooks:
        - type: prompt
          prompt: |
            ════════════════════════════════════════════════════════════════════════════════
            AUTO-SKILLS: Pre-Task Skill Check
            ════════════════════════════════════════════════════════════════════════════════

            About to invoke Task with subagent: {subagent_type}

            STEP 1: SCAN AVAILABLE SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Glob: ~/.claude/skills/*/SKILL.md
            Read each file to get: name, description, triggers

            STEP 2: CHECK IF SKILL SHOULD BE USED INSTEAD
            ─────────────────────────────────────────────────────────────────────────────────

            Current task: {task_description}

            For each skill found:
            → Does skill description match this task type?
            → Is this a generation/validation/planning task that has a dedicated skill?

            If YES: Invoke the SKILL first (via Skill tool), STOP using Task
            If NO match: Proceed with Task tool

            PRIORITY: Skills > Task tool (when skill exists for the task)
            ════════════════════════════════════════════════════════════════════════════════

    - matcher: "Write|Edit"
      hooks:
        - type: prompt
          prompt: |
            ════════════════════════════════════════════════════════════════════════════════
            AUTO-SKILLS: Pre-Write Validation Check
            ════════════════════════════════════════════════════════════════════════════════

            About to modify: {file_path}

            STEP 1: SCAN AVAILABLE SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Glob: ~/.claude/skills/*/SKILL.md
            Extract: name, description, triggers, category (if specified)

            STEP 2: CHECK VALIDATION SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Look for skills that:
            • Have "validation", "check", "review" in name/description
            • Match the file type being modified (component, API, test, etc.)

            If validation skill found:
            → Suggest: "Should I run /{skill-name} before writing?"

            Then proceed with Write/Edit
            ════════════════════════════════════════════════════════════════════════════════

  PostToolUse:
    - matcher: "Task"
      hooks:
        - type: prompt
          prompt: |
            ════════════════════════════════════════════════════════════════════════════════
            AUTO-SKILLS: Post-Task Skill Suggestion
            ════════════════════════════════════════════════════════════════════════════════

            Task completed: {subagent_type}
            Result: {result_summary}

            STEP 1: SCAN AVAILABLE SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Glob: ~/.claude/skills/*/SKILL.md
            Read each to get: name, description, category

            STEP 2: FIND FOLLOW-UP SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Based on work completed, find skills that:
            • Validate the type of work done (architecture, code quality, tests, etc.)
            • Are in "validation", "review", "analysis" categories

            For each relevant skill found:
            → Mention: "Consider /{skill-name} for validation"

            Brief suggestion only (1-2 skills max)
            ════════════════════════════════════════════════════════════════════════════════

    - matcher: "Write|Edit"
      hooks:
        - type: prompt
          prompt: |
            ════════════════════════════════════════════════════════════════════════════════
            AUTO-SKILLS: Post-Write Skill Suggestion
            ════════════════════════════════════════════════════════════════════════════════

            File modified: {file_path}

            Quick scan: Glob ~/.claude/skills/*/SKILL.md

            If validation skill matches this file type:
            → Briefly mention: "/{skill-name} available for validation"
            ════════════════════════════════════════════════════════════════════════════════

  Stop:
    - matcher: "*"
      hooks:
        - type: prompt
          prompt: |
            ════════════════════════════════════════════════════════════════════════════════
            AUTO-SKILLS: Session Review
            ════════════════════════════════════════════════════════════════════════════════

            STEP 1: LIST ALL AVAILABLE SKILLS
            ─────────────────────────────────────────────────────────────────────────────────

            Glob: ~/.claude/skills/*/SKILL.md
            Read each to list: name, description

            STEP 2: COMPARE WITH SKILLS USED
            ─────────────────────────────────────────────────────────────────────────────────

            Skills used this session: {skills_invoked}

            Skills available but not used:
            [List skills from ~/.claude/skills/ that weren't invoked]

            STEP 3: IDENTIFY MISSED OPPORTUNITIES
            ─────────────────────────────────────────────────────────────────────────────────

            For each available skill not used:
            → Could it have helped with tasks done today?
            → Brief note if relevant

            Learning: Remember 1-2 patterns for next session
            ════════════════════════════════════════════════════════════════════════════════
---
# Auto-Skills Trigger (v2.0)

**Dynamic skill discovery that scans ~/.claude/skills/ on each trigger.**

## How It Works

1. **Scan** — Uses Glob to find all `SKILL.md` files in skills directory
2. **Read** — Reads each file to extract name, description, triggers
3. **Match** — Compares current context against skill descriptions
4. **Suggest** — Proposes matching skill to user

## Key Difference from v1.0

| v1.0 | v2.0 |
|------|------|
| Static table of skills | Dynamic scan each trigger |
| Hardcoded patterns | Extracted from actual skill files |
| Requires manual updates | Auto-discovers new skills |

## Behavior

- **SessionStart**: Suggests skill if user request matches
- **PreToolUse (Task)**: Checks if skill should be used instead
- **PreToolUse (Write)**: Suggests validation before writing
- **PostToolUse (Task)**: Suggests validation after completion
- **Stop**: Reviews all available skills vs. skills used
