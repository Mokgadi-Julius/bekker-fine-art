"use client";
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">Your payment was cancelled or interrupted</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Don&apos;t worry!</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• No charges were made to your account</li>
            <li>• Your items are still in your cart</li>
            <li>• You can try the payment again</li>
            <li>• Contact us if you need assistance</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Try Payment Again
          </Link>
          
          <Link
            href="/"
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Need help? Contact Stefan directly</p>
          <p>Bekker Fine Art</p>
        </div>
      </div>
    </div>
  );
}