'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBags } from '@/lib/hooks/useBags';
import Header from '@/components/layout/Header';
import { Package, Clock, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function TrackPage() {
  const t = useTranslations();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const { data: bagsData, isLoading } = useBags(statusFilter);

  const statusCounts = {
    all: bagsData?.total || 0,
    created: 0,
    dropped: 0,
    washing: 0,
    ready: 0,
    delivered: 0,
  };

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
        <h1 className="text-3xl font-bold mb-6">{t('tracking.title')}</h1>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              !statusFilter
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            الكل ({statusCounts.all})
          </button>
          {['dropped', 'washing', 'ready', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {t(`tracking.statuses.${status}`)}
            </button>
          ))}
        </div>

        {/* Orders List */}
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
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Package size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('order.bagTag')}
                      </p>
                      <p className="text-xl font-bold text-primary-600">
                        {bag.bag_tag}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock size={14} />
                        <span>
                          {format(new Date(bag.created_at), 'PPp', { locale: ar })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-400" />
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      bag.status
                    )}`}
                  >
                    {t(`tracking.statuses.${bag.status}`)}
                  </span>
                  <span className="text-lg font-semibold">
                    {bag.total.toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">لا توجد طلبات</p>
          </div>
        )}
      </main>
    </div>
  );
}
