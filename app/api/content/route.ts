import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'content.json');

const INITIAL_CONTENT = {
  gallery: {
    title: "Gallery",
    description: "Mixed order of sold & available works as requested. Use the filters to browse."
  },
  about: {
    title: "Stefan Bekker",
    subtitle: "Meet the Artist",
    description: "Award-winning chef Stefan Bekker escapes career stress through emotional art that speaks to our internal selves.\n\nWith years of experience crafting edible art, Stefan brings the same passion and attention to detail to his abstract works. Each piece is a meditation on transformation and the courage to start again.\n\nFrom the kitchen to the canvas, every creation tells a story of resilience, beauty, and the endless pursuit of authentic expression.",
    artistImage: "/images/stefan.jpeg"
  },
  contact: {
    title: "Get in touch",
    description: "For commissions, studio visits, or purchase enquiries, send a message. We aim to respond within 24 hours.",
    phone: "+27 11 083 9898",
    email: "info@bekkerfineart.co.za",
    instagram: "@bekkerfineart"
  }
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
      const content = JSON.parse(data);
      return NextResponse.json(content);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_CONTENT, null, 2));
      return NextResponse.json(INITIAL_CONTENT);
    }
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(INITIAL_CONTENT);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const content = await request.json();
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2));
    
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}