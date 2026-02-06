'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

export default function QRGeneratorPage() {
  const t = useTranslations('admin');
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    address_ar: '',
    address_en: '',
  });
  
  const [createdLocation, setCreatedLocation] = useState<any>(null);

  const createLocation = useMutation({
    mutationFn: adminApi.createLocation,
    onSuccess: (data) => {
      setCreatedLocation(data);
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('تم إنشاء الموقع بنجاح');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLocation.mutateAsync(formData);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `location-${createdLocation.id}.png`;
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('qrGenerator')}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">{t('createLocation')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('locationNameAr')}
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('locationNameEn')}
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('addressAr')}
              </label>
              <textarea
                value={formData.address_ar}
                onChange={(e) => setFormData({ ...formData, address_ar: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('addressEn')}
              </label>
              <textarea
                value={formData.address_en}
                onChange={(e) => setFormData({ ...formData, address_en: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={createLocation.isPending}
              className="btn-primary w-full"
            >
              {createLocation.isPending ? 'جاري الإنشاء...' : t('generateQR')}
            </button>
          </form>
        </div>

        {createdLocation && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">رمز QR للموقع</h2>
            
            <div className="text-center space-y-4">
              <div className="bg-white p-8 inline-block rounded-lg border-2">
                <QRCodeSVG
                  value={createdLocation.id}
                  size={300}
                  level="H"
                  includeMargin
                />
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg mb-1">
                  {createdLocation.name_ar}
                </p>
                <p className="text-sm text-gray-600" dir="ltr">
                  {createdLocation.name_en}
                </p>
                {createdLocation.address_ar && (
                  <p className="text-sm text-gray-500 mt-2">
                    {createdLocation.address_ar}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>{t('downloadQR')}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Printer size={20} />
                  <span>{t('printQR')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
