'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useUpdateBagStatus } from '@/lib/hooks/useBags';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Package, ChevronDown, Check } from 'lucide-react';

export default function AdminOrdersPage() {
  const t = useTranslations();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedBags, setSelectedBags] = useState<Set<string>>(new Set());
  const [batchStatus, setBatchStatus] = useState('');

  const { data: bagsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-bags', statusFilter],
    queryFn: () => adminApi.listAllBags(1, statusFilter),
  });

  const updateStatus = useUpdateBagStatus();

  const handleSelectAll = () => {
    if (selectedBags.size === bagsData?.data?.length) {
      setSelectedBags(new Set());
    } else {
      setSelectedBags(new Set(bagsData?.data?.map((b: any) => b.id)));
    }
  };

  const handleSelectBag = (bagId: string) => {
    const newSelected = new Set(selectedBags);
    if (newSelected.has(bagId)) {
      newSelected.delete(bagId);
    } else {
      newSelected.add(bagId);
    }
    setSelectedBags(newSelected);
  };

  const handleBatchUpdate = async () => {
    if (!batchStatus || selectedBags.size === 0) return;

    for (const bagId of selectedBags) {
      await updateStatus.mutateAsync({
        bagId,
        status: batchStatus,
        note: 'تحديث جماعي من لوحة الإدارة',
      });
    }

    setSelectedBags(new Set());
    refetch();
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('admin.allOrders')}</h1>
        
        {selectedBags.size > 0 && (
          <div className="flex items-center gap-4">
            <select
              value={batchStatus}
              onChange={(e) => setBatchStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">اختر الحالة</option>
              <option value="picked_up">تم الاستلام</option>
              <option value="washing">قيد الغسيل</option>
              <option value="drying">قيد التجفيف</option>
              <option value="ready">جاهز</option>
              <option value="out_for_delivery">في طريق التوصيل</option>
              <option value="delivered">تم التوصيل</option>
            </select>
            
            <button
              onClick={handleBatchUpdate}
              disabled={!batchStatus}
              className="btn-primary flex items-center gap-2"
            >
              <Check size={20} />
              <span>{t('admin.updateSelected')} ({selectedBags.size})</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter(undefined)}
          className={`px-4 py-2 rounded-lg ${
            !statusFilter ? 'bg-primary-500 text-white' : 'bg-white border'
          }`}
        >
          {t('admin.allOrders')}
        </button>
        {['dropped', 'picked_up', 'washing', 'ready', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === status ? 'bg-primary-500 text-white' : 'bg-white border'
            }`}
          >
            {t(`tracking.statuses.${status}`)}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-right">
                  <input
                    type="checkbox"
                    checked={selectedBags.size === bagsData?.data?.length}
                    onChange={handleSelectAll}
                    className="w-5 h-5"
                  />
                </th>
                <th className="p-4 text-right">{t('order.bagTag')}</th>
                <th className="p-4 text-right">{t('admin.customer')}</th>
                <th className="p-4 text-right">{t('tracking.status')}</th>
                <th className="p-4 text-right">{t('admin.totalAmount')}</th>
                <th className="p-4 text-right">{t('admin.createdAt')}</th>
                <th className="p-4 text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {bagsData?.data?.map((bag: any) => (
                <tr key={bag.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedBags.has(bag.id)}
                      onChange={() => handleSelectBag(bag.id)}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="p-4 font-mono font-bold text-primary-600">
                    {bag.bag_tag}
                  </td>
                  <td className="p-4 text-sm text-gray-600">عميل</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bag.status)}`}>
                      {t(`tracking.statuses.${bag.status}`)}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{bag.total.toFixed(2)} ر.س</td>
                  <td className="p-4 text-sm">
                    {format(new Date(bag.created_at), 'PPp', { locale: ar })}
                  </td>
                  <td className="p-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
