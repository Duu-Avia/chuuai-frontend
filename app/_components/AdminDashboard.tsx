"use client";
import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";

import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { makeProductApi } from "@/lib/productApi";
import { Product, ProductDraft, ProductFormData } from "@/lib/productTypes";

type View = "table" | "add" | "edit";

export default function AdminDashboard({
  pageId,
  backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "",
}: {
  pageId: string;
  backendBaseUrl?: string;
}) {
  const { getToken, isSignedIn } = useAuth();
  const { toast } = useToast();

  const api = useMemo(
    () => makeProductApi(backendBaseUrl, getToken, pageId),
    [backendBaseUrl, getToken, pageId]
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("table");
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !pageId) return;
      try {
        setLoading(true);
        const result = await api.list();
        // Support both shapes: array OR { items, nextCursor }
        const items: any[] = Array.isArray(result) ? result : result?.items || [];
        const normalized = items.map((p) => ({
          ...p,
          image: Array.isArray(p.images) ? p.images?.[0] : p.images,
        }));
        setProducts(normalized);
      } catch (e: any) {
        toast({
          title: "Failed to load products",
          description: e?.error || String(e),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [api, isSignedIn, pageId, toast]);

  // create
  async function handleAddProduct(form: ProductDraft) {
    try {
      const payload: ProductFormData = {
        // pageId is injected by backend guard; sending it is optional
        sku: form.sku || "",
        name: form.name,
        description: form.description || "",
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        currency: form.currency || "MNT",
        status: form.status || "active",
        images: Array.isArray(form.images) ? form.images : form.images ? [form.images as any] : [],
      };
      const created = await api.create(payload);
      setProducts((prev) => [{ ...created, image: created.images?.[0] }, ...prev]);
      setView("table");
      toast({ title: "Product created", description: created.name });
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.error || String(e), variant: "destructive" });
    }
  }

  // edit
  async function handleEditProduct(form: ProductDraft) {
    if (!editing?._id) return;
    try {
      const payload: Partial<ProductFormData> = {
        // pageId is injected; not required in payload
        sku: form.sku,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        currency: form.currency,
        status: form.status,
        images: Array.isArray(form.images) ? form.images : form.images ? [form.images as any] : [],
      };
      const updated = await api.update(String(editing._id), payload);
      setProducts((prev) =>
        prev.map((p) => (String(p._id) === String(updated._id) ? { ...updated, image: updated.images?.[0] } : p))
      );
      setEditing(null);
      setView("table");
      toast({ title: "Saved", description: updated.name });
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.error || String(e), variant: "destructive" });
    }
  }

  // delete
  async function handleDeleteProduct(id: string) {
    try {
      const keep = products.filter((x) => String(x._id) !== String(id));
      setProducts(keep); // optimistic
      await api.remove(id);
      toast({ title: "Deleted", description: "Product removed", variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.error || String(e), variant: "destructive" });
    }
  }

  // +/- stock
  async function handleAdjustStock(id: string, delta: number) {
    try {
      setProducts((prev) =>
        prev.map((x) => (String(x._id) === String(id) ? { ...x, stock: Math.max(0, (x.stock || 0) + delta) } : x))
      );
      const updated = await api.adjustStock(id, delta);
      setProducts((prev) =>
        prev.map((x) => (String(x._id) === String(id) ? { ...updated, image: updated.images?.[0] } : x))
      );
    } catch (e: any) {
      toast({ title: "Stock change failed", description: e?.error || String(e), variant: "destructive" });
    }
  }
  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-admin-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg admin-gradient">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage your product inventory</p>
            </div>
          </div>
          {view === "table" && (
            <Button onClick={() => setView("add")} className="admin-gradient hover:opacity-90 admin-glow">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8">
        {view === "table" && (
          <ProductTable
            products={products}
            onEdit={(p) => {
              setEditing(p);
              setView("edit");
            }}
            onDelete={handleDeleteProduct}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {view === "add" && (
          <div className="max-w-2xl mx-auto">
            <ProductForm pageId={pageId} onSubmit={handleAddProduct} onCancel={() => setView("table")} />
          </div>
        )}

        {view === "edit" && editing && (
          <div className="max-w-2xl mx-auto">
            <ProductForm
              pageId={pageId}
              product={editing}
              onSubmit={handleEditProduct}
              onCancel={() => {
                setEditing(null);
                setView("table");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
