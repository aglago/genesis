# Contributing to Genesis

Thank you for your interest in contributing to Genesis!

## Development Setup

1. Clone the repository
2. Run `npm install`
3. Run `npm run build` to build all packages
4. Run `npm run test` to verify tests pass

## Module Standards

Every `@genesis/*` module must include:

- README with install, config, env vars, and examples
- TypeScript types exported from `src/index.ts`
- Zod env validation
- `src/manifest.json` for CLI integration
- `src/scaffold/` directory with app-specific files
- Unit tests in `src/__tests__/`

## Pull Request Process

1. Create a feature branch from `main`
2. Make changes with tests
3. Ensure `npm run build && npm run test` passes
4. Submit a PR with a clear description

## Code Style

- TypeScript strict mode
- Prettier formatting (run `npm run format`)
- Match existing patterns in the module you're editing
