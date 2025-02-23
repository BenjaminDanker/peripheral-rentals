// src/components/ProductImage.tsx
import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
    src: string | null
    alt: string
    width: number
    height: number
}

export default function ProductImage({ src, alt, width, height }: ProductImageProps) {
    // The fallback image in case the given `src` is invalid or fails to load
    const FALLBACK_SRC = '/images/mice.jpg'

    // Initialize `imageSrc` to either the provided URL (if valid) or the local fallback
    const [imageSrc, setImageSrc] = useState(
        src && src.trim().startsWith('http') ? src : FALLBACK_SRC
    )

    // Track whether the image has finished loading (for spinner/placeholder)
    const [loaded, setLoaded] = useState(false)

    // Called once the image loads successfully
    const handleLoadComplete = () => {
        setLoaded(true)
    }

    // Called if loading the image fails (e.g., 404)
    const handleError = () => {
        setImageSrc(FALLBACK_SRC)
        // We consider it "loaded" so the spinner goes away
        setLoaded(true)
    }

    return (
        <div className="relative w-full h-full">
            {/* Spinner/placeholder until the image is loaded */}
            {!loaded && (
                <div className="rounded-xl absolute inset-0 flex items-center justify-center bg-slate-900">
                    <span className="text-gray-500">Loading...</span>
                </div>
            )}

            <Image
                src={imageSrc}
                alt={alt}
                width={width}
                height={height}
                // If using Next.js older than 13, you can still do:
                // onLoadingComplete={() => handleLoadComplete()}
                onLoadingComplete={handleLoadComplete}
                // Attempt to catch image load failures
                onError={handleError}
                // Avoid Next.js optimization for local fallback images
                unoptimized={imageSrc === FALLBACK_SRC}
                placeholder="blur"
                blurDataURL="/images/placeholder.png"
                className={`rounded object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'
                    }`}
            />
        </div>
    )
}
