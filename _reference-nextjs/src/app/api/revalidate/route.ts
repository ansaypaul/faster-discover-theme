import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Important : Ajouter dans .env.local :
// REVALIDATE_SECRET=votre_clé_secrète_ici

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Missing path parameter' }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Error revalidating path:', path, err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
} 