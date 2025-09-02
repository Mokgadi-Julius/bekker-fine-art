import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayFast credentials
const PAYFAST_MERCHANT_ID = '12447061';
const PAYFAST_MERCHANT_KEY = 'om3shtjbl6dus';
const PAYFAST_PASSPHRASE = '';

function generateSignature(data: Record<string, string>, passPhrase: string = ''): string {
  // Create parameter string
  let paramString = '';
  const sortedKeys = Object.keys(data).sort();
  
  for (const key of sortedKeys) {
    if (key !== 'signature' && data[key]) {
      paramString += `${key}=${encodeURIComponent(data[key])}&`;
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
    // Get the form data from PayFast
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString();
    }

    console.log('PayFast notification received:', data);

    // Verify the signature
    const receivedSignature = data.signature;
    delete data.signature; // Remove signature for verification
    
    const calculatedSignature = generateSignature(data, PAYFAST_PASSPHRASE);
    
    if (receivedSignature !== calculatedSignature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Verify merchant details
    if (data.merchant_id !== PAYFAST_MERCHANT_ID) {
      console.error('Invalid merchant ID');
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 });
    }

    // Process the payment based on status
    const paymentStatus = data.payment_status;
    const paymentId = data.m_payment_id;
    const amount = data.amount_gross;

    console.log(`Payment ${paymentId} status: ${paymentStatus}, amount: ${amount}`);

    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send confirmation emails
    // 3. Update order status
    // 4. Record the transaction

    switch (paymentStatus) {
      case 'COMPLETE':
        console.log(`Payment ${paymentId} completed successfully`);
        // TODO: Update order status to paid
        // TODO: Send confirmation email
        // TODO: Record sale in your system
        break;
      
      case 'FAILED':
        console.log(`Payment ${paymentId} failed`);
        // TODO: Update order status to failed
        break;
      
      case 'PENDING':
        console.log(`Payment ${paymentId} is pending`);
        // TODO: Update order status to pending
        break;
    }

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error('PayFast notification error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}