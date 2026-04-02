import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  useHeroSlidesAdmin,
  useCreateHeroSlide,
  useUpdateHeroSlide,
  useDeleteHeroSlide,
  useLandingSettings,
  useUpdateLandingSettings
} from '@/hooks/useLanding';
import { HeroConfig, defaultHeroConfig } from '@/types/landing-config';
import { ColorPickerField } from '@/components/admin/ColorPickerField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { HeroSection } from '@/components/sections/HeroSection';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

const HERO_DEFAULT_COLOR = '#6E59A5';

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundType: 'image' | 'color';
  backgroundValue: string;
  textColor: string;
  overlayColor: string;
  overlayOpacity: number;
  buttonText?: string;
  buttonColor?: string;
  buttonUrl?: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showDescription: boolean;
  showButton: boolean;
  showRating: boolean;
  order: number;
  isActive: boolean;
}

interface SlideFormData {
  title: string;
  subtitle: string;
  description: string;
  backgroundType: 'image' | 'color';
  backgroundValue: string;
  textColor: string;
  overlayColor: string;
  overlayOpacity: number;
  buttonText: string;
  buttonColor: string;
  buttonUrl: string;
  buttonIcon: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showDescription: boolean;
  showButton: boolean;
  showRating: boolean;
  isActive: boolean;
}

const defaultSlideData: SlideFormData = {
  title: '',
  subtitle: '',
  description: '',
  backgroundType: 'image',
  backgroundValue: '',
  textColor: '#FFFFFF',
  overlayColor: HERO_DEFAULT_COLOR,
  overlayOpacity: 0.6,
  buttonText: 'AGENDAMENTO ONLINE',
  buttonColor: '#0466C8',
  buttonUrl: '#',
  buttonIcon: '',
  showTitle: true,
  showSubtitle: true,
  showDescription: true,
  showButton: true,
  showRating: true,
  isActive: true,
};

