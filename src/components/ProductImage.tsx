// src/components/ProductImage.tsx
import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
    src: string
    alt: string
    width: number
    height: number
}

export default function ProductImage({ src, alt, width, height }: ProductImageProps) {
    const [loaded, setLoaded] = useState(false)

    return (
        <div className="relative w-full h-full">
            {/* Show a spinner or placeholder until the image loads */}
            {!loaded && (
                <div className="rounded-xl absolute inset-0 flex items-center justify-center bg-slate-900">
                    <span className="text-gray-500">Loading...</span>
                </div>
            )}

            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                placeholder="blur"
                // Provide a local tiny placeholder image if possible. If not, you can remove this property.
                blurDataURL="/images/placeholder.png"
                onLoadingComplete={() => setLoaded(true)}
                className={`rounded object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    )
}
