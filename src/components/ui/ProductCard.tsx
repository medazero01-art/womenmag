"use client";

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

type Product = {
    id: number;
    name_fr: string;
    price: number;
    image_urls: string[];
    category_id: number;
    sizes?: string[];
    colors?: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';

    addToCart({
        id: product.id,
        name_fr: product.name_fr,
        price: Number(product.price),
        image_url: product.image_urls?.[0] || '',
        quantity: 1,
        size: defaultSize,
        color: defaultColor
    });

    router.push('/cart');
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container for image to avoid nested Links */}
      <div className="aspect-[3/4] relative bg-gray-50 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {product.image_urls?.[0] ? (
              <Image
                  src={product.image_urls[0]}
                  alt={product.name_fr}
                  fill
                  className={`object-cover transition-transform duration-1000 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
          ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
          )}
        </Link>
        
        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/10 flex items-center justify-center gap-3 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={handleQuickAdd}
              className="pointer-events-auto w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"
              title={t.product.addToCart}
            >
                <ShoppingBag className="w-5 h-5" />
            </button>
            <Link 
              href={`/products/${product.id}`}
              className="pointer-events-auto w-12 h-12 bg-white text-text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110 active:scale-95"
              title="Détails"
            >
                <Eye className="w-5 h-5" />
            </Link>
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-poppins font-semibold text-text-primary text-sm line-clamp-1 flex-1 group-hover:text-primary transition-colors">
                {product.name_fr}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-base text-primary">
                {formatPrice(product.price)}
            </p>
            <div className="flex gap-1">
                {product.sizes && product.sizes.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] text-gray-400 border rounded px-1">{s}</span>
                ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
