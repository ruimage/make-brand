# Verbalized Sampling Validation Strategy

## Validation Phases

### Phase 1: Unit Validation (Per-Command)

**Test:** Run each VS-enhanced command on sample inputs

**Expected Output:**
- ✅ Exactly 5 approaches/options generated
- ✅ Probabilities sum to 100% (or 1.0)
- ✅ Each option has: probability, complexity, risk, description
- ✅ Trade-off matrix included
- ✅ Clear recommendation with rationale

**Validation Commands:**
```bash
# Test refractor
/refractor-vs tests/fixtures/complex-component.tsx

# Test code-review (needs git repo)
cd test-project && /code-review-vs

# Test plan
/plan-vs "Implement user authentication"

# Test optimize
/optimize-vs tests/fixtures/slow-function.ts

# Test feature-dev
/feature-dev-vs "Add dark mode toggle"

# Test state-management-advisor
/state-management-advisor-vs src/components/UserList.tsx
```

### Phase 2: Comparative Validation (A/B Testing)

**Test:** Compare original vs VS-enhanced commands

**Metrics:**
| Metric | Original | VS-Enhanced | Delta |
|--------|----------|-------------|-------|
| Options considered | 1-2 | 5 | +3-4 |
| Decision transparency | Low | High | ✅ |
| Trade-off visibility | Implicit | Explicit | ✅ |
| Confidence quantified | No | Yes | ✅ |
| Time to decision | Fast | Moderate | Acceptable |
| User satisfaction | TBD | TBD | Measure |

**Test Protocol:**
1. Run original command on task A
2. Run VS-enhanced command on task A
3. Compare recommendation quality
4. Survey user on preference
5. Measure if VS recommendation was chosen

### Phase 3: Real-World Validation

**Test:** Use VS commands in actual development workflow

**Success Criteria:**
- ✅ Developer accepts top-probability recommendation >70% of time
- ✅ Developer reports "better understanding of trade-offs"
- ✅ No increase in decision-making time >20%
- ✅ Reduced rework due to better upfront analysis

**Tracking:**
```markdown
## VS Decision Log

| Date | Command | Task | Top Option | Chosen? | Reason if Different |
|------|---------|------|------------|---------|---------------------|
| YYYY-MM-DD | refractor-vs | Extract hooks | Option 1 (35%) | ✅ | - |
| YYYY-MM-DD | plan-vs | Auth flow | Option 2 (28%) | ❌ | Option 3 chosen for speed |
| YYYY-MM-DD | state-advisor-vs | User list | RTK Query (85%) | ✅ | - |
```

### Phase 4: Scientific Validation

**Test:** Measure actual diversity improvement

**Method:**
1. Run same task 10 times with VS command
2. Calculate unique approaches generated
3. Compare to baseline (original command)

**Expected Results (based on research):**
- Baseline: 2-3 unique approaches across 10 runs
- VS: 4-5 unique approaches across 10 runs
- Diversity improvement: 1.6-2.1×

## Quality Gates

### Command Quality Checklist

For each VS-enhanced command:

- [ ] Core VS prompt present and correct
- [ ] Generates exactly 5 options
- [ ] Probabilities sum correctly
- [ ] Each option has complete metadata
- [ ] Recommendation is clearly stated
- [ ] Rationale explains why top option won
- [ ] Trade-offs are explicit
- [ ] Output format is consistent

### Probability Quality Checks

- [ ] Probabilities reflect actual likelihood
- [ ] Higher probability = better fit (not random)
- [ ] Probability distribution makes sense for context
- [ ] Edge cases don't break probability calculation
- [ ] Confidence scores are calibrated

### User Experience Checks

- [ ] Output is readable and scannable
- [ ] Tables/matrices render correctly
- [ ] Code examples are clear
- [ ] Recommendation is easy to find
- [ ] Actionable next steps are obvious

## Failure Modes and Recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Generates ≠5 options | Count output | Rephrase prompt |
| Probabilities don't sum | Calculate total | Normalize probabilities |
| Missing metadata | Check template | Add missing fields |
| No clear recommendation | Scan for "Recommended" | Add summary section |
| Probabilities random | Manual review | Add scoring criteria |

## Continuous Improvement

### Metrics to Track

1. **Acceptance Rate**: % of time top recommendation is chosen
2. **Rejection Reasons**: Why users choose other options
3. **Time Impact**: Does VS slow down decisions?
4. **Quality Impact**: Do VS choices lead to better outcomes?
5. **User Satisfaction**: Self-reported preference

### Iteration Process

1. Collect feedback from real usage
2. Identify patterns in rejection reasons
3. Adjust probability scoring criteria
4. Update templates based on findings
5. Re-validate with comparative tests

## Validation Timeline

| Phase | Duration | Success Criterion |
|-------|----------|-------------------|
| Unit Validation | 1 day | All 6 commands pass quality gates |
| Comparative Validation | 1 week | VS shows measurable improvement |
| Real-World Validation | 1 month | Acceptance rate >70% |
| Scientific Validation | 2 weeks | Diversity improvement confirmed |

## Reporting

Generate validation report with:
- Executive summary
- Per-command results
- Comparative analysis
- User feedback summary
- Recommendations for iteration
