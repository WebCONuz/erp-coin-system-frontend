// types/index.ts
export interface Product {
  id: string;
  title: string; // Asosiy sarlavha, masalan: "Qo'l soat qizlar uchun"
  description: string; // Qisqa tavsif, masalan: "Qizlar uchun kvadrat soat"
  imageUrl: string; // Mahsulot rasmining linki
  price: number; // Narxi coin-da
  stock: number; // Qolgan dona soni
}
