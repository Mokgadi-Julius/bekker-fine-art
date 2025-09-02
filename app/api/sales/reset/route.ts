import { NextResponse } from 'next/server';
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

export async function POST() {
  try {
    const dataDir = join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_SALES, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sales reset to initial state',
      sales: INITIAL_SALES 
    });
  } catch (error) {
    console.error('Error resetting sales:', error);
    return NextResponse.json({ error: 'Failed to reset sales' }, { status: 500 });
  }
}