import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  AstrologerKycRegistrationData,
  RegistrationDocumentFile,
  RegistrationDocumentKind,
  RegistrationResponse,
} from '../types/registration';

export const registrationService = {
  async uploadDocument(
    file: RegistrationDocumentFile,
    documentType: RegistrationDocumentKind,
  ): Promise<string> {
    const documentNames: Record<RegistrationDocumentKind, string> = {
      profilePhoto: 'Profile Photo',
      panCard: 'PAN Card',
      aadhaarCard: 'Aadhaar Card',
      certificate: 'Certificate',
    };
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formData.append('documentName', documentNames[documentType]);
    formData.append('documentType', documentType);

    const {data} = await apiClient.post<{url: string}>(
      Endpoints.registration.uploadDocument,
      formData,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );
    if (typeof data.url !== 'string' || !data.url.trim()) {
      throw new Error('Document upload response did not include a URL.');
    }
    return data.url;
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
