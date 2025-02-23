import Layout from '../components/Layout';
import { useCart } from './contexts/CartContext';

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
        alert('Proceeding to checkout...');
    };

    return (
        <Layout title="Your Cart" backgroundImage='/images/all-peripherals.jpg'>
            <div className="container mx-auto p-4 text-white bg-black bg-opacity-70 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
                {items.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <table className="w-full mb-4">
                            <thead>
                                <tr>
                                    <th className="text-left">Product</th>
                                    <th className="text-left">Price</th>
                                    <th className="text-left">Quantity</th>
                                    <th className="text-left">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                                                }
                                                min="1"
                                                className="w-16 p-1 border rounded"
                                            />
                                        </td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center">
                            <button onClick={clearCart} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Clear Cart
                            </button>
                            <button onClick={handleCheckout} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
