import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    return NextResponse.json({ error: 'Directus URL not set' }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand');
  if (!brand) {
    return NextResponse.json({ models: [] });
  }
  try {
    const res = await fetch(`${directusUrl}/items/Cars?fields=model,brand&filter[brand][_eq]=${encodeURIComponent(brand)}&limit=1000`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
    }
    const data = await res.json();
    const cars = data.data || [];
    const models = Array.from(new Set(cars.map((c: any) => c.model))).filter(Boolean).sort();
    return NextResponse.json({ models });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 