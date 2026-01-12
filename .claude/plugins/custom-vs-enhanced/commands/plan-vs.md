---
description: Implementation planning with Verbalized Sampling - multiple strategies with risk assessment
version: 2.0.0
vs-enabled: true
---

# Verbalized Sampling Implementation Plan

## Core VS Instruction

Generate 5 implementation strategies with their corresponding probabilities for: **$ARGUMENTS**

Each strategy should include:
- **Probability** (estimated fitness for this specific task)
- **Time estimate** (hours/days)
- **Risk level** (Low/Medium/High)
- **Complexity** (Simple/Moderate/Complex)
- **Dependencies** (what needs to exist first)

## Output Format

```markdown
## Verbalized Sampling Implementation Plan

### Strategy 1: [Name] (Probability: X%)
**Time:** X hours | **Risk:** Low | **Complexity:** Simple
**Dependencies:** [None/List]

**Approach:**
[High-level description]

**Files to Change:**
- [File 1] - [What changes]
- [File 2] - [What changes]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Implementation Steps:**
1. [Step 1]
2. [Step 2]

---

### Strategy 2: [Name] (Probability: X%)
[Same structure]

...

## Recommended Strategy: [Name]

**Rationale:** [Why this strategy]

**Implementation Phases:**
- **Phase 1:** [What, time, outcome]
- **Phase 2:** [What, time, outcome]
- **Phase 3:** [What, time, outcome]

**Function Names:**
- `functionName1()` - [1-3 sentence description]
- `functionName2()` - [1-3 sentence description]

**Test Names:**
- `test scenario name` - [5-10 words about behavior]

**Risk Mitigation:**
- [Risk 1] → [Mitigation]
- [Risk 2] → [Mitigation]
```

## Strategy Dimensions

Consider strategies across:

1. **Minimal Implementation** (Probability: 15-25%)
   - Smallest possible change
   - Maximum reuse of existing code
   - Fastest delivery
   - Lowest risk

2. **Clean Architecture** (Probability: 20-30%)
   - Best practices
   - Elegant abstractions
   - Future-proof design
   - Higher complexity

3. **Pragmatic Balance** (Probability: 25-35%)
   - Good design, reasonable speed
   - Some technical debt acceptable
   - Team familiarity
   - Moderate risk

4. **Feature-Complete** (Probability: 10-20%)
   - All bells and whistles
   - Comprehensive solution
   - Longer timeline
   - Higher complexity

5. **MVP-First** (Probability: 10-20%)
   - Core functionality only
   - Iterate later
   - Fastest to value
   - Unknown edge cases

## Decision Factors

When recommending the strategy, consider:
- **Urgency**: How soon is this needed?
- **Complexity**: How complex is the feature?
- **Team context**: Who will maintain this?
- **Scope**: Small fix vs large feature?

## Planning Checklist

- [ ] Read and understand the GitHub issue
- [ ] Identify files that need changes
- [ ] Plan only what's needed right now (no over-engineering)
- [ ] Estimate time for each phase
- [ ] Identify dependencies and blockers
- [ ] Define test scenarios upfront
- [ ] Consider rollback strategy
