import apiClient from './client';

export interface Location {
  id: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
}

export const locationsApi = {
  list: async (): Promise<Location[]> => {
    const { data } = await apiClient.get('/api/v1/locations/');
    return data;
  },

  getById: async (locationId: string) => {
    const { data } = await apiClient.get(`/api/v1/locations/${locationId}`);
    return data;
  },

  getByQR: async (qrData: string) => {
    const { data } = await apiClient.get(`/api/v1/locations/qr/${qrData}`);
    return data;
  },
};
