# BB-Coin — UI re-dizayn rejasi

> Holat: taklif. Kod hali o'zgartirilmagan.
> Asos: kod tahlili (`src/`) + admin rolidagi 14 ta screenshot (2026-11-23).

---

## 0. Boshlashdan oldin javob kerak bo'lgan savollar

Quyidagi savollarga javob reja tafsilotlarini o'zgartiradi. Javob bo'lmaguncha men tavsiya etilgan variantni (qavs ichida) asos qilib oldim.

1. **Qamrov.** Re-dizayn faqat admin panelgami yoki teacher/student panellar ham kiradimi?
   Student va teacher panellar allaqachon alohida "bog'" palitrasiga (`forest`, `paper`, `gold`) o'tkazilgan, admin esa eski binafsha uslubda qolgan. *(Tavsiya: uchala rol bitta dizayn tizimiga — rollar orasida faqat zichlik va urg'u farq qiladi.)*
2. **Brend nomi.** Logotipda "BB-Coin", dashboardda "EduCoin platformasiga xush kelibsiz", guruh sahifasida "BB-coin balansi". Qaysi biri rasmiy? *(Tavsiya: BB-Coin.)*
3. **Binafsha rang.** Binafsha brend rangi sifatida saqlanishi shartmi (masalan, mijozlarga shu rangda taqdim qilingan)? Ikkala variant ham binafshadan voz kechadi; shart bo'lsa, B variantni binafsha-siyoh tomonga moslab beraman.
4. **Logotip.** `public/logo.png` (sariq tanga) o'zgaradimi yoki saqlanadimi? *(Tavsiya: saqlanadi, faqat rang tokenlariga moslanadi.)*
5. **Admin mobil.** Adminlar telefondan qanchalik foydalanadi? Hozir admin panel mobilda umuman ishlamaydi (pastda batafsil). *(Tavsiya: to'liq mobil qo'llab-quvvatlash, lekin jadval sahifalari uchun "karta ko'rinish" bilan.)*

---

## 1. Loyiha tahlili

### 1.1 Texnologiyalar

| Qatlam | Nima ishlatilgan | Izoh |
|---|---|---|
| Framework | React 19 + TypeScript, Vite 8 | SPA, `lazy()` + `withSuspense()` |
| Routing | React Router 7 | `AdminLayout` / `TeacherLayout` / `StudentLayout`, `ProtectedRoute` |
| UI kutubxona | shadcn/ui (Radix asosida) | `src/components/ui` — 21 ta primitiv |
| CSS | Tailwind 4 (`@theme`), `tw-animate-css` | Tokenlar `src/index.css` da |
| Ma'lumot | TanStack Query 5, Axios | Har feature'da `api → hooks → components` |
| Jadval | TanStack Table 8 | `components/shared/table` |
| Grafik | Recharts 3 | `components/shared/charts` |
| Forma | React Hook Form + Zod 4 | |
| DnD | dnd-kit | Haftalik shablon (kanban) |
| i18n | i18next | `uz` (default), `ru`, `uz_cr` (kirill) |
| Tema | `next-themes` | `.dark` klassi |
| Shriftlar | Geist (admin), Fredoka + Plus Jakarta Sans (student/teacher) | `@fontsource-variable` |

### 1.2 Papka tuzilmasi

```
src/
  app/          layouts, providers (theme, query, i18n), routes
  components/
    ui/         shadcn primitivlari (button, card, badge, table, tabs, dialog ...)
    shared/     loaderlar, jadval, grafiklar, ConfirmModal, BackListButton, ProductCard
    controls/   ControlledInput / ControlledSelect
  features/     22 ta modul: dashboard, groups, students, teachers, sessions,
                plans, market, purchases, tenants, coin-rules, audit-logs ...
                har biri: api / components / constants / hooks / schema / types
  pages/        <soha>/{admin,teacher,student}/*.tsx — 45 ta sahifa
  widgets/      AdminSidebar/Navbar, Teacher*/Student* sidebar, navbar, bottom-nav
  ustils/       sana va username yordamchilari
```

282 ta `.tsx` fayl.

### 1.3 Hozirgi uslub tizimining holati (eng muhim topilma)

Dizayn tizimi **ikkiga bo'lingan va tokenlar ishlatilmaydi**:

