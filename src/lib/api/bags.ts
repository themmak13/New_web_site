import apiClient from './client';

export interface BagItem {
  service_item_id: string;
  quantity: number;
}

export interface BagCreate {
  pickup_location_id: string;
  delivery_location_id: string;
  items: BagItem[];
}

export interface BagResponse {
  id: string;
  bag_tag: string;
  qr_code: string | null;
  status: string;
  pickup_location_id: string | null;
  delivery_location_id: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  created_at: string;
  dropped_at: string | null;
  items: Array<{
    id: string;
    service_item_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export interface BagDetailResponse extends BagResponse {
  events: Array<{
    id: string;
    status: string;
    note: string | null;
    created_at: string;
  }>;
}

export const bagsApi = {
  create: async (data: BagCreate): Promise<BagResponse> => {
    const { data: response } = await apiClient.post('/api/v1/bags/', data);
    return response;
  },

  list: async (page = 1, status?: string) => {
    const { data } = await apiClient.get('/api/v1/bags/', {
      params: { page, page_size: 20, status },
    });
    return data;
  },

  getById: async (bagId: string): Promise<BagDetailResponse> => {
    const { data } = await apiClient.get(`/api/v1/bags/${bagId}`);
    return data;
  },

  getByTag: async (bagTag: string): Promise<BagDetailResponse> => {
    const { data } = await apiClient.get(`/api/v1/bags/tag/${bagTag}`);
    return data;
  },

  updateStatus: async (bagId: string, status: string, note?: string) => {
    const { data } = await apiClient.patch(`/api/v1/bags/${bagId}/status`, {
      status,
      note,
    });
    return data;
  },

  updateLocations: async (
    bagId: string,
    pickup_location_id?: string,
    delivery_location_id?: string
  ) => {
    const { data } = await apiClient.patch(`/api/v1/bags/${bagId}/locations`, {
      pickup_location_id,
      delivery_location_id,
    });
    return data;
  },
};
