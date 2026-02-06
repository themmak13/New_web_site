'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/hooks/useAuth';
import { useBags } from '@/lib/hooks/useBags';
import Header from '@/components/layout/Header';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: bagsData, isLoading } = useBags();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/ar/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      created: 'bg-blue-100 text-blue-800',
      dropped: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-purple-100 text-purple-800',
      washing: 'bg-indigo-100 text-indigo-800',
      drying: 'bg-cyan-100 text-cyan-800',
      ready: 'bg-green-100 text-green-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/ar/order/new')}
            className="card hover:shadow-lg transition-shadow flex flex-col items-center justify-center py-8 bg-primary-500 text-white"
          >
            <Plus size={48} className="mb-3" />
            <span className="text-lg font-semibold">{t('home.newOrder')}</span>
          </button>

          <button
            onClick={() => router.push('/ar/track')}
            className="card hover:shadow-lg transition-shadow flex flex-col items-center justify-center py-8"
          >
            <Package size={48} className="mb-3 text-primary-600" />
            <span className="text-lg font-semibold">{t('home.trackOrders')}</span>
          </button>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('home.recentOrders')}</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : bagsData?.data?.length > 0 ? (
            <div className="space-y-4">
              {bagsData.data.map((bag: any) => (
                <div
                  key={bag.id}
                  onClick={() => router.push(`/ar/order/${bag.id}`)}
                  className="card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t('order.bagTag')}
                      </p>
                      <p className="text-xl font-bold text-primary-600">
                        {bag.bag_tag}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        bag.status
                      )}`}
                    >
                      {t(`tracking.statuses.${bag.status}`)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        {format(new Date(bag.created_at), 'PPp', { locale: ar })}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {bag.total.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">{t('home.noOrders')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
