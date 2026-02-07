"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
    id: number;
    name_fr: string;
    price: number;
    image_url: string;
    quantity: number;
    size: string;
    color: string;
};

type CartContextType = {
    items: CartItem[];
    orders: any[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number, size: string, color: string) => void;
    updateQuantity: (itemId: number, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    addOrder: (order: any) => void;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('women_mag_cart');
        const savedOrders = localStorage.getItem('women_mag_orders');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (e) {
                console.error("Failed to parse orders", e);
            }
        }
    }, []);

    // Save items to local storage
    useEffect(() => {
        localStorage.setItem('women_mag_cart', JSON.stringify(items));
    }, [items]);

    // Save orders to local storage
    useEffect(() => {
        localStorage.setItem('women_mag_orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color);
            if (existing) {
                return prev.map(item => 
                    (item.id === newItem.id && item.size === newItem.size && item.color === newItem.color) 
                    ? { ...item, quantity: item.quantity + newItem.quantity } 
                    : item
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (itemId: number, size: string, color: string) => {
        setItems(prev => prev.filter(item => !(item.id === itemId && item.size === size && item.color === color)));
    };

    const updateQuantity = (itemId: number, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId, size, color);
            return;
        }
        setItems(prev => prev.map(item => 
            (item.id === itemId && item.size === size && item.color === color)
            ? { ...item, quantity } 
            : item
        ));
    };

    const clearCart = () => setItems([]);

    const addOrder = (order: any) => {
        setOrders(prev => [order, ...prev]);
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, orders, addToCart, removeFromCart, updateQuantity, clearCart, addOrder, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
