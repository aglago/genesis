# Publishing Genesis

How to publish `@genesis/*` packages and what Git tags mean.

## Overview

Genesis ships as npm packages under the `@genesis` scope:

| Package | Description |
|---------|-------------|
| `@genesis/cli` | CLI (`genesis create`, `add`, …) |
| `@genesis/core` | Config and module registry |
| `@genesis/database` | MongoDB adapter |
| `@genesis/ui` | Shared UI components |
| `@genesis/auth`, `@genesis/branding`, … | Feature modules |

Packages publish to **GitHub Packages** (`https://npm.pkg.github.com`) when you push a version tag. The workflow is defined in [`.github/workflows/publish.yml`](../.github/workflows/publish.yml).

---

## Local development (before publishing)

While packages are unpublished, use **`--local`** to link the monorepo’s built packages into new projects:

```bash
# From the Genesis monorepo root
npm install
npm run build

node cli/dist/index.js create my-app --local -y -t informational-site
cd my-app
cp .env.example .env
npm install
npm run dev
```

`--local` writes `file:../packages/*` dependencies instead of `"*"`, so `npm install` resolves from disk — no registry required.

The `add` command auto-detects local mode if your project already uses `file:` links. Pass `--local` explicitly when adding to a fresh project:

```bash
genesis add auth --local
```

---

## What is a Git tag?

A **tag** is a named pointer to a specific commit — usually marking a release.

```
main:  A — B — C — D   ← latest code
              ↑
           tag v0.1.0   ← “this commit is release 0.1.0”
```

Tags are **immutable labels**. Unlike branch names (which move as you commit), `v0.1.0` always points at the same commit. That gives you:

- A reproducible snapshot for releases
- A trigger for CI (our publish workflow runs on `v*` tags)
- A version number consumers can pin: `@genesis/core@0.1.0`

**Tag vs commit:** A commit is a snapshot of files. A tag is a human-friendly name (`v0.1.0`) attached to one commit.

**Tag vs branch:** Branches move forward (`main` gets new commits). Tags stay fixed unless you delete and recreate them.

---

## Pre-publish checklist

Before tagging `v0.1.0`:

1. **Push the repo to GitHub** and note `OWNER/REPO` (e.g. `acme/genesis`).
2. **Build and test locally:**
   ```bash
   npm ci
   npm run build
   npm run test
   ```
3. **Ensure package versions match the tag** — all `@genesis/*` packages should be `0.1.0` in their `package.json` files (they are today).
4. **Add `repository` to packages** (recommended for GitHub Packages):
   ```json
   "repository": {
     "type": "git",
     "url": "git+https://github.com/OWNER/REPO.git"
   }
   ```
5. **Confirm GitHub Actions** is enabled for the repo (Settings → Actions).

---

## How to tag and publish v0.1.0

Run these from your machine, in the Genesis repo:

### 1. Commit everything you want in the release

```bash
git status
git add .
git commit -m "Prepare v0.1.0 release"
```

### 2. Create an annotated tag

**Annotated tags** (recommended) store a message and author; lightweight tags are just a name.

```bash
git tag -a v0.1.0 -m "Genesis v0.1.0 — initial public release"
```

Verify:

```bash
git tag -l
git show v0.1.0
```

### 3. Push the commit and the tag

Tags are **not** pushed with a normal `git push`. Push the tag explicitly:

```bash
git push origin main
git push origin v0.1.0
```

Or push all tags:

```bash
git push origin --tags
```

### 4. Watch CI publish

Open **Actions → Publish** on GitHub. On success, packages appear under **Packages** in the repo (or org).

The workflow:

1. Checks out the tagged commit
2. Runs `npm ci` and `npm run build`
3. Runs `npm publish --workspaces --if-present` to GitHub Packages

---

## Installing published packages

Consumers need a `.npmrc` that points `@genesis` at GitHub Packages and authenticates.

Copy [`.npmrc.example`](../.npmrc.example) into your project (or home directory):

```ini
@genesis:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Create a [GitHub personal access token](https://github.com/settings/tokens) with `read:packages` scope, then:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxx
npx @genesis/cli create my-app
cd my-app
npm install
```

Or use `npm login` against GitHub Packages:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@genesis
```

---

## Releasing v0.1.1, v0.2.0, etc.

1. Bump `"version"` in each changed package’s `package.json` (keep versions in sync for now).
2. Commit: `chore: release v0.1.1`
3. Tag: `git tag -a v0.1.1 -m "Genesis v0.1.1"`
4. Push: `git push origin main && git push origin v0.1.1`

Follow [semver](https://semver.org/):

- **Patch** (`0.1.0` → `0.1.1`) — bug fixes
- **Minor** (`0.1.0` → `0.2.0`) — new features, backward compatible
- **Major** (`0.1.0` → `1.0.0`) — breaking changes

---

## Troubleshooting publish

| Issue | Fix |
|-------|-----|
| Workflow didn’t run | Tag must match `v*` (e.g. `v0.1.0`, not `0.1.0`) |
| `403` on publish | Check `packages: write` permission in workflow; repo must have Packages enabled |
| Package already exists | Bump version — you can’t republish the same version |
| `404` on install | Add `.npmrc`; token needs `read:packages`; scope must be `@genesis` |

See also [Troubleshooting — packages not found](troubleshooting.md#genesis-packages-not-found-after-create).

---

## See also

- [Quickstart — Option A (local dev)](quickstart.md#option-a--from-the-genesis-monorepo-development)
- [Quickstart — Option B (published CLI)](quickstart.md#option-b--published-cli)
- [CLI Reference](cli.md)
