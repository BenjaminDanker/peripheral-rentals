import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import Image from 'next/image'
import { supabase } from '../../lib/supbaseClient'
import { useState } from 'react'

interface Product {
    id: string
    name: string
    description: string
    image: string | null
    price: number
}

interface ProductDetailProps {
    product: Product | null
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: products, error } = await supabase.from('products').select('id')

    if (error) {
        console.error('Error fetching product IDs:', error)
        return { paths: [], fallback: 'blocking' }
    }

    const paths = products.map((p: { id: string }) => ({ params: { id: p.id } }))

    return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params!
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        return { props: { product: null }, revalidate: 10 }
    }

    return { props: { product }, revalidate: 10 }
}

export default function ProductDetail({ product }: ProductDetailProps) {
    if (!product) {
        return (
            <Layout title="Product Not Found">
                <div className="min-h-screen flex items-center justify-center text-white">
                    <p className="text-xl bg-black bg-opacity-70 px-6 py-4 rounded-lg shadow-lg">
                        Product not found.
                    </p>
                </div>
            </Layout>
        )
    }

    // State to track whether the image has failed to load
    const [imageSrc, setImageSrc] = useState(
        product.image && product.image.startsWith('http') ? product.image : ''
    );

    return (
        <Layout title={product.name} backgroundImage='/images/all-peripherals.jpg'>
            <div className="min-h-screen w-full h-full flex flex-col items-center text-white text-center p-8 bg-black bg-opacity-50">
                <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg text-white w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-96">
                            <Image
                                src={imageSrc}
                                alt={product.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg shadow-lg"
                                unoptimized={imageSrc === '/images/mice.jpg'} // Prevents unnecessary optimizations for local images
                                onError={() => setImageSrc('/images/mice.jpg')} // If external image fails, switch to local fallback
                            />
                        </div>

                        {/* Product Details */}
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold drop-shadow-lg">{product.name}</h2>
                            <p className="mt-2 text-lg drop-shadow">{product.description}</p>
                            <p className="mt-2 text-xl font-semibold drop-shadow-lg">${product.price} / day</p>

                            <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md">
                                Rent Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
