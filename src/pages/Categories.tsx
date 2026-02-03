import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { categories } from '@/data/mockData';

const Categories = () => {
  return (
    <Layout>
      <div className="container py-4">
        <h1 className="mb-6 text-xl font-bold md:text-2xl">Categorias</h1>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl mx-auto">
                {cat.icon}
              </div>
              <h2 className="mb-2 text-center font-semibold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h2>
              {cat.subcategories && (
                <ul className="space-y-1">
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <li key={sub.id} className="text-center text-xs text-muted-foreground">
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
