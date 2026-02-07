import { fetchProducts, fetchCategories } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const sort = resolvedSearchParams.sort;
  const q = resolvedSearchParams.q || '';
  
  const [products, categories] = await Promise.all([
    fetchProducts(`category=${category || ''}&sort=${sort || ''}&q=${q}`),
    fetchCategories()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins mb-2">Collection</h1>
          <p className="text-text-secondary text-sm">Découvrez nos pièces uniques sélectionnées pour vous.</p>
        </div>

        {/* Search Bar */}
        <form action="/products" method="GET" className="relative w-full md:w-80 group">
          <label htmlFor="search" className="sr-only">Rechercher</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            name="q"
            id="search"
            defaultValue={q}
            placeholder="Rechercher un produit..."
            className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          {category && <input type="hidden" name="category" value={category} />}
        </form>
      </div>

      {/* Dynamic Filters */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar border-b">
            <a 
              href="/products"
              className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
                 !category 
                 ? 'bg-primary text-white border-primary' 
                 : 'bg-white text-text-secondary border-gray-200 hover:border-primary'
              }`}
            >
                Tout
            </a>
            {categories.map((cat: any) => (
               <a 
                 key={cat.id} 
                 href={`/products?category=${cat.slug}`}
                 className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
                    category === cat.slug 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-text-secondary border-gray-200 hover:border-primary'
                 }`}
               >
                   {cat.name_fr}
               </a>
            ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      
      {products.length === 0 && (
          <div className="text-center py-20">
              <p className="text-lg text-text-secondary">Aucun produit trouvé.</p>
              <a href="/products" className="text-primary hover:underline mt-4 inline-block">Voir tous les produits</a>
          </div>
      )}
    </div>
  );
}
