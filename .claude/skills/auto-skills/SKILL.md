---
name: auto-skills
version: "3.1.0"
description: Automatic skill discovery and invocation using LLM-based reasoning. Analyzes context and suggests relevant skills throughout the workflow.
user-invocable: true
allowed-tools: Read, Skill
hooks:
  # ═══════════════════════════════════════════════════════════════════════════════
  # SESSION START HOOK - Initial context analysis
  # ═══════════════════════════════════════════════════════════════════════════════
  SessionStart:
    - matcher: "*"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS DISCOVERY (SessionStart)
            ────────────────────────────────────────────────────────────────────────

            Current context: {conversation_summary}

            Available skill categories to consider:
            • Generation: react-component-generator, rtk-query-endpoint-generator, typescript-patterns-generator
            • Validation: fsd-architecture-check, test-coverage-analyzer, comprehensive-code-reviewer
            • Planning: planning-with-files, planning-prd-agent (full-cycle)
            • Analysis: library-research-specialist, state-management-advisor

            Quick check: Does user request suggest any specific skill?
            - React/component work → react-component-generator
            - Architecture/FSD mention → fsd-architecture-check
            - Complex/5+ step task → planning-with-files
            - Full project build → full-cycle
            - State management question → state-management-advisor
            - API/RTK Query work → rtk-query-endpoint-generator

            If match found: Suggest "/skill-name" to user.
            Otherwise: Wait for user request pattern matching.

  # ═══════════════════════════════════════════════════════════════════════════════
  # PRE TOOL USE HOOKS - Evaluate before operation
  # ═══════════════════════════════════════════════════════════════════════════════
  PreToolUse:
    # Task tool - check if specialist skill would be better
    - matcher: "Task"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (PreToolUse: Task)
            ────────────────────────────────────────────────────────────────────────

            About to invoke Task tool with: {subagent_type}

            Question: Is there a SKILL that would be more appropriate?

            Skill-first decision tree:
            1. Code generation → Use skill first (react-component-generator, rtk-query-endpoint-generator)
            2. Validation check → Use skill first (fsd-architecture-check, test-coverage-analyzer)
            3. Complex planning → Use skill first (planning-with-files, full-cycle)
            4. Multi-step coordination → THEN use Task with coordinator

            If skill exists: Invoke skill via Skill tool instead.
            If no skill match: Proceed with Task tool.

    # Read tool - check for architecture validation need
    - matcher: "Read"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (PreToolUse: Read)
            ────────────────────────────────────────────────────────────────────────

            Reading file: {file_path}

            Context check: After reading, should we validate architecture?
            - If reading FSD structure → Consider /fsd-architecture-check
            - If reading component → Consider /react-component-generator for creation
            - If reading tests → Consider /test-coverage-analyzer

    # Write/Edit tools - final validation opportunity
    - matcher: "Write|Edit"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (PreToolUse: Write/Edit)
            ────────────────────────────────────────────────────────────────────────

            About to modify: {file_path}

            Final check: Should validation skill run FIRST?
            - New React component → /react-component-generator (followed by review)
            - FSD layer change → /fsd-architecture-check
            - API change → /rtk-query-endpoint-generator

            If yes: Run skill, then proceed with Write/Edit.

    # Bash - check for project operations
    - matcher: "Bash"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (PreToolUse: Bash)
            ────────────────────────────────────────────────────────────────────────

            Running: {command}

            Check: Is this a TaskMaster operation?
            - tm init, tm add → Consider /full-cycle for comprehensive setup
            - git operations → Normal bash workflow

            Proceed with Bash unless full-cycle更适合.

  # ═══════════════════════════════════════════════════════════════════════════════
  # POST TOOL USE HOOKS - Suggest follow-up actions
  # ═══════════════════════════════════════════════════════════════════════════════
  PostToolUse:
    # After Task completion - suggest validation
    - matcher: "Task"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (PostToolUse: Task)
            ────────────────────────────────────────────────────────────────────────

            Task completed: {subagent_type}
            Result: {result_summary}

            Suggested follow-up skills:
            • Feature created → /fsd-architecture-check (validate FSD compliance)
            • Code written → /comprehensive-code-reviewer (quality check)
            • Tests added → /test-coverage-analyzer (coverage check)
            • Complex task done → /planning-with-files (update progress.md)

            Ask user: "Should I run validation skill? [skill-name]"

    # After file creation - suggest review
    - matcher: "Write|Edit"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (PostToolUse: Write/Edit)
            ────────────────────────────────────────────────────────────────────────

            File modified: {file_path}

            Consider validation:
            • Component created → /react-component-generator review
            • Architecture change → /fsd-architecture-check
            • Schema added → /zod-type-guard validation

            Brief reminder: "Validation skill available: [skill-name]"

  # ═══════════════════════════════════════════════════════════════════════════════
  # STOP HOOK - Session review and learning
  # ═══════════════════════════════════════════════════════════════════════════════
  Stop:
    - matcher: "*"
      hooks:
        - type: prompt
          prompt: |
            AUTO-SKILLS (Stop - Session Review)
            ────────────────────────────────────────────────────────────────────────

            Session Summary Analysis:

            Tasks completed:
            {count_tasks_completed}

            Skills used: {skills_invoked}

            Missed opportunities (skills that could have helped):
            • Review agent tasks → Was fsd-architecture-check needed?
            • New code written → Was comprehensive-code-reviewer needed?
            • Complex flow → Should we have used planning-with-files?
            • React work → Could react-component-generator help?

            Learning: Note 1-2 patterns for next session.
            ────────────────────────────────────────────────────────────────────────
