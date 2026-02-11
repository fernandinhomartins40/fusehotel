import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  useLandingSettings,
  useUpdateLandingSettings,
  useFAQCategoriesAdmin,
  useFAQItemsAdmin,
  useCreateFAQCategory,
  useUpdateFAQCategory,
  useDeleteFAQCategory,
  useCreateFAQItem,
  useUpdateFAQItem,
  useDeleteFAQItem,
} from '@/hooks/useLanding';
import { FAQContentConfig, defaultFAQContentConfig, FAQCategory, FAQItem } from '@/types/faq-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const FAQContentCustomizer = () => {
  const { data: settingsData, isLoading } = useLandingSettings('faq-content');
  const { data: categories = [], isLoading: isLoadingCategories } = useFAQCategoriesAdmin();
  const { data: items = [], isLoading: isLoadingItems } = useFAQItemsAdmin();

  const updateSettings = useUpdateLandingSettings();
  const createCategory = useCreateFAQCategory();
  const updateCategory = useUpdateFAQCategory();
  const deleteCategory = useDeleteFAQCategory();
  const createItem = useCreateFAQItem();
  const updateItem = useUpdateFAQItem();
  const deleteItem = useDeleteFAQItem();

  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const config = settingsData?.config || defaultFAQContentConfig;

  const form = useForm<FAQContentConfig>({
    defaultValues: config,
    values: config,
  });

  const categoryForm = useForm<Partial<FAQCategory>>({
    defaultValues: {
      name: '',
      order: 0,
      isActive: true,
    },
  });

  const itemForm = useForm<Partial<FAQItem>>({
    defaultValues: {
      categoryId: '',
      question: '',
      answer: '',
      order: 0,
      isActive: true,
    },
  });

  const watchedValues = form.watch();

  const onSubmit = (data: FAQContentConfig) => {
    updateSettings.mutate(
      { section: 'faq-content', config: data },
      {
        onSuccess: () => {
          toast.success('Configurações de conteúdo salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleReset = () => {
    form.reset(defaultFAQContentConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  // Category handlers
  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setEditingCategory(null);
    categoryForm.reset({
      name: '',
      order: (categories.length || 0) + 1,
      isActive: true,
    });
  };

  const handleEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
    setIsAddingCategory(false);
    categoryForm.reset(category);
  };

  const handleSaveCategory = async (data: Partial<FAQCategory>) => {
    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        data,
      }, {
        onSuccess: () => {
          setEditingCategory(null);
          categoryForm.reset();
        }
      });
    } else {
      createCategory.mutate(data, {
        onSuccess: () => {
          setIsAddingCategory(false);
          categoryForm.reset();
        }
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Todas as perguntas associadas serão excluídas.')) {
      deleteCategory.mutate(id);
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setIsAddingCategory(false);
    categoryForm.reset();
  };

  // Item handlers
  const handleAddItem = (categoryId?: string) => {
    setIsAddingItem(true);
    setEditingItem(null);
    itemForm.reset({
      categoryId: categoryId || '',
      question: '',
      answer: '',
      order: 0,
      isActive: true,
    });
  };

  const handleEditItem = (item: FAQItem) => {
    setEditingItem(item);
    setIsAddingItem(false);
    itemForm.reset(item);
  };

  const handleSaveItem = async (data: Partial<FAQItem>) => {
    if (editingItem) {
      updateItem.mutate({
        id: editingItem.id,
        data,
      }, {
        onSuccess: () => {
          setEditingItem(null);
          itemForm.reset();
        }
      });
    } else {
      createItem.mutate(data, {
        onSuccess: () => {
          setIsAddingItem(false);
          itemForm.reset();
        }
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      deleteItem.mutate(id);
    }
  };

  const handleCancelItemEdit = () => {
    setEditingItem(null);
    setIsAddingItem(false);
    itemForm.reset();
  };

  const getItemsByCategory = (categoryId: string) => {
    return items.filter((item: FAQItem) => item.categoryId === categoryId);
  };

  if (isLoading || isLoadingCategories || isLoadingItems) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configurações de Conteúdo</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} type="button">
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerField
                label="Cor de Fundo"
                value={form.watch('backgroundColor') || '#FFFFFF'}
                onChange={(color) => form.setValue('backgroundColor', color)}
              />

              <ColorPickerField
                label="Cor do Título da Categoria"
                value={form.watch('categoryTitleColor') || '#0466C8'}
                onChange={(color) => form.setValue('categoryTitleColor', color)}
              />

              <ColorPickerField
                label="Cor da Pergunta"
                value={form.watch('questionColor') || '#000000'}
                onChange={(color) => form.setValue('questionColor', color)}
              />

              <ColorPickerField
                label="Cor da Resposta"
                value={form.watch('answerColor') || '#374151'}
                onChange={(color) => form.setValue('answerColor', color)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Categorias de FAQ</CardTitle>
            <Button onClick={handleAddCategory} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(isAddingCategory || editingCategory) && (
            <form onSubmit={categoryForm.handleSubmit(handleSaveCategory)} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input id="name" {...categoryForm.register('name', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordem</Label>
                <Input id="order" type="number" {...categoryForm.register('order', { valueAsNumber: true, required: true })} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelCategoryEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {categories.map((category: FAQCategory) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getItemsByCategory(category.id).length} pergunta(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    >
                      {expandedCategory === category.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {expandedCategory === category.id && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-semibold">Perguntas</h5>
                      <Button size="sm" onClick={() => handleAddItem(category.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Pergunta
                      </Button>
                    </div>

                    {(isAddingItem && itemForm.watch('categoryId') === category.id) || (editingItem?.categoryId === category.id) ? (
                      <form onSubmit={itemForm.handleSubmit(handleSaveItem)} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="question">Pergunta</Label>
                          <Input id="question" {...itemForm.register('question', { required: true })} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="answer">Resposta</Label>
                          <Textarea id="answer" {...itemForm.register('answer', { required: true })} rows={3} />
                        </div>

                        <input type="hidden" {...itemForm.register('categoryId')} />

                        <div className="flex gap-2">
                          <Button type="submit" size="sm" disabled={createItem.isPending || updateItem.isPending}>
                            <Save className="h-4 w-4 mr-1" />
                            {editingItem ? 'Atualizar' : 'Criar'}
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={handleCancelItemEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    ) : null}

                    <div className="space-y-2">
                      {getItemsByCategory(category.id).map((item: FAQItem) => (
                        <div key={item.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium">{item.question}</p>
                            <p className="text-sm text-muted-foreground">{item.answer}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden p-6" style={{ backgroundColor: watchedValues.backgroundColor || '#FFFFFF' }}>
            <div className="space-y-8">
              {categories.filter((c: FAQCategory) => c.isActive).map((category: FAQCategory) => {
                const categoryItems = getItemsByCategory(category.id).filter((i: FAQItem) => i.isActive);
                return categoryItems.length > 0 ? (
                  <div key={category.id}>
                    <h2
                      className="text-2xl font-bold mb-4"
                      style={{ color: watchedValues.categoryTitleColor || '#0466C8' }}
                    >
                      {category.name}
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
                      {categoryItems.map((item: FAQItem) => (
                        <AccordionItem key={item.id} value={item.id}>
                          <AccordionTrigger
                            className="text-left"
                            style={{ color: watchedValues.questionColor || '#000000' }}
                          >
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent style={{ color: watchedValues.answerColor || '#374151' }}>
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
