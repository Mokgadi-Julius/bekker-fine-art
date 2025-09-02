import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'sales.json');

const INITIAL_SALES = [
  {
    id: "sale001",
    artworkId: "w002",
    artworkTitle: "Quiet Strength",
    saleDate: "2024-12-15",
    originalPrice: 17000,
    salePrice: 17000,
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+27 11 123 4567",
    paymentMethod: "Bank Transfer",
    deliveryMethod: "Collection",
    notes: "Purchased with premium frame",
    status: "completed"
  },
  {
    id: "sale002",
    artworkId: "w003",
    artworkTitle: "Ocean Dreams",
    saleDate: "2024-11-28",
    originalPrice: 19500,
    salePrice: 20500,
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@gmail.com",
    customerPhone: "+27 82 987 6543",
    paymentMethod: "Card Payment",
    deliveryMethod: "Delivery",
    notes: "Commissioned piece, includes custom frame",
    status: "completed"
  }
];

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
      const sales = JSON.parse(data);
      return NextResponse.json(sales);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_SALES, null, 2));
      return NextResponse.json(INITIAL_SALES);
    }
  } catch (error) {
    console.error('Error reading sales:', error);
    return NextResponse.json(INITIAL_SALES);
  }
}

export async function POST(request: NextRequest) {
  try {
    const newSale = await request.json();
    await ensureDataDir();
    
    let sales = INITIAL_SALES;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      sales = JSON.parse(data);
    } catch {}
    
    sales.push(newSale);
    await fs.writeFile(DATA_FILE, JSON.stringify(sales, null, 2));
    
    return NextResponse.json({ success: true, sale: newSale });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedSale = await request.json();
    await ensureDataDir();
    
    let sales = INITIAL_SALES;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      sales = JSON.parse(data);
    } catch {}
    
    const index = sales.findIndex(s => s.id === updatedSale.id);
    if (index !== -1) {
      sales[index] = updatedSale;
      await fs.writeFile(DATA_FILE, JSON.stringify(sales, null, 2));
      return NextResponse.json({ success: true, sale: updatedSale });
    } else {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Sale ID required' }, { status: 400 });
    }
    
    await ensureDataDir();
    
    let sales = INITIAL_SALES;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      sales = JSON.parse(data);
    } catch {}
    
    sales = sales.filter(s => s.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(sales, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
  }
}