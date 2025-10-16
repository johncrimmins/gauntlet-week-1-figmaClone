
# planning

- realized that I'm over-focusing on auth too early. probably should just deploy the realtime sync functionality without auth and implement that after. 
- using a new chat and multiple models to validate the plan worked well. used opus 4.1, sonnet 4.5, and chatgpt gpt5 heavy thinking and they had a general consensus about what needed to be fixed
- asking questions about the plan as I went used a lot of context in the same thread. consider using chatgpt if possible for branching off and asking questions without exploding the main context window for tight planning and better performance
- general observation: im spending like 6+ hours planning for the mvp. this feels like way too much. probably need to be way more aggressive about cutting scope and accepting technical debt for non-core features early. need to do the hard things first. 
- updating docs with minor things is slow - use a sub agent to do that, not the main thread in cursor
- cursor chat bash shell defaults to parent directory and its annoying af - figure out how to set default bash shell to the project directory and then the root of our project for it to work properly


# context management

- feels like I could better leverage indexing, like Zac does, to keep the agent aware of where we are in the process - having it read the .md file doesnt always let it feel good and it wants to verify things are implemented. maybe thats good tho? hmm


# debugging & bug fixing

- created a learnings.md file for agent to add learnings / bugs we found along the way - hoping this gets indexed to make building easier/faster as we go 


# general observations / questions

- when i ask the LLM to make a simple update to many places in a file - like adding task #'s to all tasks - it takes what seems like along amount of time. why is that?
- I spent a ton of time planning and thought I had spent too much (>6 hours) - however, looking back I realize this was essential to understanding the technologies involved - several of which I wasn't super familiar with. And There were still a few slight design errors that I ended up catching later, which if I had understood the technologies better, I could have prevented. Namely, one, using Conva objects for the cursors as opposed to using a separate HTML layer for this. I had planned to use Conva objects for the cursors, but when talking to ChatGPT later, found that this was an unreliable and complicated design pattern because I would have to back calculate cursor sizes because Conva is going to scale them. That's just completely unnecessary. What I could have done instead was understand the technologies and also ask AI about what are the best design patterns that are actually used for Figma and collaborative tools like Figma because it would have been revealed very quickly that using a separate HTML layer for the cursors is the obvious choice.  I didn't fully understand Firebase and Firestore and the potential to use Firebase real-time database. It would have been smart to look into those technologies and also run some calculations on what the performance I could get from each of them would be. I started with a plan recommended by Claude to use Firestore, but later found that this wouldn't work with the onDisconnect function that I wanted to use. And while I'm still not sure if Firestore or a Firebase real-time database should be used for the final implementation, I do realize that understanding the core dependency of what persistence method are we going to use for the real-time sync would have been great to more fully flesh out before starting, before locking into one of those. And also there's no need to change the technology because they just want to handle a very specific function pattern like on disconnect. So going forward, I should probably, after the MVP, make sure that FireTime real-time database is going to work for the performance I need. And if it's not, make a plan for how to implement Firebase Store or something else to be able to handle the performance that we need for the end product.

# key experiments / potential improvements for next iteration of build process
- As part of architecture planning, be specific about final performance requirements to get the correct stack from the beginning. My MVP stack I think won't work for the enterprise app well.
-  Ask AI early in planning about the technologies to understand them deeply and their trade-offs before locking into a tech stack. These are fundamental dependencies and implementation should be built around them. It's also essential to calculate the latency of an implementation using these technologies to ensure that it will eventually meet the performance criteria we're shooting for. Because it would be a massive waste to build everything out and then find out the technology just won't work for what we're trying to do. In this case, quantifying firebase RTDB vs firestore for handling realtime collaborative sync.
- I'm pretty sure being specific about performance targets when needed is improving the quality of the response. I think this is related to how they spoke about hte LLM defaulting to consensus, and that your prompt is the ingredient to bring out the brainSpikes or whatever (higher quality responses... just like "assume you're world class" and such used to work so well before)
    -> Why not just give the performance requirements and the MVP app to claude, like the PRD, not the PRD, the fucking, the requirements document, you know, with the rubric and performance targets, why don't I just give that to claude and ask him to design the optimized prompt very concisely or something to see if I can get the RPC. What if I tested that a few times to see if I can prompt to get the output that I'm looking for from that first one-shot prompt? That'll tell me a little bit about what kind of prompt engineering patterns I should be employing, especially during planning. 
