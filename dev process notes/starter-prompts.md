## Planning prompts


# Create PRD - attach w/ mvp doc
# model: claude 4.5 sonnet 
The following document is a breakdown of a project I'm creating called CollabCanvas. It details the project, including MVP requirements and what I have to ship to pass this project. I want you to focus on MVP for now. It's basically a Figma clone. It will have a single canvas with drag and drop simple objects, some level of authentication, and the ability to add multiple users and have concurrent users at the same time. Let's start by creating a product requirements document. The product requirements document should have a couple of sections that are included inside of it: the user stories that are associated with the different types of users that I have, the key features required for MVP, the tech stack that we're going to be using, and some of the things that are not included in MVP: things that I'm not going to be focusing on for this first portion of the project. Keep in mind that for now the core functionality we're focused on delivering for the MVP is the real-time collaboration feature. So ensure that we're Setting up the basic page for me to see the canvas and that we build out what's necessary for that feature before anything else. At the same time, I want you to include any sort of pitfalls or ideas that you have about the tech stack so that I can make a decision. And then I'm going to review this document, and then we can edit it together. Please review the .md file I attached deeply before starting to work on this And then think very hard about how to assist with this.

# Refine PRD w/ ai until satisfied

# Create Task list w/ ai
# model: claude 4.5 sonnet, same chat window
Take this PRD document that you've generated and generate for me a task list. This task list should be a checklist of all the tasks that need to be done, broken down by PRs in order of our building strategy in the CollabCanvas.md doc and implementation strategy in the PRD you just created. Ignore any reference to hours or time it should take to create everything. For the PR's: Every time a PR is completed, I'm going to be sending that up using Git to my GitHub repository and tracking the progression of this codebase. So in this task list, there should be high-level PR-related tasks, and then each of the subtasks for each of the PRs to be completed. Identify the file structure that is going to be associated with this project, and then let me know within each of the tasks what files I'm updating and what files I may be editing. 

# Refine Task list until satisfied

# Create mermaid diagram of connections in codebase
# model: claude 4.5 sonnet, same chat window
So now that we've done the task list and the PRD, use these artifacts as context to create a mermaid diagram. A mermaid diagram that describes the connections between my entire codebase, the client-server interactions, and any other technologies that I'm going to be using. Please make sure that the code you give me is for a mermaid file and I can easily just look at it in the artifact and use Excalidraw or something if I need to to visualize it easily. I don't need any text in here, just a mermaid diagram.

# Refine until satisfied 

# new chat for refining PRD, Task List, MMD

# model: claude 4.1 Opus
We're building the MBP app as described in the PDF that's attached called CollabCanvas. What I want you to do is to please review all of these documents deeply. There is the PDF with the Basic overall description and performance characteristics of the app in the PDF. But keep in mind that we are only focused on satisfying the conditions in the hard gate MVP requirements. So make sure you understand those well. Then make sure you deeply examine and understand the markdown files and the mermaid diagram. So first review the CollabCanvas MVP, prd.md, to understand the prd. Then review the task list to understand the task list for implementing that prd. And then please review the mermaid diagram to make sure that that conforms to everything that is included in the prd and task list. Then I want you to check all of these for any misalignments or any kind of issues that we might run into because of the plans or the technologies involved. Please ultra think about this and make sure that we catch any potential errors or gotchas or pitfalls during this planning phase before we move to development. Call out potential solutions to these errors, gotchas or pitfalls, and then we'll discuss them before updating the documents accordingly.