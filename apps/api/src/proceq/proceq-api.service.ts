import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ProceqAuthService } from './proceq-auth.service';

@Injectable()
export class ProceqApiService implements OnModuleInit {
  private readonly logger = new Logger(ProceqApiService.name);
  private client: AxiosInstance;
  private readonly PRODUCT = 'fdl';
  private readonly MAX_RETRIES = 1;
  private readonly RETRY_DELAY_MS = 1000;
  private readonly baseURL: string;

  constructor(private readonly auth: ProceqAuthService) {
    const domain = process.env.PROCEQ_REGIONAL_DOMAIN;
    if (!domain) {
      throw new Error(
        'PROCEQ_REGIONAL_DOMAIN environment variable is not set',
      );
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

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.auth.authenticate();
    return {
      Authorization: `Bearer ${token.accessToken}`,
    };
  }

  private async retryableGet<T = any>(
    url: string,
    config?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const headers = await this.getAuthHeaders();
        return await this.client.get<T>(url, {
          ...config,
          headers: { ...config?.headers, ...headers },
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
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

  async getMeasurements(
    page?: number,
    size?: number,
  ): Promise<AxiosResponse<any>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const queryString = params.toString();
    return this.retryableGet(
      `/${this.PRODUCT}/measurement${queryString ? `?${queryString}` : ''}`,
    );
  }

  async getMeasurementDetails(
    measurementId: string,
  ): Promise<AxiosResponse<any>> {
    return this.retryableGet(
      `/${this.PRODUCT}/measurement/${measurementId}`,
    );
  }

  async getMeasurementAttachments(
    measurementId: string,
  ): Promise<AxiosResponse<any>> {
    return this.retryableGet(
      `/${this.PRODUCT}/measurement/${measurementId}/attachment`,
    );
  }

  async downloadAttachment(
    measurementId: string,
    attachmentId: string,
  ): Promise<AxiosResponse<ArrayBuffer>> {
    return this.retryableGet(
      `/${this.PRODUCT}/measurement/${measurementId}/attachment/${attachmentId}/download`,
      { responseType: 'arraybuffer' },
    );
  }

  async exportMeasurementData(
    measurementIds: string[],
    format: 'json' | 'csv' = 'json',
  ): Promise<AxiosResponse<any>> {
    const headers = await this.getAuthHeaders();
    return this.client.post(
      `/${this.PRODUCT}/measurement/export`,
      { format, ids: measurementIds },
      { headers },
    );
  }

  async getExportStatus(exportId: string): Promise<AxiosResponse<any>> {
    return this.retryableGet(
      `/${this.PRODUCT}/measurement/export/${exportId}/status`,
    );
  }
}