- add somewhere as part of planning and PR-implementation instructions to always follow separation of concerns pattern (during planning the directory should be like this as well as task lists for like-code in like-places and decoupling where possible, and maybe double checking that during PR implementations)
- for more specific and prescriptive prompts: how do I easily understand which components and data flows to target in my prompt without knowing? Perhaps I can have a sub agent identify the components and flows, and then give me an overview of those to optimize my prompt? Perhaps this can be done as a sort of subroutine in order to just improve the prompts themselves and let this be a loop that's run for any debugging ever? 


# post-MVP plans for building the full app 
- fix the correct directory in chat thing w/ zac's cursor rules
- Dissect the current application and as part of planning for the full enterprise app, understand what might need to be changed in order to build on top of this to get to the full app at the end. It's imperative that the foundation is laid properly and that the technologies we're going to use will give us the performance we're looking for. I need to do calculations to make sure Firestore or real-time database sync from Firebase is going to work for our eventual app. And also ensure that the other technologies that we layer in will work together as well.
- Ask AI to review my dev process notes and any kind of progress tracking around the first app and ask it to help me think through ideas of how to improve my process, especially using software engineering best practices or other optimization techniques from other disciplines. 
- Improve directory hygene. I I can already tell just by looking at this code and looking at the code of some enterprise like app clones I've seen on Git now that it's better to sort things out according to their concerns and keep code together. A better structure that I think I'd like to employ before I build the full app after this MVP is listed below.
    ├── src/
│   ├── app/                         # Next.js app router pages
│   ├── components/                  # React components
│   │   ├── canvas/                  # Canvas-related components
│   │   ├── ui/                      # UI components
│   │   └── ai/                      # AI interaction components
│   ├── lib/
│   │   ├── firebase/                # Firebase configuration and helpers
│   │   ├── canvas/                  # Canvas logic and state management
│   │   ├── sync/                    # Real-time sync engine
│   │   └── ai/                      # Claude AI integration
│   ├── types/                       # TypeScript type definitions
│   └── hooks/                       # Custom React hooks
├── public/                          # Static assets
└── firebase.json                    # Firebase configuration



# IF I DO RESTART THIS FROM SCRATCH, heres what I think I'd do:
- Use much more specific prompts for the planning and the tasks. Definite quantify all of the goals and performance metrics like 60fps, 500+ objects and the <100ms sync
- Ensure the tech stack is 100% solid for final end product and be specific about the versions of everything (especially firestore sdk)
- Generate the start screen, deploy, then add in a lot of the ui components earlier on (have ai generate tons of boilerplate) and keep deploying early. Save auth for later



## Notion learnings
# for weekly dev process: add regular time to my calendar - see the notes from the office hours to do this
# for build process: add seperation of concerns for better directory / modules hygene. general structure should be:
components/ → visual pieces

lib/ → domain logic per feature (such as firebase configuration, canvas implementation, sync for real-time sync engine, ai for the ai integration)

hooks/ → reusable React logic

types/ → shared contracts

app/ → entry points and routing

docs/ -> documents & design decisions (architecture.md - System architecture and design decisions, MVP-Guide - 24-hour MVP implementation guide, Collaborative-Canvas.md - full canvas features implementation (generalize this to have a .md for implementation of each major featureset), ai-agent.md - ai agent implementation guide (another .md for major featureset), ai-development-log.md - ai-first development process tracking (use this specific file for inspiration as a template), testing-deployment.md - testing strategy and deployment guide). The general set of docs here should be {Architecture.md for architecture and design decisions, MVP.md for the extensible MVP conforming to end-state tech stack, featureset.md files for each major featureset implementation, ai-development-log.md for ai-first dev process tracking, and testing-deployment.md for testing strategy and deployment}

# philosophies to subscribe to: 
- deep modules, thin interfaces. deep modules -> handle their own logic, state, side effects. thin interfaces -> modules expose a small API surface (like a function, hook, or context provider) to the rest of the app. there should never be a messy /utils dumping ground. 
- separation of concerns -	UI (components) is distinct from logic (lib) and types/hooks.
- Feature Modularity -Each feature (AI, sync, canvas) is isolated — can evolve independently. All Modules are Hot Swappable Modules (HSM)
- Orthogonality - Changes to any interface should only change directly-interfacing modules; changes in implementations shouldn't affect changes in interfaces
- Interface Design: high-level module interfaces designed and specified w/ edge cases considered; interface designed for most-common use case as common default; optionality provided via optional parameters for flexibility & customization
- Scalability - Adding a new module (e.g., lib/comments) won’t pollute the rest of the app.
- Testability - Each lib/ module can be unit tested separately.
- Maintainability- Easy to onboard new devs — folders map directly to system domains.
- Prompt Engineering - all prompts delivered to AI or AI agents / devs follow the critical prompt success factors below
- Security - ensure requirements/hard constraints for this are captured in research, evaluated in plan, evaluated at end of implementation during testing
- Code Hygeine - Regular code cleanups at end of each major featureset implementation (remove dead code, modularize files to keep <500 lines of code, make code more concise, ensure JSDoc & other patterns detail interface at top of every file, ensure code style standards enforced, etc). Can also use popular libraries for this 
- Strong Progress Tracking - use of progress.md (for small implementations) or {feature-}tasklist.md (for PRD-driven implementations)

