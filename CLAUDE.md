# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Human-facing docs live in `README.md`; this file keeps what's needed to work on the code correctly.

## Commands

```bash
npm run dev        # Dev server (http://localhost:5173)
npm run build      # tsc -b + vite build — use this to verify changes (no test suite)
npm run lint       # ESLint (has pre-existing `no-explicit-any` errors in query-key files)
```

`.env`: `VITE_API_URL=http://localhost:3031` — must NOT end in `/api`; `ENDPOINTS` (`src/services/endpoints/api-endpoints.ts`) already include the `/api` prefix.

## Stack

React 19, TypeScript, Vite 8, Tailwind 4, shadcn/ui (Radix), React Router 7, TanStack Query 5 + Table 8, Axios, React Hook Form + Zod 4, i18next, Recharts, dnd-kit. Zustand is installed but unused (`src/app/store` is a stub).

## Architecture

Feature-based: `src/features/<feature>/{api,components,constants,hooks,schema,types}`. Pages in `src/pages/<area>/{admin,teacher,student}` import from features. Path alias `@/` → `src/`.

Data flow: `ENDPOINTS` → `api/*` (shared `request` axios instance, `src/services/api/axios.ts`) → `hooks/*` (useQuery/useMutation, invalidate related keys on success) → components.

- Query keys live in each feature's `constants/` as `xKeys = { allX: (params?) => ["all-x", params ?? {}], ... } as const`.
- Paginated responses: `{ status, data: T[], meta: { total, page, limit, totalPages } }`.
- Forms: `useForm({ resolver: zodResolver(schema) })`; schemas often are factories taking `t` for i18n messages; export `type XFormValues = z.infer<...>`.
- Filters live in URL search params (`useFilter` pattern, e.g. `src/features/groups/hooks/useFilter.ts`); pagination via `usePagination` (`src/hooks/usePagination.ts`, syncs `?page`).
- Shared UI: `src/components/ui` (shadcn), `src/components/shared` (loaders, table, title, charts), `src/components/controls` (ControlledInput/Select), `src/widgets` (navbars, sidebars, bottom navs).
- Utilities: `cn()` in `src/lib/utils.ts`; date helpers in `src/ustils/` (folder is misspelled `ustils` — keep it).

## Auth & tenants

- Cookie JWT (HTTP-only, never touched in JS). `is_authenticated` in localStorage gates the `/auth/me` query. `useAuth()` is in `src/features/auth/hooks/useLogin.ts`.
- Axios interceptor adds `Accept-Language` and `tenantId` (from `localStorage[TENANT_KEY]` = `active_tenant_id`) to every request; on 401 it queues requests, refreshes once, replays, or calls `handleAutoLogout()`.
- `super_admin`/`creator` switch tenants via `AdminNavbar` (writes `TENANT_KEY` + `?tenantId=`, then `invalidateQueries()`). Admins are bound to `user.tenantId`. See `useCurrentTenant`.

## Roles (backend-managed — important)

- Roles are **read-only** on the frontend: only `GET /api/roles`. Role CRUD endpoints were removed from the backend; do not reintroduce create/edit/delete UI.
- Each tenant has exactly `admin` (60), `teacher` (40), `student` (20), auto-created by `POST /tenants`. System roles `creator` (100) and `super_admin` (90) live in the system tenant.
- Logic checks use `role.name` against `ROLES` (`src/assets/constants/roles.constants.ts`); UI shows `role.displayName`. Never hardcode role names as string literals or `roleId` UUIDs.
- `roleId` sent to `POST/PATCH /users` must belong to the same tenant (else 400). Get it via `useRoles()` + `roles.find(r => r.name === ROLES.X)?.id`; `useRoles` keys by active tenantId and caches with `staleTime: Infinity`.
- Access checks are role-name based and duplicated across widgets/pages (`user?.role?.name === ROLES.SUPER_ADMIN || ... CREATOR`); grep for `ROLES.` when changing permissions.

## Routing

`src/app/routes/routes.tsx`. Layout trees: `AuthLayout` (`/`), `AdminLayout` (`/admin`, roles admin/super_admin/creator), `TeacherLayout` (`/teacher`), `StudentLayout` (`/student`). Each wrapped in `ProtectedRoute allowedRoles={[...]}` (no user → `/login`, wrong role → `/403`). Pages are `lazy()` + `withSuspense()`. Post-login redirect is in `useAuth`'s login mutation.

## i18n

Locales `uz` (default), `ru`, `uz_cr` in `src/assets/locales/<lang>/translation.json`. When adding or removing keys, update all three files.

## UI conventions

- Mobile-first responsive; Teacher/Student layouts have bottom navs. Watch for flex children missing `min-w-0` causing horizontal overflow.
- Support dark mode (`dark:` variants) in every new component.
