import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Use SANDBOX credentials first to test signature generation
const PAYFAST_MERCHANT_ID = '10000100';
const PAYFAST_MERCHANT_KEY = '46f0cd694581a';
const PAYFAST_PASSPHRASE = 'jt7NOE43FZPn';
const PAYFAST_URL = 'https://sandbox.payfast.co.za/eng/process'; // Sandbox testing

interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number?: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  signature?: string;
}

function generateSignature(data: PayFastData, passPhrase: string = ''): string {
  // PayFast form signature generation - EXACT implementation from documentation
  // "Variable order: The pairs must be listed in the order in which they appear in the attributes description"
  
  let paramString = '';
  
  // Build parameter string with only NON-EMPTY values, in specific order
  const fieldOrder = [
    'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
    'name_first', 'name_last', 'email_address', 'cell_number', 
    'm_payment_id', 'amount', 'item_name', 'item_description'
  ];
  
  for (const key of fieldOrder) {
    const value = data[key as keyof PayFastData];
    // Only include non-empty values as per PayFast documentation
    if (value && value.toString().trim() !== '') {
      const trimmedValue = value.toString().trim();
      // URL encode the value - PayFast docs show urlencode() usage
      const encodedValue = encodeURIComponent(trimmedValue);
      paramString += `${key}=${encodedValue}&`;
    }
  }
  
  // Remove trailing &
  paramString = paramString.slice(0, -1);
  
  // Add passphrase if provided - DO NOT URL encode the passphrase
  if (passPhrase && passPhrase.trim() !== '') {
    paramString += `&passphrase=${passPhrase.trim()}`;
  }
  
  console.log('PayFast signature string:', paramString);
  
  // Generate MD5 signature in lowercase
  const signature = crypto.createHash('md5').update(paramString).digest('hex');
  console.log('PayFast generated signature:', signature);
  
  return signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      amount,
      itemName,
      itemDescription,
      paymentId
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !amount || !itemName || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get base URL for return URLs
    const baseUrl = request.headers.get('origin') || 'https://bekker-fine-art-production.up.railway.app';
    
    // Create PayFast payment data - only include non-empty values
    const paymentData: PayFastData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancelled`,
      notify_url: `${baseUrl}/api/payment/notify`,
      name_first: firstName,
      name_last: lastName,
      email_address: email,
      m_payment_id: paymentId,
      amount: parseFloat(amount).toFixed(2),
      item_name: itemName,
      item_description: itemDescription || itemName
    };
    
    // Only add cell_number if it exists and is not empty
    // Clean phone number: remove spaces, country codes, and special characters
    if (phone && phone.trim() !== '') {
      let cleanedPhone = phone.trim();
      
      // Debug log
      console.log('Original phone:', cleanedPhone);
      
      // Replace +27 with 0
      if (cleanedPhone.startsWith('+27')) {
        cleanedPhone = '0' + cleanedPhone.substring(3);
      }
      
      // Remove all spaces and non-numeric characters
      cleanedPhone = cleanedPhone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
      
      console.log('Cleaned phone:', cleanedPhone);
      
      if (cleanedPhone.length >= 10) {
        paymentData.cell_number = cleanedPhone;
      }
    }

    // Generate signature
    paymentData.signature = generateSignature(paymentData, PAYFAST_PASSPHRASE);

    return NextResponse.json({
      success: true,
      paymentUrl: PAYFAST_URL,
      paymentData
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}