import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [cartItems, setCartItems] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left-aligned brand */}
        <Link href="/" className="font-bold text-xl">
          Periphals Rentals
        </Link>

        {/* Left-aligned navigation */}
        <div className="hidden md:flex flex-1 space-x-6 justify-start ml-10">
          <Link href="/products">
            <span className="hover:text-gray-300 cursor-pointer">Products</span>
          </Link>
          <Link href="/about">
            <span className="hover:text-gray-300 cursor-pointer">About</span>
          </Link>
        </div>

        {/* Right-aligned account & cart section */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/cart">
            <span className="relative hover:text-gray-300 cursor-pointer">
              <ShoppingCartIcon className="w-6 h-6 inline-block" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 rounded-full px-1 text-xs">
                  {cartItems}
                </span>
              )}
            </span>
          </Link>
          <Link href="/login">
            <span className="hover:text-gray-300 cursor-pointer">Login</span>
          </Link>
          <Link href="/register">
            <span className="hover:text-gray-300 cursor-pointer">Register</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden">
          <Link href="/products">
            <span className="block px-4 py-2 hover:bg-gray-700">Products</span>
          </Link>
          <Link href="/about">
            <span className="block px-4 py-2 hover:bg-gray-700">About</span>
          </Link>
          <Link href="/cart">
            <span className="block px-4 py-2 hover:bg-gray-700">
              <ShoppingCartIcon className="w-6 h-6 inline-block" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 rounded-full px-1 text-xs">
                  {cartItems}
                </span>
              )}
            </span>
          </Link>
          <Link href="/login">
            <span className="block px-4 py-2 hover:bg-gray-700">Login</span>
          </Link>
          <Link href="/register">
            <span className="block px-4 py-2 hover:bg-gray-700">Register</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
