import { NextResponse } from 'next/server';

export async function GET() {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    return NextResponse.json({ error: 'Directus URL not set' }, { status: 500 });
  }

  try {
    // Получаем все бренды
    const brandsRes = await fetch(`${directusUrl}/items/brands?fields=id,name&limit=1000`);
    if (!brandsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
    const brandsData = await brandsRes.json();
    const brands = brandsData.data || [];

    // Получаем все года из Cars
    const carsRes = await fetch(`${directusUrl}/items/Cars?fields=year&limit=1000`);
    if (!carsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }
    const carsData = await carsRes.json();
    const years = Array.from(new Set((carsData.data || []).map((c: { year: number }) => c.year)))
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));

    return NextResponse.json({ brands, years });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 