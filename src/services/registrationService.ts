import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  AstrologerRegistrationData,
  RegistrationResponse,
} from '../types/registration';

export const registrationService = {
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
