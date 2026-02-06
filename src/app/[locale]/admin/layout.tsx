'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/hooks/useAuth';
import Header from '@/components/layout/Header';
import { LayoutDashboard, QrCode, Package, ScanLine, Settings } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/ar/auth');
    }
  }, [isAuthenticated, router]);

  const menuItems = [
    { href: '/ar/admin', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/ar/admin/qr', icon: QrCode, label: t('qrGenerator') },
    { href: '/ar/admin/orders', icon: Package, label: t('orders') },
    { href: '/ar/admin/scan', icon: ScanLine, label: t('scan') },
    { href: '/ar/admin/services', icon: Settings, label: t('services') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <aside className="w-64 bg-white border-l border-gray-200 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
