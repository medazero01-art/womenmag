"use client";

import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Headphones, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeClient({ products, featuredProducts }: { products: any[], featuredProducts: any[] }) {
    const { t, dir } = useLanguage();

    return (
        <div className="space-y-24 pb-24 bg-background" dir={dir}>
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#FDFBFB]">
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full">
                        Nouvelle Collection 2026
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif text-text-primary mb-8 leading-[1.1] tracking-tight">
                        {t.home.heroTitle} <br />
                        <span className="text-primary italic italic-font">{t.home.heroSubtitle}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-sans">
                        {t.home.heroDesc}
                    </p>
                    <Link
                        href="/products"
                        className="group relative inline-flex items-center justify-center px-10 py-5 bg-primary/95 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 backdrop-blur-md border border-white/20"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[45deg] -translate-x-full group-hover:animate-shimmer" />
                        
                        <span className="relative z-10 flex items-center gap-2">
                            {t.home.cta} 
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>
            </section>

            {/* Reassurance Bar - Minimalist Bento Style */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: t.home.features.delivery, icon: <Truck className="w-6 h-6" />, desc: "Livraison rapide 58 wilayas" },
                        { label: t.home.features.cod, icon: <ShieldCheck className="w-6 h-6" />, desc: "Paiement à la livraison" },
                        { label: t.home.features.support, icon: <Headphones className="w-6 h-6" />, desc: "Support client 7j/7" },
                        { label: t.home.features.quality, icon: <Star className="w-6 h-6" />, desc: "Qualité premium garantie" },
                    ].map((feature, idx) => (
                        <div key={idx} className="group p-8 bg-white border border-gray-100 rounded-3xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="w-12 h-12 flex items-center justify-center bg-primary/5 text-primary rounded-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2 font-poppins">{feature.label}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold font-poppins text-text-primary">{t.home.newArrivals}</h2>
                    <Link href="/products" className="flex items-center text-primary font-medium hover:underline">
                        {t.home.viewAll} <ArrowRight className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-text-secondary">{t.home.noProducts}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                        {featuredProducts.map((p: any) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* Newsletter / Promo */}
            <section className="bg-primary/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4">{t.home.newsletter.title}</h2>
                    <p className="text-text-secondary mb-8 max-w-md mx-auto">
                        {t.home.newsletter.desc}
                    </p>
                    <a
                        href="https://wa.me/213555555555"
                        className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                    >
                        {t.home.newsletter.cta}
                    </a>
                </div>
            </section>
        </div>
    );
}
