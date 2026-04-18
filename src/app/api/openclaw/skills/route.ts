import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://localhost:3030/api/skills', {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 503 }
    );
  }
}