export const HeroCustomizer = () => {
  const { data: settingsData, isLoading: settingsLoading } = useLandingSettings('hero');
  const { data: slides, isLoading: slidesLoading } = useHeroSlidesAdmin();
  const updateSettings = useUpdateLandingSettings();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();

  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingForms, setEditingForms] = useState<Record<string, SlideFormData>>({});

  const config = settingsData?.config || defaultHeroConfig;

  const settingsForm = useForm<HeroConfig>({
    defaultValues: config,
    values: config,
  });

  const onSettingsSubmit = (data: HeroConfig) => {
    // Validar e formatar altura: adicionar 'px' se apenas números forem fornecidos
    let formattedHeight = data.height;
    if (formattedHeight && /^\d+$/.test(formattedHeight)) {
      formattedHeight = `${formattedHeight}px`;
    }

    updateSettings.mutate(
      { section: 'hero', config: { ...data, height: formattedHeight } },
      {
        onSuccess: () => {
          toast.success('Configurações do Hero salvas com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao salvar configurações');
        },
      }
    );
  };

  const handleResetSettings = () => {
    settingsForm.reset(defaultHeroConfig);
    toast.success('Configurações resetadas para o padrão');
  };

  const toggleSlideExpand = (slideId: string) => {
    if (expandedSlideId === slideId) {
      setExpandedSlideId(null);
      // Limpar form do slide ao fechar
      setEditingForms(prev => {
        const newForms = { ...prev };
        delete newForms[slideId];
        return newForms;
      });
    } else {
      const slide = slides?.find((s: HeroSlide) => s.id === slideId);
      if (slide) {
        setEditingForms(prev => ({
          ...prev,
          [slideId]: {
            title: slide.title || '',
            subtitle: slide.subtitle || '',
            description: slide.description || '',
            backgroundType: slide.backgroundType === 'image' ? 'image' : 'color',
            backgroundValue:
              slide.backgroundType === 'image'
                ? slide.backgroundValue || ''
                : slide.backgroundType === 'color'
                  ? slide.backgroundValue || HERO_DEFAULT_COLOR
                  : slide.overlayColor || HERO_DEFAULT_COLOR,
            textColor: slide.textColor || '#FFFFFF',
            overlayColor: slide.overlayColor || HERO_DEFAULT_COLOR,
            overlayOpacity: slide.overlayOpacity ?? 0.6,
            buttonText: slide.buttonText || 'AGENDAMENTO ONLINE',
            buttonColor: slide.buttonColor || '#0466C8',
            buttonUrl: slide.buttonUrl || '#',
            buttonIcon: slide.buttonIcon || '',
            showTitle: slide.showTitle ?? true,
            showSubtitle: slide.showSubtitle ?? true,
            showDescription: slide.showDescription ?? true,
            showButton: slide.showButton ?? true,
            showRating: slide.showRating ?? true,
            isActive: slide.isActive ?? true,
          },
        }));
      }
      setExpandedSlideId(slideId);
      setIsCreatingNew(false);
    }
  };

  const handleAddNewSlide = () => {
    setIsCreatingNew(!isCreatingNew);
    setExpandedSlideId(null);
  };

  const updateFormField = (slideId: string, field: keyof SlideFormData, value: any) => {
    setEditingForms(prev => ({
      ...prev,
      [slideId]: {
        ...(prev[slideId] || defaultSlideData),
        [field]: value,
      },
    }));
  };

  const changeBackgroundType = (slideId: string, newType: 'image' | 'color') => {
    const defaultValues = {
      image: '',
      color: HERO_DEFAULT_COLOR,
    };

    setEditingForms(prev => ({
      ...prev,
      [slideId]: {
        ...(prev[slideId] || defaultSlideData),
        backgroundType: newType,
        backgroundValue: defaultValues[newType],
      },
    }));
  };

  const handleSaveSlide = (slideId: string) => {
    const formData = editingForms[slideId];
    if (!formData) return;

    updateSlide.mutate(
      { id: slideId, data: formData },
      {
        onSuccess: () => {
          setExpandedSlideId(null);
          setEditingForms(prev => {
            const newForms = { ...prev };
            delete newForms[slideId];
            return newForms;
          });
          toast.success('Slide atualizado com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao atualizar slide');
        },
      }
    );
  };

  const handleCancelEdit = (slideId: string) => {
    setExpandedSlideId(null);
    setEditingForms(prev => {
      const newForms = { ...prev };
      delete newForms[slideId];
      return newForms;
    });
  };

  const handleCreateSlide = (formData: SlideFormData) => {
    const order = slides ? slides.length : 0;
    createSlide.mutate(
      { ...formData, order },
      {
        onSuccess: () => {
          setIsCreatingNew(false);
          setEditingForms({});
          toast.success('Slide criado com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao criar slide');
        },
      }
    );
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este slide?')) {
      deleteSlide.mutate(id, {
        onSuccess: () => {
          toast.success('Slide deletado com sucesso!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao deletar slide');
        },
      });
    }
  };

  const renderSlideForm = (slideId: string, formData: SlideFormData) => (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Título e Subtítulo em grid 2 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`slide-title-${slideId}`}>Título</Label>
          <Input
            id={`slide-title-${slideId}`}
            value={formData.title}
            onChange={(e) => updateFormField(slideId, 'title', e.target.value)}
            placeholder="Refúgio dos seus sonhos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`slide-subtitle-${slideId}`}>Subtítulo</Label>
          <Input
            id={`slide-subtitle-${slideId}`}
            value={formData.subtitle}
            onChange={(e) => updateFormField(slideId, 'subtitle', e.target.value)}
            placeholder="O refúgio perfeito para se desconectar"
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor={`slide-description-${slideId}`}>Descrição</Label>
        <Textarea
          id={`slide-description-${slideId}`}
          value={formData.description}
          onChange={(e) => updateFormField(slideId, 'description', e.target.value)}
          placeholder="Desfrute de uma estadia inesquecível..."
          rows={3}
        />
      </div>

      {/* Tipo de Fundo */}
      <div className="space-y-2">
        <Label>Tipo de Fundo</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="image"
              checked={formData.backgroundType === 'image'}
              onChange={() => changeBackgroundType(slideId, 'image')}
            />
            Imagem
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="color"
              checked={formData.backgroundType === 'color'}
              onChange={() => changeBackgroundType(slideId, 'color')}
            />
            Cor Sólida
          </label>
        </div>
      </div>

      {/* Background Value */}
      {formData.backgroundType === 'image' ? (
        <div className="space-y-2">
          <Label>Imagem de Fundo</Label>
          <ImageUploader
            category="LANDING_HERO"
            value={formData.backgroundValue || ''}
            onChange={(url) => updateFormField(slideId, 'backgroundValue', url)}
          />
        </div>
      ) : formData.backgroundType === 'color' ? (
        <ColorPickerField
          label="Cor de Fundo"
          value={formData.backgroundValue || HERO_DEFAULT_COLOR}
          onChange={(color) => updateFormField(slideId, 'backgroundValue', color)}
        />
      ) : null}

      {/* Cor do Texto */}
      <ColorPickerField
        label="Cor do Texto"
        value={formData.textColor || '#FFFFFF'}
        onChange={(color) => updateFormField(slideId, 'textColor', color)}
      />

      {/* Overlay */}
      <div className="space-y-4 pt-4 border-t">
        <Label>Overlay da Imagem</Label>
        <ColorPickerField
          label="Cor do Overlay"
          value={formData.overlayColor || HERO_DEFAULT_COLOR}
          onChange={(color) => updateFormField(slideId, 'overlayColor', color)}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`overlayOpacity-${slideId}`}>Opacidade do Overlay</Label>
            <span className="text-sm text-muted-foreground">{Math.round((formData.overlayOpacity ?? 0.6) * 100)}%</span>
          </div>
          <input
            id={`overlayOpacity-${slideId}`}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={formData.overlayOpacity ?? 0.6}
            onChange={(e) => updateFormField(slideId, 'overlayOpacity', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Botão */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`buttonText-${slideId}`}>Texto do Botão</Label>
          <Input
            id={`buttonText-${slideId}`}
            value={formData.buttonText}
            onChange={(e) => updateFormField(slideId, 'buttonText', e.target.value)}
            placeholder="AGENDAMENTO ONLINE"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`buttonUrl-${slideId}`}>Link do Botão</Label>
          <Input
            id={`buttonUrl-${slideId}`}
            value={formData.buttonUrl}
            onChange={(e) => updateFormField(slideId, 'buttonUrl', e.target.value)}
            placeholder="/reservas"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorPickerField
          label="Cor do Botão"
          value={formData.buttonColor || '#0466C8'}
          onChange={(color) => updateFormField(slideId, 'buttonColor', color)}
        />
        <div className="space-y-2">
          <Label htmlFor={`buttonIcon-${slideId}`}>Ícone do Botão (opcional)</Label>
          <select
            id={`buttonIcon-${slideId}`}
            value={formData.buttonIcon || ''}
            onChange={(e) => updateFormField(slideId, 'buttonIcon', e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Nenhum</option>
            <option value="calendar">📅 Calendário</option>
            <option value="arrow-right">→ Seta Direita</option>
            <option value="check">✓ Check</option>
            <option value="star">⭐ Estrela</option>
            <option value="heart">❤️ Coração</option>
            <option value="phone">📞 Telefone</option>
            <option value="mail">✉️ Email</option>
            <option value="user">👤 Usuário</option>
            <option value="home">🏠 Casa</option>
            <option value="search">🔍 Buscar</option>
          </select>
        </div>
      </div>

      {/* Visibilidade dos Elementos */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Elementos Visíveis</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <Label htmlFor={`showTitle-${slideId}`} className="font-normal">Mostrar Título</Label>
            <Switch
              id={`showTitle-${slideId}`}
              checked={formData.showTitle ?? true}
              onCheckedChange={(checked) => updateFormField(slideId, 'showTitle', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <Label htmlFor={`showSubtitle-${slideId}`} className="font-normal">Mostrar Subtítulo</Label>
            <Switch
              id={`showSubtitle-${slideId}`}
              checked={formData.showSubtitle ?? true}
              onCheckedChange={(checked) => updateFormField(slideId, 'showSubtitle', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <Label htmlFor={`showDescription-${slideId}`} className="font-normal">Mostrar Descrição</Label>
            <Switch
              id={`showDescription-${slideId}`}
              checked={formData.showDescription ?? true}
              onCheckedChange={(checked) => updateFormField(slideId, 'showDescription', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <Label htmlFor={`showButton-${slideId}`} className="font-normal">Mostrar Botão</Label>
            <Switch
              id={`showButton-${slideId}`}
              checked={formData.showButton ?? true}
              onCheckedChange={(checked) => updateFormField(slideId, 'showButton', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <Label htmlFor={`showRating-${slideId}`} className="font-normal">Mostrar Avaliações</Label>
            <Switch
              id={`showRating-${slideId}`}
              checked={formData.showRating ?? true}
              onCheckedChange={(checked) => updateFormField(slideId, 'showRating', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <Label htmlFor={`isActive-${slideId}`} className="font-normal">Slide Ativo</Label>
            <Switch
              id={`isActive-${slideId}`}
              checked={formData.isActive ?? true}
              onCheckedChange={(checked) => updateFormField(slideId, 'isActive', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleCancelEdit(slideId)}
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => handleSaveSlide(slideId)}
          disabled={updateSlide.isPending}
          size="sm"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSlide.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );

  const renderNewSlideForm = () => {
    const formData = editingForms['new'] || defaultSlideData;

    return (
      <div className="border rounded-lg p-4 space-y-4 bg-blue-50">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg">Novo Slide</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsCreatingNew(false);
              setEditingForms(prev => {
                const newForms = { ...prev };
                delete newForms['new'];
                return newForms;
              });
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 p-4 bg-white rounded-lg">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="new-slide-title">Título</Label>
            <Input
              id="new-slide-title"
              value={formData.title}
              onChange={(e) => updateFormField('new', 'title', e.target.value)}
              placeholder="Refúgio dos seus sonhos"
            />
          </div>

          {/* Subtítulo */}
          <div className="space-y-2">
            <Label htmlFor="new-slide-subtitle">Subtítulo</Label>
            <Input
              id="new-slide-subtitle"
              value={formData.subtitle}
              onChange={(e) => updateFormField('new', 'subtitle', e.target.value)}
              placeholder="O refúgio perfeito para se desconectar"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="new-slide-description">Descrição</Label>
            <Textarea
              id="new-slide-description"
              value={formData.description}
              onChange={(e) => updateFormField('new', 'description', e.target.value)}
              placeholder="Desfrute de uma estadia inesquecível..."
              rows={3}
            />
          </div>

          {/* Tipo de Fundo */}
          <div className="space-y-2">
            <Label>Tipo de Fundo</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="image"
                  checked={formData.backgroundType === 'image'}
                  onChange={() => changeBackgroundType('new', 'image')}
                />
                Imagem
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="color"
                  checked={formData.backgroundType === 'color'}
                  onChange={() => changeBackgroundType('new', 'color')}
                />
                Cor Sólida
              </label>
            </div>
          </div>

          {/* Background Value */}
          {formData.backgroundType === 'image' ? (
            <div className="space-y-2">
              <Label>Imagem de Fundo</Label>
              <ImageUploader
                category="LANDING_HERO"
                value={formData.backgroundValue || ''}
                onChange={(url) => updateFormField('new', 'backgroundValue', url)}
              />
            </div>
          ) : formData.backgroundType === 'color' ? (
            <ColorPickerField
              label="Cor de Fundo"
              value={formData.backgroundValue || HERO_DEFAULT_COLOR}
              onChange={(color) => updateFormField('new', 'backgroundValue', color)}
            />
          ) : null}

          {/* Cor do Texto */}
          <ColorPickerField
            label="Cor do Texto"
            value={formData.textColor || '#FFFFFF'}
            onChange={(color) => updateFormField('new', 'textColor', color)}
          />

          {/* Overlay */}
          <div className="space-y-4 pt-4 border-t">
            <Label>Overlay da Imagem</Label>
            <ColorPickerField
              label="Cor do Overlay"
              value={formData.overlayColor || HERO_DEFAULT_COLOR}
              onChange={(color) => updateFormField('new', 'overlayColor', color)}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-overlayOpacity">Opacidade do Overlay</Label>
                <span className="text-sm text-muted-foreground">{Math.round((formData.overlayOpacity ?? 0.6) * 100)}%</span>
              </div>
              <input
                id="new-overlayOpacity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.overlayOpacity ?? 0.6}
                onChange={(e) => updateFormField('new', 'overlayOpacity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Botão */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-buttonText">Texto do Botão</Label>
              <Input
                id="new-buttonText"
                value={formData.buttonText}
                onChange={(e) => updateFormField('new', 'buttonText', e.target.value)}
                placeholder="AGENDAMENTO ONLINE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-buttonUrl">Link do Botão</Label>
              <Input
                id="new-buttonUrl"
                value={formData.buttonUrl}
                onChange={(e) => updateFormField('new', 'buttonUrl', e.target.value)}
                placeholder="/reservas"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorPickerField
              label="Cor do Botão"
              value={formData.buttonColor || '#0466C8'}
              onChange={(color) => updateFormField('new', 'buttonColor', color)}
            />
            <div className="space-y-2">
              <Label htmlFor="new-buttonIcon">Ícone do Botão (opcional)</Label>
              <select
                id="new-buttonIcon"
                value={formData.buttonIcon || ''}
                onChange={(e) => updateFormField('new', 'buttonIcon', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Nenhum</option>
                <option value="calendar">📅 Calendário</option>
                <option value="arrow-right">→ Seta Direita</option>
                <option value="check">✓ Check</option>
                <option value="star">⭐ Estrela</option>
                <option value="heart">❤️ Coração</option>
                <option value="phone">📞 Telefone</option>
                <option value="mail">✉️ Email</option>
                <option value="user">👤 Usuário</option>
                <option value="home">🏠 Casa</option>
                <option value="search">🔍 Buscar</option>
              </select>
            </div>
          </div>

          {/* Visibilidade dos Elementos */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Elementos Visíveis</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-showTitle" className="font-normal">Mostrar Título</Label>
                <Switch
                  id="new-showTitle"
                  checked={formData.showTitle ?? true}
                  onCheckedChange={(checked) => updateFormField('new', 'showTitle', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-showSubtitle" className="font-normal">Mostrar Subtítulo</Label>
                <Switch
                  id="new-showSubtitle"
                  checked={formData.showSubtitle ?? true}
                  onCheckedChange={(checked) => updateFormField('new', 'showSubtitle', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-showDescription" className="font-normal">Mostrar Descrição</Label>
                <Switch
                  id="new-showDescription"
                  checked={formData.showDescription ?? true}
                  onCheckedChange={(checked) => updateFormField('new', 'showDescription', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-showButton" className="font-normal">Mostrar Botão</Label>
                <Switch
                  id="new-showButton"
                  checked={formData.showButton ?? true}
                  onCheckedChange={(checked) => updateFormField('new', 'showButton', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-showRating" className="font-normal">Mostrar Avaliações</Label>
                <Switch
                  id="new-showRating"
                  checked={formData.showRating ?? true}
                  onCheckedChange={(checked) => updateFormField('new', 'showRating', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-isActive" className="font-normal">Slide Ativo</Label>
                <Switch
                  id="new-isActive"
                  checked={formData.isActive ?? true}
                  onCheckedChange={(checked) => updateFormField('new', 'isActive', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsCreatingNew(false);
              setEditingForms(prev => {
                const newForms = { ...prev };
                delete newForms['new'];
                return newForms;
              });
            }}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => handleCreateSlide(formData)}
            disabled={createSlide.isPending}
          >
            {createSlide.isPending ? 'Criando...' : 'Criar Slide'}
          </Button>
        </div>
      </div>
    );
  };

  if (settingsLoading || slidesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de Slides */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Slides do Hero</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie os slides do carrossel principal
              </p>
            </div>
            <Button onClick={handleAddNewSlide}>
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingNew ? 'Cancelar' : 'Adicionar Slide'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Formulário de novo slide */}
            {isCreatingNew && renderNewSlideForm()}

            {/* Lista de slides existentes */}
            {slides && slides.length > 0 ? (
              slides.map((slide: HeroSlide) => (
                <div key={slide.id} className="border rounded-lg bg-white">
                  {/* Header do slide - sempre visível */}
                  <div className="flex items-center gap-4 p-4">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{slide.title}</h4>
                      {slide.subtitle && (
                        <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!slide.isActive && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inativo</span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSlideExpand(slide.id)}
                      >
                        {expandedSlideId === slide.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSlide(slide.id)}
                        disabled={deleteSlide.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Formulário expandido - só visível quando expandido */}
                  {expandedSlideId === slide.id && editingForms[slide.id] && (
                    <div className="border-t">
                      {renderSlideForm(slide.id, editingForms[slide.id])}
                    </div>
                  )}
                </div>
              ))
            ) : (
              !isCreatingNew && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum slide criado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar Slide" para começar.</p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Carrossel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configurações do Carrossel</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetSettings}
              type="button"
            >
              Resetar para Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autoplaySpeed">Velocidade do Autoplay (segundos)</Label>
              <Input
                id="autoplaySpeed"
                type="number"
                min="1"
                max="30"
                {...settingsForm.register('autoplaySpeed', { valueAsNumber: true })}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura Universal dos Slides</Label>
              <Input
                id="height"
                {...settingsForm.register('height')}
                placeholder="700px"
              />
              <p className="text-xs text-muted-foreground">
                Esta altura será aplicada a TODOS os slides. Exemplos: 500px, 700px, 100vh (altura da tela), 50vh (metade da tela)
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview da seção */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualização em tempo real do Hero com todos os slides
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <HeroSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
