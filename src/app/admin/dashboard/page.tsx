"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Package, Users, AlertCircle, PhoneCall, Check, Truck, X, Eye, FileText, History, Plus, Edit, Trash2, Search } from 'lucide-react';

// Types
type Order = {
    id: number;
    customer_name: string;
    customer_phone: string;
    wilaya: string;
    address: string;
    status: string;
    total_price: string;
    created_at: string;
    admin_note: string;
    items?: any[];
    history?: any[];
};

type Product = {
    id?: number;
    category_id: number;
    name_fr: string;
    name_ar: string;
    description_fr: string;
    description_ar: string;
    price: number;
    image_urls: string[];
    sizes: string[];
    colors: string[];
    is_active: boolean;
    stock_quantity: number;
    variations?: any[];
};

type Category = {
    id: number;
    name_fr: string;
    name_ar: string;
    slug: string;
};

export default function AdminDashboard() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState<'orders' | 'products'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [stockLogs, setStockLogs] = useState<any[]>([]);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [noteBuffer, setNoteBuffer] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [variationStocks, setVariationStocks] = useState<any[]>([]);

    useEffect(() => {
        if (currentTab === 'orders') {
            fetchOrders();
        } else {
            fetchProducts();
            fetchCategories();
        }
    }, [router, currentTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
                credentials: 'include'
            });
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, {
                credentials: 'include'
            });
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/categories`, {
                credentials: 'include'
            });
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStockLogs = async (productId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${productId}/stock-logs`, {
                credentials: 'include'
            });
            const data = await res.json();
            setStockLogs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrderDetails = async (id: number) => {
        setModalLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}`, {
                credentials: 'include'
            });
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setSelectedOrder(data);
            setNoteBuffer(data.admin_note || '');
        } catch (err) {
            console.error(err);
        } finally {
            setModalLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        if (!confirm(`Changer le statut vers ${newStatus} ?`)) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });
            
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }

            if (!res.ok) {
                const err = await res.json();
                alert(err.msg || 'Erreur');
                return;
            }

            fetchOrders(); // Refresh list
            if (selectedOrder) fetchOrderDetails(id); // Refresh modal if open
        } catch (err) {
            alert('Erreur réseau');
        }
    };

    const saveNote = async () => {
        if (!selectedOrder) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${selectedOrder.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ admin_note: noteBuffer }),
                credentials: 'include'
            });
            alert('Note sauvegardée');
            fetchOrders();
        } catch (err) {
            alert('Erreur réseau');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            router.push('/admin/login');
        } catch (err) {
            console.error(err);
            router.push('/admin/login');
        }
    };

    const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const productData = {
            name_fr: formData.get('name_fr'),
            name_ar: formData.get('name_ar'),
            description_fr: formData.get('description_fr'),
            description_ar: formData.get('description_ar'),
            price: Number(formData.get('price')),
            stock_quantity: Number(formData.get('stock_quantity')),
            image_urls: formData.get('image_urls')?.toString().split(',').map(s => s.trim()) || [],
            sizes: formData.get('sizes')?.toString().split(',').map(s => s.trim()) || [],
            colors: formData.get('colors')?.toString().split(',').map(s => s.trim()) || [],
            is_active: formData.get('is_active') === 'on',
            category_id: isNewCategory ? null : Number(formData.get('category_id')),
            category_name_fr: isNewCategory ? formData.get('category_name_fr') : undefined,
            category_name_ar: isNewCategory ? formData.get('category_name_ar') : undefined,
            variations: variationStocks
        };

        try {
            const url = editingProduct 
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${editingProduct.id}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`;
            
            const res = await fetch(url, {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to save product');

            setIsProductModalOpen(false);
            setEditingProduct(null);
            setIsNewCategory(false);
            fetchProducts();
            fetchCategories(); // Refresh categories list
        } catch (err) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete product');
            fetchProducts();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            pending_confirmation: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        const labels: Record<string, string> = {
            pending_confirmation: 'En Attente',
            confirmed: 'Confirmée',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            cancelled: 'Annulée',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    useEffect(() => {
        if (isProductModalOpen) {
            if (editingProduct) {
                setVariationStocks(editingProduct.variations || []);
            } else {
                setVariationStocks([]);
            }
        }
    }, [isProductModalOpen, editingProduct]);

    const generateVariations = (sizesStr: string, colorsStr: string) => {
        const sizesList = sizesStr.split(',').map(s => s.trim()).filter(s => s !== '');
        const colorsList = colorsStr.split(',').map(c => c.trim()).filter(c => c !== '');
        
        const newVariations: any[] = [];
        sizesList.forEach(size => {
            colorsList.forEach(color => {
                const existing = variationStocks.find(v => v.size === size && v.color === color);
                newVariations.push({
                    size,
                    color,
                    stock_quantity: existing ? existing.stock_quantity : 0
                });
            });
        });
        
        setVariationStocks(newVariations);
    };

    const addVariation = () => {
        setVariationStocks([...variationStocks, { size: '', color: '', stock_quantity: 0 }]);
    };

    const removeVariation = (index: number) => {
        const newVars = [...variationStocks];
        newVars.splice(index, 1);
        setVariationStocks(newVars);
    };

    const filteredOrders = orders
        .filter(o => filter === 'all' || o.status === filter)
        .filter(o => 
            o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            o.customer_phone.includes(searchTerm) ||
            o.id.toString().includes(searchTerm)
        );

    const filteredProducts = products.filter(p => 
        p.name_fr.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.name_ar.toLowerCase().includes(productSearch.toLowerCase())
    );

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-bold font-poppins">Admin Dashboard</h1>
                        <nav className="flex gap-4">
                            <button 
                                onClick={() => setCurrentTab('orders')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'orders' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Commandes
                            </button>
                            <button 
                                onClick={() => setCurrentTab('products')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'products' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Produits
                            </button>
                        </nav>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-sm text-red-600 font-medium hover:underline"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="container mx-auto p-4 py-8">
                {currentTab === 'orders' ? (
                    <>
                        {/* Stats Cards Orders */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Total Commandes</h3>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">À Confirmer</h3>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {orders.filter(o => o.status === 'pending_confirmation').length}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Expédiées</h3>
                                <p className="text-2xl font-bold text-purple-600">
                                    {orders.filter(o => o.status === 'shipped').length}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Revenu (Est.)</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatPrice(orders.reduce((acc, o) => acc + Number(o.total_price), 0))}
                                </p>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="font-bold text-lg">Commandes</h2>
                                <select 
                                    className="bg-white border rounded-lg px-3 py-1 text-sm outline-none"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="pending_confirmation">En Attente</option>
                                    <option value="confirmed">Confirmée</option>
                                    <option value="shipped">Expédiée</option>
                                </select>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                        <tr>
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Wilaya</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Statut</th>
                                            <th className="p-4">Détail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-mono text-gray-400">#{order.id}</td>
                                                <td className="p-4">
                                                    <div className="font-medium text-text-primary">{order.customer_name}</div>
                                                    <div className="text-xs text-text-secondary flex items-center gap-1">
                                                        <PhoneCall className="w-3 h-3" /> {order.customer_phone}
                                                    </div>
                                                    {order.admin_note && (
                                                        <div className="mt-1 text-xs text-yellow-600 flex items-center gap-1">
                                                            <FileText className="w-3 h-3" /> Note existe
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">{order.wilaya}</td>
                                                <td className="p-4 font-bold">{formatPrice(Number(order.total_price))}</td>
                                                <td className="p-4"><StatusBadge status={order.status} /></td>
                                                <td className="p-4">
                                                    <button 
                                                        onClick={() => fetchOrderDetails(order.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                                                      >
                                                        <Eye className="w-4 h-4" /> Voir
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                                                    Aucune commande trouvée.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Stats Cards Products */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Total Produits</h3>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">En Stock</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {products.reduce((acc, p) => acc + (p.stock_quantity > 0 ? 1 : 0), 0)}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Rupture de Stock</h3>
                                <p className="text-2xl font-bold text-red-600">
                                    {products.reduce((acc, p) => acc + (p.stock_quantity === 0 ? 1 : 0), 0)}
                                </p>
                            </div>
                        </div>

                        {/* Products List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <h2 className="font-bold text-lg whitespace-nowrap">Produits</h2>
                                    <div className="flex-1 md:w-64 bg-white p-1.5 rounded-lg border flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary/20">
                                        <Search className="w-4 h-4 text-gray-400 ml-1" />
                                        <input 
                                            type="text" 
                                            placeholder="Rechercher un produit..." 
                                            className="bg-transparent border-none outline-none text-xs w-full p-1"
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { 
                                        setEditingProduct(null); 
                                        setIsProductModalOpen(true); 
                                        setIsNewCategory(false);
                                    }}
                                    className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
                                >
                                    <Plus className="w-4 h-4" /> Nouveau Produit
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                        <tr>
                                            <th className="p-4">Image</th>
                                            <th className="p-4">Nom (FR/AR)</th>
                                            <th className="p-4">Prix</th>
                                            <th className="p-4">Stock</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border">
                                                        {product.image_urls?.[0] ? (
                                                            <img src={product.image_urls[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-text-primary">{product.name_fr}</div>
                                                    <div className="text-xs text-text-secondary font-arabic">{product.name_ar}</div>
                                                </td>
                                                <td className="p-4 font-bold">{formatPrice(product.price)}</td>
                                                <td className="p-4">
                                                    <span className={`font-medium ${product.stock_quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                                        {product.stock_quantity}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => { 
                                                                setEditingProduct(product); 
                                                                setIsProductModalOpen(true); 
                                                                if (product.id) fetchStockLogs(product.id);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => product.id && handleDeleteProduct(product.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                                                    Aucun produit trouvé.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">Commande #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {modalLoading ? (
                            <div className="p-10 text-center">Chargement...</div>
                        ) : (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Details */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-3">Client</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                            <p><span className="font-medium">Nom:</span> {selectedOrder.customer_name}</p>
                                            <p><span className="font-medium">Tél:</span> {selectedOrder.customer_phone}</p>
                                            <p><span className="font-medium">Wilaya:</span> {selectedOrder.wilaya}</p>
                                            <p><span className="font-medium">Adresse:</span> {selectedOrder.address}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-3">Articles</h3>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-left">
                                                    <tr>
                                                        <th className="p-2">Produit</th>
                                                        <th className="p-2">Var.</th>
                                                        <th className="p-2">Qty</th>
                                                        <th className="p-2">Prix</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                                        <tr key={idx}>
                                                            <td className="p-2">{item.product_name}</td>
                                                            <td className="p-2 text-xs">{item.selected_size}/{item.selected_color}</td>
                                                            <td className="p-2 font-bold">{item.quantity}</td>
                                                            <td className="p-2">{formatPrice(item.price_at_purchase)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-between mt-4 font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-primary">{formatPrice(Number(selectedOrder.total_price))}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Actions & Risk */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-3">Validation & Actions</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedOrder.status === 'pending_confirmation' && (
                                                <button onClick={() => updateStatus(selectedOrder.id, 'confirmed')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Confirmer</button>
                                            )}
                                            {selectedOrder.status === 'confirmed' && (
                                                <button onClick={() => updateStatus(selectedOrder.id, 'shipped')} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Expédier</button>
                                            )}
                                            {selectedOrder.status === 'shipped' && (
                                                <button onClick={() => updateStatus(selectedOrder.id, 'delivered')} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Livré</button>
                                            )}
                                            <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50">Annuler</button>
                                        </div>
                                        <p className="text-xs text-gray-500">Statut actuel: <span className="font-bold">{selectedOrder.status}</span></p>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-3 flex items-center gap-2">
                                            <History className="w-3 h-3" /> Historique Client (Fake Order Check)
                                        </h3>
                                        
                                        {selectedOrder.history && selectedOrder.history.length > 0 ? (
                                            <div className="space-y-2">
                                                {selectedOrder.history.map((h: any) => (
                                                    <div key={h.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                                                        <span>#{h.id} - {new Date(h.created_at).toLocaleDateString()}</span>
                                                        <StatusBadge status={h.status} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">Aucune commande précédente.</p>
                                        )}
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-3">Note Admin</h3>
                                        <textarea 
                                            className="w-full border rounded-lg p-2 text-sm h-24 mb-2"
                                            placeholder="Note interne sur le client..."
                                            value={noteBuffer}
                                            onChange={(e) => setNoteBuffer(e.target.value)}
                                        />
                                        <button onClick={saveNote} className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black">
                                            Sauvegarder la note
                                        </button>
                                    </div>
                                    
                                    <div className="border-t pt-6">
                                         <a 
                                            href={`https://wa.me/213${selectedOrder.customer_phone.substring(1)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
                                         >
                                             <PhoneCall className="w-4 h-4" /> Contacter sur WhatsApp
                                         </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Modifier le produit' : 'Nouveau Produit'}</h2>
                            <button onClick={() => { setIsProductModalOpen(false); setIsNewCategory(false); }} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom (Français)</label>
                                    <input name="name_fr" defaultValue={editingProduct?.name_fr} required className="w-full border rounded-lg p-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom (Arabe)</label>
                                    <input name="name_ar" defaultValue={editingProduct?.name_ar} required className="w-full border rounded-lg p-2 text-sm text-right font-arabic" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prix (DZD)</label>
                                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full border rounded-lg p-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                                    <input name="stock_quantity" type="number" defaultValue={editingProduct?.stock_quantity} required className="w-full border rounded-lg p-2 text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label>
                                <div className="space-y-2">
                                    <select 
                                        name="category_id" 
                                        defaultValue={editingProduct?.category_id} 
                                        required={!isNewCategory}
                                        onChange={(e) => setIsNewCategory(e.target.value === 'new')}
                                        className="w-full border rounded-lg p-2 text-sm"
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name_fr} / {cat.name_ar}</option>
                                        ))}
                                        <option value="new" className="font-bold text-primary">+ Nouvelle catégorie...</option>
                                    </select>

                                    {isNewCategory && (
                                        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-dashed border-primary/30">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nom Catégorie (FR)</label>
                                                <input name="category_name_fr" required className="w-full border rounded p-2 text-xs" placeholder="Ex: Robes" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nom Catégorie (AR)</label>
                                                <input name="category_name_ar" required className="w-full border rounded p-2 text-xs text-right font-arabic" placeholder="Ex: فساتين" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Images (URLs séparées par des virgules)</label>
                                <textarea name="image_urls" defaultValue={editingProduct?.image_urls?.join(', ')} className="w-full border rounded-lg p-2 text-sm h-16" placeholder="https://ex.com/img1.jpg, https://ex.com/img2.jpg" />
                            </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tailles (S, M, L...)</label>
                                    <input name="sizes" id="sizes-input" defaultValue={editingProduct?.sizes?.join(', ')} className="w-full border rounded-lg p-2 text-sm" placeholder="S, M, L, XL" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Couleurs (Rouge, Bleu...)</label>
                                    <input name="colors" id="colors-input" defaultValue={editingProduct?.colors?.join(', ')} className="w-full border rounded-lg p-2 text-sm" placeholder="Rouge, Noir, Blanc" />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-text-primary">Stock par Variation</h3>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={addVariation}
                                            className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold hover:bg-gray-200 transition-all"
                                        >
                                            + Ajouter manuellement
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const s = (document.getElementById('sizes-input') as HTMLInputElement).value;
                                                const c = (document.getElementById('colors-input') as HTMLInputElement).value;
                                                generateVariations(s, c);
                                            }}
                                            className="text-[10px] bg-secondary text-primary px-2 py-1 rounded font-bold hover:bg-opacity-80 transition-all"
                                        >
                                            Générer les combinaisons
                                        </button>
                                    </div>
                                </div>

                                {variationStocks.length > 0 ? (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-gray-400 uppercase px-2">
                                            <span>Taille</span>
                                            <span>Couleur</span>
                                            <span>Stock</span>
                                            <span></span>
                                        </div>
                                        {variationStocks.map((v, idx) => (
                                            <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-white p-2 rounded-lg border text-sm">
                                                <input 
                                                    type="text" 
                                                    placeholder="Taille"
                                                    value={v.size}
                                                    onChange={(e) => {
                                                        const newVars = [...variationStocks];
                                                        newVars[idx].size = e.target.value;
                                                        setVariationStocks(newVars);
                                                    }}
                                                    className="w-full border rounded p-1 text-xs"
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Couleur"
                                                    value={v.color}
                                                    onChange={(e) => {
                                                        const newVars = [...variationStocks];
                                                        newVars[idx].color = e.target.value;
                                                        setVariationStocks(newVars);
                                                    }}
                                                    className="w-full border rounded p-1 text-xs"
                                                />
                                                <input 
                                                    type="number" 
                                                    value={v.stock_quantity}
                                                    onChange={(e) => {
                                                        const newVars = [...variationStocks];
                                                        newVars[idx].stock_quantity = Number(e.target.value);
                                                        setVariationStocks(newVars);
                                                    }}
                                                    className="w-full border rounded p-1 text-center font-bold text-primary"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeVariation(idx)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-4">
                                        Entrez les tailles et couleurs puis cliquez sur "Générer" pour gérer le stock précis.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Français)</label>
                                <textarea name="description_fr" defaultValue={editingProduct?.description_fr} className="w-full border rounded-lg p-2 text-sm h-24" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Arabe)</label>
                                <textarea name="description_ar" defaultValue={editingProduct?.description_ar} className="w-full border rounded-lg p-2 text-sm h-24 text-right font-arabic" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="is_active" defaultChecked={editingProduct?.is_active ?? true} id="is_active" />
                                <label htmlFor="is_active" className="text-sm font-medium">Produit actif (visible sur le site)</label>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90">
                                    Enregistrer
                                </button>
                                <button type="button" onClick={() => { setIsProductModalOpen(false); setIsNewCategory(false); }} className="flex-1 border border-gray-200 text-gray-500 font-bold py-3 rounded-lg hover:bg-gray-50">
                                    Annuler
                                </button>
                            </div>
                        </form>

                        {editingProduct && (
                            <div className="p-6 border-t bg-gray-50/50">
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Historique du Stock</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {stockLogs.length > 0 ? stockLogs.map((log: any) => (
                                        <div key={log.id} className="bg-white p-3 rounded-lg border text-xs flex justify-between items-center">
                                            <div>
                                                <span className={`font-bold ${log.change_amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {log.change_amount > 0 ? '+' : ''}{log.change_amount}
                                                </span>
                                                <span className="text-gray-400 ml-2">({log.reason})</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-500">{new Date(log.created_at).toLocaleString()}</div>
                                                <div className="text-gray-400">Nouveau stock: {log.new_quantity}</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-gray-400 italic">Aucun mouvement de stock récent.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

