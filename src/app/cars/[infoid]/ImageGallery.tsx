'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const slides = images.map(id => ({
    src: `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${id}`,
    alt: 'Car image'
  }));

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl bg-gray-100"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${images[currentIndex]}`}
          alt={`Car image ${currentIndex + 1}`}
          fill
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          priority
          sizes="100vw"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((id, idx) => (
          <div
            key={id}
            className={`relative aspect-[16/9] h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
              idx === currentIndex 
                ? 'border-indigo-500 scale-105' 
                : 'border-transparent hover:border-indigo-200'
            }`}
            onClick={() => setCurrentIndex(idx)}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${id}`}
              alt={`Thumbnail ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        slides={slides}
        open={lightboxOpen}
        index={currentIndex}
        close={() => setLightboxOpen(false)}
      />
    </div>
  );
} 