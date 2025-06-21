'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Image from 'next/image';
import { getImageUrl } from '@/utils/getImageUrl';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  const slides = images.map(id => ({
    src: getImageUrl(id, directusUrl),
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
          src={getImageUrl(images[currentIndex], directusUrl)}
          alt={`Car image ${currentIndex + 1}`}
          fill
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
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
            <Image
              src={getImageUrl(id, directusUrl)}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="h-full w-full object-cover"
              sizes="160px"
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