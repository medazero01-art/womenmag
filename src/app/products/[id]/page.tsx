"use client";

import { useCart } from '@/context/CartContext';
import { fetchProduct } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Check, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [isOutOfStock, setIsOutOfStock] = useState(false);

    const { addToCart } = useCart();
    const router = useRouter();
    const { t, dir } = useLanguage();

    const getVariationStock = (size: string, color: string) => {
        if (!product?.variations || product.variations.length === 0) return product?.stock_quantity || 0;
        const v = product.variations.find((v: any) => v.size === size && v.color === color);
        return v ? v.stock_quantity : 0;
    };

    const isSizeAvailable = (size: string) => {
        if (!product?.variations || product.variations.length === 0) return true;
        if (selectedColor) return getVariationStock(size, selectedColor) > 0;
        return product.variations.some((v: any) => v.size === size && v.stock_quantity > 0);
    };

    const isColorAvailable = (color: string) => {
        if (!product?.variations || product.variations.length === 0) return true;
        if (selectedSize) return getVariationStock(selectedSize, color) > 0;
        return product.variations.some((v: any) => v.color === color && v.stock_quantity > 0);
    };

    useEffect(() => {
        if (selectedSize && selectedColor) {
            setIsOutOfStock(getVariationStock(selectedSize, selectedColor) <= 0);
        } else {
            setIsOutOfStock(false);
        }
    }, [selectedSize, selectedColor, product]);

    useEffect(() => {
        if (!id) return;
        fetchProduct(id)
            .then(data => {
                setProduct(data);
                if (data?.sizes?.length === 1) setSelectedSize(data.sizes[0]);
                if (data?.colors?.length === 1) setSelectedColor(data.colors[0]);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">{t.common.loading}</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Produit introuvable</div>;

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes?.length > 0) {
            alert('Veuillez sélectionner une taille');
            return;
        }
        if (!selectedColor && product.colors?.length > 0) {
            alert('Veuillez sélectionner une couleur');
            return;
        }

        addToCart({
            id: product.id,
            name_fr: product.name_fr, // Ideally we handle bilingual names here too 
            price: Number(product.price),
            image_url: product.image_urls?.[0],
            quantity: 1,
            size: selectedSize,
            color: selectedColor
        });

        router.push('/cart');
    };

    return (
        <div className="container mx-auto px-4 py-8" dir={dir}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] relative bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {product.image_urls?.[0] && (
                            <Image
                                src={product.image_urls[0]}
                                alt={product.name_fr}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold font-poppins text-text-primary mb-2">{product.name_fr}</h1>
                        <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>

                    <div className="prose text-text-secondary text-sm">
                        <p>{product.description_fr}</p>
                    </div>

                    {/* Selectors */}
                    {product.sizes?.length > 0 && (
                        <div>
                            <h3 className="font-medium mb-3">{t.product.selectSize}</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((s: string) => {
                                    const available = isSizeAvailable(s);
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => available && setSelectedSize(s)}
                                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                                                selectedSize === s
                                                    ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                                    : available 
                                                        ? 'bg-white text-text-primary border-gray-200 hover:border-text-primary'
                                                        : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                            }`}
                                        >
                                            <span className={!available ? 'opacity-40' : ''}>{s}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {product.colors?.length > 0 && (
                        <div>
                            <h3 className="font-medium mb-3">{t.product.selectColor}</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((c: string) => {
                                    const available = isColorAvailable(c);
                                    return (
                                        <button
                                            key={c}
                                            onClick={() => available && setSelectedColor(c)}
                                            className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                                                selectedColor === c
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : available
                                                        ? 'bg-white text-text-primary border-gray-200 hover:border-text-primary'
                                                        : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                            }`}
                                        >
                                            <span className={!available ? 'opacity-40' : ''}>{c}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg sticky bottom-4 md:static z-10 ${
                                isOutOfStock 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                                : 'bg-primary text-white hover:bg-opacity-90 active:scale-[0.98] shadow-primary/20'
                            }`}
                        >
                            <ShoppingBag className="w-5 h-5 rtl:mr-1" />
                            {isOutOfStock ? "Rupture de Stock" : t.product.addToCart}
                        </button>
                        <p className="text-center text-xs text-text-secondary mt-3 flex items-center justify-center gap-1">
                            <Truck className="w-3 h-3" /> {t.product.deliveryInfo}
                        </p>
                    </div>

                    {/* Reassurance */}
                    <div className="bg-secondary/20 rounded-xl p-4 mt-4 space-y-2">
                        <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <p className="text-sm">{t.product.confirmed}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <p className="text-sm">{t.product.exchange}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

