import { useQuery } from '@tanstack/react-query';
import * as localDb from '@/lib/localDb';

export type CategoryWithSubcategories = localDb.LocalCategory & {
  subcategories?: localDb.LocalCategory[];
};

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => localDb.getAllCategoriesWithSubcategories(),
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => localDb.getAllBrands(),
  });
}
