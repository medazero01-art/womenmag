"use client";

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ArrowRight, Ticket, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

export default function CartPage() {
  const { items, orders, updateQuantity, removeFromCart, total } = useCart();
  const { t, dir } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>(items.length > 0 ? 'cart' : 'orders');
  const [orderSearch, setOrderSearch] = useState('');

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      <div className="flex gap-4 mb-8 border-b">
        <button 
          onClick={() => setActiveTab('cart')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'cart' ? 'text-primary' : 'text-gray-400'}`}
        >
          {t.cart.title} ({items.length})
          {activeTab === 'cart' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'orders' ? 'text-primary' : 'text-gray-400'}`}
        >
          Mes Commandes ({orders.length})
          {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'cart' ? (
        items.length === 0 ? (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">{t.cart.empty}</h1>
            <Link href="/products" className="text-primary hover:underline">
              {t.cart.discover}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image_url && <Image src={item.image_url} alt={item.name_fr} fill className="object-cover" />}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-text-primary line-clamp-1">{item.name_fr}</h3>
                        <p className="text-sm text-text-secondary">
                          {item.size} {item.color && `• ${item.color}`}
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="text-gray-400 hover:text-error p-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center gap-3 border rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 disabled:opacity-30">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="p-1">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-bold text-lg mb-4">{t.cart.summary}</h2>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t.cart.subtotal}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t.cart.shipping}</span>
                    <span className="text-success font-medium">{t.cart.shippingCalculated}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t.cart.total}</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-[0.98]">
                  {t.cart.checkout}
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
                <p className="text-xs text-center text-text-secondary mt-4">{t.cart.codNote}</p>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher une commande ou un produit..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
          </div>

          {orders.filter(o => 
            o.id.toString().includes(orderSearch) || 
            o.items?.some((i: any) => i.name_fr.toLowerCase().includes(orderSearch.toLowerCase()))
          ).length === 0 ? (
            <div className="py-20 text-center">
              <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 italic">Aucun bon de commande enregistré.</p>
            </div>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                  <span className="text-xs font-black text-gray-500 uppercase">Commande #{order.id}</span>
                  <span className="text-[10px] text-gray-400">{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-text-primary">{item.name_fr} <span className="text-gray-400 text-xs">x{item.quantity}</span></span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-lg font-black text-primary">{formatPrice(Number(order.total_price))}</span>
                  </div>
                  <Link 
                    href="/order-confirmation" 
                    onClick={() => sessionStorage.setItem('lastOrder', JSON.stringify(order))}
                    className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold text-primary bg-primary/5 py-2 rounded-lg hover:bg-primary/10 transition-all"
                  >
                    Voir le bon complet
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

