class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async handleRequest<T>(request: Promise<Response>): Promise<T> {
    try {
      const response = await request;
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json'
    };
  }

  public async get<T>(url: string): Promise<T> {
    const request = fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleRequest<T>(request);
  }

  public async post<T>(url: string, data?: unknown): Promise<T> {
    const request = fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return this.handleRequest<T>(request);
  }

  public async put<T>(url: string, data?: unknown): Promise<T> {
    const request = fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return this.handleRequest<T>(request);
  }

  public async delete<T>(url: string): Promise<T> {
    const request = fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleRequest<T>(request);
  }

  public async upload<T>(
    url: string, 
    formData: FormData
  ): Promise<T> {
    const request = fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      body: formData
    });

    return this.handleRequest<T>(request);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or custom instances
export default ApiClient;
