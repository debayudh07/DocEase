// app/api/create-room/route.js
"use server";
import { NextResponse } from 'next/server';

export async function POST() {
  const DAILY_API_KEY = process.env.DAILY_API_KEY;

  if (!DAILY_API_KEY) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          exp: Math.round(Date.now() / 1000) + 3600, // 1 hour expiration
        },
      }),
    });

    const room = await response.json();

    if (!response.ok) {
      throw new Error(room.error || 'Room creation failed');
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}