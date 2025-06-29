import Link from 'next/link';

export default function FooterPartners() {
  return (
    <div>
      <h3 suppressHydrationWarning className="text-white text-lg font-semibold mb-4">Партнеры</h3>
      <div className="space-y-4">
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">Anhui Shengkun Construction Machinery Co.,Ltd.</h4>
          <p className="text-sm">
            Legal addres: Yaohai District, Hefei City, Anhui Province
          </p>
          <p className="text-sm mt-1">
            China Trade register number: 9134 0104 MA8P 0XN19J
          </p>
        </div>
       
        <div>
          <Link href="https://cmotor.pl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
            Samochody z Chin →
          </Link>
        </div>
      </div>
    </div>
  );
} 