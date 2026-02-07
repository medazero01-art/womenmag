"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle, XCircle, Search, Calendar, Phone } from "lucide-react";

type OrderItem = {
    product_name: string;
    quantity: number;
    selected_size: string;
    selected_color: string;
};

type Order = {
    id: number;
    status: string;
    total_price: string;
    created_at: string;
    items: OrderItem[];
};

export default function TrackingPage() {
    const { t, language } = useLanguage();
    const [phone, setPhone] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setOrders([]);
        setSearched(false);
        setLoading(true);

        // Validation frontend basic
        const phoneRegex = /^(05|06|07)[0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            setError(language === 'fr' ? 'Numéro invalide (05/06/07...)' : 'رقم غير صحيح');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/track?phone=${phone}`);
            
            if (res.status === 429) {
                setError(language === 'fr' ? 'Trop de requêtes. Veuillez patienter.' : 'كثرة المحاولات. يرجى الانتظار.');
                setLoading(false);
                return;
            }

            if (!res.ok) {
                throw new Error("Erreur");
            }

            const data = await res.json();
            setOrders(data);
            setSearched(true);
        } catch (err) {
            setError(language === 'fr' ? 'Erreur de connexion' : 'خطأ في الاتصال');
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            pending_confirmation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        
        const labels: Record<string, Record<string, string>> = {
            fr: {
                pending_confirmation: 'En Attente',
                confirmed: 'Confirmée',
                shipped: 'Expédiée',
                delivered: 'Livrée',
                cancelled: 'Annulée',
            },
            ar: {
                pending_confirmation: 'في الانتظار',
                confirmed: 'مؤكدة',
                shipped: 'تم الشحن',
                delivered: 'تم التوصيل',
                cancelled: 'ملغاة',
            }
        };

        const label = labels[language as 'fr'|'ar'][status] || status;
        
        const Icons: Record<string, any> = {
            pending_confirmation: Package,
            confirmed: CheckCircle,
            shipped: Truck,
            delivered: CheckCircle,
            cancelled: XCircle,
        };
        const Icon = Icons[status] || Package;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-2 w-fit ${styles[status] || 'bg-gray-100'}`}>
                <Icon className="w-4 h-4" />
                {label}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh]">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold font-poppins mb-4">{t.tracking.title}</h1>
                    <p className="text-text-secondary">{t.tracking.desc}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder={t.tracking.phonePlaceholder}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                maxLength={10}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? t.common.loading : (
                                <>
                                    <Search className="w-5 h-5" />
                                    {t.tracking.submit}
                                </>
                            )}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                </div>

                {/* Results */}
                {searched && (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">{t.tracking.noOrders}</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition-all hover:shadow-lg">
                                    <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{t.tracking.orderId}</p>
                                            <p className="font-mono text-lg font-bold">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{t.tracking.date}</p>
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                            </div>
                                        </div>
                                        <div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="space-y-3 mb-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {item.quantity}x
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{item.product_name}</p>
                                                            <p className="text-xs text-gray-500">{item.selected_size} / {item.selected_color}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <span className="font-bold text-gray-600">{t.tracking.total}</span>
                                            <span className="text-xl font-bold text-primary">{formatPrice(Number(order.total_price))}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