- `:root` va `.dark` dagi shadcn tokenlari standart kulrang (`oklch(0.205 0 0)` va h.k.) holida qolgan — loyihaga moslanmagan.
- Shu bilan birga `@theme` da `--color-primary: #7f56d8` alohida yozilgan, komponentlar esa uni ham ishlatmay, to'g'ridan-to'g'ri `purple-500/600/700` yozadi: **198 marta, ~45 faylda**.
- Komponentlarda **30 ta hardcode hex** rang bor.
- Student/teacher uchun ikkinchi palitra (`forest`, `paper`, `gold`, `bloom`, `ink`) qo'shilgan, lekin u faqat o'sha layoutlarda ishlaydi.
- `button.tsx` default varianti: `from-forest to-forest sm:from-purple-500 sm:to-purple-700` — ya'ni **admin tugmalari mobilda yashil, desktopda binafsha** bo'ladi. Bu ikki palitrani bitta komponentga yopishtirish natijasi.
- Admin `<main>` dark rejimda `dark:bg-black` (sof qora), kartalar esa `--card` — tokenlar bir-biriga mos emas.
- `Fredoka` kirill harflarini qo'llab-quvvatlamaydi (faqat lotin/ibroniy) — `uz_cr` va `ru` tillarida student sarlavhalari zaxira shriftga tushadi. (Tekshirib tasdiqlash kerak.)

Xulosa: re-dizaynning birinchi qadami — sahifalarni emas, **tokenlarni** tuzatish. Shunda 198 ta `purple-*` bitta joydan boshqariladi.

---

## 2. API va sahifalardagi ma'lumotlar

Barcha so'rovlar `ENDPOINTS` (`/api/...`) orqali, paginatsiyali javoblar `{ status, data: T[], meta: { total, page, limit, totalPages } }` ko'rinishida. Quyida har sahifada aslida qaysi ma'lumot borligi — dizayn shu ma'lumotga qarab quriladi, bezakka emas.

| Sahifa | Endpoint | Asosiy maydonlar | Dizayn uchun ma'nosi |
|---|---|---|---|
| **Asosiy (dashboard)** | `GET /dashboard/admin` | `stats` (groups, students, teachers, subjects, rewards), `coinEconomy` (totalInCirculation, earnedThisMonth, deductedThisMonth, weeklyTrend[]), `needsAttention` (pendingPurchases, approvedPurchases, pendingAttendanceSessions), `todaySessionsCount`, `recentActivity[]`, `leaderboard[]` | Eng muhimi — `needsAttention` (bajariladigan ishlar). 5 ta `stats` soni — ikkinchi darajali. `recentActivity` hozir ekranda ko'rinmaydi (pastga tushib ketgan). |
| **Guruhlar** | `GET /courses`, `GET /groups` | `GroupItem`: name, maxStudents, isActive, course.title, teacher.fullName, `_count.students`, createdAt | Kartada to'lganlik (`_count.students / maxStudents`) va o'qituvchi asosiy; `createdAt` ikkinchi darajali. |
| **Guruh tafsiloti** | `GET /groups/:id`, `/groups/:id/stats`, `/groups/:id/students` | avgBalanceTrend[], weeklyActivityTrend[], o'quvchilar ro'yxati (balance, phone, joinedAt) | Jadval — asosiy ish maydoni; statistika yordamchi. |
| **Talabalar** | `GET /students` | `StudentDetail`: fullName, username, phone, email, avatarUrl, parentPhone, isActive, wallet.balance, createdAt | `email` ko'pincha `null` — alohida ustun shart emas. |
| **Talaba profili** | `GET /students/:id`, `/coin-transactions/history` | guruhlar, tranzaksiyalar (direction, sourceType, amount, note, teacher, rule), xaridlar, davomat | Tanga balansi va tarix — profilning yuragi. |
| **O'qituvchilar** | `GET /users/teachers`, `/users/teachers/:id` | fullName, phone, email, guruhlari, holati | Ko'p o'qituvchida guruh yo'q — bo'sh katak o'rniga "guruh biriktirilmagan" holati kerak. |
| **Dars jadvali** | `GET /schedule-templates`, `/schedule-templates/calendar`, `POST .../generate-sessions` | kun, vaqt, fan, o'qituvchi, xona | Kanban (hafta) va oylik kalendar — zich ma'lumot, rang **fan** bo'yicha bo'lishi kerak. |
| **Sessiyalar** | `GET /sessions`, `/sessions/types` | `SessionItem`: sessionDate, start/endTime, sessionType, evaluationMode, isChecked, isLocked, topic, group, room, teacher, subject | `isChecked=false` va o'tgan sana — ogohlantirish holati. |
| **Sessiya tafsiloti** | `GET /sessions/:id/roster`, `PUT .../attendance`, `.../results`, `.../lock` | o'quvchi, holat (keldi/kechikdi/sababli/sababsiz), uy vazifasi | O'qituvchining kundalik asosiy ishi — eng qulay bo'lishi shart. |
| **Sovg'alar** | `GET /reward-category`, `GET /rewards` | title, description, coinPrice, stock (-1 = cheksiz), reservedCount, rewardType, imageUrl | Narx (tanga) va qoldiq. |
| **Buyurtmalar** | `GET /purchases`, `PATCH /purchases/:id/status` | status (pending/approved/delivered/cancelled), coinSpent, reward, student, kim tasdiqladi/topshirdi | Holat bo'yicha ish oqimi: yangi → tasdiqlangan → topshirilgan. |
| **O'quv markazlar** | `GET /tenants`, `PATCH /tenants/:id/toggle-active` | name, turi (maktab/o'quv markaz), o'quvchilar va guruhlar soni | Faqat super_admin/creator. |

