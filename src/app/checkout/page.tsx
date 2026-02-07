"use client";

import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Check, Loader2, MapPin, Phone, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const WILAYAS = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
    "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

export default function CheckoutPage() {
    const { items, total, clearCart, addOrder } = useCart();
    const { t, dir } = useLanguage();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        wilaya: '',
        address: '',
        note: ''
    });

    useEffect(() => {
        if (!loading && items.length === 0) {
            router.push('/cart');
        }
    }, [items, loading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (items.length === 0 && !loading) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                // Backend calculates total, this is for reference or ignored
                items: items.map(i => ({
                    product_id: i.id,
                    quantity: i.quantity,
                    selected_size: i.size,
                    selected_color: i.color
                }))
            };

            const order = await createOrder(payload);
            
            // Store order data in context history
            addOrder({
                ...order,
                items: items // Include items from the cart context as backend doesn't return them all
            });

            // Keep session storage for immediate confirmation page display
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('lastOrder', JSON.stringify({
                    ...order,
                    items: items
                }));
            }
            
            clearCart();
            router.push('/order-confirmation');
        } catch (err: any) {
            console.error(err);
            alert((t.common.error || 'Erreur') + ': ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl" dir={dir}>
            <Link href="/cart" className="inline-flex items-center text-text-secondary hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 rtl:rotate-180" /> {t.checkout.backToCart}
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h1 className="text-2xl font-bold font-poppins mb-6">{t.checkout.title}</h1>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-8 text-sm flex gap-3">
                    <Truck className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-medium">{t.checkout.codInfoTitle}</p>
                        <p>{t.checkout.codInfoDesc}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-primary">{t.checkout.form.name}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto" />
                            <input
                                type="text"
                                name="customer_name"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all rtl:pr-10 rtl:pl-4"
                                placeholder="Ex: Amira Benali"
                                value={formData.customer_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-primary">{t.checkout.form.phone}</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto" />
                            <input
                                type="tel"
                                name="customer_phone"
                                required
                                pattern="^(05|06|07)[0-9]{8}$"
                                title="Format: 05/06/07 + 8 chiffres"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all rtl:pr-10 rtl:pl-4 font-mono dir-ltr"
                                placeholder="05 XX XX XX XX"
                                style={{ direction: 'ltr' }}
                                value={formData.customer_phone}
                                onChange={handleChange}
                            />
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{t.checkout.form.phoneHint}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-text-primary">{t.checkout.form.wilaya}</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto" />
                                <select
                                    name="wilaya"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all rtl:pr-10 rtl:pl-4 appearance-none bg-white"
                                    value={formData.wilaya}
                                    onChange={handleChange}
                                >
                                    <option value="">Sélectionner</option>
                                    {WILAYAS.map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-text-primary">{t.checkout.form.city}</label>
                            <input
                                type="text"
                                name="address"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Ex: Rue Didouche Mourad"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-primary">{t.checkout.form.note}</label>
                        <textarea
                            name="note"
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-medium text-lg">{t.cart.total} (Approx.)</span>
                            <span className="font-bold text-xl text-primary">{formatPrice(total + 500)}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> {t.checkout.form.processing}
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" /> {t.checkout.form.submit}
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-text-secondary mt-3">
                            {t.checkout.form.consent}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

