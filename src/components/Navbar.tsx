import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<number>(0);

  return (
    <nav className="bg-gray-800 text-gray-200 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left side: Brand & Navigation */}
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-400">
            <Link href="/">Peripheral Rentals</Link>
          </h1>
          <Link href="/products" className="hover:text-blue-400">
            Products
          </Link>
          <Link href="/about" className="hover:text-blue-400">
            About
          </Link>
        </div>

        {/* Right side: Cart and Auth Links */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="relative hover:text-blue-400">
            <ShoppingCartIcon className="w-6 h-6 inline-block" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 rounded-full px-1 text-xs">
                {cartItems}
              </span>
            )}
          </Link>
          {session ? (
            <>
              <span>
                {session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="hover:text-blue-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
