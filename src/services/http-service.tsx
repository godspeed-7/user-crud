import apiClient from './api-client';

interface Entity {
  id: number;
}
class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    const controller = new AbortController();

    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });

    return {
      request,
      cancel: () => controller.abort(),
    };
  }

  delete<T extends Entity>(data: T) {
    return apiClient.delete<T>(this.endpoint + '/' + data.id);
  }

  create<T>(data: T) {
    return apiClient.post<T>(this.endpoint, data);
  }

  update<T extends Entity>(data: T) {
    return apiClient.put<T>(this.endpoint + '/' + data.id, data);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;
