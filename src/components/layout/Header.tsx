'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/lib/hooks/useAuth';
import { authApi } from '@/lib/api/auth';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated, phoneNumber, logout } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    logout();
    router.push('/ar/auth');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600">
          {t('home.title')}
        </h1>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {isAuthenticated && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User size={16} />
                <span>{phoneNumber}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut size={16} />
                <span>{t('common.logout')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
