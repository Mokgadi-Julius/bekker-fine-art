import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayFast credentials
const PAYFAST_MERCHANT_ID = '12447061';
const PAYFAST_MERCHANT_KEY = 'om3shtjbl6dus';
const PAYFAST_PASSPHRASE = ''; // Leave empty if not set
const PAYFAST_URL = 'https://sandbox.payfast.co.za/eng/process'; // Use https://www.payfast.co.za/eng/process for production

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
  // Create parameter string
  let paramString = '';
  const sortedKeys = Object.keys(data).sort();
  
  for (const key of sortedKeys) {
    if (key !== 'signature' && data[key as keyof PayFastData]) {
      paramString += `${key}=${encodeURIComponent(data[key as keyof PayFastData] as string)}&`;
    }
  }
  
  // Remove trailing &
  paramString = paramString.slice(0, -1);
  
  // Add passphrase if provided
  if (passPhrase) {
    paramString += `&passphrase=${encodeURIComponent(passPhrase)}`;
  }
  
  // Generate MD5 signature
  return crypto.createHash('md5').update(paramString).digest('hex');
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
    
    // Create PayFast payment data
    const paymentData: PayFastData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancelled`,
      notify_url: `${baseUrl}/api/payment/notify`,
      name_first: firstName,
      name_last: lastName,
      email_address: email,
      cell_number: phone || '',
      m_payment_id: paymentId,
      amount: parseFloat(amount).toFixed(2),
      item_name: itemName,
      item_description: itemDescription || itemName
    };

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