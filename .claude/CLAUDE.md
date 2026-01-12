# QA FRONTEND: Development Guide v2.0

---

## 🚨 MANDATORY EXECUTION PROTOCOL

### ⚡ UNIFIED DECISION TREE (SINGLE SOURCE OF TRUTH)

```
USER REQUEST
    ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: SKILL DISCOVERY (ALWAYS EXECUTE FIRST)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. READ all skills from: ~/.claude/skills/*/SKILL.md           │
│     • Read frontmatter: description, triggers, allowed-tools    │
│     • Understand skill purpose and capabilities                 │
│                                                                 │
│  2. ANALYZE request against available skills                   │
│     • Match user intent to skill descriptions                   │
│     • Check trigger keywords                                    │
│     • Evaluate skill relevance                                  │
│                                                                 │
│  3. SELECT appropriate skills dynamically                      │
│     • One or more skills may apply                              │
│     • Skills can be executed in parallel if independent        │
│                                                                 │
│  4. EXECUTE selected skills via Skill tool                     │
│     • Use: /skill-name or Skill tool with skill parameter      │
│                                                                 │
│  Example:                                                        │
│    User: "Проверь архитектуру FSD"                              │
│    → Read ~/.claude/skills/*/SKILL.md                           │
│    → Find: fsd-architecture-check with triggers "FSD, arch"    │
│    → Execute: /fsd-architecture-check                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    ↓ (After skills execution or if no skills match)
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: COMPLEXITY ASSESSMENT                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Assess task complexity:                                        │
│  • SIMPLE (1-2 steps):     Skills sufficient → Skip to Phase 5 │
│  • MEDIUM (3-5 steps):     Proceed to Phase 3                  │
│  • COMPLEX (5+ steps):     Proceed to Phase 3                  │
│  • MULTI-DOMAIN:           Proceed to Phase 3                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    ↓ (For MEDIUM/COMPLEX tasks)
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: COORDINATION (MANDATORY)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  IF task requires 3+ steps OR multi-domain coordination:       │
│                                                                 │
│  MANDATORY: Invoke appropriate coordinator:                    │
│                                                                 │
│  • tactical-wave-orchestrator    → For most multi-step tasks   │
│  • master-coordinator            → For multi-domain/complex     │
│                                                                 │
│  DO NOT select agents directly!                                │
│  The coordinator will:                                          │
│    1. Analyze task requirements                                │
│    2. Select appropriate agents dynamically                    │
│    3. Delegate tasks to specialists                            │
│    4. Coordinate execution and results                         │
│                                                                 │
│  Example invocation:                                             │
│    Task: "Implement warranty claims feature"                    │
│    → Use: Task tool with tactical-wave-orchestrator           │
│    → Provide: task context, requirements                        │
│    → Coordinator selects agents and delegates                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    ↓ (Coordinator delegates to agents)
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: AGENT EXECUTION                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Selected agents (by coordinator) execute:                     │
│    • Their specialized tasks                                   │
│    • May use additional skills internally                      │
│    • Report results back to coordinator                        │
│                                                                 │
│  Available agent categories (for coordinator reference):        │
│    • Frontend specialists (React, UI, Layouts)                 │
│    • Backend specialists (API, RTK Query, Features)            │
│    • Architecture specialists (FSD, TypeScript, Schemas)       │
│    • Quality specialists (Review, Testing, Errors)             │
│    • Analysis specialists (Project, Libraries)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: VALIDATION & RESULTS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • Aggregate results from skills and agents                    │
│  • Quality validation                                           │
│  • Present final outcome to user                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ SKILL DISCOVERY PROTOCOL

### MANDATORY SKILL ANALYSIS PROCESS

**BEFORE any agent coordination, ALWAYS:**

**Step 1: Read Available Skills**
```
Read all: ~/.claude/skills/*/SKILL.md
```

**Step 2: Extract Skill Metadata**
For each skill, extract:
- `name`: Skill identifier
- `description`: What skill does and when to use
- `triggers`: Keywords that indicate skill relevance
- `category`: Skill type (generation, validation, analysis, etc.)
- `allowed-tools`: Tools skill can use

**Step 3: Match Skills to Request**
```
For each skill:
  IF request contains trigger keywords OR
     request intent matches description:
    ADD to selected skills list
```

**Step 4: Execute Skills**
```
For each selected skill:
  Execute via: Skill tool with skill parameter
  OR invoke via: /skill-name
```

### Skill Examples (Dynamic Discovery)

**Process Demonstration:**

```
User Request: "Создай компонент для карточки пользователя"

Step 1: Read skills
  → ~/.claude/skills/react-component-generator/SKILL.md
  → Extract: name="react-component-generator"
  → Extract: triggers="создать компонент, component, React компонент"

Step 2: Match
  → "создай компонент" matches triggers
  → Select: react-component-generator

Step 3: Execute
  → /react-component-generator UserCard entities/user

Result: Component generated, no agent coordination needed
```

---

## 🤖 COORDINATION PROTOCOL (MANDATORY)

### When Coordination is REQUIRED

**MUST invoke coordinator for:**
- Tasks with 3+ steps
- Multi-domain tasks (frontend + backend + architecture)
- Tasks requiring multiple specialists
- Complex refactoring or migrations
- Cross-feature integration

### Coordinator Selection

```
┌─────────────────────────────────────────────────────────────┐
│                    SELECT COORDINATOR                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  tactical-wave-orchestrator                                 │
│    Use for: Multi-step sequential tasks                     │
│    Examples: Feature implementation, refactoring            │
│                                                             │
│  master-coordinator                                         │
│    Use for: Multi-domain, architectural decisions          │
│    Examples: System migration, cross-domain integration    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Coordinator Invocation Format

```
Task tool with subagent_type parameter:

Task(
  subagent_type="tactical-wave-orchestrator",
  prompt="[Task description with context]",
  description="Execute multi-step task"
)
```

**IMPORTANT:**
- DO NOT select specific agents directly
- DO NOT bypass coordinator for multi-step tasks
- COORDINATOR selects agents based on task analysis

### Available Agents (For Coordinator Reference)

**FRONTEND SPECIALISTS**
- `react-ui-component-specialist` — Modern React components with TypeScript and Material-UI
- `layout-implementation-specialist` — UI layouts, design system integration, responsive design
- `figma-to-code-converter` — Convert Figma designs to React components

**BACKEND SPECIALISTS**
- `rtk-query-specialist` — Redux Toolkit Query endpoints and API integration
- `feature-development-specialist` — End-to-end feature implementation with FSD architecture

**ARCHITECTURE SPECIALISTS**
- `fsd-architect` — Feature-Sliced Design validation and architecture compliance
- `zod-type-guard` — Schema validation, type safety, API contracts

**QUALITY SPECIALISTS**
- `comprehensive-code-reviewer` — Code quality and architectural validation
- `production-quality-validator` — Production readiness validation
- `frontend-error-resolver` — ESLint violations, TypeScript errors, runtime errors
- `unified-code-quality-enforcer` — Code quality validation: readability, anti-patterns, naming
- `complexity-extractor` — Extract complex logic into utility functions

**ANALYSIS SPECIALISTS**
- `semantic-project-analyzer` — Project structure analysis and component discovery
- `library-research-specialist` — Exploration of existing solutions and library research

**PERFORMANCE & SECURITY**
- `performance-optimization-specialist` — React performance optimization, Core Web Vitals
- `security-specialist` — Security validation, Azure AD integration, vulnerability assessment
- `integration-test-specialist` — End-to-end testing, Cypress automation

---

## 📊 TASK PLANNING (TODOWRITE)

**USE TodoWrite for:**
- Tasks with 3+ steps (before coordinator invocation)
- Complex requirements breakdown
- Tracking multi-phase execution

**TodoWrite Rules:**
- Create plan BEFORE coordinator invocation
- Mark tasks in_progress → completed sequentially
- Update plan as coordinator delegates to agents

**TodoWrite execution rules:**
- Create plan BEFORE starting work on task
- Mark tasks as in_progress → completed sequentially
- Never skip planning stage
- Break large tasks into manageable subtasks
- Create clear, verifiable completion criteria

---

## 📁 PLANNING WITH FILES (MANUS-STYLE)

**→ Persistent markdown files for complex tasks**

### What is Planning with Files?

A skill implementing **Manus AI's context engineering pattern** — using the filesystem as persistent "working memory" instead of stuffing everything into the volatile context window.

```
Context Window = RAM (volatile, limited)
Filesystem     = Disk (persistent, unlimited)

→ Anything important gets written to disk.
```

### When to Use

**Use for:**
- Multi-step tasks (5+ tool calls)
- Research projects with findings
- Tasks spanning many context turns
- Complex feature implementation
- Anything requiring organization and progress tracking

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

### The 3-File Pattern

For every complex task, create THREE files:

| File | Purpose | When to Update |
|------|---------|----------------|
| `task_plan.md` | Phases, progress, decisions | After each phase |
| `findings.md` | Research, discoveries | After ANY discovery |
| `progress.md` | Session log, test results | Throughout session |

### Critical Rules

#### 1. Create Plan First (NON-NEGOTIABLE)
Never start a complex task without `task_plan.md`.

#### 2. The 2-Action Rule
> "After every 2 view/browser/search operations, IMMEDIATELY save key findings to text files."

This prevents visual/multimodal information from being lost.

#### 3. Read Before Decide
Before major decisions, re-read `task_plan.md` to refresh goals in attention window.

#### 4. Update After Act
After completing any phase:
- Mark phase status: `in_progress` → `complete`
- Log any errors encountered
- Note files created/modified

#### 5. Log ALL Errors
```markdown
## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| FileNotFoundError | 1 | Created default config |
| API timeout | 2 | Added retry logic |
```

#### 6. Never Repeat Failures
```
if action_failed:
    next_action != same_action
```

### The 3-Strike Error Protocol

```
ATTEMPT 1: Diagnose & Fix
  → Read error carefully
  → Identify root cause
  → Apply targeted fix

ATTEMPT 2: Alternative Approach
  → Same error? Try different method
  → Different tool? Different library?

ATTEMPT 3: Broader Rethink
  → Question assumptions
  → Search for solutions
  → Consider updating the plan

AFTER 3 FAILURES: Escalate to User
```

### Skill Invocation

```bash
# Direct invocation
/planning-with-files

# Automatic (via skill discovery)
# Triggers: "plan", "research", "complex task", "multi-step"
```

### Templates Location

Templates are available at:
```
~/.claude/plugins/planning-with-files/skills/planning-with-files/templates/
├── task_plan.md    # Phase tracking template
├── findings.md     # Research storage template
└── progress.md     # Session logging template
```

### Integration with TodoWrite

- **TodoWrite**: Use for lightweight task tracking (3-5 steps)
- **Planning with Files**: Use for complex multi-file projects (5+ steps)

Both can be used together — TodoWrite for immediate tracking, Files for persistent documentation.

---

## 🔄 AUTO SKILLS DISCOVERY

**→ LLM-based skill invocation using prompt hooks**

### What is Auto Skills?

A plugin that uses **prompt-based hooks** to leverage Claude's LLM reasoning for automatic skill discovery and invocation throughout the workflow.

### Architecture Insights (from Deep Research)

```
┌─────────────────────────────────────────────────────────────┐
│               HOW CLAUDE CODE SKILLS WORK                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Skills are NOT executable code. They are:                 │
│  ├── Prompt templates (SKILL.md)                            │
│  ├── Conversation context modifiers (isMeta: true messages) │
│  └── Execution context modifiers (permissions, model)       │
│                                                             │
│  Selection happens via LLM REASONING, not algorithmic:      │
│  ├── No embeddings, semantic search, or pattern matching    │
│  ├── Claude reads Skill tool description (~15k char budget) │
│  └── LLM decides: "Does this match user intent?"            │
│                                                             │
│  Hooks are the ONLY automation path:                        │
│  ├── SessionStart → Analyze context, suggest skills         │
│  ├── PreToolUse → Evaluate before operations                │
│  ├── PostToolUse → Suggest follow-up skills                 │
│  └── Stop → Review and learn for next time                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Sources

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Official Anthropic guide
- [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) — Technical architecture analysis
- [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — Official skill writing guide

### Prompt Hooks vs Command Hooks

| Type | Purpose | When to Use |
|------|---------|-------------|
| **Prompt hooks** | LLM reasoning about context | Skill selection, validation |
| **Command hooks** | Deterministic execution | Security checks, formatting |

This plugin uses **prompt-based hooks** to let Claude reason about which skills are relevant.

### Built-in Commands

```bash
/skills              # List all available skills (built-in)
/skill <name>        # Invoke a specific skill
/auto-skills         # Show this help
```

### Skill Discovery Locations

Claude automatically discovers skills from:
```
~/.claude/skills/*/SKILL.md        # User skills (global)
.claude/skills/*/SKILL.md           # Project skills (local)
~/.claude/plugins/*/skills/*/SKILL.md  # Plugin skills
```

### Best Practices for Skill Authors

1. **Concise descriptions** — Skills appear in Skill tool description (15k char budget total)
2. **Imperative language** — "Do X" not "You should do X"
3. **Keep SKILL.md under 5,000 words** — Prevents context bloat
4. **Clear triggers** — Describe WHEN to use the skill in description field

### Hook Points

| Hook | Type | Action |
|------|------|--------|
| SessionStart | prompt | Analyze context, suggest relevant skills |
| PreToolUse | prompt | Evaluate if skill should be used before operation |
| PostToolUse | prompt | Suggest follow-up skills after completion |
| Stop | prompt | Review session, suggest improvements |

---

## 🔄 PARALLEL TASK EXECUTION

**ALWAYS analyze tasks for parallel execution opportunities:**

**Step 1: Task Independence Analysis**
- Identify tasks that can be executed simultaneously
- Check for dependencies between subtasks
- Verify no shared resource conflicts
- Ensure tasks can be completed in parallel

**Step 2: Parallel Task Breakdown**
- **MAXIMUM 10 parallel tasks** — never exceed this limit
- Group independent operations together
- Create batches of related parallel tasks
- Prioritize high-impact parallel operations

**Step 3: Execution Strategy**
- Execute independent tasks simultaneously using multiple tool calls
- Use single message with multiple function calls for parallel operations
- Monitor completion of parallel tasks before proceeding
- Maintain task dependency order for sequential operations

**⚠️ CRITICAL RULES:**
- **ALWAYS attempt parallel execution** when tasks are independent
- **File reading operations** — batch multiple file reads in single message
- **Search operations** — run multiple searches simultaneously
- **Analysis tasks** — perform parallel analysis when possible
- **API calls** — execute independent API calls in parallel
- **Never sacrifice accuracy for parallelism** — ensure task quality remains high

---

## 🛑 ENHANCED STOP CONDITIONS

**EXECUTION ORDER (MUST NOT SKIP):**

1. **🛠️ SKILL DISCOVERY** → ALWAYS read and match skills first
2. **⚡ SKILL EXECUTION** → Execute matched skills
3. **📊 COMPLEXITY CHECK** → Assess if coordinator needed
4. **🤖 COORDINATION** → Invoke coordinator for 3+ step tasks (MANDATORY)
5. **✅ VALIDATION** → Quality check and results

**NEVER bypass:**
- Skill discovery phase
- Coordinator for multi-step tasks

---

## 🌊 PARALLEL EXECUTION PATTERNS

### Smart Wave-Based Execution

```
📊 WAVE 1: ANALYSIS & DISCOVERY (Maximum 4 agents in parallel)
├── semantic-project-analyzer    # Project structure analysis
├── library-research-specialist  # External solution research
├── fsd-architect               # Architecture validation
└── complexity-extractor        # Logic complexity assessment

⚡ WAVE 2: PARALLEL IMPLEMENTATION (Maximum 6 agents in parallel)
├── react-ui-component-specialist  # UI components
├── rtk-query-specialist          # API integration
├── zod-type-guard               # Type safety & validation
├── feature-development-specialist # End-to-end features
├── layout-implementation-specialist # Design systems
└── figma-to-code-converter      # Design conversion

✅ WAVE 3: QUALITY & VALIDATION (Maximum 4 agents in parallel)
├── comprehensive-code-reviewer   # Final QA validation
├── code-quality-enforcer        # Unified code quality
├── security-specialist          # Security validation
└── frontend-error-resolver      # Error resolution
```

### Optimized Agent Groupings

**Independent Analysis Groups (Can run simultaneously):**
```
Group A: Structure Analysis
├── semantic-project-analyzer
├── fsd-architect
└── library-research-specialist

Group B: Code Quality Analysis
├── complexity-extractor
├── code-quality-enforcer
└── security-specialist

Group C: Technical Implementation
├── react-ui-component-specialist
├── rtk-query-specialist
└── zod-type-guard

Group D: Validation & Integration
├── comprehensive-code-reviewer
├── frontend-error-resolver
├── performance-optimization-specialist
└── integration-test-specialist
```

### Smart Batching Strategies

**Batch 1: File Discovery & Reading (Up to 10 parallel operations)**
- Multiple file reads in single message
- Parallel Glob/Grep searches across different patterns
- Simultaneous directory structure analysis

**Batch 2: Independent Domain Analysis (Up to 6 parallel agents)**
- Frontend specialists work on UI components
- Backend specialists handle API integration
- Architecture specialists validate FSD compliance
- Quality specialists check code patterns

**Batch 3: Cross-Domain Validation (Up to 4 parallel agents)**
- Final quality assurance
- Integration testing validation
- Performance optimization checks
- Production readiness verification

---

## 🚀 PERFORMANCE OPTIMIZATION PROTOCOLS

### Resource Monitoring & Management

**Real-Time Performance Tracking:**
```
TOKEN USAGE METRICS:
├── Single Agent: 1x baseline consumption
├── Multi-Agent (2-4): 4x consumption multiplier
├── Complex Multi-Agent (5-10): 8x optimized consumption multiplier
└── Performance Threshold: 2s maximum response time

MEMORY OPTIMIZATION:
├── Context Window: 128k tokens maximum per agent
├── Selective Retention: Keep only essential context between waves
├── Strategic Clearing: /clear between major execution phases
└── Aggressive Caching: 1-hour retention for repeated operations
```

**Adaptive Resource Allocation:**
```
LOAD BALANCING STRATEGIES:
├── Monitor agent response times in real-time
├── Redistribute tasks if performance degrades >50%
├── Fallback to sequential execution if parallel fails
└── Maintain quality gates despite optimization pressure

RESOURCE LIMITS:
├── Maximum 10 concurrent tool operations
├── Maximum 6 parallel active agents
├── Maximum 4 agents per wave in implementation phase
└── Automatic fallback if limits exceeded
```

### Intelligent Orchestration Algorithms

**Smart Task Distribution:**
```javascript
// Pseudo-algorithm for optimal agent assignment
function selectOptimalAgents(taskComplexity, dependencies, resources) {
  if (taskComplexity <= 2) {
    return selectDirectSpecialist(task);
  } else if (taskComplexity <= 5) {
    return orchestrateTacticalWave(task, maxAgents: 6);
  } else {
    return coordinateStrategicExecution(task, maxWaves: 3);
  }
}

function optimizeParallelExecution(agents, resources) {
  return {
    wave1: filterIndependentAgents(agents, maxParallel: 4),
    wave2: sequenceDependentAgents(agents, maxParallel: 6),
    wave3: finalizeValidationAgents(agents, maxParallel: 4)
  };
}
```

### Execution Optimization Patterns

**Pattern 1: Discovery-Focused Optimization**
```
WAVE 1: RAPID ANALYSIS (2 parallel agents, 30s timeout)
├── semantic-project-analyzer (priority: high)
└── library-research-specialist (priority: medium)

BENEFITS: Fast project understanding, minimal resource usage
USE CASE: Quick evaluations, proof-of-concept validation
```

**Pattern 2: Implementation-Focused Optimization**
```
WAVE 1: ANALYSIS (3 agents, 45s timeout)
├── semantic-project-analyzer
├── fsd-architect
└── complexity-extractor

WAVE 2: PARALLEL IMPLEMENTATION (6 agents, 90s timeout)
├── react-ui-component-specialist
├── rtk-query-specialist
├── zod-type-guard
├── feature-development-specialist
├── layout-implementation-specialist
└── figma-to-code-converter

WAVE 3: VALIDATION (2 agents, 60s timeout)
├── comprehensive-code-reviewer
└── frontend-error-resolver

BENEFITS: Maximum implementation throughput
USE CASE: Feature development, complex integrations
```

**Pattern 3: Quality-Focused Optimization**
```
WAVE 1: COMPREHENSIVE ANALYSIS (4 agents, 60s timeout)
├── semantic-project-analyzer
├── fsd-architect
├── complexity-extractor
└── code-quality-enforcer

WAVE 2: QUALITY ENHANCEMENT (4 agents, 90s timeout)
├── code-quality-enforcer
├── security-specialist
├── performance-optimization-specialist
└── comprehensive-code-reviewer

BENEFITS: Maximum code quality assurance
USE CASE: Production readiness, refactoring, code review
```

---

## 🔒 ABSOLUTE PROHIBITIONS

### ❌ FORBIDDEN WORKFLOW PATTERNS

1. **NO DIRECT AGENT SELECTION** — Use coordinator for multi-step tasks
2. **NO SKIPPING SKILL DISCOVERY** — Always analyze available skills first
3. **NO BYPASSING COORDINATOR** — 3+ step tasks MUST use coordinator
4. **NO CODING WITHOUT ANALYSIS** — Mandatory project research
5. **NO FILE CREATION WITHOUT REQUEST** — Prefer code editing
6. **NO SKIPPING TODOWRITE PLANNING** — Mandatory task planning for 3+ steps

### ❌ FORBIDDEN CODE PATTERNS

1. **NO COMMENTS IN CODE**
   - Use self-documenting names instead of comments
   - TypeScript types replace documentation
   - Descriptive function/variable names explain purpose

2. **NO IMPERATIVE CONSTRUCTS**
   - Replace switch statements with functional dispatchers
   - Use object maps with Rambda pipe for conditional logic
   - Prefer functional composition over imperative constructs

3. **NO RAMBDA WITH REACT HOOKS**
   - Use imperative code for React event handlers
   - Keep Rambda in separate utility functions
   - Never mix functional programming with React lifecycle

4. **NO MUTATIONS**
   - Use functional pipelines instead of loops and mutations
   - Apply filter, map, reduce for data transformations
   - Maintain immutability with spread operators and Rambda functions

5. **NO DIRECT TOOL USAGE**
   - Use semantic analysis first
   - Use fd/ripgrep instead of built-in Glob/Grep tools
   - Fall back to built-in tools only when others cannot accomplish task

---

## ✅ CODE QUALITY AND READABILITY STANDARDS

**→ Quality validation delegated to specialized agents:**

### Unified Code Quality Enforcement
**→ code-quality-enforcer agent**
- Enforces self-documenting naming conventions and readability standards
- Detects and eliminates forbidden patterns (comments, mutations, imperative constructs)
- Eliminates complex anonymous functions in JSX
- Validates architectural compliance and coding standards
- Ensures clear separation between data processing and presentation logic

### Complex Logic Management
**→ complexity-extractor agent**
- Extracts logic with 3+ sequential operations into lib/ directory
- Ensures single responsibility principle for all functions
- Separates domain logic from component logic

### Comprehensive Quality Assurance
**→ comprehensive-code-reviewer agent**
- Final production readiness validation with functional programming compliance
- Cross-domain integration quality checks
- End-to-end quality gate enforcement
- Validates Rambda usage patterns and functional boundaries
- Ensures proper separation between data processing and React lifecycle

### Security & Performance Validation
**→ security-specialist agent**
- Azure AD integration and permission validation
- Security vulnerability assessment and compliance
- Authentication flow and access control validation
- OWASP security standards enforcement

**→ performance-optimization-specialist agent**
- React component performance analysis and optimization
- Bundle size analysis and code splitting recommendations
- Core Web Vitals monitoring and improvement suggestions
- Memory usage optimization and render performance tuning

**→ integration-test-specialist agent**
- End-to-end test automation with Cypress/Playwright
- API integration testing and validation
- Cross-browser compatibility and regression testing
- User journey testing and accessibility validation

---

## 🏗️ ARCHITECTURE AND PATTERNS

### FEATURE-SLICED DESIGN (FSD)

**→ Architecture validation delegated to fsd-architect agent**

This project follows Feature-Sliced Design methodology with strict layer hierarchy and import rules. The fsd-architect agent handles:
- Layer placement validation (app → processes → pages → widgets → features → entities → shared)
- Public API compliance via index.ts exports
- Import rule enforcement (layers can only import from layers below)
- Cross-imports validation with `@x` notation for entity dependencies

---

## 🔄 FUNCTIONAL PROGRAMMING WITH RAMBDA

**→ Validation delegated to comprehensive-code-reviewer agent**

This project uses functional programming patterns with Rambda library. The comprehensive-code-reviewer agent handles:
- **Rambda/React separation**: Ensures data processing stays separate from React lifecycle
- **Pure function validation**: Enforces immutability and side-effect-free functions
- **Usage boundary enforcement**: Validates proper use of Rambda vs imperative patterns
- **Pipe pattern compliance**: Ensures functional composition follows project standards

> **📝 Note**: This project uses `rambda` (with 'b'), not `ramda` — a faster, lighter alternative with the same API.

---

## 🔧 TECHNOLOGY STACK AND PATTERNS

### PROJECT OVERVIEW
React 18 + TypeScript manufacturing quality management app using Feature-Sliced Design, Redux Toolkit, Material-UI, and Azure AD.

### TECHNOLOGY STACK
- **Frontend**: React 18 + TypeScript + Vite
- **State**: Redux Toolkit + RTK Query
- **UI**: Material-UI v5 + Tailwind CSS
- **Architecture**: Feature-Sliced Design
- **Auth**: Azure AD + MSAL
- **Testing**: Vitest + Cypress + Testing Library

### TYPESCRIPT PATTERNS

**→ Type safety delegated to zod-type-guard agent**
- Handles schema creation, type inference, and API contract validation
- Ensures proper TypeScript integration and form validation

**→ Redux patterns delegated to rtk-query-specialist agent**
- Manages slice creation, selectors, and state management patterns
- Handles entity adapters and loading/error states

### API PATTERNS

**→ Implementation delegated to rtk-query-specialist agent**
- Handles endpoint creation, cache management, and Zod integration
- Ensures proper error handling and performance optimization
- Manages cache tags and invalidation strategies

### UI PATTERNS

#### Material-UI theme rules
- Use useTheme hook for theme access
- Apply sx prop for component styling
- Follow Material Design principles
- Implement proper responsive design

### SECURITY PATTERNS

#### Permission rules
- Use SilentPermissionHandler for UI protection
- Implement dynamic permission checks
- Never hardcode permission logic
- Use allPermissions constants

---

## 🧪 TESTING AND QUALITY

### TESTING AND QUALITY CONTROL

**→ Error resolution delegated to frontend-error-resolver agent**
- Handles TypeScript compilation errors, ESLint violations, runtime errors
- Manages test failures and debugging issues
- Ensures clean build process

**→ Final validation delegated to comprehensive-code-reviewer agent**
- Performs end-to-end quality assurance before production
- Validates all quality requirements and architectural compliance
- Ensures FSD hierarchy, naming standards, and project conventions

---

## 📊 DEVELOPMENT AND WORKFLOW

### COMPONENT CREATION
**→ Delegated to react-ui-component-specialist agent**
- Handles FSD layer placement, TypeScript interfaces, Material-UI integration
- Ensures accessibility compliance and production readiness
- Validates against project quality standards

### FEATURE DEVELOPMENT
**→ Delegated to feature-development-specialist agent**
- Manages end-to-end feature implementation with FSD architecture
- Coordinates API contracts, UI components, routing, and testing
- Integrates with rtk-query-specialist and zod-type-guard as needed

### CODING STANDARDS

#### Naming conventions
- **PascalCase**: Components, types
- **camelCase**: Variables, functions
- **SCREAMING_SNAKE_CASE**: Constants
- **kebab-case**: Files, folders

#### Import organization rules
1. React and external libraries first
2. Internal project modules second
3. Relative imports last
4. Sort alphabetically within groups

---

## 🔍 PROJECT ANALYSIS AND TOOLS

### PROJECT ANALYSIS

**→ Analysis delegated to semantic-project-analyzer agent**
- Handles project structure discovery and component relationship mapping
- Understands architectural patterns and identifies relevant modules
- Coordinates with specialized tools (fd, ripgrep) for targeted analysis

### TOOL PRIORITY

**Always prefer `fd` and `ripgrep` over built-in Claude Code CLI tools:**

1. **🥇 HIGHEST PRIORITY: Semantic Analysis** — code understanding and discovery
2. **🥈 SECOND PRIORITY: `fd` and `ripgrep`** — fast filesystem tools
3. **🥉 LAST RESORT: Built-in Claude Code CLI tools**

**⚠️ RIPGREP RESTRICTIONS:**
- **NEVER use ripgrep for .tsx files** — tsx type is not supported and causes timeouts
- Use built-in Grep tool instead for TypeScript React components
- Only use ripgrep for .ts, .js, .json, and other supported file types

---

## 🎯 CODE DEVELOPMENT PRINCIPLES

### LIBRARY-FIRST APPROACH
**MANDATORY: Always check existing library solutions before implementing custom code**

1. **Context7 documentation research**:
   - Use Context7 to explore available libraries for the task
   - Research library capabilities and patterns
   - Understand integration requirements and dependencies
   - Check TypeScript support and type definitions

2. **usehooks-ts priority**:
   - **ALWAYS check usehooks-ts first** for React hook needs
   - Use existing hooks instead of creating custom ones
   - Study hook implementations for learning patterns
   - Follow library conventions and usage patterns

### AI INTERACTION PRINCIPLES

- Check available MCP tools when processing requests
- Check package.lock for commands and select the best one

---

## 🚀 PRACTICAL EXECUTION EXAMPLES

### Example 1: Skill-Only (Simple Task)

```
User: "Проверь архитектуру проекта на соответствие FSD"

Phase 1: Skill Discovery
  → Read skills, find fsd-architecture-check
  → Execute: /fsd-architecture-check

Phase 2: Complexity
  → Simple (1 step), skip coordinator

Phase 5: Result
  → Architecture report presented
```

### Example 2: Skill + Coordinator (Medium Task)

```
User: "Создай форму авторизации с валидацией и API"

Phase 1: Skill Discovery
  → Read all skills
  → Match: react-component-generator, rtk-query-endpoint-generator
  → Execute skills in parallel

Phase 2: Complexity
  → Medium (4+ steps remaining)

Phase 3: Coordination (MANDATORY)
  → Invoke: tactical-wave-orchestrator
  → Prompt: "Integrate generated LoginForm component with auth API,
             add validation, ensure FSD compliance"

Phase 4: Agent Execution
  → Coordinator selects: feature-development-specialist, zod-type-guard
  → Agents complete integration

Phase 5: Result
  → Complete auth feature presented
```

### Example 3: Coordinator-Led (Complex Task)

```
User: "Рефактори систему управления правами с оптимизацией"

Phase 1: Skill Discovery
  → Read skills, no direct match

Phase 2: Complexity
  → Complex (10+ steps, multi-domain)

Phase 3: Coordination (MANDATORY)
  → Invoke: master-coordinator
  → Prompt: "Refactor permissions system with performance optimization"

Phase 4: Agent Execution
  → Coordinator analyzes and selects:
    • semantic-project-analyzer (discovery)
    • security-specialist (permissions)
    • performance-optimization-specialist (optimization)
    • feature-development-specialist (implementation)
    • comprehensive-code-reviewer (validation)

Phase 5: Result
  → Complete refactoring presented
```

### Example 4: Multi-Skill Parallel Execution

```
User: "Создай модуль пользователей с компонентами, API и проверь архитектуру"

Phase 1: Skill Discovery
  → Read all skills
  → Match multiple skills:
    • react-component-generator (UserCard, UserList)
    • rtk-query-endpoint-generator (userApi)
    • fsd-architecture-check (validation)
  → Execute all skills in parallel

Phase 2: Complexity
  → Medium (integration needed)

Phase 3: Coordination
  → Invoke: tactical-wave-orchestrator
  → Prompt: "Integrate generated user module components"

Phase 4: Agent Execution
  → Coordinator selects: feature-development-specialist

Phase 5: Result
  → Complete user module presented
```

---

## 🎯 SKILL REFERENCE (Dynamic)

**Skills are auto-discovered by Claude Code from:**
```
~/.claude/skills/
├── auto-skills/               # Reminder plugin (use /skills to list)
│   └── SKILL.md
├── planning-with-files/       # Manus-style file-based planning
│   └── SKILL.md
├── fsd-architecture-check/
│   └── SKILL.md
├── react-component-generator/
│   └── SKILL.md
├── rtk-query-endpoint-generator/
│   └── SKILL.md
├── state-management-advisor/
│   └── SKILL.md
├── test-coverage-analyzer/
│   └── SKILL.md
├── typescript-patterns-generator/
│   └── SKILL.md
├── skill-generator/
│   └── SKILL.md
└── [custom skills]/
    └── SKILL.md
```

**Use `/skills` to see all available skills.** Claude automatically discovers them — no manual indexing needed!

**To create new skills:**
```
/skill-generator
```

---

## 📊 ESCALATION AND COMMUNICATION PROTOCOLS

### Upward Escalation Chain
```
Specialist → tactical-wave-orchestrator → master-coordinator

ESCALATE WHEN:
- Requirements unclear or conflicting
- Dependencies missing or blocked
- Architecture decisions needed
- Cross-domain integration required
- Resource constraints encountered
```

### Standard Communication Format
```
TASK DELEGATION:
- Agent: [target-agent]
- Context: [task background]
- Requirements: [specific deliverables]
- Success Criteria: [measurable outcomes]
- Timeline: [expected completion]

PROGRESS REPORTING:
- Status: [not-started/in-progress/completed/blocked]
- Progress: [percentage or milestone]
- Issues: [blockers or concerns]
- Next Steps: [upcoming activities]

ESCALATION REQUEST:
- Issue: [problem description]
- Impact: [business/technical impact]
- Proposals: [potential solutions]
- Decision Needed: [specific decision required]
```

---

**REMEMBER:**
1. **Skills first** — discover and match dynamically
2. **Coordinator mandatory** for 3+ step tasks
3. **Never select agents directly** — let coordinator decide
4. **Self-documenting code** is mandatory
