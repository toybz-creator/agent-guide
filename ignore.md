

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




Architecture, runbook, deployment book, ci book, workflow book, dictionary (product/project terms and what it means) and other related docs must use mermaid diagram, tables and any other good UI UX that will make the docs comprehensive



- Idea command


- Use tables and any other good UI UX that will make the docs comprehensive

- Architecture, runbook, deployment book, ci book, workflow book, dictionary (product/project terms and what it means) and other related docs must use mermaid diagram, tables and any other good UI UX that will make the docs comprehensive


- Workflow to manage local- non git files efficiently


- commit, push, pull, pr stage workflow to parse, format, lint, ensure that no rules are broken, checks workflow, check that operation is okay (wont cause even sligh havock), can manage conflicts well etc etc right from the agent interface


- integration  integration, skills, uninvoked suggestion  for  with github and co mcp and agent

- integration, skills, uninvoked suggestion  for live logs and metrics, bugs etc


- uninvoked project/product/system monitor. checks all envs, github, logs, etc etc every 30mins and if there is something of worth, sends a message to the team and a ready to go fix if needed

- Use y