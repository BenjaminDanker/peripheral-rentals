import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
    // For demonstration, we're using a simple state for cart items.
    // In a real app, you might fetch this from context or a global state.
    const [cartItems, setCartItems] = useState(0)

    return (
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo / Brand */}
                <Link href="/" className="font-bold text-xl">
                    Rental Service
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    <Link href="/about">
                        <span className="hover:text-gray-300 cursor-pointer">About</span>
                    </Link>
                    <Link href="/products">
                        <span className="hover:text-gray-300 cursor-pointer">Products</span>
                    </Link>
                </div>

                {/* Actions: Cart and Login/Register */}
                <div className="flex items-center space-x-6">
                    <Link href="/cart">
                        <span className="relative hover:text-gray-300 cursor-pointer">
                            Cart
                            {cartItems > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 rounded-full px-1 text-xs">
                                    {cartItems}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link href="/login">
                        <span className="hover:text-gray-300 cursor-pointer">
                            Login
                        </span>
                    </Link>
                    <Link href="/register">
                        <span className="hover:text-gray-300 cursor-pointer">
                            Register
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
