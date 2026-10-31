import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';

type AstrologerRegistrationData = Record<string, unknown>;
type RegistrationDocumentFile = {
  uri: string;
  name: string;
  type: string;
};
type RegistrationDocumentKind = string;
type RegistrationResponse = Record<string, unknown>;

export const registrationService = {
  async uploadDocument(
    file: RegistrationDocumentFile,
    documentType: RegistrationDocumentKind,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
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

  async submit(
    payload: AstrologerRegistrationData,
  ): Promise<RegistrationResponse> {
    const {data} = await apiClient.post<RegistrationResponse>(
      Endpoints.registration.submit,
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
