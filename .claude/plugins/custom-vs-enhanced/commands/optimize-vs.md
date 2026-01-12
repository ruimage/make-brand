---
description: Code optimization with Verbalized Sampling - multiple optimization strategies with impact probabilities
allowed-tools: Bash(du:*), Bash(wc:*)
version: 2.0.0
vs-enabled: true
---

# Verbalized Sampling Optimization

## Context

- File size: !`du -h $ARGUMENTS 2>/dev/null || echo "File not specified"`
- Line count: !`wc -l $ARGUMENTS 2>/dev/null || echo "File not specified"`

## Core VS Instruction

Analyze and optimize using **Verbalized Sampling**: @$ARGUMENTS

Generate 5 optimization strategies with their corresponding probabilities and expected impact scores.

## Output Format

```markdown
## Verbalized Sampling Optimization Analysis

### Strategy 1: [Name] (Probability: X% | Expected Impact: X%)
**Complexity:** Low | **Risk:** Safe | **Time:** X hours

**Focus:** [Primary dimension]

**Proposed Changes:**
1. [Change 1] - [Expected improvement]
2. [Change 2] - [Expected improvement]

**Before/After Comparison:**
```typescript
// Before
[Current code]

// After
[Optimized code]
```

**Performance Impact:**
- Time complexity: O([before]) → O([after])
- Space complexity: O([before]) → O([after])
- Estimated speedup: X%

---

### Strategy 2: [Name] (Probability: X% | Expected Impact: X%)
[Same structure]

...

## Recommended Strategy: [Name]

**Expected Total Impact:** X%

**Implementation Steps:**
1. [Step 1]
2. [Step 2]

**Performance Estimates:**
- Initial load time: Xms → Xms (X% improvement)
- Runtime: Xms → Xms (X% improvement)
- Memory: XMB → XMB (X% reduction)
- Bundle size: XKB → XKB (X% reduction)
```

## Optimization Dimensions with Probability Weights

| Dimension | Base Probability | When to Increase | When to Decrease |
|-----------|------------------|------------------|------------------|
| **Algorithm efficiency** | 20% | Nested loops, large datasets | Already optimal |
| **Memory usage** | 15% | Large arrays/objects | Small data |
| **I/O operations** | 20% | API calls, file operations | Pure computation |
| **Caching opportunities** | 20% | Repeated calculations | Unique operations |
| **Lazy loading** | 15% | Large bundles, slow initial load | Fast load already |
| **Bundle optimization** | 10% | Large dependencies | Small bundle |

## Strategy Patterns

### 1. Algorithm Efficiency (15-25% probability)

**Triggers:**
- Nested loops O(n²) or worse
- Large datasets (>1000 items)
- Repeated searches/sorts

**Approaches:**
- Replace nested loops with Map/Set lookups
- Use binary search instead of linear
- Apply memoization to expensive calculations
- Consider divide-and-conquer algorithms

### 2. Memory Optimization (10-20% probability)

**Triggers:**
- Large arrays/objects held in state
- Memory leaks (unclosed subscriptions)
- Unnecessary data duplication

**Approaches:**
- Use pagination/virtualization for lists
- Implement proper cleanup in useEffect
- Share references instead of copying
- Use immutable updates carefully

### 3. I/O Optimization (15-25% probability)

**Triggers:**
- Multiple sequential API calls
- Unnecessary re-fetches
- Large file reads/writes

**Approaches:**
- Batch API requests
- Implement request caching
- Use parallel requests where possible
- Add debouncing/throttling

### 4. Caching Strategy (15-25% probability)

**Triggers:**
- Expensive recalculations
- Repeated data fetches
- Complex derivations

**Approaches:**
- RTK Query for API caching
- useMemo for expensive computations
- useCallback for function stability
- Local storage for persistence

### 5. Lazy Loading (10-20% probability)

**Triggers:**
- Slow initial bundle load
- Large page size
- Rarely used features

**Approaches:**
- React.lazy() for components
- Dynamic imports for heavy modules
- Code splitting by route
- Progressive loading

### 6. Bundle Optimization (5-15% probability)

**Triggers:**
- Large build output
- Tree-shaking not working
- Duplicate dependencies

**Approaches:**
- Remove unused imports
- Replace heavy libraries with lighter alternatives
- Enable production optimizations
- Analyze bundle with webpack-bundle-analyzer

## Probability Calculation

For each strategy, calculate probability based on:

```
Base Probability
+ Trigger Present (+10-30%)
+ Impact Potential (+5-15%)
+ Implementation Ease (+5-10%)
- Risk Factor (-5-20%)
- Diminishing Returns (-5-15%)
= Final Probability
```

## Impact Estimation

Provide quantitative estimates where possible:

- **Speedup**: Use Big-O analysis to estimate improvement
- **Memory**: Calculate reduction in bytes/MB
- **Bundle**: Estimate KB reduction from tree-shaking
- **User experience**: Estimate ms saved for critical actions

## Risk Assessment

| Risk Level | Definition | Example |
|------------|------------|---------|
| **Safe** | Low chance of breaking changes | Adding caching |
| **Moderate** | Some risk, manageable | Refactoring algorithms |
| **Aggressive** | Higher risk, thorough testing needed | Changing state architecture |

## Quality Gates

For recommended strategy:
- ✅ Functionality preserved
- ✅ Tests pass
- ✅ No regressions
- ✅ Measurable improvement
- ✅ Code remains readable

## Final Output

After multi-strategy analysis:
1. **Rank strategies** by probability × impact
2. **Recommend top strategy** with full implementation
3. **Provide fallback options** if primary is too risky
4. **Suggest A/B testing** for ambiguous cases
