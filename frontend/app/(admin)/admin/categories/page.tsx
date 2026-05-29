"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import CategoryTree from "@/components/admin/categories/CategoryTree";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAll(),
    });

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage your product categories and hierarchy.</p>
                </div>
                {!isFormOpen && (
                    <Button onClick={handleAdd} className="cursor-pointer">
                        <Plus size={16} className="mr-2" />
                        Add Category
                    </Button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-primary/20 relative">
                    <button 
                        onClick={closeForm}
                        className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="max-w-md mx-auto">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
                        </h2>
                        <CategoryForm 
                            initialData={editingCategory} 
                            categories={categories || []} 
                            onSuccess={closeForm} 
                        />
                    </div>
                </div>
            )}

            <div className="bg-background rounded-xl border p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-destructive">
                        Failed to load categories. Please try again.
                    </div>
                ) : (
                    <CategoryTree categories={categories || []} onEdit={handleEdit} />
                )}
            </div>
        </div>
    );
}
