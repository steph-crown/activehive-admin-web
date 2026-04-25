---
description: Create a new component — specify type (ui|feature|molecule) and name
allowed-tools: Read, Edit, Write, Bash
---

Create a new component for **$ARGUMENTS**.

Argument format: `[type] ComponentName [feature?]`
- type: `ui` | `feature` | `molecule`
- feature: required when type is `feature` — the feature folder name (e.g. `gyms`)

Examples:
- `ui Badge` → `src/components/ui/badge.tsx`
- `molecule SearchBar` → `src/components/molecules/search-bar.tsx`
- `feature ConfirmDeleteDialog gyms` → `src/features/gyms/components/confirm-delete-dialog.tsx`

**UI component** (`src/components/ui/`):
- Named export only
- Use CVA for variants if the component has visual states
- Extend the relevant HTML element's props via `React.ComponentProps<"element">`
- Use `cn()` for class merging
- Follow the button.tsx or input.tsx pattern in this repo

**Molecule component** (`src/components/molecules/`):
- Named export only
- Composed from ui/ primitives
- Receives all data via props (no data fetching)

**Feature component** (`src/features/[feature]/components/`):
- Named export only
- File name: kebab-case matching the component name
- May use query hooks if it's a page or section component
- Dialogs: accept `open: boolean` + `onOpenChange: (open: boolean) => void` props

After creating, read the file back and verify it compiles (no obvious TypeScript issues).
