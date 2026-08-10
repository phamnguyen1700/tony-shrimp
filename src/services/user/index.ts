import { endpoints } from "@/config/endpoints";
import { apiClient } from "@/config/api";
import type {
  AddressOptions,
  AddressLocalityCheckQuery,
  AddressLocalityCheckResponse,
  AddressSuburbsQuery,
  AddressSuburbsResponse,
  AuthUser,
  CreateUserAddressPayload,
  UpdateUserAddressPayload,
  UpdateUserProfilePayload,
  UserAddress,
  UserProfile,
} from "@/types/user";

export const userService = {
  async getCurrentUser() {
    const response = await apiClient.get<AuthUser>(endpoints.auth.me);
    return response.data;
  },

  async getUserProfile() {
    const response = await apiClient.get<UserProfile>(endpoints.user.me);
    return response.data;
  },

  async updateUserProfile(payload: UpdateUserProfilePayload) {
    const response = await apiClient.patch<UserProfile>(endpoints.user.me, payload);
    return response.data;
  },

  async getAddressOptions() {
    const response = await apiClient.get<AddressOptions>(endpoints.user.addressOptions);
    return response.data;
  },

  async suggestAddressSuburbs(query: AddressSuburbsQuery) {
    const response = await apiClient.get<AddressSuburbsResponse>(endpoints.user.addressSuburbs, {
      params: query,
    });
    return response.data;
  },

  async checkAddressLocality(query: AddressLocalityCheckQuery) {
    const response = await apiClient.get<AddressLocalityCheckResponse>(
      endpoints.user.checkAddressLocality,
      { params: query },
    );
    return response.data;
  },

  async listAddresses() {
    const response = await apiClient.get<UserAddress[]>(endpoints.user.addresses);
    return response.data;
  },

  async createAddress(payload: CreateUserAddressPayload) {
    const response = await apiClient.post<UserAddress>(endpoints.user.addresses, payload);
    return response.data;
  },

  async updateAddress(addressId: string, payload: UpdateUserAddressPayload) {
    const response = await apiClient.patch<UserAddress>(endpoints.user.address(addressId), payload);
    return response.data;
  },

  async deleteAddress(addressId: string) {
    await apiClient.delete<void>(endpoints.user.address(addressId));
  },

  async setDefaultAddress(addressId: string) {
    const response = await apiClient.patch<UserAddress>(endpoints.user.setDefaultAddress(addressId));
    return response.data;
  },
};
