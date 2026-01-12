---
description: Code review with Verbalized Sampling - multiple severity perspectives with confidence levels
allowed-tools: Bash(git diff:*), Bash(git log:*)
version: 2.0.0
vs-enabled: true
---

# Verbalized Sampling Code Review

## Context

- Current git status: !`git status`
- Recent changes: !`git diff HEAD~1`
- Recent commits: !`git log --oneline -5`
- Current branch: !`git branch --show-current`

## Core VS Instruction

Perform comprehensive code review using **Verbalized Sampling**. For each review category, generate multiple perspectives with confidence probabilities.

## Output Format

```markdown
## Verbalized Sampling Code Review

### Category 1: Code Quality

**Perspective A: Readability Focus** (Confidence: X%)
- [Observations]
- [Recommendations]

**Perspective B: Maintainability Focus** (Confidence: X%)
- [Observations]
- [Recommendations]

**Perspective C: DRY/Elegance Focus** (Confidence: X%)
- [Observations]
- [Recommendations]

### Category 2: Security

**Perspective A: OWASP Top 10** (Confidence: X%)
- [Vulnerability assessment]
- [Severity levels]

**Perspective B: Injection Attacks** (Confidence: X%)
- [SQL injection, XSS, CSRF analysis]

**Perspective C: Data Exposure** (Confidence: X%)
- [Sensitive data handling]

### Category 3: Performance

**Perspective A: Algorithm Efficiency** (Confidence: X%)
- [Time/space complexity analysis]

**Perspective B: I/O Optimization** (Confidence: X%)
- [Database queries, API calls]

**Perspective C: Bundle Impact** (Confidence: X%)
- [Import analysis, tree-shaking]

### Category 4: Testing

**Perspective A: Coverage** (Confidence: X%)
- [Missing test scenarios]

**Perspective B: Test Quality** (Confidence: X%)
- [Test design assessment]

**Perspective C: Edge Cases** (Confidence: X%)
- [Uncovered edge cases]

### Category 5: Documentation

**Perspective A: API Documentation** (Confidence: X%)
- [JSDoc/TSDoc assessment]

**Perspective B: Code Comments** (Confidence: X%)
- [Comment quality vs self-documenting]

**Perspective C: README/Examples** (Confidence: X%)
- [Usage documentation]

---

## Priority Issues Summary

| Issue | Category | Confidence | Severity | Action |
|-------|----------|------------|----------|--------|
| [Issue 1] | [Category] | X% | [High/Med/Low] | [Fix now/later] |
```

## Review Dimensions with Probability Weights

| Dimension | Weight | What to Look For |
|-----------|--------|------------------|
| Code Quality | 25% | Readability, maintainability, DRY, elegance |
| Security | 30% | OWASP Top 10, injections, data exposure |
| Performance | 20% | Algorithms, I/O, bundle size |
| Testing | 15% | Coverage, quality, edge cases |
| Documentation | 10% | API docs, comments, examples |

## Confidence Levels

- **90-100%**: Critical issue, fix strongly recommended
- **70-89%**: Important issue, should address
- **50-69%**: Consider addressing, context-dependent
- **Below 50%**: Minor suggestion, nice-to-have

## Final Output

After multi-perspective analysis:
1. **Consolidate findings** across all perspectives
2. **Prioritize issues** by confidence × severity × weight
3. **Provide actionable feedback** with line-by-line comments
4. **Suggest fix order** based on impact vs effort
