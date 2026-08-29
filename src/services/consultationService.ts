import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  Consultation,
  BookConsultationRequest,
  ChatMessage,
} from '../types/consultation';

export const consultationService = {
  async book(payload: BookConsultationRequest): Promise<Consultation> {
    const {data} = await apiClient.post<Consultation>(
      Endpoints.consultations.book,
      payload,
    );
    return data;
  },

  async cancel(id: string): Promise<void> {
    await apiClient.post(Endpoints.consultations.cancel(id));
  },

  async accept(id: string): Promise<void> {
    await apiClient.post(Endpoints.consultations.accept(id));
  },

  async decline(id: string): Promise<void> {
    await apiClient.post(Endpoints.consultations.decline(id));
  },

  async end(id: string): Promise<Consultation> {
    const {data} = await apiClient.post<Consultation>(
      Endpoints.consultations.end(id),
    );
    return data;
  },

  async getActive(): Promise<Consultation | null> {
    try {
      const {data} = await apiClient.get<Consultation>(
        Endpoints.consultations.active,
      );
      return data;
    } catch {
      return null;
    }
  },

  async getHistory(page = 1): Promise<Consultation[]> {
    const {data} = await apiClient.get<Consultation[]>(
      Endpoints.consultations.history,
      {params: {page}},
    );
    return data;
  },

  async getMessages(consultationId: string): Promise<ChatMessage[]> {
    const {data} = await apiClient.get<ChatMessage[]>(
      Endpoints.chat.messages(consultationId),
    );
    return data;
  },

  async sendMessage(
    consultationId: string,
    content: string,
  ): Promise<ChatMessage> {
    const {data} = await apiClient.post<ChatMessage>(
      Endpoints.chat.send(consultationId),
      {content},
    );
    return data;
  },
};
