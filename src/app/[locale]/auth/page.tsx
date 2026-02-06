'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/hooks/useAuth';
import { toast } from 'sonner';
import { Send, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+966');
  const [sessionId, setSessionId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.sendOTP(phoneNumber);
      setSessionId(response.session_id);
      setDevCode(response.dev_code || null);
      setStep('otp');
      toast.success(t('otpSent'));
    } catch (error) {
      toast.error(t('invalidPhone'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.verifyOTP(sessionId, phoneNumber, otpCode);
      setAuth(response.user_id, response.phone_number);
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/ar/home');
    } catch (error) {
      toast.error(t('invalidOtp'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600">خدمة الغسيل الذكية</p>
        </div>

        <div className="card">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">
                  مثال: +966501234567
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('sendOtp')}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('otpLabel')}
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('otpPlaceholder')}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                  required
                  dir="ltr"
                  autoFocus
                />
                {devCode && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>رمز التطوير:</strong> {devCode}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>{t('verify')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                {t('resendOtp')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
