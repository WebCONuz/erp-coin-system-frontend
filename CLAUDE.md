# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

**Environment:** Create a `.env` file with:
```
VITE_API_URL=http://localhost:3001/api
```

## Architecture Overview

This is an ERP Coin System (gamification/incentive management) frontend for educational centers. Built with React 19 + TypeScript + Vite.

### Feature-based structure

Business logic lives under `src/features/<feature>/` with a consistent internal layout:

```
features/<feature>/
├── api/        # axios functions using the shared `request` instance
├── components/ # UI components scoped to this feature
├── constants/  # query keys and other constants
├── hooks/      # TanStack Query useQuery/useMutation wrappers
├── schema/     # Zod validation schemas (inferred types exported alongside)
└── types/      # TypeScript interfaces and DTOs
```

Features: `auth`, `controls`, `dashboard`, `groups`, `market`, `students`, `teachers`, `tenants`.

### Data flow

```
ENDPOINTS constant → api/* functions → hooks/* (useQuery/useMutation) → components
```

- All HTTP calls go through the `request` axios instance (`src/services/api/axios.ts`)
- `ENDPOINTS` constants live in `src/services/endpoints/api-endpoints.ts`
- Hooks invalidate related query keys on mutation success

**Query key pattern** (defined in each feature's `constants/`):
```typescript
export const groupKeys = {
  allGroups: (params?: Record<string, any>) => ["all-groups", params ?? {}],
  oneGroupById: (id: string) => ["one-group-by-id", id],
} as const;
```

**API response shape** for paginated lists:
```typescript
{ status: string; data: T[]; meta: { total, page, limit, totalPages } }
```

### Authentication

Cookie-based JWT with silent refresh. Key details:
- Access/refresh tokens are HTTP-only cookies — never accessed in JS
- `is_authenticated` in localStorage acts as a flag to decide whether to call `/auth/me`
- `active_tenant_id` in localStorage (`TENANT_KEY` constant) is sent as a `tenantId` query param on every request via the request interceptor
- On 401, the interceptor queues parallel requests, refreshes the token once, then replays them; calls `handleAutoLogout()` if refresh fails

**User auth hook:** `useAuth()` from `src/features/auth/hooks/useLogin.ts` — returns `user`, `isAuthenticated`, `login`, `logout`, loading states.

### Routing & Role protection

Routes are defined in `src/app/routes/routes.tsx`. All protected routes wrap with `ProtectedRoute`:

```tsx
<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CREATOR]} />
```

Role constants (`src/assets/constants/roles.constants.ts`): `admin`, `super_admin`, `creator`, `student`, `teacher`.

Three layout trees: `AuthLayout` (`/`), `AdminLayout` (`/admin`), `StudentLayout` (`/student`). All non-auth pages are code-split with `lazy()` + `withSuspense()`.

### Forms

Use React Hook Form + Zod + shadcn/ui Form components:

```typescript
const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

Schemas define the inferred type: `export type GroupFormValues = z.infer<typeof groupFormSchema>`.

### URL-driven filters

Filters use `useSearchParams` to persist state in the URL. The `useFilter` hook pattern (see `src/features/groups/hooks/useFilter.ts`) watches form values and writes them to search params. Components read from `searchParams.get("key")` and pass to query hooks.

Pagination state is managed by `usePagination` (`src/hooks/usePagination.ts`), which syncs page number from/to the `?page` query param.

### i18n

Three locales: `uz` (Uzbek Latin — default), `ru` (Russian), `uz_cr` (Uzbek Cyrillic). Translation files are in `src/assets/locales/`. Use `useTranslation()` hook or `t()` from i18next directly.

### Key utilities

- `src/lib/utils.ts` — `cn()` for merging Tailwind classes
- `src/ustils/format-date.ts` — `formatDate`, `formatDateTime`, `formatTime`, `formatDistance` (note: the folder is named `ustils`, not `utils`)
- `src/services/helpers/auth.helpers.ts` — `clearLocalStoragaData`, `handleAutoLogout`

### UI components

shadcn/ui components are in `src/components/ui/`. Shared cross-feature components (loaders, tables, titles, toaster) are in `src/components/shared/`. Complex reusable UI blocks (Navbar, Sidebar) are in `src/widgets/`.

Path alias `@/` maps to `src/`.
