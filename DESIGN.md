# Ascend USA

## Mission
Create implementation-ready, token-driven UI guidance for Ascend USA that is optimized for consistency, accessibility, and fast delivery across e-commerce storefront.

## Brand
- Product/brand: Ascend USA
- URL: https://ascendlaboratories.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=DM Sans`, `font.family.stack=DM Sans, Manrope, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=27.2px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=13px`, `font.size.md=14px`, `font.size.lg=15px`, `font.size.xl=16px`, `font.size.2xl=17px`, `font.size.3xl=18px`, `font.size.4xl=20px`
- Color palette: `color.text.primary=#5f6f85`, `color.text.secondary=#ffffff`, `color.border.default=#0a1b2b`, `color.text.inverse=#cbd5e1`, `color.surface.base=#000000`, `color.surface.raised=#0f172a`, `color.surface.strong=#080089`, `color.border.strong=#94a3b8`
- Spacing scale: `space.1=6px`, `space.2=7px`, `space.3=8px`, `space.4=10px`, `space.5=12px`, `space.6=13px`, `space.7=14px`, `space.8=15px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.sm=8px`, `radius.md=10px`, `radius.lg=12px`, `radius.xl=14px`, `radius.2xl=16px`, `radius.step7=20px`, `radius.step8=50px` | `shadow.1=rgba(0, 0, 0, 0.08) 0px 4px 16px 0px`, `shadow.2=rgba(0, 0, 0, 0.1) 0px 2px 8px 0px`, `shadow.3=rgba(8, 0, 137, 0.4) 0px 0px 25px 0px, rgba(0, 0, 0, 0.3) 0px 4px 20px 0px`, `shadow.4=rgba(8, 0, 137, 0.314) 0px 0px 30px 0px, rgba(0, 0, 0, 0.3) 0px 4px 20px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=300ms`, `motion.duration.slow=400ms`, `motion.duration.slower=750ms`, `motion.duration.step6=800ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: cards (59), buttons (14), links (13), inputs (6), lists (3), navigation (2).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
