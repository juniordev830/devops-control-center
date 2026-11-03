# Codex handoff — DevOps Control Center

## Mission
Continue the authorized DevOps portfolio work on **this repository only**. Target branch: `feature/cloud-devops-lab-rebuild`. Keep PR #3 in draft. Never push to or merge into `main`.

## Current implementation
- Node.js demo service and Docker Compose lab, health endpoint, container hardening and resource limits.
- CI validates tests, Compose, three local environment profiles, staging smoke tests, health contract, and Docker runtime limits.
- Recruiter-first README with CI badge, architecture diagram and links.

## Ordered backlog
1. Finish environment isolation validation: distinct Compose project names/ports, cleanup and smoke tests. Document what is simulated versus actually deployed.
2. CI/CD: implement an explicit manually triggered **production simulation** workflow with GitHub Environment protection where configured. Do not claim approval is enforced unless repository environment protection rules are verified; no real deployments.
3. Build a clean, accessible infrastructure dashboard using **real local demonstration data or clearly labeled fixtures**. Show service health, environment profiles, resource limits, CI evidence. Add screenshot(s) to repository documentation where feasible; never invent live cloud telemetry.
4. Add Terraform infrastructure-as-code examples with `terraform fmt` and `terraform validate` checks where tools are available. Avoid resources that provision cloud infrastructure by default.

## Quality and security gates
- Run and inspect tests after each meaningful change. Fix regressions before proceeding.
- Make small, descriptive commits and keep PR #3 in draft for review.
- No secrets, paid infrastructure, production releases, external access changes, or destructive operations.
- Update README to prioritize a recruiter who will **view and evaluate**, not run the app: screenshots, architecture, implemented skills, links to evidence, honest project status.
- Never misrepresent simulated deployment as live cloud production.

## Final report
Provide commits, changed files, CI links and results, completed vs pending items, screenshots or previews where available, and risks. If the requested time window expires, stop cleanly and summarize work done; do not claim background execution without a running Codex task.
