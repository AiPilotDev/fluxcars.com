import styles from './styles.module.css';

interface DescriptionWrapperProps {
  description: string;
}

export default function DescriptionWrapper({ description }: DescriptionWrapperProps) {
  return (
    <div
      className={`prose prose-sm max-w-none text-gray-600 ${styles.description}`}
      dangerouslySetInnerHTML={{ __html: description || '' }}
    />
  );
} 