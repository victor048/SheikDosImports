import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as localDb from '@/lib/localDb';

export type ProductWithRelations = localDb.LocalProduct & {
  images: localDb.LocalProductImage[];
  variations: (localDb.LocalProductVariation & {
    options: localDb.LocalVariationOption[];
  })[];
};

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: string;
  brand?: string;
  stock: number;
  is_featured?: boolean;
  is_on_sale?: boolean;
  is_active?: boolean;
  images: { url: string; alt?: string }[];
  variations: {
    name: string;
    type: 'color' | 'size' | 'other';
    options: { value: string; color_hex?: string; price_modifier?: number; stock?: number }[];
  }[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function useProducts(search?: string) {
  return useQuery({
    queryKey: ['products', search],
    queryFn: () => {
      if (search) {
        return localDb.getAllProductsWithRelations().filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      return localDb.getAllProductsWithRelations();
    },
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      if (isUuid) {
        return localDb.getProductWithRelations(idOrSlug);
      }
      return localDb.getProductWithRelationsBySlug(idOrSlug);
    },
    enabled: !!idOrSlug,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const product = localDb.createProduct({
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price || null,
        category_id: formData.category_id || null,
        brand: formData.brand || null,
        stock: formData.stock,
        is_featured: formData.is_featured ?? false,
        is_on_sale: formData.is_on_sale ?? false,
        is_active: formData.is_active ?? true,
        rating: 0,
        reviews_count: 0,
      });

      formData.images.forEach((img, index) => {
        localDb.createProductImage({
          product_id: product.id,
          url: img.url,
          alt: img.alt || null,
          position: index,
        });
      });

      formData.variations.forEach((variation) => {
        const v = localDb.createProductVariation({
          product_id: product.id,
          name: variation.name,
          type: variation.type,
        });

        variation.options.forEach((opt) => {
          localDb.createVariationOption({
            variation_id: v.id,
            value: opt.value,
            color_hex: opt.color_hex || null,
            price_modifier: opt.price_modifier || null,
            stock: opt.stock || null,
          });
        });
      });

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: ProductFormData }) => {
      localDb.updateProduct(id, {
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price || null,
        category_id: formData.category_id || null,
        brand: formData.brand || null,
        stock: formData.stock,
        is_featured: formData.is_featured ?? false,
        is_on_sale: formData.is_on_sale ?? false,
        is_active: formData.is_active ?? true,
      });

      const oldImages = localDb.getProductImages(id);
      oldImages.forEach((img) => localDb.deleteProductImage(img.id));
      formData.images.forEach((img, index) => {
        localDb.createProductImage({
          product_id: id,
          url: img.url,
          alt: img.alt || null,
          position: index,
        });
      });

      const oldVariations = localDb.getProductVariations(id);
      oldVariations.forEach((v) => {
        const opts = localDb.getVariationOptions(v.id);
        opts.forEach((opt) => localDb.deleteVariationOption(opt.id));
        localDb.deleteProductVariation(v.id);
      });

      formData.variations.forEach((variation) => {
        const v = localDb.createProductVariation({
          product_id: id,
          name: variation.name,
          type: variation.type,
        });
        variation.options.forEach((opt) => {
          localDb.createVariationOption({
            variation_id: v.id,
            value: opt.value,
            color_hex: opt.color_hex || null,
            price_modifier: opt.price_modifier || null,
            stock: opt.stock || null,
          });
        });
      });

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      localDb.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
