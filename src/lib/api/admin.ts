import apiClient from './client';

export interface LocationCreate {
  name_ar: string;
  name_en: string;
  address_ar?: string;
  address_en?: string;
}

export const adminApi = {
  createLocation: async (data: LocationCreate) => {
    const { data: response } = await apiClient.post(
      '/api/v1/admin/locations',
      data
    );
    return response;
  },

  listAllBags: async (page = 1, status?: string) => {
    const { data } = await apiClient.get('/api/v1/admin/bags', {
      params: { page, page_size: 50, status },
    });
    return data;
  },

  createService: async (data: {
    name_ar: string;
    name_en: string;
    category: string;
    price: number;
    display_order: number;
  }) => {
    const { data: response } = await apiClient.post(
      '/api/v1/admin/services',
      data
    );
    return response;
  },
};
