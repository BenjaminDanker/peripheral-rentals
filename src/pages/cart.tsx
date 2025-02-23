// src/pages/cart.tsx
import { useCart } from "./contexts/CartContext";

export default function CartPage() {
    const { items, updateItemQuantity, removeItem, clearCart } = useCart();

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(id);
        } else {
            updateItemQuantity(id, newQuantity);
        }
    };

    const handleCheckout = () => {
        // Implement checkout logic, e.g., redirect to a checkout page or call an API.
        alert("Proceeding to checkout...");
    };

    return (
        <div>
            <h1>Your Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <span>{item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                                }
                                min="1"
                            />
                            <button onClick={() => removeItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            {items.length > 0 && (
                <>
                    <button onClick={clearCart}>Clear Cart</button>
                    <button onClick={handleCheckout}>Checkout</button>
                </>
            )}
        </div>
    );
}