**Critical Prompt Success Factors**
Specificity Wins: "Build canvas component" → poor results. "Build canvas with react-konva, pan/zoom, rectangles/circles/lines/text, TypeScript" → excellent results
Context is King: Specify relevant filenames, interfaces, functions & methods as part of indexed context in every propmt  
Constraints = Quality: Always specify tech stack, SDK versions, database names, and performance targets upfront
Iterative Validation: Test AI output immediately; catch issues early before building on faulty foundation
Effective Debugging: Share error messages, existing code, identify data flows associated to bug, implement logging for those data flows, use console logs and stack traces for effective debugging
AI Multiplies, Doesn't Replace: Best results when AI handles boilerplate while developer focuses on architecture, optimization, and edge cases 


# key features for v2 of the app itself
- optimistic updates & better caching / state management (zustand or redux possibly)


# key things to layer in after process dialed in
- autogenerate content for X + blog based on project learnings.md, ai-development-process.md (process w/ iteration version followed for this build and any experiments ran and their outcomes), and git commit logs 


# for learning about the codebase before, during, or after implementation
prompt: ”Please modularize all my code” - combine the cursor output w a couple AI assistant queries and you’ll know it all upside down & backwards too; then you can record the video for submission


**Phases of Build Process**
# Research
- Goal: 1) Identify hard performance constraints / requirements 2) Identify high level dependencies and tech stack 3) Validate/quantify tech stack will work for performance requirements (if needed, look up recently published documentation to verify) 
- Inputs: hard performance constraints / requirements of end state app; specific concise description of end state app
- Output: clear specs as inputs for Plan: 1) Architecture.md (high level architecture markdown file: v1 structure follows structure in inspo git) 2) PRD (v1 structure follows structure in inspo git) 

# Plan
- Goal: 1) Use Research outputs to create detailed plan for a) MVP Implementation Guide (v1 structure follows inspo git) b) {Feature}.md - implementation guide for each feature, v1 structure follows inspo git)
- Inputs: Clear specs from Research 
- Outputs: 1) MVP-Plan.md (validation: satisfies hard constraints for mvp; build follows logical extensible workflow; high level tasks w/ key modules/interfaces specified in detail; double-check against documentation for tech stack that implementation will be successful) 2) {feature}.md same thing for each feature - all criteria from MVP plan apply; hard constraints for each feature are satisfied; testing + deployment between MVP and each feature and security/cleanup checks

# Implement
- Goal: fill in goal for this later 
- Inputs: clear specs for implementation plan from Plan; Architecture.md 
Debugging strategy doc and .debug-learnings file for identifying bad patterns (keep concise and experiment with vs without this as it might actually be bad if it gets indexed according to Zac)
- Outputs: MVP and a deployed build for each feature

# TIME-BOUNDING & ITERATION 
- Time-bound each phase to ensure it's moving faster with same quality every iteration


# Future additions to process / things that are unclear
- Handling progress tracking & better indexing / Memory banking- Zac uses cursor rules for effective progress tracking + memory banking (indexing for context optimization). I'd like to understand how Dex does this and if it's different. Right now I handle the progress tracking via the task lists for MVP and featuresets, but if the implementation isn't working according to the plan then there needs to be a way to update documentation (without exploding context window or getting into build-update plan loops) 
- Updating the architecture.md as files are created as part of implementation, use this as source of truth for validating extensibility (maybe include this as part of research / Plan phases as a validation check for modules/interfaces; if mmd becomes usable or something like it whatever's best doesn't have to be .md later)
- Better cursor rules / commands that conform to my process (such as update memory bank, update docs, update progress, intelligently compact existing chat for context export or indexing, test that rules are being followed and indexed in chats because they dont always work first shot like by using a visual like yoda-quotes, etc)
- As part of Implementation: whether to follow a prescriptive task list as-is or use the Plan mode in Cursor / Claude Code for just implementing the high level specs from the plan
- prompt iteration / prompt version control 
- better testing strategy (unit testing: v-test, e2e w/ computer use: playwright mcp and chrome devtools MCP)


# general advice/tips for humans working w/ cursor/ai
- read the bottom of the message first if its long; often gives you the high level tldr instead of having to read everything the AI says