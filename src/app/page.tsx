import { fetchProducts } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
    let products = [];
    try {
        products = await fetchProducts();
    } catch (e) {
        console.error("Failed to load products", e);
    }

    // Display only first 8-12 products (Featured)
    const featuredProducts = products.slice(0, 8);

    return <HomeClient products={products} featuredProducts={featuredProducts} />;
}

