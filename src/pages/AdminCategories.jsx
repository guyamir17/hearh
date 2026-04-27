import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Folder, Plus, Edit, Trash2, Save, X, FolderOpen, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    icon: '',
    description: '',
    parent_category: '',
    display_order: 0,
    active: true,
    show_in_menu: true,
    page_url: ''
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await staticClient.entities.Category.list();
      return result.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingCategory) {
        return await staticClient.entities.Category.update(editingCategory.id, data);
      } else {
        return await staticClient.entities.Category.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      toast.success(editingCategory ? 'הקטגוריה עודכנה' : 'הקטגוריה נוספה');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await staticClient.entities.Category.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteCategory(null);
      toast.success('הקטגוריה נמחקה');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      key: '',
      icon: '',
      description: '',
      parent_category: '',
      display_order: 0,
      active: true,
      show_in_menu: true,
      page_url: ''
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      key: category.key || '',
      icon: category.icon || '',
      description: category.description || '',
      parent_category: category.parent_category || '',
      display_order: category.display_order || 0,
      active: category.active ?? true,
      show_in_menu: category.show_in_menu ?? true,
      page_url: category.page_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleAdd = (parentKey = '') => {
    setEditingCategory(null);
    resetForm();
    if (parentKey) {
      setFormData(prev => ({ ...prev, parent_category: parentKey }));
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.key) {
      toast.error('יש למלא את כל השדות החובה');
      return;
    }
    saveMutation.mutate(formData);
  };

  const mainCategories = categories?.filter(cat => !cat.parent_category) || [];
  const getSubcategories = (parentKey) => categories?.filter(cat => cat.parent_category === parentKey) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="animate-pulse text-[#1e3a5f]">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Folder className="w-6 h-6 text-[#1e3a5f]" />
                <h1 className="text-2xl font-bold text-[#1e3a5f]">ניהול קטגוריות</h1>
              </div>
              <p className="text-slate-600">הוספה, עריכה ומחיקה של קטגוריות ותת-קטגוריות</p>
            </div>
            <Button onClick={() => handleAdd()} className="bg-[#1e3a5f] hover:bg-[#2a4a6f]">
              <Plus className="w-4 h-4 ml-2" />
              קטגוריה ראשית חדשה
            </Button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {mainCategories.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              אין עדיין קטגוריות. הוסיפו קטגוריה ראשונה!
            </div>
          ) : (
            <div className="space-y-4">
              {mainCategories.map((category) => {
                const subcategories = getSubcategories(category.key);
                return (
                  <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Main Category */}
                    <div className="bg-slate-50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-[#1e3a5f]" />
                        <div>
                          <div className="font-bold text-[#1e3a5f]">{category.name}</div>
                          <div className="text-sm text-slate-500">{category.key}</div>
                          {category.description && (
                            <div className="text-xs text-slate-400 mt-0.5">{category.description}</div>
                          )}
                        </div>
                        {!category.active && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">לא פעיל</span>
                        )}
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {subcategories.length} תת-קטגוריות
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdd(category.key)}
                          className="text-[#4a90a4] border-[#4a90a4] hover:bg-[#4a90a4]/10 text-xs"
                        >
                          <FolderPlus className="w-3.5 h-3.5 ml-1" />
                          + תת-קטגוריה
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="text-slate-600 hover:text-[#1e3a5f]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteCategory(category)}
                          className="text-slate-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="p-4 space-y-2">
                      {subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-full border-r-2 border-slate-200 mr-2"></div>
                            <div>
                              <div className="font-medium text-slate-700">{sub.name}</div>
                              <div className="text-xs text-slate-400">{sub.key}</div>
                              {sub.description && <div className="text-xs text-slate-400">{sub.description}</div>}
                            </div>
                            {!sub.active && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">לא פעיל</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(sub)}
                              className="text-slate-600 hover:text-[#1e3a5f]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteCategory(sub)}
                              className="text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAdd(category.key)}
                        className="w-full p-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-[#4a90a4] hover:text-[#4a90a4] transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        הוסף תת-קטגוריה ל{category.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit/Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>שם הקטגוריה *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="לדוגמה: פרשת שבוע"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label>מזהה (Key) *</Label>
                  <Input
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="parshat_shavua"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label>תיאור</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="תיאור הקטגוריה"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>אייקון (lucide-react)</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="BookOpen"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>קטגוריית אב (לתת-קטגוריה)</Label>
                  <Select
                    value={formData.parent_category || '__none__'}
                    onValueChange={(val) => setFormData({ ...formData, parent_category: val === '__none__' ? '' : val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ללא (קטגוריה ראשית)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">ללא (קטגוריה ראשית)</SelectItem>
                      {mainCategories.map((cat) => (
                        <SelectItem key={cat.key} value={cat.key}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>סדר הצגה</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>כתובת עמוד</Label>
                  <Input
                    value={formData.page_url}
                    onChange={(e) => setFormData({ ...formData, page_url: e.target.value })}
                    placeholder="ParshatShavua"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label>פעיל</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.show_in_menu}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_in_menu: checked })}
                  />
                  <Label>הצג בתפריט</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 ml-2" />
                ביטול
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#1e3a5f]">
                <Save className="w-4 h-4 ml-2" />
                שמור
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>מחיקת קטגוריה</AlertDialogTitle>
              <AlertDialogDescription>
                האם אתה בטוח שברצונך למחוק את "{deleteCategory?.name}"?
                פעולה זו לא ניתנת לביטול.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(deleteCategory.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}