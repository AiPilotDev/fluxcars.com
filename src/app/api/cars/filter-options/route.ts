import { NextResponse } from 'next/server';

export async function GET() {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    return NextResponse.json({ error: 'Directus URL not set' }, { status: 500 });
  }

  try {
    const res = await fetch(`${directusUrl}/items/Cars?fields=brand,year&limit=1000`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }
    const data = await res.json();
    const cars = data.data || [];
    const brands = Array.from(new Set(cars.map((c: any) => c.brand))).filter(Boolean).sort();
    const years = Array.from(new Set(cars.map((c: any) => c.year))).filter(Boolean).sort((a, b) => Number(b) - Number(a));
    return NextResponse.json({ brands, years });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 