import axios from 'axios';
import {API_BASE_URL} from '../constants';
import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  AstrologerRegistrationStatus,
  AstrologerRegistrationStatusApiResponse,
  AstrologerKycRegistrationData,
  RegistrationDocumentFile,
  RegistrationDocumentKind,
  RegistrationResponse,
} from '../types/registration';

interface UploadDocumentResponse {
  status?: number;
  success?: boolean;
  data?: Array<{
    url?: unknown;
  }> | {
    url?: unknown;
  } | null;
  url?: unknown;
  message?: string;
}

function normalizeUploadedDocumentUrl(value: string): string {
  const uploadedUrl = value.trim();
  if (/^https?:\/\//i.test(uploadedUrl)) {
    const url = new URL(uploadedUrl);
    return `${url.pathname}${url.search}`;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(uploadedUrl)) {
    throw new Error('Upload response returned a non-server document URL.');
  }
  return uploadedUrl.startsWith('/') ? uploadedUrl : `/${uploadedUrl}`;
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

    const uploadedDocument = Array.isArray(response.data)
      ? response.data[0]
      : response.data;
    const url = uploadedDocument?.url ?? response.url;
    if (typeof url !== 'string' || !url.trim()) {
      console.error('[Registration] Upload response did not include a valid URL', {
        documentType,
        response,
      });
      throw new Error(
        response.message || 'Document upload response did not include a URL.',
      );
    }
    return normalizeUploadedDocumentUrl(url);
  },

  async submitKyc(
    payload: AstrologerKycRegistrationData,
  ): Promise<RegistrationResponse> {
    const {data} = await apiClient.post<RegistrationResponse>(
      Endpoints.registration.submitKyc,
      payload
      // {
      //   ...payload,
      //   profilePhotoUrl: normalizeUploadedDocumentUrl(payload.profilePhotoUrl),
      //   panCard: {
      //     ...payload.panCard,
      //     photoUrl: normalizeUploadedDocumentUrl(payload.panCard.photoUrl),
      //   },
      //   aadharCard: {
      //     ...payload.aadharCard,
      //     photoUrl: normalizeUploadedDocumentUrl(payload.aadharCard.photoUrl),
      //   },
      //   certificateUrls: payload.certificateUrls.map(
      //     normalizeUploadedDocumentUrl,
      //   ),
      // },
    );
    return data;
  },

  async getStatus(accessToken: string): Promise<AstrologerRegistrationStatus> {
    const {data: response} = await axios.get<AstrologerRegistrationStatusApiResponse>(
      `${API_BASE_URL}${Endpoints.registration.status}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 15000,
      },
    );
    if (!response.success || typeof response.data?.isKycSubmitted !== 'boolean') {
      throw new Error(response.message || 'Could not retrieve registration status.');
    }
    if (
      response.data.isKycSubmitted &&
      !['pending', 'success', 'rejected'].includes(response.data.status)
    ) {
      throw new Error('Registration status response contained an unsupported status.');
    }
    return response.data;
  },
};
