# Verbalized Sampling Integration Guide

## Overview

This collection contains **Verbalized Sampling (VS)** enhanced versions of existing Claude Code commands and skills. VS is a scientifically-proven prompting technique from Stanford/Northeastern University (October 2025) that improves output diversity by 1.6-2.1×.

## What is Verbalized Sampling?

**Core Prompt Template:**
```
Generate 5 responses with their corresponding probabilities,
sampled from the full distribution. Each response should be
paired with its estimated probability relative to the full
distribution of possible responses.
```

**Key Benefits:**
- 1.6-2.1× diversity increase in creative/analytical tasks
- Reduces "mode collapse" (stereotypical responses)
- Provides quantitative confidence assessment
- Makes trade-offs explicit

## Installation

### Option 1: Add to Custom Marketplace

1. Create or edit `marketplace.json`:
```json
{
  "name": "custom-vs-enhanced",
  "version": "1.0.0",
  "plugins": [
    {
      "name": "refractor-vs",
      "source": "./commands/refractor-vs.md",
      "category": "commands"
    },
    {
      "name": "code-review-vs",
      "source": "./commands/code-review-vs.md",
      "category": "commands"
    },
    {
      "name": "plan-vs",
      "source": "./commands/plan-vs.md",
      "category": "commands"
    },
    {
      "name": "optimize-vs",
      "source": "./commands/optimize-vs.md",
      "category": "commands"
    },
    {
      "name": "feature-dev-vs",
      "source": "./commands/feature-dev-vs.md",
      "category": "commands"
    },
    {
      "name": "state-management-advisor-vs",
      "source": "./skills/state-management-advisor-vs/SKILL.md",
      "category": "skills"
    }
  ]
}
```

2. Add to Claude Code:
```bash
/plugin marketplace add /path/to/custom-vs-enhanced
```

### Option 2: Direct File Copy

Copy individual files to your existing marketplace or local commands directory.

## Commands Reference

| Command | Original | VS Enhancement |
|---------|----------|----------------|
| `refractor-vs` | `/refractor` | 5 refactoring approaches with probability, complexity, risk assessment |
| `code-review-vs` | `/code-review` | Multi-perspective review with confidence scores per category |
| `plan-vs` | `/plan` | 5 implementation strategies with time/risk/complexity estimates |
| `optimize-vs` | `/optimize` | 5 optimization strategies with impact probability estimation |
| `feature-dev-vs` | `/feature-dev` | 5 architecture approaches with trade-off matrices |

### Skills

| Skill | Original | VS Enhancement |
|-------|----------|----------------|
| `state-management-advisor-vs` | `state-management-advisor` | Probability-based state placement with scoring system |

## Usage Examples

### Example 1: Refactoring with VS

```bash
/refractor-vs src/components/UserList.tsx
```

**Output includes:**
- Approach 1: Extract custom hooks (Probability: 35%)
- Approach 2: Split into smaller components (Probability: 28%)
- Approach 3: Apply compound components pattern (Probability: 18%)
- Approach 4: Use render props for flexibility (Probability: 12%)
- Approach 5: Complete rewrite with TypeScript (Probability: 7%)

Each with complexity, risk, and migration guide.

### Example 2: State Management with VS

```bash
/state-management-advisor-vs src/pages/users/UserList.tsx
```

**Output includes:**
For each state found (e.g., `users`, `page`, `filter`):
- 5 placement options with probability scores
- Scoring breakdown (data source, caching, sharing, URL, real-time)
- Migration path from current to recommended

### Example 3: Architecture Design with VS

```bash
/feature-dev-vs Implement user notifications
```

**Phase 4 Output includes:**
- Approach 1: In-app notifications only (Probability: 30%)
- Approach 2: Email + in-app (Probability: 25%)
- Approach 3: Push + in-app (Probability: 20%)
- Approach 4: All channels (Probability: 15%)
- Approach 5: Third-party service (Probability: 10%)

With trade-off matrices and recommendation rationale.

## Probability Calculation Guide

### Base Principles

1. **Probabilities should sum to 100%** across all options
2. **Higher probability = better fit** for the specific context
3. **Confidence scores** indicate how certain the model is about its assessment
4. **Trade-offs should be explicit** in each option

### Scoring Factors

| Factor | Weight | Example |
|--------|--------|---------|
| Context Fit | 30% | How well it solves the specific problem |
| Team Skill | 15% | Team familiarity with the approach |
| Time Constraints | 20% | Fits within timeline |
| Risk | 20% | Implementation and maintenance risk |
| Future Proofing | 15% | Extensibility and adaptability |

## When to Use VS-Enhanced Commands

**Use VS for:**
- Architecture decisions with multiple valid approaches
- Refactoring with trade-offs between readability/performance
- State management placement decisions
- Implementation strategy selection
- Code review with multiple valid perspectives

**Skip VS for:**
- Obvious fixes (typos, simple bugs)
- Well-established patterns (no real alternatives)
- Emergency fixes (speed over analysis)
- Trivial changes (one-line fixes)

## Validation Strategy

To validate VS integration effectiveness:

1. **A/B Testing**: Compare original vs VS-enhanced commands on same tasks
2. **User Feedback**: Survey developers on decision quality
3. **Outcome Tracking**: Measure if recommended approaches are implemented
4. **Time Analysis**: Does VS save time by reducing rework?

## Scientific Background

**Paper:** "Verbalized Sampling: Distribution-Level Prompting for Aligned Language Models" (October 2025)

**Key Findings:**
- 66.8% diversity recovery vs 23.8% in baseline
- 1.5-2× improvement for larger models
- Most effective for: creative writing, dialogue simulation, open-ended scenarios

**Reference:** https://arxiv.org/abs/2510.01171v3

## Contributing

To add VS enhancement to a command:

1. **Identify decision points** where multiple valid options exist
2. **Create output template** with probability structure
3. **Define scoring criteria** for probability calculation
4. **Add trade-off matrices** for easy comparison
5. **Include recommendation rationale** explaining why top option won

## License

Same as parent Claude Code plugins marketplace.
