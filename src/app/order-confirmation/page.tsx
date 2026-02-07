"use client";

import Link from 'next/link';
import { CheckCircle, Home, Camera, Ticket, MapPin, Phone, User, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState<any>(null);
    const { t, dir } = useLanguage();

    useEffect(() => {
        const savedOrder = sessionStorage.getItem('lastOrder');
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
        }
    }, []);

    if (!order) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <p className="text-text-secondary mb-4">Chargement de votre bon...</p>
                <Link href="/" className="text-primary font-bold hover:underline flex items-center gap-2">
                    <Home className="w-4 h-4" /> Retour à l'accueil
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir={dir}>
            <div className="max-w-xl mx-auto">
                {/* Header Success */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Commande Reçue !</h1>
                    <p className="text-text-secondary">Merci pour votre confiance, {order.customer_name}.</p>
                </div>

                {/* Screenshot Alert */}
                <div className="bg-primary text-white p-4 rounded-2xl mb-8 flex items-center gap-4 shadow-lg shadow-primary/20 animate-pulse">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Camera className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm">Prenez une capture d'écran de votre bon de commande !</p>
                </div>

                {/* The RECEIPT - Designed for Screenshot */}
                <div id="receipt" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
                    {/* Top Decorative bar */}
                    <div className="h-3 bg-gradient-to-r from-primary to-secondary w-full"></div>
                    
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="text-left font-poppins">
                                <h2 className="text-2xl font-black text-primary italic uppercase tracking-tighter">Women Mag</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Official Receipt</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    ID: #{order.id}
                                </span>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 gap-4 mb-8 bg-gray-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-text-primary font-medium">{order.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-text-primary font-mono">{order.customer_phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-text-primary">{order.wilaya}, {order.address}</span>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Articles commandés</h3>
                            </div>
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-text-primary">{item.name_fr}</p>
                                        <p className="text-[10px] text-text-secondary uppercase">
                                            {item.size ? `Taille: ${item.size}` : ''} 
                                            {item.color ? ` | Couleur: ${item.color}` : ''}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-sm font-bold">{formatPrice(item.price)}</p>
                                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t-2 border-dashed border-gray-100 pt-6">
                            <div className="flex justify-between text-sm text-text-secondary mb-2">
                                <span>Livraison (Approx.)</span>
                                <span>500 DA</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold text-text-primary uppercase tracking-tighter">Total à Payer</span>
                                <span className="text-2xl font-black text-primary">{formatPrice(Number(order.total_price))}</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center bg-green-50 text-green-600 p-4 rounded-xl border border-green-100">
                            <p className="text-sm font-bold flex items-center justify-center gap-2">
                                <Ticket className="w-4 h-4" /> Paiement à la Livraison
                            </p>
                        </div>
                    </div>

                    {/* Footer decoration */}
                    <div className="p-4 bg-gray-50 text-center">
                        <p className="text-[10px] text-gray-400 font-medium">Merci d'avoir choisi Women Mag. Un agent vous appellera sous 24h.</p>
                    </div>
                </div>

                {/* Return Home Button */}
                <div className="mt-12 text-center">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-full font-bold text-text-secondary hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        <Home className="w-5 h-5" /> Retour à la boutique
                    </Link>
                </div>
            </div>
        </div>
    );
}
