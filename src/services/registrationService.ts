import axios from 'axios';
import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  AstrologerKycRegistrationData,
  RegistrationDocumentFile,
  RegistrationDocumentKind,
  RegistrationResponse,
} from '../types/registration';

interface UploadDocumentResponse {
  status?: number;
  success?: boolean;
  data?: {
    url?: unknown;
  };
  url?: unknown;
  message?: string;
}

export const registrationService = {
  async uploadDocument(
    file: RegistrationDocumentFile,
    documentType: RegistrationDocumentKind,
  ): Promise<string> {
    const documentNames: Record<RegistrationDocumentKind, string> = {
      profilePhoto: 'Profile Photo',
      panPhoto: 'PAN Card',
      aadharPhoto: 'Aadhaar Card',
      certificate: 'Certificate',
      other: 'Other',
    };
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formData.append('documentName', documentNames[documentType]);
    formData.append('documentType', documentType);

    let response: UploadDocumentResponse;
    try {
      ({data: response} = await apiClient.post<UploadDocumentResponse>(
        Endpoints.registration.uploadDocument,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      ));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[Registration] Document upload request failed', {
          documentType,
          status: error.response?.status,
          response: error.response?.data,
          code: error.code,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        });
      } else {
        console.error('[Registration] Document upload failed', {
          documentType,
          error,
        });
      }
      throw error;
    }

    const url = response.data?.url ?? response.url;
    if (typeof url !== 'string' || !url.trim()) {
      console.error('[Registration] Upload response did not include a valid URL', {
        documentType,
        response,
      });
      throw new Error(
        response.message || 'Document upload response did not include a URL.',
      );
    }
    return url;
  },

  async submitKyc(
    payload: AstrologerKycRegistrationData,
  ): Promise<RegistrationResponse> {
    const {data} = await apiClient.post<RegistrationResponse>(
      Endpoints.registration.submitKyc,
      payload,
    );
    return data;
  },

  async getStatus(): Promise<RegistrationResponse> {
    const {data} = await apiClient.get<RegistrationResponse>(
      Endpoints.registration.status,
    );
    return data;
  },
};
