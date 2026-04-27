import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { 
  Plus, Pencil, Trash2, ExternalLink, MoreVertical, 
  Loader2, Check, Eye, EyeOff, GripVertical 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AdminExternalArticles() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    source_name: '',
    external_url: '',
    image_url: '',
    publish_date: '',
    display_order: 0,
    published: true
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['adminExternalArticles'],
    queryFn: async () => {
      return await staticClient.entities.ExternalArticle.list('display_order');
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingArticle) {
        await staticClient.entities.ExternalArticle.update(editingArticle.id, data);
      } else {
        await staticClient.entities.ExternalArticle.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExternalArticles'] });
      setDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await staticClient.entities.ExternalArticle.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExternalArticles'] });
      setDeleteId(null);
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }) => {
      await staticClient.entities.ExternalArticle.update(id, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExternalArticles'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      source_name: '',
      external_url: '',
      image_url: '',
      publish_date: '',
      display_order: 0,
      published: true
    });
    setEditingArticle(null);
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      subtitle: article.subtitle || '',
      source_name: article.source_name || '',
      external_url: article.external_url || '',
      image_url: article.image_url || '',
      publish_date: article.publish_date || '',
      display_order: article.display_order || 0,
      published: article.published !== false
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await staticClient.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#1e3a5f]">מאמרים שפורסמו ברשת</h1>
            <Button 
              onClick={() => { resetForm(); setDialogOpen(true); }}
              className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl"
            >
              <Plus className="w-4 h-4 ml-1" />
              הוסף מאמר
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <ExternalLink className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">אין מאמרים חיצוניים</p>
            <Button 
              onClick={() => { resetForm(); setDialogOpen(true); }}
              className="mt-4"
              variant="outline"
            >
              הוסף מאמר ראשון
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div 
                key={article.id}
                className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <GripVertical className="w-5 h-5 text-slate-300 flex-shrink-0 cursor-grab" />
                
                {article.image_url ? (
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-6 h-6 text-slate-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1e3a5f] text-sm line-clamp-1">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {article.source_name}
                    </span>
                    {!article.published && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        טיוטה
                      </span>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(article)}>
                      <Pencil className="w-4 h-4 ml-2" />
                      עריכה
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 ml-2" />
                        צפייה
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => togglePublishMutation.mutate({ 
                        id: article.id, 
                        published: !article.published 
                      })}
                    >
                      {article.published ? (
                        <><EyeOff className="w-4 h-4 ml-2" />הסתר</>
                      ) : (
                        <><Eye className="w-4 h-4 ml-2" />פרסם</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(article.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      מחק
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'עריכת מאמר' : 'הוספת מאמר חדש'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm">כותרת *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="mt-1"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-sm">כותרת משנה</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                className="mt-1"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-sm">שם האתר *</Label>
              <Input
                value={formData.source_name}
                onChange={(e) => setFormData({...formData, source_name: e.target.value})}
                required
                placeholder="לדוגמה: ערוץ 7"
                className="mt-1"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-sm">קישור למאמר *</Label>
              <Input
                value={formData.external_url}
                onChange={async (e) => {
                  const url = e.target.value;
                  setFormData({...formData, external_url: url});
                  
                  // Try to fetch OG image when URL is pasted
                  if (url && url.startsWith('http') && !formData.image_url) {
                    try {
                      const response = await staticClient.integrations.Core.InvokeLLM({
                        prompt: `Extract the Open Graph image URL from this webpage: ${url}. Return only the image URL, nothing else. If you can't find one, return "none".`,
                        add_context_from_internet: true
                      });
                      if (response && response !== 'none' && response.startsWith('http')) {
                        setFormData(prev => ({...prev, image_url: response}));
                      }
                    } catch (err) {
                      // Silent fail - user can add image manually
                    }
                  }
                }}
                required
                placeholder="https://..."
                className="mt-1"
                dir="ltr"
              />
              <p className="text-xs text-slate-500 mt-1">הדביקו קישור - המערכת תנסה למשוך תמונה אוטומטית</p>
            </div>
            <div>
              <Label className="text-sm">תמונה</Label>
              <div className="mt-1 space-y-2">
                {formData.image_url && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-100">
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, image_url: ''})}
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >✕</button>
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-200 rounded-lg p-3 hover:border-[#4a90a4] transition-colors">
                  <span className="text-sm text-slate-500">📁 בחרו תמונה מהמחשב</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="text-xs text-slate-400">או הכניסו כתובת URL ידנית:</p>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  dir="ltr"
                  className="text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">תאריך פרסום</Label>
              <Input
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData({...formData, publish_date: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">סדר הצגה</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                ביטול
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'שמור'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>מחיקת מאמר</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">האם למחוק את המאמר?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>ביטול</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'מחק'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}