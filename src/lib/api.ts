// On utilise une URL relative pour passer par le proxy Next.js (rewrites)
// Cela permet de gérer les cookies comme étant "Same-Site"
export const API_URL = '/api';

export async function fetchProducts(params?: string) {
    const res = await fetch(`${API_URL}/products?${params || ''}`, {
        cache: 'no-store' // Dynamic data
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function fetchProduct(id: string) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        cache: 'no-store' 
    });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch product');
    }
    return res.json();
}

export async function fetchCategories() {
    const res = await fetch(`${API_URL}/products/categories`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function createOrder(orderData: any) {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg || 'Failed to create order');
    }
    
    return res.json();
}
