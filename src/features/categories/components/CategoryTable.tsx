import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription
} from '@/components/ui/shadcn/dialog';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { toast } from 'sonner';
import type { Category } from '../types/category.types';

export function CategoryTable() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const categories = data?.success && Array.isArray(data.data) ? data.data : [];

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName('');
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      setFormError('Category name is required');
      return;
    }

    if (!user?.id) {
      setFormError('User not authenticated');
      return;
    }

    try {
      if (editingCategory) {
        const result = await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: { name: categoryName },
          userId: user.id,
        });
        if (result.success) {
          toast.success('Category updated successfully');
          handleCloseModal();
        } else {
          setFormError(result.message);
        }
      } else {
        const result = await createCategory.mutateAsync({
          name: categoryName,
          user_id: user.id,
        });
        if (result.success) {
          toast.success('Category created successfully');
          handleCloseModal();
        } else {
          setFormError(result.message);
        }
      }
    } catch {
      setFormError('An error occurred. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId || !user?.id) return;

    try {
      const result = await deleteCategory.mutateAsync({
        id: deleteConfirmId,
        userId: user.id,
      });
      if (result.success) {
        toast.success('Category deleted successfully');
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to delete category');
    }
    setDeleteConfirmId(null);
  };

  const categoryToDelete = categories.find((c: Category) => c.id === deleteConfirmId);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Failed to load categories</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Categories</h3>
          <span className="text-sm text-muted-foreground">({categories.length})</span>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          size="sm"
          className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">
          <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No categories yet. Create your first category!</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: Category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                        {category.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {category.is_default ? 'Default' : 'Custom'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {!category.is_default && (
                          <button
                            onClick={() => setDeleteConfirmId(category.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingCategory ? 'Edit category name' : 'Create a new category for your transactions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="e.g., Food, Transport, Salary"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setFormError(null);
                }}
                className={formError ? 'border-red-500' : ''}
              />
              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={createCategory.isPending || updateCategory.isPending}
              className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white"
            >
              {createCategory.isPending || updateCategory.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete category <strong>"{categoryToDelete?.name}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
