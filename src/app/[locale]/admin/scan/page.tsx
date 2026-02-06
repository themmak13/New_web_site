'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { bagsApi } from '@/lib/api/bags';
import { useUpdateBagStatus } from '@/lib/hooks/useBags';
import QRScanner from '@/components/shared/QRScanner';
import { ScanLine, Package, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminScanPage() {
  const t = useTranslations('admin');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBag, setScannedBag] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const updateStatus = useUpdateBagStatus();

  const handleScan = async (bagTag: string) => {
    try {
      const bag = await bagsApi.getByTag(bagTag);
      setScannedBag(bag);
      setShowScanner(false);
      toast.success('تم العثور على الكيس');
    } catch (error) {
      toast.error('الكيس غير موجود');
    }
  };

  const handleUpdateStatus = async () => {
    if (!scannedBag || !selectedStatus) return;

    try {
      await updateStatus.mutateAsync({
        bagId: scannedBag.id,
        status: selectedStatus,
        note: 'تحديث من الماسح الضوئي',
      });
      setScannedBag(null);
      setSelectedStatus('');
      toast.success('تم تحديث الحالة');
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('scan')}</h1>

      <div className="card text-center py-12">
        {!scannedBag ? (
          <>
            <ScanLine size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-6">قم بمسح رمز QR على الكيس</p>
            <button
              onClick={() => setShowScanner(true)}
              className="btn-primary"
            >
              <ScanLine size={20} className="inline mr-2" />
              فتح الماسح الضوئي
            </button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Package size={48} className="text-primary-600" />
              <div className="text-right">
                <p className="text-sm text-gray-500">رقم الكيس</p>
                <p className="text-4xl font-bold text-primary-600">
                  {scannedBag.bag_tag}
                </p>
              </div>
            </div>

            <div className="card text-right">
              <h3 className="font-semibold mb-3">معلومات الطلب</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">الحالة الحالية:</span>
                  <span className="font-semibold">
                    {t(`tracking.statuses.${scannedBag.status}`)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المبلغ الإجمالي:</span>
                  <span className="font-semibold">
                    {scannedBag.total.toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-right">
                تحديث الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-4"
              >
                <option value="">اختر الحالة الجديدة</option>
                <option value="picked_up">تم الاستلام من العميل</option>
                <option value="washing">قيد الغسيل</option>
                <option value="drying">قيد التجفيف</option>
                <option value="ready">جاهز</option>
                <option value="out_for_delivery">في طريق التوصيل</option>
                <option value="delivered">تم التسليم للعميل</option>
              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={!selectedStatus || updateStatus.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Check size={20} />
                <span>تحديث الحالة</span>
              </button>
            </div>

            <button
              onClick={() => {
                setScannedBag(null);
                setSelectedStatus('');
                setShowScanner(true);
              }}
              className="btn-secondary w-full"
            >
              مسح كيس آخر
            </button>
          </div>
        )}
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
