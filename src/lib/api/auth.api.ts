import { User } from '../../types';
import { UniTraceStorage } from '../storage';
import { apiRequest, removeAuthToken, setAuthToken } from './client';
import {
  BackendRegisterRequest,
  BackendRegisterResponse,
  BackendRegistrationVerificationResponse,
  BackendTokenResponse,
  BackendUserSummary,
  BackendVerifyRegistrationRequest,
} from './backend.types';
import { adaptUser } from './adapters';

export interface RegisterRequest {
  fullName: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface VerificationResponse {
  email: string;
  message: string;
}

const REGISTRATION_TOKEN_KEY = 'unitrace_registration_token';

const splitName = (fullName: string): { firstName: string; lastName?: string } => {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : undefined,
  };
};

const getRegistrationToken = (): string | null => {
  return sessionStorage.getItem(REGISTRATION_TOKEN_KEY);
};

const clearRegistrationToken = (): void => {
  sessionStorage.removeItem(REGISTRATION_TOKEN_KEY);
};

export const authApi = {
  async register(req: RegisterRequest): Promise<RegistrationResponse> {
    if (!req.email.toLowerCase().endsWith('@lpu.in')) {
      throw new Error('Registration requires a valid university email domain (@lpu.in).');
    }

    const registrationNumber = Number(req.registrationNumber.trim());
    if (!Number.isSafeInteger(registrationNumber) || registrationNumber <= 0) {
      throw new Error('Please enter a valid university registration number.');
    }

    if (!/^\d{10}$/.test(req.phoneNumber.trim())) {
      throw new Error('Please enter a valid 10-digit phone number.');
    }

    const { firstName, lastName } = splitName(req.fullName);
    const payload: BackendRegisterRequest = {
      firstName,
      lastName,
      registrationNumber,
      uniEmail: req.email.trim().toLowerCase(),
      phoneNumber: req.phoneNumber.trim(),
      password: req.password,
    };
    const response = await apiRequest<BackendRegisterResponse>(
      '/auth/registration/initiation',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    sessionStorage.setItem(REGISTRATION_TOKEN_KEY, response.token);
    return {
      success: true,
      message: `Verification code sent. It expires in ${response.otpTtlMinutes} minutes.`,
      email: response.uniEmail,
    };
  },

  async verifyOtp(req: VerifyOtpRequest): Promise<VerificationResponse> {
    const token = getRegistrationToken();
    if (!token) {
      throw new Error('Registration session expired. Please register again.');
    }

    const payload: BackendVerifyRegistrationRequest = {
      uniEmail: req.email.trim().toLowerCase(),
      token,
      otp: req.otp.trim(),
    };
    const response = await apiRequest<BackendRegistrationVerificationResponse>(
      '/auth/registration/verification',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    clearRegistrationToken();
    return { email: response.uniEmail, message: response.message };
  },

  async login(req: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<BackendTokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        uniEmail: req.email.trim().toLowerCase(),
        password: req.password,
      }),
    });

    setAuthToken(response.accessToken);
    try {
      const profile = await apiRequest<BackendUserSummary>('/users/me');
      const user = adaptUser(profile);
      UniTraceStorage.setCurrentUser(user);
      return { accessToken: response.accessToken, user };
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!localStorage.getItem('unitrace_jwt_token')) {
      return null;
    }

    const profile = await apiRequest<BackendUserSummary>('/users/me');
    const user = adaptUser(profile);
    UniTraceStorage.setCurrentUser(user);
    return user;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
      UniTraceStorage.removeCurrentUser();
      clearRegistrationToken();
    }
  },
};
