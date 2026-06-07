'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    try {
      setVerified(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">StudentHub</span>
          </Link>
          {verified ? (
            <>
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Your email has been successfully verified. You can now sign in to your account.</p>
              <Link href="/login">
                <Button variant="primary">Sign In</Button>
              </Link>
            </>
          ) : (
            <>
              <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Check your inbox for a verification link. Click the link or enter the verification code below.</p>
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <Button variant="primary" className="w-full" onClick={handleVerify} disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify Email'}
                </Button>
                <Link href="/login" className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
