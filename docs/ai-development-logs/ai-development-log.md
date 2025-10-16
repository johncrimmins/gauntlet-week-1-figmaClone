# AI Development Process Log

*1-page breakdown documenting AI-first development process*

---

## Tools & Workflow

**Methodology:**
- Ash's PRD-based methodology: Generate PRD, plan tasklist for implementation, and generate architecture mermaid diagram. Refine them until well-aligned.

**Workflow:**
- **Planning**: Cursor with Claude 4.1 Opus for planning each PR
- **Implementation**: Claude 4.5 Sonnet for implementing each task
- **Code Review**: Subagent using Claude 4.5 (useful once or twice)
- **Code Cleanup**: Subagent with Gemini 2.5 Pro (not useful - thought everything looked great!)

---

## Prompting Strategies

### Prompt 1: New PR Implementation (v1)

**Context:** Worked well for basic PRs - identified current state and built from there. However, it sometimes steamrolled through multiple tasks without proper approval checkpoints.

**Prompt:**
```
Please use tools to explore the codebase and pay special attention to the slash docs folder. I then want you to review the tasklist.md file and let's start building out our next PR. To do this, I want you to please ensure that you're following tasks one at a time and I'm approving them one by one as we go. Do not move on to other tasks or other PRs or edit anything except for the tasks that are specified under our current PR. Please verify the PR that we're working on by reading the document and letting me know which one we're working on. This is very important. Please never move on to another task except the one that we are working on until I have approved it and you let me know what to look at to validate that it's working. And then after my approval, go ahead and mark the task as completed. Create a plan for how to implement the next task which needs to be done.
```

### Prompt 2: New PR Implementation (v2 - Improved)

**Context:** More specific and concise. Interestingly, in Plan mode (PR5) it created its own plan rather than following the tasklist - but achieved great results. In Agent mode (PR6) it followed the tasklist plan.

**Prompt:**
```
Please use tools to explore the codebase. Review @tasklist.md file and identify what PR to build. Create a plan to implement the that PR. Very important: Do not work on any tasks outside the current PR. Also very important: double check code implemented to ensure implementation is complete and bug-free. When you're done, provide instructions for user to validate your work according to the current PR's **Definition of Done section:** section. The user will thoroughly test your implementation to verify correct implementation.
```

### Prompt 3: Project Planning (Complete Restart)

**Context:** Used for v2 planning after complete restart. Output wasn't perfect but significantly better than initial starter prompts.

**Prompt:**
```
Review project overview in collabcanvas.md. Review final project in requirements.md. Recommend optimal tech stack, design Architecture (modular, extensible design), create high-level implementation plan by phase (start with MVP, extend one layer at a time).
```

---

## Code Analysis

**AI-Generated Code:** 100%

---

## Strengths & Limitations

### Where AI Excelled

- Generating boilerplate code
- Advising on database setup
- Implementing logging for debugging
- Understanding rambling prompts (until better prompting skills developed)

### Where AI Struggled

- **Planning**: Struggled to identify appropriate tech stack from vague requirements. Resolved through better prompt engineering with explicit requirements. The rebuild with clearer prompts yielded much better tech stack recommendations.

- **Modularization / Directory Structure**: Wasn't consistently referencing docs or adhering to them (especially in early PRs). Resolved through better context management: attaching relevant docs and breaking large files (1k+ lines) into smaller, focused documents. Post-fix, PRs 4-8 went smoothly.

- **UI Debugging**: Spent 1-2 hours debugging seemingly simple issues. Resolved by implementing logging to trace data flows and feeding errors back for debugging. Documented bad pathways in `learnings.md` which helped, though Zac Smith noted this might index bad patterns into the codebase. Better debugging workflow needed for future iterations.

- **Batch Edits**: Adding checkboxes to key lines in a 300-line tasklist took ~10 minutes. Appeared to re-read file for every single edit.

---

## Key Learnings

- **Context is King**: Specificity and conciseness are critical. Always include screenshots for frontend work. Use explicit file decorators (e.g., `@filename.md`) to avoid forcing the AI to search and fill context with basic file lookups.

- **Progress Management**: Can be effectively managed with well-structured `progress.md` or PR-tasklist methodology (from Ash). This provided good intuition for implementing a memory bank in v2.

- **Explicit Requirements**: Being specific about performance requirements yields much better planning results. Example: specifying `<60 fps for realtime cursor sync` immediately prompted Firebase RTDB recommendation.

- **Avoid Over-Optimization**: Easy to get lost in workflow optimization, over-engineering, and over-planning. Spent too much time on planning (good tuition for learning prompting) and workflow optimization. Recognized that many optimization paths are mirages - better to build fundamental intuition first and iterate on just a few workflow components at a time. 
