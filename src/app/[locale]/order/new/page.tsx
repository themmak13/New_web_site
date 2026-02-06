'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useCreateBag } from '@/lib/hooks/useBags';
import { locationsApi } from '@/lib/api/locations';
import apiClient from '@/lib/api/client';
import Header from '@/components/layout/Header';
import QRScanner from '@/components/shared/QRScanner';
import { QrCode, MapPin, Plus, Minus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface ServiceItem {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  price: number;
}

interface SelectedItem {
  service_item_id: string;
  quantity: number;
  name: string;
  price: number;
}

export default function NewOrderPage() {
  const t = useTranslations();
  const router = useRouter();
  const createBag = useCreateBag();

  const [step, setStep] = useState<'pickup' | 'delivery' | 'services' | 'summary'>('pickup');
  const [pickupLocationId, setPickupLocationId] = useState('');
  const [deliveryLocationId, setDeliveryLocationId] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'pickup' | 'delivery'>('pickup');
  const [createdBag, setCreatedBag] = useState<any>(null);

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: locationsApi.list,
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/v1/services/');
      return data as ServiceItem[];
    },
  });

  const handleQRScan = async (qrData: string) => {
    try {
      const location = await locationsApi.getByQR(qrData);
      if (scannerTarget === 'pickup') {
        setPickupLocationId(location.id);
        toast.success('تم تحديد موقع الاستلام');
      } else {
        setDeliveryLocationId(location.id);
        toast.success('تم تحديد موقع التسليم');
      }
      setShowScanner(false);
    } catch (error) {
      toast.error('رمز QR غير صحيح');
    }
  };

  const handleAddItem = (service: ServiceItem) => {
    const existing = selectedItems.find((item) => item.service_item_id === service.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.service_item_id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          service_item_id: service.id,
          quantity: 1,
          name: service.name_ar,
          price: service.price,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map((item) =>
          item.service_item_id === serviceId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleSubmit = async () => {
    if (!pickupLocationId || !deliveryLocationId || selectedItems.length === 0) {
      toast.error('الرجاء استكمال جميع الحقول');
      return;
    }

    try {
      const bagData = {
        pickup_location_id: pickupLocationId,
        delivery_location_id: deliveryLocationId,
        items: selectedItems.map((item) => ({
          service_item_id: item.service_item_id,
          quantity: item.quantity,
        })),
      };

      const result = await createBag.mutateAsync(bagData);
      setCreatedBag(result);
      setStep('summary');
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الطلب');
    }
  };

  const renderPickupStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">{t('order.pickupLocation')}</h2>

      <button
        onClick={() => {
          setScannerTarget('pickup');
          setShowScanner(true);
        }}
        className="w-full py-4 border-2 border-dashed border-primary-300 rounded-lg flex items-center justify-center gap-2 text-primary-600 hover:bg-primary-50 transition-colors"
      >
        <QrCode size={24} />
        <span>{t('order.scanLocationQR')}</span>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">أو اختر من القائمة</span>
        </div>
      </div>

      <div className="space-y-2">
        {locations?.map((location: any) => (
          <button
            key={location.id}
            onClick={() => setPickupLocationId(location.id)}
            className={`w-full p-4 rounded-lg border-2 text-right transition-colors ${
              pickupLocationId === location.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{location.name_ar}</p>
                <p className="text-sm text-gray-500">{location.name_en}</p>
              </div>
              {pickupLocationId === location.id && (
                <Check size={24} className="text-primary-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep('delivery')}
        disabled={!pickupLocationId}
        className="btn-primary w-full"
      >
        {t('common.next')}
      </button>
    </div>
  );

  const renderDeliveryStep = () => (
    <div className="space-y-4">
      <button
        onClick={() => setStep('pickup')}
        className="text-primary-600 hover:text-primary-700"
      >
        ← {t('common.back')}
      </button>

      <h2 className="text-xl font-bold mb-4">{t('order.deliveryLocation')}</h2>

      <button
        onClick={() => {
          setScannerTarget('delivery');
          setShowScanner(true);
        }}
        className="w-full py-4 border-2 border-dashed border-primary-300 rounded-lg flex items-center justify-center gap-2 text-primary-600 hover:bg-primary-50 transition-colors"
      >
        <QrCode size={24} />
        <span>{t('order.scanLocationQR')}</span>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">أو اختر من القائمة</span>
        </div>
      </div>

      <div className="space-y-2">
        {locations?.map((location: any) => (
          <button
            key={location.id}
            onClick={() => setDeliveryLocationId(location.id)}
            className={`w-full p-4 rounded-lg border-2 text-right transition-colors ${
              deliveryLocationId === location.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{location.name_ar}</p>
                <p className="text-sm text-gray-500">{location.name_en}</p>
              </div>
              {deliveryLocationId === location.id && (
                <Check size={24} className="text-primary-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep('services')}
        disabled={!deliveryLocationId}
        className="btn-primary w-full"
      >
        {t('common.next')}
      </button>
    </div>
  );

  const renderServicesStep = () => {
    const categories = Array.from(new Set(services?.map((s) => s.category) || []));

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep('delivery')}
          className="text-primary-600 hover:text-primary-700"
        >
          ← {t('common.back')}
        </button>

        <h2 className="text-xl font-bold mb-4">{t('order.services')}</h2>

        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {t(`order.categories.${category}`)}
            </h3>
            <div className="space-y-2">
              {services
                ?.filter((s) => s.category === category)
                .map((service) => {
                  const selected = selectedItems.find(
                    (item) => item.service_item_id === service.id
                  );
                  return (
                    <div
                      key={service.id}
                      className="card flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold">{service.name_ar}</p>
                        <p className="text-sm text-gray-500">{service.name_en}</p>
                        <p className="text-primary-600 font-semibold mt-1">
                          {service.price.toFixed(2)} ر.س
                        </p>
                      </div>

                      {selected ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(service.id, -1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-semibold w-8 text-center">
                            {selected.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(service.id, 1)}
                            className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddItem(service)}
                          className="btn-primary px-4 py-2"
                        >
                          {t('order.addItem')}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {selectedItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 -mx-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>{t('order.subtotal')}</span>
                <span>{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('order.tax')}</span>
                <span>{tax.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>{t('order.total')}</span>
                <span className="text-primary-600">{total.toFixed(2)} ر.س</span>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full">
              {t('order.confirmOrder')}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryStep = () => {
    if (!createdBag) return null;

    return (
      <div className="space-y-6 text-center">
        <div className="text-green-600 mb-4">
          <Check size={64} className="mx-auto" />
        </div>

        <h2 className="text-2xl font-bold">{t('order.orderCreated')}</h2>

        <div className="card">
          <p className="text-sm text-gray-500 mb-2">{t('order.bagTag')}</p>
          <p className="text-4xl font-bold text-primary-600 mb-6">
            {createdBag.bag_tag}
          </p>

          {createdBag.qr_code && (
            <div className="bg-white p-4 inline-block rounded-lg border-2 border-gray-200">
              <QRCodeSVG value={createdBag.bag_tag} size={200} />
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4">
            احفظ هذا الرمز لتتبع طلبك
          </p>
        </div>

        <div className="card text-right">
          <h3 className="font-semibold mb-3">ملخص الطلب</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('order.subtotal')}</span>
              <span>{createdBag.subtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('order.tax')}</span>
              <span>{createdBag.tax_amount.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>{t('order.total')}</span>
              <span className="text-primary-600">
                {createdBag.total.toFixed(2)} ر.س
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/ar/home')}
          className="btn-primary w-full"
        >
          العودة إلى الرئيسية
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {step !== 'summary' && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['pickup', 'delivery', 'services'].map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step === s
                        ? 'bg-primary-500 text-white'
                        : ['pickup', 'delivery', 'services'].indexOf(step) >
                          ['pickup', 'delivery', 'services'].indexOf(s)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        ['pickup', 'delivery', 'services'].indexOf(step) > i
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'pickup' && renderPickupStep()}
        {step === 'delivery' && renderDeliveryStep()}
        {step === 'services' && renderServicesStep()}
        {step === 'summary' && renderSummaryStep()}
      </main>

      {showScanner && (
        <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}
