---
description: Refactor code with Verbalized Sampling - multiple approaches with probability assessment
argument-hint: <file-path>
version: 2.0.0
vs-enabled: true
---

# Verbalized Sampling Refactor

Refactor the following code using **Verbalized Sampling**: @$ARGUMENTS

## Core VS Instruction

Generate 5 refactoring approaches with their corresponding probabilities, sampled from the full distribution of possible refactoring strategies. Each approach should be paired with:
- **Estimated probability** (relative likelihood of being the best fit)
- **Complexity assessment** (Low/Medium/High)
- **Risk level** (Safe/Moderate/Aggressive)
- **Expected impact** (Readability/Performance/Maintainability)

## Output Format

```markdown
## Verbalized Sampling Analysis

### Approach 1: [Name] (Probability: X%)
**Complexity:** Low | **Risk:** Safe | **Focus:** Readability

**Description:**
[What this approach does]

**Changes:**
- [Key change 1]
- [Key change 2]

**Expected Impact:**
- Readability: +X%
- Performance: +X%
- Maintainability: +X%

---

### Approach 2: [Name] (Probability: X%)
[Same structure]

...

## Recommended Approach: [Name]

**Rationale:** [Why this specific approach is recommended for this codebase]

**Implementation:** [Step-by-step]
```

## Refactoring Dimensions

Consider approaches across these dimensions:

1. **Readability-focused** (Probability: typically 20-30%)
   - Self-documenting names
   - Reduce nesting
   - Extract magic values
   - Simplify conditionals

2. **Performance-focused** (Probability: typically 10-20%)
   - Algorithm optimization
   - Reduce time complexity
   - Memoization
   - Lazy evaluation

3. **Maintainability-focused** (Probability: typically 20-30%)
   - Extract reusable functions
   - Apply design patterns
   - Separate concerns
   - Reduce duplication

4. **Type-safety-focused** (Probability: typically 10-20%)
   - Improve type annotations
   - Add type guards
   - Use discriminated unions
   - Remove `any` types

5. **Modern-syntax-focused** (Probability: typically 10-20%)
   - Modern language features
   - Idiomatic patterns
   - Remove deprecated APIs
   - Apply latest conventions

## Quality Gates

For the recommended approach:
- **Maintain functionality**: No breaking changes
- **Test compatibility**: Existing tests pass
- **Backward compatibility**: Public APIs preserved
- **Documentation**: Update comments/examples

## Final Step

After presenting all approaches:
1. **Recommend the highest-probability approach**
2. **Provide full implementation code**
3. **Explain why other approaches were less suitable**
