"use client";

import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeClient({ products, featuredProducts }: { products: any[], featuredProducts: any[] }) {
    const { t, dir } = useLanguage();

    return (
        <div className="space-y-16 pb-16" dir={dir}>
            {/* Hero Section */}
            <section className="relative h-[80vh] md:h-[600px] flex items-center justify-center bg-secondary/20 overflow-hidden">
                {/* MAJ-6: Removed Unsplash URL, replaced with a gradient/pattern or could be local static */}
                {/* For now using a CSS gradient as placeholder for better performance/reliability */}
                <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-r from-pink-100 to-indigo-100" />

                <div className="relative z-10 text-center px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold font-poppins text-text-primary mb-6 leading-tight">
                        {t.home.heroTitle} <br />
                        <span className="text-primary">{t.home.heroSubtitle}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl mx-auto">
                        {t.home.heroDesc}
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        {t.home.cta}
                    </Link>
                </div>
            </section>

            {/* Categories / Benefits */}
            <section className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t.home.features.delivery, icon: '🚚' },
                    { label: t.home.features.cod, icon: '💵' },
                    { label: t.home.features.support, icon: '📞' },
                    { label: t.home.features.quality, icon: '✨' },
                ].map((feature, idx) => (
                    <div key={idx} className="bg-secondary/30 p-6 rounded-xl text-center hover:bg-secondary/50 transition-colors">
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="font-medium text-text-primary">{feature.label}</h3>
                    </div>
                ))}
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
