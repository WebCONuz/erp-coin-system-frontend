# 🎓 ERP Coin System — Frontend

O'quv markazlari va maktablar uchun mo'ljallangan **Incentive Management (Geymifikatsiya va Rag'batlantirish) Tizimi**ning React/TypeScript asosidagi frontend qismi.

---

## 📌 Texnologiyalar

| Texnologiya               | Versiya | Maqsadi                                    |
| :------------------------ | :------ | :----------------------------------------- |
| **React**                 | 19      | UI kutubxonasi                             |
| **TypeScript**            | 6       | Type-safe dasturlash                       |
| **Vite**                  | 8       | Build tool va dev server                   |
| **Tailwind CSS**          | 4       | Utility-first styling                      |
| **shadcn/ui** + Radix UI  | latest  | UI komponentlar kutubxonasi                |
| **React Router**          | 7       | Client-side routing                        |
| **TanStack Query**        | 5       | Server state boshqaruvi (caching, refetch) |
| **TanStack Table**        | 8       | Jadvallar                                  |
| **Axios**                 | 1       | HTTP so'rovlar va interceptorlar           |
| **React Hook Form**       | 7       | Form boshqaruvi                            |
| **Zod**                   | 4       | Schema validatsiya                         |
| **i18next**               | 26      | Ko'p tillilik (uz, ru, uz_cr)              |
| **Recharts**              | 3       | Grafiklar va statistika                    |
| **dnd-kit**               | 6       | Drag & drop (dars jadvali rejalari)        |
| **date-fns**              | 4       | Sana bilan ishlash                         |
| **sonner**                | 2       | Toast xabarlari                            |

---

## ⚙️ Ishga Tushirish

### 1. Talablar

- Node.js `v20+`
- npm

### 2. O'rnatish

```bash
git clone <repository-url>
cd erp-coin-system-frontend
npm install
```

### 3. Environment o'zgaruvchilari

`.env` faylini yarating:

```env
VITE_API_URL=http://localhost:3031
```

> ⚠️ `VITE_API_URL` oxirida `/api` **bo'lmasligi kerak**. `ENDPOINTS` qiymatlari (`src/services/endpoints/api-endpoints.ts`) allaqachon `/api` prefiksi bilan yozilgan (masalan `/api/auth/login`), aks holda so'rovlar `/api/api/...` ga ketadi.

### 4. Skriptlar

```bash
npm run dev       # Dev server — http://localhost:5173
npm run build     # TypeScript tekshiruvi + production build
npm run preview   # Production buildni ko'rish
npm run lint      # ESLint
```

---

## 📁 Loyiha Strukturasi

```
src/
├── app/
│   ├── helpers/          # i18n sozlamalari
│   ├── layouts/          # AuthLayout, AdminLayout, TeacherLayout, StudentLayout
│   ├── providers/        # QueryClient, Theme, i18n provayderlari
│   └── routes/           # Routing konfiguratsiyasi va ProtectedRoute
│
├── assets/
│   ├── constants/        # ROLES, sana konstantalari
│   ├── icons/
│   ├── locales/          # uz, ru, uz_cr tarjima fayllari
│   └── models/
│
├── components/
│   ├── controls/         # Controlled form inputlari (ControlledInput, ControlledSelect va b.)
│   ├── shared/           # Umumiy komponentlar (loaders, table, title, charts, toaster)
│   └── ui/               # shadcn/ui komponentlari
│
├── features/             # Feature-based arxitektura (asosiy biznes logika)
│   ├── auth/             # Login, logout, /auth/me, useAuth()
│   ├── coin-rules/       # Coin berish/ayirish qoidalari (reasons)
│   ├── controls/         # Boshqaruv paneli header'i
│   ├── dashboard/        # Admin, teacher va student dashboardlari
│   ├── employees/        # Xodimlar (admin, teacher va b.)
│   ├── groups/           # Guruhlar: CRUD, studentlar, detail
│   ├── market/           # Do'kon (rewards, kategoriyalar, xaridlar)
│   ├── plans/            # Dars jadvali shablonlari (haftalik kanban)
│   ├── roles/            # Rollar — faqat o'qish (GET /roles)
│   ├── rooms/            # Xonalar
│   ├── sessions/         # Darslar (sessiyalar) va davomat
│   ├── student-profile/  # Student shaxsiy kabineti
│   ├── students/         # Studentlar CRUD, coin balans, bulk coin
│   ├── subjects/         # Fanlar
│   ├── teacher-profile/  # O'qituvchi shaxsiy kabineti
│   ├── teachers/         # O'qituvchilar CRUD
│   └── tenants/          # O'quv markazlari (Tenant) boshqaruvi
│
├── hooks/                # Global hooklar (usePagination)
├── lib/                  # cn() va boshqa utilitalar
├── pages/                # Route sahifalari (admin/, teacher/, student/ bo'yicha)
├── services/
│   ├── api/              # `request` axios instance (interceptorlar bilan)
│   ├── endpoints/        # ENDPOINTS konstantalari
│   └── helpers/          # handleAutoLogout, clearLocalStoragaData
├── types/                # Global TypeScript type'lar
├── ustils/               # formatDate, formatDateTime va b. (papka nomi `ustils`)
└── widgets/              # Navbar, Sidebar, BottomNav (admin/teacher/student)
```

Path alias: `@/` → `src/`.

---

## 🏗️ Feature-based Arxitektura

Har bir feature quyidagi tuzilmaga ega:

```
features/<feature-name>/
├── api/           # `request` orqali axios funksiyalari
├── components/    # Faqat shu feature uchun komponentlar
├── constants/     # Query keylar va boshqa konstantalar
├── hooks/         # useQuery / useMutation wrapperlari
├── schema/        # Zod sxemalari (inferred type'lar bilan)
└── types/         # TypeScript interfeyslari va DTO'lar
```

**Ma'lumot oqimi:**

```
ENDPOINTS → api/* → hooks/* (useQuery/useMutation) → components
```

Mutation muvaffaqiyatli bo'lganda tegishli query keylar invalidate qilinadi.

**Query Keys namunasi:**

```typescript
export const groupKeys = {
  allGroups: (params?: Record<string, any>) => ["all-groups", params ?? {}],
  oneGroupById: (id: string) => ["one-group-by-id", id],
} as const;
```

**Paginatsiyali ro'yxat javobi:**

```typescript
{ status: string; data: T[]; meta: { total, page, limit, totalPages } }
```

**Formalar:** React Hook Form + Zod + shadcn/ui `Form` komponentlari.

**Filtrlar:** `useSearchParams` orqali URL'da saqlanadi (`useFilter` hook namunasi — `src/features/groups/hooks/useFilter.ts`). Sahifa raqami `usePagination` orqali `?page` bilan sinxronlanadi.

---

## 🗺️ Routing Strukturasi

Barcha sahifalar (auth'dan tashqari) `lazy()` + `withSuspense()` orqali code-split qilingan.

```
/                             → /login ga redirect
/login                        → Kirish sahifasi
/register                     → Ro'yxatdan o'tish
/forgot-password              → Parolni tiklash

/admin                        → Admin panel (ADMIN | SUPER_ADMIN | CREATOR)
  /admin                      → Dashboard
  /admin/teachers[/:id]       → O'qituvchilar
  /admin/groups[/:id]         → Guruhlar
  /admin/students[/:id]       → Studentlar
  /admin/sessions[/:id]       → Darslar
  /admin/plans                → Dars jadvali rejalari
  /admin/subjects             → Fanlar
  /admin/market               → Do'kon
  /admin/tenants              → O'quv markazlari
  /admin/control              → Boshqaruv paneli (→ reasons)
    /admin/control/reasons    → Coin sabablari
    /admin/control/rooms      → Xonalar
    /admin/control/employees  → Xodimlar
    /admin/control/roles      → Rollar (faqat ko'rish)

/teacher                      → O'qituvchi kabineti (TEACHER)
  /teacher                    → Dashboard
  /teacher/groups[/:id]       → Guruhlarim
  /teacher/sessions[/:id]     → Darslarim
  /teacher/students[/:id]     → Studentlarim
  /teacher/coin-rules         → Coin qoidalari
  /teacher/profile            → Profil

/student                      → Student kabineti (STUDENT)
  /student                    → Dashboard
  /student/groups[/:id]       → Guruhlarim
  /student/market             → Do'kon
  /student/profile            → Profil

/403                          → Ruxsat yo'q
*                             → 404
```

**Route himoyasi:** `ProtectedRoute` foydalanuvchi rolini (`user.role.name`) `allowedRoles` bilan solishtiradi. Foydalanuvchi bo'lmasa — `/login`, roli mos kelmasa — `/403` ga yo'naltiriladi. Logindan keyin: `student` → `/student`, `teacher` → `/teacher`, qolganlar → `/admin`.

---

## 🔐 Autentifikatsiya

Tizim **cookie-based JWT** autentifikatsiyasidan foydalanadi:

- **Access / Refresh token** — HTTP-only cookie'larda, JS'dan o'qilmaydi
- `is_authenticated` — `localStorage`dagi flag, `/auth/me` chaqirish kerakligini bildiradi
- `active_tenant_id` (`TENANT_KEY`) — `super_admin`/`creator` tanlagan faol tenant
- `useAuth()` (`src/features/auth/hooks/useLogin.ts`) — `user`, `isAuthenticated`, `login`, `logout` va loading holatlari

---

## 👥 Rollar

Rollar **faqat backend tomonidan boshqariladi**. Frontend rollarni yarata, tahrirlay yoki o'chira olmaydi — faqat `GET /roles` orqali o'qiydi (user yaratish formalaridagi dropdown va "Rollar" sahifasi uchun).

Har bir tenantda **aynan 3 ta rol** bo'ladi, ular `POST /tenants` vaqtida avtomatik yaratiladi:

| `name`    | `displayName` | `level` | Sahifalar    |
| :-------- | :------------ | :------ | :----------- |
| `admin`   | Administrator | 60      | `/admin/*`   |
| `teacher` | O'qituvchi    | 40      | `/teacher/*` |
| `student` | O'quvchi      | 20      | `/student/*` |

Tizim rollari system tenantda yashaydi va tenant rollari ro'yxatida chiqmaydi:

| `name`        | `level` | Sahifalar                        |
| :------------ | :------ | :------------------------------- |
| `creator`     | 100     | `/admin/*` + tenantlar boshqaruvi |
| `super_admin` | 90      | `/admin/*` + tenantlar boshqaruvi |

**Qoidalar:**

- Mantiq uchun `role.name` ga (`ROLES` konstantasi — `src/assets/constants/roles.constants.ts`), UI uchun `role.displayName` ga tayaning.
- `roleId` ni hardcode qilmang — UUID'lar har bir tenantda har xil. Kerakli rolni `roles.find((r) => r.name === ROLES.STUDENT)?.id` kabi toping.
- `roleId` user yaratilayotgan tenantga tegishli bo'lishi shart, aks holda backend `400` qaytaradi. `useRoles()` shu sababli query keyga faol `tenantId` ni qo'shadi va rollarni sessiya davomida keshlaydi.

---

## 🌐 Axios Konfiguratsiyasi

`src/services/api/axios.ts` dagi `request` instance barcha HTTP so'rovlar uchun ishlatiladi.

```
Base URL    : VITE_API_URL || http://localhost:3031
Credentials : withCredentials: true (cookie-based auth)
Content-Type: application/json
```

### Request Interceptor

- `Accept-Language` header — `localStorage`dagi tildan (`i18nextLng`, default `uz`)
- `tenantId` query param — `localStorage[active_tenant_id]` dan

### Response Interceptor — Token Refresh

| Holat                                            | Natija                                                      |
| :----------------------------------------------- | :---------------------------------------------------------- |
| `401` xato kelganda                              | Token yangilanadi va so'rov qayta yuboriladi                |
| Token yangilanayotganda parallel so'rovlar kelsa | Queue'ga qo'shiladi, yangilangach hammasi qayta yuboriladi  |
| Token yangilash muvaffaqiyatsiz bo'lsa           | `handleAutoLogout()` chaqiriladi                            |
| `401`dan boshqa xatolar                          | `error.response` bilan reject qilinadi                      |

---

## 🌍 Ko'p tillilik (i18n)

Uchta til: `uz` (lotin — default), `ru`, `uz_cr` (kirill). Tarjimalar `src/assets/locales/<til>/translation.json` da. Komponentlarda `useTranslation()`, tashqarida `t()` (i18next) ishlatiladi.

---

## 🌙 Dark Mode va Responsive

Barcha komponentlar light/dark mode uchun moslashtirilgan (Tailwind `dark:` va shadcn/ui tokenlari). Teacher va Student kabinetlarida mobil qurilmalar uchun pastki navigatsiya (`BottomNav`) mavjud.

---

## 📚 Backend bilan Bog'liqlik

Frontend **ERP Coin System Backend** (NestJS + Prisma + PostgreSQL) bilan ishlaydi.

Backend haqida to'liq ma'lumot: [Backend README](../erp-coin-system-backend/README.md)

**Asosiy API guruhlari** (`src/services/endpoints/api-endpoints.ts`):

| Modul                 | Endpoint                                             |
| :-------------------- | :--------------------------------------------------- |
| Auth                  | `/api/auth/*`                                        |
| Tenants               | `/api/tenants`                                       |
| Roles (faqat `GET`)   | `/api/roles`                                         |
| Users / Staff         | `/api/users`, `/api/users/staff`                     |
| Teachers              | `/api/users/teachers`, `/api/teachers`               |
| Students              | `/api/students`                                      |
| Groups                | `/api/groups`                                        |
| Courses / Subjects    | `/api/courses`, `/api/subjects`                      |
| Rooms                 | `/api/rooms`                                         |
| Sessions              | `/api/sessions`                                      |
| Schedule              | `/api/schedule-templates`, `/api/schedule-exceptions` |
| Coin Rules            | `/api/coin-rules`                                    |
| Coin Transactions     | `/api/coin-transactions`                             |
| Rewards / Categories  | `/api/rewards`, `/api/reward-category`               |
| Purchases             | `/api/purchases`                                     |
| Messages              | `/api/messages`                                      |
| Dashboard             | `/api/dashboard`                                     |

---

## 📞 Kontakt

- **Yaratuvchi**: Muxammadi Toshtemirov
- **Telefon**: +998(94) 542-63-07
- **Email**: muxammadi0799@gmail.com
- **Telegram**: @Muxammadi_Dev
