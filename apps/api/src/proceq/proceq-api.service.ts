import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ProceqAuthService } from './proceq-auth.service';

@Injectable()
export class ProceqApiService implements OnModuleInit {
  private readonly logger = new Logger(ProceqApiService.name);
  private client!: AxiosInstance;
  private readonly PRODUCT = 'fdl';
  private readonly MAX_RETRIES = 1;
  private readonly RETRY_DELAY_MS = 1000;
  private readonly baseURL: string;

  constructor(private readonly auth: ProceqAuthService) {
    const domain = process.env.PROCEQ_REGIONAL_DOMAIN;
    if (!domain) {
      throw new Error('PROCEQ_REGIONAL_DOMAIN environment variable is not set');
    }
    this.baseURL = `https://${domain}/api/workspace/v1`;
  }

  onModuleInit() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  private async getAuthHeaders(email: string): Promise<Record<string, string>> {
    const token = await this.auth.authenticate(email);
    return {
      Authorization: `Bearer ${token.accessToken}`,
    };
  }

  private async retryableGet<T = any>(
    email: string,
    url: string,
    config?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    let lastError: Error | undefined;
    const signal: AbortSignal | undefined = config?.signal;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      // An aborted cycle (§5.3) must fail fast, not consume its retry budget.
      if (signal?.aborted) {
        throw signal.reason instanceof Error
          ? signal.reason
          : new Error('Request aborted');
      }
      try {
        const headers = await this.getAuthHeaders(email);
        return await this.client.get<T>(url, {
          ...config,
          headers: { ...config?.headers, ...headers },
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        // Cancellation is terminal — never retry an aborted request.
        if (signal?.aborted || this.isCanceled(error)) {
          throw lastError;
        }
        if (attempt < this.MAX_RETRIES) {
          this.logger.warn(
            `GET ${url} failed (attempt ${attempt + 1}/${this.MAX_RETRIES + 1}), retrying in ${this.RETRY_DELAY_MS}ms: ${lastError.message}`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.RETRY_DELAY_MS * (attempt + 1)),
          );
        }
      }
    }

    throw lastError;
  }

  private isCanceled(error: unknown): boolean {
    const e = error as { code?: string; name?: string } | null;
    return (
      !!e &&
      (e.code === 'ERR_CANCELED' ||
        e.name === 'CanceledError' ||
        e.name === 'AbortError')
    );
  }

  async getMeasurements(
    email: string,
    page?: number,
    size?: number,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<any>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const queryString = params.toString();
    return this.retryableGet(
      email,
      `/${this.PRODUCT}/measurement${queryString ? `?${queryString}` : ''}`,
      { signal },
    );
  }

  async getMeasurementDetails(
    email: string,
    measurementId: string,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<any>> {
    return this.retryableGet(
      email,
      `/${this.PRODUCT}/measurement/${measurementId}`,
      { signal },
    );
  }

  async getMeasurementAttachments(
    email: string,
    measurementId: string,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<any>> {
    return this.retryableGet(
      email,
      `/${this.PRODUCT}/measurement/${measurementId}/attachment`,
      { signal },
    );
  }

  async downloadAttachment(
    email: string,
    measurementId: string,
    attachmentId: string,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<ArrayBuffer>> {
    return this.retryableGet(
      email,
      `/${this.PRODUCT}/measurement/${measurementId}/attachment/${attachmentId}/download`,
      { responseType: 'arraybuffer', signal },
    );
  }

  async exportMeasurementData(
    email: string,
    measurementIds: string[],
    format: 'json' | 'csv' = 'json',
    signal?: AbortSignal,
  ): Promise<AxiosResponse<any>> {
    const headers = await this.getAuthHeaders(email);
    return this.client.post(
      `/${this.PRODUCT}/measurement/export`,
      { format, ids: measurementIds },
      { headers, signal },
    );
  }

  async getExportStatus(
    email: string,
    exportId: string,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<any>> {
    return this.retryableGet(
      email,
      `/${this.PRODUCT}/measurement/export/${exportId}/status`,
      { signal },
    );
  }
}
