'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, CheckCircle, School } from 'lucide-react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  schoolName: z.string().min(2, 'School name is required'),
  schoolCode: z.string().min(2, 'School code is required'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', schoolName: '', schoolCode: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    try {
      z.object({ fullName: registerSchema.shape.fullName, email: registerSchema.shape.email, password: registerSchema.shape.password }).parse(formData);
      setErrors({});
      return true;
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {};
      err.errors?.forEach((e: any) => { fieldErrors[e.path[0]] = e.message; });
      setErrors(fieldErrors);
      return false;
    }
  };

  const validateStep2 = () => {
    try {
      z.object({ schoolName: registerSchema.shape.schoolName, schoolCode: registerSchema.shape.schoolCode }).parse(formData);
      setErrors({});
      return true;
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {};
      err.errors?.forEach((e: any) => { fieldErrors[e.path[0]] = e.message; });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } }
      });

      if (authError) { setErrors({ general: authError.message }); setLoading(false); return; }
      if (data.user) {
        const { error: schoolError, data: schoolData } = await supabase.from('schools').insert({
          name: formData.schoolName,
          code: formData.schoolCode.toUpperCase(),
          email: formData.email,
        }).select().single();

        if (schoolError) { setErrors({ general: schoolError.message }); setLoading(false); return; }

        const { error: userError } = await supabase.from('users').insert({
          auth_id: data.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: 'school_manager',
          school_id: schoolData.id,
        });

        if (userError) { setErrors({ general: userError.message }); setLoading(false); return; }

        setSuccess(true);
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Please check your email to verify your account. Once verified, you can sign in.</p>
          <Link href="/login"><Button variant="primary">Go to Login</Button></Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Step {step} of 2 - {step === 1 ? 'Your Information' : 'School Details'}</p>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className={`w-16 h-1.5 rounded-full transition-colors ${s === step ? 'bg-blue-600' : s < step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <Input label="Full Name" type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} error={errors.fullName} leftIcon={<User className="w-4 h-4" />} />
                <Input label="Email Address" type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} error={errors.email} leftIcon={<Mail className="w-4 h-4" />} />
                <div className="relative">
                  <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} error={errors.password} leftIcon={<Lock className="w-4 h-4" />} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-500">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </>
            ) : (
              <>
                <Input label="School Name" type="text" placeholder="Greenfield Academy" value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} error={errors.schoolName} leftIcon={<School className="w-4 h-4" />} />
                <Input label="School Code" type="text" placeholder="GFA" value={formData.schoolCode} onChange={(e) => setFormData({...formData, schoolCode: e.target.value.toUpperCase()})} error={errors.schoolCode} leftIcon={<AlertCircle className="w-4 h-4" />} />
                <p className="text-xs text-gray-500 dark:text-gray-400">This code will be used to generate student and teacher IDs (e.g., GFA-STU-2025-0001)</p>
              </>
            )}
            <div className="flex gap-3 pt-2">
              {step === 2 && <Button variant="outline" className="flex-1" type="button" onClick={() => setStep(1)}>Back</Button>}
              <Button variant="primary" className="flex-1 h-11 text-base" type="submit" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : step === 1 ? 'Continue' : 'Create Account'}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
