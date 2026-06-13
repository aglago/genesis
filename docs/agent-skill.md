# Installing the Genesis Agent Skill

The Genesis skill teaches AI agents (Cursor, etc.) how to work with Genesis projects — CLI commands, module patterns, `genesis.config.ts`, and monorepo conventions.

## What's Included

```
.cursor/skills/genesis/
├── SKILL.md       # Main agent instructions
├── reference.md   # Module contract, manifest schema, APIs
└── examples.md    # Common agent task patterns
```

## Option 1 — Use in the Genesis monorepo (included)

The skill ships with this repository. Cursor discovers project skills at `.cursor/skills/` automatically when you open the Genesis repo.

No install step required.

## Option 2 — Add to your Genesis consumer project

Copy the skill into any project built with Genesis so agents understand your app's module setup:

```bash
# From your consumer app root (e.g. acme-saas/)
mkdir -p .cursor/skills
cp -r /path/to/genesis/.cursor/skills/genesis .cursor/skills/
```

Or symlink:

```bash
ln -s /path/to/genesis/.cursor/skills/genesis .cursor/skills/genesis
```

## Option 3 — Personal skill (all projects)

Install globally so the agent uses Genesis conventions in any workspace:

```bash
mkdir -p ~/.cursor/skills
cp -r /path/to/genesis/.cursor/skills/genesis ~/.cursor/skills/
```

On Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills"
Copy-Item -Recurse "C:\path\to\genesis\.cursor\skills\genesis" "$env:USERPROFILE\.cursor\skills\genesis"
```

## Option 4 — Publish with your team

Commit `.cursor/skills/genesis/` to your team's template repo or internal starter so every new project includes the skill.

## Verify It Works

1. Open a Genesis project in Cursor
2. Ask the agent: *"Create a SaaS app with Genesis"* or *"Add the notifications module"*
3. The agent should reference CLI commands, `genesis.config.ts`, and module docs — not invent a custom auth stack

You can also invoke explicitly: *"Use the genesis skill to add payments"*

## Updating the Skill

When Genesis modules or CLI change, copy the latest skill folder from the monorepo:

```bash
cp -r /path/to/genesis/.cursor/skills/genesis ~/.cursor/skills/genesis
```

## See Also

- [SKILL.md](../.cursor/skills/genesis/SKILL.md) — skill contents
- [docs/README.md](README.md) — user documentation
