"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductDraft} from "@/lib/productTypes";

interface ProductFormProps {
  pageId: string;                                // kept for parent injection
  product?: Product;
  onSubmit: (product: ProductDraft) => void;     // <-- only draft (no pageId)
  onCancel: () => void;
}

const ProductForm = ({ pageId, product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductDraft>({
    sku: product?.sku || "",
    name: product?.name || "",
    stock: product?.stock ?? 0,
    description: product?.description || "",
    price: product?.price ?? 0,
    currency: product?.currency || "MNT",
    images: Array.isArray(product?.images)
      ? product.images
      : product?.images
      ? [product.images]
      : [],
    status: product?.status || "active",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sku?.trim()) {
      toast({ title: "Error", description: "SKU is required", variant: "destructive" });
      return;
    }
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" });
      return;
    }
    if ((formData.stock ?? 0) < 0) {
      toast({ title: "Error", description: "Stock cannot be negative", variant: "destructive" });
      return;
    }
    if ((formData.price ?? 0) < 0) {
      toast({ title: "Error", description: "Price cannot be negative", variant: "destructive" });
      return;
    }

    const payload: ProductDraft = {
      ...formData,
      images: Array.isArray(formData.images)
        ? formData.images
        : formData.images
        ? [formData.images as any]
        : [],
    };

    onSubmit(payload);

    toast({
      title: product ? "Product updated" : "Product added",
      description: product ? "Product updated successfully" : "Product added successfully",
    });
  };

  const handleInputChange = (field: keyof ProductDraft, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
  };

  // image input shows the first image (if any)
  const firstImage = Array.isArray(formData.images) ? formData.images[0] || "" : "";

  return (
    <Card className="admin-surface admin-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {product ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-medium">SKU *</Label>
              <Input
                id="sku"
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="e.g. TSHIRT-BLACK-M"
                className="bg-secondary/50 border-admin-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                className="bg-secondary/50 border-admin-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="bg-secondary/50 border-admin-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                placeholder="0"
                className="bg-secondary/50 border-admin-border focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
              <Input
                id="currency"
                type="text"
                value={formData.currency || "MNT"}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                placeholder="MNT"
                className="bg-secondary/50 border-admin-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">Product Image URL</Label>
              <Input
                id="image"
                type="url"
                value={firstImage}
                onChange={(e) => setFormData((prev) => ({ ...prev, images: e.target.value ? [e.target.value] : [] }))}
                placeholder="https://example.com/image.jpg"
                className="bg-secondary/50 border-admin-border focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="bg-secondary/50 border-admin-border focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="admin-gradient hover:opacity-90 flex-1">
              {product ? "Update Product" : "Add Product"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} className="px-6">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
