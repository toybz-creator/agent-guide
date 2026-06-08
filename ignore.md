

- AI to pull all of the docs of libs listed in package.json, everything, it should see how the existing libs have actually pulled all the APIs and API options and then save it in the docs folder.

 - Bring in all the notes from Notion

 - Bring in all notes from TickTick

 - Create system architecture specs for most features and bring it in
 - Bring in some of the rules from Cal.com

- Add options for strict level. If strict we enforce user to take all precaution, optimisation rules etc


 - Users are advised and must set KPI, for DB, API response time. Expected endpoint hit rate etc. Agent must ensure to architect and code to meet this KPI, including out of code suggestions for Sharding, Load balancing etc. All these can be done in the terraform doc. 


- 


- Add skills for : optimisation, security, deployment etc. All skills must ask questions first before dabbling into work

- Update, agent update command to: 'agent-guide update'
  Since all agent use command and skills would follow this pattern

- Update harness command should also run an npm update the harness libray too, so we have the up to date version of it


- Update Readme of the specif

- Write script to ensure all codebase are monotonous, e.g codemod to change all codebase from "" to '' etc. With appropriate linting/format rule docs etc
This ensures that we dont have git commits touching unnneeded files just because format rule changes


----

We need to create a skills feature into the app
This feature enables users to just send a skill keyword and then the agent will do all it can to perform what the skill specifies

You should write rules that informs the agent of this
Then we will have a skills.md file and skills folder in the harness folder
This folder contains all of the comprehensive steps needed for a skill operation to be successful

The skills.md contains a list of all the skills, their command, the file that contains the skill and a description of what they do

There will be some default baked in skills 

However, users and agent update command can bring in new skills that allows the system to be extensible and to grow

For each skill, it must be properly referenced in the skills.md and the file must be in the skills folder 

You should create this rule and commands in the system, Wiith strict manadation so the system knows when it needs to apply skills

All skill commands use the format below : 
"pag-{{skill-name}}
e.g "pag-review" , "pag-optimise" , "pag-guide" etc

You should then create these baked in skills:

* Review: It should reveiw a particluar section, feature, module of the project or project itself. It should state how its implemented, how it ties things together, its workflow, edge cases it caters for, edge cases it doesnt cater for, blind spots it neglects, things that might go wrong, things that are okay. Plus just free form comprehensive review of what is asked. 

* Optimise: It should optimise a particular feature or so to meet the required goal. It must ask the user the feature to be optimised,  what the optimisation goal is, e.g response time etc.Any other questions needed for optimisation tasks

* Guide: It should guide the user to understand the code base or the code base of a feature comprehensively and end to end. It should touch all aspects. It should be written in a way that is comprehensive to junior devs and non tech stake holders. 

* Discovery: It should go through the codebase and docs. and ensure it understands what the product is doing, where its going to and what it needs. then it should suggest upgrade, tools, softwares, libraries, github repos, better alternatives to existing depencies or implementations, competitors, industry standards, missing workflows etc. Aim is so irrespective of domain knowledge (E.g Junior dev, PM, Marketer, Senior dev,QA, Business analyst, DevOps, SRE etc). The user wil get about 50 recommendations, suggestions or so across different verticals.

* Compare: It should look at how other standard and high rated open source code similar to the product or feature has implemented their architecture, code, workflow etc and show the comparison. It should return a comparison between 5 different projects with insights

* shield: It should suggest ways on how to protect the system from intentional and non-intentional abuse, hacks, loop holes, leakages, internal and external misuse, etc acrooss all layers and supply chain

Before any of this tasks starts, agent should ask questions to get specific target, feature, module etc . Specific vertical like security, accuracy, availabilty, architecture, database optimisatio, etc).if the review and final response  should be written to a document. Response in documents should be richer with appropriate pointing to codebase, connections  and mermaid diagrams when appropriate



- Discover should also say feature that any dependies provide that we are not using

- Idea command


- Use tables and any other good UI UX that will make the docs comprehensive

- Architecture, runbook, deployment book, ci book, workflow book, dictionary (product/project terms and what it means) and other related docs must use mermaid diagram, tables and any other good UI UX that will make the docs comprehensive


- Workflow to manage local- non git files efficiently


- commit, push, pull, pr stage workflow to parse, format, lint, ensure that no rules are broken, checks workflow, check that operation is okay (wont cause even sligh havock), can manage conflicts well etc etc right from the agent interface


- integration  integration, skills, uninvoked suggestion  for  with github and co mcp and agent

- integration, skills, uninvoked suggestion  for live logs and metrics, bugs etc


- uninvoked project/product/system monitor. checks all envs, github, logs, etc etc every 30mins and if there is something of worth, sends a message to the team and a ready to go fix if needed

- Use y