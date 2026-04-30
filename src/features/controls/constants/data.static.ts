import type { Lesson, Employee, CoinReason, Role } from "../models";

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Chuqurlashtirilgan Matematika",
    description: "Faqat aniq fanlar yo'nalishi uchun",
    groups: [
      { id: 1, name: "5-sinf" },
      { id: 2, name: "8-sinf" },
      { id: 3, name: "9-sinf" },
    ],
    color: "#7c3aed",
  },
  {
    id: 2,
    title: "Ingliz tili",
    description: "Boshlang'ich va o'rta daraja",
    groups: [
      { id: 4, name: "6-sinf" },
      { id: 5, name: "7-sinf" },
    ],
    color: "#2563eb",
  },
  {
    id: 3,
    title: "Fizika",
    description: "Nazariya va masalalar yechish",
    groups: [
      { id: 6, name: "8-sinf" },
      { id: 7, name: "10-sinf" },
    ],
    color: "#dc2626",
  },
  {
    id: 4,
    title: "Kimyo",
    description: "Laboratoriya va test tayyorlov",
    groups: [
      { id: 8, name: "9-sinf" },
      { id: 9, name: "11-sinf" },
    ],
    color: "#16a34a",
  },
  {
    id: 5,
    title: "Tarix",
    description: "O'zbekiston va jahon tarixi",
    groups: [
      { id: 10, name: "7-sinf" },
      { id: 11, name: "8-sinf" },
    ],
    color: "#f59e0b",
  },
  {
    id: 6,
    title: "Biologiya",
    description: "Tirik organizmlar va tizimlar",
    groups: [
      { id: 12, name: "6-sinf" },
      { id: 13, name: "9-sinf" },
    ],
    color: "#10b981",
  },
  {
    id: 7,
    title: "Informatika",
    description: "Dasturlash va kompyuter savodxonligi",
    groups: [
      { id: 14, name: "5-sinf" },
      { id: 15, name: "8-sinf" },
    ],
    color: "#0ea5e9",
  },
];

export const employees: Employee[] = [
  {
    id: 1,
    phone: "+998995426000",
    fullName: "Samandar Hamraqulov",
    avatarUrl: "https://picsum.photos/200?random=1",
    isActive: true,
    taughtGroups: [{ id: 1, name: "5A guruh" }],
    tenant: {
      id: 1,
      name: "Buyuk bilim maktabi",
      isActive: true,
    },
  },
  {
    id: 2,
    phone: "+998901112233",
    fullName: "Dilshod Karimov",
    avatarUrl: "https://picsum.photos/200?random=2",
    isActive: true,
    taughtGroups: [
      { id: 2, name: "6B guruh" },
      { id: 3, name: "7A guruh" },
    ],
    tenant: {
      id: 1,
      name: "Buyuk bilim maktabi",
      isActive: true,
    },
  },
  {
    id: 3,
    phone: "+998933334455",
    fullName: "Malika To'rayeva",
    avatarUrl: "https://picsum.photos/200?random=3",
    isActive: false,
    taughtGroups: [{ id: 4, name: "8A guruh" }],
    tenant: {
      id: 2,
      name: "Ilm ziyo markazi",
      isActive: true,
    },
  },
  {
    id: 4,
    phone: "+998977778899",
    fullName: "Javohir Ismoilov",
    avatarUrl: "https://picsum.photos/200?random=4",
    isActive: true,
    taughtGroups: [
      { id: 5, name: "9A guruh" },
      { id: 6, name: "10B guruh" },
    ],
    tenant: {
      id: 2,
      name: "Ilm ziyo markazi",
      isActive: true,
    },
  },
  {
    id: 5,
    phone: "+998901234567",
    fullName: "Aziza Rahmonova",
    avatarUrl: "https://picsum.photos/200?random=5",
    isActive: true,
    taughtGroups: [{ id: 7, name: "5B guruh" }],
    tenant: {
      id: 3,
      name: "Kelajak akademiyasi",
      isActive: false,
    },
  },
  {
    id: 6,
    phone: "+998998887766",
    fullName: "Bekzod Qodirov",
    avatarUrl: "https://picsum.photos/200?random=6",
    isActive: false,
    taughtGroups: [
      { id: 8, name: "6A guruh" },
      { id: 9, name: "7B guruh" },
    ],
    tenant: {
      id: 3,
      name: "Kelajak akademiyasi",
      isActive: false,
    },
  },
  {
    id: 7,
    phone: "+998935551122",
    fullName: "Nodira Saidova",
    avatarUrl: "https://picsum.photos/200?random=7",
    isActive: true,
    taughtGroups: [{ id: 10, name: "11A guruh" }],
    tenant: {
      id: 1,
      name: "Buyuk bilim maktabi",
      isActive: true,
    },
  },
];

export const coinReasons: CoinReason[] = [
  {
    id: 1,
    title: "Darsda qatnashgani uchun",
    count: 3,
    isPlus: true,
  },
  {
    id: 2,
    title: "Uyga vazifa bajarmagani uchun",
    count: 5,
    isPlus: false,
  },
  {
    id: 3,
    title: "Testdan yuqori natija olgani uchun",
    count: 10,
    isPlus: true,
  },
  {
    id: 4,
    title: "Kechikib kelgani uchun",
    count: 2,
    isPlus: false,
  },
  {
    id: 5,
    title: "Faol qatnashgani uchun",
    count: 4,
    isPlus: true,
  },
  {
    id: 6,
    title: "Intizom buzganligi uchun",
    count: 6,
    isPlus: false,
  },
  {
    id: 7,
    title: "Qo‘shimcha topshiriq bajargani uchun",
    count: 7,
    isPlus: true,
  },
  {
    id: 7,
    title: "Jamoat ishlarida faolligi uchun",
    count: 5,
    isPlus: true,
  },
  {
    id: 7,
    title: "Oraliq Nazoratdan o'tgani uchun",
    count: 10,
    isPlus: true,
  },
  {
    id: 7,
    title: "Imtihondan o'tgani uchun",
    count: 15,
    isPlus: true,
  },
];

export const roles: Role[] = [
  {
    id: 1,
    name: "super admin",
    isActive: true,
    createdAt: "19.04.2026",
  },
  {
    id: 2,
    name: "admin",
    isActive: true,
    createdAt: "20.04.2026",
  },
  {
    id: 3,
    name: "teacher",
    isActive: true,
    createdAt: "21.04.2026",
  },
  {
    id: 4,
    name: "student",
    isActive: true,
    createdAt: "21.04.2026",
  },
  {
    id: 4,
    name: "moderator",
    isActive: false,
    createdAt: "21.04.2026",
  },
];
