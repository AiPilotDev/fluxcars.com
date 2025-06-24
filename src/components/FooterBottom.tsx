import Link from 'next/link';
import { Copyright } from './Copyright';

export default function FooterBottom() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Copyright />
        <div className="mt-4 md:mt-0 flex space-x-6">
          <Link href="/policy" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </div>
  );
} 