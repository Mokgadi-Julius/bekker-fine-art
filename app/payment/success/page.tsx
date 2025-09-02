"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string | null;
    amount: string | null;
    itemName: string | null;
    paymentStatus: string | null;
  } | null>(null);

  useEffect(() => {
    // Get payment details from URL parameters
    const details = {
      paymentId: searchParams.get('m_payment_id'),
      amount: searchParams.get('amount_gross'),
      itemName: searchParams.get('item_name'),
      paymentStatus: searchParams.get('payment_status')
    };
    
    setPaymentDetails(details);
    
    // Clear cart from localStorage since payment is complete
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bekker-cart');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase from Bekker Fine Art</p>
        </div>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              {paymentDetails.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-gray-800">{paymentDetails.paymentId}</span>
                </div>
              )}
              {paymentDetails.itemName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="text-gray-800">{paymentDetails.itemName}</span>
                </div>
              )}
              {paymentDetails.amount && (
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-green-600">R {parseFloat(paymentDetails.amount).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600">
            <strong>What happens next?</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• You&apos;ll receive a confirmation email shortly</li>
            <li>• Stefan will contact you within 24 hours</li>
            <li>• Arrange collection or delivery of your artwork</li>
            <li>• Any questions? Call us directly</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          
          <button
            onClick={() => window.print()}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Print Receipt
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Bekker Fine Art | Stefan Bekker</p>
          <p>Secured by PayFast</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}