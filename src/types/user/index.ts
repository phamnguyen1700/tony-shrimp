export type UserRole = "customer" | "staff" | "admin" | "owner";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole | string;
  status?: "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends AuthUser {
  full_name: string | null;
  phone: string | null;
}

export interface UpdateUserProfilePayload {
  full_name?: string | null;
  phone?: string | null;
}

export interface UserAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2: string | null;
  suburb: string;
  state: string;
  postcode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserAddressPayload {
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2?: string | null;
  suburb: string;
  state: string;
  postcode: string;
  is_default?: boolean;
}

export type UpdateUserAddressPayload = Partial<CreateUserAddressPayload>;

export interface AddressOptions {
  states: string[];
  suburbs: string[];
}

export interface AddressSuburbSuggestion {
  suburb: string;
  state: string;
  postcode: string;
}

export interface AddressSuburbsQuery {
  search: string;
}

export interface AddressSuburbsResponse {
  items: AddressSuburbSuggestion[];
  source: "australian_suburbs" | string;
  message: string | null;
}

export interface AddressLocalityCheckQuery {
  suburb: string;
  postcode: string;
}

export interface AddressLocalityCheckResponse {
  found: boolean;
  suburb: string;
  postcode: string;
  source: "australian_suburbs" | string;
  message: string | null;
}
