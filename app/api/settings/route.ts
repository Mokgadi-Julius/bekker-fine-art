import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'settings.json');

const DEFAULT_SETTINGS = {
  theme: 'light',
  autoSave: true,
  showDescriptions: true,
  activityNotifications: true,
  compactView: false,
  debugMode: false,
  backupReminder: true,
  maxImageSize: 25,
  currency: 'ZAR',
  dateFormat: 'DD/MM/YYYY'
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
      const settings = JSON.parse(data);
      // Merge with defaults to ensure new settings are included
      const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
      return NextResponse.json(mergedSettings);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return NextResponse.json(DEFAULT_SETTINGS);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const newSettings = await request.json();
    await ensureDataDir();
    
    // Merge with defaults to ensure we have all required fields
    const mergedSettings = { ...DEFAULT_SETTINGS, ...newSettings };
    await fs.writeFile(DATA_FILE, JSON.stringify(mergedSettings, null, 2));
    
    return NextResponse.json({ success: true, settings: mergedSettings });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Reset to defaults
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json({ error: 'Failed to reset settings' }, { status: 500 });
  }
}