import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import Image from 'next/image'
import { supabase } from '../../lib/supbaseClient'

interface Product {
    id: string
    name: string
    description: string
    image: string
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

    return (
        <Layout title={product.name} backgroundImage={product.image}>
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg text-white w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        
                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-96">
                            <Image
                                src={product.image}
                                alt={product.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg shadow-lg"
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
