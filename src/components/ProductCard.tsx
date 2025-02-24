import Link from 'next/link';
import { Product } from '../types/product';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col items-center">
      <div className="w-full flex justify-center items-center">
        <ProductImage
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="object-contain mx-auto"
        />
      </div>
      <div className="p-4 shadow-lg text-center">
        <h3 className="font-bold text-lg mt-2">{product.name}</h3>
        <p>{product.description}</p>
        <p className="mt-2 font-semibold">${product.price} / day</p>
        <Link
          href={`/products/${product.id}`}
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Details / Rent
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
