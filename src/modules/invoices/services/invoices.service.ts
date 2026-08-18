import { useAuthStore } from 'modules/auth/stores/auth.store';
import type {
  Invoice,
  InvoiceWithReadingMeter,
  InvoicesList,
  InvoicesListParams,
  PayInvoiceDto,
} from 'modules/invoices/types/invoice.types';
import { env } from 'shared/config/env';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';
import type { InvoicesDelinquent } from '../types/invoice.morosos.types';

const INVOICES_ENDPOINT = '/invoices';

function buildInvoicesListParams(params: InvoicesListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);

  return buildListParams(base, params.sortBy);
}

export const invoicesService = {
  findAll: (params?: InvoicesListParams) => {
    const searchParams = buildInvoicesListParams(params);
    const query = searchParams.toString();

    return httpClient.get<InvoicesList>(
      query ? `${INVOICES_ENDPOINT}?${query}` : INVOICES_ENDPOINT,
    );
  },

  findOne: (id: string) => httpClient.get<InvoiceWithReadingMeter>(`${INVOICES_ENDPOINT}/${id}`),

  payInvoice: (id: string, payload: PayInvoiceDto) =>
    httpClient.patch<Invoice>(`${INVOICES_ENDPOINT}/${id}/pay`, payload),

  getMorosos: () => httpClient.get<InvoicesDelinquent>(`${INVOICES_ENDPOINT}/morosos/months-back`),

  runMorososCheck: () => httpClient.post<unknown>(`${INVOICES_ENDPOINT}/morosos/check`), // TODO: Tipar

  getInvoicePdfBlobUrl: async (id: string) => {
    const token = useAuthStore.getState().tokens?.accessToken;
    // Note: URL includes /v1 based on the env setup typically, but env.API_URL is the base.
    const url = `${env.API_URL}${INVOICES_ENDPOINT}/${id}/pdf`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el PDF de la factura');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
} as const;
