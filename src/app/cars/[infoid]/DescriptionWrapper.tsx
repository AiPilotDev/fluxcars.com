'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import DOMPurify from 'dompurify';

interface DescriptionWrapperProps {
  description: string;
}

export default function DescriptionWrapper({ description }: DescriptionWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    return () => setIsClient(false);
  }, []);

  if (!isClient) {
    return (
      <div className={`prose prose-sm max-w-none text-gray-600 ${styles.description}`}>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
      </div>
    );
  }

  return (
    <div 
      className={`prose prose-sm max-w-none text-gray-600 ${styles.description}`}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
    />
  );
} 