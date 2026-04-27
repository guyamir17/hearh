import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { 
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, 
  MoreVertical, Loader2, FileText, Upload
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { format } from 'date-fns';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת שבוע',
  'מאמרים_באמונה': 'מאמרים באמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

export default function AdminArticles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['adminArticles'],
    queryFn: async () => {
      const all = await staticClient.entities.Article.list('-created_date');
      return all;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await staticClient.entities.Article.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticles'] });
      setDeleteId(null);
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }) => {
      await staticClient.entities.Article.update(id, { published: !published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticles'] });
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }) => {
      await staticClient.entities.Article.update(id, { is_featured: !is_featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminArticles'] });
    }
  });

  const filteredArticles = React.useMemo(() => {
    if (!articles) return [];
    if (!searchQuery) return articles;
    return articles.filter(article =>
      article.title?.includes(searchQuery) ||
      article.excerpt?.includes(searchQuery)
    );
  }, [articles, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">
                ניהול מאמרים
              </h1>
              <p className="text-slate-600 mt-1">
                {articles?.length || 0} מאמרים באתר
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`${createPageUrl('ArticleEditor')}?bulk=true`}>
                <Button variant="outline" className="rounded-xl">
                  <Upload className="w-5 h-5 ml-2" />
                  העלאה מרוכזת
                </Button>
              </Link>
              <Link to={createPageUrl('ArticleEditor')}>
                <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl">
                  <Plus className="w-5 h-5 ml-2" />
                  מאמר חדש
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md mt-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="חיפוש מאמרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-12 bg-slate-50 border-slate-200 rounded-xl"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">אין מאמרים</h2>
            <p className="text-slate-500 mb-6">התחילו ביצירת המאמר הראשון שלכם</p>
            <Link to={createPageUrl('ArticleEditor')}>
              <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl">
                <Plus className="w-5 h-5 ml-2" />
                מאמר חדש
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#1e3a5f] truncate">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                          {article.excerpt}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`${createPageUrl('ArticleEditor')}?id=${article.id}`}>
                              <Edit2 className="w-4 h-4 ml-2" />
                              עריכה
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`${createPageUrl('Article')}?id=${article.id}`} target="_blank">
                              <Eye className="w-4 h-4 ml-2" />
                              צפייה
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => togglePublishMutation.mutate({ 
                              id: article.id, 
                              published: article.published 
                            })}
                          >
                            {article.published ? (
                              <>
                                <EyeOff className="w-4 h-4 ml-2" />
                                הסתר
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 ml-2" />
                                פרסם
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleFeaturedMutation.mutate({ 
                              id: article.id, 
                              is_featured: article.is_featured 
                            })}
                          >
                            <Star className={`w-4 h-4 ml-2 ${article.is_featured ? 'fill-current' : ''}`} />
                            {article.is_featured ? 'הסר מנבחרים' : 'הוסף לנבחרים'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setDeleteId(article.id)}
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            מחיקה
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[article.category] || article.category}
                      </Badge>
                      {article.published ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">מפורסם</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 text-xs">טיוטה</Badge>
                      )}
                      {article.is_featured && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          <Star className="w-3 h-3 ml-1 fill-current" />
                          נבחר
                        </Badge>
                      )}
                      {article.created_date && (
                        <span className="text-xs text-slate-400">
                          {format(new Date(article.created_date), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את המאמר?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו לא ניתנת לביטול. המאמר יימחק לצמיתות.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'מחיקה'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}