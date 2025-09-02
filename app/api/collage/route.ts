import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'collage.json');

const INITIAL_COLLAGE = {
  title: "A glance at the work",
  description: "A mosaic of recent paintings and ceramic pieces. Each work tells a story — arranged as a living collage.",
  images: [
    "/images/WhatsApp Image 2025-07-15 at 13.38.18.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.38.43 (1).jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.41.05.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.43.37.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.53.01.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.53.02.jpeg"
  ]
};

async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const collage = JSON.parse(data);
      return NextResponse.json(collage);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_COLLAGE, null, 2));
      return NextResponse.json(INITIAL_COLLAGE);
    }
  } catch (error) {
    console.error('Error reading collage:', error);
    return NextResponse.json(INITIAL_COLLAGE);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const collage = await request.json();
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(collage, null, 2));
    
    return NextResponse.json({ success: true, collage });
  } catch (error) {
    console.error('Error saving collage:', error);
    return NextResponse.json({ error: 'Failed to save collage' }, { status: 500 });
  }
}