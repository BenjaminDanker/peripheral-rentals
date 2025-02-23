// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    updateItemQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const updateItemQuantity = (id: string, quantity: number) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider
            value={{ items, addItem, updateItemQuantity, removeItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
