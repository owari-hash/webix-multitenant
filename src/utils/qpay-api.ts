import { backendRequest } from './backend-api';

// ----------------------------------------------------------------------

export interface CreateInvoiceData {
  amount: number;
  currency?: string;
  description?: string;
  invoice_description?: string;
  invoice_receiver_code?: string;
  callback_url?: string;
  sender_invoice_no?: string;
}

export interface InvoiceResponse {
  invoice_id?: string;
  id?: string;
  qr_text?: string;
  qr_image?: string;
  qr_code?: string;
  invoice_status?: string;
  amount?: string | number;
  currency?: string;
  description?: string;
  terminal_id?: string;
  legacy_id?: string;
  urls?: Array<{ name?: string; link?: string; description?: string }>;
  invoice?: {
    invoice_id: string;
    qpay_invoice_id: string;
    merchant_id: string;
    amount: number;
    currency: string;
    description: string;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    qr_text?: string;
    qr_image?: string;
    qr_code?: string;
    createdAt: string;
    updatedAt: string;
  };
  data?: {
    id?: string;
    invoice_id?: string;
    qr_code?: string;
    qr_image?: string;
    qr_text?: string;
    invoice_status?: string;
    amount?: string | number;
    currency?: string;
    description?: string;
    terminal_id?: string;
    legacy_id?: string;
    urls?: Array<{ name?: string; link?: string; description?: string }>;
    invoice?: {
      invoice_id: string;
      qpay_invoice_id: string;
      merchant_id: string;
      amount: number;
      currency: string;
      description: string;
      status: 'PENDING' | 'PAID' | 'CANCELLED';
      qr_text?: string;
      qr_image?: string;
      qr_code?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface PaymentStatusResponse {
  payment_status?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  invoice_id: string;
  amount?: number;
  currency?: string;
}

export interface Invoice {
  _id?: string;
  invoice_id: string;
  qpay_invoice_id: string;
  merchant_id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  qr_text: string;
  qr_image?: string;
  qr_code?: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------

export const qpayApi = {
  /**
   * Create invoice via QPay
   */
  async createInvoice(data: CreateInvoiceData): Promise<InvoiceResponse> {
    const response = await backendRequest<InvoiceResponse>('/qpay/invoice', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to create invoice');
    }

    return response.data;
  },

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId: string) {
    const response = await backendRequest(`/qpay/invoice/${invoiceId}`, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get invoice');
    }

    return response.data;
  },

  /**
   * Cancel invoice
   */
  async cancelInvoice(invoiceId: string) {
    const response = await backendRequest(`/qpay/invoice/${invoiceId}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to cancel invoice');
    }

    return response.data;
  },

  /**
   * Check payment status
   */
  async checkPayment(invoiceId: string): Promise<PaymentStatusResponse> {
    const response = await backendRequest<PaymentStatusResponse>('/qpay/payment/check', {
      method: 'POST',
      body: JSON.stringify({ invoice_id: invoiceId }),
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to check payment status');
    }

    return response.data;
  },

  /**
   * Get all invoices
   */
  async getInvoices(params?: { status?: string; limit?: number; skip?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/qpay/invoices?${queryString}` : '/qpay/invoices';

    const response = await backendRequest<{
      invoices: Invoice[];
      total: number;
      limit: number;
      skip: number;
    }>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get invoices');
    }

    return response.data;
  },
};
