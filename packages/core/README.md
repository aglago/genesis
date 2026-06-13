# @genesis/core

Core utilities for the Genesis ecosystem: config definition, module registry, dependency resolution, and env validation.

## Exports

- `defineGenesisConfig()` — Aggregate module configs
- `defineModule()` — Create a module config entry
- `ModuleRegistry` — Register and resolve module manifests
- `resolveModuleOrder()` — Topological sort by dependencies
- `validateEnvVars()` — Check required environment variables
