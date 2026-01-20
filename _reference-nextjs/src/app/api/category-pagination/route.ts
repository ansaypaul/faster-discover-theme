import { NextRequest, NextResponse } from 'next/server';
import { getArticlesInCategoryPaginated } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const { slug, after, first = 12 } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    const result = await getArticlesInCategoryPaginated(slug, first, after);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Category pagination API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
