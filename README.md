# 🎓 ERP Coin System — Frontend

O'quv markazlari va maktablar uchun mo'ljallangan **Incentive Management (Geymifikatsiya va Rag'batlantirish) Tizimi**ning React/TypeScript asosidagi frontend qismi.

---

## 📌 Texnologiyalar

| Texnologiya         | Versiya | Maqsadi                                    |
| :------------------ | :------ | :----------------------------------------- |
| **React**           | 18+     | UI kutubxonasi                             |
| **TypeScript**      | 5+      | Type-safe dasturlash                       |
| **Vite**            | 5+      | Build tool va dev server                   |
| **Tailwind CSS**    | 3+      | Utility-first styling                      |
| **shadcn/ui**       | latest  | UI komponentlar kutubxonasi                |
| **React Router v6** | 6+      | Client-side routing                        |
| **TanStack Query**  | 5+      | Server state boshqaruvi (caching, refetch) |
| **Axios**           | 1+      | HTTP so'rovlar va interceptorlar           |
| **React Hook Form** | 7+      | Form boshqaruvi                            |
| **Zod**             | 3+      | Schema validatsiya                         |
| **Zustand**         | 4+      | Client-side global state                   |

---

## 📁 Loyiha Strukturasi

```
src/
├── app/
│   ├── helpers/          # Global yordamchi funksiyalar (handleAutoLogout va b.)
│   ├── layouts/          # Sahifa layoutlari
│   │   ├── AuthLayout    # Login/Register uchun layout
│   │   ├── AdminLayout   # Admin panel layouti
│   │   └── StudentLayout # Student kabineti layouti
│   ├── providers/        # React context provayderlar (QueryClient, Theme va b.)
│   ├── routes/           # Routing konfiguratsiyasi va ProtectedRoute
│   └── store/            # Zustand global store
│
├── assets/
│   └── constants/        # ROLES, API endpoints va boshqa konstantalar
│
├── components/
│   └── shared/           # Qayta ishlatiladigan umumiy komponentlar
│       └── loaders/      # PageLoader, Skeleton va b.
│
├── features/             # Feature-based arxitektura (asosiy biznes logika)
│   ├── auth/             # Login, Register, JWT token boshqaruvi
│   ├── controls/         # Tizim boshqaruvi (rooms, roles, employees va b.)
│   ├── dashboard/        # Admin va Student dashboard
│   ├── groups/           # Guruhlar: CRUD, studentlar, detail
│   │   ├── api/          # groups.api.ts — barcha HTTP so'rovlar
│   │   ├── components/   # GroupCard, GroupFormModal, StudentTable va b.
│   │   ├── constants/    # queryKeys.ts
│   │   ├── hooks/        # useGroup, useCreateGroup, useAddStudent va b.
│   │   ├── pages/        # GroupsPage, GroupDetailPage
│   │   ├── schemas/      # group.schema.ts (Zod)
│   │   └── types/        # TypeScript interfeyslari
│   ├── market/           # Do'kon (rewards store)
│   ├── students/         # Studentlar CRUD va boshqaruvi
│   ├── teachers/         # O'qituvchilar CRUD
│   └── tenants/          # O'quv markazlari (Tenant) boshqaruvi
│
├── hooks/                # Global custom hooklar
├── lib/                  # Utility funksiyalar (cn, formatters va b.)
├── pages/                # Route sahifalari (feature page'larni import qiladi)
│   ├── auth/
│   ├── control/
│   ├── dashboard/
│   ├── errors/
│   ├── groups/
│   ├── market/
│   ├── students/
│   ├── teachers/
│   └── tenants/
├── services/             # Axios instance va API sozlamalari
│   ├── api/              # request instance (interceptorlar bilan)
│   ├── endpoints/        # API endpoint konstantalari
│   └── helpers/          # handleAutoLogout va b.
├── types/                # Global TypeScript type'lar
├── ustils/               # Qo'shimcha yordamchi funksiyalar
└── widgets/              # Murakkab qayta ishlatiladigan UI bloklari
```

---

## 🗺️ Routing Strukturasi

Ilova uch asosiy yo'nalishga bo'lingan:

```
/                          → /login ga redirect
/login                     → Kirish sahifasi
/register                  → Ro'yxatdan o'tish
/forgot-password           → Parolni tiklash

/admin                     → Admin panel (ADMIN | SUPER_ADMIN | CREATOR)
  /admin                   → Dashboard
  /admin/teachers          → O'qituvchilar ro'yxati
  /admin/groups            → Guruhlar ro'yxati
  /admin/groups/:id        → Guruh detali (studentlar, edit)
  /admin/students          → Studentlar ro'yxati
  /admin/market            → Do'kon
  /admin/tenants           → O'quv markazlari
  /admin/control           → Boshqaruv paneli
    /admin/control         → Fanlar (subjects)
    /admin/control/rooms   → Xonalar
    /admin/control/employees  → Xodimlar
    /admin/control/plans      → Rejalar
    /admin/control/reasons    → Sabablar
    /admin/control/send-message → Xabar yuborish
    /admin/control/roles      → Rollar boshqaruvi

/student                   → Student kabineti (STUDENT)
  /student                 → Dashboard
  /student/groups          → Mening guruhlarim
  /student/market          → Do'kon

*                          → 404 sahifasi
```

**Route himoyasi:** Har bir yo'nalish `ProtectedRoute` orqali o'tadi — foydalanuvchining roli tekshiriladi, ruxsat bo'lmasa login sahifasiga yo'naltiriladi.

---

## 🌐 Axios Konfiguratsiyasi

`src/services/api/index.ts` faylida sozlangan `request` instance barcha HTTP so'rovlar uchun ishlatiladi.

### Asosiy sozlamalar

```
Base URL    : VITE_API_URL || http://localhost:3001/api
Credentials : withCredentials: true (cookie-based auth)
Content-Type: application/json
```

### Request Interceptor

Har bir so'rovga quyidagilar avtomatik qo'shiladi:

- `Accept-Language` header — `localStorage`dagi tildan olinadi (default: `uz`)
- `tenantId` query param — `localStorage`dagi tenant ma'lumotidan olinadi

### Response Interceptor — Token Refresh Logikasi

| Holat                                            | Natija                                                      |
| :----------------------------------------------- | :---------------------------------------------------------- |
| `401` xato kelganda                              | Access token yangilanadi va so'rov qayta yuboriladi         |
| Token yangilanayotganda parallel so'rovlar kelsa | Queue'ga qo'shiladi, token kelgach hammasi qayta yuboriladi |
| Token yangilash ham muvaffaqiyatsiz bo'lsa       | `handleAutoLogout()` chaqiriladi, foydalanuvchi chiqariladi |
| `401`dan boshqa xatolar                          | `error.response` bilan reject qilinadi                      |

---

## 🏗️ Feature-based Arxitektura

Har bir feature quyidagi tuzilmaga ega:

```
features/<feature-name>/
├── api/           # Barcha axios HTTP so'rovlari
├── components/    # Faqat shu feature uchun komponentlar
├── constants/     # queryKeys va boshqa konstantalar
├── hooks/         # useQuery va useMutation hooklari
├── pages/         # Sahifa komponentlari
├── schemas/       # Zod validatsiya sxemalari
└── types/         # TypeScript interfeyslari va type'lar
```

**Query Keys namunasi:**

```typescript
export const groupKeys = {
  allGroups: (params?: Record<string, any>) => ["all-groups", params ?? {}],
  oneGroupById: (id: string) => ["one-group-by-id", id],
  allStudents: () => ["all-students"],
} as const;
```

---

## ⚙️ Ishga Tushirish

### 1. Talablar

- Node.js `v18+`
- npm yoki yarn

### 2. O'rnatish

```bash
git clone <repository-url>
cd erp-coin-system-frontend
npm install
```

### 3. Environment o'zgaruvchilari

`.env` faylini yarating:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Development serverini ishga tushirish

```bash
npm run dev
```

Ilova `http://localhost:5173` da ishga tushadi.

### 5. Production build

```bash
npm run build
npm run preview
```

---

## 🔐 Autentifikatsiya

Tizim **cookie-based JWT** autentifikatsiyasidan foydalanadi:

- **Access Token** — qisqa muddatli, HTTP-only cookie
- **Refresh Token** — uzun muddatli, HTTP-only cookie
- Token muddati tugasa, Axios interceptor avtomatik yangilaydi
- `is_authenticated` — `localStorage`da saqlanadi (bool flag)

**Rollar:**

| Rol          | Konstantasi         | Sahifalar               |
| :----------- | :------------------ | :---------------------- |
| Creator      | `ROLES.CREATOR`     | `/admin/*`              |
| Super Admin  | `ROLES.SUPER_ADMIN` | `/admin/*`              |
| Tenant Admin | `ROLES.ADMIN`       | `/admin/*`              |
| Teacher      | `ROLES.TEACHER`     | `/admin/*` (cheklangan) |
| Student      | `ROLES.STUDENT`     | `/student/*`            |

---

## 🌙 Dark Mode

Barcha komponentlar light va dark mode uchun moslashtirilgan. Tailwind `dark:` prefiksi va shadcn/ui token sistemi ishlatilgan.

---

## 📚 Backend bilan Bog'liqlik

Frontend **ERP Coin System Backend** (NestJS + Prisma + PostgreSQL) bilan ishlaydi.

Backend haqida to'liq ma'lumot: [Backend README](../erp-coin-system-backend/README.md)

**Asosiy API guruhlari:**

| Modul            | Endpoint                   |
| :--------------- | :------------------------- |
| Auth             | `/api/auth/*`              |
| Users / Students | `/api/users/*`             |
| Groups           | `/api/groups/*`            |
| Courses          | `/api/courses/*`           |
| Sessions         | `/api/sessions/*`          |
| Coin Rules       | `/api/coin-rules/*`        |
| Transactions     | `/api/coin-transactions/*` |
| Rewards          | `/api/rewards/*`           |
| Purchases        | `/api/purchases/*`         |
| Tenants          | `/api/tenants/*`           |

---

## 📞 Kontakt

- **Yaratuvchi**: Muxammadi Toshtemirov
- **Telefon**: +998(94) 542-63-07
- **Email**: muxammadi0799@gmail.com
- **Telegram**: @Muxammadi_Dev
