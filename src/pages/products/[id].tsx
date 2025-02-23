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
                <p>Product not found.</p>
            </Layout>
        )
    }

    return (
        <Layout title={product.name}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-1/2 h-96">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <p className="mt-2">{product.description}</p>
                    <p className="mt-2 font-semibold">${product.price} / day</p>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Rent Now
                    </button>
                </div>
            </div>
        </Layout>
    )
}
