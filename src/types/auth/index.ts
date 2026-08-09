export interface RequestOtpPayload {
  email: string;
}

export interface RequestOtpResponse {
  message: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface LogoutPayload {
  refresh_token: string;
}

