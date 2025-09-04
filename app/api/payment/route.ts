import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayFast configuration from environment variables
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '10041723';
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || 'zfpjj502dmh8o';
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || 'writenowagency123';
const PAYFAST_URL = process.env.PAYFAST_URL || 'https://sandbox.payfast.co.za/eng/process';

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
  // PayFast form signature generation - use alphabetical order for form submissions
  // Based on PayFast documentation and community best practices
  
  let paramString = '';
  
  // Create copy of data to avoid modifying original
  const signatureData: Record<string, string> = {};
  
  // Add all non-empty values to signature data
  Object.keys(data).forEach(key => {
    const value = data[key as keyof PayFastData];
    if (value && value.toString().trim() !== '') {
      signatureData[key] = value.toString().trim();
    }
  });
  
  // Add passphrase if provided (include in alphabetical sort)
  if (passPhrase && passPhrase.trim() !== '') {
    signatureData['passphrase'] = passPhrase.trim();
  }
  
  // Sort keys alphabetically and build parameter string
  const sortedKeys = Object.keys(signatureData).sort();
  
  for (const key of sortedKeys) {
    if (key !== 'signature') { // Exclude signature itself
      const value = signatureData[key];
      // URL encode and replace %20 with + for spaces (PayFast requirement)
      const encodedValue = encodeURIComponent(value).replace(/%20/g, '+');
      paramString += `${key}=${encodedValue}&`;
    }
  }
  
  // Remove trailing &
  paramString = paramString.slice(0, -1);
  
  console.log('PayFast signature string:', paramString);
  
  // Generate MD5 signature in lowercase
  const signature = crypto.createHash('md5').update(paramString).digest('hex');
  console.log('PayFast generated signature:', signature);
  
  return signature;
}

// Helper function to sanitize text for PayFast
function sanitizeForPayFast(text: string): string {
  return text
    .replace(/[()[\]{}]/g, '') // Remove brackets and parentheses
    .replace(/['"]/g, '') // Remove quotes
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^\w\s-]/g, '') // Remove other special characters except hyphens
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
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
      paymentId,
      cartItems // Optional: detailed cart breakdown for logging/tracking
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !amount || !itemName || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize item name and description for PayFast compatibility
    const sanitizedItemName = sanitizeForPayFast(itemName);
    const sanitizedItemDescription = sanitizeForPayFast(itemDescription || itemName);

    // Log detailed cart information if provided (for debugging/tracking)
    if (cartItems && Array.isArray(cartItems)) {
      console.log('PayFast payment cart details:', {
        paymentId,
        totalItems: cartItems.length,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.item?.title || 'Unknown',
          price: item.item?.price || 0,
          framing: item.framing || 'None',
          quantity: item.quantity || 1,
          subtotal: item.subtotal || 0
        }))
      });
    }

    // Get base URL for return URLs - use environment variable or fallback to origin/localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';
    
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
      item_name: sanitizedItemName,
      item_description: sanitizedItemDescription
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