import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayFast credentials - LIVE credentials
const PAYFAST_MERCHANT_ID = '12447061';
const PAYFAST_MERCHANT_KEY = 'om3shtjbl6dus';
const PAYFAST_PASSPHRASE = 'Writenowagency123';
const PAYFAST_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

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
  let paramString = '';
  
  // Process each field in the EXACT order they appear in the data object
  // This matches the order fields are created in the paymentData object
  Object.keys(data).forEach(key => {
    const value = data[key as keyof PayFastData] as string;
    
    // Include all non-empty values except signature
    if (key !== 'signature' && value !== undefined && value !== null && value.toString().trim() !== '') {
      const trimmedValue = value.toString().trim();
      // URL encode the value
      const encodedValue = encodeURIComponent(trimmedValue);
      paramString += `${key}=${encodedValue}&`;
    }
  });
  
  // Remove the trailing &
  paramString = paramString.slice(0, -1);
  
  // Add passphrase (DO NOT encode the passphrase itself)
  if (passPhrase && passPhrase.trim() !== '') {
    paramString += `&passphrase=${passPhrase.trim()}`;
  }
  
  console.log('PayFast signature string:', paramString);
  
  // Generate MD5 hash in lowercase
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
    if (phone && phone.trim() !== '') {
      paymentData.cell_number = phone.trim();
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