---

## 3. Hozirgi dizayndagi kamchiliklar (screenshotlar bo'yicha)

### 3.1 Rang

- **Binafsha hamma narsaga ishlatilgan**: faol menyu, barcha tugmalar, tablar, badge, balans raqami, avatarlar. Natijada hech narsa ajralib turmaydi — "Tanga berish", "Student qo'shish" va "Excel'dan qo'shish" bir xil og'irlikda.
- **Tanga uchun yagona rang/ikonka yo'q**: dashboard va guruhda zanjirga o'xshash to'q sariq ikonka, sovg'alarda "E" harfli doira, logotipda sariq tanga, talabalar jadvalida balans binafsha raqam. Mahsulotning markaziy tushunchasi — tanga — vizual jihatdan 4 xil.
- **Ma'nosiz kamalak**: o'qituvchilar jadvalidagi amallar (ko'k, yashil, sariq, qizil kvadratlar), dars jadvalidagi pastel kartalar, kalendar hujayralari. Ranglar fan yoki holatni bildirmaydi — tasodifiy.
- Guruh tafsilotida guruh nomi ko'k havola rangida — palitrada yo'q rang.
- O'chirilgan "Excel'dan ma'lumot qo'shish" tugmasi och binafsha — faol tugmadan farqlanmaydi.
- Sessiya tafsilotida barcha o'quvchilar standart holatda **qizil "Sababsiz"** — sahifa ochilganda xato bordek ko'rinadi.
- Dark rejimda fon sof `#000`, kartalar boshqa kulrang — qatlamlar mos emas.

### 3.2 Shrift va tipografiya

- Shkala yo'q: kurslar ro'yxati (18px) sahifa sarlavhasidan katta; guruh kartasi nomi 20px, uning ostidagi ma'lumot 11px.
- Juda mayda matn: stat kartalaridagi yorliqlar, jadval sanalari, "Kim / qachon" ustuni (~10–11px, past kontrast kulrang).
- Raqamlar `tabular-nums` emas — jadvaldagi balanslar va vaqtlar tekis turmaydi.
- Student profilida ALL CAPS yorliqlar ("SHAXSIY MA'LUMOTLAR", "TEZKOR AMALLAR") — qolgan sahifalarda yo'q, uslub bir xil emas.
- Matn xatolari va aralash til: "Harkatlar" (→ Harakatlar), "Student qo'shish" (→ O'quvchi qo'shish), "Talabalar" va "O'quvchilar" ikkalasi ham ishlatilgan.
- Sana formati har xil: "2026-09-14" va "14.09.2026, 10:41".

### 3.3 Spacing va joylashuv

- **Dashboard**: 5 ta stat kartasida raqam chap burchakda kichik, kartaning 70% bo'sh. "Tanga iqtisodiyoti" grafigida Y o'qi yo'q, 7 kundan 5 tasi bo'sh — ma'lumot kam bo'lsa ham katta joy egallaydi. `recentActivity` birinchi ekranda ko'rinmaydi.
- **Guruhlar / Sovg'alar**: chapdagi kategoriya paneli ekran balandligicha cho'zilgan, 4–5 element uchun katta oq maydon.
- **Talabalar**: jadval 2560px kenglikka cho'zilgan, `Email` ustuni deyarli to'liq "Mavjud emas". Sahifa tepasida 3 ta asosiy tugma yonma-yon — ierarxiya yo'q.
- **Talaba profili**: tahrirlash 3 marta takrorlangan (header'da "Tahrirlash", "Tezkor amallar"da, pastda "Ma'lumotlarni tahrirlash"). Davomat halqasida raqam yo'q.
- **O'qituvchi profili / Sessiyalar**: har kartada o'qituvchi nomi va "Dars" badge takrorlanadi — filtrlangan sahifada bu shovqin. Sessiyalar ro'yxatida sarlavha har doim guruh nomi ("9-B ...") — haqiqiy farqlovchi fan va vaqt esa mayda.
- **Dars jadvali (kanban)**: har kartada "O'qituvchi:", "Xona:", "Vaqti:" yorliqlari takrorlanadi; bo'sh "Yakshanba" ustuni teng joy oladi.
- **Oylik kalendar**: kuniga 5–7 ta hodisa mayda matnda — o'qib bo'lmaydi. O'tgan oy kunlari kulrang blok.
- **Sessiya tafsiloti**: "Saqlash" tugmasi kartalardan tashqarida, o'ng pastda yolg'iz turibdi; yo'qlama holat tugmalari juda kichik (≈20px balandlik) — telefonda bosish qiyin.
- **O'quv markazlar**: dropdown menyu matni kesilgan ("Nofaollashtirish").
- Sidebar yig'ish tugmasi chegaraga yopishgan binafsha kvadrat — boshqa hech narsaga o'xshamaydi.
- Navbar'da tenant, til, bildirishnoma, tema — barchasi bir xil og'irlikda.

### 3.4 Mobil moslashuv

- `AdminSidebar` `hidden lg:flex` emas — **telefonda 240px sidebar doim ko'rinadi**, kontent uchun ~130px qoladi. Admin uchun bottom-nav yoki drawer yo'q.
- `AdminLayout` dagi flex bolasida `min-w-0` yo'q — keng jadvallar butun sahifani gorizontal suradi (xotiradagi ma'lum muammo, student layoutda tuzatilgan).
- Jadvallar (talabalar, o'qituvchilar, buyurtmalar) mobil ko'rinishga ega emas.
- Kanban 7 ustun, kalendar 7 ustun — mobil uchun kun bo'yicha ro'yxat kerak.
- Kichik bosish maydonlari: jadval ikonkalari 16px, yo'qlama tugmalari.

---

## 4. Ikki dizayn yo'nalishi

Mahsulot: maktab va o'quv markazlar uchun **tanga-mukofot tizimi bo'lgan ERP**. Auditoriya: admin (kundalik operatsiyalar, ko'pincha desktop), o'qituvchi (yo'qlama, tanga berish — ko'pincha telefon), o'quvchi (balans, sovg'alar — telefon). Asosiy vazifa: "bugun nima qilishim kerak" savoliga tez javob berish va tangani qadrli his qildirish.

Ikkala variantda ham umumiy qoidalar:

- **Tanga rangi faqat tanga uchun.** Oltin rang hech qachon tugma, menyu yoki ogohlantirish uchun ishlatilmaydi. Bitta `<CoinAmount>` komponenti — bitta ikonka, bitta rang, `tabular-nums`.
- **Holat ranglari ma'noga bog'langan**: muvaffaqiyat, ogohlantirish, xavf, ma'lumot — faqat holat uchun. Fanlar uchun alohida, holatlar bilan to'qnashmaydigan 8 rangli kategorik palitra.
- Shriftlar **lotin + kirill + o'zbekcha belgilar (oʻ, gʻ)** ni qo'llashi shart (`uz_cr`, `ru`).
- Barcha ranglar WCAG AA (matn uchun 4.5:1) ga tekshiriladi.

---

### Variant A — "Bog'" (tavsiya etiladi)

**G'oya.** Student/teacher panellardagi mavjud "bog'" identitetini butun mahsulotga yoyish. Tanga — bog'da o'stiriladigan hosil: o'quvchi mehnat qiladi, tanga yig'iladi. Interfeys tinch, yashil va havodor; yagona issiq rang — oltin tanga — shuning uchun u har doim ko'zga tashlanadi. Admin panel bir xil oilada, lekin zichroq va jiddiyroq.

**Kayfiyat:** xotirjam, ishonchli, o'sish hissi. Maktabga mos, "o'yinchoq" emas.

**Nega aynan shu:** teacher va student allaqachon shu palitrada — admin yagona istisno. A variant ikki tizimni bitta qiladi va eng kam qayta ish talab qiladi.

#### Rang palitrasi

| Token | Light | Dark | Qayerda |
|---|---|---|---|
| `--background` | `#F1F4EF` (yashilga moyil oq) | `#0F1A16` | sahifa foni |
| `--card` | `#FFFFFF` | `#16241F` | kartalar, jadval |
| `--muted` | `#E7ECE5` | `#1F302A` | tab foni, hover, input foni |
| `--border` | `#D9E0D6` | `#2A3D35` | chegaralar |
| `--foreground` (ink) | `#16231E` | `#E6EDE8` | asosiy matn |
| `--muted-foreground` | `#56675E` | `#9AAEA4` | ikkinchi darajali matn |
| `--primary` (forest) | `#1F5A45` | `#5CC594` | asosiy tugma, faol tab |
| `--sidebar` | `#15302A` | `#0B1512` | sidebar (ikkala rejimda to'q) |
| `--coin` (gold) | `#E29A2E` | `#F0B24E` | faqat tanga |
| `--coin-soft` | `#FBEBD0` | `#3A2C14` | tanga fon belgisi |
| `--success` (leaf) | `#2E8B57` | `#57C287` | keldi, topshirildi |
| `--warning` (olov) | `#D2691E` | `#F08A45` | e'tibor talab qiladi, kechikdi |
| `--destructive` (bloom) | `#C8442F` | `#F0705C` | sababsiz, o'chirish, ayirildi |
| `--info` (osmon) | `#2F6FA3` | `#6FA8DA` | tasdiqlangan, sababli |

Fanlar uchun kategorik palitra (8 rang, past to'yinganlik): `#3F7F6B`, `#4E6FA8`, `#9A5B8C`, `#B5793A`, `#5C8A3A`, `#7A63B0`, `#3C8C9A`, `#A65454`. Kalendar va kanbanda rang fanni bildiradi — kartaning chap chizig'i va kichik nuqta sifatida, butun fon emas.

#### Shriftlar

- **Sarlavhalar: Geologica** (variable, kirill bor). Uning "sharpness" o'qi bor: admin/teacher uchun aniqroq (`SHRP 0`), student uchun yumshoqroq — bitta oila, ikki xarakter. Fredoka o'rnini egallaydi (kirill muammosi hal bo'ladi).
- **Matn: Onest** (variable) — kirill va lotin uchun teng yaratilgan, jadvallarda o'qilishi yaxshi.
- Raqamlar: Onest `tabular-nums`; tanga summalari Geologica 600.
- Shkala (1.2 nisbat, 15px asos): 12 / 13 / 15 / 18 / 22 / 26 / 32. Sahifa sarlavhasi 26/600, karta sarlavhasi 18/600, matn 15/400, ikkinchi daraja 13/400. 12px faqat badge uchun.

#### Komponentlar uslubi

- **Tugma.** Uch daraja aniq ajratiladi: `primary` (to'liq forest, oq matn — sahifada bittadan ortiq emas), `secondary` (oq fon + chegara), `ghost`. Balandlik 36px (desktop) / 44px (mobil). Gradient yo'q. Radius 10px. `Tanga berish` tugmasi — yagona istisno: forest fon + oltin tanga ikonka.
- **Karta.** Radius ierarxiyaga bog'liq: sahifa bloklari 16px, ichki elementlar 10px, badge 6px. Soya yo'q — faqat 1px chegara; hover faqat bosiladigan kartalarda (chegara rangi o'zgaradi).
- **Stat ko'rsatkichlar.** Alohida 5 ta katta karta o'rniga bitta gorizontal "ko'rsatkichlar qatori" — raqam 26px, yorliq ostida, ajratgich vertikal chiziq.
- **Forma.** Input 40px, `--muted` fon, fokusda forest chegara + 3px halqa. Xato matni inputning ostida, qizil, ikonka bilan.
- **Jadval.** Qator balandligi 52px, sarlavha 13px `--muted-foreground`, zebra yo'q, hover `--muted`. Amallar — bitta "..." menyu (o'qituvchilar jadvalidagi 4 rangli kvadrat o'rniga), eng ko'p ishlatiladigan bitta amal ko'rinadigan. Mobilda jadval karta ro'yxatiga aylanadi.
- **Navigatsiya.** Sidebar to'q forest (ikkala rejimda), faol element — och fon + chap tomonda 3px oltin emas, **yashil-och** chiziq (oltin faqat tanga). Nishon (badge) — `--warning`. Mobilda: admin uchun pastki navigatsiya (Asosiy, Guruhlar, Sessiyalar, Buyurtmalar, Yana) + "Yana" drawer.
- **Holat badge'lari.** Bitta `<StatusBadge kind="purchase|session|attendance" value=...>` komponenti; nuqta + matn, och fon.
- **Yo'qlama.** Segmentli boshqaruv, har tugma 40px; standart holat — neytral "belgilanmagan", qizil emas. "Hammasi keldi" tezkor tugmasi. "Saqlash" pastki yopishqoq panelda.

#### Dashboard maketi (desktop)

```
+--------------------------------------------------------------------------+
| Salom, Muxammadi                                     [Bugun 5 ta dars]   |
+--------------------------------------------------------------------------+
| Bajarilishi kerak                                                        |
|  [1 sovg'a topshirilsin  >]  [4 darsda yo'qlama yo'q  >]  [0 yangi ...]  |
+--------------------------------------------------------------------------+
| Guruhlar 2 | Talabalar 20 | O'qituvchilar 6 | Fanlar 18 | Sovg'alar 9    |
+-----------------------------------------------+--------------------------+
| Tanga iqtisodiyoti                            | Reyting                  |
|  (o) 4 214 aylanmada   +127 bu oy   -0 bu oy  |  1  Javohir A.   (o) 547 |
|  [ 7 kunlik ustunli grafik, Y o'qi bilan ]    |  2  Sardor X.    (o) 540 |
|                                               |  ...                     |
+-----------------------------------------------+--------------------------+
| So'nggi harakatlar (recentActivity)                                      |
+--------------------------------------------------------------------------+
```
`(o)` — oltin tanga belgisi. Mobilda bloklar shu tartibda vertikal: vazifalar → ko'rsatkichlar (2x3 to'r) → tanga → reyting → harakatlar.

#### Eng esda qoladigan element

**Oltin tanga.** Yashil-kulrang interfeysda yagona issiq rang. Balans o'zgarganda raqam bir marta "sanab" chiqadi (count-up, 600ms) va tanga belgisi qisqa yaltiraydi. Boshqa joyda bezak yo'q.

---

### Variant B — "Jurnal"

**G'oya.** Sinf jurnali va daftar. O'qituvchi va admin har kuni aslida jurnal yuritadi: yo'qlama, baho, kim nima oldi. Interfeys toza oq qog'oz, **siyoh-ko'k** asosiy rang, **qizil ruchka** xato/sababsiz uchun, **mis-oltin** tanga uchun. Daftarning qizil hoshiya chizig'i yagona strukturaviy bezak: faol menyu elementi, yo'qlama jadvalining chap chegarasi va "bajarilishi kerak" bloki shu chiziq bilan belgilanadi.

**Kayfiyat:** aniq, tartibli, rasmiy, zich. Admin va o'qituvchi uchun "ish quroli". Student panel ham shu tizimga o'tadi, lekin yumshoqroq.

**Nega aynan shu:** mahsulotning eng ko'p takrorlanadigan ishi — yo'qlama va jadval — jurnal metaforasiga to'g'ridan-to'g'ri mos. Ma'lumot zichligi yuqori sahifalar (kalendar, jadval, buyurtmalar) uchun A dan yaxshiroq. Kamchiligi: student/teacher "bog'" uslubini ham qayta qilish kerak.

#### Rang palitrasi

| Token | Light | Dark | Qayerda |
|---|---|---|---|
| `--background` | `#F6F7F9` | `#0E1220` | sahifa foni |
| `--card` | `#FFFFFF` | `#151A2B` | kartalar |
| `--muted` | `#EEF0F4` | `#1C2236` | hover, tab foni |
| `--border` | `#DCE0E8` | `#283048` | chegaralar, katak chiziqlari |
| `--foreground` | `#141A2E` | `#E5E8F1` | asosiy matn |
| `--muted-foreground` | `#596079` | `#9AA1B8` | ikkinchi darajali |
| `--primary` (siyoh) | `#2A3EB8` | `#8D9BFF` | asosiy tugma, havola, faol tab |
| `--sidebar` | `#FFFFFF` | `#11162A` | oq sidebar, siyoh matn |
| `--margin` (hoshiya) | `#E0485A` | `#FF6F7E` | faol menyu chizig'i, e'tibor bloki |
| `--coin` (mis-oltin) | `#B8862B` | `#E4B45A` | faqat tanga |
| `--success` | `#1E8457` | `#4FC08A` | keldi, topshirildi |
| `--warning` | `#B86B12` | `#EFA04B` | kechikdi, kutilmoqda |
| `--destructive` (qizil ruchka) | `#C8323C` | `#FF6B70` | sababsiz, o'chirish |
| `--info` | `#2C7DA0` | `#6BB8D6` | tasdiqlangan, sababli |

Fanlar uchun kategorik palitra — siyoh ranglari: `#2A3EB8`, `#0F7B6C`, `#8A3FA0`, `#B5651D`, `#3D7A2A`, `#A23B5C`, `#2C7DA0`, `#6B5B2E`.

#### Shriftlar

- **Sarlavhalar va katta raqamlar: Unbounded** (keng, geometrik, kirill bor) — faqat sahifa sarlavhalari va tanga summalarida, tangaga "zarb qilingan" his beradi. Boshqa joyda ishlatilmaydi.
- **Matn: IBM Plex Sans** (kirill bor) — jadval va formalar uchun aniq, texnik.
- Shkala (1.2, 14px asos — zichroq): 12 / 14 / 16 / 20 / 24 / 29. Sahifa sarlavhasi Unbounded 24/500, karta sarlavhasi Plex 16/600, matn 14/400.

#### Komponentlar uslubi

- **Tugma.** Radius 6px — A dan qattiqroq. `primary` siyoh to'liq; `secondary` chegara bilan; xavfli amal — qizil matnli `ghost`. 34px (desktop) / 44px (mobil).
- **Karta.** Radius 8px, 1px chegara, soya yo'q. Ichki bo'limlar karta ichida chiziq bilan ajratiladi, alohida karta emas (karta ichida karta yo'q).
- **Stat ko'rsatkichlar.** Jurnal sarlavha qatori kabi: bitta karta, ustunlar ingichka chiziq bilan bo'lingan.
- **Forma.** Input oq, 1px chegara, fokusda siyoh pastki chiziq qalinlashadi (2px) + halqa.
- **Jadval.** Zich (44px qator), raqamli ustunlar o'ngga tekislangan, katak chiziqlari och. Yo'qlama jadvali haqiqiy jurnal ko'rinishida: chapda qizil hoshiya chizig'i, holatlar qisqa harflar bilan (K, Kch, S, Ss) va to'liq nom tooltipda; mobilda katta segment tugmalar.
- **Navigatsiya.** Oq sidebar, faol elementda chap tomonda 3px qizil hoshiya chizig'i + siyoh matn (to'liq rangli fon yo'q). Mobilda pastki navigatsiya.
- **Kalendar.** Daftar katagi: oylik ko'rinishda har kunda hodisalar soni va fan nuqtalari, kunni bosganda yon panelda to'liq ro'yxat.

#### Dashboard maketi (desktop)

```
+--------------------------------------------------------------------------+
| Bosh sahifa                                     Dushanba, 23-noyabr       |
+--------------------------------------------------------------------------+
|| Bajarilishi kerak                                                       |
|| 1 sovg'a topshirilmagan          [Buyurtmalar]                          |
|| 4 darsda yo'qlama kiritilmagan   [Sessiyalar]                           |
+--------------------------------------------------------------------------+
| Guruh | Talaba | O'qituvchi | Fan | Sovg'a ||  Bugungi darslar (5)        |
|   2   |   20   |     6      | 18  |   9    ||  08:00 Ona tili   9-B  ... |
+----------------------------------------------+  09:40 Algebra    9-A  ... |
| Tanga hisobi                                 |  ...                       |
|  Aylanmada 4 214 | Berildi +127 | Ayirildi 0 +----------------------------+
|  [ grafik ]                                  |  Reyting                   |
+----------------------------------------------+----------------------------+
```
`||` — qizil hoshiya chizig'i. B variantda "Bugungi darslar" dashboardga chiqadi (`todaySessionsCount` badge o'rniga ro'yxat; sessiyalar endpointidan bugungi sana bo'yicha).

#### Eng esda qoladigan element

**Qizil hoshiya chizig'i** — daftar metaforasi, faqat "diqqat qiling" joylarida. Plus Unbounded'da yozilgan tanga summalari.

---

### Variantlarni solishtirish

| | A — Bog' | B — Jurnal |
|---|---|---|
| Kayfiyat | Iliq, xotirjam, o'sish | Aniq, rasmiy, ish quroli |
| Zichlik | O'rtacha | Yuqori |
| Student/teacher bilan moslik | Mavjud uslubni davom ettiradi | Ularni ham qayta qilish kerak |
| Ish hajmi | Kamroq | Ko'proq (~+30%) |
| Kuchli tomoni | Tanga qadri, brend birligi | Jadval, kalendar, yo'qlama |
| Xavf | Admin uchun "yumshoq" ko'rinishi mumkin | Student uchun quruq ko'rinishi mumkin |

**Tavsiyam: A.** Student va teacher panellar allaqachon shu yo'nalishda, admin panelni unga qo'shish mahsulotni bitta brendga aylantiradi. B'dagi ikkita g'oyani A ga ham olish mumkin: kalendarda "kunni bosib ro'yxat ko'rish" va dashboardda "Bugungi darslar".

---

## 5. Animatsiya va mikro-interaksiyalar (ikkala variant uchun)

Qoida: harakat faqat foydalanuvchi harakatiga javob sifatida yoki bitta muhim lahzada. Har kartaga "fade-in" yo'q.

| Joy | Interaksiya | Davomiylik |
|---|---|---|
| Tanga balansi o'zgarishi | raqam count-up + tanga belgisi bir marta yaltiraydi | 600ms |
| Tanga berish muvaffaqiyatli | toast + o'quvchi qatorida balans yashil "+N" ko'rsatib so'nadi | 1.2s |
| Yo'qlama holati | tanlangan segment fon rangi siljiydi (sliding indicator) | 150ms |
| Buyurtma holati o'zgarishi | qator holati badge'i almashadi, qator qisqa ajratiladi | 300ms |
| Sidebar yig'ish | kenglik + matn opacity | 200ms |
| Modal/Sheet | Radix standart (fade + scale 0.98) | 150ms |
| Tugma bosilishi | `translate-y-px` (hozir bor), hover — faqat fon rangi | 100ms |
| Kanban drag | sudralayotgan karta biroz ko'tariladi, maqsad ustun chegarasi primary | — |
| Skeleton | loaderlar o'rniga sahifa shaklidagi skeleton (pulsatsiya yumshoq) | — |

`prefers-reduced-motion` da count-up va yaltirash o'chadi, faqat rang o'zgaradi. Fokus halqasi hamma interaktiv elementda ko'rinadi.

---

## 6. Qaysi fayllar o'zgaradi

### 6.1 Poydevor (birinchi navbatda)

| Fayl | O'zgarish |
|---|---|
| `src/index.css` | `:root` / `.dark` tokenlarini tanlangan palitra bilan to'liq qayta yozish; `--coin`, `--success`, `--warning`, `--info`, `--subject-1..8` qo'shish; `@theme` dagi eski `--color-primary: #7f56d8` va `bg-primary` ni olib tashlash; shriftlar |
| `package.json` | yangi shriftlar (`@fontsource-variable/geologica` + `onest` yoki `unbounded` + `ibm-plex-sans`); keraksiz Geist/Fredoka olib tashlash |
| `index.html` | `<title>BB-Coin</title>`, `lang` |

### 6.2 UI primitivlari (`src/components/ui`)

`button.tsx` (forest/purple gibridini olib tashlash, variantlar), `card.tsx`, `badge.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `searchable-select.tsx`, `option-select.tsx`, `tabs.tsx`, `table.tsx`, `dialog.tsx`, `sheet.tsx`, `dropdown-menu.tsx`, `pagination.tsx`, `calendar.tsx`, `checkbox.tsx`, `avatar.tsx`, `popover.tsx`.

### 6.3 Yangi umumiy komponentlar (`src/components/shared`)

- `CoinAmount` — yagona tanga ko'rinishi (hozirgi 4 xil o'rniga)
- `StatusBadge` — buyurtma / sessiya / yo'qlama / faollik holatlari
- `PageHeader` — sarlavha + tavsif + bitta asosiy amal + qo'shimcha amallar menyusi
- `StatStrip` — ko'rsatkichlar qatori
- `EmptyState` — "nima qilish kerak" tugmasi bilan
- `FilterBar` — qidiruv + filtrlar, mobilda Sheet ichida
- `ResponsiveTable` — desktopda jadval, mobilda karta ro'yxat
- Mavjudlar yangilanadi: `table/*`, `charts/*` (ranglar tokenlardan, Y o'qi), `title/DashboardTitle`, `back/BackListButton`, `loaders/*` (skeleton), `modal/ConfirmModal`, `cards/ProductCard`

### 6.4 Shell (layout va navigatsiya)

- `src/app/layouts/AdminLayout.tsx` — `min-w-0`, `dark:bg-black` → token, mobil pastki navigatsiya joyi
- `src/app/layouts/TeacherLayout.tsx`, `StudentLayout.tsx`, `AuthLayout.tsx` — tokenlarga o'tkazish
- `src/widgets/sidebar/AdminSidebar.tsx` — mobilda yashirish, yangi faol holat, yig'ish tugmasi
- `src/widgets/navbar/AdminNavbar.tsx` — elementlar ierarxiyasi, mobilda tenant/til "profil" menyusiga
- yangi: `src/widgets/navbar/AdminBottomNav.tsx` (+ "Yana" drawer)
- `TeacherSidebar`, `StudentSidebar`, `TeacherNavbar`, `StudentNavbar`, `*BottomNav` — token nomlari

### 6.5 Feature komponentlari (hardcode ranglarni tokenga almashtirish + maket)

`purple-*` eng ko'p uchraydigan joylar: `features/groups/components/section`, `features/students/components/{tab-contents,partials,modal,ui}`, `features/sessions/components`, `components/controls`, `widgets/navbar`, `features/{subjects,rooms,plans,market,dashboard,coin-rules,audit-logs,employees,teachers,tenants,tenant-settings,profile}/components`.

Maket o'zgaradigan asosiy joylar:
- `features/dashboard/components/*` — yangi tartib, `recentActivity` ko'rinadi
- `features/groups/components/*` — kurs paneli ixcham, guruh kartasida to'lganlik
- `features/students/components/*` — jadval ustunlari, profil (takroriy tahrirlashni olib tashlash)
- `features/teachers/components/*` — amallar menyusi
- `features/plans/components/*` — kanban kartasi va kalendar (fan rangi, kun paneli)
- `features/sessions/components/*` — sessiya kartasi sarlavhasi (fan + vaqt), yo'qlama boshqaruvi
- `features/purchases/components/*`, `features/market/components/*`, `features/tenants/components/*`

### 6.6 Sahifalar (`src/pages`)

Asosan bo'shliq va grid o'zgaradi: `dashboard/*`, `groups/*`, `students/*`, `teachers/*`, `plans/admin`, `sessions/*`, `market/*`, `purchases/admin`, `tenants/TenantsList`, `control/admin/*`, `auth/*`, `errors/*`.

### 6.7 Tarjimalar

`src/assets/locales/{uz,ru,uz_cr}/translation.json` — "Harkatlar" xatosi, "Student" → "O'quvchi", "Talaba/O'quvchi" atamasini bittaga keltirish, "EduCoin" → brend nomi, yangi bo'sh holat va "Hammasi keldi" matnlari.

### 6.8 Ish bosqichlari

1. **Tokenlar va shriftlar** — `index.css`, `package.json`. Ilova shu bosqichda yangi ranglarni oladi (shadcn komponentlari tokenlardan foydalanadi).
2. **Primitivlar** — `components/ui`, keyin yangi shared komponentlar.
3. **Shell** — layoutlar, sidebar, navbar, admin mobil navigatsiya.
4. **Sahifalar, muhimlik bo'yicha** — dashboard → sessiya/yo'qlama → buyurtmalar → talabalar → guruhlar → dars jadvali → qolganlari.
5. **`purple-*` va hex tozalash** — `grep` bilan 0 ga tushirish.
6. **Tekshiruv** — har sahifani light/dark, 375px / 768px / 1440px, uch tilda (`uz_cr` kirill shrifti) ko'rib chiqish; `npm run build`.

Har bosqich alohida commit, shunda istalgan joyda to'xtatib ko'rib chiqish mumkin.
