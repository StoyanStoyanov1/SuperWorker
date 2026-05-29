"use client";

import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import toast from "react-hot-toast";

interface CategoryTreeProps {
    categories: Category[];
    onEdit: (category: Category) => void;
}

export default function CategoryTree({ categories, onEdit }: CategoryTreeProps) {
    const queryClient = useQueryClient();
    
    // Build tree structure
    const buildTree = (cats: Category[], parentId: string | null = null): any[] => {
        return cats
            .filter(c => c.parentId === parentId)
            .map(c => ({
                ...c,
                children: buildTree(cats, c.id)
            }));
    };

    const tree = buildTree(categories);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted");
        },
        onError: () => {
            toast.error("Failed to delete category. It might be used by products.");
        }
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this category? Subcategories will become root categories.")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-2">
            {tree.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No categories found.</p>
            ) : (
                tree.map(node => (
                    <CategoryNode 
                        key={node.id} 
                        node={node} 
                        onEdit={onEdit} 
                        onDelete={handleDelete} 
                    />
                ))
            )}
        </div>
    );
}

function CategoryNode({ node, onEdit, onDelete, level = 0 }: { node: any, onEdit: any, onDelete: any, level?: number }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col">
            <div 
                className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors ${level > 0 ? 'ml-6 border-l pl-4' : 'bg-background border'}`}
            >
                <div className="flex items-center gap-2">
                    {hasChildren ? (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-0.5 hover:bg-muted rounded">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    ) : (
                        <div className="w-5" />
                    )}
                    <span className="font-medium text-sm">{node.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(node)}>
                        <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(node.id)}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
            
            {hasChildren && isExpanded && (
                <div className="flex flex-col mt-1">
                    {node.children.map((child: any) => (
                        <CategoryNode 
                            key={child.id} 
                            node={child} 
                            onEdit={onEdit} 
                            onDelete={onDelete} 
                            level={level + 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
