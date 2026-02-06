'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bagsApi } from '@/lib/api/bags';
import { toast } from 'sonner';

export function useBags(status?: string) {
  return useQuery({
    queryKey: ['bags', status],
    queryFn: () => bagsApi.list(1, status),
  });
}

export function useBag(bagId: string) {
  return useQuery({
    queryKey: ['bag', bagId],
    queryFn: () => bagsApi.getById(bagId),
    enabled: !!bagId,
  });
}

export function useCreateBag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
      toast.success('تم إنشاء الطلب بنجاح');
    },
  });
}

export function useUpdateBagStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bagId,
      status,
      note,
    }: {
      bagId: string;
      status: string;
      note?: string;
    }) => bagsApi.updateStatus(bagId, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
      toast.success('تم تحديث الحالة');
    },
  });
}
