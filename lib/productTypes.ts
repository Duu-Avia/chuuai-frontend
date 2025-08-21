// lib/productTypes.ts
export type Product = {
  _id: string;
  pageId: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  currency?: string;
  status?: "active" | "hidden";
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

// ✅ Data you send to create/update (backend injects pageId)
export type ProductFormData = Omit<Product, "_id" | "pageId" | "createdAt" | "updatedAt">;

// ✅ What your form edits locally (images can be string or string[])
export type ProductDraft = {
  sku: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  currency?: string;
  status?: "active" | "hidden";
  images?: string | string[];
};
