import Link from "next/link";

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-gray-200 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-400">
            <Link href="/">Peripheral Rentals</Link>
          </h1>
          <Link href="/admin" className="hover:text-blue-400">
            Manage Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
