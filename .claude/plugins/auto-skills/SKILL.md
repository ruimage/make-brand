---
name: auto-skills
version: "3.0.0"
description: Automatic skill discovery and invocation using LLM-based reasoning. Analyzes context and suggests relevant skills throughout the workflow.
user-invocable: true
allowed-tools: Read, Skill
hooks:
  SessionStart:
    - matcher: "*"
      hooks:
        - type: prompt
          prompt: "Analyze the current conversation context and user intent. Check if any available skills should be suggested. Consider: task complexity, domain, patterns in user request. Output skill suggestions as a brief reminder."
  PreToolUse:
    - matcher: "Task|Bash"
      hooks:
        - type: prompt
          prompt: "Before executing this operation, briefly consider: Is there a skill that would be more appropriate for this task? If yes, mention it. If no, proceed."
  PostToolUse:
    - matcher: "Task"
      hooks:
        - type: prompt
          prompt: "After completing this operation, consider: Should we invoke a skill for the next phase? Common follow-up skills: /planning-with-files for complex tasks, /fsd-architecture-check for validation, /test-coverage-analyzer for testing."
  Stop:
    - matcher: "*"
      hooks:
        - type: prompt
          prompt: "Review the session. Which skills could have been useful but weren't used? Output brief suggestions for next time."
---

# Auto Skills Discovery (v3.0)

**LLM-Based Automatic Skill Invocation**

## What Changed in v3.0

Based on deep research into Claude Code's skill architecture:

| v2.0 | v3.0 |
|------|------|
| Command hooks | Prompt hooks (LLM reasoning) |
| File scanning | Context analysis |
| Static reminders | Dynamic skill suggestions |

## How It Works

This plugin uses **prompt-based hooks** that leverage Claude's LLM reasoning to:

1. **SessionStart**: Analyze conversation context for skill opportunities
2. **PreToolUse**: Evaluate if a skill should be used before major operations
3. **PostToolUse**: Suggest follow-up skills after task completion
4. **Stop**: Review and suggest improvements for next session

## Key Architecture Insights

### Skills ≠ Code Execution

Skills are **prompt templates** that:
- Inject instructions into conversation context (via `isMeta: true` messages)
- Modify execution context (permissions, model selection)
- Guide Claude's behavior without executing code directly

### Selection Happens via LLM Reasoning

```
User Request → Claude reads Skill tool description → LLM reasoning → Skill invocation
```

No algorithmic matching, embeddings, or semantic search at code level.

### Hooks Are the Only Automation Path

Hooks allow automatic execution at specific lifecycle events:
- `SessionStart` — When Claude starts
- `PreToolUse` — Before tool execution
- `PostToolUse` — After tool execution
- `Stop` — Before session ends

## Available Skills (Auto-Discovered)

Claude automatically discovers skills from:
```
~/.claude/skills/*/SKILL.md        # User skills
.claude/skills/*/SKILL.md           # Project skills
~/.claude/plugins/*/skills/*/SKILL.md  # Plugin skills
```

## Manual Commands

```bash
/skills              # List all available skills (built-in)
/skill <name>        # Invoke a specific skill
/auto-skills         # Show this help
```

## Best Practices

1. **Write concise descriptions** — Skills appear in Skill tool description (15k char budget)
2. **Use imperative language** — "Do X" not "You should do X"
3. **Keep SKILL.md under 5,000 words** — Prevents context bloat
4. **Leverage prompt-based hooks** — Let LLM reason about relevance

## Sources

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
