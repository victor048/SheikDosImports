import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Upload, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductFormData, ProductWithRelations } from '@/hooks/useProducts';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: ProductWithRelations | null;
  isLoading?: boolean;
}

const defaultFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  original_price: undefined,
  category_id: '',
  brand: '',
  stock: 0,
  is_featured: false,
  is_on_sale: false,
  is_active: true,
  images: [],
  variations: [],
};

export function ProductForm({ open, onOpenChange, onSubmit, initialData, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (initialData) {
      return {
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || '',
        price: initialData.price,
        original_price: initialData.original_price || undefined,
        category_id: initialData.category_id || '',
        brand: initialData.brand || '',
        stock: initialData.stock || 0,
        is_featured: initialData.is_featured ?? false,
        is_on_sale: initialData.is_on_sale ?? false,
        is_active: initialData.is_active ?? true,
        images: initialData.product_images?.map((img) => ({ url: img.url, alt: img.alt || '' })) || [],
        variations: initialData.product_variations?.map((v) => ({
          name: v.name,
          type: v.type as 'color' | 'size' | 'other',
          options: v.variation_options?.map((opt) => ({
            value: opt.value,
            color_hex: opt.color_hex || '',
            price_modifier: opt.price_modifier || undefined,
            stock: opt.stock || undefined,
          })) || [],
        })) || [],
      };
    }
    return defaultFormData;
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { url: newImageUrl.trim(), alt: '' }],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Formato invalido: ${file.name}`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`Arquivo muito grande: ${file.name} (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: base64, alt: file.name }],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        { name: '', type: 'other' as const, options: [] },
      ],
    }));
  };

  const handleRemoveVariation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const handleVariationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleAddVariationOption = (variationIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === variationIndex
          ? { ...v, options: [...v.options, { value: '', color_hex: '', price_modifier: undefined, stock: undefined }] }
          : v
      ),
    }));
  };

  const handleVariationOptionChange = (
    variationIndex: number,
    optionIndex: number,
    field: string,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === variationIndex
          ? {
              ...v,
              options: v.options.map((opt, j) =>
                j === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : v
      ),
    }));
  };

  const handleRemoveVariationOption = (variationIndex: number, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === variationIndex
          ? { ...v, options: v.options.filter((_, j) => j !== optionIndex) }
          : v
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="gerado-automaticamente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preco (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original_price">Preco original (R$)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    original_price: e.target.value ? parseFloat(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Estoque *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Categoria</Label>
            <Select
              value={formData.category_id || ''}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cat-eletronicos">📱 Eletronicos</SelectItem>
                <SelectItem value="cat-relogios">⌚ Relogios</SelectItem>
                <SelectItem value="cat-perfumes">🧴 Perfumes</SelectItem>
                <SelectItem value="cat-acessorios">💍 Acessorios</SelectItem>
                <SelectItem value="cat-tenis">👟 Tenis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Destaque</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_on_sale"
                checked={formData.is_on_sale}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_on_sale: checked }))}
              />
              <Label htmlFor="is_on_sale">Em promocao</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagens</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL da imagem"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Anexar imagem do dispositivo
              </Button>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={img.url}
                      alt={img.alt || `Imagem ${index + 1}`}
                      className="h-20 w-full rounded-md border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-1.5 -top-1.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Variacoes</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariation}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar
              </Button>
            </div>

            {formData.variations.map((variation, vIndex) => (
              <div key={vIndex} className="rounded-md border p-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={variation.name}
                    onChange={(e) => handleVariationChange(vIndex, 'name', e.target.value)}
                    placeholder="Nome (ex: Cor, Tamanho)"
                  />
                  <Select
                    value={variation.type}
                    onValueChange={(value) => handleVariationChange(vIndex, 'type', value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Cor</SelectItem>
                      <SelectItem value="size">Tamanho</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVariation(vIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-1">
                  {variation.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <Input
                        value={opt.value}
                        onChange={(e) => handleVariationOptionChange(vIndex, oIndex, 'value', e.target.value)}
                        placeholder="Valor"
                      />
                      {variation.type === 'color' && (
                        <Input
                          type="color"
                          className="w-12 h-9 p-1"
                          value={opt.color_hex || '#000000'}
                          onChange={(e) => handleVariationOptionChange(vIndex, oIndex, 'color_hex', e.target.value)}
                        />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVariationOption(vIndex, oIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddVariationOption(vIndex)}
                  >
                    <Plus className="mr-1 h-3 w-3" /> Opcao
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : initialData ? 'Salvar alteracoes' : 'Criar produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