---

# Auto Skills Discovery (v3.1)

**LLM-Based Automatic Skill Invocation with Enhanced Hooks**

## Overview

This plugin uses **prompt-based hooks** that leverage Claude's LLM reasoning to automatically discover and suggest relevant skills throughout the workflow.

## Hook Points

| Hook | Trigger | Purpose |
|------|---------|---------|
| **SessionStart** | When Claude starts | Analyze initial context for skill opportunities |
| **PreToolUse** | Before tool execution | Evaluate if skill should be used instead |
| **PostToolUse** | After tool execution | Suggest follow-up validation skills |
| **Stop** | Before session ends | Review and suggest improvements |

## Available Skills Mapping

| User Intent | Skill | Trigger Keywords |
|-------------|-------|------------------|
| React component | `react-component-generator` | "создать компонент", "component", React UI |
| RTK Query API | `rtk-query-endpoint-generator` | "API endpoint", "RTK Query", "createApi" |
| FSD validation | `fsd-architecture-check` | "FSD", "architecture", "validate structure" |
| Test coverage | `test-coverage-analyzer` | "test coverage", "testing pyramid" |
| Complex planning | `planning-with-files` | "complex task", "research", "multi-step" |
| Full build | `full-cycle` | "autosborka", "full-cycle", "auto-build" |
| State management | `state-management-advisor` | "state", "store", "Redux" question |
| TypeScript types | `typescript-patterns-generator` | "types", "TypeScript patterns" |

## Manual Commands

```bash
/skills              # List all available skills
/skill <name>        # Invoke a specific skill
/auto-skills         # Show this help
```

## Hook Behavior

### SessionStart
- Analyzes conversation summary for task patterns
- Suggests skills based on user request keywords
- Minimal overhead - brief consideration only

### PreToolUse
- **Task**: Checks if skill exists before delegating to agent
- **Read**: Anticipates validation needs after reading
- **Write/Edit**: Final validation opportunity before modification
- **Bash**: Checks for TaskMaster operations

### PostToolUse
- **Task**: Suggests validation based on work completed
- **Write/Edit**: Reminds about relevant validation skills

### Stop
- Reviews skills used vs. available
- Identifies missed opportunities for next session

## Best Practices

1. **Concise descriptions** — Skills appear in Skill tool description (~15k budget)
2. **Imperative language** — "Do X" not "You should do X"
3. **Keep SKILL.md under 5,000 words** — Prevents context bloat
4. **Let LLM reason** — Prompt hooks allow context-aware decisions

## Sources

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
