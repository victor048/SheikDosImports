import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';

export function CategoryBar() {
  const { data: categories = [] } = useCategories();

  if (categories.length === 0) return null;

  return (
    <section className="overflow-x-auto bg-card py-4 scrollbar-hide">
      <div className="container">
        <div className="flex gap-4 md:justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className="flex flex-shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl md:h-16 md:w-16">
                {cat.icon || '📁'}
              </div>
              <span className="whitespace-nowrap text-xs font-medium text-foreground md:text-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
