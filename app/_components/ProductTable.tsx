"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Search, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { Product } from "@/lib/productTypes";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
}

const ProductTable = ({ products, onEdit, onDelete, onAdjustStock }: ProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const desc = product.description?.toLowerCase() || "";
    const sku = (product.sku || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || desc.includes(q) || sku.includes(q);
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0).length;
  const outOfStockProducts = products.filter((p) => (p.stock ?? 0) === 0).length;

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">Out of Stock</Badge>;
    if (stock <= 5) return <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">Low Stock</Badge>;
    return <Badge variant="default" className="bg-green-600 hover:bg-green-700">In Stock</Badge>;
  };

  const getId = (p: Product) => (p._id ? String(p._id) : "");

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="admin-surface admin-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-muted text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-surface admin-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-muted text-sm font-medium">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-yellow-500">{lowStockProducts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-surface admin-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-muted text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-red-500">{outOfStockProducts}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="admin-surface admin-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Product Inventory</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted h-4 w-4" />
            <Input
              placeholder="Search by name, description, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-secondary/50 border-admin-border"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-admin-border">
                  <TableHead className="text-admin-muted">Product</TableHead>
                  <TableHead className="text-admin-muted">SKU</TableHead>
                  <TableHead className="text-admin-muted">Description</TableHead>
                  <TableHead className="text-admin-muted">Stock</TableHead>
                  <TableHead className="text-admin-muted">Price</TableHead>
                  <TableHead className="text-admin-muted">Status</TableHead>
                  <TableHead className="text-admin-muted text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const id = getId(product);
                  const price = Number(product.price || 0);
                  return (
                    <TableRow key={id} className="border-admin-border hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {(product.images || product.images?.[0]) && (
                            <img
                              src={Array.isArray(product.images) ? product.images[0] || "" : product.images || ""}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-admin-muted">{product.sku || "-"}</TableCell>
                      <TableCell className="text-admin-muted max-w-xs">
                        <div className="truncate">{product.description || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="icon" onClick={() => onAdjustStock(id, -1)}>-</Button>
                          <span className="font-mono text-sm">{product.stock ?? 0}</span>
                          <Button variant="secondary" size="icon" onClick={() => onAdjustStock(id, +1)}>+</Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {price.toLocaleString()} {product.currency ?? "MNT"}
                        </span>
                      </TableCell>
                      <TableCell>{getStockBadge(product.stock ?? 0)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(product)}
                            className="hover:bg-blue-500/20 hover:text-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(id)}
                            className="hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-admin-muted mx-auto mb-4" />
              <p className="text-admin-muted">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTable;
