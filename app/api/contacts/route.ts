import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'contacts.json');

const INITIAL_CONTACTS = [
  {
    id: "contact001",
    type: "general",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+27 11 555 0123",
    message: "I'm interested in learning more about your artistic process and upcoming exhibitions.",
    timestamp: "2024-12-10T14:30:00Z",
    status: "new"
  },
  {
    id: "contact002", 
    type: "purchase_inquiry",
    name: "Michael Chen",
    email: "m.chen@gmail.com",
    phone: "+27 82 456 7890",
    message: "I'm interested in purchasing 'The Light is Gold'. Could you provide more details about framing options?",
    timestamp: "2024-12-08T09:15:00Z",
    status: "read",
    artworkIds: ["w001"],
    totalAmount: 23500,
    deliveryPreference: "Collection",
    specialRequests: "Would like to see it in person first"
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
      const contacts = JSON.parse(data);
      return NextResponse.json(contacts);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_CONTACTS, null, 2));
      return NextResponse.json(INITIAL_CONTACTS);
    }
  } catch (error) {
    console.error('Error reading contacts:', error);
    return NextResponse.json(INITIAL_CONTACTS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const newContact = await request.json();
    await ensureDataDir();
    
    let contacts = INITIAL_CONTACTS;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      contacts = JSON.parse(data);
    } catch {}
    
    contacts.push(newContact);
    await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2));
    
    return NextResponse.json({ success: true, contact: newContact });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedContact = await request.json();
    await ensureDataDir();
    
    let contacts = INITIAL_CONTACTS;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      contacts = JSON.parse(data);
    } catch {}
    
    const index = contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      contacts[index] = updatedContact;
      await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2));
      return NextResponse.json({ success: true, contact: updatedContact });
    } else {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });
    }
    
    await ensureDataDir();
    
    let contacts = INITIAL_CONTACTS;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      contacts = JSON.parse(data);
    } catch {}
    
    contacts = contacts.filter(c => c.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}