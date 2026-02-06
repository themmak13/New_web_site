'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBag } from '@/lib/hooks/useBags';
import Header from '@/components/layout/Header';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const { data: bag, isLoading } = useBag(params.orderId as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!bag) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-500">الطلب غير موجود</p>
          </div>
        </div>
      </div>
    );
  }

  const statusOrder = [
    'created',
    'dropped',
    'picked_up',
    'washing',
    'drying',
    'ready',
    'out_for_delivery',
    'delivered',
  ];
  const currentStatusIndex = statusOrder.indexOf(bag.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>{t('common.back')}</span>
        </button>

        {/* QR Code Card */}
        <div className="card text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">{t('order.bagTag')}</p>
          <p className="text-4xl font-bold text-primary-600 mb-6">
            {bag.bag_tag}
          </p>

          {bag.qr_code && (
            <div className="bg-white p-4 inline-block rounded-lg border-2 border-gray-200 mb-4">
              <QRCodeSVG value={bag.bag_tag} size={200} />
            </div>
          )}

          <p className="text-sm text-gray-600">
            {format(new Date(bag.created_at), 'PPp', { locale: ar })}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-6">{t('tracking.timeline')}</h3>

          <div className="space-y-6">
            {bag.events?.map((event: any, index: number) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </div>
                  {index < bag.events.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                  )}
                </div>

                <div className="flex-1 pb-6">
                  <p className="font-semibold">
                    {t(`tracking.statuses.${event.status}`)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.created_at), 'PPp', { locale: ar })}
                  </p>
                  {event.note && (
                    <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>

          <div className="space-y-3 mb-4">
            {bag.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity} × خدمة
                </span>
                <span>{item.total_price.toFixed(2)} ر.س</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('order.subtotal')}</span>
              <span>{bag.subtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('order.tax')}</span>
              <span>{bag.tax_amount.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>{t('order.total')}</span>
              <span className="text-primary-600">
                {bag.total.toFixed(2)} ر.س
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
