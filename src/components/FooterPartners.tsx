import Link from 'next/link';

export default function FooterPartners() {
  return (
    <div>
      <h3 suppressHydrationWarning className="text-white text-lg font-semibold mb-4">Партнеры</h3>
      <div className="space-y-4">
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">Hefei Accord Import and Export Co., LTD</h4>
          <p className="text-sm">
            Legal addres: Floor 12, 6-9, 11-14, Building B, No. 188, Shangcheng Avenue, Futian District, Yiwu, Jinhua City, Zhejiang Province
          </p>
          <p className="text-sm mt-1">
            Trade register number: 913 4012 MAE3J 77X26
          </p>
        </div>
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">Anhui Shengkun Construction Machinery Co.，Ltd.</h4>
          <p className="text-sm">
            Legal addres: Yaohai District, Hefei City, Anhui Province
          </p>
          <p className="text-sm mt-1">
            China Trade register number: 9134 0104 MA8P 0XN19J
          </p>
        </div>
        <div className="pt-2">
          <Link href="/partners" className="text-blue-400 hover:text-blue-300 transition-colors">
            Все партнеры →
          </Link>
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