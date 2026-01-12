---
description: Guided feature development with Verbalized Sampling for architecture decisions
version: 2.0.0
vs-enabled: true
---

# Feature Development with Verbalized Sampling

You are helping a developer implement a new feature using **Verbalized Sampling** for architecture decisions.

## Core Principles

- **Verbalized Sampling**: Generate 5 architecture approaches with probabilities
- **Multi-agent analysis**: Use parallel agents for comprehensive understanding
- **Ask clarifying questions**: Identify all ambiguities before designing
- **Simple and elegant**: Prioritize maintainable code

---

## Phase 1: Discovery

**Goal**: Understand what needs to be built

Initial request: $ARGUMENTS

**Actions**:
1. Create todo list with all phases
2. If feature unclear, ask user for:
   - What problem are they solving?
   - What should the feature do?
   - Any constraints or requirements?
3. Summarize understanding and confirm with user

---

## Phase 2: Codebase Exploration

**Goal**: Understand relevant existing code and patterns

**Actions**:
1. Launch 2-3 code-explorer agents in parallel
2. Each agent returns:
   - 5-10 key files to read
   - Architecture patterns found
   - Potential integration points
3. Read all identified files
4. Present comprehensive summary

---

## Phase 3: Clarifying Questions

**Goal**: Fill in gaps before architecture design

**CRITICAL**: DO NOT SKIP this phase

**Actions**:
1. Identify underspecified aspects
2. **Present all questions in a clear, organized list**
3. **Wait for answers before proceeding**

---

## Phase 4: Architecture Design with VS ⭐

**Goal**: Generate multiple approaches with probability assessment

### Verbalized Sampling Instruction

Generate 5 architecture approaches with their corresponding probabilities, sampled from the full distribution of possible architectures.

### Output Format

```markdown
## Verbalized Sampling Architecture Analysis

### Approach 1: [Name] (Probability: X%)
**Complexity:** Low | **Risk:** Safe | **Time to Implement:** X hours
**Effort:** Minimal | **Maintainability:** High

**Description:**
[High-level approach description]

**Architecture:**
```
[Component/Module diagram in text]
┌─────────────────┐
│                 │
└─────────────────┘
```

**Key Files:**
- [File 1] - [Changes needed]
- [File 2] - [Changes needed]

**Pros:**
- ✅ [Pro 1]
- ✅ [Pro 2]

**Cons:**
- ⚠️ [Con 1]
- ⚠️ [Con 2]

**Trade-offs:**
| Aspect | Rating | Notes |
|--------|--------|-------|
| Simplicity | ⭐⭐⭐⭐⭐ | Very clean |
| Scalability | ⭐⭐⭐ | Good for current needs |
| Maintainability | ⭐⭐⭐⭐⭐ | Easy to understand |
| Development Speed | ⭐⭐⭐⭐⭐ | Fastest to implement |

---

### Approach 2: [Name] (Probability: X%)
[Same structure]

...

### Approach 3: [Name] (Probability: X%)
[Same structure]

...

### Approach 4: [Name] (Probability: X%)
[Same structure]

...

### Approach 5: [Name] (Probability: X%)
[Same structure]

...

## Probability Distribution Summary

| Approach | Probability | Cumulative | Rank |
|----------|-------------|------------|------|
| [Name 1] | X% | X% | #1 |
| [Name 2] | X% | X% | #2 |
| [Name 3] | X% | X% | #3 |
| [Name 4] | X% | X% | #4 |
| [Name 5] | X% | X% | #5 |

## Recommendation

**Primary Recommendation:** [Highest probability approach]

**Rationale:**
- Best fit for task complexity
- Balances speed vs quality
- Team can maintain this
- Lowest risk for current constraints

**Alternative Consideration:** [Second highest]
Consider this if: [Specific condition where alternative is better]

---

## User Selection

Which approach would you like me to implement?

1. **[Approach 1]** - [One-line summary]
2. **[Approach 2]** - [One-line summary]
3. **[Approach 3]** - [One-line summary]
4. **[Approach 4]** - [One-line summary]
5. **[Approach 5]** - [One-line summary]
6. **Hybrid** - Mix elements from multiple approaches
```

### Architecture Dimensions

When generating approaches, consider:

| Dimension | Focus | Typical Probability Range |
|-----------|-------|---------------------------|
| **Minimal Changes** | Smallest diff, max reuse | 15-25% |
| **Clean Architecture** | Best practices, elegance | 20-30% |
| **Pragmatic Balance** | Speed + quality trade-off | 25-35% |
| **Feature-Complete** | All bells and whistles | 10-20% |
| **Future-Proof** | Extensibility first | 5-15% |

### Probability Calculation

```javascript
// Probability factors (simplified)
baseProbability = 20%

// Positive factors
+ taskFit = 0-30%        // How well it solves the specific problem
+ teamSkill = 0-15%      // Team's familiarity with approach
+ timeConstraint = 0-20% // Fits timeline
+ complexityMatch = 0-15% // Matches task complexity

// Negative factors
- risk = 0-25%           // Implementation risk
- overEngineering = 0-20% // Too complex for task
- technicalDebt = 0-15%  // Creates future burden

finalProbability = baseProbability
                  + taskFit + teamSkill + timeConstraint + complexityMatch
                  - risk - overEngineering - technicalDebt
```

---

## Phase 5: Implementation

**DO NOT START WITHOUT USER APPROVAL**

**Actions**:
1. Wait for explicit user approval
2. Read all relevant files
3. Implement following chosen architecture
4. Update todos as you progress

---

## Phase 6: Quality Review

**Goal**: Ensure code quality with VS-based review

**Actions**:
1. Launch 3 code-reviewer agents with different focuses
2. Each agent returns findings with confidence scores
3. Consolidate and present to user

```markdown
## Verbalized Sampling Quality Review

### Reviewer 1: Simplicity/DRY/Elegance Focus
**Confidence:** 85%

**Findings:**
- [Issue 1] (Severity: High)
- [Issue 2] (Severity: Medium)

### Reviewer 2: Bugs/Functional Correctness Focus
**Confidence:** 92%

**Findings:**
- [Issue 1] (Severity: Critical)
- [Issue 2] (Severity: Low)

### Reviewer 3: Project Conventions Focus
**Confidence:** 78%

**Findings:**
- [Issue 1] (Severity: Medium)

---

## Priority Issues

| Issue | Confidence | Severity | Fix Now? |
|-------|------------|----------|----------|
| [Issue 1] | 92% | Critical | ✅ Yes |
| [Issue 2] | 85% | High | ✅ Yes |
| [Issue 3] | 78% | Medium | ⏸️ Later |
```

---

## Phase 7: Summary

**Actions**:
1. Mark all todos complete
2. Summarize:
   - What was built
   - Architecture approach used
   - Key decisions made
   - Files modified
   - Suggested next steps
